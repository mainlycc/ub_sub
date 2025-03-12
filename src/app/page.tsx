"use client"

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import InsuranceTypeCards from '@/components/InsuranceTypeCards';
import AboutUs from '@/components/AboutUs';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Kalkulator - importowany jako komponent */}
        <InsuranceCalculator />
        
        {/* Karty informacyjne o typach ubezpieczeń GAP */}
        <InsuranceTypeCards />
        
        {/* Sekcja O nas */}
        <AboutUs />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;