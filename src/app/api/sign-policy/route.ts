import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function POST(request: Request) {
  console.log('[sign-policy] Otrzymano zapytanie POST');
  try {
    const { policyId, signatureType } = await request.json();
    console.log('[sign-policy] Dane wejściowe:', { policyId, signatureType });
    
    // Walidacja parametrów wejściowych
    if (!policyId) {
      console.error('[sign-policy] Brak wymaganego policyId');
      return NextResponse.json(
        { error: 'Wymagany jest identyfikator polisy (policyId)' },
        { status: 400 }
      );
    }
    
    // Pobranie tokena
    console.log('[sign-policy] Próba pobrania tokena...');
    const token = await getAuthToken();
    
    if (!token) {
      console.error('[sign-policy] Błąd autoryzacji: getAuthToken() zwrócił null');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu JWT' },
        { status: 401 }
      );
    }
    
    console.log('[sign-policy] Token otrzymany pomyślnie');
    
    // Inicjacja procesu podpisu
    console.log(`[sign-policy] Próba podpisu polisy o ID: ${policyId}`);
    const signatureResponse = await fetch(`https://test.v2.idefend.eu/api/policies/${policyId}/signatures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: JSON.stringify({
        type: signatureType || "AUTHORIZED_BY_SMS"
      }),
    });

    if (!signatureResponse.ok) {
      let errorData;
      try {
        errorData = await signatureResponse.json();
      } catch (e) {
        errorData = await signatureResponse.text();
      }
      
      console.error('[sign-policy] Błąd podczas podpisywania polisy:', {
        status: signatureResponse.status,
        statusText: signatureResponse.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        { error: `Błąd podczas podpisywania polisy: ${signatureResponse.status} ${signatureResponse.statusText}`, details: errorData },
        { status: signatureResponse.status }
      );
    }

    const signatureResult = await signatureResponse.json();
    console.log('[sign-policy] Polisa podpisana pomyślnie:', JSON.stringify(signatureResult, null, 2));
    
    return NextResponse.json({
      success: true,
      policyId: policyId,
      signatureDetails: signatureResult
    });
    
  } catch (error) {
    console.error('[sign-policy] Szczegóły błędu:', {
      message: error instanceof Error ? error.message : 'Nieznany błąd',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
} 