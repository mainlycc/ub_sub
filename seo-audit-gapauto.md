# Audyt i plan zmian - gapauto.pl

## Podsumowanie sytuacji

**Strona:** https://www.gapauto.pl/
**Produkt:** Ubezpieczenie GAP (Guaranteed Asset Protection)
**Warianty:** GAP Fakturowy, GAP Casco
**Limit ochrony:** do 300 000 PLN
**Okres ubezpieczenia:** do 5 lat

### Aktualne wyniki (styczeń 2026)
- **Ruch z Google Ads:** ~100 wejść/tydzień
- **Budżet reklamowy:** ~2000 zł/miesiąc
- **Konwersje:** 9 (za okres 9 gru 2025 - 25 sty 2026)
- **Koszt konwersji:** ~218 zł
- **CTR reklam:** 6,12% (dobry)

---

## Główne problemy strony

### 1. Brak widocznych cen
**Problem:** Użytkownik musi klikać w kalkulator i wypełniać dane żeby zobaczyć cenę. Większość odchodzi zanim to zrobi.

**Rozwiązanie:** Dodać na stronie głównej przykładowe ceny:
- "Ubezpieczenie GAP od 299 zł/rok"
- "Przykład: Samochód za 80 000 zł - składka 450 zł/rok"

### 2. Brak pilności (urgency)
**Problem:** Nie ma powodu żeby kupić TERAZ. Strona informuje, ale nie motywuje do działania.

**Rozwiązanie:**
- "Ochrona zaczyna działać od następnego dnia"
- "Im starsze auto, tym większe ryzyko - nie czekaj"
- Opcjonalnie: limit czasowy promocji

### 3. Brak konkretnych scenariuszy strat
**Problem:** Treść jest ogólnikowa. Ludzie nie rozumieją ile mogą stracić.

**Rozwiązanie - dodać konkretny przykład:**
> "Kupiłeś auto za 120 000 zł. Po 2 latach kradną Ci je. Ubezpieczyciel wypłaca 85 000 zł (wartość rynkowa). **Tracisz 35 000 zł.** Z GAP - dostaniesz pełne 120 000 zł."

### 4. Za dużo kroków do zakupu
**Problem:** Strona główna → Kalkulator → Wypełnij dane → Wniosek → ???

**Rozwiązanie:** Uprościć - kalkulator powinien być PIERWSZY element na stronie z minimalną ilością pól.

### 5. Brak gwarancji zwrotu
**Problem:** Ludzie boją się kupować online ubezpieczenia od nieznanej firmy.

**Rozwiązanie:**
- "14 dni na rezygnację - pełny zwrot"
- "Gwarancja wypłaty odszkodowania"

---

## Zmiany wizualne do wdrożenia

### HERO SEKCJA (above the fold)

#### Obecny stan:
- Ogólny nagłówek bez ceny
- Kalkulator wymaga wielu kroków

#### Nowy stan:

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]                              Tel: 796 148 577   [Kup]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Ubezpieczenie GAP                                             │
│   od 299 zł/rok                                                 │
│                                                                 │
│   Odzyskaj pełną wartość auta przy kradzieży                    │
│   lub szkodzie całkowitej                                       │
│                                                                 │
│   ✓ Ochrona do 300 000 zł                                       │
│   ✓ Polisa online w 5 minut                                     │
│   ✓ 14 dni na rezygnację                                        │
│                                                                 │
│   [    OBLICZ SKŁADKĘ - ZA DARMO    ]                          │
│                                                                 │
│   Zaufało nam 50 000+ kierowców                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### SEKCJA "DLACZEGO GAP?" (Social proof + strach)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Bez GAP możesz stracić nawet 50 000 zł                        │
│                                                                 │
│   ┌──────────────────┐    ┌──────────────────┐                  │
│   │  BEZ GAP         │    │  Z GAP           │                  │
│   │                  │    │                  │                  │
│   │  Kupiłeś auto    │    │  Kupiłeś auto    │                  │
│   │  za 120 000 zł   │    │  za 120 000 zł   │                  │
│   │                  │    │                  │                  │
│   │  Po 2 latach     │    │  Po 2 latach     │                  │
│   │  kradzież        │    │  kradzież        │                  │
│   │                  │    │                  │                  │
│   │  Ubezpieczyciel  │    │  Dostajesz       │                  │
│   │  daje: 85 000 zł │    │  120 000 zł      │                  │
│   │                  │    │                  │                  │
│   │  TRACISZ:        │    │  TRACISZ:        │                  │
│   │  ❌ 35 000 zł    │    │  ✅ 0 zł         │                  │
│   └──────────────────┘    └──────────────────┘                  │
│                                                                 │
│   [    ZABEZPIECZ SIĘ TERAZ    ]                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### UPROSZCZONY KALKULATOR

#### Obecny stan:
- Wiele pól do wypełnienia
- Ukryty na podstronie

#### Nowy stan (na stronie głównej):

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Sprawdź swoją składkę w 30 sekund                             │
│                                                                 │
│   Wartość samochodu:  [_______________] zł                      │
│                                                                 │
│   Rok produkcji:      [2024 ▼]                                  │
│                                                                 │
│   [    OBLICZ SKŁADKĘ    ]                                      │
│                                                                 │
│   Przykład: Auto za 80 000 zł = składka ~399 zł/rok             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### SEKCJA ZAUFANIA (Trust signals)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│   │  15+    │  │  50k+   │  │  98%    │  │  14 dni │           │
│   │  lat    │  │ klientów│  │zadowol. │  │ zwrot   │           │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│                                                                 │
│   Partnerzy: [Business Care] [Defend Insurance]                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### STICKY CTA (pasek na dole ekranu - mobile)

```
┌─────────────────────────────────────────────────────────────────┐
│  GAP od 299 zł/rok    [OBLICZ SKŁADKĘ]    [📞 Zadzwoń]         │
└─────────────────────────────────────────────────────────────────┘
```

---

### NAGŁÓWEK STRONY (top bar)

#### Obecny stan:
- Brak numeru telefonu widocznego

#### Nowy stan:

```
┌─────────────────────────────────────────────────────────────────┐
│  📞 796 148 577  |  ✉️ kontakt@gapauto.pl  |  14 dni na zwrot   │
├─────────────────────────────────────────────────────────────────┤
│  [Logo]    O nas  |  Opinie  |  FAQ  |  Blog    [KUP GAP]      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Zmiany w treści (copy)

### Nagłówki do zmiany:

| Obecny | Nowy |
|--------|------|
| "Ubezpieczenie GAP" | "Ubezpieczenie GAP od 299 zł/rok" |
| "Sprawdź ofertę" | "Oblicz składkę - za darmo" |
| "Dowiedz się więcej" | "Zobacz ile możesz stracić bez GAP" |

### Przyciski CTA:

| Obecny | Nowy |
|--------|------|
| "Sprawdź szczegóły" | "Oblicz składkę w 30 sekund" |
| "Wypełnij wniosek" | "Kup teraz - polisa w 5 minut" |
| "Kup GAP" | "Zabezpiecz swoje auto" |

### Dodatkowe elementy do dodania:

1. **Pod każdym CTA:**
   - "14 dni na rezygnację - pełny zwrot"
   - "Bez zobowiązań - sprawdź cenę"

2. **Social proof przy kalkulatorze:**
   - "Ostatnio obliczono składkę: 2 minuty temu"
   - "Dziś wykupiono: 12 polis"

3. **Urgency (opcjonalnie):**
   - "Cena ważna do końca miesiąca"

---

## Zmiany techniczne

### 1. Dodać śledzenie konwersji
- Google Tag na przycisk "Kup"
- Śledzenie wypełnienia formularza
- Śledzenie finalizacji zakupu

### 2. Poprawić szybkość ładowania
- Sprawdzić PageSpeed Insights
- Zoptymalizować obrazy

### 3. Mobile-first
- Sticky CTA na mobile
- Większe przyciski (min 48px)
- Klikany numer telefonu

---

## Priorytety wdrożenia

| Priorytet | Zmiana | Wpływ na konwersje |
|-----------|--------|-------------------|
| 🔴 1 | Dodać cenę "od 299 zł" w hero | Wysoki |
| 🔴 2 | Przykład straty (120k → 85k) | Wysoki |
| 🔴 3 | Uproszczony kalkulator na górze | Wysoki |
| 🟡 4 | Numer telefonu w nagłówku | Średni |
| 🟡 5 | "14 dni na zwrot" przy CTA | Średni |
| 🟡 6 | Sticky CTA na mobile | Średni |
| 🟢 7 | Social proof ("dziś kupiono X polis") | Niski |
| 🟢 8 | Śledzenie konwersji | Analityka |

---

## Podsumowanie Google Ads (dla kontekstu)

### Co zostało naprawione:
- ✅ Usunięto złe słowa kluczowe (oszczędność ~1000 zł/mies)
- ✅ Dodano wykluczające słowa (oc, ac, mubi, rankomat, etc.)
- ✅ Poprawiono teksty reklam
- ✅ Dodano nowe nagłówki z ceną

### Słowa kluczowe które zostały:
- [ubezpieczenie gap]
- [gap ubezpieczenie]
- [ubezpieczenie gap kalkulator]
- [gap fakturowy]

### Do zrobienia w Google Ads:
- Dodać rozszerzenia objaśnień (callouts)
- Dodać numer telefonu
- Sprawdzić harmonogram reklam
- Wykluczyć słabe grupy demograficzne

---

## Kontakt

**Strona:** gapauto.pl
**Telefon:** 796 148 577
**Budżet Ads:** ~50 zł/dzień

---

*Dokument utworzony: 25 stycznia 2026*
