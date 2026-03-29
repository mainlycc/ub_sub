import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { getCurrentEnvironment } from '@/lib/environment';
import { safeLog } from '@/lib/logger';

const ALLOWED_TYPES = ['POLICY_PRECONTRACT', 'POLICY_CONTRACT'] as const;

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; type: string }> }
) {
  try {
    const { id, type } = await context.params;

    if (!ALLOWED_TYPES.includes(type as (typeof ALLOWED_TYPES)[number])) {
      return NextResponse.json(
        { error: `Nieznany typ dokumentu: ${type}` },
        { status: 400 }
      );
    }

    safeLog.log('Pobieranie dokumentu', type, 'dla polisy ID:', id);

    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Nie udało się uzyskać tokenu autoryzacyjnego' },
        { status: 401 }
      );
    }

    const environment = getCurrentEnvironment();
    const response = await fetch(
      `${environment.apiUrl}/policies/${id}/document-download/${type}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-NODE-JWT-AUTH-TOKEN': token,
          Accept: 'application/pdf, application/json',
        },
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      safeLog.error('Błąd pobierania dokumentu:', response.status, text.substring(0, 200));
      return NextResponse.json(
        { error: `Dokument ${type} nie jest jeszcze dostępny`, status: response.status },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'application/pdf';
    const blob = await response.arrayBuffer();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${type}_${id}.pdf"`,
        'Content-Length': String(blob.byteLength),
      },
    });
  } catch (error) {
    safeLog.error('Wyjątek podczas pobierania dokumentu:', error);
    return NextResponse.json(
      {
        error: 'Wystąpił błąd podczas pobierania dokumentu',
        details: error instanceof Error ? error.message : 'Nieznany błąd',
      },
      { status: 500 }
    );
  }
}

export async function HEAD(
  request: Request,
  context: { params: Promise<{ id: string; type: string }> }
) {
  try {
    const { id, type } = await context.params;

    if (!ALLOWED_TYPES.includes(type as (typeof ALLOWED_TYPES)[number])) {
      return new NextResponse(null, { status: 400 });
    }

    const token = await getAuthToken();
    if (!token) {
      return new NextResponse(null, { status: 401 });
    }

    const environment = getCurrentEnvironment();
    const response = await fetch(
      `${environment.apiUrl}/policies/${id}/document-download/${type}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-NODE-JWT-AUTH-TOKEN': token,
          Accept: 'application/pdf, application/json',
        },
      }
    );

    return new NextResponse(null, { status: response.ok ? 200 : response.status });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
