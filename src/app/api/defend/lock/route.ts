import { NextResponse } from 'next/server';

interface VehicleData {
  vin: string;
  vrm: string;
  make?: string;
  model?: string;
  mileage: number;
  purchasePrice: number;
  purchasePriceNet: number;
  purchasePriceType: string;
  purchasePriceVatReclaimable: string;
  firstRegisteredOn: string;
  purchasedOn: string;
  vehicleCategory: string;
  usageType: string;
}

interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pesel: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postalCode: string;
  city: string;
}

interface InsuranceVariant {
  productCode: "5_DCGAP_M25_GEN" | "5_DCGAP_MG25_GEN" | "5_DCGAP_F25_GEN" | "5_DCGAP_FG25_GEN";
  sellerNodeCode: string;
  signatureTypeCode: "AUTHORIZED_BY_SMS" | "SIGNED_BY_PAYMENT";
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

interface PolicyRequest {
  vehicleData: VehicleData;
  personalData: PersonalData;
  variant: InsuranceVariant;
  calculationResult: CalculationResult;
}

export async function POST(request: Request) {
  try {
    const { vehicleData, personalData, variant, calculationResult } = await request.json() as PolicyRequest;

    // Pobierz token autoryzacyjny
    const authToken = process.env.DEFEND_API_KEY;
    if (!authToken) {
      return NextResponse.json(
        { error: 'Brak klucza API' },
        { status: 401 }
      );
    }

    // Przygotuj dane do wysłania
    const requestData = {
      vehicleSnapshot: {
        vin: vehicleData.vin,
        vrm: vehicleData.vrm,
        make: vehicleData.make,
        model: vehicleData.model,
        mileage: vehicleData.mileage,
        purchasePrice: vehicleData.purchasePrice,
        purchasePriceNet: vehicleData.purchasePriceNet,
        purchasePriceType: vehicleData.purchasePriceType,
        purchasePriceVatReclaimable: vehicleData.purchasePriceVatReclaimable,
        firstRegisteredOn: vehicleData.firstRegisteredOn,
        purchasedOn: vehicleData.purchasedOn,
        vehicleCategory: vehicleData.vehicleCategory,
        usageType: vehicleData.usageType
      },
      customer: {
        type: "PERSON",
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        email: personalData.email,
        phone: personalData.phone,
        identificationNumber: personalData.pesel,
        address: {
          street: personalData.street,
          houseNumber: personalData.houseNumber,
          apartmentNumber: personalData.apartmentNumber,
          postalCode: personalData.postalCode,
          city: personalData.city,
          countryCode: "PL"
        }
      },
      productCode: variant.productCode,
      sellerNodeCode: variant.sellerNodeCode,
      signatureTypeCode: variant.signatureTypeCode,
      premium: calculationResult.premium
    };

    // Wyślij żądanie do API Defend
    const response = await fetch('https://test.v2.idefend.eu/api/policies/creation/lock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Błąd podczas rejestracji polisy' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Przygotuj odpowiedź
    return NextResponse.json({
      policyId: data.policyId,
      policyNumber: data.policyNumber,
      signatureUrl: data.signatureUrl
    });
  } catch (error) {
    console.error('Błąd podczas rejestracji polisy:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
} 