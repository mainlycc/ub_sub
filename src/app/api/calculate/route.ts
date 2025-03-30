import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Pobranie tokenu JWT
    console.log('Rozpoczynam proces autoryzacji...');
    const authToken = await getAuthToken();
    
    if (!authToken) {
      console.error('Błąd autoryzacji: brak tokenu JWT');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - brak tokenu JWT' },
        { status: 401 }
      );
    }
    
    console.log('Autoryzacja zakończona sukcesem - token JWT otrzymany');
    
    // Parsowanie danych z zapytania
    const reqData = await request.json();
    const { sellerNodeCode, productCode, saleInitiatedOn, vehicleSnapshot, options } = reqData;
    
    console.log('Przygotowane dane do wysłania:', JSON.stringify(reqData, null, 2));
    
    // Wywołanie API z poprawnym nagłówkiem autoryzacyjnym
    const apiResponse = await fetch('https://test.v2.idefend.eu/api/policies/creation/calculate-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(reqData)
    });
    
    // Analiza odpowiedzi
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      console.error('Odpowiedź API z błędem:', {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        data: errorData
      });
      
      return NextResponse.json(
        { error: `Błąd API: ${apiResponse.status}`, details: errorData },
        { status: apiResponse.status }
      );
    }
    
    // Przetworzenie danych odpowiedzi
    const data = await apiResponse.json();
    console.log('Otrzymana odpowiedź z API:', JSON.stringify(data, null, 2));
    
    // Przygotowanie odpowiedzi w oczekiwanym formacie
    return NextResponse.json({
      success: true,
      premium: data.premium,
      premiumNet: data.premiumNet,
      premiumTax: data.premiumTax,
      productName: data.productName,
      coveragePeriod: data.coveragePeriod,
      vehicleValue: data.vehicleValue,
      maxCoverage: data.maxCoverage,
      currency: data.currency || 'PLN'
    });
    
  } catch (error: unknown) {
    console.error('Błąd podczas kalkulacji:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    return NextResponse.json(
      { error: errorMessage || 'Wystąpił błąd podczas kalkulacji' },
      { status: 500 }
    );
  }
} 