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

interface InsuranceVariant {
  productCode: "5_DCGAP_M25_GEN" | "5_DCGAP_MG25_GEN" | "5_DCGAP_F25_GEN" | "5_DCGAP_FG25_GEN";
  sellerNodeCode: string;
  signatureTypeCode: "AUTHORIZED_BY_SMS" | "SIGNED_BY_PAYMENT";
}

interface CalculationRequest {
  vehicleData: VehicleData;
  variant: InsuranceVariant;
}

export async function POST(request: Request) {
  try {
    const { vehicleData, variant } = await request.json() as CalculationRequest;

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
      productCode: variant.productCode,
      sellerNodeCode: variant.sellerNodeCode
    };

    // Wyślij żądanie do API Defend
    const response = await fetch('https://test.v2.idefend.eu/api/policies/creation/calculate-offer', {
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
        { error: errorData.message || 'Błąd podczas kalkulacji oferty' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Przygotuj odpowiedź
    return NextResponse.json({
      premium: data.premium,
      details: {
        productName: data.productName,
        coveragePeriod: data.coveragePeriod,
        vehicleValue: data.vehicleValue,
        maxCoverage: data.maxCoverage
      }
    });
  } catch (error) {
    console.error('Błąd podczas kalkulacji oferty:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
} 