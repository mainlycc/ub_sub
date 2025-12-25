"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

const BlogPostPage = () => {
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
                GAP
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Ubezpieczenie GAP – czy warto dopłacić, żeby nie stracić tysięcy po szkodzie całkowitej?
            </h1>
            <div className="flex items-center justify-center gap-6 text-blue-100 text-sm">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Ekspert BC</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>8 stycznia 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>9 min czytania</span>
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
              Kupując nowy samochód, często zastanawiamy się nad <strong>ubezpieczeniem AC</strong>, które chroni nas przed szkodą całkowitą lub kradzieżą. Ale czy wiesz, że nawet z pełnym autocasco możesz stracić tysiące złotych, jeśli Twój samochód zostanie skradziony lub całkowicie zniszczony? Właśnie w takich sytuacjach na ratunek przychodzi <strong>ubezpieczenie GAP</strong>. Czy to dodatkowe <strong>ubezpieczenie samochodowe</strong> jest warte swojej ceny? Przekonajmy się!
            </p>

            {/* Obraz ilustracyjny */}
            <div className="my-8">
              <Image
                src="/ub4.jpg"
                alt="Kalkulator i dokumenty finansowe - ilustracja do artykułu o ubezpieczeniu GAP"
                width={1200}
                height={675}
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
              />
              <p className="text-sm text-gray-500 text-center mt-2">
                Ubezpieczenie GAP chroni przed utratą wartości samochodu w przypadku szkody całkowitej
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Co to jest ubezpieczenie GAP i jak działa?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Ubezpieczenie GAP</strong> (Guaranteed Asset Protection) to polisa, która chroni Cię przed stratą finansową wynikającą z utraty wartości pojazdu. W praktyce oznacza to, że w przypadku <strong>szkody całkowitej</strong> (gdy naprawa jest nieopłacalna) lub <strong>kradzieży samochodu</strong>, <strong>ubezpieczenie GAP</strong> pokrywa różnicę pomiędzy wartością rynkową pojazdu w dniu szkody a kwotą wypłaconą przez ubezpieczyciela z polisy AC.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">Przykład:</h4>
              <p className="text-blue-700 leading-relaxed">
                Kupujesz nowy samochód za <strong>100 000 zł</strong>. Po dwóch latach dochodzi do szkody całkowitej. Twoje <strong>ubezpieczenie AC</strong> wypłaca Ci odszkodowanie w wysokości wartości rynkowej samochodu w dniu szkody, czyli np. <strong>70 000 zł</strong>. Bez ubezpieczenia GAP tracisz <strong>30 000 zł</strong>. Z polisą GAP, to właśnie te <strong>30 000 zł</strong> zostanie Ci dopłacone, dzięki czemu odzyskasz pełną wartość zakupu pojazdu lub wartość fakturową.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Rodzaje ubezpieczenia GAP</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Na rynku dostępne są różne warianty <strong>ubezpieczenia GAP</strong>, najpopularniejsze to:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">GAP fakturowy (F-GAP)</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Najczęściej wybierany. Pokrywa różnicę między wartością fakturową (ceną zakupu) pojazdu a odszkodowaniem z AC. Dzięki niemu zawsze odzyskasz kwotę, jaką zapłaciłeś za samochód.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">GAP indeksowy (I-GAP)</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Odszkodowanie jest powiększone o stały procent (np. 10%, 20%) wartości rynkowej pojazdu z dnia szkody. To dobry wybór, jeśli masz już starszy samochód.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">GAP finansowy (leasingowy)</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Dedykowany dla samochodów w leasingu lub kredycie. Pokrywa różnicę między zadłużeniem wobec leasingodawcy/banku a odszkodowaniem z AC.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Kiedy warto rozważyć ubezpieczenie GAP?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Ubezpieczenie GAP</strong> jest szczególnie polecane w kilku sytuacjach:
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#300FE6] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Nowy samochód</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Nowe auta tracą na wartości najszybciej w pierwszych latach użytkowania. GAP niweluje tę stratę.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#300FE6] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Samochód kupiony na kredyt lub w leasingu</h4>
                  <p className="text-gray-700 leading-relaxed">
                    To niemal konieczność! W przypadku szkody całkowitej, standardowe AC może nie pokryć całej kwoty pozostałej do spłaty leasingu/kredytu, a Ty zostaniesz z długiem i bez samochodu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#300FE6] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Drogie samochody</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Im droższy pojazd, tym większa kwota, którą możesz stracić na skutek deprecjacji wartości.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#300FE6] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  4
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Długoterminowe plany posiadania pojazdu</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Jeśli planujesz jeździć samochodem przez wiele lat, GAP zapewni Ci spokój ducha.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#300FE6] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  5
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Obawa przed kradzieżą lub poważną kolizją</h4>
                  <p className="text-gray-700 leading-relaxed">
                    W Polsce niestety wciąż dochodzi do kradzieży, a ryzyko poważnej stłuczki zawsze istnieje.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">💡 Warto wiedzieć:</h4>
              <p className="text-yellow-700 leading-relaxed">
                Ubezpieczenie GAP można wykupić nie tylko dla nowych samochodów, ale także dla używanych pojazdów. Warto rozważyć tę opcję, szczególnie jeśli kupujesz droższy samochód używany.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Czy warto dopłacić? Podsumowanie</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Choć <strong>ubezpieczenie GAP</strong> to dodatkowy koszt, jego wartość staje się nieoceniona w przypadku najgorszego scenariusza – <strong>szkody całkowitej</strong> lub kradzieży. Zapewnia ono pełne bezpieczeństwo finansowe, chroniąc Cię przed utratą kapitału, który zainwestowałeś w samochód. To szczególnie ważne, jeśli planujesz kupić kolejne auto po szkodzie.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-green-800 mb-3">Kluczowe korzyści ubezpieczenia GAP:</h4>
              <ul className="text-green-700 space-y-2">
                <li>• <strong>Ochrona przed utratą wartości</strong> - odzyskujesz pełną kwotę zakupu</li>
                <li>• <strong>Spokój finansowy</strong> - nie martwisz się o deprecjację</li>
                <li>• <strong>Bezpieczeństwo w leasingu/kredycie</strong> - nie zostaniesz z długiem</li>
                <li>• <strong>Elastyczność</strong> - różne warianty dopasowane do potrzeb</li>
                <li>• <strong>Wartość dodana</strong> - dodatkowa ochrona przy stosunkowo niskim koszcie</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">
              Zamiast martwić się o utratę wartości pojazdu, pomyśl o <strong>ubezpieczeniu GAP</strong> jako o inwestycji w spokój ducha. Zawsze warto dokładnie sprawdzić dostępne <strong>oferty ubezpieczeń</strong> i skonsultować się ze specjalistą. Skorzystaj z <strong>kalkulatora ubezpieczeń online</strong> na <strong>gapauto.pl</strong>, aby dowiedzieć się więcej o <strong>polisach GAP</strong> i dopasować ochronę do swoich potrzeb!
            </p>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] text-white rounded-lg p-8 text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">Sprawdź oferty ubezpieczenia GAP!</h3>
              <p className="text-blue-100 mb-6">
                Skorzystaj z naszego kalkulatora i porównaj najlepsze oferty ubezpieczenia GAP
              </p>
              <Button 
                className="bg-white text-[#300FE6] hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                onClick={() => window.location.href = '/gap'}
              >
                Sprawdź ofertę GAP
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
                Jak obliczyć wartość ubezpieczenia GAP?
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                Praktyczny przewodnik po obliczaniu wartości ubezpieczenia GAP i czynnikach wpływających na cenę.
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