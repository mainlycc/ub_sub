import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

interface ConfirmationPayload {
  policyId: string;
  confirmationCode: string;
}

export async function POST(request: NextRequest) { // Używamy POST, jest bardziej powszechne dla akcji
  try {
    const data: ConfirmationPayload = await request.json();
    console.log('Otrzymane dane do potwierdzenia podpisu:', data);

    if (!data.policyId || !data.confirmationCode) {
      console.error('Błąd: Brak policyId lub confirmationCode w payloadzie potwierdzenia');
      return NextResponse.json({ error: 'Brak wymaganych danych' }, { status: 400 });
    }

    const token = await getAuthToken();
    if (!token) {
      console.error('Błąd: Brak tokenu autoryzacyjnego do potwierdzenia podpisu');
      return NextResponse.json({ error: 'Błąd autoryzacji' }, { status: 401 });
    }

    const apiUrl = `https://test.v2.idefend.eu/api/policies/${data.policyId}/confirm-signature`;
    const requestBody = { confirmationCode: data.confirmationCode };

    console.log(`Wysyłanie żądania PUT do: ${apiUrl}`);
    console.log('Ciało żądania:', JSON.stringify(requestBody, null, 2));

    const apiResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await apiResponse.text();
    const statusCode = apiResponse.status;

    console.log(`Status odpowiedzi API /confirm-signature (${apiUrl}):`, statusCode);
    console.log('Surowa odpowiedź API /confirm-signature:', responseText);

    if (!apiResponse.ok) {
      let errorDetails: any = { rawResponse: responseText };
      try {
        errorDetails = { ...JSON.parse(responseText), rawResponse: responseText };
      } catch (e) {
        console.warn('Odpowiedź błędu API /confirm-signature nie jest poprawnym JSONem.');
      }
      console.error(`Błąd API /confirm-signature (Status: ${statusCode}):`, errorDetails);
      return NextResponse.json(
        { error: 'Błąd podczas potwierdzania podpisu', details: errorDetails, statusCode: statusCode },
        { status: statusCode }
      );
    }

    console.log('Podpis pomyślnie potwierdzony dla polisy:', data.policyId);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Błąd wewnętrzny serwera podczas potwierdzania podpisu:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd serwera';
    return NextResponse.json({ error: 'Błąd serwera', details: errorMessage }, { status: 500 });
  }
} 