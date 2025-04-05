"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPolicy, authorizePolicy, getPolicyDocuments } from '@/lib/api';
import { VehicleData, PersonalData, PaymentData, CalculationResult, InsuranceVariant, PolicyResponse } from '@/types/insurance';

interface SummaryProps {
  vehicleData: VehicleData;
  personalData: PersonalData;
  paymentData: PaymentData;
  variant: InsuranceVariant;
  calculationResult: CalculationResult;
  onSubmit: (policyId: string) => void;
  termsAgreed: boolean;
  onTermsChange: (value: boolean) => void;
}

export const Summary = ({
  vehicleData,
  personalData,
  paymentData,
  variant,
  calculationResult,
  onSubmit,
  termsAgreed,
  onTermsChange
}: SummaryProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!termsAgreed) {
      setError('Musisz zaakceptować zgody i oświadczenia.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Sprawdzanie danych przed wysłaniem:');
      console.log('- Dane pojazdu:', vehicleData);
      console.log('- Dane osobowe:', personalData);
      console.log('- Wariant:', variant);
      console.log('- Dane płatności:', paymentData);
      console.log('- Wynik kalkulacji:', calculationResult);

      if (!vehicleData || !personalData || !variant || !paymentData || !calculationResult) {
        throw new Error('Brak wymaganych danych do utworzenia polisy');
      }

      const payload = {
        vehicleData,
        personalData,
        paymentData: paymentData,
        productCode: variant.productCode,
        signatureTypeCode: variant.signatureTypeCode,
        sellerNodeCode: variant.sellerNodeCode
      };

      const response = await fetch('/api/register-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Odpowiedź z API /register-policy:', result);

      if (!response.ok || !result.success || !result.policyData?.id || !result.policyData?.confirmationCode) {
        console.error('Błąd API rejestracji lub niekompletna odpowiedź:', result);
        const errorDetail = result.details || result.error || 'Nie udało się zarejestrować polisy lub brak kodu potwierdzającego';
        throw new Error(`Błąd API (${response.status}): ${JSON.stringify(errorDetail)}`);
      }

      const registeredPolicyId = result.policyData.id;
      const receivedConfirmationCode = result.policyData.confirmationCode;

      setPolicyId(registeredPolicyId);
      setConfirmationCode(receivedConfirmationCode);
      console.log('Pomyślnie utworzono polisę z ID:', registeredPolicyId);
      console.log('Otrzymano kod potwierdzający (confirmationCode).');

      if (variant.signatureTypeCode !== 'AUTHORIZED_BY_SMS') {
        console.log('Wybrano inną metodę podpisu niż SMS. Wywołuję onSubmit.');
        onSubmit(registeredPolicyId);
      }

    } catch (error: any) {
      console.error(`Błąd podczas tworzenia polisy: ${error.message}`);
      setError(error.message || 'Wystąpił błąd podczas tworzenia polisy');

      if (error.response) {
        console.error('Szczegóły błędu:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignatureConfirmation = async () => {
    if (!policyId || !confirmationCode) {
      setError('Brak ID polisy lub kodu potwierdzającego.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log(`Wysyłanie żądania potwierdzenia dla polisy ${policyId} z kodem...`);

      // Wywołujemy nowy endpoint API /api/confirm-signature
      const confirmResponse = await fetch('/api/confirm-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policyId, confirmationCode })
      });

      const confirmResult = await confirmResponse.json();

      if (!confirmResponse.ok || !confirmResult.success) {
        console.error('Błąd API /confirm-signature:', confirmResult);
        throw new Error(confirmResult.error || 'Nie udało się potwierdzić podpisu');
      }

      console.log('Polisa potwierdzona pomyślnie. Wywołuję onSubmit.');
      onSubmit(policyId); // Wywołujemy onSubmit z zapisanym policyId

    } catch (error: any) {
      console.error(`Błąd podczas potwierdzania podpisu: ${error.message}`);
      setError('Nie udało się potwierdzić podpisu. Spróbuj ponownie lub skontaktuj się z administratorem.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Podsumowanie zamówienia</h2>

      {/* Dane pojazdu */}
      <section className="bg-white p-6 rounded-lg shadow">
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
            <p className="text-sm text-gray-500">Nr rejestracyjny</p>
            <p className="font-medium">{vehicleData.vrm}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Wartość pojazdu</p>
            <p className="font-medium">{vehicleData.purchasePrice.toLocaleString()} PLN</p>
          </div>
        </div>
      </section>

      {/* Dane osobowe */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Dane osobowe</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Imię i nazwisko</p>
            <p className="font-medium">{personalData.firstName} {personalData.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{personalData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefon</p>
            <p className="font-medium">{personalData.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">PESEL</p>
            <p className="font-medium">{personalData.identificationNumber}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Adres</p>
            <p className="font-medium">
              {personalData.address.street}, {personalData.address.postCode} {personalData.address.city}
            </p>
          </div>
        </div>
      </section>

      {/* Szczegóły ubezpieczenia */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Szczegóły ubezpieczenia</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Wariant</p>
            <p className="font-medium">{variant.productCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Okres ochrony</p>
            <p className="font-medium">{paymentData.term?.replace('T_', '') || '-'} miesięcy</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Limit odszkodowania</p>
            <p className="font-medium">{paymentData.claimLimit?.replace('CL_', '') || '-'} PLN</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Składka</p>
            <p className="font-bold text-xl text-[#300FE6]">
              {calculationResult?.premium ? `${calculationResult.premium.toLocaleString()} PLN` : '-'}
            </p>
          </div>
        </div>
      </section>

      {/* Akceptacja regulaminu */}
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          checked={termsAgreed}
          onChange={(e) => onTermsChange(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          Oświadczam, że zapoznałem się z Ogólnymi Warunkami Ubezpieczenia GAP oraz Dokumentem zawierającym informacje o produkcie ubezpieczeniowym i akceptuję ich treść.
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
          {error}
        </div>
      )}

      {/* Przycisk akcji - Zamawiam lub Potwierdzam */}
      <div className="mt-6">
        {policyId && confirmationCode && variant.signatureTypeCode === 'AUTHORIZED_BY_SMS' ? (
          // Stan po utworzeniu polisy SMS: Pokaż przycisk Potwierdź
          <Button
            onClick={handleSignatureConfirmation}
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isProcessing ? 'Potwierdzanie...' : 'Potwierdź podpis'}
          </Button>
        ) : (
          // Stan początkowy lub inna metoda podpisu: Pokaż przycisk Zamawiam
          <Button
            onClick={handleSubmit}
            disabled={!termsAgreed || isProcessing || (!!policyId && variant.signatureTypeCode === 'AUTHORIZED_BY_SMS')} // Wyłączony, jeśli czekamy na potwierdzenie SMS
            className="w-full bg-[#300FE6] hover:bg-[#2208B0] text-white"
          >
            {isProcessing ? 'Przetwarzanie...' : (policyId ? 'Polisa utworzona' : 'Zamawiam i płacę')} // Zmień tekst jeśli polisa już utworzona (inna niż SMS)
          </Button>
        )}
      </div>
    </div>
  );
};