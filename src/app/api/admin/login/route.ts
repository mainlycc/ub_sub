import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Dane logowania - w produkcji powinny być w zmiennych środowiskowych
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Sprawdź dane logowania
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Ustaw cookie z informacją o zalogowaniu
      const cookieStore = cookies();
      cookieStore.set('admin-auth', 'true', {
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
  } catch {
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas logowania' },
      { status: 500 }
    );
  }
}
