import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/jwt';
import { comparePassword } from '@/lib/auth-helpers';
import { requireEnvironmentVariables } from '@/lib/env-validation';
import rateLimit from 'next-rate-limit';
import { safeLog } from '@/lib/logger';
import { adminLoginSchema, validateRequest } from '@/lib/validations';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME!;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;

// Rate limiting: maksymalnie 5 prób logowania na 15 minut z tego samego IP
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minut
  uniqueTokenPerInterval: 500, // maksymalnie 500 unikalnych tokenów na interwał
});

export async function POST(request: NextRequest) {
  try {
    // Walidacja zmiennych środowiskowych dopiero podczas obsługi requestu,
    // żeby `next build` nie wywalał się przy braku sekretów w środowisku build.
    requireEnvironmentVariables();

    // Rate limiting - sprawdź czy IP nie przekroczyło limitu
    try {
      limiter.checkNext(request, 5); // maksymalnie 5 prób
    } catch {
      return NextResponse.json(
        { 
          error: 'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie za 15 minut.' 
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Walidacja danych wejściowych
    const validation = await validateRequest(adminLoginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Nieprawidłowa nazwa użytkownika lub hasło' },
        { status: 401 }
      );
    }

    const { username, password } = validation.data;

    // Sprawdź dane logowania
    const isUsernameValid = username === ADMIN_USERNAME;
    const isPasswordValid = await comparePassword(password, ADMIN_PASSWORD_HASH);

    if (isUsernameValid && isPasswordValid) {
      // Generuj JWT token
      const token = await generateToken(username);

      // Ustaw cookie z JWT tokenem
      const cookieStore = await cookies();
      cookieStore.set('admin-auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 godziny
        path: '/'
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Nieprawidłowa nazwa użytkownika lub hasło' },
        { status: 401 }
      );
    }
  } catch (error) {
    // Nie ujawniaj szczegółów błędu w produkcji
    safeLog.error('Błąd podczas logowania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas logowania' },
      { status: 500 }
    );
  }
}
