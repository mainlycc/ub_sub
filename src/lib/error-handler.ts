import { NextResponse } from 'next/server';

/**
 * Bezpieczna obsługa błędów - nie ujawnia szczegółów w produkcji
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string = 'Wystąpił błąd',
  status: number = 500
): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let message = defaultMessage;
  let details: unknown = undefined;

  if (error instanceof Error) {
    if (isDevelopment) {
      message = error.message;
      details = {
        name: error.name,
        stack: error.stack,
      };
    } else {
      // W produkcji nie ujawniamy szczegółów błędów
      message = defaultMessage;
    }
  } else if (isDevelopment && error) {
    details = error;
  }

  return NextResponse.json(
    {
      error: message,
      ...(isDevelopment && details ? { details } : {}),
    },
    { status }
  );
}
