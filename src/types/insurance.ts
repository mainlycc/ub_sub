// Typy dla danych pojazdu
export interface VehicleData {
  make: string;
  model: string;
  modelCode: string;
  categoryCode: "PC";
  usageCode: string;
  evaluationDate: string;
  vehicleCategory: "CAR" | "VAN" | "TRUCK";
  usageType: "PRIVATE" | "COMMERCIAL" | "MIXED";
  registrationNumber: string;
  vinNumber: string;
  productionYear: number;
  mileage: number;
  purchasePrice: number;
  purchasePriceNet: number;
  purchasePriceType: "brutto" | "netto" | "netto_vat";
  purchasePriceVatReclaimable: "tak" | "50" | "nie";
  firstRegisteredOn: string;
  purchasedOn: string;
  vin: string;
  vrm: string;
}

// Typy dla danych osobowych
export interface PersonalData {
  type: "person";
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  identificationNumber: string;
  phone: string;
  pesel: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postalCode: string;
  city: string;
  address: {
    addressLine1: string;
    street: string;
    city: string;
    postCode: string;
    countryCode: string;
  };
}

// Typy dla wariantów ubezpieczenia
export interface InsuranceVariant {
  productCode: "5_DCGAP_M25_GEN" | "5_DCGAP_MG25_GEN" | "5_DCGAP_F25_GEN" | "5_DCGAP_FG25_GEN";
  sellerNodeCode: string;
  signatureTypeCode: "AUTHORIZED_BY_SMS" | "SIGNED_BY_PAYMENT";
  name: string;
  description: string;
}

// Typy dla danych płatności
export interface PaymentData {
  productCode: "5_DCGAP_M25_GEN" | "5_DCGAP_MG25_GEN" | "5_DCGAP_F25_GEN" | "5_DCGAP_FG25_GEN";
  sellerNodeCode: string;
  signatureTypeCode: "AUTHORIZED_BY_SMS" | "SIGNED_BY_PAYMENT";
  paymentMethod: "PM_PAYU" | "PM_BT" | "PM_BY_DLR" | "PM_PBC" | "PM_PAYU_M" | "PM_BLIK";
}

// Typy dla wyników kalkulacji
export interface CalculationResult {
  premium: number;
  premiumNet: number;
  premiumTax: number;
  currency: string;
  productName: string;
  coveragePeriod: number;
  vehicleValue: number;
  maxCoverage: number;
  options: {
    TERM: "T_24" | "T_36" | "T_48" | "T_60";
    CLAIM_LIMIT: "CL_100000" | "CL_150000" | "CL_200000";
    PAYMENT_TERM: "PT_LS" | "PT_A";
    PAYMENT_METHOD: "PM_PAYU" | "PM_BT" | "PM_BY_DLR" | "PM_PBC" | "PM_PAYU_M";
  };
}

// Typy dla analizy potrzeb
export interface NeedsAnalysisData {
  isInterestedInGapInsurance: boolean;
  hasValidAcPolicy: boolean;
  isVehiclePrivileged: boolean;
  isVehicleLeased: boolean;
  isVehicleFinanced: boolean;
  isVehicleUsedCommercially: boolean;
}

// Typy dla żądania polisy
export interface PolicyRequest {
  extApiNo: string | null;
  extReferenceNo: string | null;
  extTenderNo: string | null;
  sellerNodeCode: string;
  productCode: string;
  saleInitiatedOn: string;
  signatureTypeCode: string;
  confirmedByDefault: boolean | null;
  vehicleSnapshot: {
    purchasedOn: string;
    modelCode: string;
    categoryCode: "PC" | string;
    usageCode: "STANDARD" | string;
    mileage: number;
    firstRegisteredOn: string;
    evaluationDate: string;
    purchasePrice: number;
    purchasePriceNet: number;
    purchasePriceVatReclaimableCode: "VAT_RECLAIMABLE" | "VAT_NOT_RECLAIMABLE" | "VAT_PARTIALLY_RECLAIMABLE";
    usageTypeCode: "INDIVIDUAL" | string;
    purchasePriceInputType: "GROSS" | "NET" | "VAT_INAPPLICABLE";
    vin: string;
    vrm: string;
    owners: Array<{
      contact: {
        inheritFrom: "policyHolder"
      }
    }>;
  };
  client: {
    policyHolder: {
      type: "person" | "company";
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
    };
    insured: {
      inheritFrom: "policyHolder";
    };
    beneficiary: {
      inheritFrom: "policyHolder";
    };
  };
  options: {
    TERM: "T_36" | "T_48" | "T_60";
    CLAIM_LIMIT: "CL_100000" | "CL_150000" | "CL_200000";
    PAYMENT_TERM: "PT_LS" | "PT_A";
    PAYMENT_METHOD: "PM_PAYU" | "PM_BT" | "PM_BY_DLR" | "PM_PBC" | "PM_PAYU_M";
  };
  premium: number;
} 