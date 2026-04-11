import { SignJWT, jwtVerify } from 'jose';

/**
 * Pobiera secret key dla JWT
 * Rzuca błąd tylko gdy faktycznie jest potrzebny (w runtime)
 */
function getSecret(): Uint8Array {
  const SECRET_KEY = process.env.JWT_SECRET;
  
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET environment variable is required. Please set it in your .env.local file.');
  }
  
  return new TextEncoder().encode(SECRET_KEY);
}

const ALGORITHM = 'HS256';
const EXPIRATION_TIME = 60 * 60 * 24; // 24 godziny w sekundach

export interface JWTPayload {
  username: string;
  iat?: number;
  exp?: number;
}

/**
 * Generuje JWT token dla zalogowanego użytkownika
 */
export async function generateToken(username: string): Promise<string> {
  const secret = getSecret();
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + EXPIRATION_TIME)
    .sign(secret);

  return token;
}

/**
 * Weryfikuje i dekoduje JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [ALGORITHM],
    });
    // Konwersja przez unknown, aby uniknąć konfliktów typów między jose a naszym interfejsem
    const typedPayload = payload as unknown as JWTPayload;
    // Sprawdź czy payload ma wymaganą właściwość username
    if (!typedPayload.username) {
      return null;
    }
    return typedPayload;
  } catch {
    return null;
  }
}

/**
 * Sprawdza czy token jest ważny i nie wygasł
 */
export async function validateToken(token: string): Promise<boolean> {
  const payload = await verifyToken(token);
  if (!payload) return false;
  
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return false;
  }
  
  return true;
}
