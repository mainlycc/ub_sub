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
}

export const Summary = (props: SummaryProps): React.ReactElement => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [showSmsConfirmation, setShowSmsConfirmation] = useState(false);
  const [isConfirmingSms, setIsConfirmingSms] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);

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
        if (!props.personalData.address.street) errors.push('Brak ulicy');
        if (!props.personalData.address.postCode) errors.push('Brak kodu pocztowego');
        if (!props.personalData.address.city) errors.push('Brak miasta');
        
        // Upewnijmy się, że mamy addressLine1 (numer domu)
        if (!props.personalData.address.addressLine1) errors.push('Brak numeru domu');
        
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
      let addressLine1 = props.personalData.address.addressLine1;
      if (!addressLine1 || addressLine1.trim() === '') {
        addressLine1 = props.personalData.address.street.match(/\d+$/)?.[0] || `${props.personalData.firstName} ${props.personalData.lastName}`;
      }
      
      // Upewnij się, że kod pocztowy ma poprawny format
      let postCode = props.personalData.address.postCode;
      if (!postCode || !postCode.match(/^\d{2}-\d{3}$/)) {
        if (postCode && postCode.replace(/\D/g, '').length === 5) {
          postCode = postCode.replace(/\D/g, '').replace(/^(\d{2})(\d{3})$/, '$1-$2');
        } else {
          throw new Error('Kod pocztowy musi mieć format XX-XXX');
        }
      }
      
      // Upewnij się, że mamy kod kraju
      const countryCode = props.personalData.address.countryCode || 'PL';

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
              street: props.personalData.address.street,
              city: props.personalData.address.city,
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
      // Sprawdzenie wymaganych dokumentów
      const missingTypesResponse = await fetch(`/api/policies/${policyId}/missing-upload-types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!missingTypesResponse.ok) {
        throw new Error('Błąd podczas sprawdzania wymaganych dokumentów');
      }

      const missingTypes = await missingTypesResponse.json();
      
      // Tutaj możesz dodać logikę obsługi wymaganych dokumentów
      console.log('Wymagane dokumenty:', missingTypes);
      
      return missingTypes;
    } catch (error) {
      console.error('Błąd podczas sprawdzania dokumentów:', error);
      throw error;
    }
  };

  const confirmSmsSignature = async () => {
    if (!policyId || !confirmationCode) return;
    
    setIsConfirmingSms(true);
    setSmsError(null);

    try {
      // Potwierdzenie podpisu SMS
      const response = await fetch(`/api/policies/${policyId}/confirm-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmationCode: confirmationCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Błąd podczas potwierdzania podpisu');
      }

      // Po udanym potwierdzeniu sprawdzamy wymagane dokumenty
      const missingDocs = await handleMissingDocuments(policyId);
      
      // Ukrywamy formularz SMS
      setShowSmsConfirmation(false);
      
      // Tutaj możesz dodać logikę wyświetlania informacji o sukcesie
      // i ewentualnie przekierować użytkownika do kolejnego kroku (np. upload dokumentów)
      
    } catch (error) {
      console.error('Błąd podczas potwierdzania podpisu:', error);
      setSmsError(
        error instanceof Error 
          ? error.message 
          : 'Wystąpił nieoczekiwany błąd podczas potwierdzania podpisu'
      );
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
          <h3 className="text-lg font-semibold mb-4">Dane pojazdu</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Data zakupu:</span> {new Date(props.vehicleData.purchasedOn).toLocaleDateString()}</p>
            <p><span className="font-medium">VIN:</span> {props.vehicleData.vin}</p>
            <p><span className="font-medium">Nr rejestracyjny:</span> {props.vehicleData.vrm}</p>
          </div>
        </div>

        {/* Dane osobowe */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Dane osobowe</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Imię i nazwisko:</span> {props.personalData.firstName} {props.personalData.lastName}</p>
            <p><span className="font-medium">Email:</span> {props.personalData.email}</p>
            <p><span className="font-medium">Telefon:</span> {props.personalData.phoneNumber}</p>
            <p><span className="font-medium">Adres:</span> {props.personalData.address.street}, {props.personalData.address.postCode} {props.personalData.address.city}</p>
          </div>
        </div>

        {/* Szczegóły ubezpieczenia */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Szczegóły ubezpieczenia</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Produkt:</span> {props.calculationResult.details.productName}</p>
            <p><span className="font-medium">Okres ochrony:</span> {props.calculationResult.details.coveragePeriod}</p>
            <p><span className="font-medium">Maksymalna ochrona:</span> {props.calculationResult.details.maxCoverage}</p>
          </div>
        </div>

        {/* Płatność */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Płatność</h3>
          <div className="space-y-4">
            <p><span className="font-medium">Składka:</span> <span className="text-xl font-bold text-[#300FE6]">{props.calculationResult.premium.toLocaleString()} zł</span></p>
            <p><span className="font-medium">Sposób płatności:</span> {props.paymentData.paymentTerm === 'PT_LS' ? 'Jednorazowo' : 'Miesięcznie'}</p>
            <p><span className="font-medium">Forma płatności:</span> {
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
      <div className="mt-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={props.termsAgreed}
            onChange={(e) => props.onTermsChange(e.target.checked)}
            className="rounded border-gray-300 text-[#300FE6] focus:ring-[#300FE6]"
          />
          <span className="text-sm text-gray-600">
            Akceptuję regulamin i politykę prywatności
          </span>
        </label>
      </div>

      {/* Wyświetlanie błędów */}
      {registrationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Błąd! </strong>
          <span className="block sm:inline">{registrationError}</span>
        </div>
      )}

      {smsError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Błąd potwierdzenia SMS! </strong>
          <span className="block sm:inline">{smsError}</span>
        </div>
      )}

      {/* Potwierdzenie SMS */}
      {showSmsConfirmation ? (
        <div className="mt-6 space-y-4">
          <p className="text-gray-700">
            Na podany numer telefonu został wysłany kod SMS. 
            Wprowadź go poniżej, aby potwierdzić zawarcie umowy.
          </p>
          <div className="flex space-x-4">
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
              {isConfirmingSms ? 'Potwierdzanie...' : 'Potwierdź kod SMS'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end mt-6">
          <Button
            onClick={registerPolicy}
            disabled={isRegistering || !props.termsAgreed}
            className="bg-[#300FE6] hover:bg-[#2507b3] text-white px-8 py-3"
          >
            {isRegistering ? 'Rejestrowanie polisy...' : 'Zarejestruj polisę'}
          </Button>
        </div>
      )}
    </div>
  );
}