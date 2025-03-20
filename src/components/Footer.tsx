"use client"

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo i opis */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Ubezpieczenia GAP</h3>
            <p className="text-gray-400">
              Oferujemy kompleksową ochronę przed utratą wartości Twojego pojazdu. 
              Zabezpiecz swoją inwestycję już dziś.
            </p>
          </div>

          {/* Linki */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ważne linki</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/regulamin" className="text-gray-400 hover:text-white transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/polityka-prywatnosci" className="text-gray-400 hover:text-white transition-colors">
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-400 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Tel: +48 123 456 789</li>
              <li>Email: kontakt@ubezpieczeniagap.pl</li>
              <li>Pon-Pt: 8:00 - 16:00</li>
            </ul>
          </div>
        </div>

        {/* Stopka */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ubezpieczenia GAP. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 