import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Pobierz token autoryzacyjny
    let token: string;
    try {
      token = await getAuthToken() as string;
    } catch (error) {
      console.error('Błąd autoryzacji:', error);
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się uzyskać tokenu' },
        { status: 401 }
      );
    }

    // Wysyłamy żądanie do właściwego API
    const response = await fetch('https://test.v2.idefend.eu/api/policies/calculation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data,
        sellerNodeCode: 'PL_TEST_GAP_25', // Stały kod sprzedawcy z dokumentacji
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Błąd odpowiedzi API:', responseData);
      return NextResponse.json(
        { error: responseData.error || 'Błąd podczas kalkulacji składki' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Błąd podczas przetwarzania żądania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
} 