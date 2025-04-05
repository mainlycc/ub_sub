"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

type ClientFormProps = {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    pesel: string;
    postalCode: string;
    city: string;
    street: string;
    houseNumber: string;
    apartmentNumber?: string;
  };
  onChange: (data: any) => void;
};

export function ClientForm({ data, onChange }: ClientFormProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Imię</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="Wprowadź imię"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nazwisko</Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Wprowadź nazwisko"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Wprowadź adres email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Numer telefonu</Label>
            <Input
              id="phoneNumber"
              value={data.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="Wprowadź numer telefonu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pesel">PESEL</Label>
            <Input
              id="pesel"
              value={data.pesel}
              onChange={(e) => handleChange("pesel", e.target.value)}
              placeholder="Wprowadź numer PESEL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Kod pocztowy</Label>
            <Input
              id="postalCode"
              value={data.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              placeholder="Wprowadź kod pocztowy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Miejscowość</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Wprowadź miejscowość"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Ulica</Label>
            <Input
              id="street"
              value={data.street}
              onChange={(e) => handleChange("street", e.target.value)}
              placeholder="Wprowadź ulicę"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="houseNumber">Numer domu</Label>
            <Input
              id="houseNumber"
              value={data.houseNumber}
              onChange={(e) => handleChange("houseNumber", e.target.value)}
              placeholder="Wprowadź numer domu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apartmentNumber">Numer mieszkania</Label>
            <Input
              id="apartmentNumber"
              value={data.apartmentNumber}
              onChange={(e) => handleChange("apartmentNumber", e.target.value)}
              placeholder="Wprowadź numer mieszkania"
            />
          </div>
        </div>
      </Card>
    </div>
  );
} 