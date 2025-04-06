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
    TERM: 'T_36',
    CLAIM_LIMIT: 'CL_150000'
  });
  const [error, setError] = useState<string | null>(null);

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
      if (!selectedOptions.CLAIM_LIMIT) {
        throw new Error('Proszę wybrać limit odszkodowania');
      }
      if (!vehicleData.firstRegisteredOn || !vehicleData.purchasedOn) {
        throw new Error('Brak wymaganych dat pojazdu (pierwsza rejestracja, data zakupu)');
      }

      const requestBody = {
        productCode: '5_DCGAP_MG25_GEN',
        price: vehicleData.purchasePrice,
        term: selectedOptions.TERM,
        claimLimit: selectedOptions.CLAIM_LIMIT,
        modelCode: vehicleData.modelCode,
        categoryCode: vehicleData.categoryCode,
        usageCode: vehicleData.usageCode,
        firstRegisteredOn: vehicleData.firstRegisteredOn,
        purchasedOn: vehicleData.purchasedOn,
        mileage: vehicleData.mileage,
      };

      console.log('Wysyłam dane do kalkulacji API:', requestBody);

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Błąd API:', data);
        throw new Error(data.error || `Błąd podczas kalkulacji składki (status: ${response.status})`);
      }

      console.log('Otrzymana odpowiedź API:', data);

      if (!data.success || data.premium === undefined || data.premium === null) {
        console.error('Nieprawidłowa odpowiedź API - brak sukcesu lub składki:', data);
        throw new Error(data.error || 'Nie udało się obliczyć składki lub odpowiedź jest niekompletna');
      }

      const calculationResult: CalculationResult = {
        premium: data.premium,
        details: data.details
      };

      console.log('Wynik kalkulacji przygotowany do przekazania:', calculationResult);

      const paymentData: PaymentData = {
        term: selectedOptions.TERM,
        claimLimit: selectedOptions.CLAIM_LIMIT,
        premium: calculationResult.premium,
        paymentTerm: data.details?.options?.PAYMENT_TERM || "PT_LS",
        paymentMethod: data.details?.options?.PAYMENT_METHOD || "PM_PAYU"
      };

      console.log('Dane płatności przygotowane do przekazania:', paymentData);

      onNext(calculationResult, paymentData);
    } catch (error: any) {
      console.error('Błąd podczas kalkulacji (catch):', error);
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
          Wybierz opcje ubezpieczenia
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Cena zakupu pojazdu (PLN)</Label>
            <Input
              id="purchasePrice"
              type="number"
              value={vehicleData.purchasePrice}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="term">Okres ubezpieczenia</Label>
            <Select
              value={selectedOptions.TERM}
              onValueChange={(value: string) => setSelectedOptions(prev => ({ ...prev, TERM: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz okres" />
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
            <Label htmlFor="claimLimit">Limit odszkodowania (Suma ubezpieczenia)</Label>
            <Select
              value={selectedOptions.CLAIM_LIMIT}
              onValueChange={(value: string) => setSelectedOptions(prev => ({ ...prev, CLAIM_LIMIT: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CL_50000">50 000 zł</SelectItem>
                <SelectItem value="CL_100000">100 000 zł</SelectItem>
                <SelectItem value="CL_150000">150 000 zł</SelectItem>
                <SelectItem value="CL_200000">200 000 zł</SelectItem>
                <SelectItem value="CL_250000">250 000 zł</SelectItem>
                <SelectItem value="CL_300000">300 000 zł</SelectItem>
              </SelectContent>
            </Select>
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