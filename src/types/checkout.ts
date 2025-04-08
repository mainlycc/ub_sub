export interface InsuranceVariant {
  productCode: string;
  sellerNodeCode: string;
  signatureTypeCode: string;
}

export interface VehicleData {
  category: string;
  usage: string;
  vin: string;
  vrm: string;
  model: string;
  mileage: number;
  firstRegisteredOn: string;
  purchasedOn: string;
  purchasePrice: number;
  purchasePriceNet: number;
  purchasePriceVatReclaimableCode: string;
  usageTypeCode: string;
  purchasePriceInputType: string;
  modelCode: string;
  categoryCode: string;
  usageCode: string;
  evaluationDate: string;
}

export interface PersonalData {
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

export interface InsuranceOptions {
  TERM: string;
  CLAIM_LIMIT: string;
  PAYMENT_TERM: string;
  PAYMENT_METHOD: string;
}

export interface CalculationResultDetails {
  productName: string;
  coveragePeriod: string;
  vehicleValue: number;
  maxCoverage: string;
}

export interface CalculationResult {
  premium: number;
  premiumNet?: number;
  premiumTax?: number;
  premiumSuggested?: number;
  policyId?: string;
  details: CalculationResultDetails;
}

export interface SummaryData {
  variant: {
    productCode: string;
    name: string;
  };
  vehicle: {
    category: string;
    model: string;
    vin: string;
    vrm: string;
    purchasedOn: string;
    firstRegisteredOn: string;
    mileage: number;
    purchasePrice: number;
  };
  personal: {
    type: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    identificationNumber: string;
    address: {
      street: string;
      city: string;
      postCode: string;
    };
  };
  options: InsuranceOptions;
  premium: number;
} 