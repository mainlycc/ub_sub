"use client"

import React from 'react';
import { Button } from "@/components/ui/button";

interface InsuranceVariant {
  productCode: "5_DCGAP_M25_GEN" | "5_DCGAP_MG25_GEN" | "5_DCGAP_F25_GEN" | "5_DCGAP_FG25_GEN";
  sellerNodeCode: string;
  signatureTypeCode: "AUTHORIZED_BY_SMS" | "SIGNED_BY_PAYMENT";
}

interface InsuranceVariantFormProps {
  data: InsuranceVariant;
  onChange: (data: InsuranceVariant) => void;
  errors?: { [key: string]: string };
}

const PRODUCT_VARIANTS = [
  {
    code: "5_DCGAP_M25_GEN",
    name: "GAP MAX",
    description: "Ochrona wartości pojazdu w przypadku szkody całkowitej lub kradzieży"
  },
  {
    code: "5_DCGAP_MG25_GEN",
    name: "GAP MAX AC",
    description: "Rozszerzona ochrona wartości pojazdu z uwzględnieniem polisy AC"
  },
  {
    code: "5_DCGAP_F25_GEN",
    name: "GAP FLEX",
    description: "Elastyczna ochrona dopasowana do Twoich potrzeb"
  },
  {
    code: "5_DCGAP_FG25_GEN",
    name: "GAP FLEX GO",
    description: "Specjalny wariant dla przedsiębiorców i przedstawicieli handlowych"
  }
] as const;

export const InsuranceVariantForm = ({ data, onChange, errors }: InsuranceVariantFormProps) => {
  const handleVariantChange = (productCode: InsuranceVariant['productCode']) => {
    onChange({
      ...data,
      productCode
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Wybierz wariant ubezpieczenia</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRODUCT_VARIANTS.map((variant) => (
          <Button
            key={variant.code}
            type="button"
            variant={data.productCode === variant.code ? "default" : "outline"}
            className={`w-full h-auto p-4 flex flex-col items-start space-y-2 ${
              data.productCode === variant.code ? 'bg-[#300FE6] text-white' : ''
            }`}
            onClick={() => handleVariantChange(variant.code)}
          >
            <span className="text-lg font-semibold">{variant.name}</span>
            <span className="text-sm font-normal">{variant.description}</span>
          </Button>
        ))}
      </div>

      {errors?.productCode && (
        <p className="mt-2 text-sm text-red-600">{errors.productCode}</p>
      )}
    </div>
  );
}; 