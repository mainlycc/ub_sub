import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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

    // Wysyłamy żądanie do właściwego API
    const response = await fetch(`https://test.v2.idefend.eu/api/policies/${id}/uploads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: apiFormData,
    });

    // Sprawdzamy typ zawartości odpowiedzi
    const responseContentType = response.headers.get('content-type');
    if (!responseContentType || !responseContentType.includes('application/json')) {
      // Jeśli to nie JSON, odczytujemy jako tekst
      const textResponse = await response.text();
      console.error('Odpowiedź API nie jest w formacie JSON:', textResponse.substring(0, 200));
      
      return NextResponse.json(
        { 
          error: 'Otrzymano nieprawidłową odpowiedź z API (nie JSON)',
          details: {
            contentType: responseContentType, 
            responsePreview: textResponse.substring(0, 100)
          }
        },
        { status: 500 }
      );
    }

    // Odczytaj odpowiedź jako JSON
    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      console.error('Błąd parsowania JSON:', error);
      return NextResponse.json(
        { 
          error: 'Nie udało się sparsować odpowiedzi JSON z API',
          details: error instanceof Error ? error.message : 'Nieznany błąd'
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('Błąd odpowiedzi API:', responseData);
      return NextResponse.json(
        { error: responseData.error || 'Błąd podczas wysyłania dokumentu' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Błąd podczas przetwarzania żądania:', error);
    return NextResponse.json(
      { 
        error: 'Wystąpił błąd podczas przetwarzania żądania',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      },
      { status: 500 }
    );
  }
} 