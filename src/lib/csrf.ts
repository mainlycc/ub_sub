import { randomBytes, createHash } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'change-me-in-production';
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generuje token CSRF
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Generuje hash tokenu CSRF (dla przechowywania w sesji/cookie)
 */
export function hashCsrfToken(token: string): string {
  return createHash('sha256')
    .update(token + CSRF_SECRET)
    .digest('hex');
}

/**
 * Weryfikuje token CSRF
 */
export function verifyCsrfToken(token: string, hash: string): boolean {
  const expectedHash = hashCsrfToken(token);
  return expectedHash === hash;
}

/**
 * Generuje parę token-hash dla CSRF
 */
export function generateCsrfPair(): { token: string; hash: string } {
  const token = generateCsrfToken();
  const hash = hashCsrfToken(token);
  return { token, hash };
}
