/**
 * Bezpieczne logowanie - maskuje wrażliwe dane
 */

/**
 * Maskuje tokeny i hasła w logach
 */
function maskSensitiveData(data: unknown): unknown {
  if (typeof data === 'string') {
    // Maskuj tokeny JWT (zaczynają się od eyJ)
    if (data.startsWith('eyJ')) {
      return data.substring(0, 10) + '...***';
    }
    // Maskuj długie stringi które mogą być tokenami
    if (data.length > 50 && /^[A-Za-z0-9_-]+$/.test(data)) {
      return data.substring(0, 10) + '...***';
    }
    return data;
  }

  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(maskSensitiveData);
    }

    const masked: Record<string, unknown> = {};
    const sensitiveKeys = [
      'password',
      'token',
      'auth',
      'authorization',
      'jwt',
      'secret',
      'apiKey',
      'api_key',
      'accessToken',
      'refreshToken',
    ];

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
        masked[key] = '***MASKED***';
      } else {
        masked[key] = maskSensitiveData(value);
      }
    }

    return masked;
  }

  return data;
}

/**
 * Bezpieczne logowanie - maskuje wrażliwe dane
 */
export const safeLog = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args.map(maskSensitiveData));
    }
  },
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(...args.map(maskSensitiveData));
    }
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args.map(maskSensitiveData));
    }
  },
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(...args.map(maskSensitiveData));
    }
  },
};
