import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { getCurrentEnvironment } from '@/lib/environment';

export async function GET() {
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

    const environment = getCurrentEnvironment();
    const response = await fetch(`${environment.apiUrl}/policies/creation/portfolios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });

    if (response.status === 401 || response.status === 403) {
      console.error('[policies/portfolios] Błąd autoryzacji:', {
        status: response.status,
        statusText: response.statusText
      });
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nieprawidłowy token lub brak uprawnień' },
        { status: response.status }
      );
    }

    if (!response.ok) {
      console.error('[policies/portfolios] Błąd podczas pobierania portfolios:', {
        status: response.status,
        statusText: response.statusText
      });
      
      // Próba odczytania szczegółów błędu z odpowiedzi
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = await response.text();
      }
      
      console.error('[policies/portfolios] Szczegóły błędu:', errorDetails);
      
      return NextResponse.json(
        { 
          error: 'Błąd podczas pobierania portfolios',
          details: errorDetails
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[policies/portfolios] Pobrano dane portfolios');
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[policies/portfolios] Nieoczekiwany błąd:', error);
    return NextResponse.json(
      { 
        error: 'Nieoczekiwany błąd podczas pobierania portfolios',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      },
      { status: 500 }
    );
  }
} 