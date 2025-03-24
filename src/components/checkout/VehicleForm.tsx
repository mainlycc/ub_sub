"use client"

import { useState } from 'react';
import { Check, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface VehicleFormProps {
  data: VehicleData;
  onChange: (data: VehicleData) => void;
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

const vehicleCategories = [
  { value: "PC", label: "Samochód osobowy" },
  { value: "LCV", label: "Samochód dostawczy" }
];

const usageTypes = [
  { value: "STANDARD", label: "Standardowy" },
  { value: "TAXI", label: "Taxi" },
  { value: "RENT", label: "Wynajem" }
];

const vatOptions = [
  { value: "NO", label: "Nie odliczam VAT" },
  { value: "YES", label: "Odliczam VAT" },
  { value: "PARTIAL", label: "Odliczam częściowo" }
];

export const VehicleForm = ({ data, onChange, errors }: VehicleFormProps) => {
  const router = useRouter();

  const isFormValid = () => {
    return data.purchasedOn && 
           data.categoryCode && 
           data.firstRegisteredOn && 
           data.vin && 
           data.vin.length === 17 &&
           data.vrm;
  };

  const handleNext = () => {
    if (isFormValid()) {
      router.push('/checkout/calculation');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">1</span>
        </div>
        Dane pojazdu
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data zakupu *
          </label>
          <input
            type="date"
            name="purchasedOn"
            className={`w-full p-2 border ${errors?.purchasedOn ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={data.purchasedOn}
            onChange={(e) => onChange({ ...data, purchasedOn: e.target.value })}
          />
          {errors?.purchasedOn && (
            <p className="mt-1 text-sm text-red-500">{errors.purchasedOn}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategoria pojazdu *
          </label>
          <select
            name="categoryCode"
            className={`w-full p-2 border ${errors?.categoryCode ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={data.categoryCode}
            onChange={(e) => onChange({ ...data, categoryCode: e.target.value })}
          >
            <option value="">Wybierz kategorię</option>
            {vehicleCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors?.categoryCode && (
            <p className="mt-1 text-sm text-red-500">{errors.categoryCode}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data pierwszej rejestracji *
          </label>
          <input
            type="date"
            name="firstRegisteredOn"
            className={`w-full p-2 border ${errors?.firstRegisteredOn ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={data.firstRegisteredOn}
            onChange={(e) => onChange({ ...data, firstRegisteredOn: e.target.value })}
          />
          {errors?.firstRegisteredOn && (
            <p className="mt-1 text-sm text-red-500">{errors.firstRegisteredOn}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numer VIN *
          </label>
          <input
            type="text"
            name="vin"
            maxLength={17}
            className={`w-full p-2 border ${errors?.vin ? 'border-red-500' : 'border-gray-300'} rounded-md uppercase`}
            value={data.vin}
            onChange={(e) => onChange({ ...data, vin: e.target.value.toUpperCase() })}
            placeholder="np. WBA1234567890XXXX"
          />
          {errors?.vin && (
            <p className="mt-1 text-sm text-red-500">{errors.vin}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numer rejestracyjny *
          </label>
          <input
            type="text"
            name="vrm"
            className={`w-full p-2 border ${errors?.vrm ? 'border-red-500' : 'border-gray-300'} rounded-md uppercase`}
            value={data.vrm}
            onChange={(e) => onChange({ ...data, vrm: e.target.value.toUpperCase() })}
            placeholder="np. WA12345"
          />
          {errors?.vrm && (
            <p className="mt-1 text-sm text-red-500">{errors.vrm}</p>
          )}
        </div>
      </div>

      {/* Przyciski nawigacji */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex items-center text-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Wróć
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isFormValid()}
          className="bg-[#300FE6] hover:bg-[#2208B0] text-white flex items-center"
        >
          Dalej
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}; 