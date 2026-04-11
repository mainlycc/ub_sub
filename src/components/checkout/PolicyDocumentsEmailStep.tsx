"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import DocumentUpload, { DocumentUploadValue } from "@/components/checkout/DocumentUpload";

interface PolicyDocumentsEmailStepProps {
  policyId: string;
  onComplete: () => void;
  onBackToSummary?: () => void;
}

const emptyValue: DocumentUploadValue = {
  acPolicyFiles: [],
  registrationCertificateFiles: [],
  invoiceFiles: [],
};

export const PolicyDocumentsEmailStep: React.FC<PolicyDocumentsEmailStepProps> = ({
  policyId,
  onComplete,
  onBackToSummary,
}) => {
  const [value, setValue] = useState<DocumentUploadValue>(emptyValue);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const hasAny = useMemo(() => {
    return (
      value.acPolicyFiles.length > 0 ||
      value.registrationCertificateFiles.length > 0 ||
      value.invoiceFiles.length > 0
    );
  }, [value]);

  const sendEmail = async () => {
    setError(null);
    if (!hasAny) {
      setError("Dodaj przynajmniej jeden dokument.");
      return;
    }

    setIsSending(true);
    try {
      const fd = new FormData();
      fd.append("policyId", policyId);

      value.acPolicyFiles.forEach((f, i) => fd.append(`ac[${i}]`, f));
      value.registrationCertificateFiles.forEach((f, i) => fd.append(`rc[${i}]`, f));
      value.invoiceFiles.forEach((f, i) => fd.append(`invoice[${i}]`, f));

      const res = await fetch("/api/documents/email", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.error || `Błąd wysyłki (${res.status})`);
        return;
      }

      setSent(true);
      setValue(emptyValue);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nie udało się wysłać dokumentów");
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 sm:py-14">
        <div
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-green-100 ring-8 ring-emerald-50/80 shadow-sm"
          aria-hidden
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-600" strokeWidth={2} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Dokumenty wysłane
        </h2>
        <p className="mt-3 max-w-md text-base sm:text-lg leading-relaxed text-gray-600">
          Dziękujemy. Twoje dokumenty zostały przesłane.
        </p>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Możesz przejść dalej, aby zakończyć proces zakupu.
        </p>
        <Button
          className="mt-10 min-w-[200px] bg-[#300FE6] hover:bg-[#2208B0] text-white shadow-md shadow-[#300FE6]/25"
          onClick={onComplete}
        >
          Dalej
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
        <span className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3 text-[#FF8E3D] font-bold">6</span>
        Dokumenty
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <DocumentUpload value={value} onChange={setValue} />

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
          disabled={isSending}
          onClick={() => void sendEmail()}
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Wysyłanie…
            </>
          ) : (
            "Wyślij dokumenty"
          )}
        </Button>
        {onBackToSummary && (
          <Button type="button" variant="ghost" onClick={onBackToSummary}>
            Wróć do podsumowania
          </Button>
        )}
      </div>
    </div>
  );
};

export default PolicyDocumentsEmailStep;

