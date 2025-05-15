import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

const API_BASE_URL = 'https://v2.idefend.eu/api';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').slice(-2, -1)[0];
    
    console.log('Pobieranie typów dokumentów dla polisy ID:', id);
    
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

    // Wysyłamy żądanie do API
    const response = await fetch(`${API_BASE_URL}/policies/${id}/missing-upload-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });
    
    console.log('Status odpowiedzi API:', response.status);
    console.log('Nagłówki odpowiedzi:', JSON.stringify(Object.fromEntries([...response.headers.entries()])));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Błąd odpowiedzi API:', errorText);
      return NextResponse.json(
        { error: 'Błąd podczas pobierania typów dokumentów' },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Błąd podczas przetwarzania żądania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
} 