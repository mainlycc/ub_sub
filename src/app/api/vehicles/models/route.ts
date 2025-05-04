import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { getCurrentEnvironment } from '@/lib/environment';

export async function GET(request: Request) {
  console.log('[vehicles/models] Otrzymano zapytanie GET');
  
  try {
    // Pobranie tokena
    console.log('[vehicles/models] Próba pobrania tokena...');
    const token = await getAuthToken();
    
    if (!token) {
      console.error('[vehicles/models] Błąd autoryzacji: brak tokenu');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu' },
        { status: 401 }
      );
    }

    // Pobierz parametr makeId z URL
    const url = new URL(request.url);
    const makeId = url.searchParams.get('makeId');
    
    console.log('[vehicles/models] Token otrzymany pomyślnie, makeId:', makeId);

    const environment = getCurrentEnvironment();
    // Konstruowanie URL API
    let apiUrl = `${environment.apiUrl}/vehicles/models`;
    
    // Dodajemy parametry do URL
    const params = new URLSearchParams();
    params.append('pagination', 'false');
    
    if (makeId) {
      // Używamy makeId jako parametru do filtrowania
      params.append('makeId', makeId);
    }
    
    apiUrl += `?${params.toString()}`;

    console.log('[vehicles/models] Wywołanie API:', apiUrl);

    // Wywołanie API DEFEND z poprawnym nagłówkiem autoryzacji
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });

    if (!response.ok) {
      console.error('[vehicles/models] Błąd odpowiedzi API:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('[vehicles/models] Szczegóły błędu:', errorData);
      return NextResponse.json(
        { error: `Błąd podczas pobierania modeli: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[vehicles/models] Pobrano dane:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('[vehicles/models] Nieoczekiwany błąd:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania modeli' },
      { status: 500 }
    );
  }
}