"use client"

import React, { useEffect } from 'react';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import InsuranceTypeCards from '@/components/InsuranceTypeCards';
import { Services } from '@/components/Services';
import CustomerReviews from '@/components/CustomerReviews';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import GapComparison from '@/components/GapComparison';
import { trackPageView } from '@/lib/facebook-pixel';
import { generateFAQPageSchema } from '@/lib/structured-data';

const HomePage = (): React.ReactNode => {
  useEffect(() => {
    // Śledź wyświetlenie strony głównej
    trackPageView();
  }, []);

  // FAQ data for schema
  const faqData = [
    {
      question: "Co to jest ubezpieczenie GAP?",
      answer: "Ubezpieczenie GAP (Guaranteed Asset Protection) to dodatkowa ochrona finansowa, która pokrywa różnicę między kwotą odszkodowania z ubezpieczenia komunikacyjnego a początkową wartością pojazdu lub kwotą pozostałą do spłaty leasingu/kredytu w przypadku całkowitego zniszczenia lub kradzieży pojazdu."
    },
    {
      question: "Jakie są rodzaje ubezpieczeń GAP?",
      answer: "Oferujemy dwa główne rodzaje ubezpieczeń GAP: GAP Fakturowy (pokrywa różnicę między wartością fakturową a odszkodowaniem z ubezpieczenia) oraz GAP MAX (pokrywa różnicę między wartością rynkową z dnia zakupu a odszkodowaniem z ubezpieczenia). Oba rodzaje zapewniają ochronę przed utratą wartości pojazdu."
    },
    {
      question: "Czy ubezpieczenie GAP jest obowiązkowe?",
      answer: "Nie, ubezpieczenie GAP nie jest obowiązkowe. Jest to dodatkowe, dobrowolne ubezpieczenie, które zapewnia ochronę finansową w sytuacji szkody całkowitej lub kradzieży pojazdu. Jest jednak szczególnie zalecane przy zakupie nowego samochodu lub finansowaniu samochodu kredytem/leasingiem."
    },
    {
      question: "Jak obliczana jest składka ubezpieczenia GAP?",
      answer: "Składka ubezpieczenia GAP jest obliczana na podstawie kilku czynników, w tym wartości pojazdu, jego wieku, okresu ubezpieczenia oraz wybranego limitu odpowiedzialności. Możesz użyć naszego kalkulatora na stronie, aby otrzymać szybką wycenę."
    }
  ];

  const faqSchema = generateFAQPageSchema(faqData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <main className="min-h-screen px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 bg-[#EAE7FC]">
        {/* Hero Section z H1 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Ubezpieczenie GAP <span className="text-[#300FE6]">od 299 zł/rok</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-6">
            Odzyskaj pełną wartość auta przy kradzieży lub szkodzie całkowitej
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-lg text-gray-800 mb-8">
            <div className="flex items-center">
              <span className="text-2xl mr-2">✓</span>
              <span>Ochrona do 300 000 zł</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">✓</span>
              <span>Polisa online w 5 minut</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">✓</span>
              <span>14 dni na rezygnację</span>
            </div>
          </div>
        </div>

        <InsuranceCalculator />
        <GapComparison />
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