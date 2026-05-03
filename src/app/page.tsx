"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import GapChartCard from '@/components/GapChartCard';
import GapComparisonSection from '@/components/GapComparisonSection';
import InsuranceTypeCards from '@/components/InsuranceTypeCards';
import { Services } from '@/components/Services';
import CustomerReviews from '@/components/CustomerReviews';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { trackLead, trackPageView } from '@/lib/facebook-pixel';
import HeroSection from '@/components/home/HeroSection';
import PreQualQuiz, { PreQualResult } from '@/components/home/PreQualQuiz';

const HomePage = (): React.ReactNode => {
  useEffect(() => {
    // Śledź wyświetlenie strony głównej
    trackPageView();
  }, []);

  const preQualRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);

  const [preQualResult, setPreQualResult] = useState<PreQualResult | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  const calculatorInitial = useMemo(() => {
    if (!preQualResult) return null;
    return {
      initialInsuranceType: preQualResult.recommendedInsuranceType,
      initialMonths: preQualResult.recommendedMonths,
      initialCarPrice: preQualResult.estimatedCarPrice,
    };
  }, [preQualResult]);

  return (
    <>
      <main className="min-h-screen px-4 sm:px-6 md:px-8 pt-0 pb-8 sm:pb-10 md:pb-12 bg-[#EAE7FC]">
        <HeroSection
          onCtaClick={() => preQualRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />
        <GapComparisonSection />
        <div ref={preQualRef}>
          <PreQualQuiz
            onComplete={(result) => {
              setPreQualResult(result);
              setShowCalculator(true);
              trackLead("Calculator revealed (post pre-qual)", "Home");
              // po ustawieniu stanu przewijamy do kalkulatora
              setTimeout(() => calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
            }}
          />
        </div>

        <div ref={calculatorRef}>
          {showCalculator && (
            <InsuranceCalculator
              hideIntro
              {...(calculatorInitial ?? {})}
            />
          )}
        </div>

        {/* Reszta contentu niżej — cold traffic ma szybciej dostać AHA + flow */}
        <GapChartCard />
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