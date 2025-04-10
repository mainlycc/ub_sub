export interface VehicleData {
  vin: string;
  vrm: string; // numer rejestracyjny
  categoryCode: string;
  usageCode: string;
  firstRegisteredOn: string;
  purchasedOn: string;
  purchasePrice: number;
  purchasePriceInputType: 'WITH_VAT' | 'WITHOUT_VAT' | 'VAT_INAPPLICABLE';
  purchasePriceVatReclaimableCode: string;
  usageTypeCode: string;
  mileage: number;
  evaluationDate: string;
  purchasePriceNet: number;
  modelCode: string;
  make: string;
  model?: string;
  makeId: string;
  modelId: string;
} 