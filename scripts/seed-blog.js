/*
  Skrypt: seed-blog.js
  Cel: dodać istniejące wpisy blogowe do bazy (tabela Post) tak, aby pokazały się na liście /blog.

  Uwaga:
  - Treść content jest uproszczona (HTML z linkiem do istniejącej wersji statycznej),
    dzięki czemu lista /blog będzie zasilana z bazy, a użytkownik i tak zobaczy pełny artykuł po kliknięciu.
  - Status ustawiony na PUBLISHED, daty publikacji zgodne z nagłówkami w plikach.
*/

// Załaduj zmienne środowiskowe z pliku .env
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = [
    {
      title: 'Jak nie przepłacać za OC? 5 sposobów na tańsze ubezpieczenie samochodu',
      slug: 'jak-nie-przeplacac-za-oc',
      excerpt: '5 sprawdzonych sposobów na tańsze OC i świadomy wybór polisy.',
      author: 'Ekspert BC',
      coverUrl: '/ub1.jpg',
      publishedAt: new Date('2024-01-15T08:00:00Z'),
      content:
        '<p>Pełna treść artykułu jest już dostępna. Przejdź do <a href="/blog/jak-nie-przeplacac-za-oc">/blog/jak-nie-przeplacac-za-oc</a>.</p>'
    },
    {
      title: 'Kalkulator OC/AC online: Szybko, tanio i bez wychodzenia z domu? Sprawdzamy, jak to działa!',
      slug: 'kalkulator-oc-ac-online',
      excerpt: 'Jak działają kalkulatory ubezpieczeń i dlaczego warto z nich korzystać.',
      author: 'Ekspert BC',
      coverUrl: '/ub5.jpg',
      publishedAt: new Date('2024-01-06T08:00:00Z'),
      content:
        '<p>Pełna treść artykułu jest już dostępna. Przejdź do <a href="/blog/kalkulator-oc-ac-online">/blog/kalkulator-oc-ac-online</a>.</p>'
    },
    {
      title: 'Ubezpieczenie GAP – czy warto dopłacić, żeby nie stracić tysięcy po szkodzie całkowitej?',
      slug: 'ubezpieczenie-gap-czy-warto-doplacic',
      excerpt: 'Czym jest ubezpieczenie GAP, jego rodzaje i kiedy warto je mieć.',
      author: 'Ekspert BC',
      coverUrl: '/ub4.jpg',
      publishedAt: new Date('2024-01-08T08:00:00Z'),
      content:
        '<p>Pełna treść artykułu jest już dostępna. Przejdź do <a href="/blog/ubezpieczenie-gap-czy-warto-doplacic">/blog/ubezpieczenie-gap-czy-warto-doplacic</a>.</p>'
    },
    {
      title: 'Wypadek, stłuczka, a może kradzież? Kiedy przyda Ci się assistance i NNW',
      slug: 'wypadek-stluczka-kradziez-assistance-nnw',
      excerpt: 'Kiedy warto mieć assistance oraz NNW i co obejmują.',
      author: 'Ekspert BC',
      coverUrl: '/ub2.jpg',
      publishedAt: new Date('2024-01-10T08:00:00Z'),
      content:
        '<p>Pełna treść artykułu jest już dostępna. Przejdź do <a href="/blog/wypadek-stluczka-kradziez-assistance-nnw">/blog/wypadek-stluczka-kradziez-assistance-nnw</a>.</p>'
    },
    {
      title: 'Młody kierowca, duża składka? 5 sposobów na obniżenie kosztów ubezpieczenia',
      slug: 'mlody-kierowca-duza-skladka',
      excerpt: 'Praktyczne sposoby na tańsze ubezpieczenie dla młodego kierowcy.',
      author: 'Ekspert BC',
      coverUrl: '/ub3.jpg',
      publishedAt: new Date('2024-01-12T08:00:00Z'),
      content:
        '<p>Pełna treść artykułu jest już dostępna. Przejdź do <a href="/blog/mlody-kierowca-duza-skladka">/blog/mlody-kierowca-duza-skladka</a>.</p>'
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        author: p.author,
        coverUrl: p.coverUrl,
        content: p.content,
        status: 'PUBLISHED',
        publishedAt: p.publishedAt,
      },
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        author: p.author,
        coverUrl: p.coverUrl,
        content: p.content,
        status: 'PUBLISHED',
        publishedAt: p.publishedAt,
      }
    });
    console.log(`✔ Zseedowano/zmodyfikowano wpis: ${p.slug}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


