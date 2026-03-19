import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyCsrfRequest } from '@/lib/csrf-verify';

export async function POST(request: NextRequest) {
  // Weryfikacja CSRF
  if (!verifyCsrfRequest(request)) {
    return NextResponse.json(
      { error: 'Nieprawidłowe żądanie' },
      { status: 403 }
    );
  }

  try {
    // Przygotuj odpowiedź z przekierowaniem na stronę główną
    const redirectUrl = new URL('/', request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Usuń cookie autoryzacyjne po stronie przeglądarki
    response.cookies.set('admin-auth', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wylogowania' },
      { status: 500 }
    );
  }
}
