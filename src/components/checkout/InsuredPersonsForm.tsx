"use client"

import React, { useState } from 'react';
import { Check, X, ChevronDown, User, Building, UserCircle } from 'lucide-react';

interface InsuredPersonsFormProps {
  data: {
    policyHolder: PersonalData & { enabled?: boolean };
    insured: InsuredData;
    vehicleOwner: InsuredData;
  };
  onChange: (data: {
    policyHolder: PersonalData & { enabled?: boolean };
    insured: InsuredData;
    vehicleOwner: InsuredData;
  }) => void;
  errors?: { [key: string]: string };
}

interface PersonalData {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  type: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    postCode: string;
    countryCode: string;
    addressLine1: string;
  };
  companyName?: string;
  taxId?: string;
}

interface InsuredData {
  inheritFrom?: string;
  personData?: PersonalData;
  enabled?: boolean;
}

export const InsuredPersonsForm = ({ 
  data, 
  onChange 
}: InsuredPersonsFormProps): React.ReactElement => {
  const [showInsuredSelect, setShowInsuredSelect] = useState(false);
  const [showVehicleOwnerSelect, setShowVehicleOwnerSelect] = useState(false);

  const handlePersonToggle = (role: 'insured' | 'vehicleOwner') => {
    if (role === 'insured') {
      setShowInsuredSelect(!showInsuredSelect);
    } else {
      setShowVehicleOwnerSelect(!showVehicleOwnerSelect);
    }
  };

  // Funkcja do przełączania aktywności policyHolder
  const togglePolicyHolderEnabled = () => {
    const updatedData = { ...data };
    
    updatedData.policyHolder = {
      ...updatedData.policyHolder,
      enabled: updatedData.policyHolder.enabled === false ? true : false
    };
    
    console.log('Przełączono aktywność ubezpieczającego:', updatedData.policyHolder.enabled);
    onChange(updatedData);
  };

  // Funkcja do przełączania roli między policyHolder a inną osobą
  const toggleRoleInheritance = (role: 'insured' | 'vehicleOwner') => {
    const updatedData = { ...data };
    
    // Jeśli obecnie dziedziczy z policyHolder, zmień na "inna osoba"
    if (updatedData[role].inheritFrom === 'policyHolder') {
      updatedData[role] = {
        inheritFrom: undefined,
        enabled: true,
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
    } else {
      // W przeciwnym przypadku, ustaw dziedziczenie z policyHolder
      updatedData[role] = {
        inheritFrom: 'policyHolder',
        personData: undefined,
        enabled: true
      };
    }
    
    console.log(`Zmieniono źródło danych dla roli ${role}:`, updatedData[role]);
    
    onChange(updatedData);
  };

  const handleRoleSelection = (role: 'insured' | 'vehicleOwner', selection: 'policyHolder' | 'other') => {
    const updatedData = { ...data };
    
    if (selection === 'policyHolder') {
      updatedData[role] = {
        inheritFrom: 'policyHolder',
        personData: undefined,
        enabled: true
      };
    } else {
      // Jeśli wybrano "inna osoba", ale nie ma jeszcze danych, zainicjuj je pustymi wartościami
      if (!updatedData[role].personData) {
        updatedData[role] = {
          inheritFrom: undefined,
          enabled: true,
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
    }
    
    onChange(updatedData);
    
    // Zamknij dropdown po wyborze
    if (role === 'insured') {
      setShowInsuredSelect(false);
    } else {
      setShowVehicleOwnerSelect(false);
    }
  };

  // Obsługa zmiany danych osobowych dla konkretnej roli
  const handlePersonDataChange = (role: 'policyHolder' | 'insured' | 'vehicleOwner', field: string, value: string) => {
    const updatedData = { ...data };
    
    if (role === 'policyHolder') {
      // Dla ubezpieczającego
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'address') {
          updatedData.policyHolder.address = {
            ...updatedData.policyHolder.address,
            [child]: value
          };
        }
      } else {
        updatedData.policyHolder = {
          ...updatedData.policyHolder,
          [field]: value
        };
      }
    } else {
      // Dla innych ról (insured, vehicleOwner)
      if (!updatedData[role].personData) {
        updatedData[role].personData = {
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
        };
      }
      
      // Obsługa zagnieżdżonych pól adresu
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'address' && updatedData[role].personData) {
          updatedData[role].personData.address = {
            ...updatedData[role].personData.address,
            [child]: value
          };
        }
      } else {
        // Dla zwykłych pól
        if (updatedData[role].personData) {
          updatedData[role].personData = {
            ...updatedData[role].personData,
            [field]: value
          };
        }
      }
    }
    
    onChange(updatedData);
  };

  // Obsługa zmiany typu podmiotu
  const handleEntityTypeChange = (role: 'policyHolder' | 'insured' | 'vehicleOwner', type: 'person' | 'company') => {
    const updatedData = { ...data };
    
    if (role === 'policyHolder') {
      updatedData.policyHolder = {
        ...updatedData.policyHolder,
        type: type
      };
    } else if (updatedData[role].personData) {
      updatedData[role].personData = {
        ...updatedData[role].personData,
        type: type
      };
    }
    
    onChange(updatedData);
  };

  // Przygotuj dane do wyświetlenia w UI (kto jest kim)
  const getDisplayName = (role: 'insured' | 'vehicleOwner') => {
    if (data[role].inheritFrom === 'policyHolder') {
      return 'KLIENT (UBEZPIECZAJĄCY)';
    } else if (data[role].personData?.firstName) {
      return `${data[role].personData.firstName} ${data[role].personData.lastName}`;
    } else {
      return 'Inna osoba';
    }
  };

  // Sprawdzenie czy rola dziedziczy z policyHolder
  const isInheritingFromPolicyHolder = (role: 'insured' | 'vehicleOwner') => {
    return data[role].inheritFrom === 'policyHolder';
  };

  // Sprawdzenie czy ubezpieczający jest aktywny
  const isPolicyHolderEnabled = () => {
    return data.policyHolder.enabled !== false;
  };

  // Renderuje formularz danych osobowych dla danej roli
  const renderPersonForm = (role: 'policyHolder' | 'insured' | 'vehicleOwner') => {
    let personData: PersonalData;
    
    if (role === 'policyHolder') {
      personData = data.policyHolder;
    } else {
      personData = data[role].personData || {
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
      };
    }

    const entityType = personData.type === 'company' ? 'company' : 'person';

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="text-lg font-medium mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-[#300FE6]" />
          Dane osobowe
        </h4>
        
        {/* Wybór typu podmiotu */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Typ podmiotu</label>
          <div className="flex">
            <button
              type="button"
              onClick={() => handleEntityTypeChange(role, 'person')}
              className={`flex items-center px-4 py-2 rounded-l-md border ${
                entityType === 'person' 
                  ? 'bg-[#300FE6] text-white border-[#300FE6]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Osoba fizyczna
            </button>
            <button
              type="button"
              onClick={() => handleEntityTypeChange(role, 'company')}
              className={`flex items-center px-4 py-2 rounded-r-md border ${
                entityType === 'company' 
                  ? 'bg-[#300FE6] text-white border-[#300FE6]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Building className="h-4 w-4 mr-2" />
              Firma
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entityType === 'person' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię*
                </label>
                <input
                  type="text"
                  value={personData.firstName}
                  onChange={(e) => handlePersonDataChange(role, 'firstName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwisko*
                </label>
                <input
                  type="text"
                  value={personData.lastName}
                  onChange={(e) => handlePersonDataChange(role, 'lastName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PESEL*
                </label>
                <input
                  type="text"
                  value={personData.identificationNumber}
                  onChange={(e) => handlePersonDataChange(role, 'identificationNumber', e.target.value.replace(/[^\d]/g, '').slice(0, 11))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
                  maxLength={11}
                />
              </div>
            </>
          ) : (
            <>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa firmy*
                </label>
                <input
                  type="text"
                  value={personData.companyName || ''}
                  onChange={(e) => handlePersonDataChange(role, 'companyName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIP*
                </label>
                <input
                  type="text"
                  value={personData.taxId || ''}
                  onChange={(e) => handlePersonDataChange(role, 'taxId', e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  REGON
                </label>
                <input
                  type="text"
                  value={personData.identificationNumber}
                  onChange={(e) => handlePersonDataChange(role, 'identificationNumber', e.target.value.replace(/[^\d]/g, ''))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon*
            </label>
            <input
              type="tel"
              value={personData.phoneNumber}
              onChange={(e) => handlePersonDataChange(role, 'phoneNumber', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              value={personData.email}
              onChange={(e) => handlePersonDataChange(role, 'email', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ulica i numer*
            </label>
            <input
              type="text"
              value={personData.address.street}
              onChange={(e) => handlePersonDataChange(role, 'address.street', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kod pocztowy*
            </label>
            <input
              type="text"
              value={personData.address.postCode}
              onChange={(e) => {
                let value = e.target.value.replace(/[^\d-]/g, '');
                // Automatyczne dodanie myślnika po dwóch cyfrach
                if (value.length === 2 && !value.includes('-')) {
                  value = value + '-';
                }
                handlePersonDataChange(role, 'address.postCode', value);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
              maxLength={6}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miasto*
            </label>
            <input
              type="text"
              value={personData.address.city}
              onChange={(e) => handlePersonDataChange(role, 'address.city', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">4</span>
        </div>
        Osoby w polisie
      </h2>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
        {/* Ubezpieczający */}
        <div className="relative">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="policyHolderEnabled"
                checked={isPolicyHolderEnabled()}
                onChange={togglePolicyHolderEnabled}
                className="w-5 h-5 rounded text-[#300FE6] border-gray-300 focus:ring-[#300FE6] mr-4"
              />
              <label htmlFor="policyHolderEnabled" className="font-medium">
                UBEZPIECZAJĄCY
              </label>
            </div>
            <div className="text-gray-700">
              <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                KLIENT (UBEZPIECZAJĄCY)
              </span>
            </div>
          </div>
          
          {/* Formularz danych dla ubezpieczającego - pokazywany gdy nie jest aktywny */}
          {!isPolicyHolderEnabled() && renderPersonForm('policyHolder')}
        </div>
        
        {/* Ubezpieczony */}
        <div className="relative">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="insuredEnabled"
                checked={isInheritingFromPolicyHolder('insured')}
                onChange={() => toggleRoleInheritance('insured')}
                className="w-5 h-5 rounded text-[#300FE6] border-gray-300 focus:ring-[#300FE6] mr-4"
              />
              <label htmlFor="insuredEnabled" className="font-medium">
                UBEZPIECZONY
                <span className="text-sm ml-1 text-gray-500">jak</span>
              </label>
            </div>
            <div className="text-gray-700">
              <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                {getDisplayName('insured')}
              </span>
            </div>
          </div>
          
          {/* Formularz danych dla ubezpieczonego - pokazywany gdy nie dziedziczy z policyHolder */}
          {!isInheritingFromPolicyHolder('insured') && renderPersonForm('insured')}
        </div>
        
        {/* Właściciel pojazdu */}
        <div className="relative">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="vehicleOwnerEnabled"
                checked={isInheritingFromPolicyHolder('vehicleOwner')}
                onChange={() => toggleRoleInheritance('vehicleOwner')}
                className="w-5 h-5 rounded text-[#300FE6] border-gray-300 focus:ring-[#300FE6] mr-4"
              />
              <label htmlFor="vehicleOwnerEnabled" className="font-medium">
                WŁAŚCICIEL POJAZDU
                <span className="text-sm ml-1 text-gray-500">jak</span>
              </label>
            </div>
            <div className="text-gray-700">
              <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                {getDisplayName('vehicleOwner')}
              </span>
            </div>
          </div>
          
          {/* Formularz danych dla właściciela pojazdu - pokazywany gdy nie dziedziczy z policyHolder */}
          {!isInheritingFromPolicyHolder('vehicleOwner') && renderPersonForm('vehicleOwner')}
        </div>
      </div>
    </div>
  );
};

// Funkcja pomocnicza do konwersji danych do formatu wymaganego przez API
export const convertToApiFormat = (data: {
  policyHolder: PersonalData & { enabled?: boolean };
  insured: InsuredData;
  vehicleOwner: InsuredData;
}) => {
  // Uwzględniamy enabled dla policyHolder
  const isPolicyHolderEnabled = data.policyHolder.enabled !== false;
  
  // Jeśli policyHolder nie jest aktywny, to zwracamy pusty obiekt (lub można określić domyślne zachowanie)
  if (!isPolicyHolderEnabled) {
    console.log('Ubezpieczający nie jest aktywny - zwracam pusty obiekt API');
    return {};
  }

  const apiData: any = {
    client: {
      policyHolder: {
        type: data.policyHolder.type,
        phoneNumber: data.policyHolder.phoneNumber,
        firstName: data.policyHolder.firstName,
        lastName: data.policyHolder.lastName,
        email: data.policyHolder.email,
        identificationNumber: data.policyHolder.identificationNumber,
        companyName: data.policyHolder.companyName,
        taxId: data.policyHolder.taxId,
        address: {
          addressLine1: data.policyHolder.address.addressLine1 || data.policyHolder.address.street,
          street: data.policyHolder.address.street,
          city: data.policyHolder.address.city,
          postCode: data.policyHolder.address.postCode,
          countryCode: data.policyHolder.address.countryCode
        }
      },
      // Dane ubezpieczonego
      insured: data.insured.inheritFrom === 'policyHolder'
        ? { inheritFrom: 'policyHolder' } // W API zawsze przekazujemy jako policyHolder
        : data.insured.personData 
          ? {
              type: data.insured.personData.type || 'person',
              phoneNumber: data.insured.personData.phoneNumber || '',
              firstName: data.insured.personData.firstName || '',
              lastName: data.insured.personData.lastName || '',
              email: data.insured.personData.email || '',
              identificationNumber: data.insured.personData.identificationNumber || '',
              companyName: data.insured.personData.companyName,
              taxId: data.insured.personData.taxId,
              address: data.insured.personData.address || {
                addressLine1: '',
                street: '',
                city: '',
                postCode: '',
                countryCode: 'PL'
              }
            }
          : { inheritFrom: 'policyHolder' }, // Domyślnie ustaw na policyHolder, gdy brak danych
      
      // Beneficjent nie jest wyświetlany w UI, ale w API jest wymagany, więc ustawiamy go na ubezpieczającego
      beneficiary: { inheritFrom: 'policyHolder' }
    },
    vehicleSnapshot: {
      // ... inne pola pojazdu będą dodane przy wysyłce
      owners: [
        {
          contact: data.vehicleOwner.inheritFrom === 'policyHolder'
            ? { inheritFrom: 'policyHolder' } // W API zawsze przekazujemy jako policyHolder
            : data.vehicleOwner.personData
              ? {
                  type: data.vehicleOwner.personData.type || 'person',
                  phoneNumber: data.vehicleOwner.personData.phoneNumber || '',
                  firstName: data.vehicleOwner.personData.firstName || '',
                  lastName: data.vehicleOwner.personData.lastName || '',
                  email: data.vehicleOwner.personData.email || '',
                  identificationNumber: data.vehicleOwner.personData.identificationNumber || '',
                  companyName: data.vehicleOwner.personData.companyName,
                  taxId: data.vehicleOwner.personData.taxId,
                  address: data.vehicleOwner.personData.address || {
                    addressLine1: '',
                    street: '',
                    city: '',
                    postCode: '',
                    countryCode: 'PL'
                  }
                }
              : { inheritFrom: 'policyHolder' } // Domyślnie ustaw na policyHolder, gdy brak danych
        }
      ]
    }
  };
  
  return apiData;
}; 