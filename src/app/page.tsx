"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from 'next/link';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Footer from '@/components/Footer';

type CalculatorData = {
  carPrice: number;
  year: number;
  months: number;
};

const HomePage = () => {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    carPrice: 0,
    year: new Date().getFullYear(),
    months: 12,
  });
  const [insurance, setInsurance] = useState<number | null>(null);

  const handleCalculate = () => {
    const baseRate = 0.05;
    const ageMultiplier = (new Date().getFullYear() - calculatorData.year) * 0.01;
    const monthsMultiplier = calculatorData.months / 12;
    
    const total = calculatorData.carPrice * (baseRate + ageMultiplier) * monthsMultiplier;
    setInsurance(Math.round(total));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Nawigacja */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="space-x-4">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-lg uppercase text-center`}>
                      Strona główna
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/pytania" legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-lg uppercase text-center`}>
                      Pytania
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/kontakt" legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-lg uppercase text-center`}>
                      Kontakt
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 absolute right-4 text-lg px-6 py-2 transition-all duration-300">
              Kup ubezpieczenie
            </Button>
          </div>
        </div>
      </nav>

      {/* Główna zawartość */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Lewa kolumna - Kalkulator */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-indigo-50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              Kalkulator ubezpieczenia
            </h2>
            <Tabs defaultValue="fakturowy" className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fakturowy">Fakturowy</TabsTrigger>
                <TabsTrigger value="cascowy">Cascowy</TabsTrigger>
              </TabsList>
              <TabsContent value="fakturowy">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="carPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Wartość samochodu (PLN)
                    </label>
                    <input
                      type="number"
                      id="carPrice"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={calculatorData.carPrice}
                      onChange={(e) => setCalculatorData({...calculatorData, carPrice: Number(e.target.value)})}
                      min="0"
                      aria-label="Wartość samochodu"
                    />
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                      Rok produkcji
                    </label>
                    <input
                      type="number"
                      id="year"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={calculatorData.year}
                      onChange={(e) => setCalculatorData({...calculatorData, year: Number(e.target.value)})}
                      min="1900"
                      max={new Date().getFullYear()}
                      aria-label="Rok produkcji"
                    />
                  </div>

                  <div>
                    <label htmlFor="months" className="block text-sm font-medium text-gray-700 mb-2">
                      Okres ubezpieczenia (miesiące)
                    </label>
                    <input
                      type="number"
                      id="months"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={calculatorData.months}
                      onChange={(e) => setCalculatorData({...calculatorData, months: Number(e.target.value)})}
                      min="1"
                      max="60"
                      aria-label="Okres ubezpieczenia"
                    />
                  </div>

                  <Button 
                    onClick={handleCalculate}
                    className="w-full"
                    size="lg"
                  >
                    Oblicz składkę
                  </Button>

                  {insurance && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-blue-50 rounded-lg"
                    >
                      <p className="text-center text-lg font-semibold text-blue-900">
                        Szacowana składka: {insurance} PLN
                      </p>
                    </motion.div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="cascowy">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="carPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Wartość samochodu (PLN)
                    </label>
                    <input
                      type="number"
                      id="carPrice"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={calculatorData.carPrice}
                      onChange={(e) => setCalculatorData({...calculatorData, carPrice: Number(e.target.value)})}
                      min="0"
                      aria-label="Wartość samochodu"
                    />
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                      Rok produkcji
                    </label>
                    <input
                      type="number"
                      id="year"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={calculatorData.year}
                      onChange={(e) => setCalculatorData({...calculatorData, year: Number(e.target.value)})}
                      min="1900"
                      max={new Date().getFullYear()}
                      aria-label="Rok produkcji"
                    />
                  </div>

                  <div>
                    <label htmlFor="months" className="block text-sm font-medium text-gray-700 mb-2">
                      Okres ubezpieczenia (miesiące)
                    </label>
                    <input
                      type="number"
                      id="months"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={calculatorData.months}
                      onChange={(e) => setCalculatorData({...calculatorData, months: Number(e.target.value)})}
                      min="1"
                      max="60"
                      aria-label="Okres ubezpieczenia"
                    />
                  </div>

                  <Button 
                    onClick={handleCalculate}
                    className="w-full"
                    size="lg"
                  >
                    Oblicz składkę
                  </Button>

                  {insurance && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-blue-50 rounded-lg"
                    >
                      <p className="text-center text-lg font-semibold text-blue-900">
                        Szacowana składka: {insurance} PLN
                      </p>
                    </motion.div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Prawa kolumna - Treść marketingowa */}
          <div className="space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight"
            >
              Zabezpiecz swoją podróż z najlepszym ubezpieczeniem
            </motion.h1>

            <div className="prose prose-lg text-gray-600">
              <p>
                Oferujemy kompleksowe ubezpieczenia samochodowe dostosowane do Twoich potrzeb. 
                Nasza oferta to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Konkurencyjne ceny i elastyczne warunki</li>
                <li>Szybka wypłata odszkodowań</li>
                <li>Całodobowa pomoc drogowa</li>
                <li>Profesjonalna obsługa klienta</li>
              </ul>
              <p className="mt-6">
                Nie czekaj - sprawdź naszą ofertę i zyskaj spokój ducha podczas każdej podróży. 
                Skorzystaj z kalkulatora, aby poznać szacunkową wysokość składki dopasowaną do 
                Twojego pojazdu.
              </p>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ponad 100 000 zadowolonych klientów
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                15 lat doświadczenia
              </span>
            </div>
          </div>
        </div>

        {/* Karty informacyjne o ubezpieczeniach - teraz na pełnej szerokości */}
        <div className="max-w-7xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden border-none shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-50" />
            
            <CardHeader className="relative">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Ubezpieczenie Fakturowe
              </CardTitle>
              <CardDescription className="text-indigo-600">
                Ochrona wartości fakturowej pojazdu
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Gwarancja wypłaty odszkodowania w wysokości równej wartości z faktury zakupu</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Idealne dla nowych pojazdów do 3 lat od daty zakupu</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Brak uwzględnienia amortyzacji pojazdu przy wypłacie odszkodowania</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Ochrona przed utratą wartości pojazdu w czasie</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50 opacity-50" />
            
            <CardHeader className="relative">
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent">
                Ubezpieczenie Casco
              </CardTitle>
              <CardDescription className="text-purple-600">
                Kompleksowa ochrona pojazdu
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-500 mr-2 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Ochrona przed kradzieżą, wandalizmem i uszkodzeniami</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-500 mr-2 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Możliwość wyboru zakresu ochrony i wysokości udziału własnego</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-500 mr-2 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Assistance 24/7 w standardzie</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-500 mr-2 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Możliwość ubezpieczenia pojazdów w każdym wieku</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
