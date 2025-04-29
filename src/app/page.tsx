"use client"

import React from 'react';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import InsuranceTypeCards from '@/components/InsuranceTypeCards';
import { Services } from '@/components/Services';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

const HomePage = (): React.ReactNode => {
  return (
    <>
      <main className="min-h-screen px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 bg-[#EAE7FC]">
        <InsuranceCalculator />
        <InsuranceTypeCards />
        <Services />
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;