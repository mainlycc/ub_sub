"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { idefendApi } from "@/lib/idefend-api";
import type { PolicyFormData } from "@/lib/idefend-api";
import { Input } from "@/components/ui/input";

interface PolicyOptionsProps {
  formData: PolicyFormData;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

interface CalculationResult {
  premium: number;
  sumInsured: number;
  options: {
    code: string;
    name: string;
    value: string;
  }[];
}

export function PolicyOptions({
  formData,
  onBack,
  onSubmit,
  loading,
  error: submitError,
}: PolicyOptionsProps) {
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const calculateOffer = async () => {
      try {
        setCalculating(true);
        setError(null);
        const response = await idefendApi.calculateOffer(formData);
        setCalculation(response);
      } catch (err) {
        setError("Nie udało się obliczyć składki");
      } finally {
        setCalculating(false);
      }
    };

    calculateOffer();
  }, [formData]);

  const handleChange = (field: string, value: string | number) => {
    // Implementation of handleChange function
  };

  if (calculating) {
    return (
      <Card className="p-6">
        <div className="text-center">Obliczanie składki...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Podsumowanie i Opcje</h2>
          {(error || submitError) && (
            <Alert variant="destructive" className="mb-4">
              {error || submitError}
            </Alert>
          )}
        </div>

        {calculation && (
          <>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Suma ubezpieczenia</h3>
                <p className="text-2xl font-bold">
                  {calculation.sumInsured.toLocaleString("pl-PL")} PLN
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Składka</h3>
                <p className="text-2xl font-bold">
                  {calculation.premium.toLocaleString("pl-PL")} PLN
                </p>
              </div>

              {calculation.options.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Wybrane opcje</h3>
                  <div className="space-y-2">
                    {calculation.options.map((option) => (
                      <div
                        key={option.code}
                        className="flex justify-between items-center"
                      >
                        <span>{option.name}</span>
                        <span className="font-medium">{option.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
                Wstecz
              </Button>
              <Button onClick={onSubmit} disabled={loading}>
                Wystaw polisę
              </Button>
            </div>
          </>
        )}

        <div className="space-y-6">
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data rozpoczęcia</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Okres ubezpieczenia (miesiące)</Label>
                <RadioGroup
                  value={formData.duration.toString()}
                  onValueChange={(value) => handleChange("duration", parseInt(value, 10))}
                >
                  <div className="grid grid-cols-3 gap-4">
                    {[6, 12, 24].map((months) => (
                      <div key={months} className="flex items-center space-x-2">
                        <RadioGroupItem value={months.toString()} id={`duration-${months}`} />
                        <Label htmlFor={`duration-${months}`}>{months}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentType">Sposób płatności</Label>
                <RadioGroup
                  value={formData.paymentType}
                  onValueChange={(value) => handleChange("paymentType", value)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BANK_TRANSFER" id="payment-transfer" />
                      <Label htmlFor="payment-transfer">Przelew</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CARD" id="payment-card" />
                      <Label htmlFor="payment-card">Karta płatnicza</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BLIK" id="payment-blik" />
                      <Label htmlFor="payment-blik">BLIK</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="installments">Liczba rat</Label>
                <RadioGroup
                  value={formData.installments.toString()}
                  onValueChange={(value) => handleChange("installments", parseInt(value, 10))}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 4, 12].map((count) => (
                      <div key={count} className="flex items-center space-x-2">
                        <RadioGroupItem value={count.toString()} id={`installments-${count}`} />
                        <Label htmlFor={`installments-${count}`}>{count}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
} 