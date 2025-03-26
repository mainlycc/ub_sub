"use client"

import React from 'react';
import { useState } from 'react';
import { Car, Calendar, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CalculationFormProps {
  vehicleData: VehicleData;
  insuranceVariant: InsuranceVariant;
  paymentData: PaymentData;
  onCalculate: (result: CalculationResult) => void;
  onVehicleChange: (data: VehicleData) => void;
  onPaymentChange: (data: PaymentData) => void;
  calculationResult: CalculationResult | null;
  errors?: { [key: string]: string };
}

interface VehicleData {
  purchasedOn: string;
  modelCode: string;
  categoryCode: string;
  usageCode: string;
  mileage: number;
  firstRegisteredOn: string;
  evaluationDate: string;
  purchasePrice: number;
  purchasePriceNet: number;
  purchasePriceVatReclaimableCode: string;
  usageTypeCode: string;
  purchasePriceInputType: string;
  vin: string;
  vrm: string;
  make?: string;
  model?: string;
}

interface InsuranceVariant {
  productCode: string;
  sellerNodeCode: string;
  signatureTypeCode: string;
}

interface PaymentData {
  term: string;
  claimLimit: string;
  paymentTerm: string;
  paymentMethod: string;
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

const termOptions = [
  { value: "T_12", label: "12 miesięcy" },
  { value: "T_24", label: "24 miesiące" },
  { value: "T_36", label: "36 miesięcy" },
  { value: "T_48", label: "48 miesięcy" },
  { value: "T_60", label: "60 miesięcy" }
];
const claimLimitOptions = [
  { value: "CL_50000", label: "50 000 PLN" },
  { value: "CL_100000", label: "100 000 PLN" },
  { value: "CL_150000", label: "150 000 PLN" },
  { value: "CL_200000", label: "200 000 PLN" },
  { value: "CL_250000", label: "250 000 PLN" },
  { value: "CL_300000", label: "300 000 PLN" }
];

const paymentTermOptions = [
  { value: "PT_LS", label: "Płatność jednorazowa" },
  { value: "PT_M", label: "Płatność miesięczna" }
];

export const CalculationForm = ({ 
  vehicleData, 
  insuranceVariant, 
  paymentData, 
  onCalculate, 
  onVehicleChange, 
  onPaymentChange, 
  calculationResult, 
  errors 
}: CalculationFormProps): React.ReactElement => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [vehicleValue, setVehicleValue] = useState(vehicleData.purchasePrice || 0);
  
  // Handler do zmiany ceny pojazdu
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value);
    setVehicleValue(price);
    onVehicleChange({
      ...vehicleData,
      purchasePrice: price,
      purchasePriceNet: price * 0.8, // przykładowa wartość netto (80% wartości brutto)
    });
  };
  
  // Handler do zmiany opcji płatności
  const handleOptionChange = (name: string, value: string) => {
    onPaymentChange({
      ...paymentData,
      [name]: value
    });
  };
  
  // Wykonanie kalkulacji
  const calculatePremium = () => {
    setIsCalculating(true);
    
    // Symulacja kalkulacji - w rzeczywistej aplikacji byłoby to zapytanie do API
    setTimeout(() => {
      // Przykładowy algorytm obliczania składki
      const baseRate = 0.03; // 3% ceny pojazdu
      const termMultiplier = {
        T_12: 0.6,
        T_24: 0.8,
        T_36: 1.0,
        T_48: 1.2,
        T_60: 1.4
      }[paymentData.term] || 1.0;
      
      const limitMultiplier = paymentData.claimLimit === "CL_150000" ? 1.2 : 1.0;
      
      // Obliczanie składki
      const premium = Math.round(vehicleValue * baseRate * termMultiplier * limitMultiplier);
      
      // Mapowanie okresu do tekstu
      const coveragePeriodMap = {
        T_12: "12 miesięcy",
        T_24: "24 miesiące",
        T_36: "36 miesięcy",
        T_48: "48 miesięcy",
        T_60: "60 miesięcy"
      };
      
      // Ustalenie nazwy produktu
      const productName = insuranceVariant.productCode.includes("MG25") 
        ? "GAP Fakturowy" 
        : "GAP Wartości Pojazdu";
      
      // Wynik kalkulacji
      const result: CalculationResult = {
        premium: premium,
        details: {
          productName: productName,
          coveragePeriod: coveragePeriodMap[paymentData.term as keyof typeof coveragePeriodMap] || "36 miesięcy",
          vehicleValue: vehicleValue,
          maxCoverage: paymentData.claimLimit === "CL_150000" ? "150 000 PLN" : "100 000 PLN"
        }
      };
      
      onCalculate(result);
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">2</span>
        </div>
        Poznaj cenę ubezpieczenia
      </h2>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Car className="mr-2 text-blue-600" size={20} />
          Dane pojazdu do kalkulacji
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wartość pojazdu (PLN) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1000"
                className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                value={vehicleValue || ""}
                onChange={handlePriceChange}
                placeholder="np. 50000"
              />
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 text-blue-600" size={20} />
          Opcje ubezpieczenia
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Okres ubezpieczenia
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {termOptions.map((option) => (
                <div
                  key={option.value}
                  className={`border rounded-lg p-2 text-center cursor-pointer transition-all
                    ${paymentData.term === option.value 
                      ? 'border-[#300FE6] bg-[#300FE6]/5 text-[#300FE6] font-medium' 
                      : 'border-gray-300 hover:border-gray-400'}`}
                  onClick={() => handleOptionChange('term', option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maksymalny limit odszkodowania
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claimLimitOptions.map((option) => (
                <div
                  key={option.value}
                  className={`border rounded-lg p-3 text-center cursor-pointer transition-all
                    ${paymentData.claimLimit === option.value 
                      ? 'border-[#300FE6] bg-[#300FE6]/5 text-[#300FE6] font-medium' 
                      : 'border-gray-300 hover:border-gray-400'}`}
                  onClick={() => handleOptionChange('claimLimit', option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sposób płatności
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentTermOptions.map((option) => (
                <div
                  key={option.value}
                  className={`border rounded-lg p-3 text-center cursor-pointer transition-all
                    ${paymentData.paymentTerm === option.value 
                      ? 'border-[#300FE6] bg-[#300FE6]/5 text-[#300FE6] font-medium' 
                      : 'border-gray-300 hover:border-gray-400'}`}
                  onClick={() => handleOptionChange('paymentTerm', option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Przycisk do kalkulacji */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={calculatePremium}
          disabled={isCalculating || !vehicleValue || vehicleValue <= 0}
          className="bg-[#300FE6] hover:bg-[#2208B0] text-white px-8 py-3 rounded-md transition-all"
        >
          {isCalculating ? (
            <>
              <span className="animate-spin mr-2">⌛</span>
              Obliczanie...
            </>
          ) : (
            'Oblicz składkę'
          )}
        </Button>
      </div>

      {/* Wyświetlanie błędów */}
      {errors?.vehicleValue && (
        <p className="text-red-500 text-sm mt-2">{errors.vehicleValue}</p>
      )}

      {/* Wyświetlanie wyniku kalkulacji */}
      {calculationResult && (
        <div className="bg-[#300FE6]/5 p-6 rounded-xl border border-[#300FE6]/20 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Wynik kalkulacji</h3>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-medium">Składka:</span>{' '}
              <span className="text-[#300FE6] font-bold">
                {calculationResult.premium.toLocaleString()} PLN
              </span>
            </p>
            <p>
              <span className="font-medium">Produkt:</span>{' '}
              {calculationResult.details.productName}
            </p>
            <p>
              <span className="font-medium">Okres ochrony:</span>{' '}
              {calculationResult.details.coveragePeriod}
            </p>
            <p>
              <span className="font-medium">Wartość pojazdu:</span>{' '}
              {calculationResult.details.vehicleValue.toLocaleString()} PLN
            </p>
            <p>
              <span className="font-medium">Maksymalna ochrona:</span>{' '}
              {calculationResult.details.maxCoverage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 