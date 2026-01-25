# Kompleksowy Audyt SEO i Konwersji - GapAuto.pl

**Data audytu:** 2026-01-25
**Strona:** https://gapauto.pl
**Folder projektu:** ub_sub

---

## Podsumowanie

| Kategoria | Ocena | Status |
|-----------|-------|--------|
| **SEO Techniczne** | 8/10 | ✅ Dobre |
| **SEO On-Page** | 7/10 | ⚠️ Wymaga poprawek |
| **Konwersja** | 7/10 | ⚠️ Potencjał do optymalizacji |
| **UX/Mobile** | 8/10 | ✅ Dobre |
| **Tracking/Analytics** | 9/10 | ✅ Bardzo dobre |

---

## 1. SEO TECHNICZNE

### ✅ Co działa dobrze:

| Element | Status | Szczegóły |
|---------|--------|-----------|
| Sitemap XML | ✅ | Dynamicznie generowany, zawiera strony statyczne + blog |
| Robots.txt | ✅ | Poprawnie blokuje /admin/ i /api/ |
| Meta tags | ✅ | OpenGraph, Twitter Cards skonfigurowane |
| Canonical URLs | ✅ | Ustawiony metadataBase |
| Język HTML | ✅ | `lang="pl"` poprawny |
| Font display | ✅ | `display: 'swap'` dla wydajności |
| Obrazy | ✅ | Next.js Image z AVIF/WebP |

### ⚠️ Do poprawy:

| Problem | Priorytet | Rozwiązanie |
|---------|-----------|-------------|
| **Brak weryfikacji Google Search Console** | Wysoki | Dodać `verification.google` w `layout.tsx:79` |
| **Brak schema.org/JSON-LD** | Wysoki | Dodać strukturyzowane dane dla LocalBusiness, Product, FAQ |
| **Strona `/checkout` nieindeksowana** | Średni | Już jest w porządku - nie powinna być indeksowana |
| **Brak hreflang** | Niski | Tylko polski rynek - nie wymaga |

---

## 2. SEO ON-PAGE

### Strona główna (/)

**Tytuł:** "Ubezpieczenie GAP - Kalkulator Online | GapAuto.pl" (50 znaków) ✅

**Meta description:** 187 znaków - **za długa!** ⚠️
> Powinna mieć 150-160 znaków

**Keywords:** 11 słów kluczowych ✅

### ⚠️ Problemy On-Page:

| Problem | Lokalizacja | Rozwiązanie |
|---------|-------------|-------------|
| **Brak H1 na stronie głównej** | `page.tsx` | Dodać główny nagłówek H1 |
| **H2 tylko w komponentach** | `InsuranceCalculator.tsx:173,446` | OK, ale H1 brakuje na poziomie strony |
| **Meta description za długa** | `layout.tsx:25` | Skrócić do 155-160 znaków |
| **Strona `/kontakt` bez metadanych** | `kontakt/page.tsx` | Dodać export metadata |
| **Blog bez dedykowanych meta** | `blog/page.tsx` | Dodać export metadata |
| **Brak alt dla niektórych obrazów** | Różne | Sprawdzić wszystkie `<img>` |

### Słowa kluczowe - analiza:

**Główne frazy docelowe:**
- "ubezpieczenie GAP" ✅ w title, description
- "kalkulator GAP" ✅ w keywords
- "ubezpieczenie samochodu" ✅ w keywords
- "GAP online" ✅ w title

**Brakujące frazy:**
- "ile kosztuje GAP"
- "GAP czy warto"
- "ubezpieczenie od utraty wartości"
- "GAP fakturowy vs casco"

---

## 3. ANALIZA KONWERSJI

### Funnel konwersji:

```
Strona główna → Kalkulator → Wynik → /gap → /checkout (5 kroków)
```

### ✅ Silne strony konwersji:

| Element | Lokalizacja | Ocena |
|---------|-------------|-------|
| **Kalkulator "above the fold"** | Strona główna | ✅ Doskonałe |
| **CTA "Kup teraz" po obliczeniu** | `InsuranceCalculator.tsx:427-436` | ✅ Dobre |
| **Popup call-to-action** | `CallToActionPopup.tsx` (10s delay) | ✅ Dobre |
| **Social proof (opinie)** | `CustomerReviews.tsx` | ✅ 6 opinii, 4-5 gwiazdek |
| **Trust badges (statystyki)** | `CustomerReviews.tsx:94-107` | ✅ 98%, 15+ lat, 50k+ |
| **FAQ rozbudowane** | `FAQ.tsx` | ✅ 4 kategorie |
| **Telefon widoczny** | Popup + kontakt | ✅ |

### ⚠️ Obszary do poprawy:

| Problem | Wpływ | Rozwiązanie |
|---------|-------|-------------|
| **CTA w CustomerReviews nie działa** | Wysoki | `CustomerReviews.tsx:157` - button bez onClick/href |
| **Newsletter nie funkcjonuje** | Średni | `blog/page.tsx:83-84` - brak obsługi submit |
| **Mapa Google nieosadzona** | Niski | `kontakt/page.tsx:311-314` - placeholder |
| **Formularz kontaktowy symulowany** | Średni | `kontakt/page.tsx:76` - tylko setTimeout |
| **Brak numeru telefonu w Navbar** | Średni | Dodać click-to-call |
| **Brak urgency/scarcity** | Średni | Dodać ograniczone oferty/licznik |

### Checkout Flow:

**Obecny:** 5 kroków - to dużo, może powodować porzucenia

| Krok | Zawartość | Potencjalny problem |
|------|-----------|---------------------|
| 1 | Wybór wariantu | ✅ OK |
| 2 | Dane pojazdu + upload | ⚠️ Upload może odstraszać |
| 3 | Kalkulacja + płatność | ⚠️ Powinno być razem z 4 |
| 4 | Dane osobowe | ⚠️ Za późno - użytkownik już "zaangażowany" |
| 5 | Podsumowanie | ✅ OK |

---

## 4. TRACKING & ANALYTICS

### ✅ Wdrożone:

| Narzędzie | Status | ID |
|-----------|--------|-----|
| **Google Ads** | ✅ | AW-17791274207 |
| **Facebook Pixel** | ✅ | 2207464152992298 |
| **Hotjar** | ✅ | 6580007 |
| **Vercel Analytics** | ✅ | Automatyczne |

### ⚠️ Brakujące:

| Narzędzie | Priorytet | Korzyść |
|-----------|-----------|---------|
| **Google Analytics 4** | Wysoki | Pełne śledzenie zachowań |
| **Google Tag Manager** | Średni | Łatwiejsze zarządzanie tagami |
| **Conversion tracking (zdarzenia)** | Wysoki | Śledzenie kalkulacji, checkout steps |
| **Microsoft Clarity** | Niski | Alternatywa dla Hotjar (darmowa) |

---

## 5. CONTENT & BLOG

### Blog - analiza:

| Metryka | Wartość | Ocena |
|---------|---------|-------|
| Liczba artykułów | 5 statycznych + dynamiczne | ⚠️ Mało |
| Tematy | GAP, OC, AC, młody kierowca | ✅ Trafne |
| Struktura | Hero + grid + newsletter | ✅ OK |
| SEO artykułów | seoTitle, seoDesc w DB | ✅ Dobre |

### Rekomendowane tematy artykułów:

1. "GAP fakturowy vs GAP casco - co wybrać?"
2. "Ile kosztuje ubezpieczenie GAP w 2025?"
3. "Kiedy ubezpieczenie GAP się opłaca?"
4. "Jak zgłosić szkodę z GAP - krok po kroku"
5. "Ubezpieczenie GAP przy leasingu - czy warto?"

---

## 6. REKOMENDACJE - PRIORYTETY

### 🔴 Wysoki priorytet (wpływ na konwersje):

1. **Naprawić CTA w sekcji opinii** - button "Sprawdź ofertę" nie działa
2. **Dodać H1 na stronę główną** - kluczowe dla SEO
3. **Skrócić meta description** do 155 znaków
4. **Dodać schema.org LocalBusiness** - lepsze wyświetlanie w Google
5. **Wdrożyć GA4** z event tracking dla kalkulatora

### 🟡 Średni priorytet:

6. **Dodać metadane do podstron** (/kontakt, /blog, /gap)
7. **Osadzić mapę Google** na stronie kontaktu
8. **Dodać click-to-call w navbar** (widoczny numer telefonu)
9. **Wdrożyć newsletter backend** lub usunąć formularz
10. **Rozbudować FAQ o schema.org FAQPage**

### 🟢 Niski priorytet:

11. **Dodać więcej artykułów blogowych** (cel: 15-20)
12. **A/B testować popup timing** (10s vs 20s vs exit intent)
13. **Rozważyć uproszczenie checkout** (5 kroków → 3-4)
14. **Dodać live chat** (np. Tawk.to, Crisp)

---

## 7. QUICK WINS - natychmiastowe poprawki

### Pliki do edycji:

```
1. CustomerReviews.tsx:157 → Dodać onClick={() => router.push('/gap')}
2. layout.tsx:25 → Skrócić description do ~155 znaków
3. page.tsx → Dodać <h1> z głównym słowem kluczowym
4. kontakt/page.tsx → Dodać export const metadata = {...}
5. blog/page.tsx → Dodać export const metadata = {...}
```

### Przykładowa poprawka meta description:

**Obecna (187 znaków):**
> Kalkulator ubezpieczenia GAP online. Porównaj oferty ubezpieczeń GAP, OC i AC. Kompleksowa ochrona przed utratą wartości pojazdu. Szybkie obliczenie składki i wygodna polisa online. Sprawdź już dziś!

**Zalecana (155 znaków):**
> Kalkulator ubezpieczenia GAP online. Porównaj oferty GAP, OC i AC. Ochrona przed utratą wartości pojazdu. Szybka wycena i polisa online.

---

## 8. SCHEMA.ORG - przykładowa implementacja

### LocalBusiness (do dodania w layout.tsx):

```json
{
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  "name": "GapAuto.pl - Business Care",
  "image": "https://gapauto.pl/BC.png",
  "url": "https://gapauto.pl",
  "telephone": "+48796148577",
  "email": "biuro@gapauto.pl",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Przyszłości 6",
    "addressLocality": "Skubianka",
    "postalCode": "05-140",
    "addressCountry": "PL"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "14:00"
    }
  ],
  "priceRange": "$$",
  "sameAs": [
    "https://www.facebook.com/people/BC-Księgowość/61571088134057/"
  ]
}
```

### FAQPage (do dodania na stronie głównej):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Co to jest ubezpieczenie GAP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ubezpieczenie GAP pokrywa różnicę między wartością fakturową pojazdu a wypłatą z OC/AC sprawcy w przypadku szkody całkowitej lub kradzieży."
      }
    }
  ]
}
```

---

## 9. CHECKLIST WDROŻENIA

- [ ] Naprawić CTA w CustomerReviews
- [ ] Skrócić meta description
- [ ] Dodać H1 na stronę główną
- [ ] Dodać metadata do /kontakt
- [ ] Dodać metadata do /blog
- [ ] Wdrożyć schema.org LocalBusiness
- [ ] Wdrożyć schema.org FAQPage
- [ ] Dodać Google Search Console verification
- [ ] Wdrożyć GA4
- [ ] Osadzić mapę Google
- [ ] Dodać numer telefonu w navbar
- [ ] Podłączyć newsletter do backendu
- [ ] Napisać 5 nowych artykułów blogowych

---

## Podsumowanie końcowe

Strona GapAuto.pl ma solidne fundamenty techniczne i dobrze przemyślaną strukturę konwersji. Główne obszary wymagające uwagi to:

1. **SEO On-Page** - brakujące metadane na podstronach, zbyt długi description
2. **Konwersja** - niedziałające CTA, brak funkcjonalności niektórych formularzy
3. **Structured Data** - brak schema.org (duży potencjał dla local business i FAQ)

Po wdrożeniu rekomendacji wysokiego priorytetu strona powinna znacząco poprawić widoczność w wyszukiwarkach i współczynnik konwersji.

---

*Raport wygenerowany: 2026-01-25*
