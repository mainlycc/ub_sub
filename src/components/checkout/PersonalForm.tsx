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

interface PersonalFormProps {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
  errors?: { [key: string]: string };
  inputPaths?: Array<{
    field: string;
    requiredForCalculation: boolean;
    requiredForConfirmation: boolean;
    step: string;
  }>;
}

interface PersonalData {
  type: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  identificationNumber: string;
  address: {
    addressLine1: string;
    street: string;
    city: string;
    postCode: string;
    countryCode: string;
  };
  [key: string]: any; // Dodajemy indeks sygnaturowy dla obsługi dynamicznych pól
}

const insurerTypes = [
  { code: "PERSON", name: "Osoba fizyczna" },
  { code: "COMPANY", name: "Firma" },
  { code: "SOLE_TRADER", name: "Jednoosobowa działalność gospodarcza" }
];

const validatePhoneNumber = (phone: string): boolean => {
  // Format: +48XXXXXXXXX
  const regex = /^\+48[0-9]{9}$/;
  return regex.test(phone);
};

const validateEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

const validatePESEL = (pesel: string): boolean => {
  if (!/^[0-9]{11}$/.test(pesel)) return false;

  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += parseInt(pesel[i]) * weights[i];
  }

  const checksum = (10 - (sum % 10)) % 10;
  return checksum === parseInt(pesel[10]);
};

const validatePostCode = (postCode: string): boolean => {
  // Format: XX-XXX
  const regex = /^[0-9]{2}-[0-9]{3}$/;
  return regex.test(postCode);
};

const formatPhoneNumber = (phone: string): string => {
  // Usuń wszystkie znaki niebędące cyframi
  const numbers = phone.replace(/[^0-9]/g, '');
  
  // Jeśli nie ma prefiksu +48, dodaj go
  if (!phone.startsWith('+48') && numbers.length === 9) {
    return `+48${numbers}`;
  }
  
  return phone;
};

const formatPostCode = (postCode: string): string => {
  // Usuń wszystkie znaki niebędące cyframi
  const numbers = postCode.replace(/[^0-9]/g, '');
  
  // Dodaj myślnik po drugim znaku
  if (numbers.length >= 2) {
    return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
  }
  
  return postCode;
};

export const PersonalForm = ({ data, onChange, errors, inputPaths }: PersonalFormProps) => {
  const handleChange = (field: string, value: string) => {
    let formattedValue = value;
    let validationError = null;

    // Formatowanie i walidacja w zależności od pola
    switch (field) {
      case 'phoneNumber':
        formattedValue = formatPhoneNumber(value);
        if (value && !validatePhoneNumber(formattedValue)) {
          validationError = 'Nieprawidłowy format numeru telefonu';
        }
        break;
      
      case 'email':
        if (value && !validateEmail(value)) {
          validationError = 'Nieprawidłowy format adresu email';
        }
        break;
      
      case 'identificationNumber':
        if (value && !validatePESEL(value)) {
          validationError = 'Nieprawidłowy numer PESEL';
        }
        break;
      
      case 'address.postCode':
        formattedValue = formatPostCode(value);
        if (value && !validatePostCode(formattedValue)) {
          validationError = 'Nieprawidłowy format kodu pocztowego';
        }
        break;
    }

    // Aktualizacja danych
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onChange({
        ...data,
        [parent]: {
          ...data[parent as keyof PersonalData],
          [child]: formattedValue,
          countryCode: 'PL' // Zawsze ustawiaj kraj na PL
        }
      });
    } else {
      onChange({
        ...data,
        [field]: formattedValue
      });
    }

    // Aktualizacja błędów
    if (validationError) {
      if (errors) {
        errors[field] = validationError;
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">3</span>
        </div>
        Dane osobowe
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Typ ubezpieczającego</Label>
            <Select value={data.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz typ ubezpieczającego" />
              </SelectTrigger>
              <SelectContent>
                {insurerTypes.map((type) => (
                  <SelectItem key={type.code} value={type.code}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          <div>
            <Label htmlFor="firstName">Imię</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Wprowadź imię"
            />
            {errors?.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Nazwisko</Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Wprowadź nazwisko"
            />
            {errors?.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phoneNumber">Numer telefonu</Label>
            <Input
              id="phoneNumber"
              value={data.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="np. +48 123 456 789"
            />
            {errors?.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Adres email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Wprowadź adres email"
            />
            {errors?.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="identificationNumber">PESEL</Label>
            <Input
              id="identificationNumber"
              value={data.identificationNumber}
              onChange={(e) => handleChange('identificationNumber', e.target.value)}
              placeholder="Wprowadź numer PESEL"
              maxLength={11}
            />
            {errors?.identificationNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.identificationNumber}</p>
            )}
          </div>

          <div>
            <Label htmlFor="street">Ulica i numer</Label>
            <Input
              id="street"
              value={data.address.street}
              onChange={(e) => handleChange('address.street', e.target.value)}
              placeholder="Wprowadź ulicę i numer"
            />
            {errors?.['address.street'] && (
              <p className="mt-1 text-sm text-red-500">{errors['address.street']}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postCode">Kod pocztowy</Label>
              <Input
                id="postCode"
                value={data.address.postCode}
                onChange={(e) => handleChange('address.postCode', e.target.value)}
                placeholder="np. 00-000"
                maxLength={6}
              />
              {errors?.['address.postCode'] && (
                <p className="mt-1 text-sm text-red-500">{errors['address.postCode']}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city">Miejscowość</Label>
              <Input
                id="city"
                value={data.address.city}
                onChange={(e) => handleChange('address.city', e.target.value)}
                placeholder="Wprowadź miejscowość"
              />
              {errors?.['address.city'] && (
                <p className="mt-1 text-sm text-red-500">{errors['address.city']}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 