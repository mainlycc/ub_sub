"use client"

import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { PaymentData, Product } from '@/types/insurance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PaymentFormProps {
  selectedProduct: Product | null;
  paymentOptions: Partial<PaymentData>;
  onOptionsChange: Dispatch<SetStateAction<Partial<PaymentData>>>;
  errors: any;
  onNext: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedProduct,
  paymentOptions,
  onOptionsChange,
  errors,
  onNext
}) => {
  console.log('PaymentForm otrzymał selectedProduct:', selectedProduct);
  const router = useRouter();

  const getPaymentOptionsForType = (product: Product | null, optionTypeCode: string) => {
    return product?.optionTypes.find(ot => ot.code === optionTypeCode)?.options || [];
  };

  const paymentTermOptions = getPaymentOptionsForType(selectedProduct, 'PAYMENT_TERM');
  const paymentMethodOptions = getPaymentOptionsForType(selectedProduct, 'PAYMENT_METHOD');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Płatność</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rodzaj płatności</label>
          <Select
            value={paymentOptions.paymentTerm}
            onValueChange={(value) => onOptionsChange(prev => ({ ...prev, paymentTerm: value }))}
            disabled={paymentTermOptions.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wybierz rodzaj płatności" />
            </SelectTrigger>
            <SelectContent>
              {paymentTermOptions.map(option => (
                <SelectItem key={option.code} value={option.code}>
                  {option.name || option.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.paymentTerm && <p className="mt-1 text-sm text-red-500">{errors.paymentTerm}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Forma płatności</label>
          <Select
            value={paymentOptions.paymentMethod}
            onValueChange={(value) => onOptionsChange(prev => ({ ...prev, paymentMethod: value }))}
            disabled={paymentMethodOptions.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wybierz formę płatności" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethodOptions.map(option => (
                <SelectItem key={option.code} value={option.code}>
                  {option.name || option.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.paymentMethod && <p className="mt-1 text-sm text-red-500">{errors.paymentMethod}</p>}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={onNext}
          disabled={!paymentOptions.paymentTerm || !paymentOptions.paymentMethod}
          className="bg-[#300FE6] hover:bg-[#2208B0] text-white flex items-center"
        >
          Dalej
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}; 