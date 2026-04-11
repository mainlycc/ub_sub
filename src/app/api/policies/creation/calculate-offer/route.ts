import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { safeLog } from '@/lib/logger';
import { getCurrentEnvironment } from '@/lib/environment';
import { getSellerNodeCode } from '@/lib/seller';

interface ValidationViolation {
  propertyPath: string;
  message: string;
}

const OPTION_NOT_AVAILABLE_RE = /Option type with code '(\w+)' is not available/;
const MAX_RETRIES = 3;

async function callDefendCalculate(
  apiUrl: string,
  token: string,
  payload: Record<string, unknown>
): Promise<{ status: number; body: Record<string, unknown> }> {
  const res = await fetch(`${apiUrl}/policies/creation/calculate-offer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-NODE-JWT-AUTH-TOKEN': token },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  safeLog.log('Defend calculate-offer HTTP', res.status, text.substring(0, 400));
  try {
    return { status: res.status, body: JSON.parse(text) };
  } catch {
    return { status: res.status, body: { raw: text } };
  }
}

function extractRejectedOptionCode(body: Record<string, unknown>): string | null {
  const violations = body.violations as ValidationViolation[] | undefined;
  if (!violations?.length) return null;
  for (const v of violations) {
    const m = OPTION_NOT_AVAILABLE_RE.exec(v.message);
    if (m) return m[1];
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    safeLog.log('Dane wejściowe:', JSON.stringify({
      productCode: data.productCode,
      sellerNodeCode: data.sellerNodeCode,
      options: data.options,
    }));

    if (!data.vehicleSnapshot || !data.options) {
      return NextResponse.json({ error: 'Nieprawidłowe dane wejściowe' }, { status: 400 });
    }

    const serverSellerNodeCode = getSellerNodeCode();
    if ((data.sellerNodeCode || '').toString().trim() !== serverSellerNodeCode) {
      data.sellerNodeCode = serverSellerNodeCode;
      safeLog.log('sellerNodeCode nadpisany:', data.sellerNodeCode);
    }

    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ error: 'Błąd autoryzacji - brak tokenu JWT' }, { status: 401 });
    }

    const environment = getCurrentEnvironment();

    let result = await callDefendCalculate(environment.apiUrl, token, data);

    // Retry: jeśli API odrzuca konkretną opcję (np. CLAIM_LIMIT nie jest
    // dostępny dla danego sellera), usuwamy ją i ponawiamy.
    for (let attempt = 0; attempt < MAX_RETRIES && result.status === 422; attempt++) {
      const rejected = extractRejectedOptionCode(result.body);
      if (!rejected) break;

      safeLog.log(`Opcja '${rejected}' niedostępna dla sellera — usuwam i ponawiam (próba ${attempt + 1})`);
      const opts = data.options as Record<string, string>;
      delete opts[rejected];
      safeLog.log('Opcje po usunięciu:', JSON.stringify(opts));

      result = await callDefendCalculate(environment.apiUrl, token, data);
    }

    if (result.status >= 400) {
      const body = result.body;

      if (result.status === 422 && Array.isArray(body.violations)) {
        const errors = (body.violations as ValidationViolation[])
          .map((v) => `${v.propertyPath}: ${v.message}`)
          .join('\n');
        safeLog.log('Błędy walidacji:', errors);
        return NextResponse.json({ error: `Błędy walidacji:\n${errors}` }, { status: 422 });
      }

      return NextResponse.json(
        { error: (body.message as string) || (body.detail as string) || 'Błąd komunikacji z API' },
        { status: result.status }
      );
    }

    safeLog.log('Kalkulacja OK');
    return NextResponse.json(result.body);
  } catch (error) {
    safeLog.error('Błąd kalkulacji:', error);
    return NextResponse.json({ error: 'Wystąpił błąd podczas kalkulacji' }, { status: 500 });
  }
}
