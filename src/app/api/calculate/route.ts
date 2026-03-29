import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { getCurrentEnvironment } from '@/lib/environment';
import { getSellerNodeCode } from '@/lib/seller';
import { safeLog } from '@/lib/logger';
import { calculateSchema, validateRequest } from '@/lib/validations';

// Dodajemy interfejs dla violation
interface ValidationViolation {
  propertyPath: string;
  message: string;
}

const WARSAW_TZ = 'Europe/Warsaw';

/** Data kalendarzowa YYYY-MM-DD w strefie Europe/Warsaw (zgodna z „dziś” użytkownika w PL). */
function ymdInWarsaw(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: WARSAW_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/** Data sprzed `daysBack` dni (południe lokalne serwera, potem format PL) — stabilniejsze przy DST. */
function calendarDaysAgo(daysBack: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - daysBack);
  return d;
}

export async function POST(request: NextRequest) {
  try {
    // Parsowanie danych z zapytania
    const reqData = await request.json();
    
    // Walidacja danych wejściowych
    const validation = await validateRequest(calculateSchema, reqData);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane wejściowe', details: validation.errors },
        { status: 400 }
      );
    }
    
    const { price, months, type } = validation.data;
    safeLog.log('Dane wejściowe od formularza (z maskowaniem):', validation.data);
    
    // Dobór produktu zależnie od wyboru na froncie:
    // - casco (AC) -> 5_DCGAP_MG25_GEN
    // - fakturowy   -> 5_DCGAP_M25_GEN
    const isCasco = type === 'casco';
    const productCode = isCasco ? '5_DCGAP_MG25_GEN' : '5_DCGAP_M25_GEN';
    const productName = isCasco ? 'DEFEND Gap MAX AC' : 'DEFEND Gap MAX';
    
    safeLog.log(`Wybrany typ ubezpieczenia: ${type}, kod produktu: ${productCode}`);
    
    // Daty pod reguły API:
    // - Fakturowy (M25): zakup „niedawno” (≤180 dni), bez evaluationDate.
    // - Casco AC (MG25): późna sprzedaż (>180 dni od zakupu), evaluationDate = dzień inicjacji — saleInitiatedOn musi być „aktualny” (okno -14/+180 dni).
    const saleInitiatedOn = ymdInWarsaw(new Date());
    const purchaseAt = calendarDaysAgo(isCasco ? 200 : 60);
    const purchasedOn = ymdInWarsaw(purchaseAt);
    const firstRegAt = new Date(purchaseAt);
    firstRegAt.setDate(firstRegAt.getDate() + 1);
    const firstRegisteredOn = `${ymdInWarsaw(firstRegAt)}T07:38:46+02:00`;

    const vehicleSnapshot = {
      purchasedOn,
      modelCode: "91",
      categoryCode: "PC",
      usageCode: "STANDARD",
      mileage: 10000,
      firstRegisteredOn,
      ...(isCasco ? { evaluationDate: saleInitiatedOn } : {}),
      purchasePrice: Math.round(price * 100), // Konwersja z PLN na grosze
      purchasePriceNet: Math.round(price * 100),
      purchasePriceVatReclaimableCode: "NO",
      usageTypeCode: "INDIVIDUAL",
      purchasePriceInputType: "VAT_INAPPLICABLE",
      vin: "12131231231313132",
      vrm: "21121212",
      owners: [
        {
          contact: {
            inheritFrom: "policyHolder"
          }
        }
      ]
    };
    
    // Przygotuj dane do kalkulacji zgodnie ze specyfikacją
    const calculationData = {
      sellerNodeCode: getSellerNodeCode(),
      productCode: productCode,
      saleInitiatedOn,
      
      vehicleSnapshot,
      
      options: {
        TERM: `T_${months}`,
        CLAIM_LIMIT: "CL_50000",
        PAYMENT_TERM: "PT_LS",
        PAYMENT_METHOD: "PM_PBC"
      }
    };
    
    // Wyświetl dane wysyłane do API (z maskowaniem)
    safeLog.log('Dane wysyłane do API:', calculationData);
    
    // Pobieramy token autoryzacyjny
    // getAuthToken() potrafi rzucać wyjątkiem (np. 401 Invalid credentials),
    // więc mapujemy to na poprawny kod HTTP zamiast 500.
    let token: string | null = null;
    try {
      token = await getAuthToken();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Błąd autoryzacji';
      safeLog.error('Błąd autoryzacji (getAuthToken):', msg);
      return NextResponse.json(
        { error: msg },
        { status: 401 }
      );
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu JWT' },
        { status: 401 }
      );
    }

    safeLog.log('Token JWT otrzymany, wysyłam żądanie do API');

    const environment = getCurrentEnvironment();
    // Wysyłamy żądanie do API
    const apiResponse = await fetch(`${environment.apiUrl}/policies/creation/calculate-offer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: JSON.stringify(calculationData),
    });

    safeLog.log('Status odpowiedzi z API:', apiResponse.status, apiResponse.statusText);
    
    // Pobieramy odpowiedź jako tekst, aby móc ją zalogować w przypadku błędu
    const responseText = await apiResponse.text();
    safeLog.log('Odpowiedź z API (z maskowaniem):', responseText.substring(0, 200));
    
    try {
      // Próbujemy sparsować odpowiedź jako JSON
      const responseData = JSON.parse(responseText);
      safeLog.log('Odpowiedź z API (JSON, z maskowaniem):', responseData);
      
      if (!apiResponse.ok) {
        safeLog.error('API odpowiedziało błędem:', responseText.substring(0, 200));
        
        // Jeśli mamy błędy walidacji (422), formatujemy je w czytelny sposób
        if (apiResponse.status === 422 && responseData.violations) {
          const errors = responseData.violations.map((v: ValidationViolation) => 
            `${v.propertyPath}: ${v.message}`
          ).join('\n');
          
          safeLog.log('Znaleziono błędy walidacji:', errors);
          
          return NextResponse.json(
            { error: `Błędy walidacji:\n${errors}` },
            { status: 422 }
          );
        }

        return NextResponse.json(
          { error: responseData.message || responseData.detail || 'Błąd podczas komunikacji z API' },
          { status: apiResponse.status }
        );
      }

      // Konwersja ceny z wartości w groszach (np. 235000 -> 2350.00)
      const premiumAmount = responseData.premiumSuggested 
        ? Math.round((responseData.premiumSuggested / 100) * 100) / 100 
        : 0;
      
      safeLog.log('Przeliczona wartość składki:', premiumAmount);
      
      // Przygotowanie odpowiedzi w oczekiwanym formacie
      // Nazwa z API bywa niespójna z wysłanym productCode — pokazujemy produkt zgodny z żądaniem.
      const displayProductName =
        responseData.productCode === productCode && responseData.productName
          ? responseData.productName
          : productName;

      return NextResponse.json({
        success: true,
        premium: premiumAmount,
        details: {
          productName: displayProductName,
          coveragePeriod: `${months} miesięcy`,
          vehicleValue: price,
          maxCoverage: "50 000 PLN"
        }
      });

    } catch (error) {
      safeLog.error('Nie udało się sparsować odpowiedzi:', error);
      return NextResponse.json(
        { error: 'Otrzymano nieprawidłową odpowiedź z API' },
        { status: 500 }
      );
    }

  } catch (error) {
    safeLog.error('Błąd podczas kalkulacji:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    return NextResponse.json(
      { error: errorMessage || 'Wystąpił błąd podczas kalkulacji' },
      { status: 500 }
    );
  }
} 