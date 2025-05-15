import axios, { AxiosError, AxiosResponse } from 'axios';

// Stałe konfiguracyjne dla autoryzacji
const AUTH_CREDENTIALS = {
  username: 'GAP_2025_PL',
  password: 'LEaBY4TXgWa4QJX'
};

const API_AUTH_URL = 'https://v2.idefend.eu/api/jwt-token';

// Interfejsy dla typów danych
interface AuthResponse {
  token: string;
  expiresIn?: number;
}

// Cache dla tokena
let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

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

    console.log('Pobieranie nowego tokenu...');
    
    const response = await axios.post<AuthResponse>(
      API_AUTH_URL,
      AUTH_CREDENTIALS,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 sekund timeout
      }
    );

    console.log('Odpowiedź z serwera autoryzacji:', {
      status: response.status,
      hasToken: !!response.data?.token,
      expiresIn: response.data?.expiresIn
    });

    if (!response.data?.token) {
      console.error('Brak tokenu w odpowiedzi:', response.data);
      throw new Error('Brak tokenu w odpowiedzi z serwera autoryzacji');
    }
    
    // Zapisz token w cache
    cachedToken = response.data.token;
    // Jeśli serwer zwraca expiresIn, użyj tej wartości, w przeciwnym razie użyj 14 minut
    const expirationTime = response.data.expiresIn 
      ? response.data.expiresIn * 1000  // konwersja na milisekundy
      : 14 * 60 * 1000; // 14 minut
    
    tokenExpiration = Date.now() + expirationTime;
    console.log('Nowy token zapisany, wygasa za:', Math.floor(expirationTime / 1000 / 60), 'minut');

    return cachedToken;

  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Błąd podczas pobierania tokenu:', {
      message: axiosError.message,
      response: axiosError.response?.data
    });
    return null;
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