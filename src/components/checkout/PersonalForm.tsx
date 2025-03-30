"use client"

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonalData } from '@/types/insurance';

interface PersonalFormProps {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
  errors?: { [key: string]: string };
}

export const PersonalForm = ({ data, onChange, errors }: PersonalFormProps) => {
  const handleChange = (field: keyof PersonalData | `address.${keyof PersonalData['address']}`, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1] as keyof PersonalData['address'];
      onChange({
        ...data,
        address: {
          ...data.address,
          [addressField]: value
        }
      });
    } else {
      onChange({
        ...data,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Dane osobowe</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Imię</Label>
          <Input
            id="firstName"
            type="text"
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={errors?.firstName ? 'border-red-500' : ''}
          />
          {errors?.firstName && (
            <p className="text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nazwisko</Label>
          <Input
            id="lastName"
            type="text"
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={errors?.lastName ? 'border-red-500' : ''}
          />
          {errors?.lastName && (
            <p className="text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors?.email ? 'border-red-500' : ''}
          />
          {errors?.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={errors?.phone ? 'border-red-500' : ''}
          />
          {errors?.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pesel">PESEL</Label>
          <Input
            id="pesel"
            type="text"
            value={data.pesel}
            onChange={(e) => handleChange('pesel', e.target.value)}
            className={errors?.pesel ? 'border-red-500' : ''}
          />
          {errors?.pesel && (
            <p className="text-sm text-red-600">{errors.pesel}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="street">Ulica</Label>
          <Input
            id="street"
            type="text"
            value={data.address.street}
            onChange={(e) => handleChange('address.street', e.target.value)}
            className={errors?.['address.street'] ? 'border-red-500' : ''}
          />
          {errors?.['address.street'] && (
            <p className="text-sm text-red-600">{errors['address.street']}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="houseNumber">Numer domu</Label>
          <Input
            id="houseNumber"
            type="text"
            value={data.houseNumber}
            onChange={(e) => handleChange('houseNumber', e.target.value)}
            className={errors?.houseNumber ? 'border-red-500' : ''}
          />
          {errors?.houseNumber && (
            <p className="text-sm text-red-600">{errors.houseNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apartmentNumber">Numer mieszkania (opcjonalnie)</Label>
          <Input
            id="apartmentNumber"
            type="text"
            value={data.apartmentNumber || ''}
            onChange={(e) => handleChange('apartmentNumber', e.target.value)}
            className={errors?.apartmentNumber ? 'border-red-500' : ''}
          />
          {errors?.apartmentNumber && (
            <p className="text-sm text-red-600">{errors.apartmentNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postCode">Kod pocztowy</Label>
          <Input
            id="postCode"
            type="text"
            value={data.address.postCode}
            onChange={(e) => handleChange('address.postCode', e.target.value)}
            className={errors?.['address.postCode'] ? 'border-red-500' : ''}
          />
          {errors?.['address.postCode'] && (
            <p className="text-sm text-red-600">{errors['address.postCode']}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Miasto</Label>
          <Input
            id="city"
            type="text"
            value={data.address.city}
            onChange={(e) => handleChange('address.city', e.target.value)}
            className={errors?.['address.city'] ? 'border-red-500' : ''}
          />
          {errors?.['address.city'] && (
            <p className="text-sm text-red-600">{errors['address.city']}</p>
          )}
        </div>
      </div>
    </div>
  );
}; 