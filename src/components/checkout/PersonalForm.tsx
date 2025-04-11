"use client"

import React, { useState } from 'react';
import { User, Mail, CreditCard, Check, X, ChevronDown } from 'lucide-react';

interface PersonalFormProps {
  data: {
    policyHolder: PersonalData;
    insured: InsuredData;
    vehicleOwner: InsuredData;
  };
  onChange: (data: {
    policyHolder: PersonalData;
    insured: InsuredData;
    vehicleOwner: InsuredData;
  }) => void;
  errors?: { [key: string]: string };
}

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

type AddressData = PersonalData['address'];
type AddressField = keyof AddressData;

export const PersonalForm = ({ data, onChange, errors }: PersonalFormProps): React.ReactElement => {
  const [entityType, setEntityType] = React.useState<'person' | 'company'>(data.policyHolder.type === 'company' ? 'company' : 'person');
  const [showInsuredSelect, setShowInsuredSelect] = useState(false);
  const [showVehicleOwnerSelect, setShowVehicleOwnerSelect] = useState(false);
  const [showVehicleOwnerForm, setShowVehicleOwnerForm] = useState(data.vehicleOwner.inheritFrom !== 'policyHolder');
  const [showInsuredForm, setShowInsuredForm] = useState(data.insured.inheritFrom !== 'policyHolder');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        policyHolder: {
          ...data.policyHolder,
          phoneNumber: finalPhone,
        }
      });
      return;
    }
    
    // Formatowanie kodu pocztowego
    if (name === 'address.postCode') {
      let formattedPostCode = value.replace(/[^\d-]/g, '');
      
      // Automatyczne dodanie myślnika po dwóch cyfrach, jeśli go nie ma
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
        policyHolder: {
          ...data.policyHolder,
          address: {
            ...data.policyHolder.address,
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
        policyHolder: {
          ...data.policyHolder,
          identificationNumber: formattedPesel,
          type: 'person',
          address: {
            ...data.policyHolder.address,
            countryCode: 'PL'
          }
        }
      });
      return;
    }
    
    // Formatowanie adresu - nie wymuszamy numeru jeśli użytkownik go nie podał
    if (name === 'address.street') {
      onChange({
        ...data,
        policyHolder: {
          ...data.policyHolder,
          address: {
            ...data.policyHolder.address,
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
      if (parent === 'address' && isAddressField(child)) {
        onChange({
          ...data,
          policyHolder: {
            ...data.policyHolder,
            address: {
              ...data.policyHolder.address,
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
        policyHolder: {
          ...data.policyHolder,
          [name]: value,
          type: entityType // Ustawienie typu na podstawie wybranego entityType
        }
      });
    }
  };

  // Analogiczna funkcja dla pól insured
  const handleInsuredChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const updatedInsured = { ...data.insured };
    if (!updatedInsured.personData) {
      updatedInsured.personData = {
        firstName: '',
        lastName: '',
        identificationNumber: '',
        type: 'person',
        phoneNumber: '',
        email: '',
        address: {
          addressLine1: '',
          street: '',
          city: '',
          postCode: '',
          countryCode: 'PL'
        }
      };
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address' && child in updatedInsured.personData.address) {
        updatedInsured.personData.address[child as keyof AddressData] = value;
      }
    } else {
      updatedInsured.personData[name as keyof PersonalData] = value;
    }
    
    onChange({
      ...data,
      insured: updatedInsured
    });
  };

  // Analogiczna funkcja dla pól vehicleOwner
  const handleVehicleOwnerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const updatedVehicleOwner = { ...data.vehicleOwner };
    if (!updatedVehicleOwner.personData) {
      updatedVehicleOwner.personData = {
        firstName: '',
        lastName: '',
        identificationNumber: '',
        type: 'person',
        phoneNumber: '',
        email: '',
        address: {
          addressLine1: '',
          street: '',
          city: '',
          postCode: '',
          countryCode: 'PL'
        }
      };
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address' && child in updatedVehicleOwner.personData.address) {
        updatedVehicleOwner.personData.address[child as keyof AddressData] = value;
      }
    } else {
      updatedVehicleOwner.personData[name as keyof PersonalData] = value;
    }
    
    onChange({
      ...data,
      vehicleOwner: updatedVehicleOwner
    });
  };

  const isAddressField = (field: string): field is AddressField => {
    return field in data.policyHolder.address;
  };

  // Obsługa zmiany typu podmiotu
  const handleEntityTypeChange = (type: 'person' | 'company') => {
    setEntityType(type);
    
    // Aktualizacja danych z odpowiednim typem
    onChange({
      ...data,
      policyHolder: {
        ...data.policyHolder,
        type: type
      }
    });
  };

  const handlePersonToggle = (role: 'insured' | 'vehicleOwner') => {
    if (role === 'insured') {
      setShowInsuredSelect(!showInsuredSelect);
    } else {
      setShowVehicleOwnerSelect(!showVehicleOwnerSelect);
    }
  };

  const handleRoleSelection = (role: 'insured' | 'vehicleOwner', selection: 'policyHolder' | 'other') => {
    const updatedData = { ...data };
    
    if (selection === 'policyHolder') {
      updatedData[role] = {
        inheritFrom: 'policyHolder',
        personData: undefined
      };
      if (role === 'insured') {
        setShowInsuredForm(false);
      } else {
        setShowVehicleOwnerForm(false);
      }
    } else {
      // Jeśli wybrano "inna osoba", ale nie ma jeszcze danych, zainicjuj je pustymi wartościami
      if (!updatedData[role].personData) {
        updatedData[role] = {
          inheritFrom: undefined,
          personData: {
            firstName: '',
            lastName: '',
            identificationNumber: '',
            type: 'person',
            phoneNumber: '',
            email: '',
            address: {
              street: '',
              city: '',
              postCode: '',
              countryCode: 'PL',
              addressLine1: ''
            }
          }
        };
      }
      if (role === 'insured') {
        setShowInsuredForm(true);
      } else {
        setShowVehicleOwnerForm(true);
      }
    }
    
    onChange(updatedData);
    
    // Zamknij dropdown po wyborze
    if (role === 'insured') {
      setShowInsuredSelect(false);
    } else {
      setShowVehicleOwnerSelect(false);
    }
  };

  // Przygotuj dane do wyświetlenia w UI (kto jest kim)
  const getDisplayName = (role: 'insured' | 'vehicleOwner') => {
    if (data[role].inheritFrom === 'policyHolder') {
      return 'KLIENT (UBEZPIECZAJĄCY)';
    } else if (data[role].personData?.firstName) {
      return `${data[role].personData.firstName} ${data[role].personData.lastName}`;
    } else {
      return 'Wybierz osobę';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">3</span>
        </div>
        Twoje dane
      </h2>
      
      {/* Sekcja wyboru osób */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Osoby w polisie
        </h3>
        
        {/* Ubezpieczający */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-[#300FE6] text-white rounded-md flex items-center justify-center mr-4">
              <Check className="w-4 h-4" />
            </div>
            <span className="font-medium">UBEZPIECZAJĄCY</span>
          </div>
          <div className="text-gray-700">
            <span className="bg-gray-100 px-3 py-1 rounded text-sm">
              KLIENT (UBEZPIECZAJĄCY)
            </span>
          </div>
        </div>
        
        {/* Ubezpieczony */}
        <div className="relative">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-[#300FE6] text-white rounded-md flex items-center justify-center mr-4">
                <Check className="w-4 h-4" />
              </div>
              <span className="font-medium">UBEZPIECZONY</span>
              <span className="text-gray-500 text-sm ml-1">jak</span>
            </div>
            <button 
              className="flex items-center bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#300FE6]/50"
              onClick={() => handlePersonToggle('insured')}
            >
              {getDisplayName('insured')}
              {data.insured.inheritFrom === 'policyHolder' && (
                <X className="w-4 h-4 ml-2 text-gray-500" />
              )}
              <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
            </button>
          </div>
          
          {/* Dropdown dla ubezpieczonego */}
          {showInsuredSelect && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-2">
                <button 
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => handleRoleSelection('insured', 'policyHolder')}
                >
                  KLIENT (UBEZPIECZAJĄCY)
                </button>
                <button 
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => handleRoleSelection('insured', 'other')}
                >
                  Inna osoba
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Właściciel pojazdu */}
        <div className="relative">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-[#300FE6] text-white rounded-md flex items-center justify-center mr-4">
                <Check className="w-4 h-4" />
              </div>
              <span className="font-medium">WŁAŚCICIEL POJAZDU</span>
              <span className="text-gray-500 text-sm ml-1">jak</span>
            </div>
            <button 
              className="flex items-center bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#300FE6]/50"
              onClick={() => handlePersonToggle('vehicleOwner')}
            >
              {getDisplayName('vehicleOwner')}
              {data.vehicleOwner.inheritFrom === 'policyHolder' && (
                <X className="w-4 h-4 ml-2 text-gray-500" />
              )}
              <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
            </button>
          </div>
          
          {/* Dropdown dla właściciela pojazdu */}
          {showVehicleOwnerSelect && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-2">
                <button 
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => handleRoleSelection('vehicleOwner', 'policyHolder')}
                >
                  KLIENT (UBEZPIECZAJĄCY)
                </button>
                <button 
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => handleRoleSelection('vehicleOwner', 'other')}
                >
                  Inna osoba
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Przełącznik typu podmiotu dla ubezpieczającego */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Dane ubezpieczającego - Rodzaj podmiotu
        </h3>
        
        <div className="grid grid-cols-2 gap-0 rounded-md overflow-hidden border border-gray-300 max-w-md">
          <button
            type="button"
            className={`py-3 px-6 text-center transition-colors ${
              entityType === 'person' 
                ? 'bg-[#300FE6] text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleEntityTypeChange('person')}
          >
            Osoba prywatna
          </button>
          <button
            type="button"
            className={`py-3 px-6 text-center border-l border-gray-300 transition-colors ${
              entityType === 'company' 
                ? 'bg-[#300FE6] text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleEntityTypeChange('company')}
          >
            Firma
          </button>
        </div>
      </div>
      
      {/* Dane firmowe dla ubezpieczającego (wyświetlane tylko gdy typ to firma) */}
      {entityType === 'company' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="mr-2 text-[#300FE6]" size={20} />
            Dane firmy ubezpieczającego
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwa firmy *
              </label>
              <input
                type="text"
                name="companyName"
                className={`w-full p-2 border ${errors?.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={data.policyHolder.companyName || ''}
                onChange={handleChange}
                required={entityType === 'company'}
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
                value={data.policyHolder.taxId || ''}
                onChange={handleChange}
                placeholder="np. 1234567890"
                required={entityType === 'company'}
              />
              {errors?.taxId && (
                <p className="mt-1 text-sm text-red-500">{errors.taxId}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dane osobowe dla ubezpieczającego (wyświetlane tylko gdy typ to osoba prywatna) */}
      {entityType === 'person' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="mr-2 text-[#300FE6]" size={20} />
            Dane osobowe ubezpieczającego
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
                value={data.policyHolder.firstName}
                onChange={handleChange}
                required={entityType === 'person'}
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
                value={data.policyHolder.lastName}
                onChange={handleChange}
                required={entityType === 'person'}
              />
              {errors?.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Dane kontaktowe dla ubezpieczającego - dla obu typów */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Mail className="mr-2 text-[#300FE6]" size={20} />
          Dane kontaktowe ubezpieczającego
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
              value={data.policyHolder.email}
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
              value={data.policyHolder.phoneNumber}
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
      
      {/* Dane identyfikacyjne dla ubezpieczającego (tylko dla osoby prywatnej) */}
      {entityType === 'person' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CreditCard className="mr-2 text-[#300FE6]" size={20} />
            Dane identyfikacyjne ubezpieczającego
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
              value={data.policyHolder.identificationNumber}
              onChange={handleChange}
              required={entityType === 'person'}
            />
            {errors?.identificationNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.identificationNumber}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Adres dla ubezpieczającego - dla obu typów */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Adres {entityType === 'company' ? 'firmy' : 'zamieszkania'} ubezpieczającego
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
              value={data.policyHolder.address.street}
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
                value={data.policyHolder.address.city}
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
                value={data.policyHolder.address.postCode}
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

      {/* Formularz dla Ubezpieczonego gdy wybrano inną osobę */}
      {showInsuredForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="mr-2 text-[#300FE6]" size={20} />
            Dane ubezpieczonego
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imię *
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.insured.personData?.firstName || ''}
                onChange={handleInsuredChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwisko *
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.insured.personData?.lastName || ''}
                onChange={handleInsuredChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PESEL *
              </label>
              <input
                type="text"
                name="identificationNumber"
                maxLength={11}
                minLength={11}
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.insured.personData?.identificationNumber || ''}
                onChange={handleInsuredChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.insured.personData?.phoneNumber || ''}
                onChange={handleInsuredChange}
                placeholder="+48XXXXXXXXX"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={data.insured.personData?.email || ''}
              onChange={handleInsuredChange}
              placeholder="np. jan.kowalski@example.com"
            />
          </div>
          
          <h4 className="text-md font-semibold mb-3">Adres zamieszkania</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ulica i numer *
            </label>
            <input
              type="text"
              name="address.street"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={data.insured.personData?.address.street || ''}
              onChange={handleInsuredChange}
              placeholder="np. Marszałkowska 1"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miasto *
              </label>
              <input
                type="text"
                name="address.city"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.insured.personData?.address.city || ''}
                onChange={handleInsuredChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kod pocztowy *
              </label>
              <input
                type="text"
                name="address.postCode"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.insured.personData?.address.postCode || ''}
                onChange={handleInsuredChange}
                placeholder="XX-XXX"
                required
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Formularz dla Właściciela pojazdu gdy wybrano inną osobę */}
      {showVehicleOwnerForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="mr-2 text-[#300FE6]" size={20} />
            Dane właściciela pojazdu
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imię *
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.vehicleOwner.personData?.firstName || ''}
                onChange={handleVehicleOwnerChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwisko *
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.vehicleOwner.personData?.lastName || ''}
                onChange={handleVehicleOwnerChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PESEL *
              </label>
              <input
                type="text"
                name="identificationNumber"
                maxLength={11}
                minLength={11}
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.vehicleOwner.personData?.identificationNumber || ''}
                onChange={handleVehicleOwnerChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.vehicleOwner.personData?.phoneNumber || ''}
                onChange={handleVehicleOwnerChange}
                placeholder="+48XXXXXXXXX"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={data.vehicleOwner.personData?.email || ''}
              onChange={handleVehicleOwnerChange}
              placeholder="np. jan.kowalski@example.com"
            />
          </div>
          
          <h4 className="text-md font-semibold mb-3">Adres zamieszkania</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ulica i numer *
            </label>
            <input
              type="text"
              name="address.street"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={data.vehicleOwner.personData?.address.street || ''}
              onChange={handleVehicleOwnerChange}
              placeholder="np. Marszałkowska 1"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miasto *
              </label>
              <input
                type="text"
                name="address.city"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.vehicleOwner.personData?.address.city || ''}
                onChange={handleVehicleOwnerChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kod pocztowy *
              </label>
              <input
                type="text"
                name="address.postCode"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={data.vehicleOwner.personData?.address.postCode || ''}
                onChange={handleVehicleOwnerChange}
                placeholder="XX-XXX"
                required
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};