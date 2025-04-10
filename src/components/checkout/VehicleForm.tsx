"use client"

import React, { useState, useEffect } from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { VehicleMakeSelect } from './VehicleMakeSelect';
import { VehicleModelSelect } from './VehicleModelSelect';
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
    if (!data.vin) {
      newErrors.vin = 'Brak numeru VIN';
    }
    if (!data.vrm) {
      newErrors.vrm = 'Brak numeru rejestracyjnego';
    }
    if (!data.categoryCode) {
      newErrors.categoryCode = 'Brak kategorii pojazdu';
    }
    if (!data.usageCode) {
      newErrors.usageCode = 'Brak sposobu wykorzystania';
    }
    if (!data.firstRegisteredOn) {
      newErrors.firstRegisteredOn = 'Brak daty pierwszej rejestracji';
    }
    if (!data.purchasedOn) {
      newErrors.purchasedOn = 'Brak daty nabycia';
    }
    if (!data.purchasePrice) {
      newErrors.purchasePrice = 'Brak wartości pojazdu';
    }
    if (!data.mileage) {
      newErrors.mileage = 'Brak przebiegu pojazdu';
    }
    if (!data.purchasePriceInputType) {
      newErrors.purchasePriceInputType = 'Brak typu wartości';
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
        makeId: selectedMakeId || '',
        modelId: selectedModel || '',
      });
    }
  };

  const handleMakeSelect = (makeId: string | null) => {
    setSelectedMakeId(makeId);
    setSelectedModel(null);
    onChange({
      ...data,
      make: makeId || '',
      makeId: makeId || '',
      modelCode: '',
      modelId: ''
    });
  };

  const handleModelSelect = (modelId: string | null) => {
    setSelectedModel(modelId);
    onChange({
      ...data,
      modelCode: modelId || '',
      modelId: modelId || ''
    });
  };

  const handleInputChange = (field: keyof VehicleData, value: string | number) => {
    const updatedData = { ...data, [field]: value };
    
    // Ustawiamy domyślne wartości dla pustych pól
    if (!updatedData.usageTypeCode) {
      updatedData.usageTypeCode = 'INDIVIDUAL';
    }
    if (!updatedData.purchasePriceVatReclaimableCode) {
      updatedData.purchasePriceVatReclaimableCode = 'NO';
    }
    if (!updatedData.usageCode) {
      updatedData.usageCode = 'STANDARD';
    }
    if (!updatedData.categoryCode) {
      updatedData.categoryCode = 'PC';
    }
    if (!updatedData.purchasePriceInputType) {
      updatedData.purchasePriceInputType = 'VAT_INAPPLICABLE';
    }

    // Jeśli zmieniamy purchasePrice, aktualizujemy też purchasePriceNet
    if (field === 'purchasePrice') {
      const price = typeof value === 'number' ? value : parseFloat(value) || 0;
      updatedData.purchasePriceNet = price; // Dla VAT_INAPPLICABLE, wartość netto = brutto
    }

    // Dodajemy brakujące pola wymagane przez API
    if (!updatedData.evaluationDate) {
      updatedData.evaluationDate = new Date().toISOString().split('T')[0];
    }

    // Jeśli zmieniamy markę lub model, aktualizujemy też makeId i modelId
    if (field === 'make') {
      updatedData.makeId = String(value);
    }
    if (field === 'modelCode') {
      updatedData.modelId = String(value);
    }
    
    // Upewnijmy się, że makeId i modelId są zawsze ustawione
    if (selectedMakeId && !updatedData.makeId) {
      updatedData.makeId = selectedMakeId;
      updatedData.make = selectedMakeId;
    }
    
    if (selectedModel && !updatedData.modelId) {
      updatedData.modelId = selectedModel;
      updatedData.modelCode = selectedModel;
    }
    
    // Sprawdź VIN
    if (field === 'vin') {
      // Upewnij się, że VIN ma prawidłowy format (usuń wszystkie spacje i znaki specjalne)
      updatedData.vin = String(value).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    }
    
    // Upewnij się, że numer rejestracyjny jest w odpowiednim formacie
    if (field === 'vrm') {
      updatedData.vrm = String(value).replace(/\s+/g, '').toUpperCase();
    }

    onChange(updatedData);
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
            <Label htmlFor="mileage">Przebieg pojazdu (km)</Label>
            <Input
              type="number"
              id="mileage"
              min="0"
              step="1"
              value={data.mileage || ''}
              onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
              className={errors?.mileage ? 'border-red-500' : ''}
              placeholder="Wprowadź przebieg w kilometrach"
            />
            {errors?.mileage && (
              <p className="text-sm text-red-500">{errors.mileage}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePriceInputType">Podana wartość jest</Label>
            <Select
              id="purchasePriceInputType"
              value={data.purchasePriceInputType}
              onChange={(e) => handleInputChange('purchasePriceInputType', e.target.value)}
              className={errors?.purchasePriceInputType ? 'border-red-500' : ''}
            >
              <option value="">Wybierz typ wartości</option>
              <option value="WITH_VAT">Brutto (z VAT)</option>
              <option value="WITHOUT_VAT">Netto (bez VAT)</option>
              <option value="VAT_INAPPLICABLE">VAT nie ma zastosowania</option>
            </Select>
            {errors?.purchasePriceInputType && (
              <p className="text-sm text-red-500">{errors.purchasePriceInputType}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VehicleMakeSelect
            selectedMakeId={selectedMakeId}
            onMakeSelect={handleMakeSelect}
            error={localErrors.make}
          />
          <VehicleModelSelect
            selectedModelId={selectedModel}
            makeId={selectedMakeId}
            onModelSelect={handleModelSelect}
            error={localErrors.model}
          />
        </div>
      </div>
    </form>
  );
}; 