"use client"

import React from 'react';
import { useState } from 'react';
import { Calculator, Clock, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { VehicleData } from '@/types/vehicle';

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

export const CalculationForm = ({ 
  vehicleData, 
  /* insuranceVariant nie jest używany */ 
  paymentData, 
  onCalculate, 
  /* onVehicleChange nie jest używany */ 
  onPaymentChange, 
  calculationResult, 
  errors 
}: CalculationFormProps): React.ReactElement => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  
  const handlePaymentChange = (field: string, value: string) => {
    onPaymentChange({
      ...paymentData,
      [field]: value
    });
  };
  
  const calculatePremium = async () => {
    setIsCalculating(true);
    setCalculationError(null);
    
    try {
      const purchaseDate = new Date(vehicleData.purchasedOn);
      const today = new Date();
      const daysSincePurchase = Math.floor((today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      tenYearsAgo.setMonth(11, 31);
      
      if (purchaseDate < tenYearsAgo) {
        setCalculationError('Data zakupu pojazdu nie może być starsza niż 10 lat (do 31 grudnia)');
        setIsCalculating(false);
        return;
      }

      if (daysSincePurchase <= 180) {
        setCalculationError('Dla tego pojazdu nie można wykonać kalkulacji - minimalny okres od zakupu to 181 dni');
        setIsCalculating(false);
        return;
      }

      const requestData = {
        sellerNodeCode: "PL_TEST_GAP_25",
        productCode: "5_DCGAP_MG25_GEN",
        saleInitiatedOn: today.toISOString().split('T')[0],
        vehicleSnapshot: {
          purchasedOn: vehicleData.purchasedOn,
          modelCode: vehicleData.modelCode,
          categoryCode: "PC",
          usageCode: "STANDARD",
          mileage: vehicleData.mileage,
          firstRegisteredOn: vehicleData.firstRegisteredOn + "T07:38:46+02:00",
          evaluationDate: today.toISOString().split('T')[0],
          purchasePrice: Math.round(vehicleData.purchasePrice * 100),
          purchasePriceNet: Math.round(vehicleData.purchasePriceNet * 100),
          purchasePriceVatReclaimableCode: "NO",
          usageTypeCode: "INDIVIDUAL",
          purchasePriceInputType: "VAT_INAPPLICABLE",
          vin: vehicleData.vin,
          vrm: vehicleData.vrm,
          owners: [{ contact: { inheritFrom: "policyHolder" } }]
        },
        options: {
          TERM: paymentData.term,
          CLAIM_LIMIT: paymentData.claimLimit,
          PAYMENT_TERM: paymentData.paymentTerm,
          PAYMENT_METHOD: paymentData.paymentMethod
        }
      };

      console.log('Wysyłane dane:', JSON.stringify(requestData, null, 2));

      const response = await fetch('/api/policies/creation/calculate-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Błąd podczas kalkulacji oferty');
      }

      const premiumAmount = responseData.premiumSuggested || responseData.premiumMax || responseData.premium;
      if (premiumAmount === null || premiumAmount === undefined) {
        throw new Error('Nieprawidłowa odpowiedź z serwera - brak danych o składce');
      }

      const result: CalculationResult = {
        premium: Math.round(premiumAmount / 100),
        details: {
          productName: 'Ubezpieczenie GAP MAX',
          coveragePeriod: `${paymentData.term.replace('T_', '')} miesięcy`,
          vehicleValue: Math.round(vehicleData.purchasePrice),
          maxCoverage: paymentData.claimLimit.replace('CL_', '') + ' PLN'
        }
      };
      
      onCalculate(result);
    } catch (error) {
      console.error('Błąd podczas kalkulacji:', error);
      setCalculationError(
        error instanceof Error 
          ? error.message 
          : 'Wystąpił nieoczekiwany błąd podczas kalkulacji'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">3</span>
        </div>
        Wybierz wariant ubezpieczenia
      </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Limit odszkodowania */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Limit odszkodowania
          </Label>
          <Select
            value={paymentData.claimLimit}
            onChange={(e) => handlePaymentChange('claimLimit', e.target.value)}
            className={errors?.claimLimit ? 'border-red-500' : ''}
          >
            <option value="">Wybierz limit</option>
            <option value="CL_50000">50 000 zł</option>
            <option value="CL_100000">100 000 zł</option>
            <option value="CL_150000">150 000 zł</option>
            <option value="CL_200000">200 000 zł</option>
            <option value="CL_250000">250 000 zł</option>
            <option value="CL_300000">300 000 zł</option>
          </Select>
          {errors?.claimLimit && (
            <p className="text-sm text-red-500">{errors.claimLimit}</p>
          )}
        </div>

        {/* Okres ubezpieczenia */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Okres ubezpieczenia
          </Label>
          <Select
            value={paymentData.term}
            onChange={(e) => handlePaymentChange('term', e.target.value)}
            className={errors?.term ? 'border-red-500' : ''}
          >
            <option value="">Wybierz okres</option>
            <option value="T_12">1 rok</option>
            <option value="T_24">2 lata</option>
            <option value="T_36">3 lata</option>
            <option value="T_48">4 lata</option>
            <option value="T_60">5 lat</option>
          </Select>
          {errors?.term && (
            <p className="text-sm text-red-500">{errors.term}</p>
          )}
        </div>
          
        {/* Rodzaj płatności */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Rodzaj płatności
          </Label>
          <Select
            value={paymentData.paymentTerm}
            onChange={(e) => handlePaymentChange('paymentTerm', e.target.value)}
            className={errors?.paymentTerm ? 'border-red-500' : ''}
          >
            <option value="">Wybierz rodzaj płatności</option>
            <option value="PT_LS">Płatność jednorazowa</option>
            <option value="PT_A">Płatność roczna</option>
          </Select>
          {errors?.paymentTerm && (
            <p className="text-sm text-red-500">{errors.paymentTerm}</p>
          )}
          </div>
          
        {/* Forma płatności */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Forma płatności
          </Label>
          <Select
            value={paymentData.paymentMethod}
            onChange={(e) => handlePaymentChange('paymentMethod', e.target.value)}
            className={errors?.paymentMethod ? 'border-red-500' : ''}
          >
            <option value="">Wybierz formę płatności</option>
            <option value="PM_PBC">Płatne przez klienta (BLIK, karta, szybki przelew)</option>
            <option value="PM_BT">Przelew tradycyjny</option>
            <option value="PM_PAYU_M">Raty miesięczne PayU</option>
            <option value="PM_BY_DLR">Płatne przez dealera</option>
          </Select>
          {errors?.paymentMethod && (
            <p className="text-sm text-red-500">{errors.paymentMethod}</p>
          )}
            </div>
          </div>
          
      {/* Podsumowanie wartości pojazdu */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Wartość pojazdu</p>
            <p className="text-lg font-semibold">{vehicleData.purchasePrice.toLocaleString('pl-PL')} zł</p>
                </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Typ wartości</p>
            <p className="text-lg font-semibold">
              {vehicleData.purchasePriceInputType === 'WITH_VAT' ? 'Brutto' :
               vehicleData.purchasePriceInputType === 'WITHOUT_VAT' ? 'Netto' : 'Netto + 50% VAT'}
            </p>
          </div>
        </div>
      </div>

      {/* Wyświetlanie błędu kalkulacji */}
      {calculationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <strong className="font-bold">Błąd! </strong>
          <span className="block sm:inline">{calculationError}</span>
        </div>
      )}

      {/* Przycisk kalkulacji */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={calculatePremium}
          disabled={isCalculating || !vehicleData.purchasePrice || vehicleData.purchasePrice <= 0}
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