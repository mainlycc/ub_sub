"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SmsSignature } from "@/components/new-policy/sms-signature";
import { NeedsAnalysis } from "@/components/new-policy/needs-analysis";
import { VehicleData } from "@/components/new-policy/vehicle-data";
import { ClientData } from "@/components/new-policy/client-data";
import { PolicyOptions } from "@/components/new-policy/policy-options";
import { idefendApi } from "@/lib/idefend-api";
import type { PolicyFormData } from "@/lib/idefend-api";

export default function NewPolicyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PolicyFormData>({
    productCode: "",
    vehicleData: {
      makeId: "",
      modelId: "",
      year: new Date().getFullYear(),
      registrationNumber: "",
    },
    clientData: {
      firstName: "",
      lastName: "",
      pesel: "",
      email: "",
      phoneNumber: "",
      address: {
        street: "",
        houseNumber: "",
        postalCode: "",
        city: "",
      },
    },
    startDate: "",
    duration: 12,
    paymentType: "BANK_TRANSFER",
    installments: 1
  });
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [showSmsSignature, setShowSmsSignature] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitPolicy = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await idefendApi.submitPolicy(formData);
      setPolicyId(response.policyId);
      setShowSmsSignature(true);
    } catch (error) {
      setError("Błąd podczas składania polisy");
      console.error("Błąd podczas składania polisy:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSmsVerify = async (code: string) => {
    if (!policyId) return;

    try {
      setLoading(true);
      setError(null);
      await idefendApi.verifySmsCode(policyId, code);
      window.location.href = `/policy-confirmation/${policyId}`;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (showSmsSignature && policyId) {
    return (
      <SmsSignature
        phoneNumber={formData.clientData.phoneNumber}
        policyId={policyId}
        onVerify={handleSmsVerify}
        onCancel={() => setShowSmsSignature(false)}
      />
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-8">
          {currentStep === 1 && (
            <NeedsAnalysis
              onNext={(productCode) => {
                setFormData((prev) => ({ ...prev, productCode }));
                setCurrentStep(2);
              }}
            />
          )}

          {currentStep === 2 && (
            <VehicleData
              data={formData.vehicleData}
              onBack={() => setCurrentStep(1)}
              onNext={(vehicleData) => {
                setFormData((prev) => ({ ...prev, vehicleData }));
                setCurrentStep(3);
              }}
            />
          )}

          {currentStep === 3 && (
            <ClientData
              data={formData.clientData}
              onBack={() => setCurrentStep(2)}
              onNext={(clientData) => {
                setFormData((prev) => ({ ...prev, clientData }));
                setCurrentStep(4);
              }}
            />
          )}

          {currentStep === 4 && (
            <PolicyOptions
              formData={formData}
              onBack={() => setCurrentStep(3)}
              onSubmit={handleSubmitPolicy}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
} 