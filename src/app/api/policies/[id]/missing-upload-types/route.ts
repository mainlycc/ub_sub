import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { getCurrentEnvironment } from '@/lib/environment';
import { safeLog } from '@/lib/logger';

/** API Platform czasem zwraca tablicę, czasem kolekcję JSON-LD z hydra:member. */
function coerceMissingUploadTypesList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const o = payload as Record<string, unknown>;
    if (Array.isArray(o['hydra:member'])) return o['hydra:member'];
    if (Array.isArray(o.member)) return o.member;
    if (Array.isArray(o.data)) return o.data;
  }
  return [];
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    safeLog.log('Pobieranie typów dokumentów dla polisy ID:', id);
    
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

    const environment = getCurrentEnvironment();
    // Wysyłamy żądanie do właściwego API
    const response = await fetch(`${environment.apiUrl}/policies/${id}/missing-upload-types`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, application/ld+json;q=0.9',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });
    
    safeLog.log('Status odpowiedzi API:', response.status);
    safeLog.log('Nagłówki odpowiedzi:', JSON.stringify(Object.fromEntries([...response.headers.entries()])));

    // Sprawdzamy najpierw status odpowiedzi
    if (response.status === 401 || response.status === 403) {
      safeLog.error('Błąd autoryzacji w API Defend');
      return NextResponse.json(
        { error: 'Błąd autoryzacji. Token wygasł lub jest nieprawidłowy.' },
        { status: 401 }
      );
    }

    // Dla wszystkich typów odpowiedzi, próbujemy odczytać jako tekst
    const textResponse = await response.text();
    safeLog.log('Odpowiedź API (pierwsze 200 znaków):', textResponse.substring(0, 200));
    
    // Sprawdzamy czy to JSON
    let jsonResponse;
    try {
      if (textResponse.trim()) {
        jsonResponse = JSON.parse(textResponse);
        safeLog.log('Odpowiedź sparsowana jako JSON:', jsonResponse);
      } else {
        safeLog.log('Pusta odpowiedź z API - brak wymaganych dokumentów');
        jsonResponse = [];
      }
    } catch (e) {
      safeLog.error('Nie udało się sparsować odpowiedzi jako JSON:', e);
      
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
      safeLog.error('Błąd odpowiedzi API:', jsonResponse);
      return NextResponse.json(
        { error: jsonResponse.error || jsonResponse.message || 'Błąd podczas pobierania typów dokumentów' },
        { status: response.status }
      );
    }

    const asList = coerceMissingUploadTypesList(jsonResponse);
    if (!Array.isArray(jsonResponse) && asList.length > 0) {
      safeLog.log('Odpowiedź API: rozpakowano kolekcję (np. hydra:member), elementów:', asList.length);
    }
    return NextResponse.json(asList);
    
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