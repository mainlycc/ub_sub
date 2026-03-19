import type { NextRequest } from 'next/server';

/**
 * Weryfikuje żądanie pod kątem ataków CSRF
 * Sprawdza nagłówek Origin/Referer
 */
export function verifyCsrfRequest(request: NextRequest): boolean {
  // Pobierz origin z nagłówka
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // Pobierz host z URL żądania
  const host = request.headers.get('host');
  
  if (!host) {
    return false;
  }

  // W trybie development, pozwól na localhost
  if (process.env.NODE_ENV === 'development') {
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return true;
    }
    if (referer && (referer.includes('localhost') || referer.includes('127.0.0.1'))) {
      return true;
    }
  }

  // Sprawdź origin
  if (origin) {
    try {
      const originUrl = new URL(origin);
      const expectedHost = host.split(':')[0]; // Usuń port jeśli jest
      
      // Origin musi pasować do hosta
      if (originUrl.hostname !== expectedHost && originUrl.hostname !== host) {
        return false;
      }
    } catch {
      return false;
    }
  }

  // Sprawdź referer jako fallback
  if (referer && !origin) {
    try {
      const refererUrl = new URL(referer);
      const expectedHost = host.split(':')[0];
      
      if (refererUrl.hostname !== expectedHost && refererUrl.hostname !== host) {
        return false;
      }
    } catch {
      return false;
    }
  }

  // Jeśli nie ma ani origin ani referer, odrzuć (może być atak CSRF)
  if (!origin && !referer) {
    return false;
  }

  return true;
}
