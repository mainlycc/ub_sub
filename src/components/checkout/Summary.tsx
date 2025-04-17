"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VehicleData {
  purchasedOn: string;
  modelCode: string;
  categoryCode: string;
  usageCode: string;
  mileage: number;
  firstRegisteredOn: string;
  evaluationDate: string;
  purchasePrice: number;
  purchasePriceNet: number;
  purchasePriceVatReclaimableCode: string;
  usageTypeCode: string;
  purchasePriceInputType: string;
  vin: string;
  vrm: string;
  make?: string;
  model?: string;
  makeId?: string;
  modelId?: string;
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

interface PaymentData {
  term: string;
  claimLimit: string;
  paymentTerm: string;
  paymentMethod: string;
}

interface CalculationResult {
  premium: number;
  details: {
    productName: string;
    coveragePeriod: string;
    vehicleValue: number;
    maxCoverage: string;
  };
}

interface SummaryProps {
  vehicleData: VehicleData;
  personalData: PersonalData;
  paymentData: PaymentData;
  calculationResult: CalculationResult | null;
  onSubmit: () => void;
  isSubmitting: boolean;
  termsAgreed: boolean;
  onTermsChange: (agreed: boolean) => void;
  onPaymentChange: (paymentData: PaymentData) => void;
  dataConfirmed: boolean;
  onDataConfirmChange: (confirmed: boolean) => void;
}

export const Summary = (props: SummaryProps): React.ReactElement => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [showSmsConfirmation, setShowSmsConfirmation] = useState(false);
  const [isConfirmingSms, setIsConfirmingSms] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);
  const [smsSuccess, setSmsSuccess] = useState<string | null>(null);

  if (!props.calculationResult) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Brak wyników kalkulacji</p>
      </div>
    );
  }

  const getValidSaleInitiatedDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const registerPolicy = async () => {
    if (!props.calculationResult) return;
    
    setIsRegistering(true);
    setRegistrationError(null);
    setSmsSuccess(null);

    try {
      // Sprawdzanie kompletności danych przed wysłaniem
      const validateData = () => {
        const errors = [];
        
        // Sprawdzanie danych pojazdu
        if (!props.vehicleData.makeId) errors.push('Brak makeId pojazdu');
        if (!props.vehicleData.modelId) errors.push('Brak modelId pojazdu');
        if (!props.vehicleData.vin) errors.push('Brak numeru VIN');
        if (!props.vehicleData.vrm) errors.push('Brak numeru rejestracyjnego');
        
        // Sprawdzanie danych osobowych
        if (!props.personalData.phoneNumber) errors.push('Brak numeru telefonu');
        if (!props.personalData.identificationNumber) errors.push('Brak numeru PESEL');
        if (!props.personalData.address?.street) errors.push('Brak ulicy');
        if (!props.personalData.address?.postCode) errors.push('Brak kodu pocztowego');
        if (!props.personalData.address?.city) errors.push('Brak miasta');
        
        // Upewnijmy się, że mamy addressLine1 (numer domu) lub użyjemy ulicy jako zamiennika
        const addressLine1 = props.personalData.address?.addressLine1 || 
                            (props.personalData.address?.street ? 
                            props.personalData.address.street.match(/\d+$/)?.[0] || 
                            props.personalData.address.street : '');
        
        if (!addressLine1) errors.push('Brak numeru domu');
        
        return errors;
      };

      const validationErrors = validateData();
      if (validationErrors.length > 0) {
        console.error('Błędy walidacji:', validationErrors);
        throw new Error(`Nieprawidłowe dane: ${validationErrors.join(', ')}`);
      }

      // Przygotuj numer telefonu w odpowiednim formacie
      let phoneNumber = props.personalData.phoneNumber;
      if (!phoneNumber || phoneNumber.trim() === '') {
        throw new Error('Numer telefonu jest wymagany');
      }
      
      if (!phoneNumber.startsWith('+')) {
        // Usuń wszystkie nie-cyfry
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        // Dodaj prefiks kraju, jeśli go nie ma
        phoneNumber = cleanedNumber.startsWith('48') ? `+${cleanedNumber}` : `+48${cleanedNumber}`;
      }

      // Upewnij się, że mamy wypełnione addressLine1
      let addressLine1 = props.personalData.address?.addressLine1;
      if (!addressLine1 || addressLine1.trim() === '') {
        addressLine1 = props.personalData.address?.street.match(/\d+$/)?.[0] || props.personalData.address?.street || `${props.personalData.firstName} ${props.personalData.lastName}`;
      }
      
      // Upewnij się, że kod pocztowy ma poprawny format
      let postCode = props.personalData.address?.postCode || '';
      if (!postCode.match(/^\d{2}-\d{3}$/)) {
        if (postCode && postCode.replace(/\D/g, '').length === 5) {
          postCode = postCode.replace(/\D/g, '').replace(/^(\d{2})(\d{3})$/, '$1-$2');
        } else {
          throw new Error('Kod pocztowy musi mieć format XX-XXX');
        }
      }
      
      // Upewnij się, że mamy kod kraju
      const countryCode = props.personalData.address?.countryCode || 'PL';

      const policyData = {
        extApiNo: null,
        extReferenceNo: null,
        extTenderNo: null,
        sellerNodeCode: "PL_TEST_GAP_25",
        productCode: "5_DCGAP_MG25_GEN",
        saleInitiatedOn: getValidSaleInitiatedDate(),
        signatureTypeCode: "AUTHORIZED_BY_SMS",
        confirmedByDefault: null,
        vehicleSnapshot: {
          purchasedOn: props.vehicleData.purchasedOn,
          modelCode: props.vehicleData.modelCode,
          makeId: props.vehicleData.makeId || '',
          modelId: props.vehicleData.modelId || '',
          categoryCode: "PC",
          usageCode: "STANDARD",
          mileage: props.vehicleData.mileage,
          firstRegisteredOn: props.vehicleData.firstRegisteredOn + "T07:38:46+02:00",
          evaluationDate: getValidSaleInitiatedDate(),
          purchasePrice: Math.round(props.vehicleData.purchasePrice * 100),
          purchasePriceNet: Math.round(props.vehicleData.purchasePriceNet * 100),
          purchasePriceVatReclaimableCode: "NO",
          usageTypeCode: "INDIVIDUAL",
          purchasePriceInputType: "VAT_INAPPLICABLE",
          vin: props.vehicleData.vin,
          vrm: props.vehicleData.vrm,
          owners: [{ contact: { inheritFrom: "policyHolder" } }]
        },
        client: {
          policyHolder: {
            type: "person",
            phoneNumber: phoneNumber,
            firstName: props.personalData.firstName,
            lastName: props.personalData.lastName,
            email: props.personalData.email,
            identificationNumber: props.personalData.identificationNumber,
            address: {
              addressLine1: addressLine1,
              street: props.personalData.address?.street || '',
              city: props.personalData.address?.city || '',
              postCode: postCode,
              countryCode: countryCode
            }
          },
          insured: {
            inheritFrom: "policyHolder"
          },
          beneficiary: {
            inheritFrom: "policyHolder"
          }
        },
        options: {
          TERM: props.paymentData.term,
          CLAIM_LIMIT: props.paymentData.claimLimit,
          PAYMENT_TERM: props.paymentData.paymentTerm,
          PAYMENT_METHOD: props.paymentData.paymentMethod
        },
        premium: Math.round(props.calculationResult.premium * 100)
      };

      console.log('Wysyłane dane:', JSON.stringify(policyData, null, 2));

      const response = await fetch('/api/policies/creation/lock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policyData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Błąd odpowiedzi:', responseData);
        if (responseData.details) {
          console.error('Szczegóły błędu API:', responseData.details);
          throw new Error(`Błąd API: ${JSON.stringify(responseData.details)}`);
        }
        throw new Error(responseData.error || 'Błąd podczas rejestracji polisy');
      }

      setPolicyId(responseData.id);
      setShowSmsConfirmation(true);
      
    } catch (error) {
      console.error('Błąd podczas rejestracji polisy:', error);
      setRegistrationError(
        error instanceof Error 
          ? error.message 
          : 'Wystąpił nieoczekiwany błąd podczas rejestracji polisy'
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handleMissingDocuments = async (policyId: string) => {
    try {
      console.log('Sprawdzanie wymaganych dokumentów dla polisy ID:', policyId);
      
      // Sprawdzenie wymaganych dokumentów
      const missingTypesResponse = await fetch(`/api/policies/${policyId}/missing-upload-types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Jeśli status to 404, obsługujemy to jako brak wymaganych dokumentów
      if (missingTypesResponse.status === 404) {
        console.log('Endpoint missing-upload-types zwrócił 404 - brak wymaganych dokumentów lub endpoint nie istnieje');
        return [];
      }
      
      // Odczytaj odpowiedź jako tekst
      const textResponse = await missingTypesResponse.text();
      console.log('Odpowiedź missing-upload-types (tekst):', textResponse);
      
      interface MissingDocument {
        code: string;
        name: string;
        description?: string;
        error?: string;
      }
      
      let missingTypes: MissingDocument[] = [];
      
      // Jeśli mamy niepustą odpowiedź, próbujemy sparsować JSON
      if (textResponse.trim()) {
        try {
          // Sprawdź, czy odpowiedź to HTML (zaczyna się od <!DOCTYPE lub <html)
          if (textResponse.trim().toLowerCase().startsWith('<!doctype') || 
              textResponse.trim().toLowerCase().startsWith('<html')) {
            console.warn('Otrzymano odpowiedź HTML zamiast JSON:', textResponse.substring(0, 100));
            return [];
          }
          
          const data = JSON.parse(textResponse);
          
          if (Array.isArray(data)) {
            missingTypes = data;
          } else if (data.error) {
            console.error('Błąd API:', data.error);
            throw new Error(data.error);
          } else {
            console.warn('Nieoczekiwany format odpowiedzi:', data);
          }
        } catch (parseError) {
          console.error('Błąd parsowania JSON:', parseError);
          // Nie rzucamy błędu, tylko zwracamy pustą tablicę
          return [];
        }
      }
      
      console.log('Wymagane dokumenty:', missingTypes);
      
      // Jeśli status nie jest OK, sprawdzamy czy mamy błąd
      if (!missingTypesResponse.ok) {
        if (missingTypes.length > 0 && 'error' in missingTypes[0]) {
          console.error('Błąd w danych:', missingTypes[0].error);
          return [];
        } else {
          console.error('Błąd podczas sprawdzania wymaganych dokumentów');
          return [];
        }
      }
      
      return missingTypes;
    } catch (error) {
      console.error('Błąd podczas sprawdzania dokumentów:', error);
      // Zwracamy pustą tablicę zamiast rzucać błąd
      return [];
    }
  };

  const confirmSmsSignature = async () => {
    if (!policyId || !confirmationCode) return;
    
    setIsConfirmingSms(true);
    setSmsError(null);
    setSmsSuccess(null);

    try {
      console.log('Wysyłanie kodu SMS:', confirmationCode, 'dla polisy ID:', policyId);
      
      // Potwierdzenie podpisu SMS - zmiana z POST na PUT
      const response = await fetch(`/api/policies/${policyId}/confirm-signature`, {
        method: 'POST', // To nadal POST, bo nasz własny backend API używa POST, ale wewnątrz wysyła PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmationCode: confirmationCode
        }),
      });

      // Odczytaj odpowiedź jako JSON
      let data;
      try {
        const textResponse = await response.text();
        console.log('Odpowiedź serwera (tekst):', textResponse);
        
        // Pusta odpowiedź lub nieprawidłowy JSON
        if (!textResponse.trim()) {
          if (response.ok) {
            data = { success: true };
          } else {
            throw new Error('Otrzymano pustą odpowiedź z serwera');
          }
        } else {
          // Sprawdzenie czy odpowiedź to HTML
          if (textResponse.trim().toLowerCase().startsWith('<!doctype') || 
              textResponse.trim().toLowerCase().startsWith('<html')) {
            if (response.ok) {
              // Jeśli status jest OK, uznajemy to za sukces mimo nieprawidłowego formatu
              console.warn('Otrzymano odpowiedź HTML, ale status jest OK');
              data = { success: true };
            } else {
              throw new Error('Otrzymano nieprawidłową odpowiedź HTML z serwera');
            }
          } else {
            // Próba parsowania JSON
            try {
              data = JSON.parse(textResponse);
              console.log('Odpowiedź sparsowana jako JSON:', data);
            } catch (parseError) {
              console.error('Błąd parsowania JSON:', parseError);
              // Jeśli status jest OK, uznajemy to za sukces mimo nieprawidłowego formatu
              if (response.ok) {
                data = { success: true };
              } else {
                throw new Error('Otrzymano nieprawidłową odpowiedź z serwera (nie JSON)');
              }
            }
          }
        }
      } catch (readError) {
        console.error('Błąd odczytu odpowiedzi:', readError);
        // Jeśli status jest OK, uznajemy to za sukces mimo błędu
        if (response.ok) {
          data = { success: true };
        } else {
          throw new Error('Nie udało się odczytać odpowiedzi z serwera');
        }
      }

      // Sprawdź status odpowiedzi
      if (!response.ok) {
        console.error('Błąd odpowiedzi:', data);
        
        // Obsługujemy różne rodzaje błędów
        if (data && data.error) {
          if (data.error.includes('token') || data.error.includes('autoryzac')) {
            throw new Error('Błąd autoryzacji. Spróbuj ponownie za chwilę.');
          } else if (data.error.includes('nieprawidłow') || data.error.includes('invalid')) {
            throw new Error('Nieprawidłowy kod SMS. Sprawdź kod i spróbuj ponownie.');
          } else {
            throw new Error(data.error);
          }
        } else {
          throw new Error('Błąd podczas potwierdzania podpisu');
        }
      }

      // Jeśli mamy success: true, kontynuujemy
      if (data.success || response.ok) {
        console.log('Podpis SMS potwierdzony pomyślnie');
        
        // Po udanym potwierdzeniu sprawdzamy wymagane dokumenty
        try {
          const missingDocuments = await handleMissingDocuments(policyId);
          console.log('Sprawdzono dokumenty dla polisy, brakujące dokumenty:', missingDocuments);
        } catch (docsError) {
          console.error('Błąd podczas pobierania wymaganych dokumentów:', docsError);
          // Kontynuujemy mimo błędu z dokumentami
        }
        
        // Ustawiamy komunikat sukcesu
        setSmsSuccess('Podpis został potwierdzony pomyślnie. Za chwilę nastąpi przekierowanie...');
        
        // Ukrywamy formularz SMS po krótkim opóźnieniu
        setTimeout(() => {
          setShowSmsConfirmation(false);
          // Wyświetlamy informację o sukcesie
          props.onSubmit();
        }, 2000);
      } else {
        throw new Error('Nieznany błąd podczas potwierdzania kodu SMS');
      }
      
    } catch (error) {
      console.error('Błąd podczas potwierdzania podpisu:', error);
      setSmsError(
        error instanceof Error 
          ? error.message 
          : 'Wystąpił nieoczekiwany błąd podczas potwierdzania podpisu'
      );
      setSmsSuccess(null);
    } finally {
      setIsConfirmingSms(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">5</span>
        </div>
        Podsumowanie
      </h2>

      {/* Wyświetlanie danych */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dane pojazdu */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V7a1 1 0 00-.293-.707l-2-2A1 1 0 0017 4H3z" />
            </svg>
            Dane pojazdu
          </h3>
          <div className="space-y-2">
            <p><span className="font-medium">Marka i model:</span> {props.vehicleData.make} {props.vehicleData.model}</p>
            <p><span className="font-medium">Data zakupu:</span> {new Date(props.vehicleData.purchasedOn).toLocaleDateString()}</p>
            <p><span className="font-medium">Data pierwszej rejestracji:</span> {new Date(props.vehicleData.firstRegisteredOn).toLocaleDateString()}</p>
            <p><span className="font-medium">VIN:</span> {props.vehicleData.vin}</p>
            <p><span className="font-medium">Nr rejestracyjny:</span> {props.vehicleData.vrm}</p>
            <p><span className="font-medium">Przebieg:</span> {props.vehicleData.mileage.toLocaleString()} km</p>
            <p><span className="font-medium">Wartość pojazdu:</span> {props.vehicleData.purchasePrice.toLocaleString()} zł</p>
            <p><span className="font-medium">VAT odliczalny:</span> {
              props.vehicleData.purchasePriceVatReclaimableCode === 'YES' ? 'Tak' :
              props.vehicleData.purchasePriceVatReclaimableCode === 'PARTIAL' ? 'Częściowo (50%)' :
              'Nie'
            }</p>
          </div>
        </div>

        {/* Dane ubezpieczającego */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Dane ubezpieczającego
          </h3>
          <div className="space-y-2">
            {props.personalData.type === 'company' ? (
              <>
                <p><span className="font-medium">Nazwa firmy:</span> {props.personalData.companyName}</p>
                <p><span className="font-medium">NIP:</span> {props.personalData.taxId}</p>
              </>
            ) : (
              <>
                <p><span className="font-medium">Imię i nazwisko:</span> {props.personalData.firstName} {props.personalData.lastName}</p>
                <p><span className="font-medium">PESEL:</span> {props.personalData.identificationNumber}</p>
              </>
            )}
            <p><span className="font-medium">Email:</span> {props.personalData.email}</p>
            <p><span className="font-medium">Telefon:</span> {props.personalData.phoneNumber}</p>
            <p><span className="font-medium">Adres:</span> {props.personalData.address.street}, {props.personalData.address.postCode} {props.personalData.address.city}</p>
          </div>
        </div>

        {/* Szczegóły ubezpieczenia */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Szczegóły ubezpieczenia
          </h3>
          <div className="space-y-2">
            <p><span className="font-medium">Produkt:</span> {props.calculationResult.details.productName}</p>
            <p><span className="font-medium">Okres ochrony:</span> {props.calculationResult.details.coveragePeriod}</p>
            <p><span className="font-medium">Wartość pojazdu:</span> {props.calculationResult.details.vehicleValue.toLocaleString()} zł</p>
            <p><span className="font-medium">Maksymalna ochrona:</span> {props.calculationResult.details.maxCoverage}</p>
            <p><span className="font-medium">Okres ubezpieczenia:</span> {props.paymentData.term === 'T_36' ? '36 miesięcy' : props.paymentData.term === 'T_24' ? '24 miesiące' : props.paymentData.term === 'T_12' ? '12 miesięcy' : props.paymentData.term}</p>
            <p><span className="font-medium">Limit roszczenia:</span> {props.paymentData.claimLimit === 'CL_150000' ? '150 000 zł' : props.paymentData.claimLimit === 'CL_100000' ? '100 000 zł' : props.paymentData.claimLimit === 'CL_50000' ? '50 000 zł' : props.paymentData.claimLimit}</p>
          </div>
        </div>

        {/* Płatność */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Płatność
          </h3>
          <div className="space-y-4">
            <p><span className="font-medium">Składka:</span> <span className="text-xl font-bold text-[#300FE6]">{props.calculationResult.premium.toLocaleString()} zł</span></p>
            <p><span className="font-medium">Schemat płatności:</span> {props.paymentData.paymentTerm === 'PT_LS' ? 'Jednorazowo' : 'Miesięcznie'}</p>
            <p><span className="font-medium">Metoda płatności:</span> {
              props.paymentData.paymentMethod === 'PM_PBC' ? 'BLIK, karta, szybki przelew' :
              props.paymentData.paymentMethod === 'PM_BT' ? 'Przelew tradycyjny' :
              props.paymentData.paymentMethod === 'PM_PAYU_M' ? 'Raty miesięczne PayU' :
              props.paymentData.paymentMethod === 'PM_BY_DLR' ? 'Płatne przez dealera' :
              'Nieznany'
            }</p>
          </div>
        </div>
      </div>

      {/* Zgoda na warunki */}
      <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          Zgody i potwierdzenia
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id="termsAgreed"
                checked={props.termsAgreed}
                onChange={(e) => props.onTermsChange(e.target.checked)}
                className="w-5 h-5 text-[#300FE6] border-gray-300 rounded focus:ring-[#300FE6] focus:ring-offset-0 focus:ring-1 cursor-pointer"
              />
            </div>
            <label htmlFor="termsAgreed" className="ml-2 text-sm text-gray-600">
              Oświadczam, że zapoznałem/am się z warunkami umowy ubezpieczenia GAP, Ogólnymi Warunkami Ubezpieczenia, Dokumentem zawierającym informacje o produkcie ubezpieczeniowym oraz Informacją Administratora Danych Osobowych i wyrażam zgodę na zawarcie umowy ubezpieczenia na tych warunkach.
            </label>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id="confirmData"
                checked={props.dataConfirmed}
                onChange={(e) => props.onDataConfirmChange(e.target.checked)}
                className="w-5 h-5 text-[#300FE6] border-gray-300 rounded focus:ring-[#300FE6] focus:ring-offset-0 focus:ring-1 cursor-pointer"
              />
            </div>
            <label htmlFor="confirmData" className="ml-2 text-sm text-gray-600">
              Potwierdzam, że wszystkie informacje podane przeze mnie w formularzu są zgodne z prawdą i kompletne. Jestem świadomy/a, że podanie nieprawdziwych danych może skutkować odmową wypłaty odszkodowania.
            </label>
          </div>
        </div>
      </div>

      {/* Wyświetlanie błędów */}
      {registrationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl" role="alert">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <strong className="font-bold">Błąd rejestracji: </strong>
              <span className="block sm:inline">{registrationError}</span>
            </div>
          </div>
        </div>
      )}

      {smsError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl" role="alert">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <strong className="font-bold">Błąd potwierdzenia SMS: </strong>
              <span className="block sm:inline">{smsError}</span>
            </div>
          </div>
        </div>
      )}

      {/* Komunikat sukcesu SMS */}
      {smsSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl" role="alert">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <strong className="font-bold">Sukces: </strong>
              <span className="block sm:inline">{smsSuccess}</span>
            </div>
          </div>
        </div>
      )}

      {/* Potwierdzenie SMS */}
      {showSmsConfirmation ? (
        <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#300FE6]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            Potwierdź podpisem SMS
          </h3>
          <div className="space-y-4">
            <p className="text-gray-700">
              Na numer telefonu <span className="font-bold">{props.personalData.phoneNumber}</span> został wysłany kod SMS. 
              Wprowadź go poniżej, aby potwierdzić zawarcie umowy.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Wprowadź kod z SMS"
                className="max-w-xs"
              />
              <Button
                onClick={confirmSmsSignature}
                disabled={isConfirmingSms || !confirmationCode}
                className="bg-[#300FE6] hover:bg-[#2507b3] text-white"
              >
                {isConfirmingSms ? 
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Potwierdzanie...
                  </div> : 
                  'Potwierdź kod SMS'
                }
              </Button>
            </div>
            <p className="text-sm text-gray-500">Nie otrzymałeś/aś kodu? Możesz poprosić o ponowne wysłanie za <span className="font-semibold">60</span> sekund.</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-end mt-8">
          <Button
            onClick={registerPolicy}
            disabled={isRegistering || !props.termsAgreed || !props.dataConfirmed}
            className="bg-[#300FE6] hover:bg-[#2507b3] text-white px-8 py-3"
          >
            {isRegistering ? 
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Przetwarzanie...
              </div> : 
              'Zamawiam i płacę'
            }
          </Button>
        </div>
      )}
    </div>
  );
}