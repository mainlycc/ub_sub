"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { idefendApi } from "@/lib/idefend-api";
import { Loader2 } from "lucide-react";

interface Portfolio {
  productCode: string;
  name: string;
  description: string;
}

interface NeedsAnalysisProps {
  onNext: (productCode: string) => void;
}

export function NeedsAnalysis({ onNext }: NeedsAnalysisProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await idefendApi.getPortfolios();
        if (!response.portfolios || response.portfolios.length === 0) {
          throw new Error("Brak dostępnych produktów");
        }
        setPortfolios(response.portfolios);
      } catch (err) {
        console.error("Błąd podczas ładowania produktów:", err);
        setError(
          err instanceof Error 
            ? err.message 
            : "Nie udało się załadować produktów. Spróbuj odświeżyć stronę."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPortfolios();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      setError("Wybierz produkt");
      return;
    }

    onNext(selectedProduct);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">Ładowanie produktów...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Analiza Potrzeb Klienta</h2>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <div className="flex flex-col space-y-2">
                <div className="font-medium">Wystąpił błąd</div>
                <div className="text-sm">{error}</div>
                {error.includes("załadować") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="mt-2 w-fit"
                  >
                    Odśwież stronę
                  </Button>
                )}
              </div>
            </Alert>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Wybierz odpowiedni produkt ubezpieczeniowy na podstawie potrzeb klienta:
          </p>

          {portfolios.length > 0 ? (
            <RadioGroup
              value={selectedProduct}
              onValueChange={setSelectedProduct}
              className="space-y-4"
            >
              {portfolios.map((portfolio) => (
                <div key={portfolio.productCode} className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors">
                  <RadioGroupItem
                    value={portfolio.productCode}
                    id={portfolio.productCode}
                  />
                  <Label htmlFor={portfolio.productCode} className="space-y-1 cursor-pointer flex-1">
                    <div className="font-medium">{portfolio.name}</div>
                    <div className="text-sm text-gray-500">
                      {portfolio.description}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : !error && !loading ? (
            <div className="text-center text-gray-500 py-4">
              Brak dostępnych produktów
            </div>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!selectedProduct || loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ładowanie...
              </>
            ) : (
              "Dalej"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
} 