"use client"

import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
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
import { RecommendationForm } from '@/components/checkout/RecommendationForm';
import { InsuranceVariantForm } from '@/components/checkout/InsuranceVariantForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import {
  VehicleData,
  PersonalData,
  InsuranceVariant,
  PaymentData,
  CalculationResult,
  NeedsAnalysisData,
  PolicyResponse,
  Product
} from '@/types/insurance';

const STEPS = [
  'wprowadzenie',
  'analiza-potrzeb',
  'rekomendacja',
  'wybor-wariantu',
  'pojazd',
  'dane-osobowe',
  'platnosc',
  'podsumowanie'
] as const;

type Step = typeof STEPS[number];

// Mapowanie nazw kroków na przyjazne nazwy w języku polskim
const STEP_NAMES: Record<Step, string> = {
  'wprowadzenie': 'Wprowadzenie',
  'analiza-potrzeb': 'Analiza potrzeb',
  'rekomendacja': 'Rekomendacja',
  'wybor-wariantu': 'Wybór wariantu',
  'pojazd': 'Dane pojazdu',
  'dane-osobowe': 'Dane osobowe',
  'platnosc': 'Płatność',
  'podsumowanie': 'Podsumowanie'
};

// Symulacja dostępnych produktów na podstawie dostarczonego JSONa
// W przyszłości można to pobierać z API
// ZAKTUALIZOWANO: Pełna lista produktów z RESULT.txt
const AVAILABLE_PRODUCTS: Product[] = [
  // FLEX GO (id: 68476)
  {
    id: 68476,
    productCode: "5_DCGAP_FG25_GEN",
    productGroupAlias: "DEFEND Gap",
    productDerivativeAlias: "FLEX GO",
    inputSchemeItems: [], // Uproszczone
    optionTypes: [
      { code: 'TERM', name: 'Okres ubezpieczenia', options: [{ code: 'T_12' }, { code: 'T_24' }, { code: 'T_36' }, { code: 'T_48' }, { code: 'T_60' }] },
      { code: 'CLAIM_LIMIT', name: 'Limit odszkodowania', options: [{ code: 'CL_100000', name: '100 000 zł' }] },
      { code: 'PAYMENT_TERM', name: 'Rodzaj płatności', options: [{ code: 'PT_LS', name: 'Jednorazowa' }, { code: 'PT_A', name: 'Roczna' }] },
      { code: 'PAYMENT_METHOD', name: 'Forma płatności', options: [{ code: 'PM_PBC', name: 'Płatne przez klienta' }, { code: 'PM_BT', name: 'Przelew tradycyjny' }, { code: 'PM_PAYU_M', name: 'Raty PayU' }, { code: 'PM_BY_DLR', name: 'Płatne przez dealera' }] }
    ],
    signatureTypes: [], // Uproszczone
    vehicleCategories: [
      { code: 'PC', name: 'Osobowy (kat. M1)' },
      { code: 'LCV', name: 'Ciężarowy - LCV (DMC do 3500 kg)  kat. N1' },
      { code: 'BK', name: 'Motocykle i inne pojazdy (kat. L)' }
    ],
    sort: 90
  },
  // FLEX (id: 68475)
  {
    id: 68475,
    productCode: "5_DCGAP_F25_GEN",
    productGroupAlias: "DEFEND Gap",
    productDerivativeAlias: "FLEX",
    inputSchemeItems: [],
    optionTypes: [
      { code: 'TERM', name: 'Okres ubezpieczenia', options: [{ code: 'T_12' }, { code: 'T_24' }, { code: 'T_36' }, { code: 'T_48' }, { code: 'T_60' }] },
      { code: 'CLAIM_LIMIT', name: 'Limit odszkodowania', options: [{ code: 'CL_100000', name: '100 000 zł' }] },
      { code: 'PAYMENT_TERM', name: 'Rodzaj płatności', options: [{ code: 'PT_LS', name: 'Jednorazowa' }, { code: 'PT_A', name: 'Roczna' }] },
      { code: 'PAYMENT_METHOD', name: 'Forma płatności', options: [{ code: 'PM_PBC', name: 'Płatne przez klienta' }, { code: 'PM_BT', name: 'Przelew tradycyjny' }, { code: 'PM_PAYU_M', name: 'Raty PayU' }, { code: 'PM_BY_DLR', name: 'Płatne przez dealera' }] }
    ],
    signatureTypes: [],
    vehicleCategories: [
      { code: 'PC', name: 'Osobowy (kat. M1)' },
      { code: 'LCV', name: 'Ciężarowy - LCV (DMC do 3500 kg)  kat. N1' },
      { code: 'BK', name: 'Motocykle i inne pojazdy (kat. L)' }
    ],
    sort: 80
  },
  // MAX AC (id: 68473)
  {
    id: 68473,
    productCode: "5_DCGAP_MG25_GEN",
    productGroupAlias: "DEFEND Gap",
    productDerivativeAlias: "MAX AC",
    inputSchemeItems: [],
    optionTypes: [
      { code: 'TERM', name: 'Okres ubezpieczenia', options: [{ code: 'T_12' }, { code: 'T_24' }, { code: 'T_36' }, { code: 'T_48' }, { code: 'T_60' }] },
      { code: 'CLAIM_LIMIT', name: 'Limit odszkodowania', options: [{ code: 'CL_50000' }, { code: 'CL_100000' }, { code: 'CL_150000' }, { code: 'CL_200000' }, { code: 'CL_250000' }, { code: 'CL_300000' }] },
      { code: 'PAYMENT_TERM', name: 'Rodzaj płatności', options: [{ code: 'PT_LS', name: 'Jednorazowa' }, { code: 'PT_A', name: 'Roczna' }] },
      { code: 'PAYMENT_METHOD', name: 'Forma płatności', options: [{ code: 'PM_PBC', name: 'Płatne przez klienta' }, { code: 'PM_BT', name: 'Przelew tradycyjny' }, { code: 'PM_PAYU_M', name: 'Raty PayU' }, { code: 'PM_BY_DLR', name: 'Płatne przez dealera' }] }
    ],
    signatureTypes: [],
    vehicleCategories: [
      { code: 'PC', name: 'Osobowy (kat. M1)' },
      { code: 'LCV', name: 'Ciężarowy - LCV (DMC do 3500 kg)  kat. N1' },
      { code: 'BK', name: 'Motocykle i inne pojazdy (kat. L)' }
    ],
    sort: 70
  },
  // MAX (id: 68471)
  {
    id: 68471,
    productCode: "5_DCGAP_M25_GEN",
    productGroupAlias: "DEFEND Gap",
    productDerivativeAlias: "MAX",
    inputSchemeItems: [],
    optionTypes: [
      { code: 'TERM', name: 'Okres ubezpieczenia', options: [{ code: 'T_12' }, { code: 'T_24' }, { code: 'T_36' }, { code: 'T_48' }, { code: 'T_60' }] },
      { code: 'CLAIM_LIMIT', name: 'Limit odszkodowania', options: [{ code: 'CL_50000' }, { code: 'CL_100000' }, { code: 'CL_150000' }, { code: 'CL_200000' }, { code: 'CL_250000' }, { code: 'CL_300000' }] },
      { code: 'PAYMENT_TERM', name: 'Rodzaj płatności', options: [{ code: 'PT_LS', name: 'Jednorazowa' }, { code: 'PT_A', name: 'Roczna' }] },
      { code: 'PAYMENT_METHOD', name: 'Forma płatności', options: [{ code: 'PM_PBC', name: 'Płatne przez klienta' }, { code: 'PM_BT', name: 'Przelew tradycyjny' }, { code: 'PM_PAYU_M', name: 'Raty PayU' }, { code: 'PM_BY_DLR', name: 'Płatne przez dealera' }] }
    ],
    signatureTypes: [],
    vehicleCategories: [
      { code: 'PC', name: 'Osobowy (kat. M1)' },
      { code: 'LCV', name: 'Ciężarowy - LCV (DMC do 3500 kg)  kat. N1' },
      { code: 'BK', name: 'Motocykle i inne pojazdy (kat. L)' }
    ],
    sort: 60
  },
  // T-MAX AC (id: 68474)
  {
    id: 68474,
    productCode: "4_DTGAP_MG25_GEN",
    productGroupAlias: "DEFEND Truck Gap",
    productDerivativeAlias: "T-MAX AC",
    inputSchemeItems: [],
    optionTypes: [
      { code: 'TERM', name: 'Okres ubezpieczenia', options: [{ code: 'T_12' }, { code: 'T_24' }, { code: 'T_36' }, { code: 'T_48' }, { code: 'T_60' }] },
      { code: 'CLAIM_LIMIT', name: 'Limit odszkodowania', options: [{ code: 'CL_50000' }, { code: 'CL_100000' }, { code: 'CL_150000' }, { code: 'CL_200000' }, { code: 'CL_250000' }, { code: 'CL_300000' }] },
      { code: 'PAYMENT_TERM', name: 'Rodzaj płatności', options: [{ code: 'PT_LS', name: 'Jednorazowa' }, { code: 'PT_A', name: 'Roczna' }] },
      { code: 'PAYMENT_METHOD', name: 'Forma płatności', options: [{ code: 'PM_PBC', name: 'Płatne przez klienta' }, { code: 'PM_BT', name: 'Przelew tradycyjny' }, { code: 'PM_PAYU_M', name: 'Raty PayU' }, { code: 'PM_BY_DLR', name: 'Płatne przez dealera' }] }
    ],
    signatureTypes: [],
    vehicleCategories: [
      { code: 'BUS', name: 'Autobus' },
      { code: 'TR', name: 'Ciężarowy (DMC powyżej 3500 kg)' },
      { code: 'AT', name: 'Traktor rolniczy' },
      { code: 'TRA', name: 'Przyczepa / Naczepa' }
    ],
    sort: 70
  },
  // T-MAX (id: 68472)
  {
    id: 68472,
    productCode: "5_DTGAP_M25_GEN", // Możliwy błąd w RESULT.txt?
    productGroupAlias: "DEFEND Truck Gap",
    productDerivativeAlias: "T-MAX",
    inputSchemeItems: [],
    optionTypes: [
      { code: 'TERM', name: 'Okres ubezpieczenia', options: [{ code: 'T_12' }, { code: 'T_24' }, { code: 'T_36' }, { code: 'T_48' }, { code: 'T_60' }] },
      { code: 'CLAIM_LIMIT', name: 'Limit odszkodowania', options: [{ code: 'CL_50000' }, { code: 'CL_100000' }, { code: 'CL_150000' }, { code: 'CL_200000' }, { code: 'CL_250000' }, { code: 'CL_300000' }] },
      { code: 'PAYMENT_TERM', name: 'Rodzaj płatności', options: [{ code: 'PT_LS', name: 'Jednorazowa' }, { code: 'PT_A', name: 'Roczna' }] },
      { code: 'PAYMENT_METHOD', name: 'Forma płatności', options: [{ code: 'PM_PBC', name: 'Płatne przez klienta' }, { code: 'PM_BT', name: 'Przelew tradycyjny' }, { code: 'PM_PAYU_M', name: 'Raty PayU' }, { code: 'PM_BY_DLR', name: 'Płatne przez dealera' }] }
    ],
    signatureTypes: [],
    vehicleCategories: [
      { code: 'BUS', name: 'Autobus' },
      { code: 'TR', name: 'Ciężarowy (DMC powyżej 3500 kg)' },
      { code: 'AT', name: 'Traktor rolniczy' },
      { code: 'TRA', name: 'Przyczepa / Naczepa' }
    ],
    sort: 60
  },
];

// CheckoutContent component
const CheckoutContent = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  
  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);
  
  const [currentStep, setCurrentStep] = useState<Step>('wprowadzenie');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  // ---> Nowe stany
  const [availableProducts] = useState<Product[]>(AVAILABLE_PRODUCTS); // Lista dostępnych produktów
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Wybrany produkt przez użytkownika
  const [policyResponse, setPolicyResponse] = useState<PolicyResponse | null>(null); // Odpowiedź po rejestracji
  // <--- Koniec nowych stanów

  // Initial states
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    // Pola wymagane przez API
    purchasedOn: new Date().toISOString().split('T')[0],
    modelCode: '',
    categoryCode: 'PC',
    usageCode: 'STANDARD',
    mileage: 1000,
    firstRegisteredOn: new Date().toISOString().split('T')[0],
    evaluationDate: new Date().toISOString().split('T')[0],
    purchasePrice: 150000,
    purchasePriceNet: 150000,
    purchasePriceVatReclaimableCode: 'NO',
    usageTypeCode: 'INDIVIDUAL',
    purchasePriceInputType: 'VAT_INAPPLICABLE',
    vin: '',
    vrm: '',

    // Pola pomocnicze dla formularza
    make: '',
    model: '',
    vehicleCategory: 'CAR',
    usageType: 'PRIVATE',
    registrationNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePriceType: 'brutto',
    purchasePriceVatReclaimable: 'nie'
  });
  
  const [personalData, setPersonalData] = useState<PersonalData>({
    type: 'person',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    identificationNumber: '',
    address: {
      street: '',
      city: '',
      postCode: '',
      countryCode: 'PL'
    }
  });
  
  // Zmieniamy stan `variant` na przechowywanie tylko wybranego kodu produktu
  // const [variant, setVariant] = useState<InsuranceVariant>({
  //   productCode: '5_DCGAP_MG25_GEN',
  //   sellerNodeCode: 'PL_TEST_GAP_25',
  //   signatureTypeCode: 'AUTHORIZED_BY_SMS',
  //   name: '',
  //   description: ''
  // });
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);

  // Stan paymentData teraz przechowuje tylko wybrane opcje, premium będzie w calculationResult
  const initialPaymentData: Partial<PaymentData> = {
    term: 'T_36', // Domyślny termin
    claimLimit: 'CL_50000', // Domyślny limit
    paymentTerm: 'PT_LS', // Domyślny rodzaj płatności
    paymentMethod: 'PM_PBC' // Domyślna forma płatności
  };
  const [paymentOptions, setPaymentOptions] = useState<Partial<PaymentData>>(initialPaymentData);

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

  // Funkcja do wywołania API kalkulacji
  const handleCalculatePremium = async () => {
    console.log('[handleCalculatePremium] Start - Dane:', {
      selectedProductCode,
      paymentOptions,
      vehicleFirstRegisteredOn: vehicleData?.firstRegisteredOn,
    });
    if (!selectedProductCode || !paymentOptions.term || !paymentOptions.claimLimit) {
      console.error('Błąd: Brak danych do kalkulacji składki');
      alert('Proszę wybrać produkt, okres i limit odszkodowania.');
      return false; // Wskazuje na niepowodzenie
    }

    if (!vehicleData.firstRegisteredOn) {
      console.error('Błąd: Brak daty pierwszej rejestracji do kalkulacji składki');
      alert('Proszę uzupełnić dane pojazdu (data pierwszej rejestracji).');
      // Opcjonalnie wróć do kroku pojazdu
      setCurrentStep('pojazd');
      router.push('/checkout?step=pojazd');
      return false;
    }

    // Wyciągamy rok z daty pierwszej rejestracji
    let yearForCalculation: number | undefined;
    try {
      yearForCalculation = new Date(vehicleData.firstRegisteredOn).getFullYear();
      if (isNaN(yearForCalculation)) {
        throw new Error('Invalid date format for firstRegisteredOn');
      }
    } catch (e) {
      console.error('Błąd parsowania daty pierwszej rejestracji:', e);
      alert('Wystąpił błąd przy przetwarzaniu daty pierwszej rejestracji.');
      return false;
    }

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, calculation: undefined })); // Reset błędów kalkulacji

    try {
      // ZAKTUALIZOWANO: Dodajemy więcej danych pojazdu do kalkulacji
      const requestData = {
        price: vehicleData.purchasePrice,
        // Zamiast roku, wysyłamy pełną datę pierwszej rejestracji
        // year: yearForCalculation, 
        firstRegisteredOn: vehicleData.firstRegisteredOn, // <--- DODANO
        purchasedOn: vehicleData.purchasedOn,         // <--- DODANO
        categoryCode: vehicleData.categoryCode,       // <--- DODANO
        modelCode: vehicleData.modelCode,           // <--- DODANO
        usageCode: vehicleData.usageCode,           // <--- DODANO

        months: parseInt(paymentOptions.term.replace('T_', '')),
        productCode: selectedProductCode,
        claimLimit: paymentOptions.claimLimit,
        // Typ (casco/fakturowy) jest teraz pobierany z aliasu produktu,
        // więc nie wysyłamy go bezpośrednio, API powinno to wywnioskować z productCode
        // type: selectedProduct?.productDerivativeAlias.includes('AC') ? 'casco' : 'fakturowy',
      };

      console.log('Dane wysyłane do API /calculate:', requestData);

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Błąd API kalkulacji:', data);
        setErrors(prev => ({ ...prev, calculation: { general: data.error || 'Błąd serwera' } }));
        throw new Error(data.error || 'Nie udało się obliczyć składki');
      }

      if (data.success && data.premium !== undefined) {
        console.log('Wynik kalkulacji:', data);
        // Zapisujemy pełny wynik z API (premium + details)
        setCalculationResult({ premium: data.premium, details: data.details });
        // Aktualizujemy paymentOptions o dane z kalkulacji, jeśli API je zwraca
        setPaymentOptions(prev => ({
          ...prev,
          // Przykład, jeśli API zwracałoby potwierdzone opcje:
          // term: data.confirmedOptions?.TERM || prev.term,
          // claimLimit: data.confirmedOptions?.CLAIM_LIMIT || prev.claimLimit
        }));
        return true; // Sukces
      } else {
        console.error('Nieprawidłowa odpowiedź API kalkulacji:', data);
        setErrors(prev => ({ ...prev, calculation: { general: data.error || 'Nieprawidłowa odpowiedź' } }));
        throw new Error(data.error || 'Nieprawidłowa odpowiedź API kalkulacji');
      }
    } catch (error) {
      console.error('Błąd podczas kalkulacji:', error);
      alert(`Wystąpił błąd podczas kalkulacji składki: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
      return false; // Niepowodzenie
    } finally {
      setIsSubmitting(false);
    }
  };

  // Walidacja
  const validateVehicleData = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!vehicleData.purchasedOn) {
      newErrors.purchasedOn = "Data zakupu jest wymagana";
    }
    
    if (!vehicleData.firstRegisteredOn) {
      newErrors.firstRegisteredOn = "Data pierwszej rejestracji jest wymagana";
    }
    
    if (!vehicleData.vin || vehicleData.vin.length !== 17) {
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

  // Navigation functions
  const goToNextStep = useCallback(async () => {
    console.log('[goToNextStep] Przed wywołaniem handleCalculatePremium - Stan:', {
      currentStep,
      selectedProductCode,
      paymentOptions,
      vehicleFirstRegisteredOn: vehicleData?.firstRegisteredOn,
    });
    let isValid = true;
    let nextStepIndex = STEPS.indexOf(currentStep) + 1;

    switch (currentStep) {
      case 'pojazd':
        isValid = validateVehicleData();
        break;
      case 'dane-osobowe':
        isValid = validatePersonalData();
        break;
    }

    // Kalkulacja przed przejściem do podsumowania
    if (currentStep === 'platnosc') { // Kalkulujemy po wybraniu metody płatności
      isValid = await handleCalculatePremium(); // Wywołujemy kalkulację
    }

    if (!isValid) return;

    if (nextStepIndex < STEPS.length) {
      const nextStep = STEPS[nextStepIndex];
      setCurrentStep(nextStep);
      router.push(`/checkout?step=${nextStep}`);
    }
  }, [currentStep, router, validateVehicleData, validatePersonalData, selectedProductCode, paymentOptions, vehicleData, handleCalculatePremium]);
  
  const goToPrevStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = STEPS[currentIndex - 1];
      setCurrentStep(prevStep);
      router.push(`/checkout?step=${prevStep}`);
    }
  };
  
  // Add effect to handle URL params
  useEffect(() => {
    if (searchParams) {
      const step = searchParams.get('step');
      if (step && STEPS.includes(step as Step)) {
        setCurrentStep(step as Step);
      }
    }
  }, [searchParams]);

  // Zmieniona funkcja onSubmit przekazywana do Summary
  const handlePolicySuccess = (policyId: string) => {
    console.log(`Przekierowanie na stronę sukcesu dla polisy: ${policyId}`);
    router.push(`/checkout/success?policyId=${policyId}`);
  };

  const handleSubmitPolicy = async () => {
    if (!selectedProductCode || !calculationResult) {
      console.error('Błąd: Brak wybranego produktu lub wyniku kalkulacji');
      alert('Wystąpił błąd. Brakuje danych do wystawienia polisy.');
      return;
    }
    if (!termsAgreed) {
        alert('Musisz zaakceptować zgody i oświadczenia.');
        return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        vehicleData,
        personalData,
        paymentData: {
          ...paymentOptions,
          premium: calculationResult.premium, // Przekazujemy obliczoną składkę
        } as PaymentData, // Rzutowanie, upewniając się, że wszystkie pola są obecne
        productCode: selectedProductCode,
        signatureTypeCode: 'AUTHORIZED_BY_SMS', // Na razie na sztywno
        sellerNodeCode: 'PL_TEST_GAP_25' // Na razie na sztywno
      };

      const response = await fetch('/api/register-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Błąd API rejestracji:', result);
        throw new Error(result.error || 'Nie udało się zarejestrować polisy');
      }

      console.log('Polisa zarejestrowana:', result);
      setPolicyResponse(result.policyData); // Zapisz odpowiedź z danymi polisy
      // Zamiast tego, polegamy na tym, że handlePolicySuccess zostanie wywołane
      // przez komponent Summary po udanym potwierdzeniu

    } catch (error) {
      console.error('Błąd podczas tworzenia polisy:', error);
      alert(`Wystąpił błąd podczas rejestracji polisy: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funkcje obsługi zmian
  const handleVehicleDataChange = (data: VehicleData) => {
    setVehicleData({
      make: data.make,
      model: data.model,
      modelCode: data.modelCode,
      categoryCode: data.categoryCode,
      usageCode: data.usageCode,
      evaluationDate: data.evaluationDate,
      vehicleCategory: data.vehicleCategory,
      usageType: data.usageType,
      usageTypeCode: data.usageTypeCode,
      registrationNumber: data.registrationNumber,
      firstRegisteredOn: data.firstRegisteredOn,
      purchasePrice: data.purchasePrice,
      purchasePriceNet: data.purchasePriceNet,
      purchasePriceVatReclaimableCode: data.purchasePriceVatReclaimableCode,
      purchasePriceInputType: data.purchasePriceInputType,
      mileage: data.mileage,
      vin: data.vin,
      vrm: data.vrm,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasedOn: data.purchasedOn || new Date().toISOString().split('T')[0],
      purchasePriceType: data.purchasePriceType,
      purchasePriceVatReclaimable: data.purchasePriceVatReclaimable,
      vinNumber: data.vinNumber,
      productionYear: data.productionYear
    });
  };

  const handlePersonalDataChange = (data: PersonalData) => {
    setPersonalData(data);
  };

  const handleCalculationComplete = (result: CalculationResult, paymentData: PaymentData) => {
    setCalculationResult(result);
    setPaymentOptions(paymentData);
    setCurrentStep('podsumowanie');
  };

  // Funkcja do ustawienia wybranego produktu
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedProductCode(product.productCode);
    // Resetuj opcje płatności do domyślnych dla produktu, jeśli trzeba
    // np. setPaymentOptions({ term: product.defaultTerm, ... });
    // goToNextStep(); // USUNIĘTO automatyczne przejście
  };

  // Funkcja wywoływana po akceptacji rekomendacji
  const handleRecommendationAccept = (recommendedProduct: Product) => {
    setSelectedProduct(recommendedProduct);
    setSelectedProductCode(recommendedProduct.productCode);
    // Przejdź do kroku wyboru wariantu (lub bezpośrednio do pojazdu, jeśli nie ma opcji)
    setCurrentStep('wybor-wariantu');
    router.push(`/checkout?step=wybor-wariantu`);
  };

  // Funkcja wywoływana po odrzuceniu rekomendacji
  const handleRecommendationReject = () => {
    // Pozwól użytkownikowi wybrać produkt ręcznie
    // Przejdź do kroku wyboru wariantu, pokazując wszystkie produkty
    setCurrentStep('wybor-wariantu');
    router.push(`/checkout?step=wybor-wariantu`);
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'wprowadzenie':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Witaj w procesie zakupu ubezpieczenia GAP</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Potrzebne dokumenty:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Dowód rejestracyjny pojazdu</li>
                <li>Faktura zakupu pojazdu</li>
                <li>Polisa AC (jeśli posiadasz)</li>
                <li>Dowód osobisty</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Kolejne kroki:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Analiza potrzeb ubezpieczeniowych</li>
                <li>Rekomendacja odpowiedniego wariantu</li>
                <li>Kalkulacja składki</li>
                <li>Wprowadzenie danych pojazdu</li>
                <li>Wprowadzenie danych osobowych</li>
                <li>Wybór metody płatności</li>
                <li>Podsumowanie i zakup</li>
              </ol>
            </div>
          </div>
        );
      case 'analiza-potrzeb':
        return (
          <NeedsAnalysisForm
            data={needsAnalysisData}
            onChange={setNeedsAnalysisData}
            errors={errors.needsAnalysis}
          />
        );
      case 'rekomendacja':
        return (
          <RecommendationForm
            needsAnalysisData={needsAnalysisData}
            availableProducts={availableProducts}
            onAccept={handleRecommendationAccept}
            onReject={handleRecommendationReject}
          />
        );
      case 'wybor-wariantu':
        console.log('Renderowanie wybor-wariantu, aktualny selectedProduct:', selectedProduct);
        return (
          <InsuranceVariantForm
            availableProducts={availableProducts}
            selectedProduct={selectedProduct}
            paymentOptions={paymentOptions}
            onProductSelect={(product: Product) => {
              setSelectedProduct(product);
              setSelectedProductCode(product.productCode);
            }}
            onOptionsChange={setPaymentOptions}
            errors={{}}
            onNext={() => {
               goToNextStep();
            }}
          />
        );
      case 'pojazd':
        return (
          <VehicleForm
            data={vehicleData}
            onChange={handleVehicleDataChange}
            errors={errors.vehicle}
          />
        );
      case 'dane-osobowe':
        return (
          <PersonalForm
            data={personalData}
            onChange={handlePersonalDataChange}
            errors={errors.personal}
          />
        );
      case 'platnosc':
        console.log('Renderowanie PaymentForm, przekazywany selectedProduct:', selectedProduct);
        return (
            <PaymentForm
                selectedProduct={selectedProduct}
                paymentOptions={paymentOptions}
                onOptionsChange={setPaymentOptions}
                errors={{}}
                onNext={goToNextStep}
            />
        );
      case 'podsumowanie':
        // Sprawdzenie, czy mamy wszystkie potrzebne dane przed renderowaniem podsumowania
        if (!selectedProductCode || !calculationResult) {
            // Można tu wyświetlić komunikat o błędzie lub wrócić do poprzedniego kroku
            // Na razie zwracamy null, co może nie być idealne UX
            console.error("Brak danych do wyświetlenia podsumowania");
            // Wróć do kroku wyboru wariantu, jeśli brakuje danych
            setCurrentStep('wybor-wariantu');
            router.push('/checkout?step=wybor-wariantu');
            return <div>Brak danych do wyświetlenia podsumowania. Proszę wrócić i uzupełnić formularz.</div>;
        }
        return (
          <Summary
            vehicleData={vehicleData}
            personalData={personalData}
            paymentData={{ ...paymentOptions, premium: calculationResult.premium } as PaymentData}
            variant={{ // Tworzymy obiekt variant
                productCode: selectedProductCode,
                name: selectedProduct?.productDerivativeAlias || '',
                description: '',
                sellerNodeCode: 'PL_TEST_GAP_25',
                // Wracamy do stałego signatureTypeCode na razie
                signatureTypeCode: 'AUTHORIZED_BY_SMS'
            }}
            calculationResult={calculationResult!}
            // Przekazujemy bezpośrednio referencję do funkcji
            onSubmit={handlePolicySuccess}
            termsAgreed={termsAgreed}
            onTermsChange={setTermsAgreed}
          />
        );
      default:
        return null;
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
            <div className="flex justify-between mb-10 px-4 relative">
              {/* Linie łączące */}
              <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200" />
              <div 
                className="absolute top-5 left-0 right-0 h-[2px] bg-[#300FE6] transition-all duration-500"
                style={{ width: `${(STEPS.indexOf(currentStep) / (STEPS.length - 1)) * 100}%` }}
              />

              {STEPS.map((step, index) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white font-bold transition-all duration-300
                      ${STEPS.indexOf(currentStep) >= index 
                        ? 'bg-[#300FE6] scale-110' 
                        : 'bg-gray-300'}`}
                  >
                    {STEPS.indexOf(currentStep) > index ? <CheckCircle2 size={20} /> : index + 1}
                  </div>
                  <div className="text-center">
                    <p className={`font-medium ${STEPS.indexOf(currentStep) >= index ? 'text-[#300FE6]' : 'text-gray-400'}`}>
                      {STEP_NAMES[step]}
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
              {currentStep !== 'wprowadzenie' ? (
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
                  onClick={() => router.push('/')}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Anuluj
                </Button>
              )}
              
              {currentStep !== 'podsumowanie' && (
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
