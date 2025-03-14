import { getAuthToken } from '@/lib/auth';

export async function GET() {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return Response.json({
        success: false,
        message: 'Nie udało się uzyskać tokenu'
      }, { status: 401 });
    }

    return Response.json({
      success: true,
      message: 'Autoryzacja poprawna',
      token: token.substring(0, 10) + '...' // Pokazujemy tylko część tokenu dla bezpieczeństwa
    });

  } catch (error: unknown) {
    console.error('Błąd w auth-test:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    return Response.json({
      success: false,
      message: errorMessage
    }, { status: 500 });
  }
} 