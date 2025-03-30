"use client"

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleData } from "@/types/insurance";

interface VehicleFormProps {
  data: VehicleData;
  onChange: (data: VehicleData) => void;
  errors?: { [key: string]: string };
}

const VAT_RECLAIMABLE_OPTIONS = [
  { value: "tak", label: "Tak" },
  { value: "50", label: "50%" },
  { value: "nie", label: "Nie" }
] as const;

const VEHICLE_CATEGORIES = [
  { value: "CAR", label: "Samochód osobowy" },
  { value: "VAN", label: "Van" },
  { value: "TRUCK", label: "Ciężarówka" }
] as const;

const USAGE_TYPES = [
  { value: "PRIVATE", label: "Prywatny" },
  { value: "COMMERCIAL", label: "Firmowy" },
  { value: "MIXED", label: "Mieszany" }
] as const;

const PURCHASE_PRICE_TYPES = [
  { value: "brutto", label: "Brutto" },
  { value: "netto", label: "Netto" },
  { value: "netto_vat", label: "Netto + VAT" }
] as const;

export const VehicleForm = ({ data, onChange, errors }: VehicleFormProps) => {
  const handleChange = (field: keyof VehicleData, value: string | number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Dane pojazdu</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="vin">Numer VIN</Label>
          <Input
            id="vin"
            type="text"
            value={data.vin}
            onChange={(e) => handleChange('vin', e.target.value)}
            className={errors?.vin ? 'border-red-500' : ''}
          />
          {errors?.vin && (
            <p className="text-sm text-red-600">{errors.vin}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vrm">Numer rejestracyjny</Label>
          <Input
            id="vrm"
            type="text"
            value={data.vrm}
            onChange={(e) => handleChange('vrm', e.target.value)}
            className={errors?.vrm ? 'border-red-500' : ''}
          />
          {errors?.vrm && (
            <p className="text-sm text-red-600">{errors.vrm}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="make">Marka</Label>
          <Input
            id="make"
            type="text"
            value={data.make}
            onChange={(e) => handleChange('make', e.target.value)}
            className={errors?.make ? 'border-red-500' : ''}
          />
          {errors?.make && (
            <p className="text-sm text-red-600">{errors.make}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            type="text"
            value={data.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className={errors?.model ? 'border-red-500' : ''}
          />
          {errors?.model && (
            <p className="text-sm text-red-600">{errors.model}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelCode">Kod modelu</Label>
          <Input
            id="modelCode"
            type="text"
            value={data.modelCode}
            onChange={(e) => handleChange('modelCode', e.target.value)}
            className={errors?.modelCode ? 'border-red-500' : ''}
          />
          {errors?.modelCode && (
            <p className="text-sm text-red-600">{errors.modelCode}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleCategory">Kategoria pojazdu</Label>
          <Select
            value={data.vehicleCategory}
            onValueChange={(value) => handleChange('vehicleCategory', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wybierz kategorię" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.vehicleCategory && (
            <p className="text-sm text-red-600">{errors.vehicleCategory}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="usageType">Typ użytkowania</Label>
          <Select
            value={data.usageType}
            onValueChange={(value) => handleChange('usageType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wybierz typ użytkowania" />
            </SelectTrigger>
            <SelectContent>
              {USAGE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.usageType && (
            <p className="text-sm text-red-600">{errors.usageType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Przebieg (km)</Label>
          <Input
            id="mileage"
            type="number"
            value={data.mileage}
            onChange={(e) => handleChange('mileage', parseInt(e.target.value) || 0)}
            className={errors?.mileage ? 'border-red-500' : ''}
          />
          {errors?.mileage && (
            <p className="text-sm text-red-600">{errors.mileage}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Cena zakupu brutto</Label>
          <Input
            id="purchasePrice"
            type="number"
            value={data.purchasePrice}
            onChange={(e) => handleChange('purchasePrice', parseFloat(e.target.value) || 0)}
            className={errors?.purchasePrice ? 'border-red-500' : ''}
          />
          {errors?.purchasePrice && (
            <p className="text-sm text-red-600">{errors.purchasePrice}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchasePriceNet">Cena zakupu netto</Label>
          <Input
            id="purchasePriceNet"
            type="number"
            value={data.purchasePriceNet}
            onChange={(e) => handleChange('purchasePriceNet', parseFloat(e.target.value) || 0)}
            className={errors?.purchasePriceNet ? 'border-red-500' : ''}
          />
          {errors?.purchasePriceNet && (
            <p className="text-sm text-red-600">{errors.purchasePriceNet}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Typ ceny zakupu</Label>
          <div className="flex space-x-4">
            {PURCHASE_PRICE_TYPES.map((type) => (
              <Button
                key={type.value}
                type="button"
                variant={data.purchasePriceType === type.value ? "default" : "outline"}
                className={`flex-1 ${data.purchasePriceType === type.value ? 'bg-[#300FE6] text-white' : ''}`}
                onClick={() => handleChange('purchasePriceType', type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Możliwość odliczenia VAT</Label>
          <div className="flex space-x-4">
            {VAT_RECLAIMABLE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={data.purchasePriceVatReclaimable === option.value ? "default" : "outline"}
                className={`flex-1 ${data.purchasePriceVatReclaimable === option.value ? 'bg-[#300FE6] text-white' : ''}`}
                onClick={() => handleChange('purchasePriceVatReclaimable', option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstRegisteredOn">Data pierwszej rejestracji</Label>
          <Input
            id="firstRegisteredOn"
            type="date"
            value={data.firstRegisteredOn}
            onChange={(e) => handleChange('firstRegisteredOn', e.target.value)}
            className={errors?.firstRegisteredOn ? 'border-red-500' : ''}
          />
          {errors?.firstRegisteredOn && (
            <p className="text-sm text-red-600">{errors.firstRegisteredOn}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchasedOn">Data zakupu</Label>
          <Input
            id="purchasedOn"
            type="date"
            value={data.purchasedOn}
            onChange={(e) => handleChange('purchasedOn', e.target.value)}
            className={errors?.purchasedOn ? 'border-red-500' : ''}
          />
          {errors?.purchasedOn && (
            <p className="text-sm text-red-600">{errors.purchasedOn}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="evaluationDate">Data wyceny</Label>
          <Input
            id="evaluationDate"
            type="date"
            value={data.evaluationDate}
            onChange={(e) => handleChange('evaluationDate', e.target.value)}
            className={errors?.evaluationDate ? 'border-red-500' : ''}
          />
          {errors?.evaluationDate && (
            <p className="text-sm text-red-600">{errors.evaluationDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}; 