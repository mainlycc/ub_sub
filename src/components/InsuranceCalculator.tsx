"use client"

import React from 'react';
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Calculator, Info } from 'lucide-react';
import Image from 'next/image';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { StarBorder } from "@/components/ui/star-border";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Typy danych
type CalculatorData = {
  carPrice: number;
  year: number;
  months: number;
};

type InsuranceType = 'fakturowy' | 'casco';

interface ValidationErrors {
  carPrice?: string;
  year?: string;
  months?: string;
}

interface CalculationResult {
  premium: number;
  details: {
    productName: string;
    coveragePeriod: string;
    vehicleValue: number;
    maxCoverage: string;
  };
}

// Dodajemy funkcję do formatowania liczb
const formatPrice = (price: number | undefined): string => {
  if (!price) return '';
  return price.toLocaleString('pl-PL');
};

// Funkcja do parsowania ceny z formatu z separatorami do liczby
const parsePrice = (input: string): number => {
  if (!input) return 0;
  return parseFloat(input.replace(/\s/g, '').replace(/,/g, '.')) || 0;
};

// Definicje tooltipów
const tooltips = {
  gapFakturowy: "Ubezpieczenie, które pokrywa różnicę między wartością fakturową a wartością rynkową pojazdu w momencie szkody.",
  gapCasco: "Ubezpieczenie, które pokrywa różnicę między wartością początkową pojazdu a wypłatą z AC/OC w przypadku szkody całkowitej.",
  carPrice: "Podaj aktualną wartość rynkową lub cenę zakupu pojazdu.",
  year: "Wybierz rok produkcji pojazdu. Pojazd musi być zarejestrowany co najmniej 181 dni temu, ale nie więcej niż 10 lat temu.",
  months: "Określ na jak długi okres chcesz wykupić ubezpieczenie."
};

const InsuranceCalculator = () => {
  const router = useRouter();
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    carPrice: 0,
    year: new Date().getFullYear(),
    months: 12,
  });
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [activeInsuranceType, setActiveInsuranceType] = useState<InsuranceType>('fakturowy');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Dodajemy referencję do sekcji wynikowej
  const resultRef = useRef<HTMLDivElement>(null);
  
  const handleCalculate = async () => {
    // Walidacja przed wysłaniem
    const errors: ValidationErrors = {};
    
    console.log('Dane formularza przed walidacją:', {
      carPrice: calculatorData.carPrice,
      carPriceType: typeof calculatorData.carPrice,
      year: calculatorData.year,
      yearType: typeof calculatorData.year,
      months: calculatorData.months,
      monthsType: typeof calculatorData.months,
      type: activeInsuranceType
    });
    
    if (!calculatorData.carPrice || calculatorData.carPrice <= 0) {
      errors.carPrice = 'Proszę podać cenę samochodu';
    } else if (calculatorData.carPrice > 1000000) {
      errors.carPrice = 'Maksymalna wartość pojazdu to 1 000 000 zł';
    }
    
    if (!calculatorData.year) {
      errors.year = 'Proszę wybrać rok produkcji';
    } else {
      // Sprawdzamy czy rok jest w odpowiednim zakresie
      const today = new Date();
      const firstRegDate = new Date(calculatorData.year, 0, 1);
      const daysSinceRegistration = Math.floor((today.getTime() - firstRegDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceRegistration < 181) {
        errors.year = 'Pojazd musi być zarejestrowany co najmniej 181 dni temu';
      } else if (daysSinceRegistration > 10 * 365) {
        errors.year = 'Pojazd nie może być starszy niż 10 lat';
      }
    }
    
    if (!calculatorData.months) {
      errors.months = 'Proszę wybrać okres ubezpieczenia';
    }
    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    
    setIsCalculating(true);
    setErrors({});
    
    try {
      // Przygotowanie danych do wysłania
      const requestData = {
        price: Number(calculatorData.carPrice),
        year: Number(calculatorData.year),
        months: Number(calculatorData.months),
        type: activeInsuranceType
      };

      console.log('Dane wysyłane do API:', requestData);

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const responseText = await response.text();
      console.log('Surowa odpowiedź z API:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Przetworzona odpowiedź z API:', data);
      } catch (e) {
        console.error('Błąd parsowania odpowiedzi JSON:', e);
        throw new Error('Nieprawidłowy format odpowiedzi z API');
      }
      
      if (!response.ok) {
        console.error('Szczegóły błędu:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          wysłaneDane: requestData
        });

        let errorMessage = `Błąd HTTP: ${response.status} ${response.statusText}`;
        if (data && data.error) {
          errorMessage += `\nSzczegóły: ${data.error}`;
          if (data.details) {
            errorMessage += `\nDodatkowe informacje: ${JSON.stringify(data.details, null, 2)}`;
          }
        }
        throw new Error(errorMessage);
      }
      
      if (data.success && data.premium !== undefined) {
        const calculationResult = {
          premium: data.premium,
          details: data.details
        };
        
        setCalculationResult(calculationResult);
        
        localStorage.setItem('gapCalculationResult', JSON.stringify(calculationResult));
        
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        console.error('Nieprawidłowa odpowiedź:', data);
        const errorDetails = data.details ? JSON.stringify(data.details, null, 2) : data.error;
        throw new Error(`Błąd kalkulacji: ${errorDetails || 'Nieznany błąd'}`);
      }
    } catch (error: unknown) {
      console.error('Błąd podczas kalkulacji:', error);
      const errorMessage = error instanceof Error ? error.message : 'Nieoczekiwany błąd';
      
      // Wyświetlamy błąd w bardziej przyjazny sposób
      let userMessage = 'Wystąpił błąd podczas kalkulacji składki:\n';
      
      // Sprawdzamy rodzaj błędu i dostosowujemy komunikat
      if (errorMessage.includes('Late solicitation is not in range')) {
        userMessage = 'Data pierwszej rejestracji pojazdu musi być minimum 181 dni, ale maksimum 10 lat przed datą zakupu. Wybierz inny rok produkcji.';
      } else if (errorMessage.includes('422')) {
        userMessage = 'Nieprawidłowe dane wejściowe. Sprawdź poprawność wprowadzonych wartości.';
      } else if (errorMessage.includes('options:')) {
        userMessage = 'Wystąpił problem z wyborem opcji. Skontaktuj się z działem obsługi.';
      } else if (errorMessage.includes('401')) {
        userMessage = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
      } else if (errorMessage.includes('500')) {
        userMessage = 'Wystąpił wewnętrzny błąd systemu. Prosimy spróbować później.';
      } else {
        userMessage += errorMessage;
      }
      
      alert(userMessage);
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Funkcja sprawdzająca, czy dany okres jest aktywny
  const isPeriodActive = (period: number) => calculatorData.months === period;
  
  // Funkcja renderująca tooltip
  const renderTooltip = (text: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-1 inline-flex cursor-help text-gray-400 hover:text-gray-600">
            <Info size={16} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  
  return (
    <section className="py-12 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:hidden">
          <h2 className="text-3xl font-bold text-gray-900">Oblicz składkę ubezpieczenia GAP</h2>
          <p className="mt-3 text-xl text-gray-600">
            Zabezpiecz się przed utratą wartości swojego pojazdu
          </p>
        </div>
        
        <div className="md:flex md:space-x-8 md:items-stretch">
          <div className="md:w-1/2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6 
                          transform transition-all duration-300 hover:shadow-xl
                          bg-gradient-to-br from-white via-white to-gray-50">
              <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] h-2 w-full"></div>
              
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-[#300FE6]/10 p-3 rounded-full mr-4">
                    <Calculator className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Kalkulator składki</h3>
                </div>
                
                <Tabs defaultValue="fakturowy" onValueChange={(value) => setActiveInsuranceType(value as InsuranceType)}>
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger 
                      value="fakturowy" 
                      className="py-3 text-base rounded-tl-md rounded-bl-md data-[state=active]:bg-[#FF8E3D] data-[state=active]:text-white"
                    >
                      GAP Fakturowy
                      {renderTooltip(tooltips.gapFakturowy)}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="casco" 
                      className="py-3 text-base rounded-tr-md rounded-br-md data-[state=active]:bg-[#FF8E3D] data-[state=active]:text-white"
                    >
                      GAP Casco
                      {renderTooltip(tooltips.gapCasco)}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="fakturowy" className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cena pojazdu
                        {renderTooltip(tooltips.carPrice)}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className={`w-full p-3 border ${errors.carPrice ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                          value={formatPrice(calculatorData.carPrice)}
                          onChange={(e) => {
                            const numericValue = parsePrice(e.target.value);
                            setCalculatorData(prev => ({ ...prev, carPrice: numericValue }));
                          }}
                          placeholder="Wprowadź cenę"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">zł</span>
                        </div>
                      </div>
                      {errors.carPrice && <p className="mt-1 text-sm text-red-500">{errors.carPrice}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rok produkcji pojazdu
                        {renderTooltip(tooltips.year)}
                      </label>
                      <select
                        className={`w-full p-3 border ${errors.year ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={calculatorData.year}
                        onChange={(e) => setCalculatorData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      >
                        <option value="">Wybierz rok</option>
                        {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Okres ubezpieczenia
                        {renderTooltip(tooltips.months)}
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                        {[12, 24, 36, 48, 60].map((period) => (
                          <button
                            key={period}
                            type="button"
                            onClick={() => setCalculatorData(prev => ({ ...prev, months: period }))}
                            className={`
                              py-2 px-3 rounded-md font-medium text-center
                              ${isPeriodActive(period) 
                                ? 'bg-[#300FE6] text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                            `}
                          >
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-lg font-bold">{period}</span>
                              <span className="text-xs">
                                {period === 12 ? 'miesiąc' : 'miesięcy'}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.months && <p className="mt-1 text-sm text-red-500">{errors.months}</p>}
                    </div>
                    
                    <div className="pt-4">
                      <StarBorder 
                        as="button"
                        className="w-full text-lg font-medium transition-all duration-200"
                        color="#3311EE"
                        speed="3s"
                        onClick={handleCalculate}
                        disabled={isCalculating}
                      >
                        <div className="flex items-center justify-center bg-gradient-to-r from-[#300FE6] to-[#2208B0] hover:from-[#4024E9] hover:to-[#300FE6] py-4 text-white font-medium rounded-[20px] shadow-md hover:shadow-lg">
                          {isCalculating ? 'Obliczanie...' : 'Oblicz składkę ubezpieczenia'}
                        </div>
                      </StarBorder>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="casco" className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cena pojazdu
                        {renderTooltip(tooltips.carPrice)}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className={`w-full p-3 border ${errors.carPrice ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                          value={formatPrice(calculatorData.carPrice)}
                          onChange={(e) => {
                            const numericValue = parsePrice(e.target.value);
                            setCalculatorData(prev => ({ ...prev, carPrice: numericValue }));
                          }}
                          placeholder="Wprowadź cenę"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">zł</span>
                        </div>
                      </div>
                      {errors.carPrice && <p className="mt-1 text-sm text-red-500">{errors.carPrice}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rok produkcji pojazdu
                        {renderTooltip(tooltips.year)}
                      </label>
                      <select
                        className={`w-full p-3 border ${errors.year ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={calculatorData.year}
                        onChange={(e) => setCalculatorData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      >
                        <option value="">Wybierz rok</option>
                        {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Okres ubezpieczenia
                        {renderTooltip(tooltips.months)}
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                        {[12, 24, 36, 48, 60].map((period) => (
                          <button
                            key={period}
                            type="button"
                            onClick={() => setCalculatorData(prev => ({ ...prev, months: period }))}
                            className={`
                              py-2 px-3 rounded-md font-medium text-center
                              ${isPeriodActive(period) 
                                ? 'bg-[#300FE6] text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                            `}
                          >
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-lg font-bold">{period}</span>
                              <span className="text-xs">
                                {period === 12 ? 'miesiąc' : 'miesięcy'}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.months && <p className="mt-1 text-sm text-red-500">{errors.months}</p>}
                    </div>
                    
                    <div className="pt-4">
                      <StarBorder 
                        as="button"
                        className="w-full text-lg font-medium transition-all duration-200"
                        color="#3311EE"
                        speed="3s"
                        onClick={handleCalculate}
                        disabled={isCalculating}
                      >
                        <div className="flex items-center justify-center bg-gradient-to-r from-[#300FE6] to-[#2208B0] hover:from-[#4024E9] hover:to-[#300FE6] py-4 text-white font-medium rounded-[20px] shadow-md hover:shadow-lg">
                          {isCalculating ? 'Obliczanie...' : 'Oblicz składkę ubezpieczenia'}
                        </div>
                      </StarBorder>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {calculationResult && (
              <div 
                ref={resultRef} 
                className="mx-auto mb-4 transform transition-all duration-500 animate-fade-in-down"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#300FE6] animate-pulse-once">
                  <div className="flex items-center bg-gradient-to-r from-[#300FE6] to-[#2208B0] px-4 py-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">Twoja jednorazowa składka: {calculationResult.premium.toFixed(2)} zł</h3>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Produkt</div>
                        <div className="font-medium">{calculationResult.details.productName}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Okres ochrony</div>
                        <div className="font-medium">{calculationResult.details.coveragePeriod}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Wartość pojazdu</div>
                        <div className="font-medium">{calculationResult.details.vehicleValue.toLocaleString()} zł</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Maksymalny limit</div>
                        <div className="font-medium">{calculationResult.details.maxCoverage}</div>
                      </div>
                    </div>
                    
                    <div className="flex mt-3 space-x-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                        onClick={() => {
                          // Zapisz dane w localStorage przed przekierowaniem
                          localStorage.setItem('gapCalculationResult', JSON.stringify(calculationResult));
                          router.push('/checkout');
                        }}
                      >
                        Kup teraz
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-shrink-0 border-[#300FE6] text-[#300FE6] hover:bg-[#300FE6]/10 py-1.5"
                        onClick={() => setCalculationResult(null)}
                      >
                        Nowa kalkulacja
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="hidden md:block">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-8">
                Nie daj się <span className="text-orange-600">zaskoczyć</span> utratą wartości swojego auta
              </h2>
              
              <div className="relative w-full h-[400px]">
                <Image
                  src="/front.png"
                  alt="Ubezpieczenie samochodu"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              
              {!calculationResult && (
                <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg md:block hidden">
                  <p className="text-gray-600 italic">
                    Oblicz składkę ubezpieczenia GAP, wprowadzając dane pojazdu w formularzu po lewej stronie.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceCalculator; 