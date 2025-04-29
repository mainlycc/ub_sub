'use client';

import Image from 'next/image';
import Link from 'next/link';

export function Services() {
  return (
    <div className="bg-white py-8 sm:py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="mb-6">
            <Image
              src="/BC.png"
              alt="BC Logo"
              width={150}
              height={75}
              className="w-32 sm:w-36 md:w-40"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Business Care - Twój partner w biznesie
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-center text-base sm:text-lg">
            Wspieramy firmy i osoby prywatne poprzez kompleksowe rozwiązania ubezpieczeniowe i finansowe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Ubezpieczenia */}
          <Link href="https://gapauto.pl" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-[#E8EFF6] rounded-lg p-6 sm:p-8 transition-transform group-hover:scale-105 relative h-full">
              <div className="absolute top-4 right-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2209B8] transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2209B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Ubezpieczenia</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Kompleksowa ochrona ubezpieczeniowa dla Ciebie i Twojego pojazdu. Oferujemy szeroki wybór ubezpieczeń GAP i innych rozwiązań.
              </p>
            </div>
          </Link>

          {/* Leasing */}
          <div className="block group">
            <div className="bg-[#FF9B50] bg-opacity-20 rounded-lg p-6 sm:p-8 transition-transform group-hover:scale-105 relative h-full">
              <div className="absolute top-4 right-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF9B50] transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF9B50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Leasing</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Elastyczne rozwiązania leasingowe dopasowane do potrzeb Twojej firmy. Pomożemy w wyborze najlepszej opcji finansowania.
              </p>
            </div>
          </div>

          {/* Księgowość */}
          <Link href="https://www.bcsc.pl" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-[#FFD1DC] bg-opacity-30 rounded-lg p-6 sm:p-8 transition-transform group-hover:scale-105 relative h-full">
              <div className="absolute top-4 right-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#F58FA9] transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#F58FA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Księgowość</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Profesjonalna obsługa księgowa dla firm. Zajmujemy się kompleksowym prowadzeniem dokumentacji i doradztwem podatkowym.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 