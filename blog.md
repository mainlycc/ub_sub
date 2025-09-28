) Decyzje i zakres
Określ model wpisu: tytuł, slug, treść (HTML/MDX), lead/description, tagi, status (draft/published), data publikacji, autor, miniaturka/cover, SEO (title/description), opcjonalnie kategorie.
Zdecyduj o edytorze: prosty textarea lub lekki markdown; obrazy na razie jako URL.
2) Inicjalizacja bazy i ORM
Dodaj Prisma do projektu i wskaż SQLite jako bazę lokalną.
Skonfiguruj plik środowiskowy z DATABASE_URL do pliku SQLite w repo (np. ub_sub/…/sqlite/db.sqlite).
Utwórz schemat Prisma z modelem Post (pola jak wyżej) + indeksy (unikalny slug, indeks po publishedAt, status).
3) Migracje i dane startowe
Wygeneruj pierwszą migrację i utwórz bazę.
Opcjonalnie dodaj skrypt seed: jeden-dwa przykładowe wpisy (draft + published).
4) Warstwa dostępu do danych
Dodaj klienta Prisma w lib/ z bezpieczną inicjalizacją w Next (singletons w dev).
Przygotuj funkcje serwisowe: createPost, updatePost, publishPost, unpublishPost, deletePost, getPostBySlug, listPosts (z filtrowaniem po statusie i dacie publikacji), searchPosts.
5) Routing publiczny bloga (App Router)
Zmień blog na dynamiczny: app/blog/page.tsx (lista) i app/blog/[slug]/page.tsx (szczegół).
Lista: renderuj tylko wpisy opublikowane i z publishedAt <= now.
Pojedynczy wpis: zwracaj 404, jeśli nieopublikowany lub przyszła data.
SEO: ustaw generateMetadata na podstawie danych z bazy.
(Opcjonalnie) RSS i sitemap generowane z danych z bazy.
6) Migracja istniejących treści
Przenieś istniejące statyczne wpisy z src/app/blog/... do bazy:
Ustal slugi zgodne z dotychczasowymi URL-ami.
Z treści zrób markdown/HTML w polu content.
Uzupełnij publishedAt wg realnej daty publikacji.
Tymczasowo pozostaw stare strony, ale przekieruj 301 do nowych dynamicznych tras (lub usuń po weryfikacji).
7) Panel mini CMS (admin)
Utwórz sekcję app/admin/blog z podstronami: lista, nowy, edycja.
Użyj komponentów shadcn/ui już obecnych w projekcie (przyciski, formularze, dialogi, selecty, textarea).
Formularz: tytuł, slug (auto z tytułu, możliwość edycji), status, data publikacji (z planowaniem), treść, tagi, cover, SEO.
Akcje: Zapisz jako draft, Opublikuj teraz, Zaplanuj publikację (ustaw publishedAt w przyszłości), Cofnij publikację, Usuń.
Walidacja: długości, unikalność slug, wymagane pola przy publikacji.
8) Autoryzacja do panelu
Wykorzystaj istniejące lib/auth.ts (jeśli jest) lub dodaj prostą ochronę tras admina (tylko zalogowani/rola admin).
Zabezpiecz API routes dla CRUD postów (tylko autoryzowani).
9) API lub akcje serwerowe
Wybierz jedno:
API routes do CRUD na Post, wywoływane z panelu admin.
Lub Server Actions w formularzach (mniej “boilerplate”, kontrola na serwerze).
Zapewnij walidację wejścia (np. Zod) i zwracanie błędów do UI.
10) Rewalidacja i cache
Dla stron bloga ustaw ISR lub revalidateTag/revalidatePath.
Po publikacji/edycji wywołuj rewalidację listy i konkretnego wpisu.
Lista sortowana po publishedAt desc, paginacja (opcjonalnie infinite-scroll).
11) Podgląd draftów
Mechanizm preview: specjalny token/tryb dla podglądu wersji draft (tylko w adminie).
W publicznym widoku ukrywaj drafty i planowane wpisy.
12) Wyszukiwanie i tagi
Prosta wyszukiwarka w app/blog po tytule/opisie.
Filtrowanie po tagach; trasa app/blog/tag/[tag]/page.tsx.
13) Obrazy i pliki
Na start: URL do obrazów trzymany w bazie (np. public/ lub zewnętrzny CDN).
Później: uploader do S3/Cloudinary (opcjonalnie), miniatury, alt tekst.
14) SEO i linkowanie
generateMetadata per wpis (title/description, og:image z cover).
Kanoniczne URL-e i breadcrumbs; linkowanie wewnętrzne w treści.
15) Backup i utrzymanie
Regularne kopie pliku SQLite + katalog migracji (np. w CI lub skrypt lokalny).
Przed publikacją nowej wersji aplikacji – uruchom migracje.
Monitoring błędów (np. Sentry) dla panelu i API.
16) Wydajność i bezpieczeństwo
Ogranicz payload treści na listach (bez pełnego content).
Sanitacja HTML, jeśli użyjesz HTML w content.
Rate limit dla API admin i audit log (kto co zmienił).
17) Produkcja i hosting
SQLite lokalnie jest OK; w produkcji na serverless (np. Vercel) zapis na FS bywa problematyczny. Rozważ:
VPS/Docker z trwałym wolumenem, lub
kompatybilny serwis (Turso/libSQL, Planetscale/Postgres) bez zmiany warstwy Prisma.
Ustal ścieżkę do pliku DB i strategię deployu z migracjami.
18) QA i migracja końcowa
Przejrzyj wszystkie stare URL-e – potwierdź, że odpowiadają nowym slugom.
Sprawdź 404, rss, sitemap, SEO meta.
Przetestuj publikację, planowanie, rewalidację i podgląd draftów.
19) Dokumentacja i operacje
Spisz krótką instrukcję: jak dodać wpis, jak opublikować, jak zrobić backup i jak odtworzyć bazę.
Dodaj checklistę publikacji (SEO, obrazek, tagi, linki, data).
20) Rozszerzenia (opcjonalnie)
Historia wersji wpisów (wersjonowanie).
Komentarze (zewnętrzny provider).
Role: autor, redaktor, admin.
- -