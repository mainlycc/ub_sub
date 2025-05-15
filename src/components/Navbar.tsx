"use client"

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Funkcja do nawigacji na stronę główną
  const navigateToHome = () => {
    router.push('/');
  };

  // Funkcja do scrollowania do sekcji
  const scrollToSection = (sectionId: string) => {
    // Zamykanie menu mobilnego po kliknięciu
    setIsMenuOpen(false);
    
    // Jeśli klikniemy na "Kontakt" w menu, przekierowujemy do strony kontaktowej
    if (sectionId === 'contact') {
      router.push('/kontakt');
      return;
    }
    
    // Sprawdzenie czy jesteśmy na stronie głównej
    if (pathname !== '/') {
      // Jeśli nie, przekieruj na stronę główną z hashtagiem
      router.push(`/#${sectionId}`);
      return;
    }
    
    // Jeśli jesteśmy na stronie głównej, przewiń do sekcji
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Obsługa hash URL przy wczytywaniu strony
  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const sectionId = window.location.hash.substring(1); // usunięcie #
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex justify-between items-center">
          <div 
            onClick={navigateToHome} 
            className="flex items-center cursor-pointer"
          >
            <Image
              src="/BC.png"
              alt="BC Logo"
              width={120}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
              key="bc-logo"
              unoptimized={true}
            />
          </div>
          
          {/* Menu desktopowe */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('about-us')} 
              className="text-lg font-bold text-gray-800 hover:text-[#300FE6]"
            >
              O nas
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="text-lg font-bold text-gray-800 hover:text-[#300FE6]"
            >
              FAQ
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-lg font-bold text-gray-800 hover:text-[#300FE6]"
            >
              Kontakt
            </button>
            <Button 
              className="text-lg px-6 py-2 bg-gradient-to-r from-[#300FE6] to-[#2208B0] hover:from-[#4024E9] hover:to-[#300FE6]"
              onClick={() => router.push('/gap')}
            >
              Kup GAP
            </Button>
          </div>

          {/* Przycisk menu mobilnego */}
          <button 
            className="md:hidden p-2 text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu mobilne"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Menu mobilne */}
        {isMenuOpen && (
          <div className="md:hidden py-4 flex flex-col space-y-4 border-t border-gray-200 mt-2">
            <button 
              onClick={() => scrollToSection('about-us')} 
              className="text-lg font-bold text-gray-800 hover:text-[#300FE6] py-2"
            >
              O nas
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="text-lg font-bold text-gray-800 hover:text-[#300FE6] py-2"
            >
              FAQ
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-lg font-bold text-gray-800 hover:text-[#300FE6] py-2"
            >
              Kontakt
            </button>
            <Button 
              className="text-lg px-6 py-2 bg-gradient-to-r from-[#300FE6] to-[#2208B0] hover:from-[#4024E9] hover:to-[#300FE6] w-full"
              onClick={() => router.push('/gap')}
            >
              Kup GAP
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar; 