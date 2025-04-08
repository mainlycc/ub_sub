import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { policyId } = await request.json();
    
    // Pobranie tokena
    const tokenResponse = await fetch('https://test.v2.idefend.eu/api/login_check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'GAP_2025_PL',
        password: 'LEaBY4TXgWa4QJX'
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Błąd podczas pobierania tokena');
    }

    const { token } = await tokenResponse.json();

    // Inicjacja procesu podpisu SMS
    const signatureResponse = await fetch(`https://test.v2.idefend.eu/api/policies/${policyId}/signatures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type: "AUTHORIZED_BY_SMS"
      }),
    });

    if (!signatureResponse.ok) {
      const errorData = await signatureResponse.json();
      return NextResponse.json(
        { error: 'Błąd podczas inicjacji podpisu', details: errorData },
        { status: signatureResponse.status }
      );
    }

    const signatureResult = await signatureResponse.json();
    return NextResponse.json(signatureResult);
    
  } catch (error) {
    console.error('Błąd podczas wysyłania SMS:', error);
    return NextResponse.json(
      { error: 'Błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
} 