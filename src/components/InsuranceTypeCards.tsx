"use client"

import React from 'react';
import { ArrowRight, Shield, FileText, Check } from 'lucide-react';
import Link from 'next/link';

const InsuranceTypeCards = (): React.ReactElement => {
  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Poznaj rodzaje ubezpieczeń GAP</h2>
          <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Oferujemy dwa typy ubezpieczeń, które zabezpieczą Cię przed utratą wartości pojazdu
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* GAP Fakturowy - pomarańczowa karta z czarnymi napisami */}
          <div className="rounded-[20px] overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 bg-[#FF7715] text-white">
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <div className="bg-white/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">GAP Fakturowy</h3>
              </div>
              
              <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                GAP Fakturowy wyrównuje różnicę pomiędzy wartością rynkową pojazdu a wartością określoną w fakturze zakupu w przypadku szkody całkowitej. Dzięki temu otrzymasz pełne odszkodowanie odpowiadające kwocie z faktury, a nie tylko wartości rynkowej w momencie szkody.
              </p>
              
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base">Chroni przed stratą finansową wynikającą z amortyzacji pojazdu</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base">Idealne rozwiązanie dla nowych pojazdów lub do 6 miesięcy od zakupu</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base">Wypłata dodatkowego odszkodowania do 100% wartości fakturowej</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base">Ubezpieczenie dostępne dla samochodów osobowych i dostawczych</p>
                </div>
              </div>
              
              <div className="mt-auto text-center">
                <button className="inline-flex items-center bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-2 rounded-[20px] text-white font-medium transition-colors text-sm sm:text-base">
                  Sprawdź szczegóły <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
            
            <div className="border-t border-white/10 py-3 sm:py-4 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium">Ochrona do</p>
                  <p className="text-xl sm:text-2xl font-bold">300 000 PLN</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Okres ubezpieczenia</p>
                  <p className="text-lg sm:text-xl font-bold">do 5 lat</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* GAP Casco - zielona karta z białymi napisami */}
          <div className="rounded-[20px] overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 bg-[#16AB59] text-white">
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <div className="bg-white/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">GAP Casco</h3>
              </div>
              
              <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                GAP Casco zabezpiecza przed stratą finansową wynikającą z różnicy między wartością rynkową pojazdu a wartością określoną w umowie ubezpieczenia. Dzięki temu w przypadku szkody całkowitej lub kradzieży otrzymasz kwotę odpowiadającą pierwotnej wartości zakupu.
              </p>
              
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base">Dostępne dla używanych samochodów (nawet starszych modeli)</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base">Ochrona przed spadkiem wartości rynkowej pojazdu</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base">Możliwość zakupu podobnego pojazdu po szkodzie całkowitej</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base">Elastyczne warunki ochrony dla różnych typów pojazdów</p>
                </div>
              </div>
              
              <div className="mt-auto text-center">
                <button className="inline-flex items-center bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-2 rounded-[20px] text-white font-medium transition-colors text-sm sm:text-base">
                  Sprawdź szczegóły <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
            
            <div className="border-t border-white/10 py-3 sm:py-4 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium">Ochrona do</p>
                  <p className="text-xl sm:text-2xl font-bold">300 000 PLN</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Okres ubezpieczenia</p>
                  <p className="text-lg sm:text-xl font-bold">do 5 lat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 sm:mt-16 text-center">
          <Link href="/gap">
            <button className="bg-[#300FE6] hover:bg-[#2208B0] text-white font-semibold py-3 sm:py-4 px-8 sm:px-12 rounded-[20px] transition-all shadow-lg text-sm sm:text-base">
              Wypełnij wniosek
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InsuranceTypeCards; 