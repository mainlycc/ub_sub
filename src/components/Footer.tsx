"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = (): React.ReactElement => {
  return (
    <div className="bg-gray-900 text-white w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Logo i opis */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/DI_logo_8.png"
                alt="Defend Insurance Logo"
                width={180}
                height={60}
                className="h-12 sm:h-16 w-auto"
                priority
              />
            </div>
            <p className="text-white text-sm sm:text-base">
              Oferujemy kompleksową ochronę przed utratą wartości Twojego pojazdu. 
              Zabezpiecz swoją inwestycję już dziś.
            </p>
          </div>

          {/* Linki */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Ważne linki</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/regulamin" className="text-white text-sm sm:text-base hover:text-gray-300 transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/polityka-prywatnosci" className="text-white text-sm sm:text-base hover:text-gray-300 transition-colors">
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-white text-sm sm:text-base hover:text-gray-300 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

                    {/* Pliki do pobrania - Kolumna 1 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Pliki do pobrania</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white text-xs sm:text-sm hover:text-gray-300 transition-colors underline">
                  Ogólne Warunki Ubezpieczenia (OWU) DEFEND Gap
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-xs sm:text-sm hover:text-gray-300 transition-colors underline">
                  Szczegółowe Warunki Ubezpieczenia (SWU) DEFEND Gap MAX (Fakturowy)
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-xs sm:text-sm hover:text-gray-300 transition-colors underline">
                  Szczegółowe Warunki Ubezpieczenia (SWU) DEFEND Gap MAX AC (Casco)
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-xs sm:text-sm hover:text-gray-300 transition-colors underline">
                  Szczegółowe Warunki Ubezpieczenia (SWU) DEFEND Gap FLEX
                </a>
              </li>
            </ul>
          </div>

          {/* Pliki do pobrania - Kolumna 2 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">&nbsp;</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white text-xs sm:text-sm hover:text-gray-300 transition-colors underline">
                  Szczegółowe Warunki Ubezpieczenia (SWU) DEFEND Gap Truck MAX (Fakturowy)
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-xs sm:text-sm hover:text-gray-300 transition-colors underline">
                  Szczegółowe Warunki Ubezpieczenia (SWU) DEFEND Gap Truck MAX AC (Casco)
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-xs sm:text-sm hover:text-gray-300 transition-colors underline">
                  ZOBACZ WSZYSTKIE
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-white mb-4">Social Media</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/people/BC-Księgowość/61571088134057/" 
                className="text-white hover:text-gray-300 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Stopka */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-white">
          <p className="text-sm sm:text-base pb-0 mb-0">&copy; {new Date().getFullYear()} Ubezpieczenia GAP. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer; 