import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { VehicleData, InsuranceVariant } from '@/types/insurance';

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
    const { vehicleData, variant } = reqData;
    
    console.log('Przygotowane dane do wysłania:', JSON.stringify(reqData, null, 2));
    
    // Symulacja kalkulacji
    const basePremium = vehicleData.purchasePrice * 0.05; // 5% ceny zakupu
    const coveragePeriod = 5; // 5 lat
    const maxCoverage = vehicleData.purchasePrice * 1.2; // 120% ceny zakupu

    // Symulacja różnych wariantów
    let premiumMultiplier = 1;
    let coverageMultiplier = 1;

    switch (variant.productCode) {
      case '5_DCGAP_MG25_GEN': // GAP MAX
        premiumMultiplier = 1.2;
        coverageMultiplier = 1.2;
        break;
      case '5_DCGAP_F25_GEN': // GAP FLEX
        premiumMultiplier = 1.1;
        coverageMultiplier = 1.1;
        break;
      case '5_DCGAP_FG25_GEN': // GAP FLEX GO
        premiumMultiplier = 1.15;
        coverageMultiplier = 1.15;
        break;
      default:
        premiumMultiplier = 1;
        coverageMultiplier = 1;
    }

    const premium = basePremium * premiumMultiplier;
    const maxCoverageAmount = maxCoverage * coverageMultiplier;

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
      premium: Math.round(premium * 100) / 100,
      premiumNet: data.premiumNet,
      premiumTax: data.premiumTax,
      productName: data.productName,
      coveragePeriod,
      vehicleValue: data.vehicleValue,
      maxCoverage: Math.round(maxCoverageAmount * 100) / 100,
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