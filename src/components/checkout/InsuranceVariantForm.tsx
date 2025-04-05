"use client"

import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { PaymentData, Product } from '@/types/insurance'; // Importujemy Product
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select

// Definiujemy i eksportujemy Props
export interface InsuranceVariantFormProps {
  availableProducts: Product[];
  selectedProduct: Product | null;
  paymentOptions: Partial<PaymentData>;
  onProductSelect: (product: Product) => void;
  onOptionsChange: Dispatch<SetStateAction<Partial<PaymentData>>>;
  errors: any; // Uproszczone
  onNext: () => void;
}

export const InsuranceVariantForm: React.FC<InsuranceVariantFormProps> = ({
  availableProducts,
  selectedProduct,
  paymentOptions,
  onProductSelect,
  onOptionsChange,
  errors,
  onNext
}) => {
  // Przeniesione logowanie tutaj
  console.log('PaymentForm otrzymał selectedProduct:', selectedProduct);
  console.log('InsuranceVariantForm: Otrzymano availableProducts:', availableProducts);

  // Funkcja pomocnicza do pobierania dostępnych opcji dla danego typu
  const getOptionsForType = (product: Product | null, optionTypeCode: string) => {
    return product?.optionTypes.find(ot => ot.code === optionTypeCode)?.options || [];
  };

  const termOptions = getOptionsForType(selectedProduct, 'TERM');
  const claimLimitOptions = getOptionsForType(selectedProduct, 'CLAIM_LIMIT');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Wybór wariantu i opcji</h2>

      {/* Wybór produktu (jeśli nie został jeszcze wybrany) */}
      {!selectedProduct && (
        <>
          <p className="text-gray-600 mb-4">
            Wybierz produkt ubezpieczenia GAP, który najlepiej odpowiada Twoim potrzebom.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableProducts.map((product: Product) => {
              // @ts-expect-error - Ignorujemy błąd "does not exist on type 'never'"
              const isSelected = selectedProduct?.productCode === product.productCode;
              const buttonClasses = `border-2 rounded-lg p-4 text-left transition-all hover:shadow-md ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`;

              return (
                <button
                  // Zostawiamy @ts-expect-error, bo linter wariuje
                  // @ts-expect-error - Ignorujemy uporczywy błąd "does not exist on type 'never'"
                  key={product.productCode}
                  onClick={() => onProductSelect(product)}
                  className={buttonClasses}
                >
                  <h3 className="text-lg font-semibold mb-1">{product.productDerivativeAlias} ({product.productGroupAlias})</h3>
                </button>
              );
            })}
          </div>
          {errors?.productCode && (
            <p className="mt-2 text-sm text-red-500">{errors.productCode}</p>
          )}
        </>
      )}

      {/* Konfiguracja opcji dla wybranego produktu */}
      {selectedProduct && (
        <>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">Konfiguracja: {selectedProduct.productDerivativeAlias}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wybór okresu ubezpieczenia (TERM) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Okres ubezpieczenia</label>
              <Select
                value={paymentOptions.term}
                onValueChange={(value) => onOptionsChange(prev => ({ ...prev, term: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz okres" />
                </SelectTrigger>
                <SelectContent>
                  {termOptions.map(option => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name || option.code} {/* Wyświetl nazwę lub kod */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.term && <p className="mt-1 text-sm text-red-500">{errors.term}</p>}
            </div>

            {/* Wybór limitu odszkodowania (CLAIM_LIMIT) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limit odszkodowania</label>
              <Select
                value={paymentOptions.claimLimit}
                onValueChange={(value) => onOptionsChange(prev => ({ ...prev, claimLimit: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz limit" />
                </SelectTrigger>
                <SelectContent>
                  {claimLimitOptions.map(option => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name || option.code} {/* Wyświetl nazwę lub kod */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.claimLimit && <p className="mt-1 text-sm text-red-500">{errors.claimLimit}</p>}
            </div>
          </div>
          {/* Przycisk Dalej pojawia się dopiero po wybraniu produktu */}
          <div className="flex justify-end mt-6">
            <Button onClick={onNext} disabled={!paymentOptions.term || !paymentOptions.claimLimit}>
              Dalej
            </Button>
          </div>
        </>
      )}
    </div>
  );
}; 