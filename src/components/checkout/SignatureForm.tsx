"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PaymentData } from '@/types/insurance';

interface SignatureFormProps {
  data: PaymentData;
  onChange: (data: PaymentData) => void;
  errors?: { [key: string]: string };
}

const SIGNATURE_TYPES = [
  {
    code: "AUTHORIZED_BY_SMS",
    name: "Autoryzacja SMS",
    description: "Podpisz umowę poprzez kod SMS wysłany na Twój numer telefonu"
  },
  {
    code: "SIGNED_BY_PAYMENT",
    name: "Podpis przez płatność",
    description: "Podpisz umowę poprzez dokonanie płatności BLIK lub przelewem"
  }
] as const;

export const SignatureForm = ({ data, onChange, errors }: SignatureFormProps): React.ReactElement => {
  const router = useRouter();

  const handleSignatureTypeChange = (signatureTypeCode: PaymentData['signatureTypeCode']) => {
    onChange({
      ...data,
      signatureTypeCode
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Wybierz sposób podpisu umowy</h2>
        <p className="text-gray-600">
          Wybierz preferowaną metodę podpisania umowy ubezpieczenia. Możesz podpisać umowę poprzez autoryzację SMS lub dokonując płatności.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SIGNATURE_TYPES.map((type) => (
          <Button
            key={type.code}
            type="button"
            variant={data.signatureTypeCode === type.code ? "default" : "outline"}
            className={`w-full h-auto p-4 flex flex-col items-start space-y-2 ${
              data.signatureTypeCode === type.code ? 'bg-[#300FE6] text-white' : ''
            }`}
            onClick={() => handleSignatureTypeChange(type.code)}
          >
            <span className="text-lg font-semibold">{type.name}</span>
            <span className="text-sm font-normal">{type.description}</span>
          </Button>
        ))}
      </div>

      {errors?.signatureTypeCode && (
        <p className="mt-2 text-sm text-red-600">{errors.signatureTypeCode}</p>
      )}

      {/* Przyciski nawigacji */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex items-center text-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Wróć
        </Button>
      </div>
    </div>
  );
}; 