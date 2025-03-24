"use client"

import React from 'react';
import { ShieldCheck, CreditCard, Clock } from 'lucide-react';

interface InsuranceVariantFormProps {
  data: InsuranceVariant;
  onChange: (data: InsuranceVariant) => void;
  errors?: { [key: string]: string };
}

interface InsuranceVariant {
  productCode: string;
  sellerNodeCode: string;
  signatureTypeCode: string;
}

const variantOptions = [
  { 
    code: "5_DCGAP_MG25_GEN", 
    name: "GAP Fakturowy", 
    description: "Zwrot różnicy między fakturą zakupu a wartością pojazdu w momencie szkody całkowitej",
    color: "bg-blue-600",
    limit: "do 300 000 zł"
  },
  { 
    code: "5_DCGAP_PV25_GEN", 
    name: "GAP Wartości Pojazdu", 
    description: "Wyrównanie wartości pojazdu w przypadku szkody całkowitej",
    color: "bg-green-600",
    limit: "do 50 000 zł"
  }
];

export const InsuranceVariantForm = ({ data, onChange, errors }: InsuranceVariantFormProps): React.ReactElement => {
  const handleVariantSelect = (productCode: string) => {
    onChange({
      ...data,
      productCode
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">1</span>
        </div>
        Określenie wariantu ubezpieczenia
      </h2>
      
      <p className="text-gray-600 mb-6">
        Wybierz najlepszy wariant ubezpieczenia GAP dopasowany do Twoich potrzeb.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variantOptions.map((variant) => (
          <div 
            key={variant.code}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all
              ${data.productCode === variant.code 
                ? 'border-[#300FE6] bg-[#300FE6]/5' 
                : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => handleVariantSelect(variant.code)}
          >
            <div className={`${variant.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
              <ShieldCheck className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">{variant.name}</h3>
            <p className="text-gray-600 mb-4">{variant.description}</p>
            
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Clock size={18} className="text-gray-400 mr-2" />
                <span className="text-sm">Ubezpieczenie na okres 3-5 lat</span>
              </div>
              <div className="flex items-center">
                <CreditCard size={18} className="text-gray-400 mr-2" />
                <span className="text-sm">Możliwość opłaty jednorazowej lub w ratach</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck size={18} className="text-gray-400 mr-2" />
                <span className="text-sm">Limit odszkodowania: {variant.limit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {errors?.productCode && (
        <p className="mt-2 text-sm text-red-500">{errors.productCode}</p>
      )}
    </div>
  );
}; 