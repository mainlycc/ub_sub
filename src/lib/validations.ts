import { z } from 'zod';

/**
 * Schemat walidacji dla endpointu calculate
 */
export const calculateSchema = z.object({
  price: z.number().positive().max(10000000), // maksymalnie 10 milionów PLN
  months: z.number().int().min(12).max(60), // 12-60 miesięcy
  type: z.string().optional(),
});

/**
 * Schemat walidacji dla logowania admina
 */
export const adminLoginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

/**
 * Schemat walidacji dla ID (liczba całkowita)
 */
export const idSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

/**
 * Schemat walidacji dla potwierdzenia podpisu
 */
export const confirmSignatureSchema = z.object({
  confirmationCode: z.string().min(1).max(20),
});

/**
 * Helper do parsowania i walidacji danych z żądania
 */
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validated = await schema.parseAsync(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        // Zod v4 używa `issues` zamiast `errors`
        errors: error.issues.map((e) => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return {
      success: false,
      errors: ['Nieprawidłowy format danych'],
    };
  }
}
