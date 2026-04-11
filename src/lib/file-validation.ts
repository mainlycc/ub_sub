/**
 * Walidacja plików przed uploadem
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
];

// Magic bytes dla różnych typów plików
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Sprawdza rozszerzenie pliku
 */
function validateExtension(filename: string): boolean {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return ALLOWED_EXTENSIONS.includes(extension);
}

/**
 * Sprawdza magic bytes pliku
 */
async function validateMagicBytes(
  file: File,
  expectedMimeType: string
): Promise<boolean> {
  const expectedBytes = MAGIC_BYTES[expectedMimeType];
  if (!expectedBytes || expectedBytes.length === 0) {
    return true; // Jeśli nie mamy magic bytes dla tego typu, akceptujemy
  }

  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Sprawdź każdy możliwy wzorzec magic bytes
    for (const pattern of expectedBytes) {
      let matches = true;
      for (let i = 0; i < pattern.length; i++) {
        if (bytes[i] !== pattern[i]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return true;
      }
    }

    return false;
  } catch {
    // Jeśli nie możemy odczytać magic bytes, odrzuć plik
    return false;
  }
}

/**
 * Waliduje plik przed uploadem
 */
export async function validateFile(file: File): Promise<FileValidationResult> {
  const errors: string[] = [];

  // Walidacja rozmiaru
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`Plik jest zbyt duży. Maksymalny rozmiar: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  if (file.size === 0) {
    errors.push('Plik jest pusty');
  }

  // Walidacja typu MIME
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    errors.push(`Nieprawidłowy typ pliku: ${file.type}. Dozwolone typy: ${ALLOWED_MIME_TYPES.join(', ')}`);
  }

  // Walidacja rozszerzenia
  if (!validateExtension(file.name)) {
    errors.push(`Nieprawidłowe rozszerzenie pliku. Dozwolone: ${ALLOWED_EXTENSIONS.join(', ')}`);
  }

  // Walidacja magic bytes (tylko jeśli typ MIME jest prawidłowy)
  if (file.type && ALLOWED_MIME_TYPES.includes(file.type)) {
    const magicBytesValid = await validateMagicBytes(file, file.type);
    if (!magicBytesValid) {
      errors.push('Plik nie pasuje do deklarowanego typu (magic bytes nie pasują)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Waliduje wiele plików
 */
export async function validateFiles(files: File[]): Promise<FileValidationResult> {
  const allErrors: string[] = [];

  for (const file of files) {
    const result = await validateFile(file);
    if (!result.isValid) {
      allErrors.push(`${file.name}: ${result.errors.join(', ')}`);
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}
