import axios, { AxiosError } from 'axios';

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

// Stałe konfiguracyjne
const AUTH_CREDENTIALS = {
  username: "GAP_2025_PL",
  password: "LEaBY4TXgWa4QJX"
};

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

    console.log('Pobieranie nowego tokenu...');
    
    const response = await axios.post<AuthResponse>(
      'https://test.v2.idefend.eu/api/jwt-token',
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
    // Resetuj cache w przypadku błędu
    cachedToken = null;
    tokenExpiration = null;
    
    if (axios.isAxiosError(error)) {
      const apiError = error as AxiosError<ErrorResponse>;
      console.error('Błąd autoryzacji:', {
        message: apiError.message,
        response: apiError.response?.data,
        status: apiError.response?.status,
        code: apiError.code
      });
      
      if (apiError.response?.status === 401) {
        throw new Error('Nieprawidłowe dane uwierzytelniające');
      } else if (apiError.code === 'ECONNABORTED') {
        throw new Error('Timeout podczas próby autoryzacji');
      } else if (!apiError.response) {
        throw new Error('Brak połączenia z serwerem autoryzacji');
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