import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;
    
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
    
    console.log('Wysyłanie żądania do API Defend...');
    
    // Wysyłamy żądanie do właściwego API - ZMIANA Z POST NA PUT!
    const response = await fetch(`https://test.v2.idefend.eu/api/policies/${id}/confirm-signature`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Status odpowiedzi API:', response.status);
    console.log('Nagłówki odpowiedzi:', JSON.stringify(Object.fromEntries([...response.headers.entries()])));

    // Sprawdzamy najpierw status odpowiedzi
    if (response.status === 401 || response.status === 403) {
      console.error('Błąd autoryzacji w API Defend');
      return NextResponse.json(
        { error: 'Błąd autoryzacji. Token wygasł lub jest nieprawidłowy.' },
        { status: 401 }
      );
    }
    
    if (response.status === 400) {
      const textResponse = await response.text();
      console.error('Błąd w żądaniu (400):', textResponse);
      
      // Próbujemy sparsować odpowiedź jako JSON, ale obsługujemy przypadek gdy to nie jest JSON
      try {
        const errorData = JSON.parse(textResponse);
        return NextResponse.json(
          { error: errorData.error || 'Nieprawidłowy kod SMS' },
          { status: 400 }
        );
      } catch {
        // Jeśli nie jest to prawidłowy JSON, zwracamy tekst odpowiedzi
        return NextResponse.json(
          { error: 'Nieprawidłowy kod SMS', details: textResponse },
          { status: 400 }
        );
      }
    }

    // Dla wszystkich innych typów odpowiedzi, próbujemy odczytać jako tekst
    const textResponse = await response.text();
    console.log('Odpowiedź API (pierwsze 200 znaków):', textResponse.substring(0, 200));
    
    // Sprawdzamy czy to JSON
    let jsonResponse;
    try {
      if (textResponse.trim()) {
        jsonResponse = JSON.parse(textResponse);
        console.log('Odpowiedź sparsowana jako JSON:', jsonResponse);
      } else {
        console.log('Pusta odpowiedź z API');
        jsonResponse = { success: true };
      }
    } catch (e) {
      console.error('Nie udało się sparsować odpowiedzi jako JSON:', e);
      
      // Jeśli status jest OK, ale nie jest to JSON, zwracamy sukces
      if (response.ok) {
        return NextResponse.json(
          { success: true, message: 'Podpis potwierdzony pomyślnie' },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { 
            error: 'Otrzymano nieprawidłową odpowiedź z API (nie JSON)',
            details: {
              status: response.status,
              contentType: response.headers.get('content-type'), 
              responsePreview: textResponse.substring(0, 100)
            }
          },
          { status: response.status }
        );
      }
    }

    // Jeśli odpowiedź nie jest OK, ale mamy JSON
    if (!response.ok) {
      console.error('Błąd odpowiedzi API:', jsonResponse);
      return NextResponse.json(
        { error: jsonResponse.error || jsonResponse.message || 'Błąd podczas potwierdzania podpisu' },
        { status: response.status }
      );
    }

    // Wszystko OK, zwracamy odpowiedź
    return NextResponse.json(jsonResponse || { success: true });
    
  } catch (error) {
    console.error('Wyjątek podczas przetwarzania żądania:', error);
    return NextResponse.json(
      { 
        error: 'Wystąpił błąd podczas przetwarzania żądania',
        details: error instanceof Error ? error.message : 'Nieznany błąd',
        type: error instanceof Error ? error.name : 'Unknown'
      },
      { status: 500 }
    );
  }
} 