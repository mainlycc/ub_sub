"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, Phone } from 'lucide-react';

const StickyCTA = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Pokaż sticky CTA po przewinięciu 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1 text-center">
            <p className="text-xs font-medium mb-1">Ubezpieczenie GAP</p>
            <p className="text-sm font-bold">od 299 zł/rok</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 bg-white text-[#300FE6] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
              aria-label="Oblicz składkę"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden xs:inline">Oblicz</span>
            </button>
            
            <a
              href="tel:+48796148577"
              className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/30 transition-colors"
              aria-label="Zadzwoń do nas"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xs:inline">Zadzwoń</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;
