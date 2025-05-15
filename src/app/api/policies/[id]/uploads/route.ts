import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

const API_BASE_URL = 'https://v2.idefend.eu/api';

export async function POST(
  request: Request
) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').slice(-2, -1)[0];
    
    // Pobierz token autoryzacyjny
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Nie udało się uzyskać tokenu autoryzacyjnego' },
        { status: 401 }
      );
    }

    // Sprawdzanie czy otrzymaliśmy dane formularza
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format danych. Oczekiwano multipart/form-data' },
        { status: 400 }
      );
    }

    // Odczytanie danych formularza
    const formData = await request.formData();
    
    // Upewnijmy się, że mamy plik
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Brak pliku w żądaniu' },
        { status: 400 }
      );
    }

    // Upewnijmy się, że mamy typ dokumentu
    const documentType = formData.get('documentType');
    if (!documentType || typeof documentType !== 'string') {
      return NextResponse.json(
        { error: 'Brak typu dokumentu w żądaniu' },
        { status: 400 }
      );
    }

    // Tworzymy nowe FormData do wysłania do API
    const apiFormData = new FormData();
    apiFormData.append('file', file);
    apiFormData.append('documentType', documentType);

    // Wysyłamy żądanie do API
    const response = await fetch(`${API_BASE_URL}/policies/${id}/uploads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Błąd odpowiedzi API:', errorData);
      return NextResponse.json(
        { error: 'Błąd podczas przesyłania pliku' },
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