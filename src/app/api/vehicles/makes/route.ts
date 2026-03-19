import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { getCurrentEnvironment } from '@/lib/environment';
import { safeLog } from '@/lib/logger';

export async function GET() {
  safeLog.log('[vehicles/makes] Otrzymano zapytanie GET');
  
  try {
    // Pobranie tokena
    safeLog.log('[vehicles/makes] Próba pobrania tokena...');
    const token = await getAuthToken();
    
    if (!token) {
      safeLog.error('[vehicles/makes] Błąd autoryzacji: brak tokenu');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu' },
        { status: 401 }
      );
    }
    
    safeLog.log('[vehicles/makes] Token otrzymany pomyślnie');

    const environment = getCurrentEnvironment();
    // Wywołanie API DEFEND
    const response = await fetch(`${environment.apiUrl}/vehicles/makes?pagination=false`, {
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });

    if (!response.ok) {
      safeLog.error('[vehicles/makes] Błąd odpowiedzi API:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Błąd podczas pobierania marek: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    safeLog.log('[vehicles/makes] Pobrano dane:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    safeLog.error('[vehicles/makes] Nieoczekiwany błąd:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania marek' },
      { status: 500 }
    );
  }
} 