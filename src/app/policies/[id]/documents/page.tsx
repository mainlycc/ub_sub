"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  FileText,
  Clock,
  CreditCard,
  AlertCircle,
  Download,
} from "lucide-react";
import { extractErrorFromResponseBody } from "@/lib/api-error-message";

interface MissingUploadTypeItem {
  code: string;
  name?: string;
  description?: string;
}

interface PolicyStatus {
  id: number;
  number: string;
  state: string;
  signatureState: string;
  productName: string;
  premium: number;
  paidOn: string | null;
  approvedOn: string | null;
  requiredUploadsReceivedOn: string | null;
  confirmedOn: string | null;
  paymentInitiationUrl: string | null;
  premiumBankAccount: {
    accountNumber: string;
    name: string;
  } | null;
  paymentReferenceNumber: string | null;
}

interface DocumentAvailability {
  precontract: boolean;
  contract: boolean;
}

function normalizeMissingItems(data: unknown): MissingUploadTypeItem[] {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o["hydra:member"])) return normalizeMissingItems(o["hydra:member"]);
    if (Array.isArray(o.member)) return normalizeMissingItems(o.member);
    if (Array.isArray(o.data)) return normalizeMissingItems(o.data);
  }
  if (!Array.isArray(data)) return [];
  const out: MissingUploadTypeItem[] = [];
  for (const item of data) {
    if (typeof item === "string") {
      out.push({ code: item, name: item });
      continue;
    }
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const code =
        (typeof o.code === "string" && o.code) ||
        (typeof o.documentType === "string" && o.documentType) ||
        (typeof o.type === "string" && o.type) ||
        "";
      if (!code) continue;
      out.push({
        code,
        name: typeof o.name === "string" ? o.name : code,
        description: typeof o.description === "string" ? o.description : undefined,
      });
    }
  }
  return out;
}

async function fetchPolicyStatus(policyId: string): Promise<PolicyStatus | null> {
  try {
    const res = await fetch(`/api/policies/${policyId}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchMissingUploadTypes(policyId: string): Promise<{
  ok: boolean;
  items: MissingUploadTypeItem[];
  error?: string;
}> {
  const res = await fetch(`/api/policies/${policyId}/missing-upload-types`, {
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return { ok: true, items: [] };
  const text = await res.text();
  if (!text.trim()) return { ok: res.ok, items: [] };
  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      return { ok: false, items: [], error: extractErrorFromResponseBody(data) || `HTTP ${res.status}` };
    }
    return { ok: true, items: normalizeMissingItems(data) };
  } catch {
    return { ok: false, items: [], error: "Nie udało się odczytać listy dokumentów" };
  }
}

async function checkDocumentAvailability(policyId: string): Promise<DocumentAvailability> {
  const result: DocumentAvailability = { precontract: false, contract: false };
  const types = ["POLICY_PRECONTRACT", "POLICY_CONTRACT"] as const;

  await Promise.all(
    types.map(async (type) => {
      try {
        const res = await fetch(`/api/policies/${policyId}/document-download/${type}`, {
          method: "HEAD",
        });
        if (type === "POLICY_PRECONTRACT") result.precontract = res.ok;
        if (type === "POLICY_CONTRACT") result.contract = res.ok;
      } catch {
        // ignore
      }
    })
  );
  return result;
}

const POLL_INTERVAL = 10_000;

export default function PolicyDocumentsPage() {
  const params = useParams();
  const policyId = params.id as string;

  const [phase, setPhase] = useState<"loading" | "awaiting_payment" | "awaiting_approval" | "upload" | "allDone" | "error">("loading");
  const [policyStatus, setPolicyStatus] = useState<PolicyStatus | null>(null);
  const [missingTypes, setMissingTypes] = useState<MissingUploadTypeItem[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [uploadingCode, setUploadingCode] = useState<string | null>(null);
  const [uploadErrorByCode, setUploadErrorByCode] = useState<Record<string, string>>({});
  const [selectedFileByCode, setSelectedFileByCode] = useState<Record<string, File | null>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [docs, setDocs] = useState<DocumentAvailability>({ precontract: false, contract: false });
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const checkStatus = useCallback(async () => {
    const [status, missing, docAvail] = await Promise.all([
      fetchPolicyStatus(policyId),
      fetchMissingUploadTypes(policyId),
      checkDocumentAvailability(policyId),
    ]);

    if (!status) {
      setGlobalError("Nie udało się pobrać danych polisy. Sprawdź numer polisy.");
      setPhase("error");
      stopPolling();
      return;
    }

    setPolicyStatus(status);
    setDocs(docAvail);

    if (missing.ok && missing.items.length > 0) {
      setMissingTypes(missing.items);
      setPhase("upload");
      stopPolling();
      return;
    }

    if (status.requiredUploadsReceivedOn) {
      setPhase("allDone");
      stopPolling();
      return;
    }

    if (!status.paidOn) {
      setPhase("awaiting_payment");
      return;
    }

    const effectivelyApproved = !!status.approvedOn || docAvail.contract;

    if (!effectivelyApproved) {
      setPhase("awaiting_approval");
      return;
    }

    if (missing.ok && missing.items.length === 0) {
      setPhase("allDone");
      stopPolling();
      return;
    }
  }, [policyId, stopPolling]);

  useEffect(() => {
    void checkStatus();
    timerRef.current = setInterval(checkStatus, POLL_INTERVAL);
    return () => stopPolling();
  }, [checkStatus, stopPolling]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setGlobalError(null);
    await checkStatus();
    setIsRefreshing(false);
  };

  const handleSelectFile = (code: string, file: File | null) => {
    setSelectedFileByCode((prev) => ({ ...prev, [code]: file }));
    setUploadErrorByCode((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  };

  const uploadOne = async (docType: MissingUploadTypeItem) => {
    const file = selectedFileByCode[docType.code];
    if (!file) {
      setUploadErrorByCode((prev) => ({
        ...prev,
        [docType.code]: "Wybierz plik (JPG, PNG lub PDF, max 10 MB).",
      }));
      return;
    }

    setUploadingCode(docType.code);
    setUploadErrorByCode((prev) => {
      const next = { ...prev };
      delete next[docType.code];
      return next;
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", docType.code);

      const res = await fetch(`/api/policies/${policyId}/uploads`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUploadErrorByCode((prev) => ({
          ...prev,
          [docType.code]: extractErrorFromResponseBody(data) || `Błąd (${res.status})`,
        }));
        return;
      }

      setSelectedFileByCode((prev) => {
        const next = { ...prev };
        delete next[docType.code];
        return next;
      });

      const after = await fetchMissingUploadTypes(policyId);
      if (after.ok) {
        setMissingTypes(after.items);
        if (after.items.length === 0) {
          setPhase("allDone");
          stopPolling();
        }
      }
    } catch (e) {
      setUploadErrorByCode((prev) => ({
        ...prev,
        [docType.code]: e instanceof Error ? e.message : "Nie udało się wysłać pliku",
      }));
    } finally {
      setUploadingCode(null);
    }
  };

  const handleDownloadDocument = async (type: "POLICY_PRECONTRACT" | "POLICY_CONTRACT") => {
    setIsDownloading(type);
    try {
      const res = await fetch(`/api/policies/${policyId}/document-download/${type}`);
      if (!res.ok) throw new Error(`Błąd pobierania (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_${policyId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : "Nie udało się pobrać dokumentu");
    } finally {
      setIsDownloading(null);
    }
  };

  const formatPremium = (cents: number) =>
    new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(cents / 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#E1EDFF]/30">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] px-6 py-5">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dokumenty polisy
            </h1>
            {policyStatus && (
              <p className="text-white/80 text-sm mt-1">
                {policyStatus.productName} &middot; {policyStatus.number} &middot;{" "}
                {formatPremium(policyStatus.premium)}
              </p>
            )}
          </div>

          <div className="p-6 space-y-6">
            {globalError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {globalError}
              </div>
            )}

            {phase === "loading" && (
              <div className="flex items-center gap-3 py-8 justify-center text-gray-600">
                <Loader2 className="h-6 w-6 animate-spin text-[#300FE6]" />
                Sprawdzanie statusu polisy...
              </div>
            )}

            {phase === "error" && (
              <div className="text-center py-8 space-y-4">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
                <p className="text-gray-600">
                  Nie udało się pobrać danych polisy <strong>{policyId}</strong>.
                </p>
                <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Spróbuj ponownie
                </Button>
              </div>
            )}

            {phase === "awaiting_payment" && policyStatus && (
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full shrink-0">
                    <CreditCard className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Oczekiwanie na płatność</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Polisa wymaga opłacenia, zanim będzie można przesłać dokumenty.
                      Link do płatności został wysłany na Twój adres e-mail.
                    </p>
                  </div>
                </div>

                {policyStatus.paymentInitiationUrl && (
                  <a
                    href={policyStatus.paymentInitiationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[#300FE6] hover:bg-[#2208B0] text-white font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    Przejdź do płatności online
                  </a>
                )}

                {policyStatus.premiumBankAccount && (
                  <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                    <p className="font-medium text-gray-900">Dane do przelewu tradycyjnego:</p>
                    <p><span className="text-gray-500">Odbiorca:</span> {policyStatus.premiumBankAccount.name}</p>
                    <p><span className="text-gray-500">Nr konta:</span> <span className="font-mono">{policyStatus.premiumBankAccount.accountNumber}</span></p>
                    <p><span className="text-gray-500">Kwota:</span> {formatPremium(policyStatus.premium)}</p>
                    <p><span className="text-gray-500">Tytuł:</span> {policyStatus.paymentReferenceNumber || policyStatus.number}</p>
                  </div>
                )}

                {(docs.precontract || docs.contract) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <p className="font-medium text-blue-900 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Dokumenty polisy
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {docs.precontract && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument("POLICY_PRECONTRACT")}
                          disabled={isDownloading === "POLICY_PRECONTRACT"}
                        >
                          {isDownloading === "POLICY_PRECONTRACT" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                          Prekontrakt
                        </Button>
                      )}
                      {docs.contract && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument("POLICY_CONTRACT")}
                          disabled={isDownloading === "POLICY_CONTRACT"}
                        >
                          {isDownloading === "POLICY_CONTRACT" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                          Kontrakt
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Automatyczne sprawdzanie co {POLL_INTERVAL / 1000}s...
                </div>

                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Sprawdź teraz
                </Button>
              </div>
            )}

            {phase === "awaiting_approval" && (
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Płatność zaksięgowana</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Polisa została opłacona i oczekuje na zatwierdzenie w systemie ubezpieczyciela.
                      Po zatwierdzeniu pojawi się lista dokumentów do przesłania.
                    </p>
                  </div>
                </div>

                {(docs.precontract || docs.contract) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <p className="font-medium text-blue-900 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Dokumenty polisy
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {docs.precontract && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument("POLICY_PRECONTRACT")}
                          disabled={isDownloading === "POLICY_PRECONTRACT"}
                        >
                          {isDownloading === "POLICY_PRECONTRACT" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                          Prekontrakt
                        </Button>
                      )}
                      {docs.contract && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument("POLICY_CONTRACT")}
                          disabled={isDownloading === "POLICY_CONTRACT"}
                        >
                          {isDownloading === "POLICY_CONTRACT" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                          Kontrakt
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Automatyczne sprawdzanie co {POLL_INTERVAL / 1000}s...
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Sprawdź teraz
                </Button>
              </div>
            )}

            {phase === "upload" && (
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="bg-[#300FE6]/10 p-2 rounded-full shrink-0">
                    <FileText className="h-5 w-5 text-[#300FE6]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Prześlij wymagane dokumenty</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Akceptowane formaty: JPG, PNG, PDF (max 10 MB).
                    </p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {missingTypes.map((doc) => (
                    <li key={doc.code} className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div>
                        <p className="font-semibold text-gray-900">{doc.name || doc.code}</p>
                        {doc.description && (
                          <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                        <div className="flex-1">
                          <Label className="sr-only" htmlFor={`file-${doc.code}`}>
                            Plik dla {doc.code}
                          </Label>
                          <Input
                            id={`file-${doc.code}`}
                            type="file"
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={(e) => handleSelectFile(doc.code, e.target.files?.[0] ?? null)}
                          />
                        </div>
                        <Button
                          className="bg-[#300FE6] hover:bg-[#2208B0] text-white shrink-0"
                          disabled={uploadingCode === doc.code}
                          onClick={() => void uploadOne(doc)}
                        >
                          {uploadingCode === doc.code ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Wysyłanie...
                            </>
                          ) : (
                            "Wyślij"
                          )}
                        </Button>
                      </div>
                      {uploadErrorByCode[doc.code] && (
                        <p className="text-sm text-red-600">{uploadErrorByCode[doc.code]}</p>
                      )}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Odśwież listę
                </Button>
              </div>
            )}

            {phase === "allDone" && (
              <div className="text-center py-8 space-y-6">
                <div className="bg-green-100 p-4 rounded-full inline-flex">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Wszystko gotowe!</h2>
                <p className="text-gray-600">
                  Polisa została przetworzona pomyślnie.
                </p>

                {(docs.precontract || docs.contract) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3 text-left">
                    <p className="font-medium text-blue-900 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Pobierz dokumenty polisy
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {docs.precontract && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument("POLICY_PRECONTRACT")}
                          disabled={isDownloading === "POLICY_PRECONTRACT"}
                        >
                          {isDownloading === "POLICY_PRECONTRACT" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                          Prekontrakt PDF
                        </Button>
                      )}
                      {docs.contract && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument("POLICY_CONTRACT")}
                          disabled={isDownloading === "POLICY_CONTRACT"}
                        >
                          {isDownloading === "POLICY_CONTRACT" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                          Kontrakt PDF
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
                  onClick={() => (window.location.href = "/")}
                >
                  Wróć na stronę główną
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
