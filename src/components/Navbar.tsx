"use client"

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Funkcja do scrollowania do sekcji
  const scrollToSection = (sectionId: string) => {
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
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#300FE6]">Ubezpieczenia</span>
          </Link>
          
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
        </nav>
      </div>
    </header>
  );
};

export default Navbar; 