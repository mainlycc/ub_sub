"use client"

import React, { useState, useEffect } from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { VehicleMakeSelect } from './VehicleMakeSelect';
import { VehicleModelSelect } from './VehicleModelSelect';
import { ArrowRight } from 'lucide-react';
import { VehicleData } from '@/types/vehicle';

interface VehicleFormProps {
  data: VehicleData;
  onChange: (data: VehicleData) => void;
  errors?: {
    purchasedOn?: string;
    categoryCode?: string;
    firstRegisteredOn?: string;
    vin?: string;
    vrm?: string;
    usageCode?: string;
    purchasePrice?: string;
    purchasePriceInputType?: string;
    purchasePriceVatReclaimableCode?: string;
    usageTypeCode?: string;
    mileage?: string;
    evaluationDate?: string;
    purchasePriceNet?: string;
    modelCode?: string;
    make?: string;
    model?: string;
  };
}

interface Category {
  value: string;
  label: string;
}

export const VehicleForm = ({ data, onChange, errors }: VehicleFormProps): React.ReactElement => {
  const categories: Category[] = [
    { value: 'PC', label: 'Samochód osobowy' },
    { value: 'LCV', label: 'Samochód dostawczy' }
  ];

  const [selectedMakeId, setSelectedMakeId] = useState<string | null>(data.make || null);
  const [selectedModel, setSelectedModel] = useState<string | null>(data.modelCode || null);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedMakeId(data.make || null);
    setSelectedModel(data.modelCode || null);
  }, [data.make, data.modelCode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedMakeId) {
      newErrors.make = 'Wybierz markę pojazdu';
    }
    if (!selectedModel) {
      newErrors.model = 'Wybierz model pojazdu';
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Aktualizujemy dane pojazdu z wybranymi wartościami
      onChange({
        ...data,
        modelCode: selectedModel || '',
        make: selectedMakeId || '',
      });
    }
  };

  const handleInputChange = (field: keyof VehicleData, value: string | number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
            <span className="text-[#FF8E3D] font-bold">1</span>
          </div>
          Dane pojazdu
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input
              id="vin"
              value={data.vin}
              onChange={(e) => handleInputChange('vin', e.target.value)}
              className={errors?.vin ? 'border-red-500' : ''}
            />
            {errors?.vin && (
              <p className="text-sm text-red-500">{errors.vin}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vrm">Numer rejestracyjny</Label>
            <Input
              id="vrm"
              value={data.vrm}
              onChange={(e) => handleInputChange('vrm', e.target.value)}
              className={errors?.vrm ? 'border-red-500' : ''}
            />
            {errors?.vrm && (
              <p className="text-sm text-red-500">{errors.vrm}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryCode">Kategoria pojazdu</Label>
            <Select
              id="categoryCode"
              value={data.categoryCode}
              onChange={(e) => handleInputChange('categoryCode', e.target.value)}
              className={errors?.categoryCode ? 'border-red-500' : ''}
            >
              <option value="">Wybierz kategorię</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </Select>
            {errors?.categoryCode && (
              <p className="text-sm text-red-500">{errors.categoryCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="usageCode">Sposób wykorzystania</Label>
            <Select
              id="usageCode"
              value={data.usageCode}
              onChange={(e) => handleInputChange('usageCode', e.target.value)}
              className={errors?.usageCode ? 'border-red-500' : ''}
            >
              <option value="">Wybierz sposób wykorzystania</option>
              <option value="STANDARD">Standardowy</option>
              <option value="TAXI">Taxi</option>
              <option value="RENT">Wynajem</option>
            </Select>
            {errors?.usageCode && (
              <p className="text-sm text-red-500">{errors.usageCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstRegisteredOn">Data pierwszej rejestracji</Label>
            <Input
              type="date"
              id="firstRegisteredOn"
              value={data.firstRegisteredOn}
              onChange={(e) => handleInputChange('firstRegisteredOn', e.target.value)}
              className={errors?.firstRegisteredOn ? 'border-red-500' : ''}
            />
            {errors?.firstRegisteredOn && (
              <p className="text-sm text-red-500">{errors.firstRegisteredOn}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasedOn">Data nabycia</Label>
            <Input
              type="date"
              id="purchasedOn"
              value={data.purchasedOn}
              onChange={(e) => handleInputChange('purchasedOn', e.target.value)}
              className={errors?.purchasedOn ? 'border-red-500' : ''}
            />
            {errors?.purchasedOn && (
              <p className="text-sm text-red-500">{errors.purchasedOn}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Wartość pojazdu</Label>
            <Input
              type="number"
              id="purchasePrice"
              value={data.purchasePrice || ''}
              onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
              className={errors?.purchasePrice ? 'border-red-500' : ''}
            />
            {errors?.purchasePrice && (
              <p className="text-sm text-red-500">{errors.purchasePrice}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePriceInputType">Podana wartość jest</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('purchasePriceInputType', 'BRUTTO')}
                className={`p-2 text-center rounded ${
                  data.purchasePriceInputType === 'BRUTTO'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                Brutto
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('purchasePriceInputType', 'NETTO')}
                className={`p-2 text-center rounded ${
                  data.purchasePriceInputType === 'NETTO'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                Netto
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('purchasePriceInputType', 'NETTO_VAT')}
                className={`p-2 text-center rounded ${
                  data.purchasePriceInputType === 'NETTO_VAT'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                Netto + 50% VAT
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VehicleMakeSelect
            selectedMakeId={selectedMakeId}
            onMakeSelect={(makeId) => {
              setSelectedMakeId(makeId);
              setSelectedModel(null);
              handleInputChange('make', makeId || '');
            }}
            error={localErrors.make}
          />
          <VehicleModelSelect
            selectedModelId={selectedModel}
            makeId={selectedMakeId}
            onModelSelect={(modelId) => {
              setSelectedModel(modelId);
              handleInputChange('modelCode', modelId);
            }}
            error={localErrors.model}
          />
        </div>
      </div>
    </form>
  );
}; 