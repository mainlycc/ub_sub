import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

// Interfejs dla danych polisy
interface PolicyData {
  sellerNodeCode: string;
  productCode: string;
  saleInitiatedOn: string;
  signatureTypeCode: string;
  vehicleSnapshot: {
    makeId: string;
    modelId: string;
    vin: string;
    vrm: string;
    categoryCode: string;
    usageCode: string;
    firstRegisteredOn: string;
    purchasedOn: string;
    purchasePrice: number;
    purchasePriceNet: number;
    purchasePriceInputType: string;
    evaluationDate: string;
    owners: Array<{ contact: { inheritFrom: string } }>;
  };
  client: {
    policyHolder: {
      type: string;
      email: string;
      phoneNumber: string;
      firstName: string;
      lastName: string;
      identificationNumber: string;
      address: {
        street: string;
        addressLine1: string;
        city: string;
        postCode: string;
        countryCode: string;
      };
    };
    insured: {
      inheritFrom: string;
    };
    beneficiary: {
      inheritFrom: string;
    };
  };
  options: {
    TERM: string;
    CLAIM_LIMIT: string;
    PAYMENT_TERM: string;
    PAYMENT_METHOD: string;
  };
  premium: number;
}

// Funkcja walidująca dane polisy
function validatePolicyData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Sprawdzanie podstawowych pól
  if (!data.sellerNodeCode) errors.push('Brak sellerNodeCode');
  if (!data.productCode) errors.push('Brak productCode');
  if (!data.saleInitiatedOn) errors.push('Brak saleInitiatedOn');
  if (!data.signatureTypeCode) errors.push('Brak signatureTypeCode');

  // Sprawdzanie danych pojazdu
  const vehicle = data.vehicleSnapshot;
  if (!vehicle) {
    errors.push('Brak danych pojazdu');
  } else {
    if (!vehicle.makeId) errors.push('Brak makeId pojazdu');
    if (!vehicle.modelId) errors.push('Brak modelId pojazdu');
    if (!vehicle.vin) errors.push('Brak VIN pojazdu');
    if (!vehicle.vrm) errors.push('Brak numeru rejestracyjnego');
    if (!vehicle.categoryCode) errors.push('Brak kategorii pojazdu');
    if (!vehicle.usageCode) errors.push('Brak kodu użytkowania');
    if (!vehicle.firstRegisteredOn) errors.push('Brak daty pierwszej rejestracji');
    if (!vehicle.purchasedOn) errors.push('Brak daty zakupu');
    if (typeof vehicle.purchasePrice !== 'number') errors.push('Nieprawidłowa cena zakupu');
    if (typeof vehicle.purchasePriceNet !== 'number') errors.push('Nieprawidłowa cena netto');
  }

  // Sprawdzanie danych klienta
  const client = data.client?.policyHolder;
  if (!client) {
    errors.push('Brak danych klienta');
  } else {
    if (!client.type) errors.push('Brak typu klienta');
    if (!client.email) errors.push('Brak email klienta');
    if (!client.phoneNumber) errors.push('Brak telefonu klienta');
    if (!client.firstName) errors.push('Brak imienia klienta');
    if (!client.lastName) errors.push('Brak nazwiska klienta');
    if (!client.identificationNumber) errors.push('Brak PESEL klienta');

    // Sprawdzanie adresu
    const address = client.address;
    if (!address) {
      errors.push('Brak adresu klienta');
    } else {
      if (!address.street) errors.push('Brak ulicy');
      if (!address.addressLine1) errors.push('Brak numeru domu');
      if (!address.city) errors.push('Brak miasta');
      if (!address.postCode) errors.push('Brak kodu pocztowego');
      if (!address.countryCode) errors.push('Brak kraju');
    }
  }

  // Sprawdzanie opcji
  const options = data.options;
  if (!options) {
    errors.push('Brak opcji');
  } else {
    if (!options.TERM) errors.push('Brak TERM');
    if (!options.CLAIM_LIMIT) errors.push('Brak CLAIM_LIMIT');
    if (!options.PAYMENT_TERM) errors.push('Brak PAYMENT_TERM');
    if (!options.PAYMENT_METHOD) errors.push('Brak PAYMENT_METHOD');
  }

  // Sprawdzanie składki
  if (typeof data.premium !== 'number' || data.premium <= 0) {
    errors.push('Nieprawidłowa składka');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Otrzymane dane:', JSON.stringify(data, null, 2));

    // Walidacja danych
    const validation = validatePolicyData(data);
    if (!validation.isValid) {
      console.error('Błędy walidacji:', validation.errors);
      return NextResponse.json(
        { 
          error: 'Nieprawidłowe dane polisy - brak wymaganych pól lub nieprawidłowy format',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Pobierz token autoryzacyjny
    let token: string;
    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        throw new Error('Nie udało się uzyskać tokenu autoryzacyjnego');
      }
      token = authToken;
    } catch (error) {
      console.error('Błąd podczas pobierania tokenu:', error);
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się uzyskać tokenu' },
        { status: 401 }
      );
    }

    console.log('Token autoryzacyjny uzyskany:', !!token);

    // Wysyłamy żądanie do API
    const response = await fetch('https://test.v2.idefend.eu/api/policies/creation/lock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Błąd odpowiedzi API:', responseData);
      if (response.status === 401) {
        console.error('Szczegóły błędu autoryzacji:', {
          token: !!token,
          responseData
        });
        return NextResponse.json(
          { 
            error: 'Błąd autoryzacji - nieprawidłowy token',
            details: responseData
          },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { 
          error: responseData.error?.message || 'Błąd podczas rejestracji polisy',
          details: responseData.error?.details || responseData
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Błąd podczas przetwarzania żądania:', error);
    return NextResponse.json(
      { 
        error: 'Wystąpił błąd podczas przetwarzania żądania',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      },
      { status: 500 }
    );
  }
} 