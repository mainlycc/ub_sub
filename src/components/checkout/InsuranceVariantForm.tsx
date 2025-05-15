"use client"

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Truck } from 'lucide-react';
import { EnvironmentSwitch } from './EnvironmentSwitch';
import { useEnvironmentStore } from '@/lib/environment';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { getCurrentEnvironment } from '@/lib/environment';

interface InsuranceVariant {
  productCode: string;
  sellerNodeCode: string;
  signatureTypeCode: string;
  options: Array<{ code: string; value: string }>;
  vehicleTypes: string[];
}

interface Portfolio {
  productCode: string;
  sellerNodeCode: string;
  name: string;
  description: string;
  signatureTypes: Array<{ code: string; name: string }>;
  optionTypes: Array<{ code: string }>;
  vehicleTypes: string[];
  productGroupAlias: string;
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

// Definicja typu dla danych portfolio z API
interface PortfolioApiResponse {
  productCode: string;
  productGroupAlias?: string;
  productDerivativeAlias?: string;
  optionTypes?: Array<{
    code: string;
    name: string;
  }>;
}

// Funkcja pomocnicza do pobierania ścieżek wejściowych dla produktu
const getInputPathsForProduct = (/* productCode */): { vehicle: InputPath[]; contact: InputPath[]; } => {
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

interface InsuranceVariantFormProps {
  data: InsuranceVariant;
  onChange: (variant: InsuranceVariant) => void;
  onInputPathsChange?: (paths: string[]) => void;
  errors?: Record<string, string>;
}

// Funkcja pomocnicza do generowania opisów produktów
const getProductDescription = (portfolio: any): string => {
  if (portfolio.productCode.includes('DTGAP')) {
    return 'Ubezpieczenie GAP dla pojazdów ciężarowych';
  }
  return portfolio.productCode.includes('MG25') 
    ? 'Ubezpieczenie GAP MAX - chroni przed spadkiem wartości pojazdu' 
    : 'Ubezpieczenie GAP Fakturowy - gwarantuje zwrot różnicy w cenie';
};

export const InsuranceVariantForm = ({ data, onChange, onInputPathsChange, errors }: InsuranceVariantFormProps): React.ReactElement => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!isMounted) return;

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
        const mappedPortfolios = data
          .filter((item: any) => 
            !['5_DCGAP_F25_GEN', '5_DCGAP_FG25_GEN'].includes(item.productCode)
          )
          .map((portfolio: any) => ({
            productCode: portfolio.productCode,
            sellerNodeCode: "PL_GAP_25", // Stały kod dla produkcji
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

        setPortfolios(mappedPortfolios);
      } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
        setLoadError(error instanceof Error ? error.message : 'Nie udało się pobrać listy produktów');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, [isMounted]);

  const handleVariantSelect = (value: string) => {
    const selectedPortfolio = portfolios.find(p => p.productCode === value);
    if (selectedPortfolio) {
      const variant: InsuranceVariant = {
        productCode: selectedPortfolio.productCode,
        sellerNodeCode: selectedPortfolio.sellerNodeCode,
        signatureTypeCode: "AUTHORIZED_BY_SMS",
        options: selectedPortfolio.optionTypes.map(option => ({ 
          code: option.code, 
          value: '' 
        })),
        vehicleTypes: selectedPortfolio.vehicleTypes
      };
      onChange(variant);
    }
  };

  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  if (loadError) {
    return <div className="text-red-500">Błąd: {loadError}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <RadioGroup
          value={data.productCode}
          onValueChange={handleVariantSelect}
          className="grid grid-cols-1 gap-4 pt-2"
        >
          {portfolios.map((portfolio) => (
            <div key={portfolio.productCode} className="flex items-center space-x-3">
              <RadioGroupItem value={portfolio.productCode} id={portfolio.productCode} />
              <Label htmlFor={portfolio.productCode}>
                <div className="font-medium">{portfolio.name}</div>
                <div className="text-sm text-gray-500">{portfolio.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
        {errors?.productCode && (
          <p className="text-sm text-red-500 mt-2">{errors.productCode}</p>
        )}
      </div>
    </div>
  );
}; 