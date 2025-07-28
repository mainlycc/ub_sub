"use client"

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { trackBlogView } from '@/lib/facebook-pixel';

const BlogPostPage = () => {
  useEffect(() => {
    // Śledź wyświetlenie artykułu
    trackBlogView('Jak nie przepłacać za OC? 5 sposobów na tańsze ubezpieczenie samochodu');
  }, []);

  return (
    <div className="min-h-screen bg-[#EAE7FC]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/blog" className="inline-flex items-center text-blue-100 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do bloga
            </Link>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Porady
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Jak nie przepłacać za OC? 5 sposobów na tańsze ubezpieczenie samochodu
            </h1>
            <div className="flex items-center justify-center gap-6 text-blue-100 text-sm">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Ekspert BC</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>15 stycznia 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>8 min czytania</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Ubezpieczenie OC to obowiązkowa polisa dla każdego właściciela pojazdu, ale czy wiesz, że możesz znacząco obniżyć jego koszt? Wielu kierowców co roku przepłaca, nie znając kilku prostych trików. Jeśli chcesz wiedzieć, jak nie przepłacać za OC i znaleźć tańsze ubezpieczenie samochodu, przeczytaj nasze 5 sprawdzonych sposobów.
            </p>

            {/* Obraz ilustracyjny */}
            <div className="my-8">
              <img
                src="/ub1.jpg"
                alt="Samochód na ulicy - ilustracja do artykułu o ubezpieczeniach OC"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-500 text-center mt-2">
                Właściwy wybór ubezpieczenia OC może zaoszczędzić Ci setki złotych rocznie
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">1. Korzystaj z porównywarek ubezpieczeń i kalkulatorów OC/AC</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              To absolutna podstawa! Rynek ubezpieczeń komunikacyjnych jest bardzo konkurencyjny, a ceny różnią się znacznie pomiędzy firmami. Kalkulatory OC online, takie jak te dostępne na gapauto.pl, pozwalają w kilka minut porównać oferty wielu ubezpieczycieli jednocześnie. Wpisując podstawowe dane dotyczące samochodu i swoje, otrzymujesz zestawienie najtańszych polis OC, co pozwala wybrać najlepsze ubezpieczenie samochodu bez wychodzenia z domu. To najszybszy sposób, by zaoszczędzić na OC.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Zbuduj historię bezszkodową</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Im dłużej jeździsz bezwypadkowo, tym większe zniżki otrzymujesz. Historia bezszkodowa to jeden z kluczowych czynników wpływających na wysokość składki OC. Każdy rok bez kolizji czy stłuczki obniża cenę polisy, nawet o kilkadziesiąt procent. Dbaj o bezpieczną jazdę, a z czasem Twoje ubezpieczenie auta będzie znacznie tańsze. To inwestycja w przyszłe oszczędności!
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Zwróć uwagę na dane techniczne pojazdu i swoje</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ubezpieczyciele oceniają ryzyko na podstawie wielu czynników. Pojemność silnika, marka i model auta, rok produkcji, a nawet rodzaj paliwa – wszystko to wpływa na cenę OC. Mały, ekonomiczny samochód zazwyczaj oznacza tańsze OC niż mocna limuzyna czy sportowe auto. Co do Ciebie, wiek kierowcy (młodzi kierowcy płacą więcej), miejsce zamieszkania (duże miasta są droższe) oraz stan cywilny również mają znaczenie. Czasem drobne różnice w specyfikacji auta mogą przełożyć się na znaczące oszczędności.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Zapytaj o zniżki i pakiety</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wielu ubezpieczycieli oferuje dodatkowe zniżki, o których nie wszyscy wiedzą. Pamiętaj, żeby zapytać o:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li><strong>Zniżki za pakiet OC+AC:</strong> Często zakup obu polis w jednej firmie jest tańszy niż kupowanie ich osobno.</li>
              <li><strong>Zniżki za płatność z góry:</strong> Opłacenie składki za cały rok jednorazowo bywa tańsze niż rozłożenie na raty.</li>
              <li><strong>Zniżki za kontynuację:</strong> Niektórzy ubezpieczyciele nagradzają lojalnych klientów.</li>
              <li><strong>Zniżki dla posiadaczy kilku polis:</strong> Jeśli masz ubezpieczenie mieszkania czy życia w tej samej firmie, możesz liczyć na upusty.</li>
              <li><strong>Programy lojalnościowe lub karty flotowe</strong> (jeśli masz więcej niż jedno auto).</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Zawsze warto dopytać agenta lub sprawdzić w kalkulatorze ubezpieczeń, jakie opcje pakietowe są dostępne.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Rozważ zmianę ubezpieczyciela</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Nie bój się zmieniać firmy ubezpieczeniowej! Wielu kierowców pozostaje z tym samym ubezpieczycielem z przyzwyczajenia, nie zdając sobie sprawy, że co roku mógłby płacić mniej. Co roku, przed odnowieniem ubezpieczenia, poświęć kilkanaście minut na porównanie ubezpieczeń samochodowych. Nawet jeśli Twoja dotychczasowa oferta wydaje się dobra, zawsze może pojawić się najtańsza polisa OC u konkurencji. Pamiętaj, że masz prawo wypowiedzieć OC i przenieść się do innej firmy.
            </p>

            <div className="bg-blue-50 border-l-4 border-[#300FE6] p-6 my-8">
              <p className="text-gray-700 leading-relaxed font-medium">
                Stosując te 5 prostych zasad, masz realną szansę, by nie przepłacać za OC i cieszyć się tańszym ubezpieczeniem samochodu. Odwiedź gapauto.pl i sprawdź, ile możesz zaoszczędzić już dziś!
              </p>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] text-white rounded-lg p-8 text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">Sprawdź swoją ofertę OC już dziś!</h3>
              <p className="text-blue-100 mb-6">
                Skorzystaj z naszego kalkulatora i porównaj oferty najlepszych ubezpieczycieli
              </p>
              <Button 
                className="bg-white text-[#300FE6] hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                onClick={() => window.location.href = '/gap'}
              >
                Sprawdź ofertę
              </Button>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Powiązane artykuły</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                GAP vs AC - różnice i korzyści
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                Poznaj różnice między ubezpieczeniem GAP a autocasco i dowiedz się, które jest lepsze w Twojej sytuacji.
              </p>
              <Link href="/blog" className="text-[#300FE6] hover:underline text-sm font-medium">
                Czytaj więcej →
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Najczęstsze błędy przy wyborze ubezpieczenia samochodu
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                Uniknij popularnych błędów przy wyborze ubezpieczenia i zaoszczędź pieniądze dzięki naszym wskazówkom.
              </p>
              <Link href="/blog" className="text-[#300FE6] hover:underline text-sm font-medium">
                Czytaj więcej →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostPage; 