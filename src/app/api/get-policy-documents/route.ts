import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

// Definicja oczekiwanej struktury odpowiedzi dla dokumentów (dostosuj w razie potrzeby)
interface PolicyDocument {
  code: string;       // np. "policy", "terms", "ipid"
  name: string;       // np. "Policy document", "General Terms & Conditions"
  url: string;        // Link do pobrania dokumentu
  mimeType: string;   // np. "application/pdf"
  createdAt: string;  // Data utworzenia
}

// Funkcja pomocnicza do opóźnienia
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const policyId = searchParams.get('policyId');

  if (!policyId) {
    console.error('Błąd: Brak policyId w zapytaniu o dokumenty');
    return NextResponse.json({ error: 'Missing policyId parameter' }, { status: 400 });
  }

  console.log(`Pobieranie dokumentów dla polisy ID: ${policyId}`);

  try {
    const token = await getAuthToken();
    if (!token) {
      console.error('Błąd: Brak tokenu autoryzacyjnego do pobrania dokumentów');
      return NextResponse.json({ error: 'Błąd autoryzacji' }, { status: 401 });
    }

    const apiUrl = `https://test.v2.idefend.eu/api/policies/${policyId}/documents`;
    let attempts = 0;
    const maxAttempts = 3; // Maksymalna liczba prób
    const retryDelay = 2000; // Opóźnienie między próbami (ms)

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Wysyłanie żądania GET do: ${apiUrl} (Próba ${attempts}/${maxAttempts})`);

      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-NODE-JWT-AUTH-TOKEN': token,
          'Accept': 'application/ld+json'
        }
      });

      const responseText = await apiResponse.text();
      const statusCode = apiResponse.status;

      console.log(`Status odpowiedzi API /documents (Próba ${attempts}):`, statusCode);
      console.log(`Surowa odpowiedź API /documents (Próba ${attempts}):`, responseText);

      if (apiResponse.ok) {
        // Sukces - przetwarzamy odpowiedź
        const responseData = JSON.parse(responseText);
        let documents: PolicyDocument[] = [];
        if (responseData['hydra:member'] && Array.isArray(responseData['hydra:member'])) {
          documents = responseData['hydra:member'].map((doc: any) => ({
            code: doc.code || 'unknown',
            name: doc.name || doc.type || 'Unknown Document',
            url: doc.url || '#',
            mimeType: doc.mimeType || 'application/octet-stream',
            createdAt: doc.createdAt || new Date().toISOString()
          }));
        }
        console.log(`Pobrano ${documents.length} dokumentów dla polisy ${policyId}.`);
        return NextResponse.json({ success: true, documents }, { status: 200 });
      }

      // Jeśli błąd 404 i mamy jeszcze próby, czekamy i ponawiamy
      if (statusCode === 404 && attempts < maxAttempts) {
        console.log(`Otrzymano 404, ponawianie próby za ${retryDelay}ms...`);
        await delay(retryDelay);
        continue; // Przejdź do następnej iteracji pętli
      }

      // Jeśli inny błąd lub koniec prób, zwracamy błąd
      let errorDetails: any = { rawResponse: responseText };
      try {
        errorDetails = { ...JSON.parse(responseText), rawResponse: responseText };
      } catch (e) { /* Ignoruj */ }
      console.error(`Błąd API /documents (Status: ${statusCode}, Próba ${attempts}):`, errorDetails);
      return NextResponse.json({ documents: [] }, { status: statusCode }); // Zwróć pustą listę i status błędu
    }

    // Jeśli pętla zakończyła się bez sukcesu (co nie powinno się zdarzyć przy tej logice)
    console.error('Nie udało się pobrać dokumentów po maksymalnej liczbie prób.');
    return NextResponse.json({ documents: [] }, { status: 500 });

  } catch (error) {
    console.error('Błąd wewnętrzny serwera podczas pobierania dokumentów:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd serwera';
    return NextResponse.json({ error: 'Błąd serwera', details: errorMessage, documents: [] }, { status: 500 });
  }
} 