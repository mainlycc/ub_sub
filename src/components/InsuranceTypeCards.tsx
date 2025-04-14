"use client"

import React from 'react';
import { ArrowRight, Shield, FileText, Check } from 'lucide-react';
import Link from 'next/link';

const InsuranceTypeCards = (): React.ReactElement => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Poznaj rodzaje ubezpieczeń GAP</h2>
          <p className="mt-3 text-xl text-gray-600 max-w-3xl mx-auto">
            Oferujemy dwa typy ubezpieczeń, które zabezpieczą Cię przed utratą wartości pojazdu
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* GAP Fakturowy - pomarańczowa karta z czarnymi napisami */}
          <div className="rounded-xl overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 bg-[#FF7715] text-white">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-white/10 p-3 rounded-full mr-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">GAP Fakturowy</h3>
              </div>
              
              <p className="mb-6">
                GAP Fakturowy wyrównuje różnicę pomiędzy wartością rynkową pojazdu a wartością określoną w fakturze zakupu w przypadku szkody całkowitej. Dzięki temu otrzymasz pełne odszkodowanie odpowiadające kwocie z faktury, a nie tylko wartości rynkowej w momencie szkody.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p>Chroni przed stratą finansową wynikającą z amortyzacji pojazdu</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p>Idealne rozwiązanie dla nowych pojazdów lub do 6 miesięcy od zakupu</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p>Wypłata dodatkowego odszkodowania do 100% wartości fakturowej</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p>Ubezpieczenie dostępne dla samochodów osobowych i dostawczych</p>
                </div>
              </div>
              
              <div className="mt-auto text-center">
                <button className="inline-flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                  Sprawdź szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="border-t border-white/10 py-4 px-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Ochrona do</p>
                  <p className="text-2xl font-bold">300 000 PLN</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Okres ubezpieczenia</p>
                  <p className="text-xl font-bold">do 5 lat</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* GAP Casco - zielona karta z białymi napisami */}
          <div className="rounded-xl overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 bg-[#16AB59] text-white">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-white/10 p-3 rounded-full mr-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">GAP Casco</h3>
              </div>
              
              <p className="mb-6">
                GAP Casco zabezpiecza przed stratą finansową wynikającą z różnicy między wartością rynkową pojazdu a wartością określoną w umowie ubezpieczenia. Dzięki temu w przypadku szkody całkowitej lub kradzieży otrzymasz kwotę odpowiadającą pierwotnej wartości zakupu.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p>Dostępne dla używanych samochodów (nawet starszych modeli)</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p>Ochrona przed spadkiem wartości rynkowej pojazdu</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p>Możliwość zakupu podobnego pojazdu po szkodzie całkowitej</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p>Elastyczne warunki ochrony dla różnych typów pojazdów</p>
                </div>
              </div>
              
              <div className="mt-auto text-center">
                <button className="inline-flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                  Sprawdź szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="border-t border-white/10 py-4 px-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Ochrona do</p>
                  <p className="text-2xl font-bold">300 000 PLN</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Okres ubezpieczenia</p>
                  <p className="text-xl font-bold">do 5 lat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/gap">
            <button className="bg-[#300FE6] hover:bg-[#2208B0] text-white font-semibold py-4 px-12 rounded-md transition-all shadow-lg">
              Wypełnij wniosek
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InsuranceTypeCards; 