import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function GET() {
  console.log('[vehicles/makes] Otrzymano zapytanie GET');
  
  try {
    // Pobranie tokena
    console.log('[vehicles/makes] Próba pobrania tokena...');
    const token = await getAuthToken();
    
    if (!token) {
      console.error('[vehicles/makes] Błąd autoryzacji: brak tokenu');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu' },
        { status: 401 }
      );
    }
    
    console.log('[vehicles/makes] Token otrzymany pomyślnie');

    // Wywołanie API DEFEND
    const response = await fetch('https://test.v2.idefend.eu/api/vehicles/makes?pagination=false', {
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });

    if (!response.ok) {
      console.error('[vehicles/makes] Błąd odpowiedzi API:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Błąd podczas pobierania marek: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[vehicles/makes] Pobrano dane:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('[vehicles/makes] Nieoczekiwany błąd:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania marek' },
      { status: 500 }
    );
  }
} 