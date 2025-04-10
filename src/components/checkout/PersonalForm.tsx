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
    
    // Formatowanie numeru telefonu
    if (name === 'phoneNumber') {
      let formattedPhone = value.replace(/\D/g, '');
      // Usuwamy prefix +48 jeśli istnieje
      if (formattedPhone.startsWith('48')) {
        formattedPhone = formattedPhone.substring(2);
      }
      // Ograniczamy do 9 cyfr
      formattedPhone = formattedPhone.slice(0, 9);
      // Dodajemy prefix +48
      const finalPhone = formattedPhone ? `+48${formattedPhone}` : '';
      
      onChange({
        ...data,
        phoneNumber: finalPhone,
        type: 'person'
      });
      return;
    }
    
    // Formatowanie kodu pocztowego
    if (name === 'address.postCode') {
      let formattedPostCode = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d{0,3}).*/, '$1-$2')
        .slice(0, 6);
      
      // Upewnij się, że kod pocztowy ma format XX-XXX
      if (formattedPostCode.length === 3 && !formattedPostCode.includes('-')) {
        formattedPostCode = formattedPostCode.slice(0, 2) + '-' + formattedPostCode.slice(2);
      }
      
      onChange({
        ...data,
        address: {
          ...data.address,
          postCode: formattedPostCode,
          countryCode: 'PL',
          addressLine1: data.address.addressLine1 || `${data.firstName} ${data.lastName}`.trim()
        }
      });
      return;
    }

    // Formatowanie PESEL
    if (name === 'identificationNumber') {
      const formattedPesel = value.replace(/\D/g, '').slice(0, 11);
      onChange({
        ...data,
        identificationNumber: formattedPesel,
        type: 'person',
        address: {
          ...data.address,
          countryCode: 'PL',
          addressLine1: data.address.addressLine1 || `${data.firstName} ${data.lastName}`.trim()
        }
      });
      return;
    }
    
    // Formatowanie adresu
    if (name === 'address.street') {
      let street = value.trim();
      
      // Sprawdzamy, czy adres zawiera numer
      if (!street.match(/\d+$/)) {
        // Jeśli nie ma numeru, dodajemy go na końcu
        street = street.replace(/,?\s*$/, ', 1');
      }
      
      // Ustal addressLine1 jako numer domu
      const addressLine1 = street.split(',').length > 1 
        ? street.split(',')[1].trim() 
        : street.match(/\d+$/) 
          ? (street.match(/\d+$/) || ['1'])[0] 
          : '1';
      
      onChange({
        ...data,
        address: {
          ...data.address,
          street: street,
          countryCode: 'PL',
          addressLine1: addressLine1
        }
      });
      return;
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address' && isAddressField(child)) {
        // Upewnij się, że addressLine1 jest zawsze ustawiony
        let addressLine1 = data.address.addressLine1;
        
        if (!addressLine1) {
          if (data.address.street && data.address.street.match(/\d+$/)) {
            const matches = data.address.street.match(/\d+$/);
            addressLine1 = matches ? matches[0] : `${data.firstName} ${data.lastName}`.trim();
          } else {
            addressLine1 = `${data.firstName} ${data.lastName}`.trim();
          }
        }
        
        onChange({
          ...data,
          address: {
            ...data.address,
            [child]: value,
            countryCode: 'PL',
            addressLine1: addressLine1
          }
        });
      }
    } else {
      // Upewnij się, że addressLine1 jest zawsze ustawiony
      let addressLine1 = data.address.addressLine1;
      
      if (!addressLine1) {
        if (data.address.street && data.address.street.match(/\d+$/)) {
          const matches = data.address.street.match(/\d+$/);
          addressLine1 = matches ? matches[0] : `${name === 'firstName' ? value : data.firstName} ${name === 'lastName' ? value : data.lastName}`.trim();
        } else {
          addressLine1 = `${name === 'firstName' ? value : data.firstName} ${name === 'lastName' ? value : data.lastName}`.trim();
        }
      }
      
      const newData = {
        ...data,
        [name]: value,
        type: 'person',
        address: {
          ...data.address,
          addressLine1: addressLine1,
          countryCode: 'PL'
        }
      };
      
      onChange(newData);
    }
  };

  const isAddressField = (field: string): field is AddressField => {
    return field in data.address;
  };

  // Walidacja przy inicjalizacji i zmianie danych
  React.useEffect(() => {
    const initialData = {
      ...data,
      type: 'person',
      address: {
        ...data.address,
        countryCode: 'PL',
        addressLine1: `${data.firstName} ${data.lastName}`.trim()
      }
    };

    // Upewniamy się, że numer telefonu ma prefix +48
    if (initialData.phoneNumber && !initialData.phoneNumber.startsWith('+48')) {
      initialData.phoneNumber = '+48' + initialData.phoneNumber.replace(/\D/g, '');
    }

    // Upewniamy się, że adres ma numer domu
    if (initialData.address.street && !initialData.address.street.match(/\d+$/)) {
      initialData.address.street = initialData.address.street.replace(/,?\s*$/, ', 1');
    }

    onChange(initialData);
  }, []);

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
              required
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
              required
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
              required
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
              required
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
            minLength={11}
            className={`w-full p-2 border ${errors?.identificationNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={data.identificationNumber}
            onChange={handleChange}
            required
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
              className={`w-full p-2 border ${errors?.['address.street'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              value={data.address.street}
              onChange={handleChange}
              placeholder="np. Marszałkowska 1"
              required
            />
            {errors?.['address.street'] && (
              <p className="mt-1 text-sm text-red-500">{errors['address.street']}</p>
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
                className={`w-full p-2 border ${errors?.['address.city'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={data.address.city}
                onChange={handleChange}
                required
              />
              {errors?.['address.city'] && (
                <p className="mt-1 text-sm text-red-500">{errors['address.city']}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kod pocztowy *
              </label>
              <input
                type="text"
                name="address.postCode"
                className={`w-full p-2 border ${errors?.['address.postCode'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={data.address.postCode}
                onChange={handleChange}
                placeholder="XX-XXX"
                required
                pattern="[0-9]{2}-[0-9]{3}"
              />
              {errors?.['address.postCode'] && (
                <p className="mt-1 text-sm text-red-500">{errors['address.postCode']}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};