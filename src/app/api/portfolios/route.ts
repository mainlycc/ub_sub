import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function GET() {
  try {
    console.log('Rozpoczynam pobieranie dostępnych opcji...');
    const authToken = await getAuthToken();
    
    if (!authToken) {
      console.error('Błąd autoryzacji: brak tokenu JWT');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - brak tokenu JWT' },
        { status: 401 }
      );
    }

    console.log('Token otrzymany, pobieram dostępne opcje...');
    
    const portfoliosResponse = await fetch('https://test.v2.idefend.eu/api/policies/creation/portfolios/', {
      headers: {
        'X-NODE-JWT-AUTH-TOKEN': authToken,
        'Accept': 'application/json'
      }
    });
    
    if (!portfoliosResponse.ok) {
      console.error('Błąd pobierania opcji:', portfoliosResponse.status, portfoliosResponse.statusText);
      const errorText = await portfoliosResponse.text();
      return NextResponse.json(
        { error: 'Nie udało się pobrać dostępnych opcji', details: errorText },
        { status: portfoliosResponse.status }
      );
    }
    
    const portfoliosData = await portfoliosResponse.json();
    console.log('Pobrane opcje:', JSON.stringify(portfoliosData, null, 2));
    
    return NextResponse.json(portfoliosData);
    
  } catch (error: unknown) {
    console.error('Błąd podczas pobierania opcji:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 