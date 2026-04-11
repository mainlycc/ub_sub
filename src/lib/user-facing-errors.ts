/**
 * Krótkie, zrozumiałe komunikaty dla klientów (checkout, API).
 */

export const checkoutMessages = {
  variantRequired: 'Wybierz rodzaj ubezpieczenia powyżej, żeby przejść dalej.',
  calculationRequired:
    'Najpierw kliknij „Oblicz składkę” i poczekaj na wynik — bez tego nie zapiszemy oferty.',

  firstName: 'Podaj imię ubezpieczającego.',
  lastName: 'Podaj nazwisko ubezpieczającego.',
  phone: 'Podaj numer telefonu komórkowego (9 cyfr po +48).',
  email: 'Podaj prawidłowy adres e-mail, np. jan@example.com.',
  pesel: 'PESEL musi mieć dokładnie 11 cyfr — sprawdź, czy nie brakuje którejś.',
  street: 'Uzupełnij ulicę wraz z numerem domu lub mieszkania.',
  city: 'Podaj miejscowość.',
  postCode: 'Kod pocztowy wpisz jako XX-XXX (np. 00-950).',

  purchaseDate: 'Wybierz datę nabycia pojazdu.',
  firstReg: 'Wybierz datę pierwszej rejestracji pojazdu.',
  vinEmpty:
    'Wpisz numer VIN — znajdziesz go w dowodzie rejestracyjnym, na szybie (u dołu) lub w umowie.',
  vinTooShort: (n: number) =>
    `Numer VIN ma zawsze 17 znaków (litery i cyfry, bez liter I, O, Q). Wpisano ${n} — dopisz brakujące znaki.`,
  vinTooLong: (n: number) =>
    `VIN ma dokładnie 17 znaków. Wpisano ${n} — usuń zbędne znaki lub sprawdź, czy nie wkleiłeś spacji.`,
  vrm: 'Podaj numer rejestracyjny pojazdu (tablica).',
  purchasePrice: 'Podaj wartość pojazdu większą niż zero.',
  mileageNegative: 'Przebieg nie może być ujemny.',
  mileageRequired: 'Podaj aktualny przebieg pojazdu w kilometrach.',

  make: 'Wybierz markę pojazdu z listy.',
  model: 'Wybierz model pojazdu z listy.',
  category: 'Wybierz kategorię pojazdu.',
  usage: 'Wybierz sposób wykorzystania pojazdu.',
  priceType: 'Wybierz, czy podana wartość to brutto, netto czy netto + 50% VAT.',

  genericSubmit:
    'Coś poszło nie tak przy wysyłaniu zamówienia. Spróbuj ponownie za chwilę — jeśli problem wróci, napisz do nas.',
} as const;

/** Mapowanie wewnętrznych komunikatów walidacji (lock / Summary) na tekst dla klienta. */
const SERVER_LINE_MAP: Record<string, string> = {
  'Brak sellerNodeCode': 'Konfiguracja oferty jest niepełna. Odśwież stronę lub skontaktuj się z nami.',
  'Brak productCode': 'Nie wybrano produktu. Wróć do pierwszego kroku i wybierz wariant ubezpieczenia.',
  'Brak saleInitiatedOn': 'Nie udało się ustalić daty zgłoszenia. Odśwież stronę i spróbuj ponownie.',
  'Brak signatureTypeCode': 'Brak ustawień podpisu. Odśwież stronę i spróbuj ponownie.',
  'Brak danych pojazdu': 'Uzupełnij dane pojazdu w kroku „Dane pojazdu”.',
  'Brak makeId pojazdu': 'Wybierz markę i model pojazdu na liście w formularzu pojazdu.',
  'Brak modelId pojazdu': 'Wybierz model pojazdu z listy (po wybraniu marki).',
  'Brak VIN pojazdu': checkoutMessages.vinEmpty,
  'Brak numeru rejestracyjnego': checkoutMessages.vrm,
  'Brak kategorii pojazdu': checkoutMessages.category,
  'Brak kodu użytkowania': checkoutMessages.usage,
  'Brak daty pierwszej rejestracji': checkoutMessages.firstReg,
  'Brak daty zakupu': checkoutMessages.purchaseDate,
  'Nieprawidłowa cena zakupu': checkoutMessages.purchasePrice,
  'Nieprawidłowa cena netto': 'Wartość netto pojazdu jest nieprawidłowa — sprawdź kwotę w formularzu.',
  'Brak danych klienta': 'Uzupełnij dane ubezpieczającego (krok z danymi osobowymi).',
  'Brak typu klienta': 'Wybierz, czy umowa jest na osobę fizyczną, czy na firmę.',
  'Brak email klienta': checkoutMessages.email,
  'Brak telefonu klienta': checkoutMessages.phone,
  'Brak imienia klienta': checkoutMessages.firstName,
  'Brak nazwiska klienta': checkoutMessages.lastName,
  'Brak PESEL klienta': checkoutMessages.pesel,
  'Brak adresu klienta': 'Uzupełnij adres zamieszkania.',
  'Brak ulicy': checkoutMessages.street,
  'Brak numeru domu': 'Dopisz numer domu lub mieszkania w polu adresu (np. ul. Lipowa 12/4).',
  'Brak miasta': checkoutMessages.city,
  'Brak kodu pocztowego': checkoutMessages.postCode,
  'Brak kraju': 'Upewnij się, że wybrano kraj (domyślnie Polska).',
  'Brak opcji': 'Nie wybrano parametrów polisy. Wróć do kroku z kalkulacją i uzupełnij wszystkie pola.',
  'Nieprawidłowa składka': 'Najpierw oblicz składkę w poprzednim kroku — bez aktualnej kwoty nie zapiszemy polisy.',
};

function mapOneServerLine(line: string): string {
  const mapped = SERVER_LINE_MAP[line];
  if (mapped) return mapped;
  if (line.startsWith('Brak ')) {
    const rest = line.slice(5).trim();
    if (/^[A-Z][A-Z0-9_]*$/.test(rest)) {
      return 'Uzupełnij wszystkie pola w kroku z kalkulacją: limit odszkodowania, okres ubezpieczenia, rodzaj i formę płatności.';
    }
  }
  return humanizeRawApiError(line);
}

/** Zamienia listę błędów serwera na jeden tekst dla użytkownika. */
export function formatPolicyValidationDetails(details: unknown): string {
  if (details == null) return '';
  if (typeof details === 'string') {
    return humanizeRawApiError(details);
  }
  if (Array.isArray(details)) {
    const lines = details
      .filter((x): x is string => typeof x === 'string')
      .map((s) => mapOneServerLine(s));
    const unique = [...new Set(lines)];
    if (unique.length === 0) return messageForUnknownApiPayload(details);
    if (unique.length === 1) return unique[0];
    return ['Prosimy o poprawienie następujących rzeczy:', ...unique.map((u) => `• ${u}`)].join('\n');
  }
  if (typeof details === 'object') {
    return messageForUnknownApiPayload(details);
  }
  return String(details);
}

/** Czy tekst wygląda jak surowy JSON (nie pokazujemy tego klientowi). */
function looksLikeJsonBlob(s: string): boolean {
  const t = s.trim();
  return (t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'));
}

/** Upraszcza surowe komunikaty z API / wyjątków. */
export function humanizeRawApiError(raw: string): string {
  if (!raw || !raw.trim()) {
    return 'Nie udało się dokończyć operacji. Spróbuj ponownie za chwilę.';
  }
  if (looksLikeJsonBlob(raw)) {
    return 'Serwer zwrócił nieoczekiwaną odpowiedź. Sprawdź dane w formularzu i spróbuj jeszcze raz — jeśli to nie pomoże, skontaktuj się z nami.';
  }
  const lower = raw.toLowerCase();
  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return 'Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.';
  }
  if (lower.includes('401') || lower.includes('unauthorized') || lower.includes('autoryzac')) {
    return 'Sesja wygasła lub brak uprawnień. Odśwież stronę i spróbuj ponownie.';
  }
  if (lower.includes('timeout') || lower.includes('timed out')) {
    return 'Przekroczono czas oczekiwania. Spróbuj ponownie za chwilę.';
  }
  return raw;
}

export function messageForUnknownApiPayload(payload: unknown): string {
  if (payload == null || payload === '') {
    return 'Nie udało się dokończyć operacji. Spróbuj ponownie za chwilę.';
  }
  if (typeof payload === 'string') return humanizeRawApiError(payload);
  if (typeof payload === 'number' || typeof payload === 'boolean') return String(payload);
  if (typeof payload !== 'object') return humanizeRawApiError(String(payload));
  const o = payload as Record<string, unknown>;
  if (typeof o.message === 'string') return humanizeRawApiError(o.message);
  if (typeof o.detail === 'string') return humanizeRawApiError(o.detail);
  if (typeof o.error === 'string') return humanizeRawApiError(o.error);
  if (o.error != null && typeof o.error === 'object') {
    const e = o.error as Record<string, unknown>;
    if (typeof e.message === 'string') return humanizeRawApiError(e.message);
  }
  return 'Nie udało się dokończyć operacji. Sprawdź wprowadzone dane i spróbuj ponownie.';
}

export function vinFieldMessage(vin: string): string | null {
  const v = (vin || '').trim();
  if (!v) return checkoutMessages.vinEmpty;
  if (v.length < 17) return checkoutMessages.vinTooShort(v.length);
  if (v.length > 17) return checkoutMessages.vinTooLong(v.length);
  return null;
}
