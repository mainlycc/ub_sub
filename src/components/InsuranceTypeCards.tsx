"use client"

import { ArrowRight, Shield, FileText, Car, Check } from 'lucide-react';

const InsuranceTypeCards = () => {
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
          {/* GAP Fakturowy */}
          <div className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-800 p-1">
              <div className="bg-white rounded-t-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <FileText className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">GAP Fakturowy</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Ubezpieczenie GAP Fakturowy pokrywa różnicę między wartością fakturową pojazdu a odszkodowaniem wypłaconym z AC/OC w przypadku całkowitego zniszczenia lub kradzieży.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Chroni przed utratą wartości pojazdu przez cały okres finansowania</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Idealne rozwiązanie dla nowych pojazdów lub do 6 miesięcy od zakupu</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Wypłata dodatkowego odszkodowania do 100% wartości fakturowej</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Ubezpieczenie dostępne dla samochodów osobowych i dostawczych</p>
                  </div>
                </div>
                
                <div className="mt-auto text-center">
                  <button className="inline-flex items-center text-red-600 hover:text-red-800 font-medium">
                    Sprawdź szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-600 to-red-700 py-4 px-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Ochrona do</p>
                  <p className="text-2xl font-bold">150 000 PLN</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Okres ubezpieczenia</p>
                  <p className="text-xl font-bold">do 5 lat</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* GAP Casco */}
          <div className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 p-1">
              <div className="bg-white rounded-t-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">GAP Casco</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Ubezpieczenie GAP Casco pokrywa różnicę między wartością pojazdu z dnia zakupu a wartością rynkową w momencie szkody całkowitej lub kradzieży.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Dostępne dla używanych samochodów (nawet starszych modeli)</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Ochrona przed spadkiem wartości rynkowej pojazdu</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Możliwość zakupu podobnego pojazdu po szkodzie całkowitej</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Elastyczne warunki ochrony dla różnych typów pojazdów</p>
                  </div>
                </div>
                
                <div className="mt-auto text-center">
                  <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    Sprawdź szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Ochrona do</p>
                  <p className="text-2xl font-bold">100 000 PLN</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Okres ubezpieczenia</p>
                  <p className="text-xl font-bold">do 3 lat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block p-1 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 rounded-lg">
            <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-12 rounded-md transition-all">
              Porównaj wszystkie ubezpieczenia GAP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceTypeCards; 