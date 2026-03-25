import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { safeLog } from '@/lib/logger';
import { getCurrentEnvironment } from '@/lib/environment';
import { getSellerNodeCode } from '@/lib/seller';

// Dodajemy interfejs dla violation
interface ValidationViolation {
  propertyPath: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    safeLog.log('Dane wejściowe otrzymane w API:', data);
    
    // Walidacja podstawowych danych
    if (!data.vehicleSnapshot || !data.options) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane wejściowe' },
        { status: 400 }
      );
    }

    // Serwer jest źródłem prawdy dla sellerNodeCode (klient może nie mieć dostępu do prywatnych env var).
    const serverSellerNodeCode = getSellerNodeCode();
    const incomingSellerNodeCode = (data.sellerNodeCode || '').toString().trim();
    if (incomingSellerNodeCode !== serverSellerNodeCode) {
      data.sellerNodeCode = serverSellerNodeCode;
      safeLog.log('sellerNodeCode nadpisany wartością z serwera:', data.sellerNodeCode);
    }

    // Pobieramy token autoryzacyjny z istniejącej implementacji
    const token = await getAuthToken();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu JWT' },
        { status: 401 }
      );
    }

    safeLog.log('Wysyłanie danych do zewnętrznego API...');
    const environment = getCurrentEnvironment();
    // Wysyłamy żądanie do API
    const apiResponse = await fetch(`${environment.apiUrl}/policies/creation/calculate-offer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: JSON.stringify(data),
    });

    safeLog.log('Status odpowiedzi z API:', apiResponse.status, apiResponse.statusText);
    
    // Pobieramy odpowiedź jako tekst, aby móc ją zalogować w przypadku błędu
    const responseText = await apiResponse.text();
    safeLog.log('Odpowiedź z API (surowa):', responseText);
    
    try {
      // Próbujemy sparsować odpowiedź jako JSON
      const responseData = JSON.parse(responseText);
      safeLog.log('Odpowiedź z API (JSON):', JSON.stringify(responseData, null, 2));
      
      if (!apiResponse.ok) {
        safeLog.error('API odpowiedziało błędem:', responseText);
        
        // Jeśli mamy błędy walidacji (422), formatujemy je w czytelny sposób
        if (apiResponse.status === 422 && responseData.violations) {
          const errors = responseData.violations.map((v: ValidationViolation) => 
            `${v.propertyPath}: ${v.message}`
          ).join('\n');
          
          safeLog.log('Znaleziono błędy walidacji:', errors);
          
          return NextResponse.json(
            { error: `Błędy walidacji:\n${errors}` },
            { status: 422 }
          );
        }

        return NextResponse.json(
          { error: responseData.message || responseData.detail || 'Błąd podczas komunikacji z API' },
          { status: apiResponse.status }
        );
      }

      // Przekazujemy odpowiedź z API
      safeLog.log('Odpowiedź została poprawnie przetworzona, zwracam dane do klienta');
      return NextResponse.json(responseData);

    } catch (error) {
      safeLog.error('Nie udało się sparsować odpowiedzi:', responseText, 'Błąd:', error);
      return NextResponse.json(
        { error: 'Otrzymano nieprawidłową odpowiedź z API' },
        { status: 500 }
      );
    }

  } catch (error) {
    safeLog.error('Błąd podczas kalkulacji:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas kalkulacji' },
      { status: 500 }
    );
  }
} 