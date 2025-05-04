import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { getCurrentEnvironment } from '@/lib/environment';
import { getSellerNodeCode, validateSellerNodeCode } from '@/lib/seller';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Walidacja sellerNodeCode
    if (!validateSellerNodeCode(data.sellerNodeCode)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy kod sprzedawcy dla bieżącego środowiska' },
        { status: 400 }
      );
    }
    
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

    const environment = getCurrentEnvironment();
    // Wysyłamy żądanie do właściwego API
    const response = await fetch(`${environment.apiUrl}/policies/calculation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data,
        sellerNodeCode: getSellerNodeCode(), // Używamy prawidłowego kodu sprzedawcy
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