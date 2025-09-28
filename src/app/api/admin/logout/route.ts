import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Przygotuj odpowiedź z przekierowaniem na stronę główną
    const redirectUrl = new URL('/', request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Usuń cookie autoryzacyjne po stronie przeglądarki
    response.cookies.set('admin-auth', '', {
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wylogowania' },
      { status: 500 }
    );
  }
}
