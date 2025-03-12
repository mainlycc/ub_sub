import { checkAuthStatus } from '@/lib/auth';

export async function GET() {
  try {
    const isAuthorized = await checkAuthStatus();
    
    return Response.json({
      success: true,
      isAuthorized,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Błąd sprawdzania statusu:', error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 