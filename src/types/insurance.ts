export interface VehicleData {
  purchasedOn: string;
  modelCode?: string;
  categoryCode: string;
  usageCode: string;
  mileage: number;
  firstRegisteredOn: string;
  evaluationDate: string;
  purchasePrice: number;
  purchasePriceNet: number;
  purchasePriceVatReclaimableCode: string;
  usageTypeCode: string;
  purchasePriceInputType: string;
  vin: string;
  vrm: string;
  make?: string;
  model?: string;
  vehicleCategory?: string;
  usageType?: string;
  registrationNumber?: string;
  purchaseDate?: string;
  purchasePriceType?: string;
  purchasePriceVatReclaimable?: string;
  vinNumber?: string;
  productionYear?: number;
}

export interface PersonalData {
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  identificationNumber: string;
  address: {
    addressLine1?: string;
    street: string;
    city: string;
    postCode: string;
    countryCode: string;
  };
}

export interface PaymentData {
  term: string;
  claimLimit: string;
  premium: number;
  paymentTerm: string;
  paymentMethod: string;
}

export interface InsuranceVariant {
  productCode: string;
  sellerNodeCode: string;
  signatureTypeCode: string;
  name: string;
  description: string;
}

export interface CalculationResult {
  premium: number;
  details: {
    baseAmount: number;
    tax: number;
    totalAmount: number;
  };
}

export interface NeedsAnalysisData {
  isInterestedInGapInsurance: boolean;
  hasValidAcPolicy: boolean;
  isVehiclePrivileged: boolean;
  isVehicleLeased: boolean;
  isVehicleFinanced: boolean;
  isVehicleUsedCommercially: boolean;
}

export interface PolicyResponse {
  policyId: string;
  status: string;
  documents?: {
    policy?: string;
    terms?: string;
    ipid?: string;
  };
}

export interface ProductOption {
  code: string;
  name?: string;
  sort?: number;
}

export interface ProductOptionType {
  code: string;
  name: string;
  options: ProductOption[];
}

export interface ProductInputSchemeItem {
  field: string;
  requiredForCalculation: boolean;
  requiredForConfirmation: boolean;
  step: string;
}

export interface Product {
  id: number;
  productCode: string;
  productGroupAlias: string;
  productDerivativeAlias: string;
  inputSchemeItems: ProductInputSchemeItem[];
  optionTypes: ProductOptionType[];
  signatureTypes: { code: string; name: string }[];
  vehicleCategories: { code: string; name: string }[];
  sort: number;
} 