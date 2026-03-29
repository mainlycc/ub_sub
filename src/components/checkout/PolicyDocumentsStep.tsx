"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { extractErrorFromResponseBody } from "@/lib/api-error-message";

/** Minimalny kontrakt z API missing-upload-types (Defend może zwracać dodatkowe pola). */
export interface MissingUploadTypeItem {
  code: string;
  name?: string;
  description?: string;
}

const POLL_MS = 8000;
/** Po tylu próbach z pustą tablicą automatycznie pokażemy ekran z wyborem (odśwież / zakończ). */
const MAX_EMPTY_POLLS = 20;
/** Po tylu pustych odpowiedziach (~64 s przy 8 s interwale) pokażemy przycisk wcześniejszego zakończenia. */
const EARLY_COMPLETE_AFTER_EMPTY_POLLS = 8;

function normalizeMissingItems(data: unknown): MissingUploadTypeItem[] {
  // API Platform / JSON-LD często zwraca { "hydra:member": [ ... ] } zamiast surowej tablicy
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o["hydra:member"])) {
      return normalizeMissingItems(o["hydra:member"]);
    }
    if (Array.isArray(o.member)) {
      return normalizeMissingItems(o.member);
    }
    if (Array.isArray(o.data)) {
      return normalizeMissingItems(o.data);
    }
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

async function fetchMissingUploadTypes(policyId: string): Promise<{
  ok: boolean;
  items: MissingUploadTypeItem[];
  error?: string;
}> {
  const res = await fetch(`/api/policies/${policyId}/missing-upload-types`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) {
    return { ok: true, items: [] };
  }

  const text = await res.text();
  if (!text.trim()) {
    return { ok: res.ok, items: [], error: res.ok ? undefined : `HTTP ${res.status}` };
  }

  if (text.trim().toLowerCase().startsWith("<!doctype") || text.trim().toLowerCase().startsWith("<html")) {
    return { ok: false, items: [], error: "Nieprawidłowa odpowiedź serwera" };
  }

  try {
    const data = JSON.parse(text) as unknown;
    if (!res.ok) {
      const err = extractErrorFromResponseBody(data) || `HTTP ${res.status}`;
      return { ok: false, items: [], error: err };
    }
    return { ok: true, items: normalizeMissingItems(data) };
  } catch {
    return { ok: false, items: [], error: "Nie udało się odczytać listy dokumentów" };
  }
}

interface PolicyDocumentsStepProps {
  policyId: string;
  onComplete: () => void;
  onBackToSummary?: () => void;
}

export const PolicyDocumentsStep: React.FC<PolicyDocumentsStepProps> = ({
  policyId,
  onComplete,
  onBackToSummary,
}) => {
  const [phase, setPhase] = useState<"waiting" | "upload" | "allDone" | "timeoutEmpty">("waiting");
  const [missingTypes, setMissingTypes] = useState<MissingUploadTypeItem[]>([]);
  const [pollCount, setPollCount] = useState(0);
  const emptyStreakRef = useRef(0);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [uploadingCode, setUploadingCode] = useState<string | null>(null);
  const [uploadErrorByCode, setUploadErrorByCode] = useState<Record<string, string>>({});
  const [selectedFileByCode, setSelectedFileByCode] = useState<Record<string, File | null>>({});
  const [isRefreshingMissing, setIsRefreshingMissing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const afterSuccessfulUpload = useCallback(async () => {
    const after = await fetchMissingUploadTypes(policyId);
    if (!after.ok) {
      setGlobalError(after.error || "Nie udało się odświeżyć listy dokumentów");
      return;
    }
    setMissingTypes(after.items);
    if (after.items.length === 0) {
      setPhase("allDone");
      stopPolling();
    } else {
      setPhase("upload");
    }
  }, [policyId, stopPolling]);

  const refreshMissing = useCallback(async () => {
    setGlobalError(null);
    setIsRefreshingMissing(true);
    try {
      const { ok, items, error } = await fetchMissingUploadTypes(policyId);
      if (!ok) {
        setGlobalError(error || "Błąd pobierania listy dokumentów");
        return;
      }
      setMissingTypes(items);
      if (items.length > 0) {
        emptyStreakRef.current = 0;
        setPhase("upload");
        stopPolling();
      }
    } finally {
      setIsRefreshingMissing(false);
    }
  }, [policyId, stopPolling]);

  // Polling dopóki nie ma brakujących typów (approval + lista) albo timeout pustej listy
  useEffect(() => {
    let mounted = true;
    emptyStreakRef.current = 0;

    const tick = async () => {
      if (!mounted) return;
      const { ok, items, error } = await fetchMissingUploadTypes(policyId);
      if (!mounted) return;

      if (!ok) {
        setGlobalError(error || "Błąd pobierania listy dokumentów");
        return;
      }

      setMissingTypes(items);

      if (items.length > 0) {
        emptyStreakRef.current = 0;
        setPhase("upload");
        stopPolling();
        return;
      }

      emptyStreakRef.current += 1;
      setPollCount(emptyStreakRef.current);
      if (emptyStreakRef.current >= MAX_EMPTY_POLLS) {
        setPhase("timeoutEmpty");
        stopPolling();
      }
    };

    void tick();
    timerRef.current = setInterval(tick, POLL_MS);

    return () => {
      mounted = false;
      stopPolling();
    };
  }, [policyId, stopPolling]);

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
        const msg =
          extractErrorFromResponseBody(data) || `Błąd uploadu (${res.status})`;
        setUploadErrorByCode((prev) => ({ ...prev, [docType.code]: msg }));
        return;
      }

      setSelectedFileByCode((prev) => {
        const next = { ...prev };
        delete next[docType.code];
        return next;
      });

      await afterSuccessfulUpload();
    } catch (e) {
      setUploadErrorByCode((prev) => ({
        ...prev,
        [docType.code]:
          e instanceof Error ? e.message : "Nie udało się wysłać pliku",
      }));
    } finally {
      setUploadingCode(null);
    }
  };

  const missingTypesInfoBox = (
    <div className="rounded-xl border border-[#300FE6]/20 bg-[#300FE6]/5 p-4 text-sm text-gray-700">
      <p className="font-medium text-gray-900 mb-1">Jak działają typy dokumentów</p>
      <p>
        Lista braków pochodzi wyłącznie z endpointu{" "}
        <code className="text-xs bg-white px-1 rounded border">GET /api/policies/&#123;id&#125;/missing-upload-types</code>.
        Pole <code className="text-xs bg-white px-1 rounded border">documentType</code> przy wysyłce (
        <code className="text-xs bg-white px-1 rounded border">POST .../uploads</code>) musi być{" "}
        <strong>dokładnie</strong> takie jak pole <code className="text-xs">code</code> z tej listy —
        dzięki temu plik trafia we właściwy „tryb” w systemie Defend.
      </p>
    </div>
  );

  if (phase === "allDone") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          Dokumenty przesłane
        </h2>
        <p className="text-gray-600">
          Wszystkie wymagane na tym etapie dokumenty zostały przesłane. Możesz zakończyć proces.
        </p>
        <Button
          className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
          onClick={onComplete}
        >
          Zakończ i wyślij potwierdzenie
        </Button>
      </div>
    );
  }

  if (phase === "timeoutEmpty") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <span className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3 text-[#FF8E3D] font-bold">6</span>
          Dokumenty
        </h2>
        {missingTypesInfoBox}
        <p className="text-gray-600">
          API zwraca pustą listę <code className="text-xs bg-gray-100 px-1 rounded">[]</code> — w
          Defend często oznacza to „brak brakujących dokumentów” (wszystko OK albo nic nie wymagane),
          albo dokumenty pojawią się później. Użyj ponownie{" "}
          <strong>pobrania listy</strong> z <code className="text-xs">missing-upload-types</code>,
          zanim wyślesz pliki — wtedy zobaczysz właściwe kody typów.
        </p>
        {globalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {globalError}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            disabled={isRefreshingMissing}
            onClick={() => void refreshMissing()}
          >
            {isRefreshingMissing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Pobierz brakujące typy (missing-upload-types)
          </Button>
          <Button
            className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
            onClick={onComplete}
          >
            Zakończ bez uploadu
          </Button>
          {onBackToSummary && (
            <Button variant="ghost" onClick={onBackToSummary}>
              Wróć do podsumowania
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "waiting") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <span className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3 text-[#FF8E3D] font-bold">6</span>
          Dokumenty
        </h2>
        {missingTypesInfoBox}
        <div className="flex items-center gap-3 text-gray-700">
          <Loader2 className="h-6 w-6 animate-spin text-[#300FE6]" />
          <div>
            <p className="font-medium">Sprawdzanie listy dokumentów…</p>
            <p className="text-sm text-gray-500 mt-1">
              Automatyczne odpytywanie{" "}
              <code className="text-xs bg-gray-100 px-1 rounded">GET .../missing-upload-types</code>.
              Gdy pojawią się pozycje, każda ma swój <code className="text-xs">code</code> — tylko ten
              kod trafia do <code className="text-xs">documentType</code> przy uploadzie. Próba{" "}
              {pollCount}, co {POLL_MS / 1000} s.
            </p>
          </div>
        </div>
        {pollCount >= EARLY_COMPLETE_AFTER_EMPTY_POLLS && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="mb-3">
              Lista nadal pusta — jeśli wiesz, że dla tej polisy nie ma uploadu albo chcesz zakończyć
              zamówienie mimo to, użyj przycisku poniżej.
            </p>
            <Button
              type="button"
              variant="outline"
              className="border-amber-300 bg-white hover:bg-amber-100"
              onClick={() => {
                stopPolling();
                onComplete();
              }}
            >
              Zakończ proces (brak dokumentów na liście)
            </Button>
          </div>
        )}
        {globalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {globalError}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={isRefreshingMissing}
          onClick={() => void refreshMissing()}
        >
          {isRefreshingMissing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Pobierz listę teraz (missing-upload-types)
        </Button>
        {onBackToSummary && (
          <Button variant="ghost" size="sm" onClick={onBackToSummary}>
            Wróć do podsumowania
          </Button>
        )}
      </div>
    );
  }

  // phase === "upload"
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
        <span className="bg-[#FF8E3D]/20 p-2 rounded-full mr-3 text-[#FF8E3D] font-bold">6</span>
        Prześlij wymagane dokumenty
      </h2>
      {missingTypesInfoBox}
      <p className="text-sm text-gray-600">
        Poniżej każda pozycja pochodzi z ostatniej odpowiedzi{" "}
        <code className="text-xs bg-gray-100 px-1 rounded">missing-upload-types</code>. Formaty plików:
        JPG, PNG, PDF (max 10 MB). Przy „Wyślij” w polu <code className="text-xs">documentType</code>{" "}
        idzie wartość <code className="text-xs">code</code> z listy.
      </p>
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {globalError}
        </div>
      )}
      <ul className="space-y-6">
        {missingTypes.map((doc) => (
          <li
            key={doc.code}
            className="border border-gray-200 rounded-xl p-4 bg-white space-y-3"
          >
            <div>
              <p className="font-semibold text-gray-900">{doc.name || doc.code}</p>
              {doc.description && (
                <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1 font-mono">{doc.code}</p>
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
                  onChange={(e) =>
                    handleSelectFile(doc.code, e.target.files?.[0] ?? null)
                  }
                />
              </div>
              <Button
                type="button"
                className="bg-[#300FE6] hover:bg-[#2208B0] text-white shrink-0"
                disabled={uploadingCode === doc.code}
                onClick={() => void uploadOne(doc)}
              >
                {uploadingCode === doc.code ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Wysyłanie…
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
      <Button
        variant="outline"
        size="sm"
        disabled={isRefreshingMissing}
        onClick={() => void refreshMissing()}
      >
        {isRefreshingMissing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-2" />
        )}
        Odśwież listę braków (missing-upload-types)
      </Button>
      {onBackToSummary && (
        <Button variant="ghost" size="sm" onClick={onBackToSummary}>
          Wróć do podsumowania
        </Button>
      )}
    </div>
  );
};

export default PolicyDocumentsStep;
