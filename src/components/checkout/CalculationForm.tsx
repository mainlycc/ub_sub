"use client"

import React from 'react';
import { useState } from 'react';
import { Car, Calendar, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { VehicleData, InsuranceVariant, CalculationResult } from "@/types/insurance";

interface CalculationFormProps {
  vehicleData: VehicleData;
  variant: InsuranceVariant;
  calculationResult: CalculationResult | null;
  onVariantChange: (variant: InsuranceVariant) => void;
  onCalculate: (result: CalculationResult) => void;
  errors?: { [key: string]: string };
}

interface VehicleSnapshot {
  purchasedOn: string;
  modelCode: string;
  categoryCode: "PC" | string;
  usageCode: "STANDARD" | string;
  mileage: number;
  firstRegisteredOn: string;
  evaluationDate: string;
  purchasePrice: number;
  purchasePriceNet: number;
  purchasePriceVatReclaimableCode: "VAT_RECLAIMABLE" | "VAT_NOT_RECLAIMABLE" | "VAT_PARTIALLY_RECLAIMABLE";
  usageTypeCode: "INDIVIDUAL" | "BUSINESS" | "MIXED";
  purchasePriceInputType: "GROSS" | "NET" | "VAT_INAPPLICABLE";
  vin: string;
  vrm: string;
  make: string;
  model: string;
}

const PRODUCT_VARIANTS = [
  {
    code: "5_DCGAP_M25_GEN",
    name: "GAP MAX",
    description: "Ochrona wartości pojazdu w przypadku szkody całkowitej lub kradzieży"
  },
  {
    code: "5_DCGAP_MG25_GEN",
    name: "GAP MAX AC",
    description: "Rozszerzona ochrona wartości pojazdu z uwzględnieniem polisy AC"
  },
  {
    code: "5_DCGAP_F25_GEN",
    name: "GAP FLEX",
    description: "Elastyczna ochrona dopasowana do Twoich potrzeb"
  },
  {
    code: "5_DCGAP_FG25_GEN",
    name: "GAP FLEX GO",
    description: "Specjalny wariant dla przedsiębiorców i przedstawicieli handlowych"
  }
] as const;

export const CalculationForm = ({ vehicleData, variant, calculationResult, onVariantChange, onCalculate, errors }: CalculationFormProps) => {
  const [selectedOptions, setSelectedOptions] = useState<CalculationResult['options']>({
    TERM: "T_36",
    CLAIM_LIMIT: "CL_100000",
    PAYMENT_TERM: "PT_LS",
    PAYMENT_METHOD: "PM_BT"
  });

  const handleVariantChange = (productCode: InsuranceVariant['productCode']) => {
    onVariantChange({
      ...variant,
      productCode
    });
  };

  const handleCalculate = async () => {
    // Symulacja wyniku kalkulacji bez wysyłania do API
    const mockResult: CalculationResult = {
      premium: 2500,
      premiumNet: 2032.52,
      premiumTax: 467.48,
      productName: PRODUCT_VARIANTS.find(v => v.code === variant.productCode)?.name || "GAP MAX",
      coveragePeriod: parseInt(selectedOptions.TERM.replace('T_', '')),
      vehicleValue: vehicleData.purchasePrice,
      maxCoverage: parseInt(selectedOptions.CLAIM_LIMIT.replace('CL_', '')),
      currency: "PLN",
      options: selectedOptions
    };

    onCalculate(mockResult);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Kalkulacja składki</h2>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Wybierz wariant ubezpieczenia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRODUCT_VARIANTS.map((product) => (
              <Button
                key={product.code}
                type="button"
                variant={variant.productCode === product.code ? "default" : "outline"}
                className={`w-full h-auto p-4 flex flex-col items-start space-y-2 ${
                  variant.productCode === product.code ? 'bg-[#300FE6] text-white' : ''
                }`}
                onClick={() => handleVariantChange(product.code)}
              >
                <span className="text-lg font-semibold">{product.name}</span>
                <span className="text-sm font-normal">{product.description}</span>
              </Button>
            ))}
          </div>
          {errors?.productCode && (
            <p className="mt-2 text-sm text-red-600">{errors.productCode}</p>
          )}
        </section>

        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Opcje ubezpieczenia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Okres ubezpieczenia</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={selectedOptions.TERM}
                onChange={(e) => setSelectedOptions({...selectedOptions, TERM: e.target.value as CalculationResult['options']['TERM']})}
              >
                <option value="T_24">24 miesiące</option>
                <option value="T_36">36 miesięcy</option>
                <option value="T_48">48 miesięcy</option>
                <option value="T_60">60 miesięcy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Limit odszkodowania</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={selectedOptions.CLAIM_LIMIT}
                onChange={(e) => setSelectedOptions({...selectedOptions, CLAIM_LIMIT: e.target.value as CalculationResult['options']['CLAIM_LIMIT']})}
              >
                <option value="CL_100000">100 000 PLN</option>
                <option value="CL_150000">150 000 PLN</option>
                <option value="CL_200000">200 000 PLN</option>
              </select>
            </div>
          </div>
        </section>

        {calculationResult && (
          <section className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Wynik kalkulacji</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Składka brutto</p>
                <p className="text-2xl font-bold text-[#300FE6]">
                  {calculationResult.premium.toLocaleString()} {calculationResult.currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Składka netto</p>
                <p className="font-medium">
                  {calculationResult.premiumNet.toLocaleString()} {calculationResult.currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Podatek</p>
                <p className="font-medium">
                  {calculationResult.premiumTax.toLocaleString()} {calculationResult.currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Produkt</p>
                <p className="font-medium">{calculationResult.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Okres ochrony</p>
                <p className="font-medium">{calculationResult.coveragePeriod} miesięcy</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Wartość pojazdu</p>
                <p className="font-medium">
                  {calculationResult.vehicleValue.toLocaleString()} {calculationResult.currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Maksymalna ochrona</p>
                <p className="font-medium">
                  {calculationResult.maxCoverage.toLocaleString()} {calculationResult.currency}
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleCalculate}
            className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
          >
            Oblicz składkę
          </Button>
        </div>
      </div>
    </div>
  );
}; 