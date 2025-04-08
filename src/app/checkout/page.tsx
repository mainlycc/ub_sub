"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { InsuranceVariantForm } from '@/components/checkout/InsuranceVariantForm';
import { CalculationForm } from '@/components/checkout/CalculationForm';
import { PersonalForm } from '@/components/checkout/PersonalForm';
import { VehicleForm } from '@/components/checkout/VehicleForm';
import { Summary } from '@/components/checkout/Summary';
import { InsuranceOptionsForm } from '@/components/checkout/InsuranceOptionsForm';
import {
  InsuranceVariant,
  VehicleData,
  PersonalData,
  InsuranceOptions,
  CalculationResult,
  SummaryData
} from '@/types/checkout';

/* eslint-disable @typescript-eslint/no-unused-vars */
// import { ShieldCheck, TrendingDown, DollarSign } from "lucide-react";
/* eslint-enable @typescript-eslint/no-unused-vars */

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
    signatureTypeCode: "AUTHORIZED_BY_SMS"
  });
  
  // Stany dla pozostałych formularzy
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    category: "PC",
    usage: "STANDARD",
    vin: "",
    vrm: "",
    model: "",
    mileage: 1000,
    firstRegisteredOn: "",
    purchasedOn: new Date().toISOString().split('T')[0],
    purchasePrice: 0,
    purchasePriceNet: 0,
    purchasePriceVatReclaimableCode: "NO",
    usageTypeCode: "INDIVIDUAL",
    purchasePriceInputType: "VAT_INAPPLICABLE",
    modelCode: "",
    categoryCode: "PC",
    usageCode: "STANDARD",
    evaluationDate: new Date().toISOString().split('T')[0]
  });
  
  const [personalData, setPersonalData] = useState<PersonalData>({
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
  
  const [paymentData, setPaymentData] = useState<InsuranceOptions>({
    TERM: "T_36",
    CLAIM_LIMIT: "CL_150000",
    PAYMENT_TERM: "PT_LS",
    PAYMENT_METHOD: "PM_PBC"
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
  
  // Nowy stan dla ścieżek inputów
  const [inputPaths, setInputPaths] = useState<{
    vehicle: Array<{
      field: string;
      requiredForCalculation: boolean;
      requiredForConfirmation: boolean;
      step: string;
    }>;
    contact: Array<{
      field: string;
      requiredForCalculation: boolean;
      requiredForConfirmation: boolean;
      step: string;
    }>;
  } | null>(null);
  
  // Handle variant change
  const handleVariantChange = (data: InsuranceVariant) => {
    setInsuranceVariant(data);
  };
  
  // Handle vehicle change
  const handleVehicleChange = (data: VehicleData) => {
    setVehicleData(data);
  };
  
  // Handle personal data change
  const handlePersonalDataChange = (data: PersonalData) => {
    setPersonalData(data);
  };
  
  // Handle payment data change
  const handlePaymentDataChange = (data: InsuranceOptions) => {
    setPaymentData(data);
  };
  
  // Handle calculation
  const handleCalculation = (result: CalculationResult) => {
    setCalculationResult(result);
  };
  
  // Funkcja do obsługi zmiany ścieżek inputów
  const handleInputPathsChange = (paths: typeof inputPaths) => {
    setInputPaths(paths);
    // Możemy tutaj dodać dodatkową logikę, np. resetowanie niektórych pól formularza
    // w zależności od wybranego produktu
  };
  
  // Validation functions
  const validateVariant = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!insuranceVariant.productCode) {
      newErrors.productCode = "Wybór wariantu ubezpieczenia jest wymagany";
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
    
    if (!personalData.address.street) {
      newErrors.street = "Ulica jest wymagana";
    }
    
    if (!personalData.address.city) {
      newErrors.city = "Miasto jest wymagane";
    }
    
    if (!personalData.address.postCode || !/^\d{2}-\d{3}$/.test(personalData.address.postCode)) {
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
    
    setErrors(prev => ({ ...prev, vehicle: newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStep === 1 && !validateVariant()) {
      return;
    }
    
    if (currentStep === 2 && !validateCalculation()) {
      return;
    }
    
    if (currentStep === 3 && !validateVehicleData()) {
      return;
    }
    
    if (currentStep === 4 && !validatePersonalData()) {
      return;
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      // Update URL without page reload
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
      console.log('Rozpoczynam proces zakupu polisy...');
      
      // Funkcja pomocnicza do sprawdzania i konwersji kwot
      const toCents = (amount: number) => {
        // Jeśli kwota > 10000000 (100 000 zł), zakładamy że już jest w groszach
        if (amount > 10000000) return amount;
        return Math.round(amount * 100); // Konwersja na grosze
      };
      
      // 1. Kalkulacja składki (Premium calculation)
      console.log('Krok 1: Kalkulacja składki');
      const calculationData = {
        sellerNodeCode: insuranceVariant.sellerNodeCode,
        productCode: insuranceVariant.productCode,
        signatureTypeCode: insuranceVariant.signatureTypeCode,
        saleInitiatedOn: new Date().toISOString().split('T')[0], // Aktualna data
        
        vehicleSnapshot: {
          purchasedOn: vehicleData.purchasedOn,
          modelCode: vehicleData.modelCode || "342",
          categoryCode: vehicleData.categoryCode,
          usageCode: vehicleData.usageCode,
          mileage: vehicleData.mileage,
          firstRegisteredOn: vehicleData.firstRegisteredOn,
          evaluationDate: vehicleData.evaluationDate || vehicleData.purchasedOn,
          purchasePrice: toCents(vehicleData.purchasePrice), // Bezpieczna konwersja
          purchasePriceNet: toCents(vehicleData.purchasePriceNet),
          purchasePriceVatReclaimableCode: vehicleData.purchasePriceVatReclaimableCode,
          usageTypeCode: vehicleData.usageTypeCode,
          purchasePriceInputType: vehicleData.purchasePriceInputType,
          vin: vehicleData.vin,
          vrm: vehicleData.vrm
        },
        
        options: {
          TERM: paymentData.TERM,
          CLAIM_LIMIT: paymentData.CLAIM_LIMIT,
          PAYMENT_TERM: paymentData.PAYMENT_TERM,
          PAYMENT_METHOD: paymentData.PAYMENT_METHOD
        }
      };

      console.log('Dane do kalkulacji:', JSON.stringify(calculationData, null, 2));
      
      // Wywołanie kalkulacji
      const calculationResponse = await fetch('/api/calculate-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calculationData),
      });

      if (!calculationResponse.ok) {
        const errorData = await calculationResponse.json();
        console.error('Błąd podczas kalkulacji składki:', {
          status: calculationResponse.status,
          errorData
        });
        throw new Error(`Błąd podczas kalkulacji składki: ${errorData.error || calculationResponse.statusText}`);
      }

      const calculationResult = await calculationResponse.json();
      console.log('Wynik kalkulacji:', calculationResult);
      
      // Jeśli nie mamy jeszcze rezultatu kalkulacji, zapisujemy go
      if (!calculationResult) {
        handleCalculation(calculationResult);
      }
      
      // 2. Blokowanie polisy (Lock)
      console.log('Krok 2: Blokowanie polisy');
      const lockData = {
        ...calculationData,
        client: {
          policyHolder: {
            type: personalData.type,
            phoneNumber: personalData.phoneNumber,
            firstName: personalData.firstName,
            lastName: personalData.lastName,
            email: personalData.email,
            identificationNumber: personalData.identificationNumber,
            address: {
              addressLine1: personalData.address.addressLine1 || `${personalData.firstName} ${personalData.lastName}`,
              street: personalData.address.street,
              city: personalData.address.city,
              postCode: personalData.address.postCode,
              countryCode: personalData.address.countryCode
            }
          },
          insured: {
            inheritFrom: "policyHolder"
          },
          beneficiary: {
            inheritFrom: "policyHolder"
          }
        },
        vehicleSnapshot: {
          ...calculationData.vehicleSnapshot,
          owners: [{
            contact: {
              inheritFrom: "policyHolder"
            }
          }]
        },
        premium: calculationResult ? toCents(calculationResult.premium) : 0 // Bezpieczna konwersja
      };

      console.log('Dane do blokowania polisy:', JSON.stringify(lockData, null, 2));
      
      // Wywołanie blokowania polisy
      const lockResponse = await fetch('/api/lock-policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lockData),
      });

      if (!lockResponse.ok) {
        const errorData = await lockResponse.json();
        console.error('Błąd podczas blokowania polisy:', {
          status: lockResponse.status,
          errorData
        });
        throw new Error(`Błąd podczas blokowania polisy: ${errorData.error || lockResponse.statusText}`);
      }

      const lockResult = await lockResponse.json();
      console.log('Wynik blokowania polisy:', lockResult);
      
      // Pobranie id zablokowanej polisy
      const policyId = lockResult.policyId || lockResult.policyDetails?.policyId;
      if (!policyId) {
        throw new Error('Nie otrzymano identyfikatora polisy');
      }
      
      // 3. Podpis polisy (Signature)
      console.log('Krok 3: Podpis polisy');
      if (insuranceVariant.signatureTypeCode === "AUTHORIZED_BY_SMS") {
        const signatureResponse = await fetch('/api/sign-policy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            policyId: policyId,
            signatureType: "AUTHORIZED_BY_SMS"
          }),
        });

        if (!signatureResponse.ok) {
          const errorData = await signatureResponse.json();
          console.error('Błąd podczas podpisywania polisy:', {
            status: signatureResponse.status,
            errorData
          });
          throw new Error(`Błąd podczas podpisywania polisy: ${errorData.error || signatureResponse.statusText}`);
        }
        
        const signatureResult = await signatureResponse.json();
        console.log('Wynik podpisywania polisy:', signatureResult);
      }

      // 4. Wysyłanie maila z potwierdzeniem
      console.log('Krok 4: Wysyłanie maila z potwierdzeniem');
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalData,
          vehicleData,
          paymentData,
          calculationResult,
          policyId: policyId
        }),
      });

      if (!emailResponse.ok) {
        // Logujemy błąd, ale nie przerywamy procesu
        console.error('Błąd podczas wysyłania maila:', {
          status: emailResponse.status,
          errorData: await emailResponse.json()
        });
      } else {
        console.log('Email wysłany pomyślnie');
      }
      
      // Sukces - oznaczamy proces jako zakończony
      console.log('Proces zakupu polisy zakończony sukcesem');
      setIsCompleted(true);
    } catch (error) {
      console.error('Błąd podczas przetwarzania zamówienia:', error);
      alert(`Wystąpił błąd podczas przetwarzania zamówienia: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
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
              {paymentData.PAYMENT_METHOD === 'PM_BLIK' ? (
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
                if (paymentData.PAYMENT_METHOD === 'PM_BLIK') {
                  // Tutaj można dodać przekierowanie do płatności BLIK
                  window.location.href = '/payment/blik';
                } else {
                  router.push('/');
                }
              }}
            >
              {paymentData.PAYMENT_METHOD === 'PM_BLIK' ? 'Przejdź do płatności' : 'Powrót do strony głównej'}
            </Button>
            {paymentData.PAYMENT_METHOD === 'PM_PBC' && (
              <p className="text-xs text-gray-400">
                Pamiętaj, aby w tytule przelewu podać numer zamówienia, który otrzymasz w e-mailu.
              </p>
            )}
          </div>
        </div>
      </div>
    );
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
                { number: 1, title: "Określenie wariantu" },
                { number: 2, title: "Poznaj cenę" },
                { number: 3, title: "Dane pojazdu" },
                { number: 4, title: "Twoje dane" },
                { number: 5, title: "Podsumowanie" }
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
              {currentStep === 1 && (
                <InsuranceVariantForm 
                  data={insuranceVariant} 
                  onChange={handleVariantChange}
                  onInputPathsChange={handleInputPathsChange}
                  errors={errors.variant} 
                />
              )}

              {currentStep === 2 && (
                <CalculationForm 
                  vehicleData={vehicleData}
                  insuranceVariant={insuranceVariant}
                  paymentData={paymentData}
                  onCalculate={handleCalculation}
                  onVehicleChange={handleVehicleChange}
                  onPaymentChange={handlePaymentDataChange}
                  calculationResult={calculationResult}
                  errors={errors.calculation}
                  inputPaths={inputPaths?.vehicle}
                />
              )}

              {currentStep === 3 && (
                <VehicleForm 
                  data={vehicleData} 
                  onChange={handleVehicleChange} 
                  errors={errors.vehicle}
                  productCode={insuranceVariant.productCode}
                  inputPaths={inputPaths?.vehicle}
                />
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <PersonalForm 
                    data={personalData} 
                    onChange={handlePersonalDataChange} 
                    errors={errors.personal}
                    inputPaths={inputPaths?.contact}
                  />
                  <InsuranceOptionsForm
                    data={paymentData}
                    onChange={handlePaymentDataChange}
                    errors={errors.payment}
                    productCode={insuranceVariant.productCode}
                  />
                </div>
              )}

              {currentStep === 5 && (
                <Summary 
                  data={{
                    variant: {
                      productCode: insuranceVariant.productCode,
                      name: "GAP" // TODO: dodać nazwę wariantu
                    },
                    vehicle: {
                      category: vehicleData.category,
                      model: vehicleData.model,
                      vin: vehicleData.vin,
                      vrm: vehicleData.vrm,
                      purchasedOn: vehicleData.purchasedOn,
                      firstRegisteredOn: vehicleData.firstRegisteredOn,
                      mileage: vehicleData.mileage,
                      purchasePrice: vehicleData.purchasePrice
                    },
                    personal: {
                      type: personalData.type,
                      firstName: personalData.firstName,
                      lastName: personalData.lastName,
                      email: personalData.email,
                      phoneNumber: personalData.phoneNumber,
                      identificationNumber: personalData.identificationNumber,
                      address: {
                        street: personalData.address.street,
                        city: personalData.address.city,
                        postCode: personalData.address.postCode
                      }
                    },
                    options: paymentData,
                    premium: calculationResult?.premium || 0,
                    signatureTypeCode: insuranceVariant.signatureTypeCode,
                    policyId: calculationResult?.policyId
                  }}
                  onSubmit={handleSubmit}
                  isLoading={isSubmitting}
                />
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
              
              {currentStep < 5 ? (
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
