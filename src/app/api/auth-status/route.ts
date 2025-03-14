import { checkAuthStatus } from '@/lib/auth';

export async function GET() {
  try {
    const isAuthorized = await checkAuthStatus();
    
    return Response.json({
      success: true,
      isAuthorized,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    console.error('Błąd sprawdzania statusu:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    return Response.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 