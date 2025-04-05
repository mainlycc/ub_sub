"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

type VehicleFormProps = {
  data: {
    category: string;
    vin: string;
    vrm?: string;
    model: string;
    firstRegisteredOn: string;
    purchasedOn: string;
    mileage: number;
    usage: string;
  };
  onChange: (data: any) => void;
  vehicleCategories: Array<{ code: string; name: string }>;
};

export function VehicleForm({ data, onChange, vehicleCategories }: VehicleFormProps) {
  const handleChange = (field: string, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategoria pojazdu</Label>
            <RadioGroup
              value={data.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <div className="space-y-2">
                {vehicleCategories.map((category) => (
                  <div key={category.code} className="flex items-center space-x-2">
                    <RadioGroupItem value={category.code} id={`category-${category.code}`} />
                    <Label htmlFor={`category-${category.code}`}>{category.name}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">Numer VIN</Label>
            <Input
              id="vin"
              value={data.vin}
              onChange={(e) => handleChange("vin", e.target.value)}
              placeholder="Wprowadź numer VIN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vrm">Numer rejestracyjny</Label>
            <Input
              id="vrm"
              value={data.vrm}
              onChange={(e) => handleChange("vrm", e.target.value)}
              placeholder="Wprowadź numer rejestracyjny"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model pojazdu</Label>
            <Input
              id="model"
              value={data.model}
              onChange={(e) => handleChange("model", e.target.value)}
              placeholder="Wybierz model pojazdu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstRegisteredOn">Data pierwszej rejestracji</Label>
            <Input
              id="firstRegisteredOn"
              type="date"
              value={data.firstRegisteredOn}
              onChange={(e) => handleChange("firstRegisteredOn", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasedOn">Data zakupu</Label>
            <Input
              id="purchasedOn"
              type="date"
              value={data.purchasedOn}
              onChange={(e) => handleChange("purchasedOn", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">Przebieg</Label>
            <Input
              id="mileage"
              type="number"
              value={data.mileage}
              onChange={(e) => handleChange("mileage", parseInt(e.target.value, 10))}
              placeholder="Wprowadź przebieg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage">Sposób użytkowania</Label>
            <RadioGroup
              value={data.usage}
              onValueChange={(value) => handleChange("usage", value)}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="STANDARD" id="usage-standard" />
                  <Label htmlFor="usage-standard">Standardowy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TAXI" id="usage-taxi" />
                  <Label htmlFor="usage-taxi">Taxi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TOWING" id="usage-towing" />
                  <Label htmlFor="usage-towing">Holowniczy</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>
    </div>
  );
} 