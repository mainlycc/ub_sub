"use client"

import React, { useState } from 'react';
import { User, Mail, CreditCard, Building, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InsuredPersonsForm } from './InsuredPersonsForm';

interface PersonalData {
  type: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  identificationNumber: string;
  companyName?: string;
  taxId?: string;
  address: {
    addressLine1: string;
    street: string;
    city: string;
    postCode: string;
    countryCode: string;
  };
}

interface InsuredData {
  inheritFrom?: string;
  personData?: PersonalData;
}

interface CheckoutFinalFormProps {
  data: {
    policyHolder: PersonalData;
    insured: InsuredData;
    vehicleOwner: InsuredData;
    customer: PersonalData;
  };
  onChange: (data: {
    policyHolder: PersonalData;
    insured: InsuredData;
    vehicleOwner: InsuredData;
    customer: PersonalData;
  }) => void;
  onSaveOffer: () => void;
  onContinue: () => void;
  errors?: { [key: string]: string };
}

export const CheckoutFinalForm = ({ 
  data, 
  onChange, 
  onSaveOffer,
  onContinue,
  errors 
}: CheckoutFinalFormProps): React.ReactElement => {
  const [customerEntityType, setCustomerEntityType] = useState<'person' | 'company'>(
    data.customer.type === 'company' ? 'company' : 'person'
  );

  // Funkcja do aktualizacji danych klienta
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // Dodajemy prefix +48 tylko jeśli wprowadzono jakieś cyfry
      const finalPhone = formattedPhone ? `+48${formattedPhone}` : value;
      
      onChange({
        ...data,
        customer: {
          ...data.customer,
          phoneNumber: finalPhone,
        }
      });
      return;
    }
    
    // Formatowanie kodu pocztowego
    if (name === 'address.postCode') {
      let formattedPostCode = value.replace(/[^\d-]/g, '');
      
      // Automatyczne dodanie myślnika po dwóch cyfrach
      if (formattedPostCode.length === 2 && !value.includes('-')) {
        formattedPostCode = formattedPostCode + '-';
      }
      else if (formattedPostCode.length > 2 && !formattedPostCode.includes('-')) {
        formattedPostCode = formattedPostCode.slice(0, 2) + '-' + formattedPostCode.slice(2);
      }
      
      // Ograniczenie do formatu XX-XXX
      if (formattedPostCode.includes('-')) {
        const [prefix, suffix] = formattedPostCode.split('-');
        formattedPostCode = prefix.slice(0, 2) + '-' + (suffix ? suffix.slice(0, 3) : '');
      }
      
      onChange({
        ...data,
        customer: {
          ...data.customer,
          address: {
            ...data.customer.address,
            postCode: formattedPostCode,
            countryCode: 'PL'
          }
        }
      });
      return;
    }

    // Formatowanie PESEL
    if (name === 'identificationNumber') {
      const formattedPesel = value.replace(/\D/g, '').slice(0, 11);
      onChange({
        ...data,
        customer: {
          ...data.customer,
          identificationNumber: formattedPesel,
          type: 'person',
          address: {
            ...data.customer.address,
            countryCode: 'PL'
          }
        }
      });
      return;
    }
    
    // Formatowanie adresu
    if (name === 'address.street') {
      onChange({
        ...data,
        customer: {
          ...data.customer,
          address: {
            ...data.customer.address,
            street: value,
            countryCode: 'PL'
          }
        }
      });
      return;
    }
    
    // Obsługa pozostałych pól adresowych
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        onChange({
          ...data,
          customer: {
            ...data.customer,
            address: {
              ...data.customer.address,
              [child]: value,
              countryCode: 'PL'
            }
          }
        });
      }
    } else {
      // Obsługa pozostałych pól
      onChange({
        ...data,
        customer: {
          ...data.customer,
          [name]: value,
          type: customerEntityType
        }
      });
    }
  };

  // Obsługa zmiany typu podmiotu dla klienta
  const handleCustomerEntityTypeChange = (type: 'person' | 'company') => {
    setCustomerEntityType(type);
    
    onChange({
      ...data,
      customer: {
        ...data.customer,
        type: type
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#300FE6]/20 p-2 rounded-full mr-3">
          <span className="text-[#300FE6] font-bold">4</span>
        </div>
        Dane klienta
      </h2>
      
      {/* Dane klienta */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Dane klienta
        </h3>
        
        {/* Przełącznik typu podmiotu */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">Rodzaj podmiotu</p>
          <div className="grid grid-cols-2 gap-0 rounded-md overflow-hidden border border-gray-300 max-w-md">
            <button
              type="button"
              className={`py-3 px-6 text-center transition-colors ${
                customerEntityType === 'person' 
                  ? 'bg-[#300FE6] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleCustomerEntityTypeChange('person')}
            >
              Osoba prywatna
            </button>
            <button
              type="button"
              className={`py-3 px-6 text-center border-l border-gray-300 transition-colors ${
                customerEntityType === 'company' 
                  ? 'bg-[#300FE6] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleCustomerEntityTypeChange('company')}
            >
              Firma
            </button>
          </div>
        </div>
        
        {/* Dane firmowe (wyświetlane tylko gdy typ to firma) */}
        {customerEntityType === 'company' && (
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-3 flex items-center">
              <Building className="mr-2 text-[#300FE6]" size={20} />
              Dane firmy
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa firmy *
                </label>
                <input
                  type="text"
                  name="companyName"
                  className={`w-full p-2 border ${errors?.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  value={data.customer.companyName || ''}
                  onChange={handleCustomerChange}
                  required={customerEntityType === 'company'}
                />
                {errors?.companyName && (
                  <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIP *
                </label>
                <input
                  type="text"
                  name="taxId"
                  className={`w-full p-2 border ${errors?.taxId ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  value={data.customer.taxId || ''}
                  onChange={handleCustomerChange}
                  placeholder="np. 1234567890"
                  required={customerEntityType === 'company'}
                />
                {errors?.taxId && (
                  <p className="mt-1 text-sm text-red-500">{errors.taxId}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dane osobowe (wyświetlane tylko gdy typ to osoba prywatna) */}
        {customerEntityType === 'person' && (
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-3 flex items-center">
              <User className="mr-2 text-[#300FE6]" size={20} />
              Dane osobowe
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię *
                </label>
                <input
                  type="text"
                  name="firstName"
                  className={`w-full p-2 border ${errors?.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  value={data.customer.firstName}
                  onChange={handleCustomerChange}
                  required={customerEntityType === 'person'}
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
                  value={data.customer.lastName}
                  onChange={handleCustomerChange}
                  required={customerEntityType === 'person'}
                />
                {errors?.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Dane kontaktowe - dla obu typów */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3 flex items-center">
            <Mail className="mr-2 text-[#300FE6]" size={20} />
            Dane kontaktowe
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                className={`w-full p-2 border ${errors?.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={data.customer.email}
                onChange={handleCustomerChange}
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
                value={data.customer.phoneNumber}
                onChange={handleCustomerChange}
                placeholder="+48XXXXXXXXX"
                required
              />
              {errors?.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Dane identyfikacyjne (tylko dla osoby prywatnej) */}
        {customerEntityType === 'person' && (
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-3 flex items-center">
              <CreditCard className="mr-2 text-[#300FE6]" size={20} />
              Dane identyfikacyjne
            </h4>
            
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
                value={data.customer.identificationNumber}
                onChange={handleCustomerChange}
                required={customerEntityType === 'person'}
              />
              {errors?.identificationNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.identificationNumber}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Adres - dla obu typów */}
        <div>
          <h4 className="text-md font-semibold mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Adres {customerEntityType === 'company' ? 'firmy' : 'zamieszkania'}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ulica i numer *
              </label>
              <input
                type="text"
                name="address.street"
                className={`w-full p-2 border ${errors?.['address.street'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={data.customer.address.street}
                onChange={handleCustomerChange}
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
                  value={data.customer.address.city}
                  onChange={handleCustomerChange}
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
                  value={data.customer.address.postCode}
                  onChange={handleCustomerChange}
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
      
      {/* Komponent wyboru osób ubezpieczonych */}
      <InsuredPersonsForm 
        data={{
          policyHolder: data.policyHolder,
          insured: data.insured,
          vehicleOwner: data.vehicleOwner
        }}
        onChange={(newData) => {
          onChange({
            ...data,
            policyHolder: newData.policyHolder,
            insured: newData.insured,
            vehicleOwner: newData.vehicleOwner
          });
        }}
        errors={errors}
      />

      {/* Przyciski nawigacyjne */}
      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveOffer}
          className="bg-white hover:bg-gray-50 text-[#300FE6] px-6 py-2 rounded-md border border-[#300FE6]"
        >
          Zapisz ofertę
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          className="bg-[#300FE6] hover:bg-[#2a0dd0] text-white px-6 py-2 rounded-md flex items-center"
        >
          Dalej <ChevronRight size={18} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}; 