"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { trackLead } from "@/lib/facebook-pixel";

export type PreQualResult = {
  recommendedInsuranceType: "fakturowy" | "casco";
  recommendedMonths: number;
  estimatedCarPrice: number;
};

type PreQualQuizProps = {
  onComplete: (result: PreQualResult) => void;
};

type InvoiceAnswer = "yes" | "no" | null;
type ValueBand = "under80" | "80to120" | "over120" | null;
type HoldTime = "1to2" | "3to5" | null;

function estimateCarPrice(band: ValueBand): number {
  if (band === "under80") return 70000;
  if (band === "80to120") return 100000;
  return 140000;
}

function monthsFromHoldTime(holdTime: HoldTime): number {
  if (holdTime === "1to2") return 24;
  return 60;
}

const PreQualQuiz: React.FC<PreQualQuizProps> = ({ onComplete }) => {
  const [invoice, setInvoice] = useState<InvoiceAnswer>(null);
  const [valueBand, setValueBand] = useState<ValueBand>(null);
  const [holdTime, setHoldTime] = useState<HoldTime>(null);

  const canFinish = invoice !== null && valueBand !== null && holdTime !== null;

  const recommendation = useMemo<PreQualResult | null>(() => {
    if (!canFinish) return null;
    return {
      recommendedInsuranceType: invoice === "yes" ? "fakturowy" : "casco",
      recommendedMonths: monthsFromHoldTime(holdTime),
      estimatedCarPrice: estimateCarPrice(valueBand),
    };
  }, [canFinish, invoice, valueBand, holdTime]);

  return (
    <section className="py-10 sm:py-12" aria-labelledby="prequal-heading">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[28px] shadow-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 sm:px-8 py-6 sm:py-7 bg-gradient-to-r from-[#300FE6] to-[#2208B0] text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="prequal-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Sprawdź czy GAP ma sens dla Ciebie (60 sek)
                </h2>
                <p className="mt-2 text-white/90 text-sm sm:text-base max-w-2xl">
                  Zanim poprosimy o dane auta, odpowiedz na 3 szybkie pytania. Dostaniesz rekomendację i dopiero wtedy pokażemy wycenę.
                </p>
              </div>
              <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-white/15 items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-7 sm:py-8 space-y-8">
            <QuestionBlock
              number={1}
              title="Czy auto było kupione na fakturę?"
              subtitle="To pomaga dobrać wariant (fakturowy vs casco)."
              options={[
                { id: "yes", label: "Tak, faktura", active: invoice === "yes", onClick: () => setInvoice("yes") },
                { id: "no", label: "Nie / nie wiem", active: invoice === "no", onClick: () => setInvoice("no") },
              ]}
            />

            <QuestionBlock
              number={2}
              title="Jaka jest orientacyjna wartość auta?"
              subtitle="Wybierz widełki — bez wpisywania liczb."
              options={[
                { id: "under80", label: "Do 80 000 zł", active: valueBand === "under80", onClick: () => setValueBand("under80") },
                { id: "80to120", label: "80 000–120 000 zł", active: valueBand === "80to120", onClick: () => setValueBand("80to120") },
                { id: "over120", label: "Powyżej 120 000 zł", active: valueBand === "over120", onClick: () => setValueBand("over120") },
              ]}
            />

            <QuestionBlock
              number={3}
              title="Jak długo planujesz trzymać to auto?"
              subtitle="Im dłużej, tym większa różnica wartości."
              options={[
                { id: "1to2", label: "1–2 lata", active: holdTime === "1to2", onClick: () => setHoldTime("1to2") },
                { id: "3to5", label: "3–5 lat", active: holdTime === "3to5", onClick: () => setHoldTime("3to5") },
              ]}
            />

            <div className="pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm sm:text-base text-gray-700">
                  {recommendation ? (
                    <div className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span>
                        Rekomendacja:{" "}
                        <strong>
                          GAP {recommendation.recommendedInsuranceType === "fakturowy" ? "Fakturowy" : "Casco"}
                        </strong>{" "}
                        na <strong>{recommendation.recommendedMonths} mies.</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-gray-600">
                      <HelpCircle className="h-5 w-5" />
                      <span>Odpowiedz na wszystkie pytania, żeby zobaczyć rekomendację.</span>
                    </div>
                  )}
                </div>

                <Button
                  className="bg-[#300FE6] hover:bg-[#2208B0] text-white rounded-[20px] py-6 px-6 text-base font-semibold"
                  disabled={!recommendation}
                  onClick={() => {
                    if (!recommendation) return;
                    trackLead("Pre-qual completed", "Home");
                    onComplete(recommendation);
                  }}
                >
                  Pokaż wycenę
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                W kolejnym kroku poprosimy o cenę, rok i okres ochrony — to już realna kalkulacja.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type QuestionOption = {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
};

const QuestionBlock: React.FC<{
  number: number;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}> = ({ number, title, subtitle, options }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#FF8E3D]/15 text-[#B84A00] font-extrabold">
          {number}
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={opt.onClick}
            className={[
              "rounded-[20px] border px-4 py-4 text-left transition-all",
              opt.active
                ? "border-[#300FE6] bg-[#300FE6]/5 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-gray-900">{opt.label}</span>
              <span
                className={[
                  "h-5 w-5 rounded-full border flex items-center justify-center",
                  opt.active ? "border-[#300FE6] bg-[#300FE6]" : "border-gray-300 bg-white",
                ].join(" ")}
                aria-hidden
              >
                {opt.active && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PreQualQuiz;

