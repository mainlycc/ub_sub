"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, Car, User, CreditCard, FileCheck } from 'lucide-react';

// Typy danych dla formularza
interface VehicleData {
  purchasedOn: string;
  mileage: number;
  firstRegisteredOn: string;
  vin: string;
  vrm: string; // numer rejestracyjny
}

interface PersonalData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  identificationNumber: string; // PESEL
  addressLine1: string;
  street: string;
  city: string;
  postCode: string;
}

interface PaymentData {
  term: string;
  claimLimit: string;
  paymentTerm: string;
  paymentMethod: string;
}

// Opcje do wyboru
const termOptions = [
  { value: "T_12", label: "12 miesięcy" },
  { value: "T_24", label: "24 miesiące" },
  { value: "T_36", label: "36 miesięcy" },
  { value: "T_48", label: "48 miesięcy" },
  { value: "T_60", label: "60 miesięcy" }
];

const claimLimitOptions = [
  { value: "CL_100000", label: "100 000 PLN" },
  { value: "CL_150000", label: "150 000 PLN" }
];

const paymentMethodOptions = [
  { value: "PM_BT", label: "Przelew bankowy" },
  { value: "PM_PBC", label: "Płatność online" }
];

const CheckoutPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Dane formularza podzielone na kroki
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    purchasedOn: new Date().toISOString().split('T')[0],
    mileage: 1000,
    firstRegisteredOn: "",
    vin: "",
    vrm: ""
  });
  
  const [personalData, setPersonalData] = useState<PersonalData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    identificationNumber: "",
    addressLine1: "",
    street: "",
    city: "",
    postCode: ""
  });
  
  const [paymentData, setPaymentData] = useState<PaymentData>({
    term: "T_36",
    claimLimit: "CL_100000",
    paymentTerm: "PT_LS",
    paymentMethod: "PM_BT"
  });
  
  // Walidacja pól formularza
  const [errors, setErrors] = useState<{
    vehicle?: { [key: string]: string };
    personal?: { [key: string]: string };
    payment?: { [key: string]: string };
  }>({});
  
  // Funkcje obsługujące zmiany w formularzu
  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };
  
  // Walidacja danych pojazdu
  const validateVehicleData = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!vehicleData.purchasedOn) {
      newErrors.purchasedOn = "Data zakupu jest wymagana";
    }
    
    if (!vehicleData.firstRegisteredOn) {
      newErrors.firstRegisteredOn = "Data pierwszej rejestracji jest wymagana";
    }
    
    if (!vehicleData.vin || vehicleData.vin.length < 17) {
      newErrors.vin = "Wymagany poprawny numer VIN (17 znaków)";
    }
    
    if (!vehicleData.vrm) {
      newErrors.vrm = "Numer rejestracyjny jest wymagany";
    }
    
    setErrors(prev => ({ ...prev, vehicle: newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  // Walidacja danych osobowych
  const validatePersonalData = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!personalData.firstName) {
      newErrors.firstName = "Imię jest wymagane";
    }
    
    if (!personalData.lastName) {
      newErrors.lastName = "Nazwisko jest wymagane";
    }
    
    if (!personalData.phoneNumber) {
      newErrors.phoneNumber = "Numer telefonu jest wymagany";
    }
    
    if (!personalData.email || !/\S+@\S+\.\S+/.test(personalData.email)) {
      newErrors.email = "Wymagany poprawny adres email";
    }
    
    if (!personalData.identificationNumber || personalData.identificationNumber.length !== 11) {
      newErrors.identificationNumber = "Wymagany poprawny numer PESEL (11 cyfr)";
    }
    
    if (!personalData.street) {
      newErrors.street = "Ulica jest wymagana";
    }
    
    if (!personalData.city) {
      newErrors.city = "Miasto jest wymagane";
    }
    
    if (!personalData.postCode || !/^\d{2}-\d{3}$/.test(personalData.postCode)) {
      newErrors.postCode = "Wymagany poprawny kod pocztowy (format: XX-XXX)";
    }
    
    setErrors(prev => ({ ...prev, personal: newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  // Przejście do następnego kroku
  const goToNextStep = () => {
    if (currentStep === 1 && !validateVehicleData()) {
      return;
    }
    
    if (currentStep === 2 && !validatePersonalData()) {
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Przejście do poprzedniego kroku
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Wysłanie formularza
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Przygotowanie danych w odpowiednim formacie
      const policyData = {
        extApiNo: null,
        extReferenceNo: null,
        extTenderNo: null,
        sellerNodeCode: "PL_TEST_GAP_25",
        productCode: "5_DCGAP_MG25_GEN",
        saleInitiatedOn: new Date().toISOString().split('T')[0],
        signatureTypeCode: "AUTHORIZED_BY_SMS",
        confirmedByDefault: null,
        
        vehicleSnapshot: {
          purchasedOn: vehicleData.purchasedOn,
          modelCode: "342",
          categoryCode: "PC",
          usageCode: "STANDARD",
          mileage: vehicleData.mileage,
          firstRegisteredOn: new Date(vehicleData.firstRegisteredOn).toISOString(),
          evaluationDate: new Date().toISOString().split('T')[0],
          purchasePrice: 15000000, // To powinno być pobrane z kalkulacji
          purchasePriceNet: 15000000,
          purchasePriceVatReclaimableCode: "NO",
          usageTypeCode: "INDIVIDUAL",
          purchasePriceInputType: "VAT_INAPPLICABLE",
          vin: vehicleData.vin,
          vrm: vehicleData.vrm,
          owners: [{contact: {inheritFrom: "policyHolder"}}]
        },
        
        client: {
          policyHolder: {
            type: "person",
            phoneNumber: personalData.phoneNumber,
            firstName: personalData.firstName,
            lastName: personalData.lastName,
            email: personalData.email,
            identificationNumber: personalData.identificationNumber,
            address: {
              addressLine1: `${personalData.firstName} ${personalData.lastName}`,
              street: personalData.street,
              city: personalData.city,
              postCode: personalData.postCode,
              countryCode: "PL"
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
          TERM: paymentData.term,
          CLAIM_LIMIT: paymentData.claimLimit,
          PAYMENT_TERM: paymentData.paymentTerm,
          PAYMENT_METHOD: paymentData.paymentMethod
        },
        
        premium: 189000 // To powinno być pobrane z kalkulacji
      };
      
      console.log('Dane do wysłania:', policyData);
      
      // Tutaj byłoby wywołanie do API
      // const response = await fetch('/api/register-policy', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(policyData),
      // });
      
      // Symulacja odpowiedzi z API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sukces
      setIsCompleted(true);
      setCurrentStep(4);
      
    } catch (error) {
      console.error('Błąd podczas rejestracji polisy:', error);
      alert('Wystąpił błąd podczas przetwarzania zamówienia. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Zakup ubezpieczenia online</h1>
          
          {/* Stepper */}
          <div className="mb-8">
            <ol className="flex items-center w-full">
              <li className={`flex items-center ${currentStep >= 1 ? 'text-red-600' : 'text-gray-500'}`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-medium 
                  ${currentStep >= 1 ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gray-300'}`}>
                  1
                </span>
                <span className="ml-2 text-sm font-medium">Pojazd</span>
                <span className="flex-grow border-t border-gray-200 mx-4"></span>
              </li>
              <li className={`flex items-center ${currentStep >= 2 ? 'text-red-600' : 'text-gray-500'}`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-medium 
                  ${currentStep >= 2 ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gray-300'}`}>
                  2
                </span>
                <span className="ml-2 text-sm font-medium">Dane osobowe</span>
                <span className="flex-grow border-t border-gray-200 mx-4"></span>
              </li>
              <li className={`flex items-center ${currentStep >= 3 ? 'text-red-600' : 'text-gray-500'}`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-medium 
                  ${currentStep >= 3 ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gray-300'}`}>
                  3
                </span>
                <span className="ml-2 text-sm font-medium">Płatność</span>
                <span className="flex-grow border-t border-gray-200 mx-4"></span>
              </li>
              <li className={`flex items-center ${currentStep >= 4 ? 'text-red-600' : 'text-gray-500'}`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-medium 
                  ${currentStep >= 4 ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gray-300'}`}>
                  4
                </span>
                <span className="ml-2 text-sm font-medium">Potwierdzenie</span>
              </li>
            </ol>
          </div>
          
          {/* Formularze dla poszczególnych kroków */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            {/* Krok 1: Dane pojazdu */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Dane pojazdu</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data zakupu *
                    </label>
                    <input
                      type="date"
                      name="purchasedOn"
                      className={`w-full p-2 border ${errors.vehicle?.purchasedOn ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={vehicleData.purchasedOn}
                      onChange={handleVehicleChange}
                    />
                    {errors.vehicle?.purchasedOn && (
                      <p className="mt-1 text-sm text-red-500">{errors.vehicle.purchasedOn}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Przebieg (km) *
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={vehicleData.mileage}
                      onChange={handleVehicleChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data pierwszej rejestracji *
                    </label>
                    <input
                      type="date"
                      name="firstRegisteredOn"
                      className={`w-full p-2 border ${errors.vehicle?.firstRegisteredOn ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={vehicleData.firstRegisteredOn}
                      onChange={handleVehicleChange}
                    />
                    {errors.vehicle?.firstRegisteredOn && (
                      <p className="mt-1 text-sm text-red-500">{errors.vehicle.firstRegisteredOn}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numer VIN *
                    </label>
                    <input
                      type="text"
                      name="vin"
                      maxLength={17}
                      className={`w-full p-2 border ${errors.vehicle?.vin ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={vehicleData.vin}
                      onChange={handleVehicleChange}
                    />
                    {errors.vehicle?.vin && (
                      <p className="mt-1 text-sm text-red-500">{errors.vehicle.vin}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numer rejestracyjny *
                    </label>
                    <input
                      type="text"
                      name="vrm"
                      className={`w-full p-2 border ${errors.vehicle?.vrm ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={vehicleData.vrm}
                      onChange={handleVehicleChange}
                    />
                    {errors.vehicle?.vrm && (
                      <p className="mt-1 text-sm text-red-500">{errors.vehicle.vrm}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Krok 2: Dane osobowe */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Dane osobowe</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imię *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className={`w-full p-2 border ${errors.personal?.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={personalData.firstName}
                        onChange={handlePersonalChange}
                      />
                      {errors.personal?.firstName && (
                        <p className="mt-1 text-sm text-red-500">{errors.personal.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nazwisko *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className={`w-full p-2 border ${errors.personal?.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={personalData.lastName}
                        onChange={handlePersonalChange}
                      />
                      {errors.personal?.lastName && (
                        <p className="mt-1 text-sm text-red-500">{errors.personal.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numer telefonu *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="+48XXXXXXXXX"
                      className={`w-full p-2 border ${errors.personal?.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={personalData.phoneNumber}
                      onChange={handlePersonalChange}
                    />
                    {errors.personal?.phoneNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.personal.phoneNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres e-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      className={`w-full p-2 border ${errors.personal?.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={personalData.email}
                      onChange={handlePersonalChange}
                    />
                    {errors.personal?.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.personal.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PESEL *
                    </label>
                    <input
                      type="text"
                      name="identificationNumber"
                      maxLength={11}
                      className={`w-full p-2 border ${errors.personal?.identificationNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={personalData.identificationNumber}
                      onChange={handlePersonalChange}
                    />
                    {errors.personal?.identificationNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.personal.identificationNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ulica i numer *
                    </label>
                    <input
                      type="text"
                      name="street"
                      className={`w-full p-2 border ${errors.personal?.street ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={personalData.street}
                      onChange={handlePersonalChange}
                    />
                    {errors.personal?.street && (
                      <p className="mt-1 text-sm text-red-500">{errors.personal.street}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Miasto *
                      </label>
                      <input
                        type="text"
                        name="city"
                        className={`w-full p-2 border ${errors.personal?.city ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={personalData.city}
                        onChange={handlePersonalChange}
                      />
                      {errors.personal?.city && (
                        <p className="mt-1 text-sm text-red-500">{errors.personal.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kod pocztowy *
                      </label>
                      <input
                        type="text"
                        name="postCode"
                        placeholder="XX-XXX"
                        maxLength={6}
                        className={`w-full p-2 border ${errors.personal?.postCode ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={personalData.postCode}
                        onChange={handlePersonalChange}
                      />
                      {errors.personal?.postCode && (
                        <p className="mt-1 text-sm text-red-500">{errors.personal.postCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Krok 3: Opcje płatności */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Opcje ubezpieczenia i płatności</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Okres ubezpieczenia
                    </label>
                    <select
                      name="term"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={paymentData.term}
                      onChange={handlePaymentChange}
                    >
                      {termOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Limit odszkodowania
                    </label>
                    <select
                      name="claimLimit"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={paymentData.claimLimit}
                      onChange={handlePaymentChange}
                    >
                      {claimLimitOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Metoda płatności
                    </label>
                    <select
                      name="paymentMethod"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={paymentData.paymentMethod}
                      onChange={handlePaymentChange}
                    >
                      {paymentMethodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-md">
                    <h3 className="text-lg font-medium text-white mb-2">Podsumowanie płatności</h3>
                    <p className="text-gray-200">Składka ubezpieczeniowa: <span className="font-bold">1 890,00 zł</span></p>
                    <p className="text-sm text-gray-300 mt-1">Płatność jednorazowa</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Krok 4: Potwierdzenie */}
            {currentStep === 4 && (
              <div className="text-center py-6">
                {isCompleted ? (
                  <div>
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Zamówienie przyjęte!</h2>
                    <p className="text-gray-600 mb-8">
                      Dziękujemy za zakup ubezpieczenia. Potwierdzenie zostało wysłane na podany adres email.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Szczegóły zamówienia</h3>
                      <p className="text-gray-700">Numer polisy: <span className="font-medium">POL/2023/12345</span></p>
                      <p className="text-gray-700">Rodzaj ubezpieczenia: <span className="font-medium">GAP MAX</span></p>
                      <p className="text-gray-700">Okres ochrony: <span className="font-medium">
                        {termOptions.find(opt => opt.value === paymentData.term)?.label}
                      </span></p>
                      <p className="text-gray-700">Kwota: <span className="font-medium">1 890,00 zł</span></p>
                    </div>
                    <Button 
                      className="w-full md:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      onClick={() => router.push('/')}
                    >
                      Powrót do strony głównej
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Podsumowanie zamówienia</h2>
                    
                    <div className="space-y-4 text-left mb-8">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-md font-medium text-gray-800 mb-2">Pojazd</h3>
                        <p className="text-gray-700">Data zakupu: <span className="font-medium">{vehicleData.purchasedOn}</span></p>
                        <p className="text-gray-700">Numer VIN: <span className="font-medium">{vehicleData.vin}</span></p>
                        <p className="text-gray-700">Numer rejestracyjny: <span className="font-medium">{vehicleData.vrm}</span></p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-md font-medium text-gray-800 mb-2">Ubezpieczający</h3>
                        <p className="text-gray-700">{personalData.firstName} {personalData.lastName}</p>
                        <p className="text-gray-700">{personalData.street}</p>
                        <p className="text-gray-700">{personalData.postCode} {personalData.city}</p>
                        <p className="text-gray-700">Tel: {personalData.phoneNumber}</p>
                        <p className="text-gray-700">Email: {personalData.email}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-md font-medium text-gray-800 mb-2">Szczegóły ubezpieczenia</h3>
                        <p className="text-gray-700">Produkt: <span className="font-medium">GAP MAX</span></p>
                        <p className="text-gray-700">Okres ochrony: <span className="font-medium">
                          {termOptions.find(opt => opt.value === paymentData.term)?.label}
                        </span></p>
                        <p className="text-gray-700">Limit odszkodowania: <span className="font-medium">
                          {claimLimitOptions.find(opt => opt.value === paymentData.claimLimit)?.label}
                        </span></p>
                        <p className="text-gray-700">Metoda płatności: <span className="font-medium">
                          {paymentMethodOptions.find(opt => opt.value === paymentData.paymentMethod)?.label}
                        </span></p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-md">
                        <h3 className="text-md font-medium text-white mb-2">Płatność</h3>
                        <p className="text-gray-200">Składka ubezpieczeniowa: <span className="font-bold">1 890,00 zł</span></p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-red-600" required />
                        <span className="ml-2 text-sm text-gray-700">
                          Akceptuję <a href="#" className="text-red-600 underline">regulamin</a> i <a href="#" className="text-red-600 underline">politykę prywatności</a>.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Przyciski nawigacji */}
          {currentStep !== 4 || (currentStep === 4 && !isCompleted) ? (
            <div className="flex justify-between">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  disabled={isSubmitting}
                >
                  Wstecz
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => router.push('/gap')}
                >
                  Anuluj
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  onClick={goToNextStep}
                >
                  Dalej <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Przetwarzanie...' : 'Zamawiam i płacę'}
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 