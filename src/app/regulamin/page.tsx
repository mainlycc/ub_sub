"use client"

import { ArrowLeft, Book, Users, FileText, Scale } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Footer from "@/components/Footer";

const Terms = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#E1EDFF]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-2" /> Powrót
        </Button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] h-2 w-full"></div>
          
          <div className="p-8">
            {/* Nagłówek z akcentem kolorystycznym */}
            <div className="text-center mb-12">
              <div className="inline-block p-3 bg-[#E1EDFF] rounded-full mb-4">
                <Book className="h-8 w-8 text-[#300FE6]" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Regulamin</h1>
              <div className="mt-4 h-1 w-20 bg-[#FF8E3D] mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-8 text-gray-600">
              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Postanowienia ogólne</h2>
                <p>
                  Administratorem serwisu GapAuto.pl (dalej „Serwis”) jest Ubezpieczenia GAP z siedzibą w Skubiance (05‑140), ul. Przyszłości 6.<br />
                  Kontakt: tel. +48 796 148 577, e‑mail: biuro@gapauto.pl. Godziny pracy: pon.–pt. 9:00–17:00, sob. 9:00–14:00, nd. – nieczynne.<br />
                  Celem Serwisu jest prezentacja i sprzedaż ubezpieczeń GAP („GAP Fakturowy” i „GAP Casco”), kalkulator składki, pomoc i kontakt z obsługą klienta.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Definicje</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <b>Ubezpieczenie GAP</b> – dodatkowa umowa ubezpieczeniowa pokrywająca różnicę między wartością rynkową pojazdu a wartością faktury lub AC w przypadku szkody całkowitej lub kradzieży.
                  </li>
                  <li>
                    <b>GAP Fakturowy</b> – ubezpieczenie pokrywające różnicę do wartości z faktury.
                  </li>
                  <li>
                    <b>GAP Casco</b> – ubezpieczenie pokrywające różnicę do wartości określonej w polisie AC.
                  </li>
                </ul>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Oferta i kalkulator składki</h2>
                <p>
                  Klient może skorzystać z kalkulatora w celu wyceny składki, podając cenę pojazdu, rok produkcji i okres ubezpieczenia (12–60 miesięcy).<br />
                  Oferta obejmuje ubezpieczenia do wartości 300 000 PLN, w okresie do 5 lat od daty zakupu pojazdu.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Zawarcie umowy</h2>
                <p>
                  Umowa ubezpieczenia zawierana jest poprzez złożenie wniosku online lub kontakt telefoniczny/mailowy.<br />
                  Umowa obowiązuje od daty wskazanej w polisie.<br />
                  Umowa może zostać zawarta na okres 12, 24, 36, 48 lub 60 miesięcy.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Składka i płatności</h2>
                <p>
                  Składka ustalana jest w oparciu o: wartość pojazdu, jego wiek, okres ochrony i wybrany limit ubezpieczenia.<br />
                  Istnieje możliwość płatności jednorazowej lub w ratach (miesięcznej, kwartalnej, półrocznej), z ewentualnymi dodatkowymi opłatami administracyjnymi.<br />
                  Akceptowane metody płatności: karta płatnicza, przelew, systemy płatności online – zgodnie z polityką bezpieczeństwa.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Ochrona ubezpieczeniowa i zakres odpowiedzialności</h2>
                <p>
                  Ochrona dotyczy szkód całkowitych oraz kradzieży pojazdu objętego polisą AC (GAP Casco) lub zakupionego na fakturę (GAP Fakturowy).<br />
                  Odszkodowanie wypłacane jest do wysokości różnicy między kwotą odszkodowania AC (lub wartością rynkową) a wartością fakturową lub sumą ubezpieczenia.<br />
                  Standardowy limit odszkodowania wynosi do 100 000 PLN; dostępna jest opcja podniesienia limitu do 150 000 PLN.<br />
                  Wypłata odszkodowania następuje w ciągu 14 dni roboczych od dostarczenia kompletnej dokumentacji.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Zgłaszanie szkód i roszczenia</h2>
                <p>
                  Zgłoszenia należy dokonać za pomocą formularza online lub telefonicznie.<br />
                  Do zgłoszenia należy dołączyć: decyzję odszkodowawczą z AC/OC lub dokument potwierdzający kradzież.<br />
                  Po analizie dokumentów, decyzja i wypłata następuje do 14 dni roboczych.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Prawo odstąpienia i zwrot składki</h2>
                <p>
                  Klient ma prawo odstąpić od umowy w ciągu 30 dni od jej zawarcia – zwrot pełnej składki.<br />
                  Po 30 dniach możliwy jest zwrot proporcjonalny za niewykorzystany okres ochrony.<br />
                  Zwrot składki następuje w ciągu 60 dni od daty rozwiązania umowy.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Obowiązki urzędowe klienta</h2>
                <p>
                  Klient jest zobowiązany: zgłosić szkodę, udostępnić wymagane dokumenty i umożliwić kontakt z ubezpieczycielem AC.<br />
                  W razie konieczności klient współpracuje w procesie likwidacji szkody.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Ochrona danych osobowych</h2>
                <p>
                  Dane osobowe przetwarzane są zgodnie z Polityką Prywatności dostępną w Serwisie.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Reklamacje</h2>
                <p>
                  Reklamacje można składać drogą mailową lub telefoniczną.<br />
                  Reklamacje rozpatrywane są w terminie 30 dni roboczych od ich otrzymania.<br />
                  O decyzji klient zostanie poinformowany pisemnie lub mailowo.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Postanowienia końcowe</h2>
                <p>
                  Rozstrzyganie sporów następuje polubownie, a w przypadku braku porozumienia – przed sądem właściwym dla siedziby Ubezpieczenia GAP.<br />
                  Serwis zastrzega sobie prawo do zmiany Regulaminu – o zmianach użytkownicy będą informowani co najmniej 14 dni przed wejściem w życie.<br />
                  W sprawach nieuregulowanych obowiązują przepisy Kodeksu cywilnego oraz odpowiednich ustaw.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms; 