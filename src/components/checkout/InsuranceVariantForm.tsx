"use client"

import React, { useEffect, useState } from 'react';
import { ShieldCheck, CreditCard, Clock, TrendingDown, Car, Truck } from 'lucide-react';
import { VehicleMakeSelect } from './VehicleMakeSelect';
import { VehicleModelSelect } from './VehicleModelSelect';

interface InsuranceVariantFormProps {
  data: InsuranceVariant;
  onChange: (data: InsuranceVariant) => void;
  onInputPathsChange?: (paths: { vehicle: InputPath[]; contact: InputPath[]; }) => void;
  errors?: { [key: string]: string };
  showOnlyVariantSelection?: boolean;
}

interface InsuranceVariant {
  productCode: string;
  sellerNodeCode: string;
  signatureTypeCode: string;
  options: Array<{
    code: string;
    value: string | number;
  }>;
  vehicleMake: string | null;
  vehicleTypes?: string[];
  vehicleModel: string | null;
}

interface Portfolio {
  productCode: string;
  sellerNodeCode: string;
  name: string;
  description?: string;
  signatureTypes: Array<{
    code: string;
    name: string;
  }>;
  optionTypes: Array<{
    code: string;
    name: string;
  }>;
  vehicleTypes?: string[];
  productGroupAlias?: string;
  productDerivativeAlias?: string;
}

interface InputPath {
  field: string;
  requiredForCalculation: boolean;
  requiredForConfirmation: boolean;
  step: string;
}

interface VariantOption {
  code: string;
  name: string;
  description: string;
  icon: React.ElementType;
  vehicleTypes: string[];
}

// Funkcja pomocnicza do pobierania ścieżek wejściowych dla produktu
const getInputPathsForProduct = (productCode: string): { vehicle: InputPath[]; contact: InputPath[]; } => {
  const paths = {
    vehicle: [
      { field: 'make', requiredForCalculation: true, requiredForConfirmation: true, step: 'vehicle' },
      { field: 'model', requiredForCalculation: true, requiredForConfirmation: true, step: 'vehicle' },
      { field: 'categoryCode', requiredForCalculation: true, requiredForConfirmation: true, step: 'vehicle' },
      { field: 'usageCode', requiredForCalculation: true, requiredForConfirmation: true, step: 'vehicle' }
    ],
    contact: [
      { field: 'email', requiredForCalculation: false, requiredForConfirmation: true, step: 'contact' },
      { field: 'phone', requiredForCalculation: false, requiredForConfirmation: true, step: 'contact' }
    ]
  };
  return paths;
};

const variantOptions: VariantOption[] = [
  {
    code: '5_DCGAP_MG25_GEN',
    name: 'DEFEND Gap MAX AC',
    description: 'Ubezpieczenie GAP dla samochodów osobowych z AC',
    icon: ShieldCheck,
    vehicleTypes: ['PC']
  },
  {
    code: '4_DTGAP_MG25_GEN',
    name: 'DEFEND Truck Gap T-MAX AC',
    description: 'Ubezpieczenie GAP dla samochodów ciężarowych z AC',
    icon: Truck,
    vehicleTypes: ['CV']
  }
];

export const InsuranceVariantForm = ({ data, onChange, onInputPathsChange, errors, showOnlyVariantSelection }: InsuranceVariantFormProps): React.ReactElement => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const getDefaultName = (productCode: string, productGroupAlias?: string, productDerivativeAlias?: string): string => {
    if (productGroupAlias && productDerivativeAlias) {
      return `${productGroupAlias} ${productDerivativeAlias}`;
    }
    return 'Ubezpieczenie GAP';
  };

  const getDefaultDescription = (productCode: string, productGroupAlias?: string): string => {
    if (productCode.includes('DTGAP')) {
      return 'Ubezpieczenie GAP dla samochodów ciężarowych';
    }
    return 'Ubezpieczenie GAP dla samochodów osobowych';
  };

  const getVariantIcon = (productCode: string): React.ElementType => {
    if (productCode.includes('DTGAP')) {
      return Truck;
    }
    return ShieldCheck;
  };

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        const response = await fetch('/api/policies/creation/portfolios');
        
        if (!response.ok) {
          throw new Error('Nie udało się pobrać listy produktów');
        }

        const data = await response.json();
        console.log('Dane z API:', data);

        // Filtrujemy i mapujemy produkty
        const mappedPortfolios: Portfolio[] = data
          .filter((item: any) => 
            !['5_DCGAP_F25_GEN', '5_DCGAP_FG25_GEN'].includes(item.productCode)
          )
          .map((portfolio: any) => ({
            productCode: portfolio.productCode,
            sellerNodeCode: "PL_TEST_GAP_25",
            name: `${portfolio.productGroupAlias} ${portfolio.productDerivativeAlias}`,
            description: getProductDescription(portfolio),
            signatureTypes: [{ 
              code: "AUTHORIZED_BY_SMS", 
              name: "Autoryzacja SMS" 
            }],
            optionTypes: portfolio.optionTypes || [],
            vehicleTypes: portfolio.productCode.includes('DTGAP') ? ['CV'] : ['PC'],
            productGroupAlias: portfolio.productGroupAlias
          }));

        console.log('Zmapowane portfolio:', mappedPortfolios);
        setPortfolios(mappedPortfolios);
      } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
        setLoadError(error instanceof Error ? error.message : 'Nie udało się pobrać listy produktów');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  // Funkcja pomocnicza do generowania opisów produktów
  const getProductDescription = (portfolio: any): string => {
    const isCommercial = portfolio.productCode.includes('DTGAP');
    const hasAC = portfolio.productDerivativeAlias.includes('AC');
    
    if (isCommercial) {
      return `Ubezpieczenie dla pojazdów ciężarowych${hasAC ? ' z AC' : ''}`;
    }
    return `Ubezpieczenie dla samochodów osobowych${hasAC ? ' z AC' : ''}`;
  };

  const handleVariantSelect = (portfolio: Portfolio) => {
    const selectedVariant: InsuranceVariant = {
      productCode: portfolio.productCode,
      sellerNodeCode: "PL_TEST_GAP_25",
      signatureTypeCode: "AUTHORIZED_BY_SMS",
      options: [],
      vehicleTypes: portfolio.vehicleTypes,
      vehicleMake: null,
      vehicleModel: null
    };

    onChange(selectedVariant);

    const inputPaths = getInputPathsForProduct(portfolio.productCode);
    if (onInputPathsChange) {
      onInputPathsChange(inputPaths);
    }
  };

  const handleMakeSelect = (make: string | null) => {
    onChange({
      ...data,
      vehicleMake: make,
      vehicleModel: '' // Reset modelu przy zmianie marki
    });
  };

  const handleModelSelect = (model: string | null) => {
    onChange({
      ...data,
      vehicleModel: model
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50 text-red-700">
        <p className="font-medium">Wystąpił błąd podczas ładowania produktów</p>
        <p className="text-sm mt-1">{loadError}</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">1</span>
        </div>
          Wybierz wariant ubezpieczenia
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {variantOptions.map((variant) => {
            const Icon = variant.icon;
            const isSelected = data.productCode === variant.code;

            return (
              <button
                key={variant.code}
                type="button"
                onClick={() => handleVariantSelect({
                  productCode: variant.code,
                  sellerNodeCode: "PL_TEST_GAP_25",
                  name: variant.name,
                  signatureTypes: [{ code: "AUTHORIZED_BY_SMS", name: "Autoryzacja SMS" }],
                  optionTypes: [],
                  vehicleTypes: variant.vehicleTypes
                })}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-[#300FE6] bg-[#300FE6]/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    isSelected ? 'bg-[#300FE6]/20 text-[#300FE6]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{variant.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{variant.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {errors?.productCode && (
          <p className="text-sm text-red-500 mt-2">{errors.productCode}</p>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Wybierz pojazd</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VehicleMakeSelect
              selectedMakeId={data.vehicleMake ?? null}
              onMakeSelect={handleMakeSelect}
              error={errors?.vehicleMake}
            />
            <VehicleModelSelect
              selectedModelId={data.vehicleModel ?? null}
              onModelSelect={handleModelSelect}
              error={errors?.vehicleModel}
              makeId={data.vehicleMake ?? null}
            />
          </div>
        </div>
      </div>
    </form>
  );
}; 