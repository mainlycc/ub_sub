"use client"

import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface VehicleFormProps {
  data: {
    purchasedOn: string;
    categoryCode: string;
    firstRegisteredOn: string;
    vin: string;
    vrm: string;
  };
  onChange: (data: any) => void;
  errors?: {
    purchasedOn?: string;
    categoryCode?: string;
    firstRegisteredOn?: string;
    vin?: string;
    vrm?: string;
  };
}

interface Category {
  value: string;
  label: string;
}

export const VehicleForm = (props: VehicleFormProps): React.ReactElement => {
  const router = useRouter();

  const categories: Category[] = [
    { value: 'PC', label: 'Samochód osobowy' },
    { value: 'LCV', label: 'Samochód dostawczy' }
  ];

  const isFormValid = () => {
    return props.data.purchasedOn && 
           props.data.categoryCode && 
           props.data.firstRegisteredOn && 
           props.data.vin && 
           props.data.vin.length === 17 &&
           props.data.vrm;
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
            className={`w-full p-2 border ${props.errors?.purchasedOn ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={props.data.purchasedOn}
            onChange={(e) => props.onChange({ ...props.data, purchasedOn: e.target.value })}
          />
          {props.errors?.purchasedOn && (
            <p className="mt-1 text-sm text-red-500">{props.errors.purchasedOn}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategoria pojazdu *
          </label>
          <select
            name="categoryCode"
            className={`w-full p-2 border ${props.errors?.categoryCode ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={props.data.categoryCode}
            onChange={(e) => props.onChange({ ...props.data, categoryCode: e.target.value })}
          >
            <option value="">Wybierz kategorię</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {props.errors?.categoryCode && (
            <p className="mt-1 text-sm text-red-500">{props.errors.categoryCode}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data pierwszej rejestracji *
          </label>
          <input
            type="date"
            name="firstRegisteredOn"
            className={`w-full p-2 border ${props.errors?.firstRegisteredOn ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={props.data.firstRegisteredOn}
            onChange={(e) => props.onChange({ ...props.data, firstRegisteredOn: e.target.value })}
          />
          {props.errors?.firstRegisteredOn && (
            <p className="mt-1 text-sm text-red-500">{props.errors.firstRegisteredOn}</p>
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
            className={`w-full p-2 border ${props.errors?.vin ? 'border-red-500' : 'border-gray-300'} rounded-md uppercase`}
            value={props.data.vin}
            onChange={(e) => props.onChange({ ...props.data, vin: e.target.value.toUpperCase() })}
            placeholder="np. WBA1234567890XXXX"
          />
          {props.errors?.vin && (
            <p className="mt-1 text-sm text-red-500">{props.errors.vin}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numer rejestracyjny *
          </label>
          <input
            type="text"
            name="vrm"
            className={`w-full p-2 border ${props.errors?.vrm ? 'border-red-500' : 'border-gray-300'} rounded-md uppercase`}
            value={props.data.vrm}
            onChange={(e) => props.onChange({ ...props.data, vrm: e.target.value.toUpperCase() })}
            placeholder="np. WA12345"
          />
          {props.errors?.vrm && (
            <p className="mt-1 text-sm text-red-500">{props.errors.vrm}</p>
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