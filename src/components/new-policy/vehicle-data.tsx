"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { idefendApi } from "@/lib/idefend-api";

interface VehicleFormData {
  makeId: string;
  modelId: string;
  year: number;
  registrationNumber: string;
}

interface VehicleDataProps {
  data: VehicleFormData;
  onBack: () => void;
  onNext: (data: VehicleFormData) => void;
}

export function VehicleData({ data, onBack, onNext }: VehicleDataProps) {
  const [formData, setFormData] = useState<VehicleFormData>(data);
  const [makes, setMakes] = useState<Array<{ id: string; name: string }>>([]);
  const [models, setModels] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMakes = async () => {
      try {
        setLoading(true);
        const response = await idefendApi.getVehicleMakes();
        setMakes(response.makes);
      } catch (err) {
        setError("Nie udało się załadować marek pojazdów");
      } finally {
        setLoading(false);
      }
    };

    loadMakes();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (!formData.makeId) return;

      try {
        setLoading(true);
        const response = await idefendApi.getVehicleModels(formData.makeId);
        setModels(response.models);
      } catch (err) {
        setError("Nie udało się załadować modeli pojazdów");
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, [formData.makeId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.makeId || !formData.modelId || !formData.registrationNumber) {
      setError("Wypełnij wszystkie wymagane pola");
      return;
    }

    onNext(formData);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Dane Pojazdu</h2>
          {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="make">Marka</Label>
            <Select
              value={formData.makeId}
              onValueChange={(value: string) => 
                setFormData({ ...formData, makeId: value, modelId: "" })
              }
              disabled={loading}
            >
              <SelectTrigger id="make">
                <SelectValue placeholder="Wybierz markę" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make.id} value={make.id}>
                    {make.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={formData.modelId}
              onValueChange={(value: string) => 
                setFormData({ ...formData, modelId: value })
              }
              disabled={loading || !formData.makeId}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Wybierz model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Rok produkcji</Label>
            <Input
              id="year"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={(e) => 
                setFormData({ ...formData, year: parseInt(e.target.value) })
              }
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registration">Numer rejestracyjny</Label>
            <Input
              id="registration"
              value={formData.registrationNumber}
              onChange={(e) => 
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
            Wstecz
          </Button>
          <Button type="submit" disabled={loading}>
            Dalej
          </Button>
        </div>
      </form>
    </Card>
  );
} 