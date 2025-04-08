import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

// Prosty endpoint testowy do sprawdzenia połączenia z API Defend
export async function GET() {
  try {
    console.log('[test-api] Próba pobrania tokena...');
    const token = await getAuthToken();
    
    if (!token) {
      console.error('[test-api] Błąd autoryzacji: getAuthToken() zwrócił null');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu JWT' },
        { status: 401 }
      );
    }
    
    console.log('[test-api] Token otrzymany pomyślnie');
    
    // Proste zapytanie do API - pobieramy dostępne kody produktów
    const apiResponse = await fetch('https://test.v2.idefend.eu/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });
    
    if (!apiResponse.ok) {
      console.error('[test-api] Błąd zapytania do API:', {
        status: apiResponse.status,
        statusText: apiResponse.statusText
      });
      
      let errorData;
      try {
        errorData = await apiResponse.json();
      } catch (e) {
        errorData = await apiResponse.text();
      }
      
      return NextResponse.json(
        { error: `Błąd komunikacji z API: ${apiResponse.status} ${apiResponse.statusText}`, details: errorData },
        { status: apiResponse.status }
      );
    }
    
    const products = await apiResponse.json();
    console.log('[test-api] Pobrano listę produktów:', JSON.stringify(products, null, 2));
    
    return NextResponse.json({
      message: 'Połączenie z API działa poprawnie',
      token: token.substring(0, 10) + '...',
      products
    });
    
  } catch (error) {
    console.error('[test-api] Nieoczekiwany błąd:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Nieznany błąd podczas testowania API' },
      { status: 500 }
    );
  }
} 