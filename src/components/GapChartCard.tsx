"use client"

import React from 'react';
import Image from 'next/image';

const GapChartCard = (): React.ReactElement => {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-visible rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2),0_12px_30px_-8px_rgba(0,0,0,0.15)]">
          <div className="bg-white rounded-[20px] border border-gray-200/80 overflow-hidden">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 px-6 sm:px-8 pt-6 sm:pt-8 pb-4 text-center">
              Czym jest limit odszkodowania GAP?
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <p className="text-gray-700 leading-relaxed text-lg sm:text-xl">
                  To pokrycie różnicy pomiędzy <span className="text-[#300FE6] font-semibold">wartością rynkową pojazdu</span> (z polisy AC) a <span className="text-orange-600 font-semibold">kwotą na fakturze zakupu lub umowie kupna-sprzedaży</span>. Dzięki temu, w razie szkody całkowitej lub kradzieży, odzyskujesz pełną zainwestowaną kwotę.
                </p>
              </div>
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] bg-white p-4 sm:p-6 flex items-center justify-center">
                <div className="relative w-full max-w-xl mx-auto aspect-[4/3]">
                  <Image
                    src="/wykres.png"
                    alt="Wykres przedstawiający różnicę między wartością rynkową a ceną zakupu - GAP ubezpieczenie"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </div>
            </div>
            <p className="px-6 sm:px-8 pb-6 sm:pb-8 pt-6 border-t border-gray-200/80 text-center">
              <span className="text-gray-900 font-bold text-lg sm:text-xl lg:text-2xl tracking-tight leading-tight block">
                Wybierz ubezpieczenie GAP{' '}
                <span className="text-orange-600">akceptowane przez wszystkie firmy leasingowe</span>.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GapChartCard;
