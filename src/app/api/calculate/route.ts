import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { getCurrentEnvironment } from '@/lib/environment';
import { getSellerNodeCode } from '@/lib/seller';

// Dodajemy interfejs dla violation
interface ValidationViolation {
  propertyPath: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parsowanie danych z zapytania
    const reqData = await request.json();
    console.log('Dane wejściowe od formularza:', reqData);
    const { price, months, type } = reqData;
    
    // Dla obu typów ubezpieczenia ustawiam ten sam kod produktu
    const productCode = '5_DCGAP_MG25_GEN';
    const productName = 'DEFEND Gap MAX AC';
    
    console.log(`Wybrany typ ubezpieczenia: ${type}, kod produktu: ${productCode}`);
    
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
    
    // Wyświetl dane wysyłane do API
    console.log('Dane wysyłane do API:', JSON.stringify(calculationData, null, 2));
    
    // Pobieramy token autoryzacyjny
    const token = await getAuthToken();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu JWT' },
        { status: 401 }
      );
    }

    console.log('Token JWT otrzymany, wysyłam żądanie do API');

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

    console.log('Status odpowiedzi z API:', apiResponse.status, apiResponse.statusText);
    
    // Pobieramy odpowiedź jako tekst, aby móc ją zalogować w przypadku błędu
    const responseText = await apiResponse.text();
    console.log('Odpowiedź z API (surowa):', responseText);
    
    try {
      // Próbujemy sparsować odpowiedź jako JSON
      const responseData = JSON.parse(responseText);
      console.log('Odpowiedź z API (JSON):', JSON.stringify(responseData, null, 2));
      
      if (!apiResponse.ok) {
        console.error('API odpowiedziało błędem:', responseText);
        
        // Jeśli mamy błędy walidacji (422), formatujemy je w czytelny sposób
        if (apiResponse.status === 422 && responseData.violations) {
          const errors = responseData.violations.map((v: ValidationViolation) => 
            `${v.propertyPath}: ${v.message}`
          ).join('\n');
          
          console.log('Znaleziono błędy walidacji:', errors);
          
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
      
      console.log('Przeliczona wartość składki:', premiumAmount);
      
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
      console.error('Nie udało się sparsować odpowiedzi:', responseText, 'Błąd:', error);
      return NextResponse.json(
        { error: 'Otrzymano nieprawidłową odpowiedź z API' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Błąd podczas kalkulacji:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    return NextResponse.json(
      { error: errorMessage || 'Wystąpił błąd podczas kalkulacji' },
      { status: 500 }
    );
  }
} 