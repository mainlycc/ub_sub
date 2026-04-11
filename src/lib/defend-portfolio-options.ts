import { getCurrentEnvironment } from '@/lib/environment';
import { safeLog } from '@/lib/logger';

export type PortfolioItem = {
  productCode?: string;
  sellerNodeCode?: string;
  optionTypes?: Array<{ code: string; name?: string }>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractArray(data: any): PortfolioItem[] {
  if (Array.isArray(data)) return data;
  // Hydra JSON-LD format (API Platform / Symfony)
  if (data?.['hydra:member'] && Array.isArray(data['hydra:member'])) return data['hydra:member'];
  if (data?.member && Array.isArray(data.member)) return data.member;
  if (data?.items && Array.isArray(data.items)) return data.items;
  return [];
}

export async function fetchPortfolios(token: string): Promise<PortfolioItem[]> {
  const environment = getCurrentEnvironment();
  const url = `${environment.apiUrl}/policies/creation/portfolios`;
  safeLog.log('[portfolios-fetch] GET', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-NODE-JWT-AUTH-TOKEN': token,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    safeLog.error('[portfolios-fetch] HTTP', response.status, text.substring(0, 300));
    throw new Error(`portfolios HTTP ${response.status}`);
  }

  const raw = await response.json();
  const items = extractArray(raw);

  safeLog.log(
    '[portfolios-fetch] Otrzymano',
    items.length,
    'portfolio(s). Kody produktów:',
    items.map((p) => p.productCode).join(', ')
  );

  if (items.length > 0) {
    safeLog.log(
      '[portfolios-fetch] Pierwsza pozycja optionTypes:',
      JSON.stringify(items[0]?.optionTypes)
    );
  }

  return items;
}

export function pickPortfolio(
  items: PortfolioItem[],
  productCode: string,
  sellerNodeCode: string
): PortfolioItem | undefined {
  const exact = items.find(
    (p) => p.productCode === productCode && p.sellerNodeCode === sellerNodeCode
  );
  if (exact) {
    safeLog.log('[portfolios-pick] Znaleziono exact match:', exact.productCode, exact.sellerNodeCode);
    return exact;
  }
  const byProduct = items.find((p) => p.productCode === productCode);
  if (byProduct) {
    safeLog.log('[portfolios-pick] Znaleziono match po productCode:', byProduct.productCode);
    return byProduct;
  }
  safeLog.log('[portfolios-pick] Brak portfolio dla', productCode, sellerNodeCode);
  return undefined;
}

/**
 * Zostawia w `options` tylko klucze występujące w portfolio.optionTypes.
 * Gdy brak portfolio lub brak listy typów — zwraca opcje bez zmian.
 */
export function filterOptionsForPortfolio(
  options: Record<string, string>,
  portfolio: PortfolioItem | undefined
): Record<string, string> {
  const types = portfolio?.optionTypes;
  if (!types?.length) {
    safeLog.log('[portfolios-filter] Brak optionTypes — zwracam oryginalne opcje');
    return { ...options };
  }
  const allowed = new Set(types.map((t) => t.code));
  const filtered = Object.fromEntries(Object.entries(options).filter(([k]) => allowed.has(k)));
  const removed = Object.keys(options).filter((k) => !allowed.has(k));
  if (removed.length) {
    safeLog.log('[portfolios-filter] Usunięto niedostępne opcje:', removed.join(', '));
  }
  safeLog.log('[portfolios-filter] Finalne opcje:', JSON.stringify(filtered));
  return filtered;
}

export function requiredOptionCodesFromPortfolio(portfolio: PortfolioItem | undefined): string[] {
  if (portfolio?.optionTypes?.length) {
    return portfolio.optionTypes.map((o) => o.code);
  }
  return ['TERM', 'CLAIM_LIMIT', 'PAYMENT_TERM', 'PAYMENT_METHOD'];
}
