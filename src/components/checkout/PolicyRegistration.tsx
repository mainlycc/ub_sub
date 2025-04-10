"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { VehicleData } from '@/types/vehicle';

// Definicja typu dla danych polisy zwracanych przez API
interface PolicyResponse {
  id: string;
  status: string;
  productCode: string;
  premium: number;
  sellerNodeCode?: string;
  saleInitiatedOn?: string;
  client?: Record<string, unknown>;
  vehicleSnapshot?: Record<string, unknown>;
  options?: Record<string, string>;
  [key: string]: unknown;
}

interface PolicyRegistrationProps {
  vehicleData: VehicleData;
  insuranceVariant: {
    productCode: string;
    sellerNodeCode: string;
    signatureTypeCode: string;
  };
  paymentData: {
    term: string;
    claimLimit: string;
    paymentTerm: string;
    paymentMethod: string;
  };
  personalData: {
    type: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    identificationNumber: string;
    address: {
      addressLine1: string;
      street: string;
      city: string;
      postCode: string;
      countryCode: string;
    };
  };
  calculationResult: {
    premium: number;
    details: {
      productName: string;
      coveragePeriod: string;
      vehicleValue: number;
      maxCoverage: string;
    };
  };
  onPolicyRegistered: (policyData: PolicyResponse) => void;
}

export const PolicyRegistration = ({
  vehicleData,
  insuranceVariant,
  paymentData,
  personalData,
  calculationResult,
  onPolicyRegistered
}: PolicyRegistrationProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const getValidSaleInitiatedDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Formatowanie daty do formatu YYYY-MM-DD
    return tomorrow.toISOString().split('T')[0];
  };

  const registerPolicy = async () => {
    setIsRegistering(true);
    setRegistrationError(null);

    try {
      const policyData = {
        extApiNo: null,
        extReferenceNo: null,
        extTenderNo: null,
        sellerNodeCode: insuranceVariant.sellerNodeCode,
        productCode: insuranceVariant.productCode,
        saleInitiatedOn: getValidSaleInitiatedDate(),
        signatureTypeCode: insuranceVariant.signatureTypeCode,
        confirmedByDefault: null,
        vehicleSnapshot: {
          ...vehicleData,
          purchasePrice: Math.round(vehicleData.purchasePrice * 100),
          purchasePriceNet: Math.round(vehicleData.purchasePriceNet * 100),
          owners: [{ contact: { inheritFrom: "policyHolder" } }]
        },
        client: {
          policyHolder: {
            ...personalData,
            address: {
              ...personalData.address,
              addressLine1: `${personalData.firstName} ${personalData.lastName}`
            }
          },
          insured: {
            inheritFrom: "policyHolder"
          },
          beneficiary: {
            inheritFrom: "policyHolder"
          }
        },
        options: paymentData,
        premium: Math.round(calculationResult.premium * 100)
      };

      console.log('Wysyłane dane rejestracji polisy:', JSON.stringify(policyData, null, 2));

      const response = await fetch('/api/policies/creation/lock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policyData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Błąd podczas rejestracji polisy');
      }

      console.log('Odpowiedź z rejestracji polisy:', JSON.stringify(responseData, null, 2));
      onPolicyRegistered(responseData);
    } catch (error) {
      console.error('Błąd podczas rejestracji polisy:', error);
      setRegistrationError(
        error instanceof Error 
          ? error.message 
          : 'Wystąpił nieoczekiwany błąd podczas rejestracji polisy'
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">5</span>
        </div>
        Podsumowanie i rejestracja polisy
      </h2>

      {/* Podsumowanie danych */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Dane pojazdu</h3>
          <div className="space-y-2">
            <p><span className="font-medium">VIN:</span> {vehicleData.vin}</p>
            <p><span className="font-medium">Nr rejestracyjny:</span> {vehicleData.vrm}</p>
            <p><span className="font-medium">Data zakupu:</span> {vehicleData.purchasedOn}</p>
            <p><span className="font-medium">Wartość:</span> {vehicleData.purchasePrice.toLocaleString()} PLN</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Dane osobowe</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Imię i nazwisko:</span> {personalData.firstName} {personalData.lastName}</p>
            <p><span className="font-medium">Email:</span> {personalData.email}</p>
            <p><span className="font-medium">Telefon:</span> {personalData.phoneNumber}</p>
            <p><span className="font-medium">Adres:</span> {personalData.address.street}, {personalData.address.postCode} {personalData.address.city}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Szczegóły ubezpieczenia</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Produkt:</span> {calculationResult.details.productName}</p>
            <p><span className="font-medium">Okres ochrony:</span> {calculationResult.details.coveragePeriod}</p>
            <p><span className="font-medium">Maksymalna ochrona:</span> {calculationResult.details.maxCoverage}</p>
            <p><span className="font-medium">Rodzaj płatności:</span> {
              paymentData.paymentTerm === 'PT_LS' ? 'Płatność jednorazowa' : 
              paymentData.paymentTerm === 'PT_A' ? 'Płatność roczna' : 
              'Nieznany'
            }</p>
            <p><span className="font-medium">Forma płatności:</span> {
              paymentData.paymentMethod === 'PM_PBC' ? 'BLIK, karta, szybki przelew' :
              paymentData.paymentMethod === 'PM_BT' ? 'Przelew tradycyjny' :
              paymentData.paymentMethod === 'PM_PAYU_M' ? 'Raty miesięczne PayU' :
              paymentData.paymentMethod === 'PM_BY_DLR' ? 'Płatne przez dealera' :
              'Nieznany'
            }</p>
            <p className="text-lg mt-4">
              <span className="font-medium">Składka:</span>{' '}
              <span className="text-[#300FE6] font-bold">
                {calculationResult.premium.toLocaleString()} PLN
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Wyświetlanie błędu rejestracji */}
      {registrationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <strong className="font-bold">Błąd rejestracji! </strong>
          <span className="block sm:inline">{registrationError}</span>
        </div>
      )}

      {/* Przycisk rejestracji */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={registerPolicy}
          disabled={isRegistering}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md transition-all"
        >
          {isRegistering ? (
            <>
              <span className="animate-spin mr-2">⌛</span>
              Rejestrowanie polisy...
            </>
          ) : (
            'Zarejestruj polisę'
          )}
        </Button>
      </div>
    </div>
  );
}; 