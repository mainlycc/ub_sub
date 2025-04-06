import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

// Helper do formatowania daty YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper do formatowania daty ISO z czasem
function formatIsoDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // Używamy stałej godziny jak w przykładzie
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
    console.log('==> /api/calculate (Uproszczony): Otrzymano body:', JSON.stringify(body, null, 2));

    // Pobieramy tylko potrzebne dane z kalkulatora
    const price = body.price ? Number(body.price) : 0;
    const year = body.year ? Number(body.year) : new Date().getFullYear(); // Rok produkcji z kalkulatora
    const months = body.months ? Number(body.months) : 36; // Okres z kalkulatora

    if (price <= 0) {
        return NextResponse.json({ success: false, error: 'Nieprawidłowa cena pojazdu.' }, { status: 400 });
    }
    if (year < 1900 || year > new Date().getFullYear() + 1) {
         return NextResponse.json({ success: false, error: 'Nieprawidłowy rok produkcji.' }, { status: 400 });
    }
    if (![12, 24, 36, 48, 60].includes(months)) {
         return NextResponse.json({ success: false, error: 'Nieprawidłowy okres ubezpieczenia.' }, { status: 400 });
    }

    const token = await getAuthToken();
    if (!token) {
      console.error('==> /api/calculate (Uproszczony): Błąd - Brak tokenu autoryzacji');
      return NextResponse.json({ success: false, error: 'Brak autoryzacji' }, { status: 401 });
    }

    const apiUrl = 'https://test.v2.idefend.eu/api/policies/creation/calculate-offer';

    // --- Budowanie Payloadu ---
    
    // Data pierwszej rejestracji - bazuje na roku z formularza
    const firstRegDate = new Date(year, 0, 1); // 1 stycznia roku z formularza
    
    // Data zakupu - ustawiona na DOKŁADNIE 181 dni po pierwszej rejestracji
    const purchaseDate = new Date(firstRegDate);
    purchaseDate.setDate(purchaseDate.getDate() + 181);
    
    // Sprawdzamy czy data zakupu (181 dni po rejestracji) nie jest w przyszłości względem dzisiaj
    // Oraz czy nie jest starsza niż 10 lat
    const today = new Date();
    const daysSinceRegistrationForPurchase = Math.floor((purchaseDate.getTime() - firstRegDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceRegistrationForToday = Math.floor((today.getTime() - firstRegDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (purchaseDate > today) {
        console.log(`Wyliczona data zakupu (${formatDate(purchaseDate)}) jest w przyszłości.`);
        // Teoretycznie ten warunek nie powinien wystąpić przy obecnej logice wyboru lat
        return NextResponse.json({
          success: false,
          error: `Data zakupu wyliczona na podstawie roku produkcji jest w przyszłości. Skontaktuj się z administratorem.`
        }, { status: 400 });
    }
    
    const maxRegistrationAge = 10 * 365; // Maksymalny wiek pojazdu w dniach (około 10 lat)
    if (daysSinceRegistrationForToday > maxRegistrationAge) {
      console.log(`Pojazd zbyt stary (${daysSinceRegistrationForToday} dni). Maksimum to ${maxRegistrationAge} dni.`);
      return NextResponse.json({
        success: false,
        error: `Pojazd nie może być starszy niż 10 lat. Wybierz nowszy rok produkcji.`
      }, { status: 400 });
    }
        
    const formattedFirstRegDate = formatIsoDateTime(firstRegDate);
    const formattedPurchaseDate = formatDate(purchaseDate);
    const formattedToday = formatDate(today); // Potrzebne dla saleInitiatedOn
    
    console.log(`Rok z formularza: ${year}, data pierwszej rejestracji: ${formattedFirstRegDate}`);
    console.log(`Data zakupu (181 dni po rej.): ${formattedPurchaseDate}, sprzedaż na datę: ${formattedToday}`);
    console.log(`Różnica dni między pierwszą rejestracją a zakupem: ${daysSinceRegistrationForPurchase} dni`);
    
    const requestPayload = {
      "sellerNodeCode": "PL_TEST_GAP_25",
      "productCode": "5_DCGAP_MG25_GEN",
      "saleInitiatedOn": "2025-02-24",	
      
        "vehicleSnapshot":
      {
        "purchasedOn": "2025-02-24",
        "modelCode": "342",
        "categoryCode": "PC",
        "usageCode":"STANDARD", 
        "mileage": 1000,
        "firstRegisteredOn": "2021-05-01T07:38:46+02:00",
        "evaluationDate": "2025-02-24",
        "purchasePrice": 15000000,
        "purchasePriceNet": 15000000,
        "purchasePriceVatReclaimableCode": "NO",
        "usageTypeCode": "INDIVIDUAL",
        "purchasePriceInputType": "VAT_INAPPLICABLE"
        },
      
      "options":
      {				
        "TERM": "T_36",
        "CLAIM_LIMIT": "CL_150000",
        "PAYMENT_TERM": "PT_LS",
        "PAYMENT_METHOD": "PM_PAYU"
      }
    }
    console.log('==> /api/calculate (Uproszczony): Wysyłanie payload:', JSON.stringify(requestPayload, null, 2));

    // --- Wywołanie API iDefend ---
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
    console.log(`==> /api/calculate (Uproszczony): Odpowiedź iDefend - Status: ${apiResponse.status}`);
    console.log('==> /api/calculate (Uproszczony): Odpowiedź iDefend - Raw Body:', responseText);

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('==> /api/calculate (Uproszczony): Nie udało się sparsować JSON.', e);
      if (!apiResponse.ok) {
        return NextResponse.json({ success: false, error: 'Błąd API iDefend: Nieprawidłowa odpowiedź', rawResponse: responseText }, { status: apiResponse.status });
      }
      return NextResponse.json({ success: false, error: 'Nieoczekiwany format odpowiedzi API iDefend.', rawResponse: responseText }, { status: 500 });
    }

    // --- Obsługa Odpowiedzi ---
    if (!apiResponse.ok) {
      console.error('==> /api/calculate (Uproszczony): Błąd API iDefend (po sparsowaniu):', responseData);
      const errorMessage = responseData?.detail || responseData?.message || 'Błąd obliczania składki w iDefend';
      return NextResponse.json({ success: false, error: errorMessage, details: responseData }, { status: apiResponse.status });
    }

    // Pobranie sugerowanej składki lub standardowej
    const calculatedPremium = responseData.premiumSuggested !== undefined && responseData.premiumSuggested !== null
      ? responseData.premiumSuggested / 100
      : (responseData.premium !== undefined && responseData.premium !== null ? responseData.premium / 100 : null);

    if (calculatedPremium === null) {
      console.error('==> /api/calculate (Uproszczony): Brak składki w odpowiedzi iDefend:', responseData);
      return NextResponse.json({ success: false, error: 'API iDefend nie zwróciło obliczonej składki.', details: responseData }, { status: 500 });
    }

    console.log('==> /api/calculate (Uproszczony): Zwracanie sukcesu. Premium (PLN):', calculatedPremium);

    // Zwracamy sukces i pełne szczegóły z iDefend
    return NextResponse.json({
      success: true,
      premium: calculatedPremium,
      details: responseData
    }, { status: 200 });

  } catch (error: any) {
    console.error('==> /api/calculate (Uproszczony): Błąd wewnętrzny serwera:', error);
    const errorMessage = error instanceof TypeError && error.message.includes('fetch failed')
        ? 'Błąd połączenia z API iDefend.'
        : (error.message || 'Błąd wewnętrzny serwera');
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 