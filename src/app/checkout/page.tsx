"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

// Typy danych dla formularza
interface VehicleData {
  purchasedOn: string;
  mileage: number;
  firstRegisteredOn: string;
  vin: string;
  vrm: string; // numer rejestracyjny
  make?: string; // dodane pole marki
  model?: string; // dodane pole modelu
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

// Dodaję interfejs dla wyników kalkulacji
interface CalculationResult {
  premium: number;
  details: {
    productName: string;
    coveragePeriod: string;
    vehicleValue: number;
    maxCoverage: string;
  };
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
  const searchParams = useSearchParams();
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
  
  // Dodaję brakujące stany
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  // Walidacja pól formularza
  const [errors, setErrors] = useState<{
    vehicle?: { [key: string]: string };
    personal?: { [key: string]: string };
    payment?: { [key: string]: string };
  }>({});
  
  // Pobieranie danych z parametrów URL lub localStorage
  useEffect(() => {
    // Pobranie danych z localStorage jeśli są
    const savedCalculationData = localStorage.getItem('gapCalculationResult');
    
    if (savedCalculationData) {
      try {
        const parsedData = JSON.parse(savedCalculationData);
        setCalculationResult(parsedData);
      } catch (e) {
        console.error('Błąd parsowania danych kalkulacji:', e);
      }
    } else {
      // Jeśli nie ma danych w localStorage, ustaw przykładowe dane
      // W rzeczywistej aplikacji powinno to być pobrane z API lub przekazane z poprzedniej strony
      setCalculationResult({
        premium: 450,
        details: {
          productName: "Ubezpieczenie GAP Fakturowy",
          coveragePeriod: "36 miesięcy",
          vehicleValue: 50000,
          maxCoverage: "100 000 PLN"
        }
      });
      
      // Można również pobrać parametry z URL, jeśli są tam przekazywane
      const premiumParam = searchParams.get('premium');
      if (premiumParam) {
        setCalculationResult(prev => ({
          ...prev!,
          premium: parseInt(premiumParam, 10)
        }));
      }
    }
    
    // Dodanie przykładowych danych pojazdu, jeśli nie zostały ustawione
    setVehicleData(prev => ({
      ...prev,
      make: prev.make || "Volkswagen",
      model: prev.model || "Golf",
    }));
    
  }, [searchParams]);
  
  // Funkcje obsługujące zmiany w formularzu
  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };
  
  // Poprawiam funkcję handlePaymentChange
  const handlePaymentChange = (e: { name: string; value: string }) => {
    setPaymentData(prev => ({
      ...prev,
      [e.name]: e.value
    }));
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#E1EDFF]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Nagłówek strony */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Formularz zakupu ubezpieczenia GAP</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Wypełnij poniższy formularz, aby sfinalizować zakup ubezpieczenia
          </p>
        </div>

        {/* Proces zakupowy */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Pasek postępu */}
          <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] h-2 w-full"></div>
          
          <div className="p-8">
            {/* Kroki procesu */}
            <div className="flex justify-between mb-10 px-4">
              {[
                { number: 1, title: "Dane pojazdu" },
                { number: 2, title: "Dane osobowe" },
                { number: 3, title: "Metoda płatności" },
                { number: 4, title: "Podsumowanie" }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white font-bold 
                      ${currentStep >= step.number 
                        ? 'bg-[#300FE6]' 
                        : 'bg-gray-300'}`}
                  >
                    {currentStep > step.number ? <CheckCircle2 size={20} /> : step.number}
                  </div>
                  <div className="text-center">
                    <p className={`font-medium ${currentStep >= step.number ? 'text-[#300FE6]' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Formularz - treść */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
                      <span className="text-[#FF8E3D] font-bold">1</span>
                    </div>
                    Dane pojazdu
                  </h2>
                  
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

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
                      <span className="text-[#FF8E3D] font-bold">2</span>
                    </div>
                    Dane osobowe
                  </h2>
                  
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

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
                      <span className="text-[#FF8E3D] font-bold">3</span>
                    </div>
                    Metoda płatności
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paymentMethodOptions.map((option) => (
                      <div 
                        key={option.value}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all
                          ${paymentData.paymentMethod === option.value 
                            ? 'border-[#300FE6] bg-[#300FE6]/5' 
                            : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => handlePaymentChange({ name: 'paymentMethod', value: option.value })}
                      >
                        <h3 className="font-semibold text-lg mb-2">{option.label}</h3>
                        <p className="text-gray-600 text-sm">
                          {option.value === 'PM_BT' 
                            ? 'Otrzymasz dane do przelewu po złożeniu zamówienia' 
                            : 'Zostaniesz przekierowany do bezpiecznej płatności online'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
                      <span className="text-[#FF8E3D] font-bold">4</span>
                    </div>
                    Podsumowanie zamówienia
                  </h2>
                  
                  {/* Boks podsumowania */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <div className="flex items-start mb-8">
                      <div className="bg-[#300FE6]/10 p-3 rounded-full mr-4">
                        <CheckCircle2 className="h-6 w-6 text-[#300FE6]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {calculationResult?.details.productName || "Ubezpieczenie GAP"}
                        </h3>
                        <p className="text-gray-600">
                          Ubezpieczenie zapewniające pełną ochronę wartości pojazdu
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Pojazd</p>
                        <p className="font-medium">{vehicleData.make} {vehicleData.model}</p>
                        <p className="text-sm text-gray-600">{vehicleData.vrm}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Wartość pojazdu</p>
                        <p className="font-medium">{calculationResult?.details.vehicleValue?.toLocaleString('pl-PL')} PLN</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Okres ubezpieczenia</p>
                        <p className="font-medium">{calculationResult?.details.coveragePeriod}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Maksymalne pokrycie</p>
                        <p className="font-medium">{calculationResult?.details.maxCoverage}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-600">Składka ubezpieczeniowa</p>
                        <p className="font-medium">{calculationResult?.premium?.toLocaleString('pl-PL')} PLN</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold">Łączna kwota do zapłaty</p>
                        <p className="text-2xl font-bold text-[#300FE6]">{calculationResult?.premium?.toLocaleString('pl-PL')} PLN</p>
                      </div>
                      
                      <div className="mt-6 p-4 bg-[#E1EDFF] rounded-lg">
                        <p className="text-[#300FE6] font-medium">
                          Metoda płatności: {paymentData.paymentMethod === 'PM_BT' ? 'Przelew bankowy' : 'Płatność online'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Zgoda na warunki */}
                  <div className="flex items-start mb-6">
                    <input
                      type="checkbox"
                      id="termsAgreement"
                      className="mt-1 mr-2"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                    />
                    <label htmlFor="termsAgreement" className="text-gray-700">
                      Zapoznałem się i akceptuję <a href="#" className="text-[#300FE6] hover:underline">regulamin</a> oraz 
                      <a href="#" className="text-[#300FE6] hover:underline"> politykę prywatności</a>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Przyciski nawigacyjne */}
            <div className="flex justify-between">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  disabled={isSubmitting}
                  className="flex items-center"
                >
                  <ArrowLeft size={16} className="mr-1" /> Wstecz
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => router.push('/gap')}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Anuluj
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button
                  className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
                  onClick={goToNextStep}
                >
                  Dalej <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !termsAgreed}
                >
                  {isSubmitting ? 'Przetwarzanie...' : 'Zamawiam i płacę'}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Informacje o bezpieczeństwie */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-gray-600">Bezpieczne połączenie SSL</p>
          </div>
          <p className="text-sm text-gray-500">
            Twoje dane są chronione i bezpieczne. Używamy najnowszych technologii szyfrowania.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 