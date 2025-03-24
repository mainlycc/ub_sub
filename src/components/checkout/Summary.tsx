"use client"

import React from 'react';

interface VehicleData {
  purchasedOn: string;
  modelCode: string;
  categoryCode: string;
  usageCode: string;
  mileage: number;
  firstRegisteredOn: string;
  evaluationDate: string;
  purchasePrice: number;
  purchasePriceNet: number;
  purchasePriceVatReclaimableCode: string;
  usageTypeCode: string;
  purchasePriceInputType: string;
  vin: string;
  vrm: string;
  make?: string;
  model?: string;
}

interface PersonalData {
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
}

interface PaymentData {
  term: string;
  claimLimit: string;
  paymentTerm: string;
  paymentMethod: string;
}

interface CalculationResult {
  premium: number;
  details: {
    productName: string;
    coveragePeriod: string;
    vehicleValue: number;
    maxCoverage: string;
  };
}

interface SummaryProps {
  vehicleData: VehicleData;
  personalData: PersonalData;
  paymentData: PaymentData;
  calculationResult: CalculationResult | null;
  onSubmit: () => void;
  isSubmitting: boolean;
  termsAgreed: boolean;
  onTermsChange: (agreed: boolean) => void;
  onPaymentChange: (paymentData: PaymentData) => void;
}

export const Summary = (props: SummaryProps): React.ReactElement => {
  if (!props.calculationResult) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Brak wyników kalkulacji</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">5</span>
        </div>
        Podsumowanie
      </h2>

      {/* Wyświetlanie danych */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dane pojazdu */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Dane pojazdu</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Data zakupu:</span> {new Date(props.vehicleData.purchasedOn).toLocaleDateString()}</p>
            <p><span className="font-medium">VIN:</span> {props.vehicleData.vin}</p>
            <p><span className="font-medium">Nr rejestracyjny:</span> {props.vehicleData.vrm}</p>
          </div>
        </div>

        {/* Dane osobowe */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Dane osobowe</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Imię i nazwisko:</span> {props.personalData.firstName} {props.personalData.lastName}</p>
            <p><span className="font-medium">Email:</span> {props.personalData.email}</p>
            <p><span className="font-medium">Telefon:</span> {props.personalData.phoneNumber}</p>
            <p><span className="font-medium">Adres:</span> {props.personalData.address.street}, {props.personalData.address.postCode} {props.personalData.address.city}</p>
          </div>
        </div>

        {/* Szczegóły ubezpieczenia */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Szczegóły ubezpieczenia</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Produkt:</span> {props.calculationResult.details.productName}</p>
            <p><span className="font-medium">Okres ochrony:</span> {props.calculationResult.details.coveragePeriod}</p>
            <p><span className="font-medium">Maksymalna ochrona:</span> {props.calculationResult.details.maxCoverage}</p>
          </div>
        </div>

        {/* Płatność */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Płatność</h3>
          <div className="space-y-4">
            <p><span className="font-medium">Składka:</span> <span className="text-xl font-bold text-[#300FE6]">{props.calculationResult.premium.toLocaleString()} zł</span></p>
            <p><span className="font-medium">Sposób płatności:</span> {props.paymentData.paymentTerm === 'PT_LS' ? 'Jednorazowo' : 'Miesięcznie'}</p>
            
            <div className="mt-4">
              <p className="font-medium mb-2">Wybierz metodę płatności:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all
                    ${props.paymentData.paymentMethod === 'PM_BLIK' 
                      ? 'border-[#300FE6] bg-[#300FE6]/5' 
                      : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => props.onPaymentChange({ ...props.paymentData, paymentMethod: 'PM_BLIK' })}
                >
                  BLIK
                </div>
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all
                    ${props.paymentData.paymentMethod === 'PM_PBC' 
                      ? 'border-[#300FE6] bg-[#300FE6]/5' 
                      : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => props.onPaymentChange({ ...props.paymentData, paymentMethod: 'PM_PBC' })}
                >
                  Przelew bankowy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zgoda na warunki */}
      <div className="mt-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={props.termsAgreed}
            onChange={(e) => props.onTermsChange(e.target.checked)}
            className="rounded border-gray-300 text-[#300FE6] focus:ring-[#300FE6]"
          />
          <span className="text-sm text-gray-600">
            Akceptuję regulamin i politykę prywatności
          </span>
        </label>
      </div>
    </div>
  );
}