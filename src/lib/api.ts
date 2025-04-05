import axios, { AxiosError, AxiosResponse } from 'axios';
import { getAuthToken } from './auth';
import { VehicleData, PersonalData, InsuranceVariant, PaymentData, CalculationResult } from '@/types/insurance';

// Stałe konfiguracyjne
const API_BASE_URL = 'https://test.v2.idefend.eu/api';
const LOGIN = 'GAP_2025_PL';
const PASSWORD = 'LEaBY4TXgWa4QJX';

// Interfejsy dla typów danych
interface AuthResponse {
  token: string;
  expiresIn?: number;
}

interface GapOfferParams {
  price: number;
  year: number;
  months: number;
  modelCode?: string;
}

interface GapOfferResponse {
  premiumSuggested: number;
  productName: string;
  options?: {
    CLAIM_LIMIT?: string;
  };
}

interface VehicleModel {
  code: string;
  name: string;
  [key: string]: unknown;
}

interface PolicyData {
  sellerNodeCode: string;
  productCode: string;
  // Pozostałe pola zgodne z wymaganiami API
  [key: string]: unknown;
}

interface PolicyResponse {
  policyId?: string;
  status?: string;
  [key: string]: unknown;
}

// Cache dla tokenu JWT
let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

// Funkcja do autoryzacji i uzyskania tokenu JWT
export async function authenticate(): Promise<string | null> {
  try {
    // Sprawdź czy mamy ważny token w cache
    if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
      console.log('Używam zapisanego tokenu');
      return cachedToken;
    }

    console.log('Pobieranie nowego tokenu...');
    
    const response = await axios.post<AuthResponse>(
      'https://test.v2.idefend.eu/api/jwt-token',
      {
        username: "GAP_2025_PL",
        password: "LEaBY4TXgWa4QJX"
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data || !response.data.token) {
      console.error('Brak tokenu w odpowiedzi:', response.data);
      throw new Error('Brak tokenu w odpowiedzi');
    }

    // Zapisz token w cache
    cachedToken = response.data.token;
    
    // Ustaw czas wygaśnięcia tokenu na podstawie odpowiedzi lub domyślnie 14 minut
    const expiresInMs = response.data.expiresIn 
      ? response.data.expiresIn * 1000 
      : 14 * 60 * 1000; // 14 minut domyślnie
    
    tokenExpiration = Date.now() + expiresInMs;
    console.log('Nowy token zapisany, wygaśnie za', expiresInMs / 60000, 'minut');

    return cachedToken;

  } catch (error: unknown) {
    const apiError = error as AxiosError;
    console.error('Błąd autoryzacji:', {
      message: apiError.message,
      response: (apiError.response as AxiosResponse)?.data,
      status: (apiError.response as AxiosResponse)?.status
    });
    
    // Resetuj cache w przypadku błędu
    cachedToken = null;
    tokenExpiration = null;
    
    throw new Error('Błąd autoryzacji: ' + apiError.message);
  }
}

// Funkcja pomocnicza do wykonywania zapytań API z autoryzacją
export async function callApiWithAuth<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: Record<string, unknown>
): Promise<T> {
  try {
    // Pobierz token autoryzacyjny
    const token = await authenticate();
    
    if (!token) {
      throw new Error('Brak tokenu autoryzacyjnego');
    }
    
    const response = await axios<T>({
      method,
      url: `https://test.v2.idefend.eu/api/${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      data: method !== 'GET' ? data : undefined,
      params: method === 'GET' ? data : undefined
    });
    
    return response.data;
  } catch (error: unknown) {
    const apiError = error as AxiosError;
    console.error(`Błąd wywołania API (${endpoint}):`, {
      message: apiError.message,
      response: (apiError.response as AxiosResponse)?.data,
      status: (apiError.response as AxiosResponse)?.status
    });
    
    throw new Error(`Błąd wywołania API: ${apiError.message}`);
  }
}

// Funkcja do obliczania oferty GAP
export async function calculateGapOffer(params: GapOfferParams): Promise<GapOfferResponse> {
  try {
    const token = await authenticate();
    if (!token) {
      throw new Error('Brak tokenu autoryzacji');
    }

    // Format daty YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Pełny format daty rejestracji z godziną
    const registrationDate = `${params.year}-01-01T00:00:00+02:00`;

    const calculationData = {
      sellerNodeCode: "PL_TEST_GAP_25",
      productCode: "5_DCGAP_MG25_GEN", // Domyślnie GAP MAX
      saleInitiatedOn: today,
      
      vehicleSnapshot: {
        purchasedOn: today,
        modelCode: params.modelCode || "342",
        categoryCode: "PC",
        usageCode: "STANDARD",
        mileage: 1000,
        firstRegisteredOn: registrationDate,
        evaluationDate: today,
        purchasePrice: Math.round(params.price * 100),
        purchasePriceNet: Math.round(params.price * 100),
        purchasePriceVatReclaimableCode: "NO",
        usageTypeCode: "INDIVIDUAL",
        purchasePriceInputType: "VAT_INAPPLICABLE"
      },
      
      options: {
        TERM: `T_${params.months}`,
        CLAIM_LIMIT: "CL_100000",
        PAYMENT_TERM: "PT_LS",
        PAYMENT_METHOD: "PM_BT"
      }
    };

    const response = await axios.post<GapOfferResponse>(
      'https://test.v2.idefend.eu/api/policies/creation/calculate-offer',
      calculationData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-NODE-JWT-AUTH-TOKEN': token
        }
      }
    );

    return response.data;
  } catch (error: unknown) {
    const apiError = error as AxiosError;
    console.error('Błąd kalkulacji oferty:', apiError);
    throw new Error((apiError.response as AxiosResponse)?.data?.message || apiError.message);
  }
}

// Funkcja do pobierania dostępnych modeli pojazdów
export async function getVehicleModels(): Promise<VehicleModel[]> {
  try {
    const token = await authenticate();
    
    const response = await axios.get<VehicleModel[]>(
      `${API_BASE_URL}/vehicles/makes?pagination=false`,
      {
        headers: {
          'X-NODE-JWT-AUTH-TOKEN': token
        }
      }
    );
    
    return response.data;
  } catch (error: unknown) {
    const apiError = error as AxiosError;
    console.error('Błąd pobierania modeli pojazdów:', apiError);
    throw new Error('Nie udało się pobrać listy modeli pojazdów');
  }
}

// Funkcja do rejestracji polisy (lock)
export async function registerPolicy(policyData: PolicyData): Promise<PolicyResponse> {
  try {
    const token = await authenticate();
    
    const response = await axios.post<PolicyResponse>(
      `${API_BASE_URL}/policies/creation/lock`,
      policyData,
      {
        headers: {
          'X-NODE-JWT-AUTH-TOKEN': token,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error: unknown) {
    const apiError = error as AxiosError;
    console.error('Błąd rejestracji polisy:', apiError);
    throw new Error('Nie udało się zarejestrować polisy');
  }
}

// Funkcja do formatowania daty w formacie ISO
function formatDate(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

// Funkcja do przygotowania danych polisy
function preparePolicyData(
  vehicleData: VehicleData,
  personalData: PersonalData,
  variant: InsuranceVariant,
  paymentData: PaymentData,
  calculationResult: CalculationResult
) {
  const today = new Date().toISOString().split('T')[0];

  // Konwersja składki na grosze (liczba całkowita)
  const premiumInCents = Math.round(calculationResult.premium * 100);

  return {
    extApiNo: "GAP_API",
    extReferenceNo: `GAP_${Date.now()}`,
    extTenderNo: null,
    sellerNodeCode: variant.sellerNodeCode,
    productCode: variant.productCode,
    saleInitiatedOn: today,
    signatureTypeCode: variant.signatureTypeCode,
    confirmedByDefault: null,

    vehicleSnapshot: {
      purchasedOn: vehicleData.purchasedOn,
      modelCode: vehicleData.modelCode,
      categoryCode: vehicleData.categoryCode,
      usageCode: vehicleData.usageCode,
      mileage: vehicleData.mileage,
      firstRegisteredOn: formatDate(vehicleData.firstRegisteredOn),
      evaluationDate: vehicleData.evaluationDate,
      purchasePrice: Math.round(vehicleData.purchasePrice * 100),
      purchasePriceNet: Math.round(vehicleData.purchasePriceNet * 100),
      purchasePriceVatReclaimableCode: vehicleData.purchasePriceVatReclaimableCode,
      usageTypeCode: vehicleData.usageTypeCode,
      purchasePriceInputType: vehicleData.purchasePriceInputType,
      vin: vehicleData.vin,
      vrm: vehicleData.vrm,
      owners: [{contact: {inheritFrom: "policyHolder"}}]
    },

    client: {
      policyHolder: {
        type: personalData.type,
        phoneNumber: personalData.phoneNumber,
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        email: personalData.email,
        identificationNumber: personalData.identificationNumber,
        address: {
          addressLine1: personalData.address.addressLine1 || `${personalData.firstName} ${personalData.lastName}`,
          street: personalData.address.street,
          city: personalData.address.city,
          postCode: personalData.address.postCode,
          countryCode: personalData.address.countryCode
        }
      },
      insured: {
        inheritFrom: "policyHolder"
      },
      beneficiary: {
        inheritFrom: "policyHolder"
      }
    },

    options: {
      TERM: paymentData.term,
      CLAIM_LIMIT: paymentData.claimLimit,
      PAYMENT_TERM: paymentData.paymentTerm,
      PAYMENT_METHOD: paymentData.paymentMethod
    },

    premium: premiumInCents,
    term: paymentData.term,
    claimLimit: paymentData.claimLimit,
    vehicle: {
      make: vehicleData.make,
      model: vehicleData.model,
      vin: vehicleData.vin,
      vrm: vehicleData.vrm,
      purchasePrice: vehicleData.purchasePrice,
      purchaseDate: vehicleData.purchaseDate,
      mileage: vehicleData.mileage
    },
    owners: [
      {
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        email: personalData.email,
        phoneNumber: personalData.phoneNumber,
        identificationNumber: personalData.identificationNumber,
        address: {
          street: personalData.address.street,
          city: personalData.address.city,
          postCode: personalData.address.postCode,
          addressLine1: personalData.address.addressLine1 || undefined
        }
      }
    ]
  };
}

// Funkcja do wystawiania polisy
export async function createPolicy(
  vehicleData: VehicleData,
  personalData: PersonalData,
  variant: InsuranceVariant,
  paymentData: PaymentData,
  calculationResult: CalculationResult
): Promise<PolicyResponse> {
  try {
    console.log('=== Rozpoczynam proces tworzenia polisy ===');
    
    const token = await authenticate();
    if (!token) {
      throw new Error('Brak tokenu autoryzacji');
    }

    // Przygotowanie danych polisy zgodnie z wymaganym formatem
    const policyData = {
      extApiNo: "GAP_API",
      extReferenceNo: `GAP_${Date.now()}`,
      extTenderNo: null,
      sellerNodeCode: variant.sellerNodeCode,
      productCode: variant.productCode,
      saleInitiatedOn: new Date().toISOString().split('T')[0],
      signatureTypeCode: "AUTHORIZED_BY_SMS",
      confirmedByDefault: null,

      vehicleSnapshot: {
        purchasedOn: vehicleData.purchasedOn,
        modelCode: vehicleData.modelCode,
        categoryCode: vehicleData.categoryCode,
        usageCode: vehicleData.usageCode,
        mileage: vehicleData.mileage,
        firstRegisteredOn: vehicleData.firstRegisteredOn,
        evaluationDate: vehicleData.evaluationDate,
        purchasePrice: Math.round(vehicleData.purchasePrice * 100), // Konwersja na grosze
        purchasePriceNet: Math.round(vehicleData.purchasePriceNet * 100), // Konwersja na grosze
        purchasePriceVatReclaimableCode: vehicleData.purchasePriceVatReclaimableCode,
        usageTypeCode: vehicleData.usageTypeCode,
        purchasePriceInputType: vehicleData.purchasePriceInputType,
        vin: vehicleData.vin,
        vrm: vehicleData.vrm,
        owners: [{ contact: { inheritFrom: "policyHolder" } }]
      },

      client: {
        policyHolder: {
          type: "person",
          phoneNumber: personalData.phoneNumber,
          firstName: personalData.firstName,
          lastName: personalData.lastName,
          email: personalData.email,
          identificationNumber: personalData.identificationNumber,
          address: {
            addressLine1: `${personalData.firstName} ${personalData.lastName}`,
            street: personalData.address.street,
            city: personalData.address.city,
            postCode: personalData.address.postCode,
            countryCode: "PL"
          }
        },
        insured: {
          inheritFrom: "policyHolder"
        },
        beneficiary: {
          inheritFrom: "policyHolder"
        }
      },

      options: {
        TERM: paymentData.term,
        CLAIM_LIMIT: paymentData.claimLimit,
        PAYMENT_TERM: "PT_LS",
        PAYMENT_METHOD: "PM_PBC"
      },

      premium: Math.round(calculationResult.premium * 100) // Konwersja na grosze
    };

    console.log('Przygotowane dane do wysłania:', JSON.stringify(policyData, null, 2));

    const response = await axios.post(
      `${API_BASE_URL}/policies/creation/lock`,
      policyData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-NODE-JWT-AUTH-TOKEN': token
        }
      }
    );

    console.log('Odpowiedź z API:', response.data);

    if (!response.data) {
      throw new Error('Brak danych w odpowiedzi API');
    }

    return {
      policyId: response.data.policyId || response.data.id,
      status: response.data.status || 'POLICY_CREATED'
    };

  } catch (error) {
    console.error('Błąd podczas tworzenia polisy:', error);
    throw error;
  }
}

// Funkcja do autoryzacji polisy przez SMS
export async function authorizePolicy(policyId: string, smsCode: string): Promise<void> {
  try {
    const token = await authenticate();
    if (!token) {
      throw new Error('Brak tokenu autoryzacji');
    }

    await axios.post(
      `${API_BASE_URL}/policies/${policyId}/authorize`,
      { code: smsCode },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-NODE-JWT-AUTH-TOKEN': token
        }
      }
    );
  } catch (error: unknown) {
    const apiError = error as AxiosError;
    console.error('Błąd autoryzacji polisy:', apiError);
    throw new Error('Nie udało się autoryzować polisy');
  }
}

// Funkcja do pobierania dokumentów polisy
export async function getPolicyDocuments(policyId: string): Promise<{ [key: string]: string }> {
  try {
    const token = await authenticate();
    if (!token) {
      throw new Error('Brak tokenu autoryzacji');
    }

    const response = await axios.get(
      `${API_BASE_URL}/policies/${policyId}/documents`,
      {
        headers: {
          'X-NODE-JWT-AUTH-TOKEN': token
        }
      }
    );

    return response.data;
  } catch (error: unknown) {
    const apiError = error as AxiosError;
    console.error('Błąd pobierania dokumentów:', apiError);
    throw new Error('Nie udało się pobrać dokumentów polisy');
  }
} 