// Konfiguracja kodu sprzedawcy zgodnie z dokumentacją GAP.
// Uwaga (Next.js): zmienne środowiskowe bez prefiksu `NEXT_PUBLIC_` nie są dostępne w kodzie wykonywanym po stronie klienta.
// Dlatego wspieramy oba warianty, a jeśli brak konfiguracji — używamy bezpiecznego domyślnego kodu zamiast pustego stringa.

const DEFAULT_SELLER_NODE_CODE_TEST = 'PL_TEST_GAP_25';
const DEFAULT_SELLER_NODE_CODE_PRODUCTION = 'PL_GAP_25';

function getDefaultSellerNodeCode(): string {
  const gapEnv = (process.env.GAP_ENV || '').toUpperCase();
  return gapEnv === 'TEST' ? DEFAULT_SELLER_NODE_CODE_TEST : DEFAULT_SELLER_NODE_CODE_PRODUCTION;
}

export const getSellerNodeCode = (): string => {
  // Klient: bierzemy TYLKO NEXT_PUBLIC_*. Jeśli brak, zwracamy pusty string,
  // żeby serwerowe endpointy mogły bezpiecznie wstawić poprawną wartość z env.
  if (typeof window !== 'undefined') {
    const rawPublic = (process.env.NEXT_PUBLIC_GAP_SELLER_NODE_CODE || '').trim();
    return rawPublic;
  }

  // Serwer: korzystamy z prywatnego env (bez NEXT_PUBLIC_) i ewentualnie fallback.
  const raw = (process.env.GAP_SELLER_NODE_CODE || '').trim();

  return raw.length > 0 ? raw : getDefaultSellerNodeCode();
};

// Funkcja do walidacji kodu sprzedawcy (porównanie do aktualnej konfiguracji).
export const validateSellerNodeCode = (code: string): boolean => {
  return (code || '').trim() === getSellerNodeCode();
};