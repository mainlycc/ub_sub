"use client"

import React from 'react';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import InsuranceTypeCards from '@/components/InsuranceTypeCards';
import AboutUs from '@/components/AboutUs';
import FAQ from '@/components/FAQ';

const HomePage = (): React.ReactNode => {
  return (
    <main className="min-h-screen p-8">
      <InsuranceCalculator />
      <InsuranceTypeCards />
      <AboutUs />
      <FAQ />
    </main>
  );
};

export default HomePage;