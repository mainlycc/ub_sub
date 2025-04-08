import { NextResponse } from 'next/server';
import type { CalculationResult, CalculationResultDetails } from '@/types/checkout';
import { getAuthToken } from '@/lib/auth';
import { portfolioData } from '@/data/portfolio-data';

type TermPeriod = 'T_12' | 'T_24' | 'T_36' | 'T_48' | 'T_60';

const termPeriodMap: Record<TermPeriod, string> = {
  T_12: "12 miesięcy",
  T_24: "24 miesiące",
  T_36: "36 miesięcy",
  T_48: "48 miesięcy",
  T_60: "60 miesięcy"
};

// Definicje produktów
const TRUCK_PRODUCTS = ['4_DTGAP_MG25_GEN', '5_DTGAP_M25_GEN'];const CAR_PRODUCTS = ['5_DCGAP_MG25_GEN', '5_DCGAP_M25_GEN'];

// Kategorie pojazdów per typ produktu
const TRUCK_CATEGORIES = ['BUS', 'TR', 'AT', 'TRA'];
const CAR_CATEGORIES = ['PC', 'LCV', 'BK'];

// Niedozwolone kombinacje opcji
const DISABLED_COMBINATIONS = [
  ['PT_A', 'PM_BY_DLR'],
  ['PT_LS', 'PM_FST_DLR'],
  ['PT_A', 'PM_PAYU_M'],
  ['T_12', 'PT_A'],
  ['PT_A', 'PM_PAYU'],
  ['PT_A', 'PM_ONLINE']
];

export async function POST(request: Request) {
  console.log('[calculate-premium] Otrzymano zapytanie POST');
  try {
    const data = await request.json();
    
    console.log('Otrzymane dane:', JSON.stringify(data, null, 2));

    // Podstawowa walidacja danych
    if (!data.productCode || !data.sellerNodeCode || !data.vehicleSnapshot || !data.options) {
      console.error('Brak wymaganych danych:', {
        hasProductCode: !!data.productCode,
        hasSellerNodeCode: !!data.sellerNodeCode,
        hasVehicleSnapshot: !!data.vehicleSnapshot,
        hasOptions: !!data.options
      });
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      );
    }

    // Walidacja produktu i kategorii pojazdu
    const isTruckProduct = TRUCK_PRODUCTS.includes(data.productCode);
    const isCarProduct = CAR_PRODUCTS.includes(data.productCode);

    // Sprawdzenie kategorii pojazdu
    if (isTruckProduct && !TRUCK_CATEGORIES.includes(data.vehicleSnapshot.categoryCode)) {
      return NextResponse.json(
        { error: 'Nieprawidłowa kategoria pojazdu dla wybranego produktu truck' },
        { status: 400 }
      );
    }

    if (isCarProduct && !CAR_CATEGORIES.includes(data.vehicleSnapshot.categoryCode)) {
      return NextResponse.json(
        { error: 'Nieprawidłowa kategoria pojazdu dla wybranego produktu car' },
        { status: 400 }
      );
    }

    // Walidacja dat
    if (!data.vehicleSnapshot.purchasedOn || !data.vehicleSnapshot.firstRegisteredOn) {
      return NextResponse.json(
        { error: 'Brak wymaganych dat pojazdu' },
        { status: 400 }
      );
    }

    const purchasedOn = new Date(data.vehicleSnapshot.purchasedOn);
    const firstRegisteredOn = new Date(data.vehicleSnapshot.firstRegisteredOn);
    const today = new Date();

    // Sprawdzenie czy daty są prawidłowe
    if (isNaN(purchasedOn.getTime())) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format daty zakupu' },
        { status: 400 }
      );
    }

    if (isNaN(firstRegisteredOn.getTime())) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format daty pierwszej rejestracji' },
        { status: 400 }
      );
    }

    if (purchasedOn > today) {
      return NextResponse.json(
        { error: 'Data zakupu nie może być w przyszłości' },
        { status: 400 }
      );
    }

    if (firstRegisteredOn > today) {
      return NextResponse.json(
        { error: 'Data pierwszej rejestracji nie może być w przyszłości' },
        { status: 400 }
      );
    }

    // Formatowanie dat do formatu YYYY-MM-DD
    const formatDate = (date: Date) => {
      // Nie zmieniamy roku na 2024, używamy oryginalnej daty
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Sprawdzanie czy data (jako string YYYY-MM-DD) jest w przyszłości
    const isDateInFuture = (dateStr: string): boolean => {
      const todayStr = formatDate(new Date());
      return dateStr > todayStr; // Porównanie stringów działa dla formatu YYYY-MM-DD
    };

    // Sprawdzanie czy kwota jest już w groszach (ponad milion prawdopodobnie jest w groszach)
    const isInCents = (amount: number) => amount > 1000000;
    
    // Inteligentna konwersja na grosze
    const toCents = (amount: number) => {
      if (!amount) return 0;
      if (isInCents(amount)) return amount; // Już w groszach
      return Math.round(amount * 100); // Konwersja na grosze
    };
    
    // Konwersja z groszy na złote (do logowania)
    const toZloty = (cents: number) => (cents / 100).toLocaleString('pl-PL') + ' zł';

    // Przygotowanie aktualnej daty sprzedaży (saleInitiatedOn)
    const currentDate = data.saleInitiatedOn || formatDate(new Date());

    // Przygotowanie danych do API
    const apiRequestData = {
      sellerNodeCode: data.sellerNodeCode,
      productCode: data.productCode,
      saleInitiatedOn: currentDate,
      signatureTypeCode: data.signatureTypeCode || "AUTHORIZED_BY_SMS",
      
      vehicleSnapshot: {
        purchasedOn: data.vehicleSnapshot.purchasedOn,
        modelCode: data.vehicleSnapshot.modelCode || "342",
        categoryCode: data.vehicleSnapshot.categoryCode,
        usageCode: data.vehicleSnapshot.usageCode || "STANDARD",
        mileage: data.vehicleSnapshot.mileage || 0,
        firstRegisteredOn: data.vehicleSnapshot.firstRegisteredOn,
        evaluationDate: data.vehicleSnapshot.purchasedOn,
        purchasePrice: toCents(data.vehicleSnapshot.purchasePrice),
        purchasePriceNet: toCents(data.vehicleSnapshot.purchasePriceNet || data.vehicleSnapshot.purchasePrice * 0.8),
        purchasePriceVatReclaimableCode: data.vehicleSnapshot.purchasePriceVatReclaimableCode || "NO",
        usageTypeCode: data.vehicleSnapshot.usageTypeCode || "INDIVIDUAL",
        purchasePriceInputType: data.vehicleSnapshot.purchasePriceInputType || "VAT_INAPPLICABLE",
        vin: data.vehicleSnapshot.vin,
        vrm: data.vehicleSnapshot.vrm
      },
      
      options: data.options,
      extApiNo: data.extApiNo || null,
      extReferenceNo: data.extReferenceNo || null,
      extTenderNo: data.extTenderNo || null
    };

    // Logowanie wszystkich dat i kwot - debugowanie
    console.log('Daty w zapytaniu:', {
      saleInitiatedOn: apiRequestData.saleInitiatedOn,
      purchasedOn: apiRequestData.vehicleSnapshot.purchasedOn,
      firstRegisteredOn: apiRequestData.vehicleSnapshot.firstRegisteredOn,
      evaluationDate: apiRequestData.vehicleSnapshot.evaluationDate
    });
    
    console.log('Kwoty w zapytaniu:', {
      purchasePrice: toZloty(apiRequestData.vehicleSnapshot.purchasePrice),
      purchasePriceNet: toZloty(apiRequestData.vehicleSnapshot.purchasePriceNet),
      originalPurchasePrice: data.vehicleSnapshot.purchasePrice
    });
    
    // Sprawdzenie zakresu dat
    if (isDateInFuture(apiRequestData.vehicleSnapshot.purchasedOn)) {
      return NextResponse.json(
        { error: `Data zakupu pojazdu (${apiRequestData.vehicleSnapshot.purchasedOn}) nie może być w przyszłości` },
        { status: 400 }
      );
    }
    
    if (isDateInFuture(apiRequestData.vehicleSnapshot.firstRegisteredOn)) {
      return NextResponse.json(
        { error: `Data pierwszej rejestracji (${apiRequestData.vehicleSnapshot.firstRegisteredOn}) nie może być w przyszłości` },
        { status: 400 }
      );
    }
    
    if (isDateInFuture(apiRequestData.vehicleSnapshot.evaluationDate)) {
      return NextResponse.json(
        { error: `Data wyceny (${apiRequestData.vehicleSnapshot.evaluationDate}) nie może być w przyszłości` },
        { status: 400 }
      );
    }

    // Pobranie tokena
    console.log('Próba pobrania tokena...');
    const token = await getAuthToken();
    
    if (!token) {
      console.error('[calculate-premium] Błąd autoryzacji: getAuthToken() zwrócił null');
      return NextResponse.json(
        { error: 'Błąd autoryzacji - nie udało się pobrać tokenu JWT' },
        { status: 401 }
      );
    }
    
    console.log('[calculate-premium] Token otrzymany pomyślnie');
    
    // Sprawdzenie dostępności produktu w lokalnym portfolio
    try {
      console.log('[calculate-premium] Sprawdzanie dostępności produktu w portfolio:', data.productCode);
      const product = portfolioData.find(p => p.productCode === data.productCode);
      
      if (!product) {
        console.error('[calculate-premium] Produkt niedostępny w portfolio:', {
          requestedProduct: data.productCode,
          availableProducts: portfolioData.map(p => p.productCode)
        });
        return NextResponse.json(
          { error: `Produkt ${data.productCode} nie jest dostępny` },
          { status: 400 }
        );
      }

      // Sprawdzenie kategorii pojazdu
      const isValidCategory = product.vehicleCategories.some(cat => cat.code === data.vehicleSnapshot.categoryCode);
      if (!isValidCategory) {
        console.error('[calculate-premium] Nieprawidłowa kategoria pojazdu:', {
          requestedCategory: data.vehicleSnapshot.categoryCode,
          availableCategories: product.vehicleCategories.map(cat => cat.code)
        });
        return NextResponse.json(
          { error: `Nieprawidłowa kategoria pojazdu dla produktu ${data.productCode}` },
          { status: 400 }
        );
      }

      console.log(`[calculate-premium] Produkt ${data.productCode} jest dostępny w portfolio`);
    } catch (error) {
      console.error('[calculate-premium] Błąd podczas sprawdzania portfolio:', error);
      return NextResponse.json(
        { error: 'Błąd podczas sprawdzania dostępności produktu' },
        { status: 500 }
      );
    }

    // Wywołanie kalkulacji
    console.log('Próba wykonania kalkulacji...');
    const calculationResponse = await fetch('https://test.v2.idefend.eu/api/policies/creation/calculate-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token
      },
      body: JSON.stringify(apiRequestData),
    });

    if (!calculationResponse.ok) {
      let errorData;
      try {
        errorData = await calculationResponse.json();
      } catch (e) {
        errorData = await calculationResponse.text();
      }
      
      console.error('Błąd podczas kalkulacji:', {
        status: calculationResponse.status,
        statusText: calculationResponse.statusText,
        error: errorData,
        requestData: apiRequestData
      });
      
      // Szczegółowa obsługa błędów
      if (calculationResponse.status === 422) {
        const errorMessage = errorData?.message || errorData?.error || 'Błąd walidacji danych';
        return NextResponse.json(
          { error: `Błąd walidacji: ${errorMessage}`, details: errorData },
          { status: 422 }
        );
      }
      
      if (calculationResponse.status === 401) {
        return NextResponse.json(
          { error: 'Błąd autoryzacji - nieprawidłowy token', details: errorData },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `Błąd podczas kalkulacji: ${calculationResponse.status} ${calculationResponse.statusText}`, details: errorData },
        { status: calculationResponse.status }
      );
    }

    const apiResult = await calculationResponse.json();
    console.log('Otrzymany wynik kalkulacji:', JSON.stringify(apiResult, null, 2));
    
    // Sprawdzenie czy otrzymaliśmy oczekiwane dane
    if (!apiResult.premium) {
      console.error('Brak wymaganego pola premium w odpowiedzi:', apiResult);
      return NextResponse.json(
        { error: 'Nieprawidłowa odpowiedź z API - brak wymaganego pola premium' },
        { status: 500 }
      );
    }

    // Mapowanie odpowiedzi API na nasz interfejs
    const details: CalculationResultDetails = {
      productName: data.productCode.includes("MG25") ? "GAP Fakturowy" : "GAP Wartości Pojazdu",
      coveragePeriod: termPeriodMap[data.options.TERM as TermPeriod] || "36 miesięcy",
      vehicleValue: data.vehicleSnapshot.purchasePrice,
      maxCoverage: data.options.CLAIM_LIMIT.replace('CL_', '').replace('_', ' ') + ' PLN'
    };

    const result: CalculationResult = {
      premium: apiResult.premium / 100, // Konwersja z groszy na złote
      premiumNet: apiResult.premiumNet ? apiResult.premiumNet / 100 : undefined,
      premiumTax: apiResult.premiumTax ? apiResult.premiumTax / 100 : undefined,
      premiumSuggested: apiResult.premiumSuggested ? apiResult.premiumSuggested / 100 : undefined,
      policyId: apiResult.policyId,
      details
    };

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('[calculate-premium] Szczegóły błędu:', {
      message: error instanceof Error ? error.message : 'Nieznany błąd',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
} 