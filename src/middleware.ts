import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Sprawdź czy użytkownik próbuje dostać się do strony logowania będąc już zalogowanym
  if (pathname === '/admin/login') {
    const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';
    
    if (isLoggedIn) {
      // Przekieruj do głównej strony admina
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // Pozwól na dostęp do strony logowania jeśli nie jest zalogowany
    return NextResponse.next();
  }

  // Sprawdź czy to jest ścieżka administratorska (ale nie /admin/login)
  if (pathname.startsWith('/admin')) {
    // Sprawdź czy użytkownik jest zalogowany
    const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';
    
    if (!isLoggedIn) {
      // Przekieruj do strony logowania
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Sprawdź czy to jest API endpoint administratorski (ale nie /api/admin/login)
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
    // Sprawdź czy użytkownik jest zalogowany
    const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';
    
    if (!isLoggedIn) {
      // Zwróć błąd 401 dla API endpointów
      return NextResponse.json(
        { error: 'Brak autoryzacji' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
