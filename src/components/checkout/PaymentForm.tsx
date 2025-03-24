"use client"

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface PaymentFormProps {
  data: PaymentData;
  onChange: (data: PaymentData) => void;
  errors?: { [key: string]: string };
}

interface PaymentData {
  term: string;
  claimLimit: string;
  paymentTerm: string;
  paymentMethod: string;
}

export const PaymentForm = ({ data, onChange, errors }: PaymentFormProps): React.ReactElement => {
  const router = useRouter();

  const handlePaymentTermChange = (term: string) => {
    onChange({ ...data, paymentTerm: term });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">4</span>
        </div>
        Płatność
      </h2>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Wybierz sposób płatności
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-all
              ${data.paymentTerm === 'PT_LS' 
                ? 'border-[#300FE6] bg-[#300FE6]/5' 
                : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => handlePaymentTermChange('PT_LS')}
          >
            <div className="font-medium">Jednorazowo</div>
            <div className="text-sm text-gray-500">Zapłać całą kwotę od razu</div>
          </div>
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-all
              ${data.paymentTerm === 'PT_M' 
                ? 'border-[#300FE6] bg-[#300FE6]/5' 
                : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => handlePaymentTermChange('PT_M')}
          >
            <div className="font-medium">Miesięcznie</div>
            <div className="text-sm text-gray-500">Płać w miesięcznych ratach</div>
          </div>
        </div>
        {errors?.paymentTerm && (
          <p className="mt-1 text-sm text-red-500">{errors.paymentTerm}</p>
        )}
      </div>

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

        <Button
          onClick={() => router.push('/checkout/summary')}
          disabled={!data.paymentTerm}
          className="bg-[#300FE6] hover:bg-[#2208B0] text-white flex items-center"
        >
          Dalej
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}; 