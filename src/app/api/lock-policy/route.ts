import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function POST(request: Request) {
  console.log('[lock-policy] Otrzymano zapytanie POST');
  try {
    const data = await request.json();
    console.log('[lock-policy] Otrzymane dane:', JSON.stringify(data, null, 2));
    
    // Podstawowa walidacja danych
    if (!data.productCode || !data.sellerNodeCode || !data.vehicleSnapshot || !data.options || !data.client) {
      console.error('[lock-policy] Brak wymaganych danych');
      return NextResponse.json(
        { error: 'Brak wymaganych danych do zablokowania polisy' },
        { status: 400 }
      );
    }
    
    // Pobranie tokena
    console.log('[lock-policy] Próba pobrania tokena...');
    const token = await getAuthToken();
    
    if (!token) {
      console.error('[lock-policy] Błąd autoryzacji: getAuthToken() zwrócił null');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu JWT' },
        { status: 401 }
      );
    }
    
    console.log('[lock-policy] Token otrzymany pomyślnie');
    
    // Przygotowanie danych - upewniamy się, że mamy wymagane pola zgodnie z dokumentacją
    const lockData = {
      ...data,
      // Dodajemy brakujące pola jeśli ich nie ma
      signatureTypeCode: data.signatureTypeCode || "AUTHORIZED_BY_SMS",
      saleInitiatedOn: data.saleInitiatedOn || new Date().toISOString().split('T')[0],
      
      // Upewniamy się, że jeśli podana jest wartość premium, to jest w formacie groszowym (API oczekuje int)
      premium: data.premium ? Math.round(data.premium * 100) : undefined,
      
      // Upewniamy się, że vehicleSnapshot ma odpowiedni format
      vehicleSnapshot: {
        ...data.vehicleSnapshot,
        // Konwersja cen na grosze
        purchasePrice: Math.round(data.vehicleSnapshot.purchasePrice * 100),
        purchasePriceNet: data.vehicleSnapshot.purchasePriceNet ? 
          Math.round(data.vehicleSnapshot.purchasePriceNet * 100) : 
          Math.round(data.vehicleSnapshot.purchasePrice * 100),
        
        // Dodajemy właścicieli, jeśli nie są podani
        owners: data.vehicleSnapshot.owners || [{
          contact: {
            inheritFrom: "policyHolder"
          }
        }]
      },
      
      // Upewniamy się, że client ma wymagane sekcje
      client: {
        ...data.client,
        insured: data.client.insured || { inheritFrom: "policyHolder" },
        beneficiary: data.client.beneficiary || { inheritFrom: "policyHolder" }
      }
    };
    
    console.log('[lock-policy] Dane do wysłania:', JSON.stringify(lockData, null, 2));
    
    // Wywołanie blokowania polisy
    console.log('[lock-policy] Próba wykonania blokowania polisy...');
    const lockResponse = await fetch('https://test.v2.idefend.eu/api/policies/creation/lock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: JSON.stringify(lockData),
    });

    if (!lockResponse.ok) {
      let errorData;
      try {
        errorData = await lockResponse.json();
      } catch (e) {
        errorData = await lockResponse.text();
      }
      
      console.error('[lock-policy] Błąd podczas blokowania polisy:', {
        status: lockResponse.status,
        statusText: lockResponse.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        { error: `Błąd podczas blokowania polisy: ${lockResponse.status} ${lockResponse.statusText}`, details: errorData },
        { status: lockResponse.status }
      );
    }

    const lockResult = await lockResponse.json();
    console.log('[lock-policy] Polisa zablokowana pomyślnie:', JSON.stringify(lockResult, null, 2));
    
    return NextResponse.json({
      success: true,
      policyId: lockResult.policyId,
      policyDetails: lockResult
    });
    
  } catch (error) {
    console.error('[lock-policy] Szczegóły błędu:', {
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