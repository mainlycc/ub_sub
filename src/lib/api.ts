import axios, { AxiosError, AxiosResponse } from 'axios';
import { getAuthToken } from './auth';

// Stałe konfiguracyjne
const API_BASE_URL = 'https://test.v2.idefend.eu/api/jwt-token';

// Interfejsy dla typów danych
interface AuthResponse {
  token: string;
  expiresIn?: number;
}

interface ApiError {
  message: string;
  response?: {
    data: unknown;
    status: number;
  };
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
    const token = await getAuthToken();
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