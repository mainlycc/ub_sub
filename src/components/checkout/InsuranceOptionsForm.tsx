"use client"

import React, { useEffect } from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InsuranceOptions } from "@/types/checkout";

export interface InsuranceOptionsFormProps {
  data: InsuranceOptions;
  onChange: (data: InsuranceOptions) => void;
  errors?: { [key: string]: string };
  productCode: string;
}

const terms = [
  { code: "T_12", name: "1 rok" },
  { code: "T_24", name: "2 lata" },
  { code: "T_36", name: "3 lata" },
  { code: "T_48", name: "4 lata" },
  { code: "T_60", name: "5 lat" }
];

const paymentTerms = [
  { code: "PT_LS", name: "Płatność jednorazowa" },
  { code: "PT_A", name: "Płatność roczna" }
];

const paymentMethods = [
  { code: "PM_PBC", name: "Płatność online (BLIK, karta, szybki przelew)" },
  { code: "PM_BT", name: "Przelew tradycyjny" },
  { code: "PM_PAYU_M", name: "Raty miesięczne PayU" },
  { code: "PM_BY_DLR", name: "Płatne przez dealera" }
];

const getClaimLimits = (productCode: string) => {
  if (productCode.includes('DCGAP_FG') || productCode.includes('DCGAP_F')) {
    return [{ code: "CL_100000", name: "100 000 zł" }];
  }
  
  if (productCode.includes('DCGAP_MG') || productCode.includes('DCGAP_M') || productCode.includes('DTGAP')) {
    return [
      { code: "CL_50000", name: "50 000 zł" },
      { code: "CL_100000", name: "100 000 zł" },
      { code: "CL_150000", name: "150 000 zł" },
      { code: "CL_200000", name: "200 000 zł" },
      { code: "CL_250000", name: "250 000 zł" },
      { code: "CL_300000", name: "300 000 zł" }
    ];
  }
  
  return [];
};

const isOptionCombinationDisabled = (options: InsuranceOptions): boolean => {
  const disabledCombinations = [
    ["PT_A", "PM_BY_DLR"],
    ["PT_A", "PM_PAYU_M"],
    ["T_12", "PT_A"],
    ["PT_A", "PM_ONLINE"]
  ];
  
  return disabledCombinations.some(([opt1, opt2]) => 
    options[opt1 as keyof InsuranceOptions] === opt1 && 
    options[opt2 as keyof InsuranceOptions] === opt2
  );
};

const getAvailablePaymentMethods = (paymentTerm: string) => {
  if (paymentTerm === 'PT_A') {
    return paymentMethods.filter(method => 
      !['PM_BY_DLR', 'PM_PAYU_M', 'PM_ONLINE'].includes(method.code)
    );
  }
  return paymentMethods;
};

export const InsuranceOptionsForm = ({ data, onChange, errors, productCode }: InsuranceOptionsFormProps) => {
  const claimLimits = getClaimLimits(productCode);
  const availablePaymentMethods = getAvailablePaymentMethods(data.PAYMENT_TERM);

  useEffect(() => {
    // Sprawdź czy aktualna kombinacja jest dozwolona
    if (isOptionCombinationDisabled(data)) {
      // Resetuj metodę płatności jeśli kombinacja jest niedozwolona
      onChange({
        ...data,
        PAYMENT_METHOD: ''
      });
    }
  }, [data.PAYMENT_TERM]);

  const handleChange = (field: keyof InsuranceOptions, value: string) => {
    const newData = {
      ...data,
      [field]: value
    };

    // Jeśli zmieniono rodzaj płatności, zresetuj metodę płatności
    if (field === 'PAYMENT_TERM') {
      newData.PAYMENT_METHOD = '';
    }

    // Sprawdź czy nowa kombinacja jest dozwolona
    if (!isOptionCombinationDisabled(newData)) {
      onChange(newData);
    }
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
        <div className="space-y-4">
          <div>
            <Label>Okres ubezpieczenia</Label>
            <Select 
              value={data.TERM} 
              onValueChange={(value) => handleChange('TERM', value)}
              disabled={data.PAYMENT_TERM === 'PT_A'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz okres ubezpieczenia" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem 
                    key={term.code} 
                    value={term.code}
                    disabled={data.PAYMENT_TERM === 'PT_A' && term.code === 'T_12'}
                  >
                    {term.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.TERM && (
              <p className="mt-1 text-sm text-red-500">{errors.TERM}</p>
            )}
          </div>

          <div>
            <Label>Limit odszkodowania</Label>
            <Select value={data.CLAIM_LIMIT} onValueChange={(value) => handleChange('CLAIM_LIMIT', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz limit odszkodowania" />
              </SelectTrigger>
              <SelectContent>
                {claimLimits.map((limit) => (
                  <SelectItem key={limit.code} value={limit.code}>
                    {limit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.CLAIM_LIMIT && (
              <p className="mt-1 text-sm text-red-500">{errors.CLAIM_LIMIT}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Rodzaj płatności</Label>
            <Select value={data.PAYMENT_TERM} onValueChange={(value) => handleChange('PAYMENT_TERM', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz rodzaj płatności" />
              </SelectTrigger>
              <SelectContent>
                {paymentTerms.map((term) => (
                  <SelectItem key={term.code} value={term.code}>
                    {term.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.PAYMENT_TERM && (
              <p className="mt-1 text-sm text-red-500">{errors.PAYMENT_TERM}</p>
            )}
          </div>

          <div>
            <Label>Forma płatności</Label>
            <Select 
              value={data.PAYMENT_METHOD} 
              onValueChange={(value) => handleChange('PAYMENT_METHOD', value)}
              disabled={!data.PAYMENT_TERM}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz formę płatności" />
              </SelectTrigger>
              <SelectContent>
                {availablePaymentMethods.map((method) => (
                  <SelectItem key={method.code} value={method.code}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.PAYMENT_METHOD && (
              <p className="mt-1 text-sm text-red-500">{errors.PAYMENT_METHOD}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 