"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

interface ClientFormData {
  firstName: string;
  lastName: string;
  pesel: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    houseNumber: string;
    apartmentNumber?: string;
    postalCode: string;
    city: string;
  };
}

interface ClientDataProps {
  data: ClientFormData;
  onBack: () => void;
  onNext: (data: ClientFormData) => void;
}

export function ClientData({ data, onBack, onNext }: ClientDataProps) {
  const [formData, setFormData] = useState<ClientFormData>(data);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePesel = (pesel: string) => {
    return /^[0-9]{11}$/.test(pesel);
  };

  const validatePhoneNumber = (phone: string) => {
    return /^[0-9]{9}$/.test(phone);
  };

  const validatePostalCode = (code: string) => {
    return /^[0-9]{2}-[0-9]{3}$/.test(code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.pesel || 
        !formData.email || !formData.phoneNumber || !formData.address.street || 
        !formData.address.houseNumber || !formData.address.postalCode || 
        !formData.address.city) {
      setError("Wypełnij wszystkie wymagane pola");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Nieprawidłowy format adresu email");
      return;
    }

    if (!validatePesel(formData.pesel)) {
      setError("Nieprawidłowy format numeru PESEL");
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError("Nieprawidłowy format numeru telefonu");
      return;
    }

    if (!validatePostalCode(formData.address.postalCode)) {
      setError("Nieprawidłowy format kodu pocztowego");
      return;
    }

    onNext(formData);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Dane Klienta</h2>
          {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Imię</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => 
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="lastName">Nazwisko</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => 
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="pesel">PESEL</Label>
            <Input
              id="pesel"
              value={formData.pesel}
              onChange={(e) => 
                setFormData({ ...formData, pesel: e.target.value })
              }
              maxLength={11}
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Numer telefonu</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => 
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              maxLength={9}
              placeholder="123456789"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => 
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="street">Ulica</Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) => 
                setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="houseNumber">Numer domu</Label>
            <Input
              id="houseNumber"
              value={formData.address.houseNumber}
              onChange={(e) => 
                setFormData({
                  ...formData,
                  address: { ...formData.address, houseNumber: e.target.value }
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="apartmentNumber">Numer mieszkania</Label>
            <Input
              id="apartmentNumber"
              value={formData.address.apartmentNumber}
              onChange={(e) => 
                setFormData({
                  ...formData,
                  address: { ...formData.address, apartmentNumber: e.target.value }
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="postalCode">Kod pocztowy</Label>
            <Input
              id="postalCode"
              value={formData.address.postalCode}
              onChange={(e) => 
                setFormData({
                  ...formData,
                  address: { ...formData.address, postalCode: e.target.value }
                })
              }
              placeholder="00-000"
            />
          </div>

          <div>
            <Label htmlFor="city">Miejscowość</Label>
            <Input
              id="city"
              value={formData.address.city}
              onChange={(e) => 
                setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })
              }
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Wstecz
          </Button>
          <Button type="submit">
            Dalej
          </Button>
        </div>
      </form>
    </Card>
  );
} 