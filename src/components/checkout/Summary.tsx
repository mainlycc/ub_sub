"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { ShieldCheck, Car, User, CreditCard, FileText, Lock, Send } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SummaryProps {
  data: {
    variant?: {
      productCode: string;
      name: string;
    };
    vehicle?: {
      category: string;
      model: string;
  vin: string;
  vrm: string;
      purchasedOn: string;
      firstRegisteredOn: string;
      mileage: number;
      purchasePrice: number;
    };
    personal?: {
  type: string;
  firstName: string;
  lastName: string;
  email: string;
      phoneNumber: string;
  identificationNumber: string;
  address: {
    street: string;
    city: string;
    postCode: string;
      };
    };
    options?: {
      TERM: string;
      CLAIM_LIMIT: string;
      PAYMENT_TERM: string;
      PAYMENT_METHOD: string;
    };
    premium?: number;
    signatureTypeCode?: string;
    policyId?: string;
  };
  onSubmit: () => void;
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(amount / 100);
};

const getTermName = (code: string) => {
  const terms: { [key: string]: string } = {
    'T_12': '1 rok',
    'T_24': '2 lata',
    'T_36': '3 lata',
    'T_48': '4 lata',
    'T_60': '5 lat'
  };
  return terms[code] || code;
};

const getPaymentMethodName = (code: string) => {
  const methods: { [key: string]: string } = {
    'PM_PBC': 'Płatność online',
    'PM_BT': 'Przelew tradycyjny',
    'PM_PAYU_M': 'Raty PayU',
    'PM_BY_DLR': 'Płatność przez dealera'
  };
  return methods[code] || code;
};

const isDataComplete = (data: SummaryProps['data']) => {
  if (!data) return false;

  // Sprawdzanie wariantu
  if (!data.variant?.productCode || !data.variant?.name) return false;

  // Sprawdzanie danych pojazdu
  if (!data.vehicle?.category || !data.vehicle?.model || !data.vehicle?.vin || 
      !data.vehicle?.vrm || !data.vehicle?.purchasedOn || !data.vehicle?.firstRegisteredOn || 
      !data.vehicle?.mileage || !data.vehicle?.purchasePrice) return false;

  // Sprawdzanie danych osobowych
  if (!data.personal?.type || !data.personal?.firstName || !data.personal?.lastName || 
      !data.personal?.email || !data.personal?.phoneNumber || !data.personal?.identificationNumber || 
      !data.personal?.address?.street || !data.personal?.address?.city || 
      !data.personal?.address?.postCode) return false;

  // Sprawdzanie opcji
  if (!data.options?.TERM || !data.options?.CLAIM_LIMIT || 
      !data.options?.PAYMENT_TERM || !data.options?.PAYMENT_METHOD) return false;

  // Sprawdzanie składki
  if (!data.premium) return false;

  return true;
};

export const Summary = ({ data, onSubmit, isLoading }: SummaryProps) => {
  const [agreements, setAgreements] = useState({
    terms: false,
    processing: false,
    marketing: false,
    electronic: false
  });

  const [signatureCode, setSignatureCode] = useState('');
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);

  const isComplete = isDataComplete(data);
  const canSubmit = agreements.terms && agreements.processing && agreements.electronic;

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Błąd podczas wysyłania danych');
      }

      onSubmit();
    } catch (error) {
      console.error('Błąd:', error);
      // Tu możemy dodać obsługę błędów, np. wyświetlenie komunikatu
    }
  };

  // Funkcja do wysyłania SMS
  const handleSendSMS = async () => {
    setIsSendingSMS(true);
    setSmsError(null);
    try {
      const response = await fetch('/api/send-signature-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          policyId: data.policyId
        }),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas wysyłania SMS');
      }

      setSmsSent(true);
    } catch (error) {
      setSmsError('Nie udało się wysłać SMS. Spróbuj ponownie.');
      console.error('Błąd:', error);
    } finally {
      setIsSendingSMS(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3">
          <span className="text-[#FF8E3D] font-bold">5</span>
        </div>
        Podsumowanie
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-6 w-6 text-[#300FE6] mr-2" />
              <h3 className="text-lg font-semibold">Wybrany wariant</h3>
            </div>
            <p className="text-xl font-bold mb-2">{data.variant?.name}</p>
            <p className="text-gray-600">Kod produktu: {data.variant?.productCode}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Car className="h-6 w-6 text-[#300FE6] mr-2" />
              <h3 className="text-lg font-semibold">Dane pojazdu</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Model</p>
                <p className="font-medium">{data.vehicle?.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">VIN</p>
                <p className="font-medium">{data.vehicle?.vin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nr rejestracyjny</p>
                <p className="font-medium">{data.vehicle?.vrm}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Przebieg</p>
                <p className="font-medium">{data.vehicle?.mileage?.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data pierwszej rejestracji</p>
                <p className="font-medium">
                  {data.vehicle?.firstRegisteredOn && format(new Date(data.vehicle.firstRegisteredOn), 'dd.MM.yyyy', { locale: pl })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data zakupu</p>
                <p className="font-medium">
                  {data.vehicle?.purchasedOn && format(new Date(data.vehicle.purchasedOn), 'dd.MM.yyyy', { locale: pl })}
                </p>
          </div>
        </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-[#300FE6] mr-2" />
              <h3 className="text-lg font-semibold">Dane osobowe</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Ubezpieczający</p>
                <p className="font-medium">{data.personal?.firstName} {data.personal?.lastName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">PESEL</p>
                  <p className="font-medium">{data.personal?.identificationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <p className="font-medium">{data.personal?.phoneNumber}</p>
          </div>
        </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{data.personal?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Adres</p>
                <p className="font-medium">
                  {data.personal?.address?.street}<br />
                  {data.personal?.address?.postCode} {data.personal?.address?.city}
                </p>
              </div>
          </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-[#300FE6] mr-2" />
              <h3 className="text-lg font-semibold">Płatność</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Okres ubezpieczenia</p>
                <p className="font-medium">{data.options?.TERM && getTermName(data.options.TERM)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Limit odszkodowania</p>
                <p className="font-medium">{data.options?.CLAIM_LIMIT?.replace('CL_', '').replace('_', ' ')} zł</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Forma płatności</p>
                <p className="font-medium">{data.options?.PAYMENT_METHOD && getPaymentMethodName(data.options.PAYMENT_METHOD)}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">Wartość pojazdu</p>
                <p className="font-medium">{data.vehicle?.purchasePrice && formatCurrency(data.vehicle.purchasePrice)}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Składka do zapłaty</p>
                <p className="text-2xl font-bold text-[#300FE6]">{data.premium && formatCurrency(data.premium)}</p>
              </div>

              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-[#300FE6] mr-2" />
                  <h3 className="text-lg font-semibold">Zgody i oświadczenia</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="terms" 
                      checked={agreements.terms}
                      onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, terms: checked as boolean }))}
                    />
                    <Label htmlFor="terms" className="text-sm leading-tight">
                      Oświadczam, że zapoznałem się z treścią dokumentu zawierającego informacje o produkcie ubezpieczeniowym oraz z OWU GAP
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="processing" 
                      checked={agreements.processing}
                      onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, processing: checked as boolean }))}
                    />
                    <Label htmlFor="processing" className="text-sm leading-tight">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych w celu zawarcia i wykonania umowy ubezpieczenia
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="electronic" 
                      checked={agreements.electronic}
                      onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, electronic: checked as boolean }))}
                    />
                    <Label htmlFor="electronic" className="text-sm leading-tight">
                      Wyrażam zgodę na przesyłanie mi dokumentów drogą elektroniczną na podany adres e-mail
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="marketing" 
                      checked={agreements.marketing}
                      onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, marketing: checked as boolean }))}
                    />
                    <Label htmlFor="marketing" className="text-sm leading-tight">
                      Wyrażam zgodę na otrzymywanie informacji marketingowych (opcjonalne)
                    </Label>
                  </div>
                </div>
              </Card>

              {data.signatureTypeCode === "AUTHORIZED_BY_SMS" && (
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Lock className="h-6 w-6 text-[#300FE6] mr-2" />
                    <h3 className="text-lg font-semibold">Podpis SMS</h3>
                  </div>
                  
                  {!smsSent ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Aby podpisać umowę, kliknij przycisk poniżej. Na podany numer telefonu zostanie wysłany kod SMS.
                      </p>
                      {smsError && (
                        <p className="text-sm text-red-600">{smsError}</p>
                      )}
                      <Button
                        onClick={handleSendSMS}
                        disabled={isSendingSMS}
                        className="flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        {isSendingSMS ? 'Wysyłanie...' : 'Wyślij kod SMS'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 mb-4">
                        Kod SMS został wysłany na numer {data.personal?.phoneNumber}. 
                        Wprowadź otrzymany kod poniżej.
                      </p>
                      <div className="max-w-xs">
                        <input
                          type="text"
                          value={signatureCode}
                          onChange={(e) => setSignatureCode(e.target.value)}
                          placeholder="Wprowadź kod z SMS"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6]"
                        />
                      </div>
                      <Button
                        onClick={handleSendSMS}
                        variant="outline"
                        size="sm"
                        className="text-sm"
                      >
                        Wyślij kod ponownie
                      </Button>
                    </div>
                  )}
                </Card>
              )}

              <Separator />

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isLoading}
                  className="bg-[#300FE6] hover:bg-[#2208B0] text-white px-8"
                >
                  {isLoading ? 'Przetwarzanie...' : 'Zamawiam i płacę'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};