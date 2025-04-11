"use client"

import React, { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';

interface InsuredPersonsFormProps {
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

  const handleRoleSelection = (role: 'insured' | 'vehicleOwner', selection: 'policyHolder' | 'other') => {
    const updatedData = { ...data };
    
    if (selection === 'policyHolder') {
      updatedData[role] = {
        inheritFrom: 'policyHolder',
        personData: undefined
      };
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
          <span className="text-[#FF8E3D] font-bold">4</span>
        </div>
        Osoby w polisie
      </h2>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
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
    </div>
  );
};

// Funkcja pomocnicza do konwersji danych do formatu wymaganego przez API
export const convertToApiFormat = (data: {
  policyHolder: PersonalData;
  insured: InsuredData;
  vehicleOwner: InsuredData;
}) => {
  return {
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
      insured: data.insured.inheritFrom === 'policyHolder' || data.insured.inheritFrom === 'customer'
        ? { inheritFrom: 'policyHolder' } // W API zawsze przekazujemy jako policyHolder
        : {
            type: data.insured.personData?.type || 'person',
            phoneNumber: data.insured.personData?.phoneNumber || '',
            firstName: data.insured.personData?.firstName || '',
            lastName: data.insured.personData?.lastName || '',
            email: data.insured.personData?.email || '',
            identificationNumber: data.insured.personData?.identificationNumber || '',
            companyName: data.insured.personData?.companyName,
            taxId: data.insured.personData?.taxId,
            address: data.insured.personData?.address || {
              addressLine1: '',
              street: '',
              city: '',
              postCode: '',
              countryCode: 'PL'
            }
          },
      // Beneficjent nie jest wyświetlany w UI, ale w API jest wymagany, więc ustawiamy go na ubezpieczającego
      beneficiary: { inheritFrom: 'policyHolder' }
    },
    vehicleSnapshot: {
      // ... inne pola pojazdu
      owners: [
        {
          contact: data.vehicleOwner.inheritFrom === 'policyHolder' || data.vehicleOwner.inheritFrom === 'customer'
            ? { inheritFrom: 'policyHolder' } // W API zawsze przekazujemy jako policyHolder
            : {
                type: data.vehicleOwner.personData?.type || 'person',
                phoneNumber: data.vehicleOwner.personData?.phoneNumber || '',
                firstName: data.vehicleOwner.personData?.firstName || '',
                lastName: data.vehicleOwner.personData?.lastName || '',
                email: data.vehicleOwner.personData?.email || '',
                identificationNumber: data.vehicleOwner.personData?.identificationNumber || '',
                companyName: data.vehicleOwner.personData?.companyName,
                taxId: data.vehicleOwner.personData?.taxId,
                address: data.vehicleOwner.personData?.address || {
                  addressLine1: '',
                  street: '',
                  city: '',
                  postCode: '',
                  countryCode: 'PL'
                }
              }
        }
      ]
    }
  };
}; 