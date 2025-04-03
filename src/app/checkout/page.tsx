"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { CalculationForm } from '@/components/checkout/CalculationForm';
import { PersonalForm } from '@/components/checkout/PersonalForm';
import { VehicleForm } from '@/components/checkout/VehicleForm';
import { Summary } from '@/components/checkout/Summary';
import { NeedsAnalysisForm } from '@/components/checkout/NeedsAnalysisForm';
import { SignatureForm } from '@/components/checkout/SignatureForm';
import {
  VehicleData,
  PersonalData,
  InsuranceVariant,
  PaymentData,
  CalculationResult,
  NeedsAnalysisData
} from '@/types/insurance';

const STEPS = [
  'introduction',
  'needs-analysis',
  'recommendation',
  'calculation',
  'vehicle',
  'personal',
  'payment',
  'summary'
] as const;

type Step = typeof STEPS[number];

// CheckoutContent component
const CheckoutContent = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  
  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);
  
  const [currentStep, setCurrentStep] = useState<Step>('introduction');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Initial states
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    make: '',
    model: '',
    modelCode: '342',
    categoryCode: 'PC',
    usageCode: 'STANDARD',
    evaluationDate: new Date().toISOString().split('T')[0],
    vehicleCategory: 'CAR',
    usageType: 'PRIVATE',
    registrationNumber: '',
    vinNumber: '',
    productionYear: new Date().getFullYear(),
    mileage: 1000,
    purchasePrice: 150000,
    purchasePriceNet: 150000,
    purchasePriceType: 'brutto',
    purchasePriceVatReclaimable: 'nie',
    firstRegisteredOn: new Date().toISOString().split('T')[0],
    purchasedOn: new Date().toISOString().split('T')[0],
    vin: '',
    vrm: ''
  });
  
  const [personalData, setPersonalData] = useState<PersonalData>({
    type: 'person',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    identificationNumber: '',
    phone: '',
    pesel: '',
    street: '',
    houseNumber: '',
    apartmentNumber: '',
    postalCode: '',
    city: '',
    address: {
      addressLine1: '',
      street: '',
      city: '',
      postCode: '',
      countryCode: 'PL'
    }
  });
  
  const [variant, setVariant] = useState<InsuranceVariant>({
    productCode: '5_DCGAP_MG25_GEN',
    sellerNodeCode: 'PL_TEST_GAP_25',
    signatureTypeCode: 'AUTHORIZED_BY_SMS',
    name: '',
    description: ''
  });
  
  const [paymentData, setPaymentData] = useState<PaymentData>({
    productCode: '5_DCGAP_F25_GEN',
    sellerNodeCode: 'PL_TEST_GAP_25',
    signatureTypeCode: 'AUTHORIZED_BY_SMS',
    paymentMethod: 'PM_PBC'
  });
  
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  
  // Walidacja
  const [errors, setErrors] = useState<{
    variant?: { [key: string]: string };
    calculation?: { [key: string]: string };
    personal?: { [key: string]: string };
    vehicle?: { [key: string]: string };
    payment?: { [key: string]: string };
    needsAnalysis?: { [key: string]: string };
  }>({});
  
  // Stan dla analizy potrzeb
  const [needsAnalysisData, setNeedsAnalysisData] = useState<NeedsAnalysisData>({
    isInterestedInGapInsurance: false,
    hasValidAcPolicy: false,
    isVehiclePrivileged: false,
    isVehicleLeased: false,
    isVehicleFinanced: false,
    isVehicleUsedCommercially: false
  });
  
  // Handle variant change
  const handleVariantChange = (data: InsuranceVariant) => {
    setVariant({
      ...data,
      name: data.name || '',
      description: data.description || ''
    });
  };
  
  const formatDate = (date: string | Date): string => {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  };

  // Handle vehicle change
  const handleVehicleDataChange = (data: VehicleData) => {
    setVehicleData({
      ...data,
      make: data.make || '',
      model: data.model || '',
      modelCode: data.modelCode || '',
      categoryCode: data.categoryCode || 'PC',
      usageCode: data.usageCode || 'STANDARD',
      evaluationDate: formatDate(data.evaluationDate || new Date()),
      vehicleCategory: data.vehicleCategory || 'CAR',
      usageType: data.usageType || 'PRIVATE',
      registrationNumber: data.registrationNumber || '',
      vinNumber: data.vinNumber || '',
      productionYear: data.productionYear || new Date().getFullYear(),
      firstRegisteredOn: formatDate(data.firstRegisteredOn || new Date()),
      purchasedOn: formatDate(data.purchasedOn || new Date()),
      vin: data.vin || '',
      vrm: data.vrm || '',
      purchasePrice: data.purchasePrice || 0,
      purchasePriceNet: data.purchasePriceNet || 0,
      purchasePriceType: data.purchasePriceType || 'brutto',
      purchasePriceVatReclaimable: data.purchasePriceVatReclaimable || 'nie',
      mileage: data.mileage || 0
    });
  };
  
  // Handle personal data change
  const handlePersonalDataChange = (data: PersonalData) => {
    setPersonalData({
      ...data,
      type: 'person',
      phoneNumber: data.phoneNumber || '',
      identificationNumber: data.identificationNumber || '',
      address: {
        addressLine1: data.address?.addressLine1 || '',
        street: data.address?.street || '',
        city: data.address?.city || '',
        postCode: data.address?.postCode || '',
        countryCode: 'PL'
      }
    });
  };
  
  // Handle payment data change
  const handlePaymentDataChange = (data: PaymentData) => {
    setPaymentData({
      ...data,
      productCode: data.productCode || '5_DCGAP_F25_GEN',
      sellerNodeCode: data.sellerNodeCode || 'PL_TEST_GAP_25',
      signatureTypeCode: data.signatureTypeCode || 'AUTHORIZED_BY_SMS',
      paymentMethod: data.paymentMethod || 'PM_PBC'
    });
  };
  
  // Handle calculation
  const handleCalculationResult = (result: CalculationResult) => {
    if (result) {
      setCalculationResult(result);
    }
  };
  
  // Handle needs analysis change
  const handleNeedsAnalysisChange = (newData: NeedsAnalysisData) => {
    setNeedsAnalysisData(newData);
  };
  
  // Validation functions
  const validateVariant = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!variant.productCode) {
      newErrors.productCode = "Wybór wariantu ubezpieczenia jest wymagany";
    }
    
    if (!variant.sellerNodeCode) {
      newErrors.sellerNodeCode = "Kod sprzedawcy jest wymagany";
    }

    if (!variant.signatureTypeCode) {
      newErrors.signatureTypeCode = "Typ podpisu jest wymagany";
    }
    
    setErrors(prev => ({ ...prev, variant: newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  const validateCalculation = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!calculationResult) {
      newErrors.calculation = "Kalkulacja ceny jest wymagana";
    }
    
    setErrors(prev => ({ ...prev, calculation: newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePersonalData = (data: PersonalData) => {
    const newErrors: { [key: string]: string } = {};
    
    if (!data.firstName) {
      newErrors.firstName = "Imię jest wymagane";
    }
    
    if (!data.lastName) {
      newErrors.lastName = "Nazwisko jest wymagane";
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Wymagany poprawny adres email";
    }
    
    if (!data.phone || !/^\+?\d{9,}$/.test(data.phone)) {
      newErrors.phone = "Wymagany poprawny numer telefonu";
    }
    
    if (!data.address.street) {
      newErrors.street = "Ulica jest wymagana";
    }
    
    if (!data.address.city) {
      newErrors.city = "Miasto jest wymagane";
    }
    
    if (!data.address.postCode || !/^\d{2}-\d{3}$/.test(data.address.postCode)) {
      newErrors.postCode = "Wymagany poprawny kod pocztowy (format: XX-XXX)";
    }
    
    return newErrors;
  };
  
  const validateVehicleData = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!vehicleData.make) {
      newErrors.make = "Marka pojazdu jest wymagana";
    }
    
    if (!vehicleData.model) {
      newErrors.model = "Model pojazdu jest wymagany";
    }

    if (!vehicleData.modelCode) {
      newErrors.modelCode = "Kod modelu jest wymagany";
    }

    if (!vehicleData.purchasedOn) {
      newErrors.purchasedOn = "Data zakupu jest wymagana";
    }
    
    if (!vehicleData.firstRegisteredOn) {
      newErrors.firstRegisteredOn = "Data pierwszej rejestracji jest wymagana";
    }

    if (!vehicleData.evaluationDate) {
      newErrors.evaluationDate = "Data wyceny jest wymagana";
    }
    
    if (!vehicleData.vin || vehicleData.vin.length !== 17) {
      newErrors.vin = "Wymagany poprawny numer VIN (17 znaków)";
    }
    
    if (!vehicleData.vrm) {
      newErrors.vrm = "Numer rejestracyjny jest wymagany";
    }
    
    if (!vehicleData.purchasePrice || vehicleData.purchasePrice <= 0) {
      newErrors.purchasePrice = "Cena zakupu pojazdu jest wymagana i musi być większa od 0";
    }

    if (!vehicleData.purchasePriceNet || vehicleData.purchasePriceNet <= 0) {
      newErrors.purchasePriceNet = "Cena zakupu netto jest wymagana i musi być większa od 0";
    }

    if (!vehicleData.mileage || vehicleData.mileage < 0) {
      newErrors.mileage = "Przebieg jest wymagany i nie może być ujemny";
    }

    if (!vehicleData.vehicleCategory) {
      newErrors.vehicleCategory = "Kategoria pojazdu jest wymagana";
    }

    if (!vehicleData.usageType) {
      newErrors.usageType = "Typ użytkowania jest wymagany";
    }
    
    setErrors(prev => ({ ...prev, vehicle: newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  const validateNeedsAnalysis = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!needsAnalysisData.isInterestedInGapInsurance) {
      newErrors.isInterestedInGapInsurance = "Musisz być zainteresowany ubezpieczeniem GAP, aby kontynuować";
    }
    
    if (!needsAnalysisData.hasValidAcPolicy) {
      newErrors.hasValidAcPolicy = "Musisz posiadać ważną polisę AC, aby kontynuować";
    }

    // Określanie dostępnych produktów
    if (needsAnalysisData.isVehiclePrivileged) {
      newErrors.isVehiclePrivileged = "Przepraszamy, ale pojazdy uprzywilejowane nie mogą zostać objęte ubezpieczeniem GAP";
    } else {
      // Aktualizacja wariantu ubezpieczenia na podstawie analizy potrzeb
      const newVariant: InsuranceVariant = {
        productCode: needsAnalysisData.isVehicleLeased ? "5_DCGAP_FG25_GEN" : "5_DCGAP_F25_GEN",
        sellerNodeCode: "PL_TEST_GAP_25",
        name: '',
        description: '',
        signatureTypeCode: 'AUTHORIZED_BY_SMS'
      };
      setVariant(newVariant);
    }
    
    setErrors(prev => ({ ...prev, needsAnalysis: newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  // Navigation functions
  const goToNextStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      const nextStep = STEPS[currentIndex + 1];
      
      // Walidacja przed przejściem do następnego kroku
      switch (currentStep) {
        case 'needs-analysis':
          if (validateNeedsAnalysis()) {
            setCurrentStep(nextStep);
          }
          break;
        case 'recommendation':
          setCurrentStep(nextStep);
          break;
        case 'calculation':
          if (validateCalculation()) {
            setCurrentStep(nextStep);
          }
          break;
        case 'vehicle':
          if (validateVehicleData()) {
            setCurrentStep(nextStep);
          }
          break;
        case 'personal':
          if (validatePersonalData(personalData)) {
            setCurrentStep(nextStep);
          }
          break;
        case 'payment':
          if (validateVariant()) {
            setCurrentStep(nextStep);
          }
          break;
        default:
          setCurrentStep(nextStep);
      }
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep !== 'introduction') {
      setCurrentStep(STEPS[STEPS.indexOf(currentStep) - 1]);
      // Update URL without page reload
      router.push(`/checkout?step=${STEPS.indexOf(currentStep)}`);
    }
  };
  
  // Add effect to handle URL params
  useEffect(() => {
    if (searchParams) {
      const step = searchParams.get('step');
      if (step) {
        const stepNumber = parseInt(step);
        if (stepNumber >= 1 && stepNumber <= 8) {
          setCurrentStep(STEPS[stepNumber - 1]);
        }
      }
    }
  }, [searchParams]);
  
  // Submit function
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Symulacja opóźnienia
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Symulacja sukcesu
      setIsCompleted(true);
      router.push('/checkout/success');
    } catch (error) {
      console.error('Błąd podczas przetwarzania:', error);
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'introduction':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Przygotuj się do zakupu ubezpieczenia GAP</h2>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
              <h3 className="text-lg font-semibold">Potrzebne dokumenty:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Kopia dowodu rejestracyjnego pojazdu</li>
                <li>Kopia aktualnej polisy AC</li>
                <li>Kopia faktury zakupu pojazdu</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  W następnym kroku przeprowadzimy krótką analizę Twoich potrzeb, 
                  aby dobrać najlepszy wariant ubezpieczenia GAP dla Ciebie.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setCurrentStep('needs-analysis')}
                  className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
                >
                  Rozpocznij
                </Button>
              </div>
            </div>
          </div>
        );

      case 'needs-analysis':
        return (
          <NeedsAnalysisForm
            data={needsAnalysisData}
            onChange={handleNeedsAnalysisChange}
            errors={errors.needsAnalysis}
          />
        );

      case 'recommendation':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Rekomendowany wariant ubezpieczenia</h2>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
              {needsAnalysisData.isVehicleUsedCommercially ? (
                <div>
                  <h3 className="text-xl font-semibold text-[#300FE6] mb-4">GAP FLEX GO</h3>
                  <p className="text-gray-700">
                    Na podstawie analizy Twoich potrzeb rekomendujemy wariant GAP FLEX GO, 
                    który jest idealny dla pojazdów używanych w celach zarobkowych.
                  </p>
                </div>
              ) : needsAnalysisData.isVehicleLeased || needsAnalysisData.isVehicleFinanced ? (
                <div>
                  <h3 className="text-xl font-semibold text-[#300FE6] mb-4">GAP FLEX</h3>
                  <p className="text-gray-700">
                    Ze względu na finansowanie zewnętrzne pojazdu, rekomendujemy wariant GAP FLEX, 
                    który zapewni optymalną ochronę w przypadku kredytu lub leasingu.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-[#300FE6] mb-4">GAP MAX</h3>
                  <p className="text-gray-700">
                    Dla Twojego pojazdu rekomendujemy wariant GAP MAX, 
                    który zapewni najszerszą ochronę wartości pojazdu.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => setCurrentStep('needs-analysis')}
                  variant="outline"
                >
                  Wróć
                </Button>
                <Button
                  onClick={() => {
                    // Ustaw rekomendowany wariant
                    const recommendedVariant = needsAnalysisData.isVehicleUsedCommercially
                      ? "5_DCGAP_FG25_GEN"
                      : needsAnalysisData.isVehicleLeased || needsAnalysisData.isVehicleFinanced
                      ? "5_DCGAP_F25_GEN"
                      : "5_DCGAP_M25_GEN";
                    
                    handleVariantChange({
                      ...variant,
                      productCode: recommendedVariant
                    });
                    setCurrentStep('calculation');
                  }}
                  className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
                >
                  Przejdź do kalkulacji
                </Button>
              </div>
            </div>
          </div>
        );

      case 'calculation':
        return (
          <CalculationForm
            vehicleData={{
              make: vehicleData.make,
              model: vehicleData.model,
              purchasePrice: vehicleData.purchasePrice
            }}
            onNext={handleCalculationResult}
          />
        );

      case 'vehicle':
        return (
          <VehicleForm
            data={vehicleData}
            onChange={handleVehicleDataChange}
            errors={errors.vehicle}
          />
        );

      case 'personal':
        return (
          <PersonalForm
            data={personalData}
            onChange={handlePersonalDataChange}
            errors={errors.personal}
          />
        );

      case 'payment':
        return (
          <SignatureForm
            data={paymentData}
            onChange={handlePaymentDataChange}
            errors={errors?.payment}
          />
        );

      case 'summary':
        return (
          <Summary
            variant={variant}
            vehicleData={vehicleData}
            personalData={personalData}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
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
                style={{ width: `${((STEPS.indexOf(currentStep) + 1) / 8) * 100}%` }}
              />

              {STEPS.map((step, index) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white font-bold transition-all duration-300
                      ${currentStep === step ? 'bg-[#300FE6] scale-110' : 'bg-gray-300'}`}
                  >
                    {currentStep > step ? <CheckCircle2 size={20} /> : index + 1}
                  </div>
                  <div className="text-center">
                    <p className={`font-medium ${currentStep >= step ? 'text-[#300FE6]' : 'text-gray-400'}`}>
                      {step === 'introduction' && 'Wstęp'}
                      {step === 'needs-analysis' && 'Analiza potrzeb'}
                      {step === 'recommendation' && 'Rekomendacja'}
                      {step === 'calculation' && 'Kalkulacja'}
                      {step === 'vehicle' && 'Dane pojazdu'}
                      {step === 'personal' && 'Dane osobowe'}
                      {step === 'payment' && 'Podpis'}
                      {step === 'summary' && 'Podsumowanie'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Formularz - treść */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              {renderCurrentStep()}
            </div>

            {/* Przyciski nawigacyjne */}
            <div className="flex justify-between">
              {currentStep !== 'introduction' && (
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  disabled={isSubmitting}
                  className="flex items-center"
                >
                  <ArrowLeft size={16} className="mr-1" /> Wstecz
                </Button>
              )}
              
              {currentStep !== 'summary' && currentStep !== 'introduction' && (
                <Button
                  className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
                  onClick={goToNextStep}
                >
                  Dalej <ChevronRight size={16} className="ml-1" />
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

// Główny komponent strony
const CheckoutPage = () => {
  return (
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
  );
};

export default CheckoutPage; 
