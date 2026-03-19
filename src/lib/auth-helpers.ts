import bcrypt from 'bcryptjs';

/**
 * Hashuje hasło używając bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Porównuje hasło z hashem
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Waliduje czy wymagane zmienne środowiskowe są ustawione
 */
export function validateEnvVariables(): void {
  const required = [
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD_HASH',
    'JWT_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Brakujące wymagane zmienne środowiskowe: ${missing.join(', ')}`
    );
  }
}
