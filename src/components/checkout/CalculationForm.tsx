"use client"

import React, { useState } from 'react';
import { Car, Calendar, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleData, CalculationResult, PaymentData } from '@/types/insurance';

interface CalculationFormProps {
  vehicleData: VehicleData;
  onNext: (result: CalculationResult, paymentData: PaymentData) => void;
}

export const CalculationForm: React.FC<CalculationFormProps> = ({
  vehicleData,
  onNext
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    TERM: 'T_36'
  });
  const [error, setError] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setError(null);

    try {
      if (!vehicleData.purchasePrice || vehicleData.purchasePrice <= 0) {
        throw new Error('Proszę wprowadzić poprawną cenę zakupu pojazdu');
      }

      if (!selectedOptions.TERM) {
        throw new Error('Proszę wybrać okres ubezpieczenia');
      }

      const months = parseInt(selectedOptions.TERM.replace('T_', ''));

      console.log('Wysyłam dane do kalkulacji:', {
        price: vehicleData.purchasePrice,
        year: vehicleData.productionYear || new Date().getFullYear(),
        months: months,
        type: 'max' // Zawsze używamy typu MAX
      });

      // Wywołanie API kalkulacji
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: vehicleData.purchasePrice,
          year: vehicleData.productionYear || new Date().getFullYear(),
          months: months,
          type: 'max'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas kalkulacji składki');
      }

      const data = await response.json();
      console.log('Otrzymana odpowiedź:', data);

      if (!data.success || !data.premium) {
        throw new Error('Nie udało się obliczyć składki');
      }

      const calculationResult = {
        premium: data.premium,
        details: {
          baseAmount: data.details.baseAmount || data.premium,
          tax: data.details.tax || Math.round(data.premium * 0.23),
          totalAmount: data.details.totalAmount || Math.round(data.premium * 1.23)
        }
      };

      console.log('Wynik kalkulacji:', calculationResult);

      // Aktualizacja danych płatności
      const paymentData = {
        term: selectedOptions.TERM,
        claimLimit: "CL_50000", // Stały limit odszkodowania
        premium: calculationResult.premium,
        paymentTerm: "PT_LS",
        paymentMethod: "PM_PAYU"
      };

      onNext(calculationResult, paymentData);
    } catch (error: any) {
      console.error('Błąd podczas kalkulacji:', error);
      setError(error.message || 'Wystąpił błąd podczas kalkulacji');
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
          <div className="space-y-2">
            <Label htmlFor="term">Okres ubezpieczenia</Label>
            <Select
              value={selectedOptions.TERM}
              onValueChange={(value: string) => setSelectedOptions(prev => ({ ...prev, TERM: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz okres ubezpieczenia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T_12">12 miesięcy</SelectItem>
                <SelectItem value="T_24">24 miesiące</SelectItem>
                <SelectItem value="T_36">36 miesięcy</SelectItem>
                <SelectItem value="T_48">48 miesięcy</SelectItem>
                <SelectItem value="T_60">60 miesięcy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Cena zakupu pojazdu</Label>
            <Input
              id="purchasePrice"
              type="number"
              value={vehicleData.purchasePrice}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="claimLimit">Suma ubezpieczenia</Label>
            <Input
              id="claimLimit"
              type="text"
              value="50 000 PLN"
              disabled
              className="bg-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
        >
          {isCalculating ? 'Obliczanie...' : 'Oblicz składkę'}
        </Button>
      </div>

      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}; 