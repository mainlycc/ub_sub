"use client"

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, isBefore, isValid } from "date-fns";
import { pl } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { VehicleData } from "@/types/checkout";

export interface VehicleFormProps {
  data: VehicleData;
  onChange: (data: VehicleData) => void;
  errors?: { [key: string]: string };
  productCode: string;
  inputPaths?: Array<{
    field: string;
    requiredForCalculation: boolean;
    requiredForConfirmation: boolean;
    step: string;
  }>;
}

const getVehicleCategories = (productCode: string | undefined) => {
  if (!productCode) {
    return [
      { code: "PC", name: "Osobowy (kat. M1)" },
      { code: "LCV", name: "Ciężarowy - LCV (DMC do 3500 kg) kat. N1" },
      { code: "BK", name: "Motocykle i inne pojazdy (kat. L)" }
    ];
  }
  
  if (productCode.includes('DTGAP')) {
    return [
      { code: "BUS", name: "Autobus" },
      { code: "TR", name: "Ciężarowy (DMC powyżej 3500 kg)" },
      { code: "AT", name: "Traktor rolniczy" },
      { code: "TRA", name: "Przyczepa / Naczepa" }
    ];
  }
  
  return [
    { code: "PC", name: "Osobowy (kat. M1)" },
    { code: "LCV", name: "Ciężarowy - LCV (DMC do 3500 kg) kat. N1" },
    { code: "BK", name: "Motocykle i inne pojazdy (kat. L)" }
  ];
};

const getAvailableUsageTypes = (categoryCode: string) => {
  const baseTypes = [{ code: "STANDARD", name: "Standardowy" }];
  
  if (["PC", "LCV"].includes(categoryCode)) {
    baseTypes.push({ code: "TAXI", name: "Taxi" });
  }
  
  if (["LCV", "TR"].includes(categoryCode)) {
    baseTypes.push({ code: "TOWING", name: "Holowniczy" });
  }
  
  if (["LCV", "TR", "TRA"].includes(categoryCode)) {
    baseTypes.push(
      { code: "RENTAL_LEISURE", name: "Wypożyczalnia/Rekreacyjny" },
      { code: "LEISURE", name: "Rekreacyjny" }
    );
  }
  
  return baseTypes;
};

const validateVIN = (vin: string): boolean => {
  if (!vin) return false;
  const regex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return regex.test(vin);
};

const validateVRM = (vrm: string): boolean => {
  if (!vrm) return true; // VRM jest opcjonalny
  const regex = /^[A-Z0-9]{2,10}$/;
  return regex.test(vrm);
};

const validateDates = (firstRegisteredOn: string, purchasedOn: string): boolean => {
  if (!firstRegisteredOn || !purchasedOn) return false;
  
  const firstRegDate = new Date(firstRegisteredOn);
  const purchaseDate = new Date(purchasedOn);
  
  return isValid(firstRegDate) && 
         isValid(purchaseDate) && 
         isBefore(firstRegDate, purchaseDate);
};

const validatePurchasePrice = (price: number): boolean => {
  return price >= 1000 && price <= 1000000000; // między 1000 a 1mln PLN
};

export const VehicleForm = ({ data, onChange, errors, productCode, inputPaths }: VehicleFormProps) => {
  const vehicleCategories = getVehicleCategories(productCode);
  const availableUsageTypes = getAvailableUsageTypes(data.category);

  const handleChange = (field: string, value: string | number) => {
    const newData = { ...data };
    
    // Walidacja pól przed aktualizacją
    let isValid = true;
    let validationError = '';

    switch (field) {
      case 'category':
        if (!value) {
          isValid = false;
          validationError = 'Kategoria pojazdu jest wymagana';
        }
        break;
      
      case 'vin':
        if (!validateVIN(value.toString())) {
          isValid = false;
          validationError = 'Nieprawidłowy numer VIN';
        }
        break;
      
      case 'purchasePrice':
        if (!validatePurchasePrice(Number(value))) {
          isValid = false;
          validationError = 'Cena zakupu musi być między 1000 a 1000000 PLN';
        }
        break;
    }

    // Aktualizuj dane tylko jeśli przeszły walidację
    if (isValid) {
      newData[field] = value;
      
      // Resetuj sposób użytkowania jeśli zmieniono kategorię pojazdu
      if (field === 'category') {
        newData.usage = '';
      }
      
      // Automatyczne przeliczanie ceny netto
      if (field === 'purchasePrice') {
        newData.purchasePriceNet = Math.round(Number(value) * 0.8); // 80% wartości brutto
      }
      
      onChange(newData);
    } else if (errors) {
      errors[field] = validationError;
    }
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      const newData = {
        ...data,
        [field]: format(date, 'yyyy-MM-dd')
      };
      
      // Walidacja dat
      if (field === 'firstRegisteredOn' || field === 'purchasedOn') {
        const otherField = field === 'firstRegisteredOn' ? 'purchasedOn' : 'firstRegisteredOn';
        if (newData[otherField] && !validateDates(newData.firstRegisteredOn, newData.purchasedOn)) {
          return; // Nie aktualizuj jeśli daty są nieprawidłowe
        }
      }
      
      onChange(newData);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">2</span>
        </div>
        Dane pojazdu
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
        <div>
            <Label htmlFor="category">Kategoria pojazdu</Label>
            <Select value={data.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz kategorię" />
              </SelectTrigger>
              <SelectContent>
                {vehicleCategories.map((category) => (
                  <SelectItem key={category.code} value={category.code}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div>
            <Label htmlFor="usage">Sposób użytkowania</Label>
            <Select value={data.usage} onValueChange={(value) => handleChange('usage', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz sposób użytkowania" />
              </SelectTrigger>
              <SelectContent>
                {availableUsageTypes.map((usage) => (
                  <SelectItem key={usage.code} value={usage.code}>
                    {usage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.usage && (
              <p className="mt-1 text-sm text-red-500">{errors.usage}</p>
          )}
        </div>

        <div>
            <Label htmlFor="vin">Numer VIN</Label>
            <Input
              id="vin"
              value={data.vin}
              onChange={(e) => handleChange('vin', e.target.value)}
              placeholder="Wprowadź numer VIN"
            />
            {errors?.vin && (
              <p className="mt-1 text-sm text-red-500">{errors.vin}</p>
          )}
        </div>

        <div>
            <Label htmlFor="vrm">Numer rejestracyjny</Label>
            <Input
              id="vrm"
              value={data.vrm}
              onChange={(e) => handleChange('vrm', e.target.value)}
              placeholder="Wprowadź numer rejestracyjny"
            />
            {errors?.vrm && (
              <p className="mt-1 text-sm text-red-500">{errors.vrm}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="model">Model pojazdu</Label>
            <Input
              id="model"
              value={data.model}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="Wprowadź model pojazdu"
            />
            {errors?.model && (
              <p className="mt-1 text-sm text-red-500">{errors.model}</p>
            )}
          </div>

          <div>
            <Label htmlFor="mileage">Przebieg (km)</Label>
            <Input
              id="mileage"
              type="number"
              value={data.mileage}
              onChange={(e) => handleChange('mileage', parseInt(e.target.value))}
              placeholder="Wprowadź przebieg"
            />
            {errors?.mileage && (
              <p className="mt-1 text-sm text-red-500">{errors.mileage}</p>
            )}
          </div>

          <div>
            <Label>Data pierwszej rejestracji</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.firstRegisteredOn ? format(new Date(data.firstRegisteredOn), 'dd.MM.yyyy') : 'Wybierz datę'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.firstRegisteredOn ? new Date(data.firstRegisteredOn) : undefined}
                  onSelect={(date) => handleDateChange('firstRegisteredOn', date)}
                  locale={pl}
                />
              </PopoverContent>
            </Popover>
            {errors?.firstRegisteredOn && (
              <p className="mt-1 text-sm text-red-500">{errors.firstRegisteredOn}</p>
            )}
          </div>

          <div>
            <Label>Data zakupu</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.purchasedOn ? format(new Date(data.purchasedOn), 'dd.MM.yyyy') : 'Wybierz datę'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.purchasedOn ? new Date(data.purchasedOn) : undefined}
                  onSelect={(date) => handleDateChange('purchasedOn', date)}
                  locale={pl}
                />
              </PopoverContent>
            </Popover>
            {errors?.purchasedOn && (
              <p className="mt-1 text-sm text-red-500">{errors.purchasedOn}</p>
          )}
        </div>

        <div>
            <Label htmlFor="purchasePrice">Cena zakupu (PLN)</Label>
            <Input
              id="purchasePrice"
              type="number"
              value={data.purchasePrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                handleChange('purchasePrice', value);
                handleChange('purchasePriceNet', value);
              }}
              placeholder="Wprowadź cenę zakupu"
            />
            {errors?.purchasePrice && (
              <p className="mt-1 text-sm text-red-500">{errors.purchasePrice}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 