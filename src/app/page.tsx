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
import { Slider } from "@/components/ui/slider";
import AboutUs from '@/components/AboutUs';

type CalculatorData = {
  carPrice: number;
  year: number;
  months: number;
};

type InsuranceType = 'fakturowy' | 'cascowy';

interface ValidationErrors {
  carPrice?: string;
  year?: string;
  months?: string;
}

const HomePage = () => {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    carPrice: 0,
    year: new Date().getFullYear(),
    months: 12,
  });
  const [insurance, setInsurance] = useState<number | null>(null);
  const [activeInsuranceType, setActiveInsuranceType] = useState<InsuranceType>('fakturowy');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const currentYear = new Date().getFullYear();

    if (calculatorData.carPrice <= 0) {
      newErrors.carPrice = 'Wartość samochodu musi być większa niż 0';
    }

    if (calculatorData.year < 1900 || calculatorData.year > currentYear) {
      newErrors.year = `Rok produkcji musi być pomiędzy 1900 a ${currentYear}`;
    }

    if (calculatorData.months < 1 || calculatorData.months > 60) {
      newErrors.months = 'Okres ubezpieczenia musi być pomiędzy 1 a 60 miesięcy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) {
      return;
    }

    setIsCalculating(true);
    setInsurance(null);

    try {
      const baseRate = activeInsuranceType === 'fakturowy' ? 0.05 : 0.07;
      const ageMultiplier = (new Date().getFullYear() - calculatorData.year) * 0.01;
      const monthsMultiplier = calculatorData.months / 12;
      
      const total = calculatorData.carPrice * (baseRate + ageMultiplier) * monthsMultiplier;
      setInsurance(Math.round(total));
    } catch (error) {
      console.error('Błąd podczas obliczania składki:', error);
      // Możemy tutaj dodać obsługę błędów, np. wyświetlenie komunikatu dla użytkownika
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (field: keyof CalculatorData, value: number) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));
    // Czyścimy błąd dla tego pola przy zmianie wartości
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const handleInsuranceTypeChange = (type: InsuranceType) => {
    setActiveInsuranceType(type);
    setInsurance(null);
    setErrors({});
  };

  const handleMonthsChange = (value: number[]) => {
    handleInputChange('months', value[0]);
  };

  const renderMonthsSlider = (type: InsuranceType) => (
    <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-cyan-100/20">
      <label 
        htmlFor={`months-${type}`} 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Okres ubezpieczenia: {calculatorData.months} miesięcy
      </label>
      <Slider
        id={`months-${type}`}
        min={1}
        max={60}
        step={1}
        value={[calculatorData.months]}
        onValueChange={handleMonthsChange}
        className="my-4"
        aria-label="Wybierz okres ubezpieczenia w miesiącach"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>1 miesiąc</span>
        <span>60 miesięcy</span>
      </div>
      {errors.months && (
        <p 
          id={`months-${type}-error`} 
          className="mt-1 text-xs text-red-500"
          role="alert"
        >
          {errors.months}
        </p>
      )}
    </div>
  );

  const renderInput = (
    field: keyof CalculatorData,
    label: string,
    min: number,
    max: number | undefined,
    helpText: string,
    type: InsuranceType
  ) => (
    <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-cyan-100/20">
      <label 
        htmlFor={`${field}-${type}`} 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type="number"
        id={`${field}-${type}`}
        className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 bg-white/90 
          ${errors[field] ? 'border-red-500' : ''}`}
        value={calculatorData[field]}
        onChange={(e) => handleInputChange(field, Number(e.target.value))}
        min={min}
        max={max}
        aria-describedby={`${field}-${type}-help ${field}-${type}-error`}
      />
      <p id={`${field}-${type}-help`} className="mt-1 text-xs text-gray-500">
        {helpText}
      </p>
      {errors[field] && (
        <p 
          id={`${field}-${type}-error`} 
          className="mt-1 text-xs text-red-500"
          role="alert"
        >
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100">
      {/* Nawigacja */}
      <nav className="border-b bg-gradient-to-r from-pink-100/90 to-purple-100/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="space-x-4">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={`text-lg font-medium text-purple-900 hover:text-purple-700 transition-colors px-4 py-2 rounded-md hover:bg-white/20`}
                    >
                      Strona główna
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/pytania" legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={`text-lg font-medium text-purple-900 hover:text-purple-700 transition-colors px-4 py-2 rounded-md hover:bg-white/20`}
                    >
                      Pytania
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/kontakt" legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={`text-lg font-medium text-purple-900 hover:text-purple-700 transition-colors px-4 py-2 rounded-md hover:bg-white/20`}
                    >
                      Kontakt
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 absolute right-4 text-lg px-6 py-2 transition-all duration-300 shadow-md">
              Kup ubezpieczenie
            </Button>
          </div>
        </div>
      </nav>

      {/* Główna zawartość */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Lewa kolumna - Kalkulator */}
          <div className="bg-gradient-to-br from-cyan-100 to-blue-50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-cyan-200">
            <h2 className="text-2xl font-bold text-cyan-800 mb-6">
              Kalkulator ubezpieczenia
            </h2>
            <Tabs defaultValue="fakturowy" className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-white">
                <TabsTrigger value="fakturowy" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  Fakturowy
                </TabsTrigger>
                <TabsTrigger value="cascowy" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                  Cascowy
                </TabsTrigger>
              </TabsList>
              <TabsContent value="fakturowy" className="mt-6">
                <div className="space-y-6">
                  {renderInput(
                    'carPrice',
                    'Wartość samochodu (PLN)',
                    0,
                    undefined,
                    'Wprowadź wartość samochodu w złotych polskich',
                    'fakturowy'
                  )}
                  {renderInput(
                    'year',
                    'Rok produkcji',
                    1900,
                    new Date().getFullYear(),
                    'Rok produkcji wpływa na wysokość składki',
                    'fakturowy'
                  )}
                  {renderMonthsSlider('fakturowy')}

                  <Button 
                    onClick={handleCalculate}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    size="lg"
                    disabled={isCalculating || Object.keys(errors).length > 0}
                    aria-label="Oblicz składkę ubezpieczenia"
                  >
                    {isCalculating ? 'Obliczanie...' : 'Oblicz składkę'}
                  </Button>

                  {insurance && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 space-y-4"
                    >
                      <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200"
                        role="alert"
                        aria-live="polite"
                      >
                        <p className="text-center text-lg font-semibold text-cyan-900">
                          Szacowana składka: {insurance.toLocaleString('pl-PL')} PLN
                        </p>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center gap-4"
                      >
                        <Link href="/gap">
                          <Button 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            size="lg"
                          >
                            Kup ubezpieczenie GAP
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="cascowy" className="mt-6">
                <div className="space-y-6">
                  {renderInput(
                    'carPrice',
                    'Wartość samochodu (PLN)',
                    0,
                    undefined,
                    'Wprowadź wartość samochodu w złotych polskich',
                    'cascowy'
                  )}
                  {renderInput(
                    'year',
                    'Rok produkcji',
                    1900,
                    new Date().getFullYear(),
                    'Rok produkcji wpływa na wysokość składki',
                    'cascowy'
                  )}
                  {renderMonthsSlider('cascowy')}

                  <Button 
                    onClick={handleCalculate}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    size="lg"
                  >
                    Oblicz składkę
                  </Button>

                  {insurance && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200"
                    >
                      <p className="text-center text-lg font-semibold text-pink-900">
                        Szacowana składka: {insurance} PLN
                      </p>
                    </motion.div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Prawa kolumna - Treść marketingowa */}
          <div className="space-y-8 p-8 bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl shadow-xl border border-purple-200">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-purple-900 leading-tight"
            >
              Zabezpiecz swoją podróż z najlepszym ubezpieczeniem
            </motion.h1>

            <div className="prose prose-lg">
              <p className="text-gray-700">
                Oferujemy kompleksowe ubezpieczenia samochodowe dostosowane do Twoich potrzeb. 
                Nasza oferta to:
              </p>
              <ul className="list-none pl-0 space-y-4">
                <li className="flex items-center bg-white p-3 rounded-lg shadow-sm border-l-4 border-teal-400">
                  <svg className="w-5 h-5 text-teal-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Konkurencyjne ceny i elastyczne warunki</span>
                </li>
                <li className="flex items-center bg-white p-3 rounded-lg shadow-sm border-l-4 border-cyan-400">
                  <svg className="w-5 h-5 text-cyan-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Szybka wypłata odszkodowań</span>
                </li>
                <li className="flex items-center bg-white p-3 rounded-lg shadow-sm border-l-4 border-purple-400">
                  <svg className="w-5 h-5 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Całodobowa pomoc drogowa</span>
                </li>
                <li className="flex items-center bg-white p-3 rounded-lg shadow-sm border-l-4 border-pink-400">
                  <svg className="w-5 h-5 text-pink-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
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
                <svg className="w-5 h-5 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ponad 100 000 zadowolonych klientów
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                15 lat doświadczenia
              </span>
            </div>
          </div>
        </div>

        {/* Karty informacyjne */}
        <div className="max-w-7xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full -ml-12 -mb-12 opacity-50"></div>
            
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
              <CardDescription className="text-cyan-100 font-medium">
                Ochrona wartości fakturowej pojazdu
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <ul className="space-y-4">
                <li className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
                  <svg className="w-5 h-5 text-cyan-200 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Gwarancja wypłaty odszkodowania w wysokości równej wartości z faktury zakupu</span>
                </li>
                <li className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
                  <svg className="w-5 h-5 text-cyan-200 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Brak amortyzacji wartości pojazdu</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-pink-400 rounded-full -ml-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-400 rounded-full -mr-12 -mb-12 opacity-50"></div>
            
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
              <CardDescription className="text-pink-100 font-medium">
                Kompleksowa ochrona pojazdu
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <ul className="space-y-4">
                <li className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
                  <svg className="w-5 h-5 text-pink-200 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Ochrona przed kradzieżą, wandalizmem i uszkodzeniami</span>
                </li>
                <li className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
                  <svg className="w-5 h-5 text-pink-200 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
            <h2 className="text-3xl font-bold text-purple-900 mb-4">Najczęściej zadawane pytania</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszych ubezpieczeń
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-100 to-blue-50 rounded-2xl shadow-xl p-6 border border-cyan-200">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border-b border-cyan-200">
                  <AccordionTrigger className="text-cyan-900 hover:text-cyan-700 font-medium text-lg py-4">
                    Jak mogę obliczyć składkę ubezpieczeniową?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-white/50 p-4 rounded-lg">
                    Możesz łatwo obliczyć szacunkową składkę ubezpieczeniową korzystając z naszego kalkulatora online. 
                    Wystarczy wprowadzić wartość pojazdu, rok produkcji oraz wybrany okres ubezpieczenia, 
                    a nasz system automatycznie obliczy przybliżoną kwotę składki.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-cyan-200">
                  <AccordionTrigger className="text-cyan-900 hover:text-cyan-700 font-medium text-lg py-4">
                    Jaka jest różnica między ubezpieczeniem fakturowym a casco?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-white/50 p-4 rounded-lg">
                    Ubezpieczenie fakturowe gwarantuje wypłatę odszkodowania w wysokości równej wartości z faktury zakupu 
                    pojazdu, bez uwzględniania amortyzacji. Ubezpieczenie casco zapewnia szerszą ochronę, obejmującą 
                    kradzież, wandalizm, uszkodzenia oraz wsparcie assistance 24/7.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b border-cyan-200">
                  <AccordionTrigger className="text-cyan-900 hover:text-cyan-700 font-medium text-lg py-4">
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
            
            <div className="bg-gradient-to-br from-pink-100 to-purple-50 rounded-2xl shadow-xl p-6 border border-pink-200">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-4" className="border-b border-pink-200">
                  <AccordionTrigger className="text-pink-900 hover:text-pink-700 font-medium text-lg py-4">
                    Czy mogę ubezpieczyć samochód używany?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-white/50 p-4 rounded-lg">
                    Tak, oferujemy ubezpieczenia zarówno dla samochodów nowych, jak i używanych. 
                    W przypadku pojazdów używanych, wysokość składki może zależeć od wieku pojazdu, 
                    jego wartości rynkowej oraz historii szkód.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-b border-pink-200">
                  <AccordionTrigger className="text-pink-900 hover:text-pink-700 font-medium text-lg py-4">
                    Jakie dokumenty są potrzebne do zawarcia umowy ubezpieczenia?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-white/50 p-4 rounded-lg">
                    Do zawarcia umowy ubezpieczenia potrzebujesz dowodu osobistego, dowodu rejestracyjnego pojazdu 
                    oraz dokumentu potwierdzającego własność (np. faktura zakupu). W niektórych przypadkach może być 
                    wymagana również historia ubezpieczenia z poprzedniego towarzystwa.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border-b border-pink-200">
                  <AccordionTrigger className="text-pink-900 hover:text-pink-700 font-medium text-lg py-4">
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
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-8 py-3 text-lg shadow-md">
              Skontaktuj się z nami
            </Button>
          </div>
        </div>

        {/* Sekcja O nas */}
        <AboutUs />

        {/* Sekcja zaufania */}
        <div className="max-w-7xl mx-auto mt-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent mb-4">
              Dlaczego warto nam zaufać?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tysiące zadowolonych klientów wybrało nasze ubezpieczenia. Dołącz do nich już dziś!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-purple-900 mb-2">Bezpieczeństwo</h3>
              <p className="text-gray-600 text-center">
                Twoje dane są zawsze bezpieczne, a nasze procedury spełniają najwyższe standardy ochrony.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-cyan-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-cyan-900 mb-2">Szybkość</h3>
              <p className="text-gray-600 text-center">
                Błyskawiczna obsługa zgłoszeń i szybka wypłata odszkodowań to nasze priorytety.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-pink-900 mb-2">Wsparcie</h3>
              <p className="text-gray-600 text-center">
                Nasz zespół ekspertów jest dostępny 24/7, aby pomóc Ci w każdej sytuacji.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center mt-12 gap-8">
            <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-sm">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">4.9/5 ocena klientów</span>
            </div>
            
            <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-sm">
              <svg className="w-5 h-5 text-cyan-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Ponad 100 000 klientów</span>
            </div>
            
            <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-sm">
              <svg className="w-5 h-5 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">15 lat doświadczenia</span>
            </div>
          </div>
        </div>
      </main>

      {/* Stopka */}
      <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ubezpieczenia</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pink-200 transition-colors">Ubezpieczenie OC</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors">Ubezpieczenie AC</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors">Ubezpieczenie Fakturowe</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors">Ubezpieczenie Casco</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Firma</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pink-200 transition-colors">O nas</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors">Kariera</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors">Partnerzy</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Pomoc</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pink-200 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors">Zgłoś szkodę</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors">Polityka prywatności</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Kontakt</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-pink-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+48 123 456 789</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-pink-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>kontakt@ubezpieczenia.pl</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-pink-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>ul. Ubezpieczeniowa 123, Warszawa</span>
                </li>
              </ul>
              
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-white hover:text-pink-200 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-pink-200 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-pink-200 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.124-2.126-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-pink-800 text-center text-sm">
            <p>© 2023 Ubezpieczenia. Wszelkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;