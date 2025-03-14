"use client"

import { Shield, TrendingUp, Calculator, HeartHandshake, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <section className="py-16 bg-white" id="about-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek sekcji */}
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-[#E1EDFF] text-[#300FE6] rounded-full text-sm font-semibold mb-3">
            O nas
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Business Care 
            <span className="text-[#300FE6]"> 
              - Twój partner w biznesie
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Wspieramy firmy i osoby prywatne, oferując kompleksowe rozwiązania ubezpieczeniowe i finansowe.
          </p>
        </div>

        {/* Wizualizacja głównych obszarów działalności */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#E1EDFF] rounded-xl p-8 shadow-md transform transition hover:scale-105">
            <div className="bg-black/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ubezpieczenia</h3>
            <p className="text-gray-800">
              Oferujemy szeroki zakres ubezpieczeń dla firm i osób prywatnych, w tym OC, CASCO i ubezpieczenia mienia.
            </p>
          </div>

          <div className="bg-[#FF8E3D] rounded-xl p-8 shadow-md transform transition hover:scale-105">
            <div className="bg-black/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="h-8 w-8 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Leasing</h3>
            <p className="text-gray-900">
              Dopasowane rozwiązania leasingowe dla małych i średnich firm, umożliwiające rozwój bez obciążania budżetu.
            </p>
          </div>

          <div className="bg-[#16AB59] rounded-xl p-8 shadow-md transform transition hover:scale-105">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Księgowość</h3>
            <p className="text-white">
              Specjalizujemy się w obsłudze jednoosobowych działalności gospodarczych, zapewniając zgodność z przepisami.
            </p>
          </div>
        </div>

        {/* Misja firmy */}
        <div className="relative mb-20">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-gray-500 text-sm font-medium">NASZA MISJA</span>
          </div>
        </div>

        <div className="bg-[#300FE6] rounded-xl mb-16">
          <div className="p-8 sm:p-10 text-center">
            <HeartHandshake className="h-16 w-16 text-white mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Kompleksowa obsługa na najwyższym poziomie</h3>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Business Care to firma, która stawia na profesjonalizm, transparentność i pełne zrozumienie potrzeb swoich klientów.
              Zaufaj ekspertom i zadbaj o bezpieczeństwo swojego biznesu z naszą pomocą!
            </p>
          </div>
        </div>

        {/* Dlaczego warto nam zaufać */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Dlaczego warto z nami współpracować?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="flex-shrink-0 mr-5">
                <div className="bg-red-100 p-3 rounded-full">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Doświadczenie i profesjonalizm</h4>
                <p className="text-gray-600">
                  Dzięki wieloletniemu doświadczeniu oraz indywidualnemu podejściu do każdego klienta, 
                  oferujemy usługi na najwyższym poziomie, które pomagają w zarządzaniu ryzykiem oraz 
                  zapewniają bezpieczeństwo finansowe.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-5">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Oszczędność czasu</h4>
                <p className="text-gray-600">
                  Dzięki naszym usługom, przedsiębiorcy mogą skupić się na rozwoju swojego biznesu, 
                  mając pewność, że sprawy ubezpieczeniowe, leasingowe i księgowe są prowadzone 
                  zgodnie z obowiązującymi przepisami, a rozliczenia są transparentne i rzetelne.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wezwanie do działania */}
        <div className="text-center">
          <div className="inline-block p-1 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 rounded-lg">
            <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-12 rounded-md transition-all">
              Skontaktuj się z nami
            </button>
          </div>
          <p className="mt-4 text-gray-600">
            Zadbaj o bezpieczeństwo swojej firmy i finanse dzięki Business Care
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs; 