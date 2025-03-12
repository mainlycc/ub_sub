import axios from 'axios';
import { getAuthToken } from './auth';

// Stałe konfiguracyjne
const API_BASE_URL = 'https://test.v2.idefend.eu/api/jwt-token';
const AUTH_CREDENTIALS = {
  username: "GAP_2025_PL",
  password: "LEaBY4TXgWa4QJX"
};
const SELLER_NODE_CODE = 'PL_TEST_GAP_25';

// Interfejsy dla typów danych
interface AuthResponse {
  token: string;
  expiresIn?: number;
}

interface VehicleData {
  price: number;
  year: number;
  months: number;
  modelCode?: string;
}

interface CalculateOfferResponse {
  premiumSuggested: number;
  premiumNet: number;
  premiumGross: number;
  // Inne pola, które mogą być zwrócone przez API
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

  } catch (error: any) {
    console.error('Błąd autoryzacji:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Resetuj cache w przypadku błędu
    cachedToken = null;
    tokenExpiration = null;
    
    throw new Error('Błąd autoryzacji: ' + error.message);
  }
}

// Funkcja pomocnicza do wykonywania zapytań API z autoryzacją
export async function callApiWithAuth(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<any> {
  try {
    // Pobierz token autoryzacyjny
    const token = await authenticate();
    
    if (!token) {
      throw new Error('Brak tokenu autoryzacyjnego');
    }
    
    const response = await axios({
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
  } catch (error: any) {
    console.error(`Błąd wywołania API (${endpoint}):`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    throw new Error(`Błąd wywołania API: ${error.message}`);
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
  } catch (error: any) {
    console.error('Błąd kalkulacji oferty:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
}

// Funkcja do pobierania dostępnych modeli pojazdów
export async function getVehicleModels(): Promise<any> {
  try {
    const token = await authenticate();
    
    const response = await axios.get(
      `${API_BASE_URL}/vehicles/makes?pagination=false`,
      {
        headers: {
          'X-NODE-JWT-AUTH-TOKEN': token
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Błąd pobierania modeli pojazdów:', error);
    throw new Error('Nie udało się pobrać listy modeli pojazdów');
  }
}

// Funkcja do rejestracji polisy (lock)
export async function registerPolicy(policyData: any): Promise<any> {
  try {
    const token = await authenticate();
    
    const response = await axios.post(
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
  } catch (error) {
    console.error('Błąd rejestracji polisy:', error);
    throw new Error('Nie udało się zarejestrować polisy');
  }
} 