import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Pobieramy parametry z URL
    const url = new URL(request.url);
    const nodeCode = url.searchParams.get('nodeCode') || 'PL_TEST_GAP_25';
    
    console.log(`[test-products] Pobieranie produktów dla węzła: ${nodeCode}`);
    
    // Pobranie tokena
    const token = await getAuthToken();
    
    if (!token) {
      console.error('[test-products] Błąd autoryzacji: getAuthToken() zwrócił null');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu JWT' },
        { status: 401 }
      );
    }
    
    console.log('[test-products] Token otrzymany pomyślnie');
    
    // Pobieramy listę produktów
    const response = await fetch('https://test.v2.idefend.eu/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });
    
    if (!response.ok) {
      console.error('[test-products] Błąd podczas pobierania produktów:', {
        status: response.status,
        statusText: response.statusText
      });
      return NextResponse.json(
        { error: `Błąd podczas pobierania produktów: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const products = await response.json();
    console.log(`[test-products] Pobrano ${products.length} produktów`);
    
    // Teraz pobierzmy portfolio dla konkretnego węzła
    const portfolioResponse = await fetch(`https://test.v2.idefend.eu/api/nodes/${nodeCode}/portfolios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });
    
    let portfolioData = null;
    let availableProducts = [];
    
    if (portfolioResponse.ok) {
      portfolioData = await portfolioResponse.json();
      console.log(`[test-products] Pobrano portfolio dla węzła ${nodeCode}`);
      
      // Wyciągnij produkty dostępne dla tego węzła
      if (portfolioData && Array.isArray(portfolioData)) {
        availableProducts = portfolioData.map(item => ({
          productCode: item.productCode,
          status: item.status,
          effectiveFrom: item.effectiveFrom,
          effectiveTo: item.effectiveTo
        }));
      }
    } else {
      console.warn(`[test-products] Nie udało się pobrać portfolio dla węzła ${nodeCode}:`, {
        status: portfolioResponse.status,
        statusText: portfolioResponse.statusText
      });
    }
    
    return NextResponse.json({
      allProducts: products,
      nodePortfolio: portfolioData,
      availableProducts
    });
    
  } catch (error) {
    console.error('[test-products] Błąd podczas przetwarzania:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Nieznany błąd' },
      { status: 500 }
    );
  }
} 