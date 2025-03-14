import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Pobranie tokenu JWT
    console.log('Rozpoczynam proces autoryzacji...');
    const authToken = await getAuthToken();
    
    if (!authToken) {
      console.error('Błąd autoryzacji: brak tokenu JWT');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - brak tokenu JWT' },
        { status: 401 }
      );
    }
    
    console.log('Autoryzacja zakończona sukcesem - token JWT otrzymany');
    
    // Parsowanie danych z zapytania
    const reqData = await request.json();
    const { price, year, months, type } = reqData;
    
    // Format daty YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Odpowiednie kody produktów zgodne z dokumentacją
    // 5_DCGAP_F25_GEN dla fakturowego, 5_DCGAP_MG25_GEN dla MAX
    const productCode = type === 'fakturowy' ? "5_DCGAP_F25_GEN" : "5_DCGAP_MG25_GEN";
    
    // Pełny format daty rejestracji (wraz z godziną)
    // Używamy pierwszego dnia roku z podanego roku i dodajemy godzinę 
    const registrationDate = `${year}-01-01T00:00:00+02:00`;
    
    // Przygotuj dane do kalkulacji zgodnie z przykładowym JSON
    const calculationData = {
      sellerNodeCode: "PL_TEST_GAP_25",
      productCode: productCode,
      saleInitiatedOn: today,
      
      vehicleSnapshot: {
        purchasedOn: today,
        modelCode: "342",
        categoryCode: "PC",
        usageCode: "STANDARD",
        mileage: 1000,
        firstRegisteredOn: registrationDate,
        evaluationDate: today,
        purchasePrice: Math.round(price * 100), // Konwersja 1000 zł -> 100000
        purchasePriceNet: Math.round(price * 100),
        purchasePriceVatReclaimableCode: "NO",
        usageTypeCode: "INDIVIDUAL",
        purchasePriceInputType: "VAT_INAPPLICABLE"
      },
      
      options: {
        TERM: `T_${months}`,
        CLAIM_LIMIT: "CL_100000",
        PAYMENT_TERM: "PT_LS",
        PAYMENT_METHOD: "PM_BT"
      }
    };
    
    console.log('Przygotowane dane do wysłania:', JSON.stringify(calculationData, null, 2));
    
    // Wywołanie API z poprawnym nagłówkiem autoryzacyjnym
    const apiResponse = await fetch('https://test.v2.idefend.eu/api/policies/creation/calculate-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': authToken
      },
      body: JSON.stringify(calculationData)
    });
    
    // Analiza odpowiedzi
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      console.error('Odpowiedź API z błędem:', {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        data: errorData
      });
      
      return NextResponse.json(
        { error: `Błąd API: ${apiResponse.status}`, details: errorData },
        { status: apiResponse.status }
      );
    }
    
    // Przetworzenie danych odpowiedzi
    const data = await apiResponse.json();
    console.log('Otrzymana odpowiedź z API:', JSON.stringify(data, null, 2));
    
    // Konwersja ceny z wartości w groszach (np. 235000 -> 2350.00)
    const premiumAmount = data.premiumSuggested 
      ? Math.round((data.premiumSuggested / 100) * 100) / 100 
      : 0;
    
    console.log('Przeliczona wartość składki:', premiumAmount, 'zł');
    
    // Przygotowanie odpowiedzi w oczekiwanym formacie
    return NextResponse.json({
      success: true,
      premium: premiumAmount,
      details: {
        productName: data.productName || (type === 'fakturowy' ? 'Ubezpieczenie GAP Fakturowy' : 'Ubezpieczenie GAP MAX'),
        coveragePeriod: `${months} miesięcy`,
        vehicleValue: price,
        maxCoverage: "100 000 PLN" // Zmieniono zgodnie z wybraną opcją CL_100000
      }
    });
    
  } catch (error: unknown) {
    console.error('Błąd podczas kalkulacji:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    return NextResponse.json(
      { error: errorMessage || 'Wystąpił błąd podczas kalkulacji' },
      { status: 500 }
    );
  }
} 