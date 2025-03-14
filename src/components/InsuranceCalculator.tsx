"use client"

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { ShieldCheck, TrendingDown, DollarSign, Calculator } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { StarBorder } from "@/components/ui/star-border";

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
    
    if (!calculatorData.carPrice || calculatorData.carPrice <= 0) {
      errors.carPrice = 'Proszę podać cenę samochodu';
    }
    
    if (!calculatorData.year) {
      errors.year = 'Proszę wybrać rok produkcji';
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
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: calculatorData.carPrice,
          year: calculatorData.year,
          months: calculatorData.months,
          type: activeInsuranceType
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.premium !== undefined) {
        setCalculationResult({
          premium: data.premium,
          details: data.details
        });
        
        // Przewijamy do wyników po krótkim opóźnieniu
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        alert(`Błąd kalkulacji: ${data.error || 'Nieznany błąd'}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Nieoczekiwany błąd';
      alert(`Błąd kalkulacji: ${errorMessage}`);
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Funkcja sprawdzająca, czy dany okres jest aktywny
  const isPeriodActive = (period: number) => calculatorData.months === period;
  
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
                      className="py-3 text-base rounded-tl-md rounded-bl-md"
                    >
                      GAP Fakturowy
                    </TabsTrigger>
                    <TabsTrigger 
                      value="casco" 
                      className="py-3 text-base rounded-tr-md rounded-br-md"
                    >
                      GAP Casco
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="fakturowy" className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cena pojazdu (PLN)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          className={`w-full p-3 border ${errors.carPrice ? 'border-red-500' : 'border-gray-300'} rounded-md pl-10`}
                          value={calculatorData.carPrice || ''}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, carPrice: parseFloat(e.target.value) || 0 }))}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">PLN</span>
                        </div>
                      </div>
                      {errors.carPrice && <p className="mt-1 text-sm text-red-500">{errors.carPrice}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rok produkcji pojazdu
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
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {[12, 24, 36, 48, 60].map(period => (
                          <div 
                            key={period}
                            onClick={() => setCalculatorData(prev => ({ ...prev, months: period }))}
                            className={`
                              cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg 
                              transition-all duration-200 border-2
                              ${isPeriodActive(period) 
                                ? 'bg-[#300FE6]/10 border-[#300FE6] shadow-sm' 
                                : 'bg-white border-gray-300 hover:border-[#300FE6] hover:bg-[#300FE6]/5'}
                            `}
                          >
                            <div className={`
                              h-5 w-5 rounded-full border-2 mb-1 flex items-center justify-center
                              ${isPeriodActive(period) 
                                ? 'border-[#300FE6] bg-[#300FE6]' 
                                : 'border-gray-400'}
                            `}>
                              {isPeriodActive(period) && (
                                <div className="h-2 w-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {period} {period === 12 ? 'miesiąc' : 'miesięcy'}
                            </span>
                          </div>
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
                        Cena pojazdu (PLN)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          className={`w-full p-3 border ${errors.carPrice ? 'border-red-500' : 'border-gray-300'} rounded-md pl-10`}
                          value={calculatorData.carPrice || ''}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, carPrice: parseFloat(e.target.value) || 0 }))}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">PLN</span>
                        </div>
                      </div>
                      {errors.carPrice && <p className="mt-1 text-sm text-red-500">{errors.carPrice}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rok produkcji pojazdu
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
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {[12, 24, 36, 48, 60].map(period => (
                          <div 
                            key={period}
                            onClick={() => setCalculatorData(prev => ({ ...prev, months: period }))}
                            className={`
                              cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg 
                              transition-all duration-200 border-2
                              ${isPeriodActive(period) 
                                ? 'bg-[#300FE6]/10 border-[#300FE6] shadow-sm' 
                                : 'bg-white border-gray-300 hover:border-[#300FE6] hover:bg-[#300FE6]/5'}
                            `}
                          >
                            <div className={`
                              h-5 w-5 rounded-full border-2 mb-1 flex items-center justify-center
                              ${isPeriodActive(period) 
                                ? 'border-[#300FE6] bg-[#300FE6]' 
                                : 'border-gray-400'}
                            `}>
                              {isPeriodActive(period) && (
                                <div className="h-2 w-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {period} {period === 12 ? 'miesiąc' : 'miesięcy'}
                            </span>
                          </div>
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
                    <div className="bg-white rounded-full p-1.5 mr-3">
                      <span className="text-[#300FE6] font-bold">PLN</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Twoja składka: {calculationResult.premium.toFixed(2)} zł</h3>
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
                        className="flex-1 bg-green-600 hover:bg-green-700 py-1.5"
                        onClick={() => router.push('/gap')}
                      >
                        Kup ubezpieczenie
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
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Nie daj się <span className="text-orange-600">zaskoczyć</span> utratą wartości swojego auta
              </h2>
              
              <p className="mt-6 text-xl text-gray-600">
                Każdy nowy samochód traci nawet do 60% swojej wartości w ciągu pierwszych 3 lat. 
                <span className="font-semibold"> Ubezpieczenie GAP</span> chroni Cię przed finansowymi konsekwencjami tej utraty.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#300FE6]/10 p-2 rounded-full mr-4">
                    <ShieldCheck className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Pełna ochrona finansowa</h3>
                    <p className="text-gray-600">Otrzymasz dodatkowe odszkodowanie pokrywające różnicę między wartością początkową a aktualną pojazdu</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#300FE6]/10 p-2 rounded-full mr-4">
                    <TrendingDown className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Ochrona przed spadkiem wartości</h3>
                    <p className="text-gray-600">Zabezpieczenie przed naturalną utratą wartości pojazdu, która najszybciej postępuje w pierwszych latach</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#300FE6]/10 p-2 rounded-full mr-4">
                    <DollarSign className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Niska składka, wysoka ochrona</h3>
                    <p className="text-gray-600">Za niewielką cenę otrzymujesz zabezpieczenie przed potencjalną stratą dziesiątek tysięcy złotych</p>
                  </div>
                </div>
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