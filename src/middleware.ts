import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateToken } from '@/lib/jwt';

/**
 * Funkcja do dodawania nagłówków bezpieczeństwa
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://static.hotjar.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://www.googletagmanager.com https://connect.facebook.net https://static.hotjar.com https://v2.idefend.eu https://test.v2.idefend.eu",
    "frame-src 'self' https://www.googletagmanager.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // HSTS tylko w produkcji
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin-auth')?.value;
  
  let response: NextResponse;
  
  // Sprawdź czy użytkownik próbuje dostać się do strony logowania będąc już zalogowanym
  if (pathname === '/admin/login') {
    if (token) {
      const isValid = await validateToken(token);
      if (isValid) {
        // Przekieruj do głównej strony admina
        response = NextResponse.redirect(new URL('/admin', request.url));
        return addSecurityHeaders(response);
      }
    }
    
    // Pozwól na dostęp do strony logowania jeśli nie jest zalogowany lub token jest nieprawidłowy
    response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Sprawdź czy to jest ścieżka administratorska (ale nie /admin/login)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Przekieruj do strony logowania
      response = NextResponse.redirect(new URL('/admin/login', request.url));
      return addSecurityHeaders(response);
    }
    
    const isValid = await validateToken(token);
    if (!isValid) {
      // Token jest nieprawidłowy, przekieruj do logowania
      response = NextResponse.redirect(new URL('/admin/login', request.url));
      return addSecurityHeaders(response);
    }
  }

  // Sprawdź czy to jest API endpoint administratorski (ale nie /api/admin/login)
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
    if (!token) {
      // Zwróć błąd 401 dla API endpointów
      response = NextResponse.json(
        { error: 'Brak autoryzacji' },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }
    
    const isValid = await validateToken(token);
    if (!isValid) {
      response = NextResponse.json(
        { error: 'Brak autoryzacji' },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }
  }

  response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
