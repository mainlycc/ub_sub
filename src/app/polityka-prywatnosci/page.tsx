"use client"

import { ArrowLeft, Shield, Lock, UserCheck, Database, FileCheck, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#E1EDFF]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Przycisk powrotu */}
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
                <Shield className="h-8 w-8 text-[#300FE6]" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Polityka Prywatności</h1>
              <div className="mt-4 h-1 w-20 bg-[#FF8E3D] mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-8 text-gray-600">
              {/* Nowa treść polityki prywatności */}
              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§1 Postanowienia ogólne</h2>
                <p>
                  Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazywanych przez Użytkowników w związku z korzystaniem z serwisu internetowego dostępnego pod adresem www.gapauto.pl (dalej: „Serwis”).<br />
                  Administratorem danych osobowych jest firma Ubezpieczenia GAP, z siedzibą przy ul. Przyszłości 6, 05‑140 Skubianka (dalej: „Administrator”).<br />
                  Administrator przetwarza dane zgodnie z obowiązującym prawem, w tym z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 („RODO”).
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§2 Zakres zbieranych danych</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Imię i nazwisko</li>
                  <li>Adres e-mail</li>
                  <li>Numer telefonu</li>
                  <li>Informacje o pojeździe (np. cena, rok produkcji, numer rejestracyjny)</li>
                  <li>Dane identyfikacyjne w przypadku zakupu polisy (np. PESEL, adres zamieszkania, dane nabywcy pojazdu)</li>
                  <li>Adres IP oraz dane techniczne dotyczące urządzenia i przeglądarki</li>
                </ul>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§3 Cele przetwarzania danych</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Przygotowanie i przedstawienie oferty ubezpieczeniowej (podstawa: art. 6 ust. 1 lit. b RODO).</li>
                  <li>Realizacja umowy ubezpieczenia GAP (art. 6 ust. 1 lit. b RODO).</li>
                  <li>Obsługa zapytań kierowanych przez formularz kontaktowy (art. 6 ust. 1 lit. f RODO).</li>
                  <li>Marketing bezpośredni własnych usług (art. 6 ust. 1 lit. f RODO).</li>
                  <li>Wypełnienie obowiązków prawnych (np. księgowych, podatkowych – art. 6 ust. 1 lit. c RODO).</li>
                  <li>Dochodzenie ewentualnych roszczeń lub obrona przed nimi (art. 6 ust. 1 lit. f RODO).</li>
                </ul>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§4 Odbiorcy danych</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Towarzystwa ubezpieczeniowe współpracujące z Administratorem,</li>
                  <li>Firmy obsługujące systemy płatności (jeśli dotyczy),</li>
                  <li>Dostawcy usług IT, hostingu i poczty elektronicznej,</li>
                  <li>Księgowi i doradcy prawni Administratora,</li>
                  <li>Podmioty uprawnione do otrzymania danych na podstawie przepisów prawa.</li>
                </ul>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§5 Przekazywanie danych poza EOG</h2>
                <p>
                  Administrator nie przekazuje danych osobowych poza Europejski Obszar Gospodarczy (EOG), chyba że będzie to konieczne i zabezpieczone zgodnie z RODO (np. poprzez stosowanie standardowych klauzul umownych UE).
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§6 Okres przechowywania danych</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>przez okres niezbędny do realizacji umowy ubezpieczeniowej i jej rozliczenia,</li>
                  <li>przez okres przedawnienia ewentualnych roszczeń (do 6 lat),</li>
                  <li>w przypadku danych marketingowych – do momentu wycofania zgody lub wniesienia sprzeciwu,</li>
                  <li>w przypadku formularzy kontaktowych – do 12 miesięcy od ostatniego kontaktu.</li>
                </ul>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§7 Prawa osób, których dane dotyczą</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>dostępu do swoich danych,</li>
                  <li>sprostowania danych,</li>
                  <li>usunięcia danych („prawo do bycia zapomnianym”),</li>
                  <li>ograniczenia przetwarzania,</li>
                  <li>przenoszenia danych,</li>
                  <li>wniesienia sprzeciwu wobec przetwarzania danych,</li>
                  <li>cofnięcia zgody na przetwarzanie (jeśli podstawą była zgoda),</li>
                  <li>wniesienia skargi do Prezesa UODO.</li>
                </ul>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§8 Pliki cookies</h2>
                <p>
                  Serwis wykorzystuje pliki cookies (ciasteczka) w celu zapewnienia prawidłowego działania, analizy ruchu i personalizacji treści.<br />
                  Użytkownik może zarządzać plikami cookies z poziomu swojej przeglądarki internetowej.<br />
                  Szczegółowe informacje znajdują się w Polityce Cookies.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§9 Zabezpieczenia</h2>
                <p>
                  Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające ochronę przetwarzanych danych osobowych przed ich przypadkowym lub niezgodnym z prawem zniszczeniem, utratą, zmianą, ujawnieniem lub dostępem.
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§10 Kontakt</h2>
                <p>
                  W sprawach dotyczących ochrony danych osobowych można kontaktować się z Administratorem:<br />
                  Adres e-mail: biuro@gapauto.pl<br />
                  Tel.: +48 796 148 577<br />
                  Adres korespondencyjny: ul. Przyszłości 6, 05-140 Skubianka
                </p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§11 Zmiany Polityki</h2>
                <p>
                  Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności. Zmiany będą publikowane na stronie internetowej Serwisu.
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

export default PrivacyPolicy; 