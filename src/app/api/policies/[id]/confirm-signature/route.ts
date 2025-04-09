import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;
    
    // Pobierz token autoryzacyjny
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Nie udało się uzyskać tokenu autoryzacyjnego' },
        { status: 401 }
      );
    }

    // Wysyłamy żądanie do właściwego API
    const response = await fetch(`https://test.v2.idefend.eu/api/policies/${id}/confirm-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Błąd odpowiedzi API:', responseData);
      return NextResponse.json(
        { error: responseData.error || 'Błąd podczas potwierdzania podpisu' },
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