"use client"

import React from 'react';
import { useState } from 'react';
import { Car, Calendar, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type {
  VehicleData,
  InsuranceVariant,
  InsuranceOptions,
  CalculationResult,
  CalculationResultDetails
} from '@/types/checkout';

interface CalculationFormProps {
  vehicleData: VehicleData;
  insuranceVariant: InsuranceVariant;
  paymentData: InsuranceOptions;
  onCalculate: (result: CalculationResult) => void;
  onVehicleChange: (data: VehicleData) => void;
  onPaymentChange: (data: InsuranceOptions) => void;
  calculationResult: CalculationResult | null;
  errors?: { [key: string]: string };
  inputPaths?: Array<{
    field: string;
    requiredForCalculation: boolean;
    requiredForConfirmation: boolean;
    step: string;
  }>;
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
  { value: "PT_A", label: "Płatność roczna" }
];

const paymentMethodOptions = [
  { value: "PM_PBC", label: "Płatne przez klienta (BLIK, karta, szybki przelew)" },
  { value: "PM_BT", label: "Przelew tradycyjny" },
  { value: "PM_PAYU_M", label: "Raty miesięczne PayU" },
  { value: "PM_BY_DLR", label: "Płatne przez dealera" }
];

export const CalculationForm = ({ 
  vehicleData, 
  insuranceVariant, 
  paymentData, 
  onCalculate, 
  onVehicleChange, 
  onPaymentChange, 
  calculationResult, 
  errors,
  inputPaths
}: CalculationFormProps): React.ReactElement => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [vehicleValue, setVehicleValue] = useState(vehicleData.purchasePrice || 0);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  
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
  
  // Sprawdzenie wymaganych pól przed kalkulacją
  const validateRequiredFields = () => {
    const requiredFields = [
      { field: 'categoryCode', message: 'Kategoria pojazdu jest wymagana' },
      { field: 'model', message: 'Model pojazdu jest wymagany' },
      { field: 'purchasePrice', message: 'Cena zakupu jest wymagana' },
      { field: 'firstRegisteredOn', message: 'Data pierwszej rejestracji jest wymagana' },
      { field: 'purchasedOn', message: 'Data zakupu jest wymagana' },
      { field: 'usageCode', message: 'Sposób użytkowania jest wymagany' }
    ];

    const missingFields = requiredFields.filter(
      ({ field }) => !vehicleData[field as keyof VehicleData]
    );

    if (missingFields.length > 0) {
      throw new Error(`Brakujące wymagane pola: ${missingFields.map(f => f.message).join(', ')}`);
    }

    // Dodatkowa walidacja kodów
    if (vehicleData.categoryCode !== "PC" && vehicleData.categoryCode !== "CV") {
      throw new Error('Nieprawidłowa kategoria pojazdu. Dozwolone wartości: PC (samochód osobowy) lub CV (samochód ciężarowy)');
    }

    if (vehicleData.usageCode !== "STANDARD") {
      throw new Error('Nieprawidłowy sposób użytkowania. Dozwolona wartość: STANDARD');
    }
  };

  const validateData = (data: any) => {
    const currentDate = new Date();
    const errors: { [key: string]: string } = {};

    // Walidacja dat
    if (new Date(data.vehicleSnapshot.firstRegisteredOn) > currentDate) {
      errors.firstRegisteredOn = "Data pierwszej rejestracji nie może być w przyszłości";
    }

    if (new Date(data.vehicleSnapshot.purchasedOn) > currentDate) {
      errors.purchasedOn = "Data zakupu nie może być w przyszłości";
    }

    // Walidacja cen
    const maxPrice = 30000000; // 300,000 zł w groszach
    const minPrice = 5000000;  // 50,000 zł w groszach

    if (data.vehicleSnapshot.purchasePrice > maxPrice || data.vehicleSnapshot.purchasePrice < minPrice) {
      errors.purchasePrice = "Cena pojazdu musi być między 50,000 zł a 300,000 zł";
    }

    return errors;
  };

  // Wykonanie kalkulacji
  const calculatePremium = async () => {
    setIsCalculating(true);
    setCalculationError(null);
    
    try {
      // Sprawdzenie wymaganych pól
      validateRequiredFields();

      // Walidacja dat przed wysłaniem
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const firstRegisteredDate = new Date(vehicleData.firstRegisteredOn);
      firstRegisteredDate.setHours(0, 0, 0, 0);
      
      const purchasedDate = new Date(vehicleData.purchasedOn);
      purchasedDate.setHours(0, 0, 0, 0);
      
      // Sprawdzenie dat w przyszłości
      if (firstRegisteredDate > today) {
        throw new Error('Data pierwszej rejestracji nie może być w przyszłości');
      }
      
      if (purchasedDate > today) {
        throw new Error('Data zakupu pojazdu nie może być w przyszłości');
      }
      
      // Walidacja, czy data pierwszej rejestracji jest przed datą zakupu
      if (firstRegisteredDate > purchasedDate) {
        throw new Error('Data pierwszej rejestracji nie może być późniejsza niż data zakupu');
      }

      // Przygotowanie danych w formacie zgodnym z API
      const calculationData = {
        sellerNodeCode: insuranceVariant.sellerNodeCode,
        productCode: insuranceVariant.productCode,
        signatureTypeCode: insuranceVariant.signatureTypeCode,
        saleInitiatedOn: today.toISOString().split('T')[0],
        
        vehicleSnapshot: {
          ...vehicleData,
          purchasePrice: vehicleData.purchasePrice,
          purchasePriceNet: vehicleData.purchasePriceNet,
          categoryCode: vehicleData.categoryCode || "PC",
          usageCode: vehicleData.usageCode || "STANDARD",
          modelCode: vehicleData.modelCode || "342",
          firstRegisteredOn: vehicleData.firstRegisteredOn,
          purchasedOn: vehicleData.purchasedOn,
          mileage: vehicleData.mileage || 1000,
          vin: vehicleData.vin || "",
          owners: [{
            contact: {
              type: "person"
            }
          }]
        },
        
        options: paymentData
      };

      // Walidacja danych przed wysłaniem
      const validationErrors = validateData(calculationData);
      if (Object.keys(validationErrors).length > 0) {
        setCalculationError("Błąd walidacji: " + Object.values(validationErrors).join(", "));
        return;
      }

      console.log('Dane do wysłania:', JSON.stringify(calculationData, null, 2));

      const response = await fetch('/api/calculate-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calculationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Błąd odpowiedzi:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        
        throw new Error(errorData.error || 'Wystąpił błąd podczas kalkulacji składki');
      }

      const responseData = await response.json();
      console.log('Otrzymana odpowiedź:', responseData);
      onCalculate(responseData);
    } catch (error) {
      console.error('Szczegóły błędu:', error);
      setCalculationError(error instanceof Error ? error.message : 'Wystąpił błąd podczas kalkulacji');
    } finally {
      setIsCalculating(false);
    }
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
              Model pojazdu *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={vehicleData.model || ""}
              onChange={(e) => onVehicleChange({
                ...vehicleData,
                model: e.target.value
              })}
              placeholder="np. Toyota Corolla"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data pierwszej rejestracji *
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={vehicleData.firstRegisteredOn || ""}
                onChange={(e) => onVehicleChange({
                  ...vehicleData,
                  firstRegisteredOn: e.target.value
                })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data zakupu *
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={vehicleData.purchasedOn || ""}
                onChange={(e) => onVehicleChange({
                  ...vehicleData,
                  purchasedOn: e.target.value
                })}
              />
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
                    ${paymentData.TERM === option.value 
                      ? 'border-[#300FE6] bg-[#300FE6]/5 text-[#300FE6] font-medium' 
                      : 'border-gray-300 hover:border-gray-400'}`}
                  onClick={() => handleOptionChange('TERM', option.value)}
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
                    ${paymentData.CLAIM_LIMIT === option.value 
                      ? 'border-[#300FE6] bg-[#300FE6]/5 text-[#300FE6] font-medium' 
                      : 'border-gray-300 hover:border-gray-400'}`}
                  onClick={() => handleOptionChange('CLAIM_LIMIT', option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 text-blue-600" size={20} />
          Opcje płatności
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sposób płatności
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentTermOptions.map((option) => (
                <div
                  key={option.value}
                  className={`border rounded-lg p-3 text-center cursor-pointer transition-all
                    ${paymentData.PAYMENT_TERM === option.value 
                      ? 'border-[#300FE6] bg-[#300FE6]/5 text-[#300FE6] font-medium' 
                      : 'border-gray-300 hover:border-gray-400'}`}
                  onClick={() => handleOptionChange('PAYMENT_TERM', option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma płatności
            </label>
            <div className="grid grid-cols-1 gap-4">
              {paymentMethodOptions.map((option) => (
                <div
                  key={option.value}
                  className={`border rounded-lg p-3 text-center cursor-pointer transition-all
                    ${paymentData.PAYMENT_METHOD === option.value 
                      ? 'border-[#300FE6] bg-[#300FE6]/5 text-[#300FE6] font-medium' 
                      : 'border-gray-300 hover:border-gray-400'}`}
                  onClick={() => handleOptionChange('PAYMENT_METHOD', option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {calculationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{calculationError}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={calculatePremium}
          disabled={isCalculating || !vehicleValue || !vehicleData.firstRegisteredOn || !vehicleData.purchasedOn}
          className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
        >
          {isCalculating ? (
            <>
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
              Obliczanie...
            </>
          ) : (
            <>
              <DollarSign className="w-5 h-5 mr-2" />
              Oblicz składkę
            </>
          )}
        </Button>
      </div>

      {calculationResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Wynik kalkulacji</h3>
          <div className="space-y-2">
            <p className="text-green-700">
              <span className="font-medium">Produkt:</span> {calculationResult.details.productName}
            </p>
            <p className="text-green-700">
              <span className="font-medium">Okres ochrony:</span> {calculationResult.details.coveragePeriod}
            </p>
            <p className="text-green-700">
              <span className="font-medium">Wartość pojazdu:</span> {(calculationResult.details.vehicleValue / 100).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
            </p>
            <p className="text-green-700">
              <span className="font-medium">Maksymalna kwota odszkodowania:</span> {calculationResult.details.maxCoverage}
            </p>
            <div className="pt-4 border-t border-green-200">
              <p className="text-2xl font-bold text-green-800">
                Składka: {(calculationResult.premium / 100).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 