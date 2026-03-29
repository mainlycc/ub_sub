import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { getCurrentEnvironment } from '@/lib/environment';
import { safeLog } from '@/lib/logger';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    safeLog.log('[GET /api/policies] Pobieranie szczegółów polisy ID:', id);

    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Nie udało się uzyskać tokenu autoryzacyjnego' },
        { status: 401 }
      );
    }

    const environment = getCurrentEnvironment();
    const response = await fetch(`${environment.apiUrl}/policies/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, application/ld+json;q=0.9',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-NODE-JWT-AUTH-TOKEN': token
      }
    });

    safeLog.log('[GET /api/policies] Status:', response.status);

    const textResponse = await response.text();
    safeLog.log('[GET /api/policies] Odpowiedź (pierwsze 500 znaków):', textResponse.substring(0, 500));

    if (!response.ok) {
      return NextResponse.json(
        { error: `Błąd API: ${response.status}`, details: textResponse.substring(0, 300) },
        { status: response.status }
      );
    }

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(textResponse);
    } catch {
      return NextResponse.json(
        { error: 'Nie udało się sparsować odpowiedzi z API' },
        { status: 500 }
      );
    }

    return NextResponse.json(jsonResponse);
  } catch (error) {
    safeLog.error('[GET /api/policies] Wyjątek:', error);
    return NextResponse.json(
      {
        error: 'Wystąpił błąd',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      },
      { status: 500 }
    );
  }
}
