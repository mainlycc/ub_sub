# Facebook Pixel - Instrukcja instalacji i konfiguracji

## ✅ Co zostało zainstalowane

### 1. **Kod podstawowy piksela**
- **Lokalizacja:** `src/app/layout.tsx`
- **ID piksela:** `2207464152992298`
- **Funkcjonalność:** Automatyczne śledzenie wyświetleń stron (PageView)

### 2. **Biblioteka funkcji śledzenia**
- **Lokalizacja:** `src/lib/facebook-pixel.ts`
- **Funkcjonalność:** Funkcje do śledzenia różnych zdarzeń

## 📊 Dostępne zdarzenia do śledzenia

### Podstawowe zdarzenia:
- `trackPageView()` - wyświetlenie strony
- `trackViewContent(contentName, contentCategory)` - wyświetlenie treści
- `trackLead(contentName, contentCategory)` - lead/forma kontaktowa
- `trackInitiateCheckout(value, currency)` - rozpoczęcie procesu zakupu
- `trackAddToCart(value, currency, contentName)` - dodanie do koszyka
- `trackPurchase(value, currency, contentName)` - zakup

### Zdarzenia specyficzne dla ubezpieczeń:
- `trackInsuranceQuote(insuranceType, value)` - wycena ubezpieczenia
- `trackBlogView(articleTitle)` - wyświetlenie artykułu bloga
- `trackContactForm()` - wypełnienie formularza kontaktowego

## 🔧 Jak używać

### 1. Import funkcji:
```typescript
import { trackLead, trackInsuranceQuote } from '@/lib/facebook-pixel';
```

### 2. Wywołanie w komponencie:
```typescript
// Przykład: śledzenie leada z formularza
const handleFormSubmit = () => {
  trackLead('Formularz kontaktowy', 'Contact');
  // reszta logiki formularza
};

// Przykład: śledzenie wyceny ubezpieczenia
const handleQuoteRequest = () => {
  trackInsuranceQuote('OC', 500);
  // reszta logiki wyceny
};
```

### 3. Automatyczne śledzenie stron:
```typescript
import { useEffect } from 'react';
import { trackBlogView } from '@/lib/facebook-pixel';

const MyComponent = () => {
  useEffect(() => {
    trackBlogView('Tytuł artykułu');
  }, []);
  
  return <div>...</div>;
};
```

## 📍 Gdzie zostało już dodane śledzenie

### 1. **Strona główna** (`src/app/page.tsx`)
- Automatyczne śledzenie wyświetlenia strony

### 2. **Blog - przegląd** (`src/app/blog/page.tsx`)
- Śledzenie wyświetlenia listy artykułów

### 3. **Artykuł blogowy** (`src/app/blog/jak-nie-przeplacac-za-oc/page.tsx`)
- Śledzenie wyświetlenia konkretnego artykułu

## 🎯 Dodatkowe miejsca do implementacji

### 1. **Formularze kontaktowe**
```typescript
// W komponencie formularza
const handleSubmit = () => {
  trackContactForm();
  // reszta logiki
};
```

### 2. **Kalkulator ubezpieczeń**
```typescript
// Po wygenerowaniu wyceny
const handleQuoteGenerated = (quote) => {
  trackInsuranceQuote(quote.type, quote.value);
};
```

### 3. **Przyciski CTA**
```typescript
// Przy kliknięciu "Sprawdź ofertę"
const handleCTAClick = () => {
  trackLead('CTA - Sprawdź ofertę', 'Conversion');
};
```

## 🔍 Weryfikacja instalacji

### 1. **Sprawdź w Facebook Ads Manager**
- Przejdź do Facebook Ads Manager
- Wybierz "Piksele" z menu
- Sprawdź status piksela - powinien być "Aktywny"

### 2. **Użyj Facebook Pixel Helper**
- Zainstaluj rozszerzenie Facebook Pixel Helper
- Sprawdź czy piksel jest aktywny na stronie
- Zweryfikuj czy zdarzenia są śledzone poprawnie

### 3. **Test w trybie deweloperskim**
- Otwórz konsolę przeglądarki
- Sprawdź czy nie ma błędów JavaScript
- Zweryfikuj czy `fbq` jest dostępne globalnie

## ⚠️ Ważne uwagi

1. **GDPR/RODO** - Upewnij się, że masz zgodę użytkowników na śledzenie
2. **Polityka prywatności** - Zaktualizuj politykę prywatności o informacje o pikselu
3. **Testowanie** - Przetestuj wszystkie zdarzenia przed wdrożeniem na produkcję
4. **Monitoring** - Regularnie sprawdzaj czy piksel działa poprawnie

## 📞 Wsparcie

W przypadku problemów z pikselem:
1. Sprawdź konsolę przeglądarki pod kątem błędów
2. Zweryfikuj czy kod piksela jest poprawnie załadowany
3. Sprawdź czy ID piksela jest poprawne
4. Skontaktuj się z zespołem deweloperskim 