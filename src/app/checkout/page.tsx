"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { InsuranceVariantForm } from '@/components/checkout/InsuranceVariantForm';
import { CalculationForm } from '@/components/checkout/CalculationForm';
import { VehicleForm } from '@/components/checkout/VehicleForm';
import { Summary } from '@/components/checkout/Summary';
import { convertToApiFormat } from '@/components/checkout/InsuredPersonsForm';
import { CheckoutFinalForm } from '@/components/checkout/CheckoutFinalForm';
import { VehicleData } from '@/types/vehicle';
import Footer from '@/components/Footer';

// Zaktualizowane interfejsy 
interface InsuranceVariant {
  productCode: string;
  sellerNodeCode: string;
  signatureTypeCode: string;
  options: Array<{
    code: string;
    value: string | number;
  }>;
  vehicleTypes?: string[];
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

interface InsuredData {
  inheritFrom?: string;
  personData?: PersonalData;
}

interface InsuredPersonsData {
  policyHolder: PersonalData;
  insured: InsuredData;
  vehicleOwner: InsuredData;
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

// CheckoutContent component
const CheckoutContent = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  
  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Nowy stan dla wariantu ubezpieczenia
  const [insuranceVariant, setInsuranceVariant] = useState<InsuranceVariant>({
    productCode: "5_DCGAP_MG25_GEN",
    sellerNodeCode: "PL_TEST_GAP_25",
    signatureTypeCode: "AUTHORIZED_BY_SMS",
    options: [],
    vehicleTypes: ['PC']
  });
  
  // Stany dla pozostałych formularzy
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    vin: '',
    vrm: '',
    categoryCode: 'PC',
    usageCode: 'STANDARD',
    firstRegisteredOn: '',
    purchasedOn: '',
    purchasePrice: 0,
    purchasePriceInputType: 'WITH_VAT',
    purchasePriceVatReclaimableCode: 'NO',
    usageTypeCode: 'INDIVIDUAL',
    mileage: 0,
    evaluationDate: '',
    purchasePriceNet: 0,
    modelCode: '',
    make: '',
    makeId: '',
    modelId: '',
    model: ''
  });
  
  // Nowy stan dla relacji między osobami w polisie
  const [insuredPersonsData, setInsuredPersonsData] = useState<InsuredPersonsData>({
    policyHolder: {
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
    },
    insured: {
      inheritFrom: 'policyHolder'
    },
    vehicleOwner: {
      inheritFrom: 'policyHolder'
    }
  });
  
  const [paymentData, setPaymentData] = useState<PaymentData>({
    term: "T_36",
    claimLimit: "CL_150000",
    paymentTerm: "PT_LS",
    paymentMethod: "PM_PBC"
  });
  
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  // Walidacja
  const [errors, setErrors] = useState<{
    variant?: { [key: string]: string };
    calculation?: { [key: string]: string };
    personal?: { [key: string]: string };
    vehicle?: { [key: string]: string };
    payment?: { [key: string]: string };
  }>({});
  
  // Nowy stan dla danych klienta
  const [customerData, setCustomerData] = useState<PersonalData>({
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
  });
  
  // Efekt synchronizujący początkowe dane klienta z danymi ubezpieczającego
  useEffect(() => {
    setCustomerData(insuredPersonsData.policyHolder);
  }, [insuredPersonsData.policyHolder]);
  
  // Handle variant change
  const handleVariantChange = (newVariant: InsuranceVariant) => {
    setInsuranceVariant(newVariant);
  };
  
  // Handle vehicle change
  const handleVehicleChange = (newData: VehicleData) => {
    setVehicleData(newData);
  };
  
  // Handle payment data change
  const handlePaymentDataChange = (newData: PaymentData) => {
    setPaymentData(newData);
  };
  
  // Handle calculation
  const handleCalculation = (result: CalculationResult) => {
    setCalculationResult(result);
  };
  
  // Validation functions
  const validateVariant = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    console.log('Walidacja wariantu:', insuranceVariant);
    
    if (!insuranceVariant.productCode) {
      newErrors.productCode = "Wybór wariantu ubezpieczenia jest wymagany";
    }
    
    setErrors(prev => ({ ...prev, variant: newErrors }));
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Wynik walidacji:', isValid, 'Błędy:', newErrors);
    return isValid;
  };
  
  const validateCalculation = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!calculationResult) {
      newErrors.calculation = "Kalkulacja ceny jest wymagana";
    }
    
    setErrors(prev => ({ ...prev, calculation: newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePersonalData = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!insuredPersonsData.policyHolder.firstName) {
      newErrors.firstName = "Imię jest wymagane";
    }
    
    if (!insuredPersonsData.policyHolder.lastName) {
      newErrors.lastName = "Nazwisko jest wymagane";
    }
    
    if (!insuredPersonsData.policyHolder.phoneNumber) {
      newErrors.phoneNumber = "Numer telefonu jest wymagany";
    }
    
    if (!insuredPersonsData.policyHolder.email || !/\S+@\S+\.\S+/.test(insuredPersonsData.policyHolder.email)) {
      newErrors.email = "Wymagany poprawny adres email";
    }
    
    if (!insuredPersonsData.policyHolder.identificationNumber || insuredPersonsData.policyHolder.identificationNumber.length !== 11) {
      newErrors.identificationNumber = "Wymagany poprawny numer PESEL (11 cyfr)";
    }
    
    if (!insuredPersonsData.policyHolder.address.street) {
      newErrors.street = "Ulica jest wymagana";
    }
    
    if (!insuredPersonsData.policyHolder.address.city) {
      newErrors.city = "Miasto jest wymagane";
    }
    
    if (!insuredPersonsData.policyHolder.address.postCode || !/^\d{2}-\d{3}$/.test(insuredPersonsData.policyHolder.address.postCode)) {
      newErrors.postCode = "Wymagany poprawny kod pocztowy (format: XX-XXX)";
    }
    
    setErrors(prev => ({ ...prev, personal: newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
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
    
    if (!vehicleData.purchasePrice || vehicleData.purchasePrice <= 0) {
      newErrors.purchasePrice = "Cena zakupu pojazdu jest wymagana";
    }

    if (vehicleData.mileage < 0) {
      newErrors.mileage = "Przebieg nie może być ujemny";
    }
    
    if (typeof vehicleData.mileage !== 'number' || isNaN(vehicleData.mileage)) {
      newErrors.mileage = "Przebieg pojazdu jest wymagany";
    }
    
    setErrors(prev => ({ ...prev, vehicle: newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  // Navigation functions
  const goToNextStep = () => {
    console.log('Próba przejścia do następnego kroku. Obecny krok:', currentStep);
    
    if (currentStep === 1) {
      const isValid = validateVariant();
      console.log('Walidacja kroku 1:', isValid);
      if (!isValid) return;
    }
    
    if (currentStep === 2 && !validateVehicleData()) {
      return;
    }
    
    if (currentStep === 3 && !validateCalculation()) {
      return;
    }
    
    if (currentStep === 4 && !validatePersonalData()) {
      return;
    }
    
    if (currentStep < 5) {  // Zmieniam maksymalny krok z 6 na 5
      console.log('Przechodzę do kroku:', currentStep + 1);
      setCurrentStep(currentStep + 1);
      router.push(`/checkout?step=${currentStep + 1}`);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Update URL without page reload
      router.push(`/checkout?step=${currentStep - 1}`);
    }
  };
  
  // Add effect to handle URL params
  useEffect(() => {
    if (searchParams) {
      const step = searchParams.get('step');
      if (step) {
        const stepNumber = parseInt(step);
        if (stepNumber >= 1 && stepNumber <= 5) {
          setCurrentStep(stepNumber);
        }
      }
    }
  }, [searchParams]);
  
  // Submit function
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Przygotowanie danych w odpowiednim formacie API
      const apiFormatData = convertToApiFormat(insuredPersonsData);
      
      const policyData = {
        extApiNo: null,
        extReferenceNo: null,
        extTenderNo: null,
        sellerNodeCode: insuranceVariant.sellerNodeCode,
        productCode: insuranceVariant.productCode,
        saleInitiatedOn: new Date().toISOString().split('T')[0],
        signatureTypeCode: insuranceVariant.signatureTypeCode,
        confirmedByDefault: null,
        
        vehicleSnapshot: {
          ...apiFormatData.vehicleSnapshot,
          purchasedOn: vehicleData.purchasedOn,
          modelCode: vehicleData.modelCode,
          categoryCode: vehicleData.categoryCode,
          usageCode: vehicleData.usageCode,
          mileage: vehicleData.mileage,
          firstRegisteredOn: new Date(vehicleData.firstRegisteredOn).toISOString(),
          evaluationDate: new Date().toISOString().split('T')[0],
          purchasePrice: Math.round(vehicleData.purchasePrice * 100),
          purchasePriceNet: Math.round(vehicleData.purchasePriceNet * 100),
          purchasePriceVatReclaimableCode: vehicleData.purchasePriceVatReclaimableCode,
          usageTypeCode: vehicleData.usageTypeCode,
          purchasePriceInputType: vehicleData.purchasePriceInputType,
          vin: vehicleData.vin,
          vrm: vehicleData.vrm,
        },
        
        client: apiFormatData.client,
        
        options: {
          TERM: paymentData.term,
          CLAIM_LIMIT: paymentData.claimLimit,
          PAYMENT_TERM: paymentData.paymentTerm,
          PAYMENT_METHOD: paymentData.paymentMethod
        },
        
        premium: calculationResult ? Math.round(calculationResult.premium * 100) : 0
      };
      
      console.log('Wysyłanie danych formularza...', policyData);
      
      // Wysyłanie maila z potwierdzeniem
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalData: insuredPersonsData.policyHolder,
          vehicleData,
          paymentData,
          calculationResult,
          policyData // dodajemy pełne dane polisy
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        throw new Error(errorData.details || 'Błąd podczas wysyłania maila');
      }
      
      // Sukces
      setIsCompleted(true);
    } catch (error) {
      console.error('Błąd podczas przetwarzania zamówienia:', error);
      alert('Wystąpił błąd podczas przetwarzania zamówienia. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render success component
  const renderSuccess = () => {
    if (!isCompleted) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Formularz został wysłany!</h2>
            <p className="text-gray-600 mb-4">
              {paymentData.paymentMethod === 'PM_BLIK' ? (
                "Za chwilę zostaniesz przekierowany do płatności BLIK. Sprawdź powiadomienie w aplikacji swojego banku."
              ) : (
                "Za chwilę otrzymasz e-mail z danymi do przelewu. Sprawdź swoją skrzynkę odbiorczą."
              )}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Nasz konsultant skontaktuje się z Tobą w ciągu 24 godzin w celu potwierdzenia zamówienia.
            </p>
            <Button 
              className="bg-[#300FE6] hover:bg-[#2208B0] text-white w-full mb-3"
              onClick={() => {
                if (paymentData.paymentMethod === 'PM_BLIK') {
                  // Tutaj można dodać przekierowanie do płatności BLIK
                  window.location.href = '/payment/blik';
                } else {
                  router.push('/');
                }
              }}
            >
              {paymentData.paymentMethod === 'PM_BLIK' ? 'Przejdź do płatności' : 'Powrót do strony głównej'}
            </Button>
            {paymentData.paymentMethod === 'PM_PBC' && (
              <p className="text-xs text-gray-400">
                Pamiętaj, aby w tytule przelewu podać numer zamówienia, który otrzymasz w e-mailu.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Funkcje do obsługi akcji w CheckoutFinalForm
  const handleSaveOffer = () => {
    console.log('Zapisywanie oferty...');
    alert('Oferta została zapisana!');
  };
  
  const handleContinueToSummary = () => {
    setCurrentStep(5); // Zmieniamy z 6 na 5
    router.push(`/checkout?step=5`); // Zmieniamy z 6 na 5
  };

  const renderStepContent = () => {
    if (isCompleted) {
      return renderSuccess();
    }
    
    switch (currentStep) {
      case 1:
        return (
          <InsuranceVariantForm
            data={insuranceVariant}
            onChange={handleVariantChange}
            errors={errors.variant}
          />
        );
      case 2:
        return (
          <VehicleForm
            data={vehicleData}
            onChange={handleVehicleChange}
            errors={errors.vehicle}
          />
        );
      case 3:
        return (
          <CalculationForm
            vehicleData={vehicleData}
            insuranceVariant={insuranceVariant}
            paymentData={paymentData}
            onCalculate={handleCalculation}
            onVehicleChange={handleVehicleChange}
            onPaymentChange={handlePaymentDataChange}
            calculationResult={calculationResult}
            errors={errors.calculation}
          />
        );
      case 4:
        return (
          <CheckoutFinalForm
            data={{
              policyHolder: insuredPersonsData.policyHolder,
              insured: insuredPersonsData.insured,
              vehicleOwner: insuredPersonsData.vehicleOwner,
              customer: customerData
            }}
            onChange={(newData) => {
              // Aktualizuj dane klienta
              setCustomerData(newData.customer);
              
              // Aktualizuj dane osób w polisie
              setInsuredPersonsData({
                policyHolder: newData.policyHolder,
                insured: newData.insured,
                vehicleOwner: newData.vehicleOwner
              });
            }}
            onSaveOffer={handleSaveOffer}
            onContinue={handleContinueToSummary}
            errors={errors.personal}
          />
        );
      case 5: // Zmieniamy z 6 na 5
        return (
          <Summary
            vehicleData={vehicleData}
            personalData={customerData}
            paymentData={paymentData}
            calculationResult={calculationResult}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            termsAgreed={termsAgreed}
            onTermsChange={setTermsAgreed}
            onPaymentChange={handlePaymentDataChange}
          />
        );
      default:
        return <div>Nieznany krok</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#E1EDFF]/30">
      {renderSuccess()}
      
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
            <div className="flex justify-between mb-10 px-4 relative">
              {/* Linie łączące */}
              <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200" />
              <div 
                className="absolute top-5 left-0 right-0 h-[2px] bg-[#300FE6] transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />

              {[
                { number: 1, title: "WARIANT" },
                { number: 2, title: "POJAZD" },
                { number: 3, title: "KALKULACJA" },
                { number: 4, title: "KLIENT" },
                { number: 5, title: "PODSUMOWANIE" }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white font-bold transition-all duration-300
                      ${currentStep >= step.number 
                        ? 'bg-[#300FE6] scale-110' 
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
              {renderStepContent()}
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
              
              {currentStep < 3 ? (
                <Button
                  className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
                  onClick={goToNextStep}
                >
                  Dalej <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : currentStep === 3 ? (
                <Button
                  className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
                  onClick={goToNextStep}
                >
                  Dalej <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : null}
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

// Główny komponent strony
const CheckoutPage = () => {
  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-[#300FE6] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Ładowanie formularza...</p>
          </div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </>
  );
};

export default CheckoutPage; 
