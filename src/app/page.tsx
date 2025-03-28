"use client"

import React from 'react';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import InsuranceTypeCards from '@/components/InsuranceTypeCards';
import AboutUs from '@/components/AboutUs';
import FAQ from '@/components/FAQ';

const HomePage = (): React.ReactNode => {
  return (
    <>
      {/* Kalkulator - importowany jako komponent */}
      <InsuranceCalculator />
      
      {/* Karty informacyjne o typach ubezpieczeń GAP */}
      <InsuranceTypeCards />
      
      {/* Sekcja O nas */}
      <AboutUs />
      
      {/* Sekcja FAQ - przeniesiona na koniec */}
      <FAQ />
    </>
  );
};

export default HomePage;