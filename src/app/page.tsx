"use client"

import React, { useEffect } from 'react';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import InsuranceTypeCards from '@/components/InsuranceTypeCards';
import { Services } from '@/components/Services';
import CustomerReviews from '@/components/CustomerReviews';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { trackPageView } from '@/lib/facebook-pixel';

const HomePage = (): React.ReactNode => {
  useEffect(() => {
    // Śledź wyświetlenie strony głównej
    trackPageView();
  }, []);

  return (
    <>
      <main className="min-h-screen px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 bg-[#EAE7FC]">
        <InsuranceCalculator />
        <InsuranceTypeCards />
        <Services />
        <CustomerReviews />
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;