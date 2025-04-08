export interface VehicleCategory {
  code: string;
  name: string;
}

export interface UsageLimitation {
  categoryCode: string;
  usageCode: string;
}

export interface Option {
  code: string;
  name: string;
  value: string | number;
}

export interface OptionType {
  code: string;
  name: string;
  options: Option[];
}

export interface DisabledOptionCombination {
  optionTypeCode: string;
  optionCode: string;
  disabledOptionTypeCode: string;
  disabledOptionCode: string;
}

export interface InputSchemeItem {
  code: string;
  name: string;
  type: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface Product {
  code: string;
  name: string;
  vehicleCategories: VehicleCategory[];
  usageLimitations: UsageLimitation[];
  optionTypes: OptionType[];
  disabledOptionCombinations: DisabledOptionCombination[];
  inputScheme: InputSchemeItem[];
}

export interface Portfolio {
  products: Product[];
} 