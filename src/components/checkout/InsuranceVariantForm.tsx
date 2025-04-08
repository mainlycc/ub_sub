"use client"

import React from 'react';
import { ShieldCheck, CreditCard, Clock, Truck, TrendingDown } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface InsuranceVariantFormProps {
  data: InsuranceVariant;
  onChange: (data: InsuranceVariant) => void;
  onInputPathsChange?: (paths: { vehicle: InputPath[]; contact: InputPath[]; }) => void;
  errors?: { [key: string]: string };
}

interface InsuranceVariant {
  productCode: string;
  sellerNodeCode: string;
  signatureTypeCode: string;
}

interface InsuranceOptionsFormProps {
  data: InsuranceOptions;
  onChange: (data: InsuranceOptions) => void;
  errors?: { [key: string]: string };
  productCode: string;
}

interface InsuranceOptions {
  TERM: string;
  CLAIM_LIMIT: string;
  PAYMENT_TERM: string;
  PAYMENT_METHOD: string;
}

interface InputPath {
  field: string;
  requiredForCalculation: boolean;
  requiredForConfirmation: boolean;
  step: string;
  limitations?: {
    code: string;
    onlyForCategories: string[] | null;
  }[];
}

interface ProductInputPaths {
  [key: string]: {
    vehicle: InputPath[];
    contact: InputPath[];
  };
}

interface VariantOption {
  name: string;
  code: string;
  description: string;
  icon?: React.ElementType;
  color?: string;
  limit?: string;
  vehicleTypes: string[];
}

const productInputPaths: ProductInputPaths = {
  "5_DCGAP_MG25_GEN": {
    vehicle: [
      { field: "vehicleSnapshot.category", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.vin", requiredForCalculation: false, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.vrm", requiredForCalculation: false, requiredForConfirmation: false, step: "vehicle" },
      { field: "vehicleSnapshot.model", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.pricing", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.firstRegisteredOn", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.purchasedOn", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.usage", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.mileage", requiredForCalculation: false, requiredForConfirmation: true, step: "vehicle" }
    ],
    contact: [
      { field: "inceptionDate", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "contactWithoutBeneficiary", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "signatureType", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "note", requiredForCalculation: false, requiredForConfirmation: false, step: "contact" },
      { field: "vehicleSnapshot.owners", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" }
    ]
  },
  "4_DTGAP_MG25_GEN": {
    vehicle: [
      { field: "vehicleSnapshot.category", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.vin", requiredForCalculation: false, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.vrm", requiredForCalculation: false, requiredForConfirmation: false, step: "vehicle" },
      { field: "vehicleSnapshot.model", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.pricing", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.firstRegisteredOn", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.purchasedOn", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.usage", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.mileage", requiredForCalculation: false, requiredForConfirmation: true, step: "vehicle" }
    ],
    contact: [
      { field: "inceptionDate", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "contactWithoutBeneficiary", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "signatureType", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "note", requiredForCalculation: false, requiredForConfirmation: false, step: "contact" },
      { field: "vehicleSnapshot.owners", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" }
    ]
  },
  "5_DCGAP_M25_GEN": {
    vehicle: [
      { field: "vehicleSnapshot.category", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.vin", requiredForCalculation: false, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.vrm", requiredForCalculation: false, requiredForConfirmation: false, step: "vehicle" },
      { field: "vehicleSnapshot.model", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.pricing", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.firstRegisteredOn", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.purchasedOn", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.usage", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.mileage", requiredForCalculation: false, requiredForConfirmation: true, step: "vehicle" }
    ],
    contact: [
      { field: "inceptionDate", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "contactWithoutBeneficiary", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "signatureType", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "note", requiredForCalculation: false, requiredForConfirmation: false, step: "contact" },
      { field: "vehicleSnapshot.owners", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" }
    ]
  },
  "5_DTGAP_M25_GEN": {
    vehicle: [
      { field: "vehicleSnapshot.category", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.vin", requiredForCalculation: false, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.vrm", requiredForCalculation: false, requiredForConfirmation: false, step: "vehicle" },
      { field: "vehicleSnapshot.model", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.pricing", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.firstRegisteredOn", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.purchasedOn", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.usage", requiredForCalculation: true, requiredForConfirmation: true, step: "vehicle" },
      { field: "vehicleSnapshot.mileage", requiredForCalculation: false, requiredForConfirmation: true, step: "vehicle" }
    ],
    contact: [
      { field: "inceptionDate", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "contactWithoutBeneficiary", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "signatureType", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" },
      { field: "note", requiredForCalculation: false, requiredForConfirmation: false, step: "contact" },
      { field: "vehicleSnapshot.owners", requiredForCalculation: false, requiredForConfirmation: true, step: "contact" }
    ]
  }
};

const variantOptions: VariantOption[] = [
  {
    name: "DEFEND Gap MAX AC",
    code: "5_DCGAP_MG25_GEN",
    description: "Ubezpieczenie GAP dla samochodów osobowych z AC",
    icon: ShieldCheck,
    color: "bg-blue-600",
    limit: "50 000 - 300 000 zł",
    vehicleTypes: ["Osobowe (M1)", "Dostawcze do 3.5t (N1)"]
  },
  {
    name: "DEFEND Truck Gap T-MAX AC",
    code: "4_DTGAP_MG25_GEN",
    description: "Ubezpieczenie GAP dla samochodów ciężarowych z AC",
    icon: TrendingDown,
    color: "bg-orange-600",
    limit: "50 000 - 300 000 zł",
    vehicleTypes: ["Ciężarowe > 3.5t", "Autobusy", "Traktory", "Przyczepy"]
  }
];

const getClaimLimits = (productCode: string) => {
  return [
    { code: "CL_50000", name: "50 000 zł" },
    { code: "CL_100000", name: "100 000 zł" },
    { code: "CL_150000", name: "150 000 zł" },
    { code: "CL_200000", name: "200 000 zł" },
    { code: "CL_250000", name: "250 000 zł" },
    { code: "CL_300000", name: "300 000 zł" }
  ];
};

const terms = [
  { code: "T_12", name: "1 rok", disabled: false },
  { code: "T_24", name: "2 lata", disabled: false },
  { code: "T_36", name: "3 lata", disabled: false },
  { code: "T_48", name: "4 lata", disabled: false },
  { code: "T_60", name: "5 lat", disabled: false }
];

const paymentTerms = [
  { code: "PT_LS", name: "Płatność jednorazowa" },
  { code: "PT_A", name: "Płatność roczna" }
];

const paymentMethods = [
  { code: "PM_PBC", name: "Płatne przez klienta (BLIK, karta, szybki przelew)" },
  { code: "PM_BT", name: "Przelew tradycyjny" },
  { code: "PM_PAYU_M", name: "Raty miesięczne PayU" },
  { code: "PM_BY_DLR", name: "Płatne przez dealera" }
];

export const InsuranceVariantForm = ({ data, onChange, onInputPathsChange, errors }: InsuranceVariantFormProps): React.ReactElement => {
  const handleVariantSelect = (productCode: string) => {
    // Sprawdź, czy wybrany wariant istnieje
    const selectedVariant = variantOptions.find(variant => variant.code === productCode);
    if (!selectedVariant) return;

    onChange({
      ...data,
      productCode,
      sellerNodeCode: "PL_TEST_GAP_25",
      signatureTypeCode: "AUTHORIZED_BY_SMS"
    });

    // Przekaż informację o wymaganych polach dla wybranego produktu
    const selectedProductPaths = productInputPaths[productCode];
    if (selectedProductPaths && onInputPathsChange) {
      onInputPathsChange(selectedProductPaths);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">1</span>
        </div>
        Wybór wariantu ubezpieczenia GAP
      </h2>
      
      <p className="text-gray-600 mb-6">
        Wybierz odpowiedni wariant ubezpieczenia GAP dopasowany do Twojego pojazdu i potrzeb.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variantOptions.map((variant) => {
          const Icon = variant.icon || ShieldCheck;
          return (
            <div 
              key={variant.code}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all
                ${data.productCode === variant.code 
                  ? 'border-[#300FE6] bg-[#300FE6]/5' 
                  : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => handleVariantSelect(variant.code)}
            >
              <div className={`${variant.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{variant.name}</h3>
              <p className="text-gray-600 mb-4">{variant.description}</p>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-400 mr-2" />
                  <span className="text-sm">Okres ubezpieczenia: 1-5 lat</span>
                </div>
                <div className="flex items-center">
                  <CreditCard size={18} className="text-gray-400 mr-2" />
                  <span className="text-sm">Limit odszkodowania: {variant.limit}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium mb-1">Dostępne dla pojazdów:</span>
                  <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                    {variant.vehicleTypes.map((type, index) => (
                      <li key={index}>{type}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {errors?.productCode && (
        <p className="mt-2 text-sm text-red-500">{errors.productCode}</p>
      )}
    </div>
  );
};

export const InsuranceOptionsForm = ({ data, onChange, errors, productCode }: InsuranceOptionsFormProps) => {
  const claimLimits = getClaimLimits(productCode);

  const handleChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">4</span>
        </div>
        Opcje ubezpieczenia
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <Label>Okres ubezpieczenia</Label>
            <RadioGroup
              value={data.TERM}
              onValueChange={(value) => handleChange('TERM', value)}
              className="grid grid-cols-3 gap-4 mt-2"
            >
              {terms.map((term) => (
                <div key={term.code}>
                  <RadioGroupItem
                    value={term.code}
                    id={term.code}
                    disabled={term.disabled}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={term.code}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-[#300FE6] [&:has([data-state=checked])]:bg-[#300FE6]/5 cursor-pointer"
                  >
                    <span className="text-sm font-medium">{term.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors?.TERM && (
              <p className="mt-1 text-sm text-red-500">{errors.TERM}</p>
            )}
          </div>

          <div>
            <Label>Limit odszkodowania</Label>
            <RadioGroup
              value={data.CLAIM_LIMIT}
              onValueChange={(value) => handleChange('CLAIM_LIMIT', value)}
              className="grid grid-cols-2 gap-4 mt-2"
            >
              {claimLimits.map((limit) => (
                <div key={limit.code}>
                  <RadioGroupItem
                    value={limit.code}
                    id={limit.code}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={limit.code}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-[#300FE6] [&:has([data-state=checked])]:bg-[#300FE6]/5 cursor-pointer"
                  >
                    <span className="text-sm font-medium">{limit.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors?.CLAIM_LIMIT && (
              <p className="mt-1 text-sm text-red-500">{errors.CLAIM_LIMIT}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Rodzaj płatności</Label>
            <RadioGroup
              value={data.PAYMENT_TERM}
              onValueChange={(value) => handleChange('PAYMENT_TERM', value)}
              className="grid grid-cols-2 gap-4 mt-2"
            >
              {paymentTerms.map((term) => (
                <div key={term.code}>
                  <RadioGroupItem
                    value={term.code}
                    id={term.code}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={term.code}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-[#300FE6] [&:has([data-state=checked])]:bg-[#300FE6]/5 cursor-pointer"
                  >
                    <span className="text-sm font-medium">{term.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors?.PAYMENT_TERM && (
              <p className="mt-1 text-sm text-red-500">{errors.PAYMENT_TERM}</p>
            )}
          </div>

          <div>
            <Label>Forma płatności</Label>
            <RadioGroup
              value={data.PAYMENT_METHOD}
              onValueChange={(value) => handleChange('PAYMENT_METHOD', value)}
              className="grid grid-cols-1 gap-4 mt-2"
            >
              {paymentMethods.map((method) => (
                <div key={method.code}>
                  <RadioGroupItem
                    value={method.code}
                    id={method.code}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={method.code}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-[#300FE6] [&:has([data-state=checked])]:bg-[#300FE6]/5 cursor-pointer"
                  >
                    <span className="text-sm font-medium">{method.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors?.PAYMENT_METHOD && (
              <p className="mt-1 text-sm text-red-500">{errors.PAYMENT_METHOD}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 