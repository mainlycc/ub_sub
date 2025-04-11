"use client"

import React, { useState } from 'react';
import { User, Mail, CreditCard, Building, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isPolicyHolder, setIsPolicyHolder] = useState(true);
  const [isInsured, setIsInsured] = useState(true);
  const [isVehicleOwner, setIsVehicleOwner] = useState(true);
  const [policyHolderEntityType, setPolicyHolderEntityType] = useState<'person' | 'company'>(
    data.policyHolder.type === 'company' ? 'company' : 'person'
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

  // Obsługa zaznaczenia/odznaczenia opcji "Klient jest ubezpieczającym"
  const handleIsPolicyHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsPolicyHolder = e.target.checked;
    setIsPolicyHolder(newIsPolicyHolder);
    
    if (newIsPolicyHolder) {
      // Jeśli zaznaczono, że klient jest ubezpieczającym, kopiujemy dane klienta
      onChange({
        ...data,
        policyHolder: { ...data.customer }
      });
    } else {
      // Jeśli odznaczono, inicjalizujemy dane ubezpieczającego
      onChange({
        ...data,
        policyHolder: {
          type: policyHolderEntityType,
          phoneNumber: "",
          firstName: "",
          lastName: "",
          email: "",
          identificationNumber: "",
          address: {
            addressLine1: "",
            street: "",
            city: "",
            postCode: "",
            countryCode: "PL"
          }
        }
      });
    }
  };

  // Obsługa zaznaczenia/odznaczenia opcji "Klient jest ubezpieczonym"
  const handleIsInsuredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsInsured = e.target.checked;
    setIsInsured(newIsInsured);
    
    if (newIsInsured) {
      // Jeśli zaznaczono, klient jest ubezpieczonym
      onChange({
        ...data,
        insured: {
          inheritFrom: 'customer',
          personData: undefined
        }
      });
    } else {
      // Jeśli odznaczono, inicjalizujemy dane ubezpieczonego
      onChange({
        ...data,
        insured: {
          inheritFrom: undefined,
          personData: {
            type: "person",
            phoneNumber: "",
            firstName: "",
            lastName: "",
            email: "",
            identificationNumber: "",
            address: {
              addressLine1: "",
              street: "",
              city: "",
              postCode: "",
              countryCode: "PL"
            }
          }
        }
      });
    }
  };

  // Obsługa zaznaczenia/odznaczenia opcji "Klient jest właścicielem pojazdu"
  const handleIsVehicleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsVehicleOwner = e.target.checked;
    setIsVehicleOwner(newIsVehicleOwner);
    
    if (newIsVehicleOwner) {
      // Jeśli zaznaczono, klient jest właścicielem pojazdu
      onChange({
        ...data,
        vehicleOwner: {
          inheritFrom: 'customer',
          personData: undefined
        }
      });
    } else {
      // Jeśli odznaczono, inicjalizujemy dane właściciela pojazdu
      onChange({
        ...data,
        vehicleOwner: {
          inheritFrom: undefined,
          personData: {
            type: "person",
            phoneNumber: "",
            firstName: "",
            lastName: "",
            email: "",
            identificationNumber: "",
            address: {
              addressLine1: "",
              street: "",
              city: "",
              postCode: "",
              countryCode: "PL"
            }
          }
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">5</span>
        </div>
        Wypełnij dane
      </h2>
      
      {/* Dane klienta - sekcja zawsze widoczna */}
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
      
      {/* Sekcja określająca role klienta */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Role klienta w polisie
        </h3>
        
        {/* Checkbox "Klient jest ubezpieczającym" */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="isPolicyHolder"
              checked={isPolicyHolder}
              onChange={handleIsPolicyHolderChange}
              className="w-5 h-5 text-[#300FE6] border-gray-300 rounded focus:ring-[#300FE6] focus:ring-offset-0 focus:ring-1 cursor-pointer"
            />
            <label htmlFor="isPolicyHolder" className="ml-2 text-sm font-medium text-gray-700">
              Klient jest ubezpieczającym
            </label>
          </div>
          
          {/* Formularz dla ubezpieczającego - rozwija się bezpośrednio pod checkboxem */}
          {!isPolicyHolder && (
            <div className="ml-6 mt-3 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="text-md font-semibold mb-3">
                Dane ubezpieczającego
              </h4>
              
              {/* Przełącznik typu podmiotu dla ubezpieczającego */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Rodzaj podmiotu</p>
                <div className="grid grid-cols-2 gap-0 rounded-md overflow-hidden border border-gray-300 max-w-md">
                  <button
                    type="button"
                    className={`py-3 px-6 text-center transition-colors ${
                      policyHolderEntityType === 'person' 
                        ? 'bg-[#300FE6] text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setPolicyHolderEntityType('person');
                      onChange({
                        ...data,
                        policyHolder: {
                          ...data.policyHolder,
                          type: 'person'
                        }
                      });
                    }}
                  >
                    Osoba prywatna
                  </button>
                  <button
                    type="button"
                    className={`py-3 px-6 text-center border-l border-gray-300 transition-colors ${
                      policyHolderEntityType === 'company' 
                        ? 'bg-[#300FE6] text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setPolicyHolderEntityType('company');
                      onChange({
                        ...data,
                        policyHolder: {
                          ...data.policyHolder,
                          type: 'company'
                        }
                      });
                    }}
                  >
                    Firma
                  </button>
                </div>
              </div>
              
              {/* Dane firmowe dla ubezpieczającego */}
              {policyHolderEntityType === 'company' && (
                <div className="mb-4">
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
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={data.policyHolder.companyName || ''}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            policyHolder: {
                              ...data.policyHolder,
                              companyName: e.target.value
                            }
                          });
                        }}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIP *
                      </label>
                      <input
                        type="text"
                        name="taxId"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={data.policyHolder.taxId || ''}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            policyHolder: {
                              ...data.policyHolder,
                              taxId: e.target.value
                            }
                          });
                        }}
                        placeholder="np. 1234567890"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dane osobowe dla ubezpieczającego */}
              {policyHolderEntityType === 'person' && (
                <div className="mb-4">
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
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={data.policyHolder.firstName}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            policyHolder: {
                              ...data.policyHolder,
                              firstName: e.target.value
                            }
                          });
                        }}
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
                        value={data.policyHolder.lastName}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            policyHolder: {
                              ...data.policyHolder,
                              lastName: e.target.value
                            }
                          });
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Dane kontaktowe dla ubezpieczającego */}
              <div className="mb-4">
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
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={data.policyHolder.email}
                      onChange={(e) => {
                        onChange({
                          ...data,
                          policyHolder: {
                            ...data.policyHolder,
                            email: e.target.value
                          }
                        });
                      }}
                      placeholder="np. jan.kowalski@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={data.policyHolder.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        let formattedPhone = value.replace(/\D/g, '');
                        if (formattedPhone.startsWith('48')) {
                          formattedPhone = formattedPhone.substring(2);
                        }
                        formattedPhone = formattedPhone.slice(0, 9);
                        const finalPhone = formattedPhone ? `+48${formattedPhone}` : value;
                        
                        onChange({
                          ...data,
                          policyHolder: {
                            ...data.policyHolder,
                            phoneNumber: finalPhone
                          }
                        });
                      }}
                      placeholder="+48XXXXXXXXX"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Dane identyfikacyjne dla ubezpieczającego */}
              {policyHolderEntityType === 'person' && (
                <div className="mb-4">
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
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={data.policyHolder.identificationNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        const formattedPesel = value.replace(/\D/g, '').slice(0, 11);
                        
                        onChange({
                          ...data,
                          policyHolder: {
                            ...data.policyHolder,
                            identificationNumber: formattedPesel
                          }
                        });
                      }}
                      required
                    />
                  </div>
                </div>
              )}
              
              {/* Adres dla ubezpieczającego */}
              <div>
                <h4 className="text-md font-semibold mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Adres {policyHolderEntityType === 'company' ? 'firmy' : 'zamieszkania'}
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ulica i numer *
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={data.policyHolder.address.street}
                      onChange={(e) => {
                        onChange({
                          ...data,
                          policyHolder: {
                            ...data.policyHolder,
                            address: {
                              ...data.policyHolder.address,
                              street: e.target.value,
                              countryCode: 'PL'
                            }
                          }
                        });
                      }}
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
                        value={data.policyHolder.address.city}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            policyHolder: {
                              ...data.policyHolder,
                              address: {
                                ...data.policyHolder.address,
                                city: e.target.value,
                                countryCode: 'PL'
                              }
                            }
                          });
                        }}
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
                        value={data.policyHolder.address.postCode}
                        onChange={(e) => {
                          const value = e.target.value;
                          let formattedPostCode = value.replace(/[^\d-]/g, '');
                          
                          if (formattedPostCode.length === 2 && !value.includes('-')) {
                            formattedPostCode = formattedPostCode + '-';
                          }
                          else if (formattedPostCode.length > 2 && !formattedPostCode.includes('-')) {
                            formattedPostCode = formattedPostCode.slice(0, 2) + '-' + formattedPostCode.slice(2);
                          }
                          
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
                        }}
                        placeholder="XX-XXX"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Checkbox "Klient jest ubezpieczonym" */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="isInsured"
              checked={isInsured}
              onChange={handleIsInsuredChange}
              className="w-5 h-5 text-[#300FE6] border-gray-300 rounded focus:ring-[#300FE6] focus:ring-offset-0 focus:ring-1 cursor-pointer"
            />
            <label htmlFor="isInsured" className="ml-2 text-sm font-medium text-gray-700">
              Klient jest ubezpieczonym
            </label>
          </div>
          
          {/* Formularz dla ubezpieczonego - rozwija się bezpośrednio pod checkboxem */}
          {!isInsured && (
            <div className="ml-6 mt-3 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="text-md font-semibold mb-3">
                Dane ubezpieczonego
              </h4>
              
              {/* Przełącznik typu podmiotu dla ubezpieczonego */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Rodzaj podmiotu</p>
                <div className="grid grid-cols-2 gap-0 rounded-md overflow-hidden border border-gray-300 max-w-md">
                  <button
                    type="button"
                    className={`py-3 px-6 text-center transition-colors ${
                      data.insured.personData?.type === 'person' 
                        ? 'bg-[#300FE6] text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onChange({
                        ...data,
                        insured: {
                          ...data.insured,
                          personData: {
                            ...(data.insured.personData || {}),
                            type: 'person',
                            address: {
                              ...(data.insured.personData?.address || {
                                addressLine1: '',
                                street: '',
                                city: '',
                                postCode: '',
                                countryCode: 'PL'
                              })
                            }
                          } as PersonalData
                        }
                      });
                    }}
                  >
                    Osoba prywatna
                  </button>
                  <button
                    type="button"
                    className={`py-3 px-6 text-center border-l border-gray-300 transition-colors ${
                      data.insured.personData?.type === 'company' 
                        ? 'bg-[#300FE6] text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onChange({
                        ...data,
                        insured: {
                          ...data.insured,
                          personData: {
                            ...(data.insured.personData || {}),
                            type: 'company',
                            address: {
                              ...(data.insured.personData?.address || {
                                addressLine1: '',
                                street: '',
                                city: '',
                                postCode: '',
                                countryCode: 'PL'
                              })
                            }
                          } as PersonalData
                        }
                      });
                    }}
                  >
                    Firma
                  </button>
                </div>
              </div>
              
              {/* Dane firmowe dla ubezpieczonego */}
              {data.insured.personData?.type === 'company' && (
                <div className="mb-4">
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
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={data.insured.personData?.companyName || ''}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            insured: {
                              ...data.insured,
                              personData: {
                                ...(data.insured.personData as PersonalData),
                                companyName: e.target.value
                              }
                            }
                          });
                        }}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIP *
                      </label>
                      <input
                        type="text"
                        name="taxId"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={data.insured.personData?.taxId || ''}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            insured: {
                              ...data.insured,
                              personData: {
                                ...(data.insured.personData as PersonalData),
                                taxId: e.target.value
                              }
                            }
                          });
                        }}
                        placeholder="np. 1234567890"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dane osobowe dla ubezpieczonego */}
              {data.insured.personData?.type === 'person' && (
                <div className="mb-4">
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
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={data.insured.personData?.firstName || ''}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            insured: {
                              ...data.insured,
                              personData: {
                                ...(data.insured.personData as PersonalData),
                                firstName: e.target.value
                              }
                            }
                          });
                        }}
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
                        onChange={(e) => {
                          onChange({
                            ...data,
                            insured: {
                              ...data.insured,
                              personData: {
                                ...(data.insured.personData as PersonalData),
                                lastName: e.target.value
                              }
                            }
                          });
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Dane kontaktowe dla ubezpieczonego */}
              <div className="mb-4">
                <h4 className="text-md font-semibold mb-3 flex items-center">
                  <Mail className="mr-2 text-[#300FE6]" size={20} />
                  Dane kontaktowe
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={data.insured.personData?.email || ''}
                      onChange={(e) => {
                        onChange({
                          ...data,
                          insured: {
                            ...data.insured,
                            personData: {
                              ...(data.insured.personData as PersonalData),
                              email: e.target.value
                            }
                          }
                        });
                      }}
                      placeholder="np. jan.kowalski@example.com"
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
                      onChange={(e) => {
                        const value = e.target.value;
                        let formattedPhone = value.replace(/\D/g, '');
                        if (formattedPhone.startsWith('48')) {
                          formattedPhone = formattedPhone.substring(2);
                        }
                        formattedPhone = formattedPhone.slice(0, 9);
                        const finalPhone = formattedPhone ? `+48${formattedPhone}` : value;
                        
                        onChange({
                          ...data,
                          insured: {
                            ...data.insured,
                            personData: {
                              ...(data.insured.personData as PersonalData),
                              phoneNumber: finalPhone
                            }
                          }
                        });
                      }}
                      placeholder="+48XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
              
              {/* Dane identyfikacyjne dla ubezpieczonego */}
              {data.insured.personData?.type === 'person' && (
                <div className="mb-4">
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
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={data.insured.personData?.identificationNumber || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const formattedPesel = value.replace(/\D/g, '').slice(0, 11);
                        
                        onChange({
                          ...data,
                          insured: {
                            ...data.insured,
                            personData: {
                              ...(data.insured.personData as PersonalData),
                              identificationNumber: formattedPesel
                            }
                          }
                        });
                      }}
                      required
                    />
                  </div>
                </div>
              )}
              
              {/* Adres dla ubezpieczonego */}
              <div>
                <h4 className="text-md font-semibold mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Adres {data.insured.personData?.type === 'company' ? 'firmy' : 'zamieszkania'}
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ulica i numer *
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={data.insured.personData?.address.street || ''}
                      onChange={(e) => {
                        const address = data.insured.personData?.address || {
                          addressLine1: '',
                          street: '',
                          city: '',
                          postCode: '',
                          countryCode: 'PL'
                        };
                        
                        onChange({
                          ...data,
                          insured: {
                            ...data.insured,
                            personData: {
                              ...(data.insured.personData as PersonalData),
                              address: {
                                ...address,
                                street: e.target.value,
                                countryCode: 'PL'
                              }
                            }
                          }
                        });
                      }}
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
                        onChange={(e) => {
                          const address = data.insured.personData?.address || {
                            addressLine1: '',
                            street: '',
                            city: '',
                            postCode: '',
                            countryCode: 'PL'
                          };
                          
                          onChange({
                            ...data,
                            insured: {
                              ...data.insured,
                              personData: {
                                ...(data.insured.personData as PersonalData),
                                address: {
                                  ...address,
                                  city: e.target.value,
                                  countryCode: 'PL'
                                }
                              }
                            }
                          });
                        }}
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
                        onChange={(e) => {
                          const value = e.target.value;
                          let formattedPostCode = value.replace(/[^\d-]/g, '');
                          
                          if (formattedPostCode.length === 2 && !value.includes('-')) {
                            formattedPostCode = formattedPostCode + '-';
                          }
                          else if (formattedPostCode.length > 2 && !formattedPostCode.includes('-')) {
                            formattedPostCode = formattedPostCode.slice(0, 2) + '-' + formattedPostCode.slice(2);
                          }
                          
                          if (formattedPostCode.includes('-')) {
                            const [prefix, suffix] = formattedPostCode.split('-');
                            formattedPostCode = prefix.slice(0, 2) + '-' + (suffix ? suffix.slice(0, 3) : '');
                          }
                          
                          const address = data.insured.personData?.address || {
                            addressLine1: '',
                            street: '',
                            city: '',
                            postCode: '',
                            countryCode: 'PL'
                          };
                          
                          onChange({
                            ...data,
                            insured: {
                              ...data.insured,
                              personData: {
                                ...(data.insured.personData as PersonalData),
                                address: {
                                  ...address,
                                  postCode: formattedPostCode,
                                  countryCode: 'PL'
                                }
                              }
                            }
                          });
                        }}
                        placeholder="XX-XXX"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Checkbox "Klient jest właścicielem pojazdu" */}
        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="isVehicleOwner"
              checked={isVehicleOwner}
              onChange={handleIsVehicleOwnerChange}
              className="w-5 h-5 text-[#300FE6] border-gray-300 rounded focus:ring-[#300FE6] focus:ring-offset-0 focus:ring-1 cursor-pointer"
            />
            <label htmlFor="isVehicleOwner" className="ml-2 text-sm font-medium text-gray-700">
              Klient jest właścicielem pojazdu
            </label>
          </div>
          
          {/* Formularz dla właściciela pojazdu - rozwija się bezpośrednio pod checkboxem */}
          {!isVehicleOwner && (
            <div className="ml-6 mt-3 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="text-md font-semibold mb-3">
                Dane właściciela pojazdu
              </h4>
              
              {/* Przełącznik typu podmiotu dla właściciela pojazdu */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Rodzaj podmiotu</p>
                <div className="grid grid-cols-2 gap-0 rounded-md overflow-hidden border border-gray-300 max-w-md">
                  <button
                    type="button"
                    className={`py-3 px-6 text-center transition-colors ${
                      data.vehicleOwner.personData?.type === 'person' 
                        ? 'bg-[#300FE6] text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onChange({
                        ...data,
                        vehicleOwner: {
                          ...data.vehicleOwner,
                          personData: {
                            ...(data.vehicleOwner.personData || {}),
                            type: 'person',
                            address: {
                              ...(data.vehicleOwner.personData?.address || {
                                addressLine1: '',
                                street: '',
                                city: '',
                                postCode: '',
                                countryCode: 'PL'
                              })
                            }
                          } as PersonalData
                        }
                      });
                    }}
                  >
                    Osoba prywatna
                  </button>
                  <button
                    type="button"
                    className={`py-3 px-6 text-center border-l border-gray-300 transition-colors ${
                      data.vehicleOwner.personData?.type === 'company' 
                        ? 'bg-[#300FE6] text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onChange({
                        ...data,
                        vehicleOwner: {
                          ...data.vehicleOwner,
                          personData: {
                            ...(data.vehicleOwner.personData || {}),
                            type: 'company',
                            address: {
                              ...(data.vehicleOwner.personData?.address || {
                                addressLine1: '',
                                street: '',
                                city: '',
                                postCode: '',
                                countryCode: 'PL'
                              })
                            }
                          } as PersonalData
                        }
                      });
                    }}
                  >
                    Firma
                  </button>
                </div>
              </div>
              
              {/* Dane firmowe dla właściciela pojazdu */}
              {data.vehicleOwner.personData?.type === 'company' && (
                <div className="mb-4">
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
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={data.vehicleOwner.personData?.companyName || ''}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            vehicleOwner: {
                              ...data.vehicleOwner,
                              personData: {
                                ...(data.vehicleOwner.personData as PersonalData),
                                companyName: e.target.value
                              }
                            }
                          });
                        }}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIP *
                      </label>
                      <input
                        type="text"
                        name="taxId"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={data.vehicleOwner.personData?.taxId || ''}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            vehicleOwner: {
                              ...data.vehicleOwner,
                              personData: {
                                ...(data.vehicleOwner.personData as PersonalData),
                                taxId: e.target.value
                              }
                            }
                          });
                        }}
                        placeholder="np. 1234567890"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dane osobowe dla właściciela pojazdu */}
              {data.vehicleOwner.personData?.type === 'person' && (
                <div className="mb-4">
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
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={data.vehicleOwner.personData?.firstName || ''}
                        onChange={(e) => {
                          onChange({
                            ...data,
                            vehicleOwner: {
                              ...data.vehicleOwner,
                              personData: {
                                ...(data.vehicleOwner.personData as PersonalData),
                                firstName: e.target.value
                              }
                            }
                          });
                        }}
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
                        onChange={(e) => {
                          onChange({
                            ...data,
                            vehicleOwner: {
                              ...data.vehicleOwner,
                              personData: {
                                ...(data.vehicleOwner.personData as PersonalData),
                                lastName: e.target.value
                              }
                            }
                          });
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Dane kontaktowe dla właściciela pojazdu */}
              <div className="mb-4">
                <h4 className="text-md font-semibold mb-3 flex items-center">
                  <Mail className="mr-2 text-[#300FE6]" size={20} />
                  Dane kontaktowe
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={data.vehicleOwner.personData?.email || ''}
                      onChange={(e) => {
                        onChange({
                          ...data,
                          vehicleOwner: {
                            ...data.vehicleOwner,
                            personData: {
                              ...(data.vehicleOwner.personData as PersonalData),
                              email: e.target.value
                            }
                          }
                        });
                      }}
                      placeholder="np. jan.kowalski@example.com"
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
                      onChange={(e) => {
                        const value = e.target.value;
                        let formattedPhone = value.replace(/\D/g, '');
                        if (formattedPhone.startsWith('48')) {
                          formattedPhone = formattedPhone.substring(2);
                        }
                        formattedPhone = formattedPhone.slice(0, 9);
                        const finalPhone = formattedPhone ? `+48${formattedPhone}` : value;
                        
                        onChange({
                          ...data,
                          vehicleOwner: {
                            ...data.vehicleOwner,
                            personData: {
                              ...(data.vehicleOwner.personData as PersonalData),
                              phoneNumber: finalPhone
                            }
                          }
                        });
                      }}
                      placeholder="+48XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
              
              {/* Dane identyfikacyjne dla właściciela pojazdu */}
              {data.vehicleOwner.personData?.type === 'person' && (
                <div className="mb-4">
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
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={data.vehicleOwner.personData?.identificationNumber || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const formattedPesel = value.replace(/\D/g, '').slice(0, 11);
                        
                        onChange({
                          ...data,
                          vehicleOwner: {
                            ...data.vehicleOwner,
                            personData: {
                              ...(data.vehicleOwner.personData as PersonalData),
                              identificationNumber: formattedPesel
                            }
                          }
                        });
                      }}
                      required
                    />
                  </div>
                </div>
              )}
              
              {/* Adres dla właściciela pojazdu */}
              <div>
                <h4 className="text-md font-semibold mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Adres {data.vehicleOwner.personData?.type === 'company' ? 'firmy' : 'zamieszkania'}
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ulica i numer *
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={data.vehicleOwner.personData?.address.street || ''}
                      onChange={(e) => {
                        const address = data.vehicleOwner.personData?.address || {
                          addressLine1: '',
                          street: '',
                          city: '',
                          postCode: '',
                          countryCode: 'PL'
                        };
                        
                        onChange({
                          ...data,
                          vehicleOwner: {
                            ...data.vehicleOwner,
                            personData: {
                              ...(data.vehicleOwner.personData as PersonalData),
                              address: {
                                ...address,
                                street: e.target.value,
                                countryCode: 'PL'
                              }
                            }
                          }
                        });
                      }}
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
                        onChange={(e) => {
                          const address = data.vehicleOwner.personData?.address || {
                            addressLine1: '',
                            street: '',
                            city: '',
                            postCode: '',
                            countryCode: 'PL'
                          };
                          
                          onChange({
                            ...data,
                            vehicleOwner: {
                              ...data.vehicleOwner,
                              personData: {
                                ...(data.vehicleOwner.personData as PersonalData),
                                address: {
                                  ...address,
                                  city: e.target.value,
                                  countryCode: 'PL'
                                }
                              }
                            }
                          });
                        }}
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
                        onChange={(e) => {
                          const value = e.target.value;
                          let formattedPostCode = value.replace(/[^\d-]/g, '');
                          
                          if (formattedPostCode.length === 2 && !value.includes('-')) {
                            formattedPostCode = formattedPostCode + '-';
                          }
                          else if (formattedPostCode.length > 2 && !formattedPostCode.includes('-')) {
                            formattedPostCode = formattedPostCode.slice(0, 2) + '-' + formattedPostCode.slice(2);
                          }
                          
                          if (formattedPostCode.includes('-')) {
                            const [prefix, suffix] = formattedPostCode.split('-');
                            formattedPostCode = prefix.slice(0, 2) + '-' + (suffix ? suffix.slice(0, 3) : '');
                          }
                          
                          const address = data.vehicleOwner.personData?.address || {
                            addressLine1: '',
                            street: '',
                            city: '',
                            postCode: '',
                            countryCode: 'PL'
                          };
                          
                          onChange({
                            ...data,
                            vehicleOwner: {
                              ...data.vehicleOwner,
                              personData: {
                                ...(data.vehicleOwner.personData as PersonalData),
                                address: {
                                  ...address,
                                  postCode: formattedPostCode,
                                  countryCode: 'PL'
                                }
                              }
                            }
                          });
                        }}
                        placeholder="XX-XXX"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Przyciski nawigacyjne */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onSaveOffer}
          className="text-gray-600 border-gray-300 hover:bg-gray-50 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Zapisz ofertę
        </Button>
        
        <Button
          className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
          onClick={onContinue}
        >
          Dalej <ChevronRight className="ml-1 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}; 