"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = (): React.ReactElement => {
  return (
    <div className="bg-gray-900 text-white w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Kontakt</h3>
            <ul className="space-y-2">
              <li className="flex items-start sm:items-center text-white text-sm sm:text-base">
                <svg className="w-4 h-4 mr-2 text-white flex-shrink-0 mt-1 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +48 796 148 577
              </li>
              <li className="flex items-start sm:items-center text-white text-sm sm:text-base">
                <svg className="w-4 h-4 mr-2 text-white flex-shrink-0 mt-1 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all">biuro@gapauto.pl</span>
              </li>
              <li className="flex items-start sm:items-center text-white text-sm sm:text-base">
                <svg className="w-4 h-4 mr-2 text-white flex-shrink-0 mt-1 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Przyszłości 6, 05-140 Skubianka
              </li>
            </ul>
          </div>

          {/* Kolumna 4 - Godziny otwarcia */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Godziny otwarcia</h3>
            <ul className="space-y-2">
              <li className="text-white text-sm sm:text-base">Poniedziałek - Piątek: 9:00 - 17:00</li>
              <li className="text-white text-sm sm:text-base">Sobota: 9:00 - 14:00</li>
              <li className="text-white text-sm sm:text-base">Niedziela: Zamknięte</li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a 
                href="https://www.facebook.com/people/BC-Księgowość/61571088134057/" 
                className="text-white hover:text-gray-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
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