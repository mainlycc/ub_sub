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
    
    // Dla obu typów ubezpieczenia ustawiam ten sam kod produktu
    const productCode = '5_DCGAP_MG25_GEN';
    const productName = 'DEFEND Gap MAX AC';
    
    safeLog.log(`Wybrany typ ubezpieczenia: ${type}, kod produktu: ${productCode}`);
    
    // Ustawiamy stałą datę zakupu
    const purchasedOn = "2023-02-02";
    
    // Przygotuj dane do kalkulacji zgodnie ze specyfikacją
    const calculationData = {
      sellerNodeCode: getSellerNodeCode(),
      productCode: productCode,
      saleInitiatedOn: "2025-04-14",
      
      vehicleSnapshot: {
        purchasedOn: purchasedOn,
        modelCode: "91",
        categoryCode: "PC",
        usageCode: "STANDARD",
        mileage: 10000,
        firstRegisteredOn: "2023-02-03T07:38:46+02:00",
        evaluationDate: "2025-04-14",
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
      },
      
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
      return NextResponse.json({
        success: true,
        premium: premiumAmount,
        details: {
          productName: responseData.productName || productName,
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