export interface VehicleData {
  vin: string;
  vrm: string; // numer rejestracyjny
  categoryCode: string;
  usageCode: string;
  firstRegisteredOn: string;
  purchasedOn: string;
  purchasePrice: number;
  purchasePriceInputType: 'BRUTTO' | 'NETTO' | 'NETTO_VAT';
  purchasePriceVatReclaimableCode: string;
  usageTypeCode: string;
  mileage: number;
  evaluationDate: string;
  purchasePriceNet: number;
  modelCode: string;
  make: string;
} 