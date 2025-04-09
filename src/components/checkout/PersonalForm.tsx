"use client"

import React from 'react';
import { User, Mail, CreditCard } from 'lucide-react';

interface PersonalFormProps {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
  errors?: { [key: string]: string };
}

interface PersonalData {
  type: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  identificationNumber: string;
  address: {
    addressLine1: string;
    street: string;
    city: string;
    postCode: string;
    countryCode: string;
  };
}

type AddressData = PersonalData['address'];
type AddressField = keyof AddressData;

export const PersonalForm = ({ data, onChange, errors }: PersonalFormProps): React.ReactElement => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Obsługa pól zagnieżdżonych (adres)
      const [parent, child] = name.split('.');
      if (parent === 'address' && isAddressField(child)) {
        onChange({
          ...data,
          address: {
            ...data.address,
            [child]: value
          }
        });
      }
    } else {
      // Obsługa pól bezpośrednich
      onChange({
        ...data,
        [name]: value
      });
    }

    console.log('Aktualne dane osobowe:', {
      name,
      value,
      data
    });
  };

  const isAddressField = (field: string): field is AddressField => {
    return field in data.address;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">3</span>
        </div>
        Twoje dane
      </h2>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="mr-2 text-blue-600" size={20} />
          Dane osobowe
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imię *
            </label>
            <input
              type="text"
              name="firstName"
              className={`w-full p-2 border ${errors?.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={data.firstName}
              onChange={handleChange}
            />
            {errors?.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nazwisko *
            </label>
            <input
              type="text"
              name="lastName"
              className={`w-full p-2 border ${errors?.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={data.lastName}
              onChange={handleChange}
            />
            {errors?.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Mail className="mr-2 text-blue-600" size={20} />
          Dane kontaktowe
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              className={`w-full p-2 border ${errors?.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={data.email}
              onChange={handleChange}
              placeholder="np. jan.kowalski@example.com"
            />
            {errors?.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              className={`w-full p-2 border ${errors?.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={data.phoneNumber}
              onChange={handleChange}
              placeholder="+48XXXXXXXXX"
            />
            {errors?.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="mr-2 text-blue-600" size={20} />
          Dane identyfikacyjne
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PESEL *
          </label>
          <input
            type="text"
            name="identificationNumber"
            maxLength={11}
            className={`w-full p-2 border ${errors?.identificationNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={data.identificationNumber}
            onChange={handleChange}
          />
          {errors?.identificationNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.identificationNumber}</p>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">
          Adres zamieszkania
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ulica i numer *
            </label>
            <input
              type="text"
              name="address.street"
              className={`w-full p-2 border ${errors?.street ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={data.address.street}
              onChange={handleChange}
            />
            {errors?.street && (
              <p className="mt-1 text-sm text-red-500">{errors.street}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miasto *
              </label>
              <input
                type="text"
                name="address.city"
                className={`w-full p-2 border ${errors?.city ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={data.address.city}
                onChange={handleChange}
              />
              {errors?.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kod pocztowy *
              </label>
              <input
                type="text"
                name="address.postCode"
                className={`w-full p-2 border ${errors?.postCode ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={data.address.postCode}
                onChange={handleChange}
                placeholder="XX-XXX"
              />
              {errors?.postCode && (
                <p className="mt-1 text-sm text-red-500">{errors.postCode}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 