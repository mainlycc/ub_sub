"use client"

import { ArrowLeft, Shield, Lock, UserCheck, Database, FileCheck, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

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
              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <div className="flex items-start">
                  <div className="bg-[#300FE6]/10 p-2 rounded-lg mr-4">
                    <Lock className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Informacje ogólne</h2>
                    <p>
                      Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych Użytkowników 
                      korzystających z serwisu ubezpieczeniowego GAP. Dbamy o bezpieczeństwo danych osobowych i przetwarzamy 
                      je zgodnie z obowiązującymi przepisami prawa oraz zgodnie z wdrożonymi procedurami bezpieczeństwa.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <div className="flex items-start">
                  <div className="bg-[#300FE6]/10 p-2 rounded-lg mr-4">
                    <UserCheck className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Administrator danych</h2>
                    <p>
                      Administratorem danych osobowych jest nasza firma ubezpieczeniowa z siedzibą w Polsce. 
                      Kontakt w sprawach związanych z ochroną danych osobowych możliwy jest poprzez e-mail: privacy@ubezpieczeniagap.pl
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <div className="flex items-start">
                  <div className="bg-[#300FE6]/10 p-2 rounded-lg mr-4">
                    <Database className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Zakres zbieranych danych</h2>
                    <p>Przetwarzamy następujące dane osobowe:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Imię i nazwisko</li>
                      <li>Adres e-mail</li>
                      <li>Numer telefonu</li>
                      <li>Adres zamieszkania</li>
                      <li>PESEL</li>
                      <li>Dane pojazdu (marka, model, VIN, numer rejestracyjny)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <div className="flex items-start">
                  <div className="bg-[#300FE6]/10 p-2 rounded-lg mr-4">
                    <FileCheck className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Cel przetwarzania danych</h2>
                    <p>Dane osobowe przetwarzamy w celu:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Zawarcia i realizacji umowy ubezpieczenia</li>
                      <li>Obsługi zgłoszeń i reklamacji</li>
                      <li>Realizacji obowiązków prawnych</li>
                      <li>Marketingu bezpośredniego naszych usług</li>
                      <li>Analiz i statystyk</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <div className="flex items-start">
                  <div className="bg-[#300FE6]/10 p-2 rounded-lg mr-4">
                    <ShieldCheck className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Prawa użytkownika</h2>
                    <p>Każdy użytkownik ma prawo do:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Dostępu do swoich danych</li>
                      <li>Sprostowania danych</li>
                      <li>Usunięcia danych</li>
                      <li>Ograniczenia przetwarzania</li>
                      <li>Przenoszenia danych</li>
                      <li>Wniesienia sprzeciwu</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <div className="flex items-start">
                  <div className="bg-[#300FE6]/10 p-2 rounded-lg mr-4">
                    <Shield className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Bezpieczeństwo danych</h2>
                    <p>
                      Stosujemy odpowiednie środki techniczne i organizacyjne, aby zapewnić bezpieczeństwo przetwarzanych 
                      danych osobowych. Dane są szyfrowane i przechowywane na zabezpieczonych serwerach.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 