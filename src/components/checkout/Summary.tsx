"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface InsuranceVariant {
  productCode: "5_DCGAP_M25_GEN" | "5_DCGAP_MG25_GEN" | "5_DCGAP_F25_GEN" | "5_DCGAP_FG25_GEN";
  sellerNodeCode: string;
  signatureTypeCode: "AUTHORIZED_BY_SMS" | "SIGNED_BY_PAYMENT";
}

interface VehicleData {
  vin: string;
  vrm: string;
  make?: string;
  model?: string;
  mileage: number;
  purchasePrice: number;
  purchasePriceNet: number;
  purchasePriceType: string;
  purchasePriceVatReclaimable: string;
  firstRegisteredOn: string;
  purchasedOn: string;
  vehicleCategory: string;
  usageType: string;
}

interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pesel: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postalCode: string;
  city: string;
}

interface SummaryProps {
  variant: InsuranceVariant;
  vehicleData: VehicleData;
  personalData: PersonalData;
  onSubmit: () => void;
}

const PRODUCT_NAMES: Record<InsuranceVariant['productCode'], string> = {
  "5_DCGAP_M25_GEN": "GAP MAX",
  "5_DCGAP_MG25_GEN": "GAP MAX AC",
  "5_DCGAP_F25_GEN": "GAP FLEX",
  "5_DCGAP_FG25_GEN": "GAP FLEX GO"
};

const SIGNATURE_TYPES: Record<InsuranceVariant['signatureTypeCode'], string> = {
  "AUTHORIZED_BY_SMS": "Autoryzacja SMS",
  "SIGNED_BY_PAYMENT": "Podpis przez płatność"
};

export const Summary = ({ variant, vehicleData, personalData, onSubmit }: SummaryProps) => {
  const [isSending, setIsSending] = useState(false);

  const handleSubmitWithEmail = async () => {
    try {
      setIsSending(true);
      // Przygotuj dane do wysłania maila
      const emailData = {
        to: personalData.email,
        subject: "Podsumowanie polisy GAP",
        policyDetails: {
          variant: {
            name: PRODUCT_NAMES[variant.productCode],
            signatureType: SIGNATURE_TYPES[variant.signatureTypeCode]
          },
          vehicle: {
            make: vehicleData.make,
            model: vehicleData.model,
            vin: vehicleData.vin,
            registrationNumber: vehicleData.vrm,
            mileage: vehicleData.mileage,
            firstRegistrationDate: new Date(vehicleData.firstRegisteredOn).toLocaleDateString('pl-PL'),
            purchaseDate: new Date(vehicleData.purchasedOn).toLocaleDateString('pl-PL')
          },
          personal: {
            fullName: `${personalData.firstName} ${personalData.lastName}`,
            email: personalData.email,
            phone: personalData.phone,
            pesel: personalData.pesel,
            address: `${personalData.street} ${personalData.houseNumber}${personalData.apartmentNumber ? `/${personalData.apartmentNumber}` : ''}, ${personalData.postalCode} ${personalData.city}`
          }
        }
      };

      // Wyślij dane do API
      const response = await fetch('/api/send-policy-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas wysyłania maila');
      }

      // Jeśli mail został wysłany pomyślnie, kontynuuj standardową procedurę
      onSubmit();
    } catch (error) {
      console.error('Błąd podczas wysyłania maila:', error);
      alert('Wystąpił błąd podczas wysyłania podsumowania na email. Spróbuj ponownie.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Podsumowanie</h2>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Wariant ubezpieczenia</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Produkt</p>
              <p className="font-medium">{PRODUCT_NAMES[variant.productCode]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sposób podpisu</p>
              <p className="font-medium">{SIGNATURE_TYPES[variant.signatureTypeCode]}</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Dane pojazdu</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Marka i model</p>
              <p className="font-medium">{vehicleData.make} {vehicleData.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">VIN</p>
              <p className="font-medium">{vehicleData.vin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Numer rejestracyjny</p>
              <p className="font-medium">{vehicleData.vrm}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Przebieg</p>
              <p className="font-medium">{vehicleData.mileage} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data pierwszej rejestracji</p>
              <p className="font-medium">{new Date(vehicleData.firstRegisteredOn).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data zakupu</p>
              <p className="font-medium">{new Date(vehicleData.purchasedOn).toLocaleDateString()}</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Dane osobowe</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Imię i nazwisko</p>
              <p className="font-medium">{personalData.firstName} {personalData.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">PESEL</p>
              <p className="font-medium">{personalData.pesel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{personalData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefon</p>
              <p className="font-medium">{personalData.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Adres</p>
              <p className="font-medium">
                {personalData.street} {personalData.houseNumber}
                {personalData.apartmentNumber ? `/${personalData.apartmentNumber}` : ''}, 
                {personalData.postalCode} {personalData.city}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSending}
        >
          Wróć
        </Button>
        <Button
          type="button"
          onClick={handleSubmitWithEmail}
          className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
          disabled={isSending}
        >
          {isSending ? 'Wysyłanie...' : 'Kup ubezpieczenie'}
        </Button>
      </div>
    </div>
  );
};