"use client"

import React, { useState, useMemo } from 'react';
import { VehicleData } from '@/types/insurance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleFormProps {
  data: VehicleData;
  onChange: (data: VehicleData) => void;
  errors?: {
    purchasedOn?: string;
    categoryCode?: string;
    firstRegisteredOn?: string;
    vin?: string;
    vrm?: string;
    make?: string;
    model?: string;
  };
}

interface Category {
  value: string;
  label: string;
}

interface Model {
  code: string;
  name: string;
}

interface Make {
  code: string;
  name: string;
  models: Model[];
}

const MAKES_AND_MODELS: Make[] = [
  {
    code: 'AUDI', name: 'Audi', models: [
      { code: 'AUDI_A4', name: 'A4' },
      { code: 'AUDI_A6', name: 'A6' },
      { code: 'AUDI_Q5', name: 'Q5' },
    ]
  },
  {
    code: 'BMW', name: 'BMW', models: [
      { code: 'BMW_3', name: 'Seria 3' },
      { code: 'BMW_5', name: 'Seria 5' },
      { code: 'BMW_X3', name: 'X3' },
    ]
  },
  {
    code: 'TOYOTA', name: 'Toyota', models: [
      { code: 'TOYOTA_COROLLA', name: 'Corolla' },
      { code: 'TOYOTA_RAV4', name: 'RAV4' },
      { code: 'TOYOTA_YARIS', name: 'Yaris' },
    ]
  },
];

export const VehicleForm = (props: VehicleFormProps): React.ReactElement => {
  const categories: Category[] = [
    { value: 'PC', label: 'Samochód osobowy' },
    { value: 'LCV', label: 'Samochód dostawczy' }
  ];

  const [selectedMakeCode, setSelectedMakeCode] = useState<string | undefined>(props.data.make);

  const availableModels = useMemo(() => {
    if (!selectedMakeCode) return [];
    return MAKES_AND_MODELS.find(make => make.code === selectedMakeCode)?.models || [];
  }, [selectedMakeCode]);

  const handleMakeChange = (makeCode: string) => {
    const selectedMake = MAKES_AND_MODELS.find(make => make.code === makeCode);
    setSelectedMakeCode(makeCode);
    props.onChange({ 
      ...props.data, 
      make: selectedMake?.name, 
      model: undefined, 
    });
  };

  const handleModelChange = (modelCode: string) => {
    const selectedMake = MAKES_AND_MODELS.find(make => make.code === selectedMakeCode);
    const selectedModel = selectedMake?.models.find(model => model.code === modelCode);
    props.onChange({ 
      ...props.data, 
      model: selectedModel?.name, 
      modelCode: selectedModel?.code 
    });
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marka pojazdu *
          </label>
          <Select 
            value={selectedMakeCode}
            onValueChange={handleMakeChange}
          >
            <SelectTrigger className={`${props.errors?.make ? 'border-red-500' : 'border-gray-300'}`}>
              <SelectValue placeholder="Wybierz markę" />
            </SelectTrigger>
            <SelectContent>
              {MAKES_AND_MODELS.map(make => (
                <SelectItem key={make.code} value={make.code}>
                  {make.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {props.errors?.make && (
            <p className="mt-1 text-sm text-red-500">{props.errors.make}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model pojazdu *
          </label>
          <Select 
            value={props.data.modelCode}
            onValueChange={handleModelChange}
            disabled={!selectedMakeCode || availableModels.length === 0}
          >
            <SelectTrigger className={`${props.errors?.model ? 'border-red-500' : 'border-gray-300'}`}>
              <SelectValue placeholder={selectedMakeCode ? "Wybierz model" : "Najpierw wybierz markę"} />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map(model => (
                <SelectItem key={model.code} value={model.code}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {props.errors?.model && (
            <p className="mt-1 text-sm text-red-500">{props.errors.model}</p>
          )}
        </div>
      </div>
    </div>
  );
}; 