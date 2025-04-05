import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to format date as ISO string for specific fields
function formatIsoDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // Using a fixed time and offset for consistency, similar to example
    return `${year}-${month}-${day}T00:00:00+02:00`;
}

// Funkcja do pobrania dostępnych opcji
async function getAvailableOptions(authToken: string) {
  try {
    console.log('Pobieranie dostępnych opcji produktów...');
    const portfoliosResponse = await fetch('https://test.v2.idefend.eu/api/policies/creation/portfolios/', {
      headers: {
        'X-NODE-JWT-AUTH-TOKEN': authToken,
        'Accept': 'application/json'
      }
    });
    
    if (!portfoliosResponse.ok) {
      console.error('Błąd pobierania opcji:', portfoliosResponse.status, portfoliosResponse.statusText);
      return null;
    }
    
    const portfoliosData = await portfoliosResponse.json();
    console.log('Dostępne opcje produktów:', JSON.stringify(portfoliosData, null, 2));
    return portfoliosData;
  } catch (error) {
    console.error('Błąd podczas pobierania opcji:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('==> /api/calculate: Otrzymano body żądania:', body);

    const token = await getAuthToken();
    if (!token) {
      console.error('==> /api/calculate: Błąd - Brak tokenu autoryzacji');
      return NextResponse.json({ success: false, error: 'Brak autoryzacji' }, { status: 401 });
    }

    const apiUrl = 'https://test.v2.idefend.eu/api/premium-calculator/calculate';

    const requestPayload = {
      sellerNodeCode: 'PL_TEST_GAP_25',
      productCode: body.productCode,
      price: {
        amount: body.price ? body.price * 100 : 0,
        currency: 'PLN'
      },
      vehicleSnapshot: {
        categoryCode: body.categoryCode,
        modelCode: body.modelCode,
        firstRegisteredOn: body.firstRegisteredOn,
        purchasedOn: body.purchasedOn,
        usageCode: body.usageCode,
      },
      options: {
        TERM: body.term || 'T_36',
        CLAIM_LIMIT: body.claimLimit || 'CL_50000'
      }
    };

    console.log('==> /api/calculate: Wysyłanie do iDefend payload:', JSON.stringify(requestPayload, null, 2));

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });

    const responseText = await apiResponse.text();
    console.log(`==> /api/calculate: Odpowiedź z iDefend - Status: ${apiResponse.status}`);
    console.log('==> /api/calculate: Odpowiedź z iDefend - Raw Body:', responseText);

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('==> /api/calculate: Nie udało się sparsować odpowiedzi iDefend jako JSON.');
      if (!apiResponse.ok) {
        return NextResponse.json({ success: false, error: 'Błąd API iDefend: Nieprawidłowa odpowiedź', rawResponse: responseText }, { status: apiResponse.status });
      }
      responseData = { premium: null };
    }

    if (!apiResponse.ok) {
      console.error('==> /api/calculate: Błąd API iDefend (po sparsowaniu):', responseData);
      const errorMessage = responseData?.detail || responseData?.message || 'Błąd obliczania składki w iDefend';
      return NextResponse.json({ success: false, error: errorMessage, details: responseData }, { status: apiResponse.status });
    }

    const calculatedPremium = responseData.premium ? responseData.premium / 100 : null;
    console.log('==> /api/calculate: Zwracanie sukcesu z premium (PLN):', calculatedPremium);

    return NextResponse.json({
      success: true,
      premium: calculatedPremium,
      details: responseData
    }, { status: 200 });

  } catch (error) {
    console.error('==> /api/calculate: Błąd wewnętrzny serwera:', error);
    return NextResponse.json({ success: false, error: 'Błąd wewnętrzny serwera' }, { status: 500 });
  }
} 