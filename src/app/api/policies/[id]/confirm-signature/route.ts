import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { NextRequest } from 'next/server';

const API_BASE_URL = 'https://v2.idefend.eu/api';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const url = new URL(request.url);
    const id = url.pathname.split('/').slice(-2, -1)[0];
    
    console.log('Potwierdzanie SMS dla polisy ID:', id);
    console.log('Dane żądania:', JSON.stringify(data));
    
    // Sprawdź czy mamy kod potwierdzający
    if (!data.confirmationCode) {
      console.error('Brak kodu potwierdzającego w żądaniu');
      return NextResponse.json(
        { error: 'Brak kodu potwierdzającego' },
        { status: 400 }
      );
    }
    
    // Pobierz token autoryzacyjny
    const token = await getAuthToken();
    if (!token) {
      console.error('Nie udało się uzyskać tokenu autoryzacyjnego');
      return NextResponse.json(
        { error: 'Nie udało się uzyskać tokenu autoryzacyjnego' },
        { status: 401 }
      );
    }
    
    console.log('Token auth uzyskany:', token ? 'Tak' : 'Nie');

    // Dane do wysłania do API
    const requestBody = {
      confirmationCode: data.confirmationCode
    };
    
    console.log('Wysyłanie żądania do API...');
    
    // Wysyłamy żądanie do API
    const responseAPI = await fetch(`${API_BASE_URL}/policies/${id}/confirm-signature`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Status odpowiedzi API:', responseAPI.status);
    console.log('Nagłówki odpowiedzi:', JSON.stringify(Object.fromEntries([...responseAPI.headers.entries()])));

    // Sprawdzamy status odpowiedzi
    if (!responseAPI.ok) {
      const errorText = await responseAPI.text();
      console.error('Błąd odpowiedzi API:', errorText);
      return NextResponse.json(
        { error: 'Błąd podczas potwierdzania podpisu' },
        { status: responseAPI.status }
      );
    }

    const responseData = await responseAPI.json();
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Błąd podczas przetwarzania żądania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
} 