"use client"

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { NeedsAnalysisData } from '@/types/insurance';

// Definicja Product (tymczasowo tutaj, docelowo w types/insurance.ts)
// Powinna pasować do definicji w page.tsx
export interface Product {
  id: number;
  productCode: string;
  productGroupAlias: string;
  productDerivativeAlias: string;
  inputSchemeItems: any[];
  optionTypes: any[];
  signatureTypes: any[];
  vehicleCategories: any[];
  sort: number;
}

interface RecommendationFormProps {
  needsAnalysisData: NeedsAnalysisData;
  availableProducts: Product[]; // Dodajemy dostępne produkty
  onAccept: (recommendedProduct: Product) => void; // Zmieniamy sygnaturę
  onReject: () => void;
}

export const RecommendationForm: React.FC<RecommendationFormProps> = ({
  needsAnalysisData,
  availableProducts, // Odbieramy dostępne produkty
  onAccept,
  onReject
}) => {
  // Prosta logika rekomendacji - wybierzmy pierwszy produkt jako rekomendowany
  // W przyszłości można tu dodać bardziej złożoną logikę
  const recommendedProduct = availableProducts.find(p => p.productCode === "5_DCGAP_M25_GEN") || availableProducts[0];

  const isRecommended = needsAnalysisData.isInterestedInGapInsurance && 
    (needsAnalysisData.hasValidAcPolicy || needsAnalysisData.isVehicleLeased);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Rekomendacja ubezpieczenia</h2>

      {isRecommended ? (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Ubezpieczenie GAP jest rekomendowane
              </h3>
              <p className="text-green-700 mb-4">
                Na podstawie analizy Twoich potrzeb, rekomendujemy zakup ubezpieczenia GAP, które:
              </p>
              <ul className="list-disc list-inside space-y-2 text-green-700 mb-6">
                <li>Chroni przed utratą wartości pojazdu</li>
                <li>Zapewnia dodatkowe odszkodowanie w przypadku szkody całkowitej</li>
                <li>Gwarantuje spokój w przypadku kradzieży pojazdu</li>
                {needsAnalysisData.isVehicleLeased && (
                  <li>Jest szczególnie zalecane dla pojazdów w leasingu</li>
                )}
              </ul>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={onReject}>
              Odrzuć rekomendację
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => recommendedProduct && onAccept(recommendedProduct)} // Wywołujemy onAccept z produktem
            >
              Akceptuję rekomendację
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Ubezpieczenie GAP może nie być odpowiednie
              </h3>
              <p className="text-yellow-700 mb-4">
                Na podstawie analizy Twoich potrzeb, ubezpieczenie GAP może nie być najlepszym wyborem, ponieważ:
              </p>
              <ul className="list-disc list-inside space-y-2 text-yellow-700 mb-6">
                {!needsAnalysisData.hasValidAcPolicy && (
                  <li>Nie posiadasz aktualnego ubezpieczenia AC, które jest wymagane</li>
                )}
                {!needsAnalysisData.isInterestedInGapInsurance && (
                  <li>Nie wyraziłeś/aś zainteresowania dodatkową ochroną wartości pojazdu</li>
                )}
              </ul>
              <p className="text-yellow-700">
                Jeśli chcesz kontynuować mimo to, możesz przejść dalej, ale zalecamy konsultację z doradcą.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={onReject}>
              Zrezygnuj
            </Button>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => recommendedProduct && onAccept(recommendedProduct)} // Wywołujemy onAccept z produktem
            >
              Kontynuuj mimo to
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}; 