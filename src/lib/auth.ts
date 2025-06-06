import axios, { AxiosError } from 'axios';
import { getCurrentEnvironment } from '@/lib/environment';

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

// Stałe konfiguracyjne zgodne z dokumentacją GAP - te same dla obu środowisk
export const AUTH_CREDENTIALS = {
  username: process.env.GAP_API_USERNAME || "",
  password: process.env.GAP_API_PASSWORD || ""
} as const;

interface AuthResponse {
  token: string;
  expiresIn?: number;
}

interface ErrorResponse {
  error?: string;
  message?: string;
  code?: number;
  status?: number;
}

// Funkcja do autoryzacji i uzyskania tokenu JWT
export async function getAuthToken(): Promise<string | null> {
  try {
    // Sprawdź czy mamy ważny token w cache
    if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
      console.log('Używam zapisanego tokenu');
      return cachedToken;
    }

    const environment = getCurrentEnvironment();
    console.log('Pobieranie nowego tokenu dla środowiska:', environment.label);
    
    const response = await axios.post<AuthResponse>(
      `${environment.apiUrl}/jwt-token`,
      AUTH_CREDENTIALS,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 sekund timeout
      }
    );

    if (!response.data?.token) {
      console.error('Brak tokenu w odpowiedzi:', response.data);
      throw new Error('Brak tokenu w odpowiedzi z serwera autoryzacji');
    }
    
    // Zapisz token w cache
    cachedToken = response.data.token;
    const expirationTime = response.data.expiresIn 
      ? response.data.expiresIn * 1000
      : 14 * 60 * 1000; // 14 minut domyślnie
    
    tokenExpiration = Date.now() + expirationTime;
    console.log(`Token otrzymany dla środowiska ${environment.label}, wygasa za:`, Math.floor(expirationTime / 1000 / 60), 'minut');

    return cachedToken;

  } catch (error) {
    // Resetuj cache w przypadku błędu
    cachedToken = null;
    tokenExpiration = null;
    
    if (axios.isAxiosError(error)) {
      const apiError = error as AxiosError<ErrorResponse>;
      const environment = getCurrentEnvironment();

      console.error('Błąd autoryzacji:', {
        environment: environment.label,
        message: apiError.message,
        response: apiError.response?.data,
        status: apiError.response?.status,
        code: apiError.code
      });
      
      if (apiError.response?.status === 401) {
        throw new Error(`Błąd autoryzacji w środowisku ${environment.label}. Sprawdź poprawność kredencjałów.`);
      } else if (apiError.code === 'ECONNABORTED') {
        throw new Error(`Timeout podczas próby autoryzacji w środowisku ${environment.label}`);
      } else if (!apiError.response) {
        throw new Error(`Brak połączenia z serwerem autoryzacji ${environment.label}`);
      }
    }
    
    throw new Error('Nieoczekiwany błąd podczas autoryzacji');
  }
}

// Funkcja do sprawdzenia statusu autoryzacji
export async function checkAuthStatus(): Promise<boolean> {
  try {
    const token = await getAuthToken();
    return !!token;
  } catch (error) {
    console.error('Błąd sprawdzania statusu autoryzacji:', error);
    return false;
  }
} 