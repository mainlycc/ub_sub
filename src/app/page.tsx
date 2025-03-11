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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-emerald-100">
      {/* Nawigacja */}
      <nav className="border-b bg-gradient-to-r from-indigo-100/90 to-purple-100/90 backdrop-blur-sm sticky top-0 z-50">
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
            
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 absolute right-4 text-lg px-6 py-2 transition-all duration-300 shadow-md">
              Kup ubezpieczenie
            </Button>
          </div>
        </div>
      </nav>

      {/* Główna zawartość */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Lewa kolumna - Kalkulator */}
          <div className="bg-gradient-to-br from-blue-100 to-indigo-50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">
              Kalkulator ubezpieczenia
            </h2>
            <Tabs defaultValue="fakturowy" className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-white">
                <TabsTrigger value="fakturowy" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  Fakturowy
                </TabsTrigger>
                <TabsTrigger value="cascowy" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Cascowy
                </TabsTrigger>
              </TabsList>
              <TabsContent value="fakturowy" className="mt-6">
                <div className="space-y-6">
                  <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-blue-100/20">
                    <label htmlFor="carPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Wartość samochodu (PLN)
                    </label>
                    <input
                      type="number"
                      id="carPrice"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/90"
                      value={calculatorData.carPrice}
                      onChange={(e) => setCalculatorData({...calculatorData, carPrice: Number(e.target.value)})}
                      min="0"
                    />
                  </div>

                  <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-blue-100/20">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                      Rok produkcji
                    </label>
                    <input
                      type="number"
                      id="year"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/90"
                      value={calculatorData.year}
                      onChange={(e) => setCalculatorData({...calculatorData, year: Number(e.target.value)})}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-blue-100/20">
                    <label htmlFor="months" className="block text-sm font-medium text-gray-700 mb-2">
                      Okres ubezpieczenia (miesiące)
                    </label>
                    <input
                      type="number"
                      id="months"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/90"
                      value={calculatorData.months}
                      onChange={(e) => setCalculatorData({...calculatorData, months: Number(e.target.value)})}
                      min="1"
                      max="60"
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
              <TabsContent value="cascowy" className="mt-6">
                <div className="space-y-6">
                  <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-blue-100/20">
                    <label htmlFor="carPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Wartość samochodu (PLN)
                    </label>
                    <input
                      type="number"
                      id="carPrice"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/90"
                      value={calculatorData.carPrice}
                      onChange={(e) => setCalculatorData({...calculatorData, carPrice: Number(e.target.value)})}
                      min="0"
                    />
                  </div>

                  <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-blue-100/20">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                      Rok produkcji
                    </label>
                    <input
                      type="number"
                      id="year"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/90"
                      value={calculatorData.year}
                      onChange={(e) => setCalculatorData({...calculatorData, year: Number(e.target.value)})}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-blue-100/20">
                    <label htmlFor="months" className="block text-sm font-medium text-gray-700 mb-2">
                      Okres ubezpieczenia (miesiące)
                    </label>
                    <input
                      type="number"
                      id="months"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/90"
                      value={calculatorData.months}
                      onChange={(e) => setCalculatorData({...calculatorData, months: Number(e.target.value)})}
                      min="1"
                      max="60"
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
          <div className="space-y-8 p-8 bg-gradient-to-br from-purple-100 to-indigo-50 rounded-2xl shadow-xl border border-purple-200">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-indigo-900 leading-tight"
            >
              Zabezpiecz swoją podróż z najlepszym ubezpieczeniem
            </motion.h1>

            <div className="prose prose-lg">
              <p className="text-gray-700">
                Oferujemy kompleksowe ubezpieczenia samochodowe dostosowane do Twoich potrzeb. 
                Nasza oferta to:
              </p>
              <ul className="list-none pl-0 space-y-4">
                <li className="flex items-center bg-white p-3 rounded-lg shadow-sm border-l-4 border-emerald-400">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Konkurencyjne ceny i elastyczne warunki</span>
                </li>
                <li className="flex items-center bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-400">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Szybka wypłata odszkodowań</span>
                </li>
                <li className="flex items-center bg-white p-3 rounded-lg shadow-sm border-l-4 border-indigo-400">
                  <svg className="w-5 h-5 text-indigo-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Całodobowa pomoc drogowa</span>
                </li>
                <li className="flex items-center bg-white p-3 rounded-lg shadow-sm border-l-4 border-purple-400">
                  <svg className="w-5 h-5 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Profesjonalna obsługa klienta</span>
                </li>
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

        {/* Karty informacyjne */}
        <div className="max-w-7xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-blue-600 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 rounded-full -ml-12 -mb-12 opacity-50"></div>
            
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-white">
                  Ubezpieczenie Fakturowe
                </CardTitle>
              </div>
              <CardDescription className="text-blue-100 font-medium">
                Ochrona wartości fakturowej pojazdu
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <ul className="space-y-4">
                <li className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
                  <svg className="w-5 h-5 text-blue-200 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Gwarancja wypłaty odszkodowania w wysokości równej wartości z faktury zakupu</span>
                </li>
                <li className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
                  <svg className="w-5 h-5 text-blue-200 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Brak amortyzacji wartości pojazdu</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-purple-600 text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full -ml-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-indigo-500 rounded-full -mr-12 -mb-12 opacity-50"></div>
            
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-white">
                  Ubezpieczenie Casco
                </CardTitle>
              </div>
              <CardDescription className="text-purple-100 font-medium">
                Kompleksowa ochrona pojazdu
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <ul className="space-y-4">
                <li className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
                  <svg className="w-5 h-5 text-purple-200 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Ochrona przed kradzieżą, wandalizmem i uszkodzeniami</span>
                </li>
                <li className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
                  <svg className="w-5 h-5 text-purple-200 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Wsparcie assistance 24/7</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sekcja Q&A */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Najczęściej zadawane pytania</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszych ubezpieczeń
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-indigo-100 to-blue-50 rounded-2xl shadow-xl p-6 border border-indigo-200">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border-b border-indigo-200">
                  <AccordionTrigger className="text-indigo-900 hover:text-indigo-700 font-medium text-lg py-4">
                    Jak mogę obliczyć składkę ubezpieczeniową?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-white/50 p-4 rounded-lg">
                    Możesz łatwo obliczyć szacunkową składkę ubezpieczeniową korzystając z naszego kalkulatora online. 
                    Wystarczy wprowadzić wartość pojazdu, rok produkcji oraz wybrany okres ubezpieczenia, 
                    a nasz system automatycznie obliczy przybliżoną kwotę składki.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-indigo-200">
                  <AccordionTrigger className="text-indigo-900 hover:text-indigo-700 font-medium text-lg py-4">
                    Jaka jest różnica między ubezpieczeniem fakturowym a casco?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-white/50 p-4 rounded-lg">
                    Ubezpieczenie fakturowe gwarantuje wypłatę odszkodowania w wysokości równej wartości z faktury zakupu 
                    pojazdu, bez uwzględniania amortyzacji. Ubezpieczenie casco zapewnia szerszą ochronę, obejmującą 
                    kradzież, wandalizm, uszkodzenia oraz wsparcie assistance 24/7.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b border-indigo-200">
                  <AccordionTrigger className="text-indigo-900 hover:text-indigo-700 font-medium text-lg py-4">
                    Jak długo trwa proces wypłaty odszkodowania?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-white/50 p-4 rounded-lg">
                    Standardowy czas wypłaty odszkodowania wynosi do 30 dni od zgłoszenia szkody i dostarczenia 
                    wszystkich wymaganych dokumentów. W przypadku prostych szkód, proces może zostać zakończony 
                    nawet w ciągu 7-14 dni.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-indigo-50 rounded-2xl shadow-xl p-6 border border-purple-200">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-4" className="border-b border-purple-200">
                  <AccordionTrigger className="text-purple-900 hover:text-purple-700 font-medium text-lg py-4">
                    Czy mogę ubezpieczyć samochód używany?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-white/50 p-4 rounded-lg">
                    Tak, oferujemy ubezpieczenia zarówno dla samochodów nowych, jak i używanych. 
                    W przypadku pojazdów używanych, wysokość składki może zależeć od wieku pojazdu, 
                    jego wartości rynkowej oraz historii szkód.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-b border-purple-200">
                  <AccordionTrigger className="text-purple-900 hover:text-purple-700 font-medium text-lg py-4">
                    Jakie dokumenty są potrzebne do zawarcia umowy ubezpieczenia?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-white/50 p-4 rounded-lg">
                    Do zawarcia umowy ubezpieczenia potrzebujesz dowodu osobistego, dowodu rejestracyjnego pojazdu 
                    oraz dokumentu potwierdzającego własność (np. faktura zakupu). W niektórych przypadkach może być 
                    wymagana również historia ubezpieczenia z poprzedniego towarzystwa.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border-b border-purple-200">
                  <AccordionTrigger className="text-purple-900 hover:text-purple-700 font-medium text-lg py-4">
                    Czy mogę rozłożyć płatność składki na raty?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-white/50 p-4 rounded-lg">
                    Tak, oferujemy możliwość rozłożenia płatności składki na raty miesięczne, kwartalne lub półroczne. 
                    Szczegółowe warunki płatności ratalnej są ustalane indywidualnie i zależą od rodzaju ubezpieczenia 
                    oraz jego wartości.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">Nie znalazłeś odpowiedzi na swoje pytanie?</p>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 text-lg shadow-md">
              Skontaktuj się z nami
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
