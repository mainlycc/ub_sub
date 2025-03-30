"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { InsuranceVariant, CalculationResult } from '@/types/insurance';

interface CalculationFormProps {
  vehicleData: {
    make: string;
    model: string;
    purchasePrice: number;
  };
  onNext: (calculationResult: CalculationResult) => void;
}

const COVERAGE_PERIODS = [
  { value: "T_12", label: "12 miesięcy" },
  { value: "T_24", label: "24 miesiące" },
  { value: "T_36", label: "36 miesięcy" },
  { value: "T_48", label: "48 miesięcy" },
  { value: "T_60", label: "60 miesięcy" }
] as const;

const CLAIM_LIMITS = [
  { value: "CL_100", label: "100% wartości pojazdu" },
  { value: "CL_120", label: "120% wartości pojazdu" },
  { value: "CL_150", label: "150% wartości pojazdu" }
] as const;

export const CalculationForm = ({ vehicleData, onNext }: CalculationFormProps) => {
  const [selectedOptions, setSelectedOptions] = useState<CalculationResult['options']>({
    TERM: "T_36",
    CLAIM_LIMIT: "CL_120"
  });

  const handleVariantChange = (productCode: InsuranceVariant['productCode']) => {
    // Implementation of handleVariantChange
  };

  const handleCalculate = async () => {
    // Symulacja kalkulacji
    const mockResult: CalculationResult = {
      premium: 1500,
      maxCoverage: vehicleData.purchasePrice * 1.2,
      coveragePeriod: 36,
      currency: 'PLN',
      status: 'success',
      options: selectedOptions
    };

    onNext(mockResult);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kalkulacja ubezpieczenia GAP</h2>
        <Button variant="outline" onClick={handleCalculate}>
          Oblicz składkę
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Okres ochrony</h3>
          <select
            className="w-full p-2 border rounded"
            value={selectedOptions.TERM}
            onChange={(e) => setSelectedOptions(prev => ({ ...prev, TERM: e.target.value as CalculationResult['options']['TERM'] }))}
          >
            {COVERAGE_PERIODS.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Limit odszkodowania</h3>
          <select
            className="w-full p-2 border rounded"
            value={selectedOptions.CLAIM_LIMIT}
            onChange={(e) => setSelectedOptions(prev => ({ ...prev, CLAIM_LIMIT: e.target.value as CalculationResult['options']['CLAIM_LIMIT'] }))}
          >
            {CLAIM_LIMITS.map(limit => (
              <option key={limit.value} value={limit.value}>
                {limit.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}; 