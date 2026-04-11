import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { getCurrentEnvironment } from '@/lib/environment';
import { getSellerNodeCode } from '@/lib/seller';
import { safeLog } from '@/lib/logger';
import { calculateSchema, validateRequest } from '@/lib/validations';

interface ValidationViolation {
  propertyPath: string;
  message: string;
}

const WARSAW_TZ = 'Europe/Warsaw';
const OPTION_NOT_AVAILABLE_RE = /Option type with code '(\w+)' is not available/;
const MAX_RETRIES = 3;

function ymdInWarsaw(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: WARSAW_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function calendarDaysAgo(daysBack: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - daysBack);
  return d;
}

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
  safeLog.log('[calculate] Defend HTTP', res.status, text.substring(0, 400));
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

export async function POST(request: NextRequest) {
  try {
    const reqData = await request.json();

    const validation = await validateRequest(calculateSchema, reqData);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane wejściowe', details: validation.errors },
        { status: 400 }
      );
    }

    const { price, months, type } = validation.data;
    safeLog.log('[calculate] Dane:', validation.data);

    const isCasco = type === 'casco';
    const productCode = isCasco ? '5_DCGAP_MG25_GEN' : '5_DCGAP_M25_GEN';
    const productName = isCasco ? 'DEFEND Gap MAX AC' : 'DEFEND Gap MAX';

    const saleInitiatedOn = ymdInWarsaw(new Date());
    const purchaseAt = calendarDaysAgo(isCasco ? 200 : 60);
    const purchasedOn = ymdInWarsaw(purchaseAt);
    const firstRegAt = new Date(purchaseAt);
    firstRegAt.setDate(firstRegAt.getDate() + 1);
    const firstRegisteredOn = `${ymdInWarsaw(firstRegAt)}T07:38:46+02:00`;

    const vehicleSnapshot = {
      purchasedOn,
      modelCode: "91",
      categoryCode: "PC",
      usageCode: "STANDARD",
      mileage: 10000,
      firstRegisteredOn,
      ...(isCasco ? { evaluationDate: saleInitiatedOn } : {}),
      purchasePrice: Math.round(price * 100),
      purchasePriceNet: Math.round(price * 100),
      purchasePriceVatReclaimableCode: "NO",
      usageTypeCode: "INDIVIDUAL",
      purchasePriceInputType: "VAT_INAPPLICABLE",
      vin: "12131231231313132",
      vrm: "21121212",
      owners: [{ contact: { inheritFrom: "policyHolder" } }]
    };

    const calculationData: Record<string, unknown> = {
      sellerNodeCode: getSellerNodeCode(),
      productCode,
      saleInitiatedOn,
      vehicleSnapshot,
      options: {
        TERM: `T_${months}`,
        CLAIM_LIMIT: "CL_50000",
        PAYMENT_TERM: "PT_LS",
        PAYMENT_METHOD: "PM_PBC"
      } as Record<string, string>
    };

    safeLog.log('[calculate] Payload options:', calculationData.options);

    let token: string | null = null;
    try {
      token = await getAuthToken();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Błąd autoryzacji';
      safeLog.error('[calculate] Auth error:', msg);
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    if (!token) {
      return NextResponse.json({ error: 'Brak tokenu JWT' }, { status: 401 });
    }

    const environment = getCurrentEnvironment();

    let result = await callDefendCalculate(environment.apiUrl, token, calculationData);

    for (let attempt = 0; attempt < MAX_RETRIES && result.status === 422; attempt++) {
      const rejected = extractRejectedOptionCode(result.body);
      if (!rejected) break;

      safeLog.log(`[calculate] Opcja '${rejected}' niedostępna — usuwam (próba ${attempt + 1})`);
      const opts = calculationData.options as Record<string, string>;
      delete opts[rejected];

      result = await callDefendCalculate(environment.apiUrl, token, calculationData);
    }

    if (result.status >= 400) {
      const body = result.body;
      if (result.status === 422 && Array.isArray(body.violations)) {
        const errors = (body.violations as ValidationViolation[])
          .map((v) => `${v.propertyPath}: ${v.message}`)
          .join('\n');
        return NextResponse.json({ error: `Błędy walidacji:\n${errors}` }, { status: 422 });
      }
      return NextResponse.json(
        { error: (body.message as string) || (body.detail as string) || 'Błąd API' },
        { status: result.status }
      );
    }

    const responseData = result.body;
    const premiumAmount = responseData.premiumSuggested
      ? Math.round(((responseData.premiumSuggested as number) / 100) * 100) / 100
      : 0;

    safeLog.log('[calculate] Składka:', premiumAmount);

    const displayProductName =
      responseData.productCode === productCode && responseData.productName
        ? responseData.productName
        : productName;

    return NextResponse.json({
      success: true,
      premium: premiumAmount,
      details: {
        productName: displayProductName,
        coveragePeriod: `${months} miesięcy`,
        vehicleValue: price,
        maxCoverage: "50 000 PLN"
      }
    });
  } catch (error) {
    safeLog.error('[calculate] Błąd:', error);
    const msg = error instanceof Error ? error.message : 'Nieznany błąd';
    return NextResponse.json({ error: msg || 'Wystąpił błąd' }, { status: 500 });
  }
}
