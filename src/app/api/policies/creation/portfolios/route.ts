import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function GET(_request: Request) {
  console.log('[policies/portfolios] Otrzymano zapytanie GET');
  try {
    console.log('[policies/portfolios] Próba pobrania tokena...');
    const token = await getAuthToken();
    
    if (!token) {
      console.error('[policies/portfolios] Błąd autoryzacji: getAuthToken() zwrócił null');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu JWT' },
        { status: 401 }
      );
    }
    
    console.log('[policies/portfolios] Token otrzymany pomyślnie');

    const response = await fetch('https://test.v2.idefend.eu/api/policies/creation/portfolios', {
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });

    if (!response.ok) {
      console.error('[policies/portfolios] Błąd podczas pobierania portfolios:', {
        status: response.status,
        statusText: response.statusText
      });
      return NextResponse.json(
        { error: `Błąd podczas pobierania portfolios: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[policies/portfolios] Pobrano dane portfolios');
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[policies/portfolios] Nieoczekiwany błąd:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Nieznany błąd podczas pobierania portfolios' },
      { status: 500 }
    );
  }
} 