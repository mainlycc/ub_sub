"use client"

import React, { useState, useEffect } from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { VehicleMakeSelect } from './VehicleMakeSelect';
import { VehicleModelSelect } from './VehicleModelSelect';
import { VehicleFormDateField } from './VehicleFormDateField';
import { VehicleData } from '@/types/vehicle';
import { checkoutMessages, vinFieldMessage } from '@/lib/user-facing-errors';

// Funkcja do formatowania liczb z separatorami tysięcy
const formatNumber = (value: number | string): string => {
  if (!value) return '';
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Funkcja do usuwania separatorów i konwersji na liczbę
const parseFormattedNumber = (value: string): number => {
  return parseInt(value.replace(/\s/g, '')) || 0;
};

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

  const [selectedMakeId, setSelectedMakeId] = useState<string | null>(data.makeId || data.make || null);
  const [selectedMakeName, setSelectedMakeName] = useState<string>((data.make && !/^\d+$/.test(String(data.make))) ? data.make : '');
  const [selectedModel, setSelectedModel] = useState<string | null>(data.modelCode || null);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedMakeId(data.makeId || data.make || null);
    setSelectedModel(data.modelCode || null);
    // Zachowaj nazwę marki jeśli data.make wygląda na nazwę (nie jest czystą liczbą = makeId)
    if (data.make && !/^\d+$/.test(String(data.make))) {
      setSelectedMakeName(data.make);
    }
  }, [data.make, data.makeId, data.modelCode]);

  // Popraw legacy data: gdy data.make to makeId (np. "16"), pobierz nazwę marki z API
  useEffect(() => {
    const makeId = data.makeId || data.make;
    if (!makeId || !/^\d+$/.test(String(makeId))) return;
    if (data.make && !/^\d+$/.test(String(data.make))) return; // już mamy nazwę
    let cancelled = false;
    fetch('/api/vehicles/makes')
      .then(res => res.ok ? res.json() : null)
      .then((makes: Array<{ id: number; name: string }> | null) => {
        if (cancelled || !Array.isArray(makes)) return;
        const make = makes.find(m => String(m.id) === String(makeId));
        if (make?.name) {
          setSelectedMakeName(make.name);
          onChange({ ...data, make: make.name });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [data.makeId, data.make]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedMakeId) {
      newErrors.make = checkoutMessages.make;
    }
    if (!selectedModel) {
      newErrors.model = checkoutMessages.model;
    }
    const vinMsg = vinFieldMessage(data.vin || '');
    if (vinMsg) {
      newErrors.vin = vinMsg;
    }
    if (!data.vrm?.trim()) {
      newErrors.vrm = checkoutMessages.vrm;
    }
    if (!data.categoryCode) {
      newErrors.categoryCode = checkoutMessages.category;
    }
    if (!data.usageCode) {
      newErrors.usageCode = checkoutMessages.usage;
    }
    if (!data.firstRegisteredOn) {
      newErrors.firstRegisteredOn = checkoutMessages.firstReg;
    }
    if (!data.purchasedOn) {
      newErrors.purchasedOn = checkoutMessages.purchaseDate;
    }
    if (!data.purchasePrice || data.purchasePrice <= 0) {
      newErrors.purchasePrice = checkoutMessages.purchasePrice;
    }
    if (typeof data.mileage !== 'number' || isNaN(data.mileage) || data.mileage < 0) {
      newErrors.mileage = data.mileage < 0 ? checkoutMessages.mileageNegative : checkoutMessages.mileageRequired;
    }
    if (!data.purchasePriceInputType) {
      newErrors.purchasePriceInputType = checkoutMessages.priceType;
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Aktualizujemy dane pojazdu z wybranymi wartościami (make = nazwa marki, nie ID)
      onChange({
        ...data,
        modelCode: selectedModel || '',
        make: selectedMakeName || data.make || '',
        makeId: selectedMakeId || '',
        modelId: selectedModel || '',
      });
    }
  };

  const handleMakeSelect = (makeId: string | null, makeName: string) => {
    setSelectedMakeId(makeId);
    setSelectedMakeName(makeName);
    setSelectedModel(null);
    onChange({
      ...data,
      make: makeName || '',
      makeId: makeId || '',
      modelCode: '',
      modelId: '',
      model: ''
    });
  };

  const handleModelSelect = (modelCode: string | null, modelName: string | null) => {
    setSelectedModel(modelCode);
    onChange({
      ...data,
      modelCode: modelCode || '',
      modelId: modelCode || '',
      model: modelName || ''
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
              className={errors?.vin ? 'border-amber-500' : ''}
            />
            {errors?.vin && (
              <p className="text-sm text-amber-800">{errors.vin}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vrm">Numer rejestracyjny</Label>
            <Input
              id="vrm"
              value={data.vrm}
              onChange={(e) => handleInputChange('vrm', e.target.value)}
              className={errors?.vrm ? 'border-amber-500' : ''}
            />
            {errors?.vrm && (
              <p className="text-sm text-amber-800">{errors.vrm}</p>
          )}
        </div>

          <div className="space-y-2">
            <Label htmlFor="categoryCode">Kategoria pojazdu</Label>
            <Select
              id="categoryCode"
              value={data.categoryCode}
              onChange={(e) => handleInputChange('categoryCode', e.target.value)}
              className={errors?.categoryCode ? 'border-amber-500' : ''}
          >
            <option value="">Wybierz kategorię</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
            </Select>
            {errors?.categoryCode && (
              <p className="text-sm text-amber-800">{errors.categoryCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="usageCode">Sposób wykorzystania</Label>
            <Select
              id="usageCode"
              value={data.usageCode}
              onChange={(e) => handleInputChange('usageCode', e.target.value)}
              className={errors?.usageCode ? 'border-amber-500' : ''}
            >
              <option value="">Wybierz sposób wykorzystania</option>
              <option value="STANDARD">Standardowy</option>
              <option value="TAXI">Taxi</option>
              <option value="RENT">Wynajem</option>
            </Select>
            {errors?.usageCode && (
              <p className="text-sm text-amber-800">{errors.usageCode}</p>
            )}
          </div>

          <VehicleFormDateField
            id="firstRegisteredOn"
            label="Data pierwszej rejestracji"
            value={data.firstRegisteredOn}
            onChange={(ymd) => handleInputChange('firstRegisteredOn', ymd)}
            error={errors?.firstRegisteredOn}
          />

          <VehicleFormDateField
            id="purchasedOn"
            label="Data nabycia"
            value={data.purchasedOn}
            onChange={(ymd) => handleInputChange('purchasedOn', ymd)}
            error={errors?.purchasedOn}
          />

          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Wartość pojazdu</Label>
            <Input
              type="text"
              id="purchasePrice"
              value={formatNumber(data.purchasePrice || '')}
              onChange={(e) => handleInputChange('purchasePrice', parseFormattedNumber(e.target.value))}
              className={errors?.purchasePrice ? 'border-amber-500' : ''}
            />
            {errors?.purchasePrice && (
              <p className="text-sm text-amber-800">{errors.purchasePrice}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePriceInputType">Podana wartość jest</Label>
            <div className="grid grid-cols-3 gap-0 rounded-md overflow-hidden border border-gray-300" role="group" aria-labelledby="purchasePriceInputType">
              <button
                type="button"
                id="purchasePriceInputType-brutto"
                aria-label="Wartość brutto"
                aria-pressed={data.purchasePriceInputType === 'WITH_VAT'}
                className={`py-2 px-4 text-center transition-colors ${
                  data.purchasePriceInputType === 'WITH_VAT' 
                    ? 'bg-[#300FE6] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('purchasePriceInputType', 'WITH_VAT')}
              >
                Brutto
              </button>
              <button
                type="button"
                id="purchasePriceInputType-netto"
                aria-label="Wartość netto"
                aria-pressed={data.purchasePriceInputType === 'WITHOUT_VAT'}
                className={`py-2 px-4 text-center border-l border-r border-gray-300 transition-colors ${
                  data.purchasePriceInputType === 'WITHOUT_VAT' 
                    ? 'bg-[#300FE6] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('purchasePriceInputType', 'WITHOUT_VAT')}
              >
                Netto
              </button>
              <button
                type="button"
                id="purchasePriceInputType-vat-inapplicable"
                aria-label="VAT nie dotyczy"
                aria-pressed={data.purchasePriceInputType === 'VAT_INAPPLICABLE'}
                className={`py-2 px-4 text-center transition-colors ${
                  data.purchasePriceInputType === 'VAT_INAPPLICABLE' 
                    ? 'bg-[#300FE6] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('purchasePriceInputType', 'VAT_INAPPLICABLE')}
              >
                Netto +<br />50% VAT
              </button>
            </div>
            {errors?.purchasePriceInputType && (
              <p className="text-sm text-amber-800">{errors.purchasePriceInputType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Czy wartość pojazdu na polisie AC jest wartością netto?</Label>
            <div className="grid grid-cols-3 gap-0 rounded-md overflow-hidden border border-gray-300">
              <button
                type="button"
                className={`py-2 px-4 text-center transition-colors ${
                  data.purchasePriceVatReclaimableCode === 'YES' 
                    ? 'bg-[#300FE6] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('purchasePriceVatReclaimableCode', 'YES')}
              >
                Tak
              </button>
              <button
                type="button"
                className={`py-2 px-4 text-center border-l border-r border-gray-300 transition-colors ${
                  data.purchasePriceVatReclaimableCode === 'PARTIAL' 
                    ? 'bg-[#300FE6] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('purchasePriceVatReclaimableCode', 'PARTIAL')}
              >
                50%
              </button>
              <button
                type="button"
                className={`py-2 px-4 text-center transition-colors ${
                  data.purchasePriceVatReclaimableCode === 'NO' 
                    ? 'bg-[#300FE6] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('purchasePriceVatReclaimableCode', 'NO')}
              >
                Nie
              </button>
            </div>
            {errors?.purchasePriceVatReclaimableCode && (
              <p className="text-sm text-amber-800">{errors.purchasePriceVatReclaimableCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">Przebieg pojazdu (km)</Label>
            <Input
              type="text"
              id="mileage"
              value={formatNumber(data.mileage || '')}
              onChange={(e) => handleInputChange('mileage', parseFormattedNumber(e.target.value))}
              className={errors?.mileage ? 'border-amber-500' : ''}
              placeholder="Wprowadź przebieg w kilometrach"
            />
            {errors?.mileage && (
              <p className="text-sm text-amber-800">{errors.mileage}</p>
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