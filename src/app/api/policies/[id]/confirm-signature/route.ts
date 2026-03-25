import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { getCurrentEnvironment } from '@/lib/environment';
import { safeLog } from '@/lib/logger';
import { confirmSignatureSchema, validateRequest } from '@/lib/validations';

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const id = url.pathname.split('/').slice(-2, -1)[0];
    
    safeLog.log('Potwierdzanie SMS dla polisy ID:', id);
    
    // Walidacja danych wejściowych
    const validation = await validateRequest(confirmSignatureSchema, body);
    if (!validation.success) {
      safeLog.error('Brak kodu potwierdzającego w żądaniu');
      return NextResponse.json(
        { error: 'Brak kodu potwierdzającego', details: validation.errors },
        { status: 400 }
      );
    }
    
    // Pobierz token autoryzacyjny
    const token = await getAuthToken();
    if (!token) {
      safeLog.error('Nie udało się uzyskać tokenu autoryzacyjnego');
      return NextResponse.json(
        { error: 'Nie udało się uzyskać tokenu autoryzacyjnego' },
        { status: 401 }
      );
    }
    
    safeLog.log('Token auth uzyskany:', token ? 'Tak' : 'Nie');

    // Dane do wysłania do API
    const requestBody = {
      // Defend API oczekuje pola `confirmationCodeToConfirm` (nie `confirmationCode`)
      confirmationCodeToConfirm: validation.data.confirmationCode,
      // Zachowujemy kompatybilność, jeśli jakieś środowisko nadal akceptuje starą nazwę
      confirmationCode: validation.data.confirmationCode,
    };
    
    safeLog.log('Wysyłanie żądania do API Defend...');
    
    const environment = getCurrentEnvironment();
    // Wysyłamy żądanie do właściwego API - ZMIANA Z POST NA PUT!
    const responseAPI = await fetch(`${environment.apiUrl}/policies/${id}/confirm-signature`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: JSON.stringify(requestBody),
    });
    
    safeLog.log('Status odpowiedzi API:', responseAPI.status);
    safeLog.log('Nagłówki odpowiedzi:', JSON.stringify(Object.fromEntries([...responseAPI.headers.entries()])));

    // Sprawdzamy najpierw status odpowiedzi
    if (responseAPI.status === 401 || responseAPI.status === 403) {
      safeLog.error('Błąd autoryzacji w API Defend');
      return NextResponse.json(
        { error: 'Błąd autoryzacji. Token wygasł lub jest nieprawidłowy.' },
        { status: 401 }
      );
    }
    
    if (responseAPI.status === 400) {
      const textResponse = await responseAPI.text();
      safeLog.error('Błąd w żądaniu (400):', textResponse);
      
      // Próbujemy sparsować odpowiedź jako JSON, ale obsługujemy przypadek gdy to nie jest JSON
      try {
        const errorData = JSON.parse(textResponse);
        return NextResponse.json(
          { error: errorData.error || 'Nieprawidłowy kod SMS' },
          { status: 400 }
        );
      } catch {
        // Jeśli nie jest to prawidłowy JSON, zwracamy tekst odpowiedzi
        return NextResponse.json(
          { error: 'Nieprawidłowy kod SMS', details: textResponse },
          { status: 400 }
        );
      }
    }

    // Dla wszystkich innych typów odpowiedzi, próbujemy odczytać jako tekst
    const textResponse = await responseAPI.text();
    safeLog.log('Odpowiedź API (pierwsze 200 znaków):', textResponse.substring(0, 200));
    
    // Sprawdzamy czy to JSON
    let jsonResponse;
    try {
      if (textResponse.trim()) {
        jsonResponse = JSON.parse(textResponse);
        safeLog.log('Odpowiedź sparsowana jako JSON:', jsonResponse);
      } else {
        safeLog.log('Pusta odpowiedź z API');
        jsonResponse = { success: true };
      }
    } catch (e) {
      safeLog.error('Nie udało się sparsować odpowiedzi jako JSON:', e);
      
      // Jeśli status jest OK, ale nie jest to JSON, zwracamy sukces
      if (responseAPI.ok) {
        return NextResponse.json(
          { success: true, message: 'Podpis potwierdzony pomyślnie' },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { 
            error: 'Otrzymano nieprawidłową odpowiedź z API (nie JSON)',
            details: {
              status: responseAPI.status,
              contentType: responseAPI.headers.get('content-type'), 
              responsePreview: textResponse.substring(0, 100)
            }
          },
          { status: responseAPI.status }
        );
      }
    }

    // Jeśli odpowiedź nie jest OK, ale mamy JSON
    if (!responseAPI.ok) {
      safeLog.error('Błąd odpowiedzi API:', jsonResponse);
      return NextResponse.json(
        { error: jsonResponse.error || jsonResponse.message || 'Błąd podczas potwierdzania podpisu' },
        { status: responseAPI.status }
      );
    }

    // Wszystko OK, zwracamy odpowiedź
    return NextResponse.json(jsonResponse || { success: true });
    
  } catch (error) {
    safeLog.error('Wyjątek podczas przetwarzania żądania:', error);
    return NextResponse.json(
      { 
        error: 'Wystąpił błąd podczas przetwarzania żądania',
        details: error instanceof Error ? error.message : 'Nieznany błąd',
        type: error instanceof Error ? error.name : 'Unknown'
      },
      { status: 500 }
    );
  }
} 