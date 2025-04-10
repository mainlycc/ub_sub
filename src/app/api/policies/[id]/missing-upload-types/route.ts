import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function GET(
  request: Request
) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').slice(-2, -1)[0];
    
    console.log('Pobieranie typów dokumentów dla polisy ID:', id);
    
    // Pobierz token autoryzacyjny
    const token = await getAuthToken();
    if (!token) {
      console.error('Nie udało się uzyskać tokenu autoryzacyjnego');
      return NextResponse.json(
        { error: 'Nie udało się uzyskać tokenu autoryzacyjnego' },
        { status: 401 }
      );
    }

    console.log('Token auth uzyskany:', token ? 'Tak' : 'Nie');

    // Wysyłamy żądanie do właściwego API
    const response = await fetch(`https://test.v2.idefend.eu/api/policies/${id}/missing-upload-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });
    
    console.log('Status odpowiedzi API:', response.status);
    console.log('Nagłówki odpowiedzi:', JSON.stringify(Object.fromEntries([...response.headers.entries()])));

    // Sprawdzamy najpierw status odpowiedzi
    if (response.status === 401 || response.status === 403) {
      console.error('Błąd autoryzacji w API Defend');
      return NextResponse.json(
        { error: 'Błąd autoryzacji. Token wygasł lub jest nieprawidłowy.' },
        { status: 401 }
      );
    }

    // Dla wszystkich typów odpowiedzi, próbujemy odczytać jako tekst
    const textResponse = await response.text();
    console.log('Odpowiedź API (pierwsze 200 znaków):', textResponse.substring(0, 200));
    
    // Sprawdzamy czy to JSON
    let jsonResponse;
    try {
      if (textResponse.trim()) {
        jsonResponse = JSON.parse(textResponse);
        console.log('Odpowiedź sparsowana jako JSON:', jsonResponse);
      } else {
        console.log('Pusta odpowiedź z API - brak wymaganych dokumentów');
        jsonResponse = [];
      }
    } catch (e) {
      console.error('Nie udało się sparsować odpowiedzi jako JSON:', e);
      
      // Jeśli status jest OK, ale nie jest to JSON, zwracamy pustą tablicę
      if (response.ok) {
        return NextResponse.json([], { status: 200 });
      } else {
        return NextResponse.json(
          { 
            error: 'Otrzymano nieprawidłową odpowiedź z API (nie JSON)',
            details: {
              status: response.status,
              contentType: response.headers.get('content-type'), 
              responsePreview: textResponse.substring(0, 100)
            }
          },
          { status: response.status }
        );
      }
    }

    // Jeśli odpowiedź nie jest OK, ale mamy JSON
    if (!response.ok) {
      console.error('Błąd odpowiedzi API:', jsonResponse);
      return NextResponse.json(
        { error: jsonResponse.error || jsonResponse.message || 'Błąd podczas pobierania typów dokumentów' },
        { status: response.status }
      );
    }

    // Sprawdzamy czy odpowiedź to tablica
    if (Array.isArray(jsonResponse)) {
      return NextResponse.json(jsonResponse);
    } else {
      // Jeśli to nie jest tablica, ale mamy poprawną odpowiedź, zwracamy pustą tablicę
      console.warn('Odpowiedź API nie jest tablicą:', jsonResponse);
      return NextResponse.json([]);
    }
    
  } catch (error) {
    console.error('Wyjątek podczas przetwarzania żądania:', error);
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