/**
 * Walidacja zmiennych środowiskowych na starcie aplikacji
 * Ten plik powinien być importowany w miejscach gdzie są używane zmienne środowiskowe
 */

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  errors: string[];
}

/**
 * Waliduje wszystkie wymagane zmienne środowiskowe
 * W trybie development niektóre zmienne mogą być opcjonalne
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const required = [
    'JWT_SECRET',
    'DATABASE_URL',
  ];
  
  // W produkcji wymagamy wszystkich zmiennych
  const productionRequired = process.env.NODE_ENV === 'production' ? [
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD_HASH',
    'GAP_API_USERNAME',
    'GAP_API_PASSWORD',
    'GAP_SELLER_NODE_CODE',
  ] : [];
  
  const allRequired = [...required, ...productionRequired];

  const missing: string[] = [];
  const errors: string[] = [];

  for (const key of allRequired) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  }

  // Dodatkowa walidacja dla JWT_SECRET - powinien być wystarczająco długi
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      errors.push('JWT_SECRET powinien mieć co najmniej 32 znaki');
    }
  }

  // Walidacja ADMIN_PASSWORD_HASH - powinien być hashem bcrypt
  if (process.env.ADMIN_PASSWORD_HASH) {
    if (!process.env.ADMIN_PASSWORD_HASH.startsWith('$2a$') && 
        !process.env.ADMIN_PASSWORD_HASH.startsWith('$2b$')) {
      errors.push('ADMIN_PASSWORD_HASH nie wygląda na prawidłowy hash bcrypt');
    }
  }

  return {
    isValid: missing.length === 0 && errors.length === 0,
    missing,
    errors,
  };
}

/**
 * Sprawdza i rzuca błąd jeśli zmienne środowiskowe są nieprawidłowe
 * Użyj tego w miejscach gdzie zmienne są krytyczne (np. API routes)
 * W trybie development tylko ostrzega, nie rzuca błędu
 */
export function requireEnvironmentVariables(): void {
  const validation = validateEnvironmentVariables();
  
  if (!validation.isValid) {
    const messages: string[] = [];
    
    if (validation.missing.length > 0) {
      messages.push(`Brakujące zmienne: ${validation.missing.join(', ')}`);
    }
    
    if (validation.errors.length > 0) {
      messages.push(`Błędy walidacji: ${validation.errors.join(', ')}`);
    }
    
    const errorMessage = `Nieprawidłowa konfiguracja zmiennych środowiskowych:\n${messages.join('\n')}`;
    
    // W trybie development tylko ostrzegamy
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  OSTRZEŻENIE:', errorMessage);
      console.warn('⚠️  Niektóre funkcje mogą nie działać poprawnie bez tych zmiennych.');
      return;
    }
    
    // W produkcji rzucamy błąd
    throw new Error(errorMessage);
  }
}
