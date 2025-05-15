import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

// Dodajemy interfejs dla violation
interface ValidationViolation {
  propertyPath: string;
  message: string;
}

const API_BASE_URL = 'https://v2.idefend.eu/api';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Dane wejściowe od formularza:', data);
    
    // Pobierz token autoryzacyjny
    const token = await getAuthToken();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu JWT' },
        { status: 401 }
      );
    }

    console.log('Token JWT otrzymany, wysyłam żądanie do API');

    // Przygotowanie daty w formacie YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Wybór odpowiedniego kodu produktu na podstawie typu
    let productCode = '5_DCGAP_MG25_GEN'; // domyślnie GAP MAX
    if (data.type === 'fakturowy') {
      productCode = '5_DCGAP_F25_GEN'; // GAP Fakturowy
    }

    // Przygotowanie pełnych danych do kalkulacji
    const calculationData = {
      sellerNodeCode: 'PL_TEST_GAP_25',
      productCode: productCode,
      saleInitiatedOn: today,
      vehicleSnapshot: {
        purchasedOn: today,
        modelCode: data.modelCode || "342",
        categoryCode: "PC",
        usageCode: "STANDARD",
        mileage: 1000,
        firstRegisteredOn: `${data.year}-01-01T00:00:00+02:00`,
        evaluationDate: today,
        purchasePrice: Math.round(data.price * 100),
        purchasePriceNet: Math.round(data.price * 100),
        purchasePriceVatReclaimableCode: "NO",
        usageTypeCode: "INDIVIDUAL",
        purchasePriceInputType: "VAT_INAPPLICABLE"
      },
      options: {
        TERM: `T_${data.months}`,
        CLAIM_LIMIT: "CL_100000",
        PAYMENT_TERM: "PT_LS",
        PAYMENT_METHOD: "PM_BT"
      }
    };

    console.log('Wysyłane dane:', JSON.stringify(calculationData, null, 2));

    // Wysyłamy żądanie do API
    const apiResponse = await fetch(`${API_BASE_URL}/policies/creation/calculate-offer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: JSON.stringify(calculationData),
    });

    console.log('Status odpowiedzi z API:', apiResponse.status, apiResponse.statusText);
    
    // Pobieramy odpowiedź jako tekst
    const responseText = await apiResponse.text();
    console.log('Odpowiedź z API (surowa):', responseText);

    // Próbujemy sparsować JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (error) {
      console.error('Błąd parsowania odpowiedzi JSON:', error);
      return NextResponse.json(
        { error: 'Nieprawidłowa odpowiedź z API' },
        { status: 500 }
      );
    }

    if (!apiResponse.ok) {
      console.error('Błąd odpowiedzi API:', responseData);
      return NextResponse.json(
        { error: responseData.message || responseData.detail || 'Błąd podczas kalkulacji' },
        { status: apiResponse.status }
      );
    }

    // Konwersja ceny z wartości w groszach na złote
    const premiumAmount = responseData.premiumSuggested 
      ? Math.round((responseData.premiumSuggested / 100) * 100) / 100 
      : 0;

    // Przygotowanie odpowiedzi w oczekiwanym formacie
    return NextResponse.json({
      success: true,
      premium: premiumAmount,
      details: {
        productName: responseData.productName || (data.type === 'fakturowy' ? 'GAP Fakturowy' : 'GAP MAX'),
        coveragePeriod: `${data.months} miesięcy`,
        vehicleValue: data.price,
        maxCoverage: "100 000 PLN"
      }
    });
    
  } catch (error) {
    console.error('Błąd podczas przetwarzania żądania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
} 