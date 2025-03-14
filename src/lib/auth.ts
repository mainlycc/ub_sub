import axios, { AxiosError, AxiosResponse } from 'axios';

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

// Stałe konfiguracyjne
const AUTH_CREDENTIALS = {
  username: "GAP_2025_PL",
  password: "LEaBY4TXgWa4QJX"
};

// Funkcja do autoryzacji i uzyskania tokenu JWT
export async function getAuthToken(): Promise<string | null> {
  try {
    // Sprawdź czy mamy ważny token w cache
    if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
      console.log('Używam zapisanego tokenu');
      return cachedToken;
    }

    console.log('Pobieranie nowego tokenu...');
    
    const response = await axios.post<{token: string; expiresIn?: number}>(
      'https://test.v2.idefend.eu/api/jwt-token',
      AUTH_CREDENTIALS,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Odpowiedź z serwera:', {
      status: response.status,
      hasToken: !!response.data?.token
    });

    if (!response.data?.token) {
      console.error('Brak tokenu w odpowiedzi:', response.data);
      throw new Error('Brak tokenu w odpowiedzi');
    }

    // Zapisz token w cache
    cachedToken = response.data.token;
    tokenExpiration = Date.now() + 14 * 60 * 1000; // 14 minut
    console.log('Nowy token zapisany');

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
    
    throw new Error('Błąd autoryzacji');
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