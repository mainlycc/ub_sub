"use client";

import React from "react";
import { X, Check, Car, Shield, Clock, CreditCard } from "lucide-react";

const GapComparisonSection = (): React.ReactElement => {
  return (
    <section className="py-8 sm:py-12 bg-gray-50" aria-labelledby="gap-comparison-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2
            id="gap-comparison-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-900"
          >
            Bez GAP tracisz. Z GAP Fakturowym — nie.
          </h2>
          <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Zobacz, ile możesz stracić przy szkodzie całkowitej i jak GAP Fakturowy chroni Twoją inwestycję.
          </p>
        </div>

        <div className="bg-gradient-to-b from-white to-[#EAE7FC] rounded-[28px] shadow-2xl border border-white/60 px-4 sm:px-6 py-6 sm:py-8">
          {/* Pasek nad kartami */}
          <p className="text-center text-sm sm:text-base font-medium text-gray-700 mb-6 sm:mb-8">
            Bez GAP możesz stracić nawet{" "}
            <span className="text-[#E53935] font-bold">35 000 zł</span>. Zobacz różnicę.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 items-stretch">
            {/* Lewa karta — BEZ GAP */}
            <div className="relative bg-red-100 rounded-[24px] shadow-xl border border-red-200 px-5 sm:px-6 py-6 sm:py-7 flex flex-col transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#FFE5E7] text-[#E53935] shadow-sm">
                    <X className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-wide">
                      Bez GAP
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Sytuacja bez ochrony
                    </p>
                  </div>
                </div>
              </div>

              <ol className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base mb-5 sm:mb-6 flex-1">
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF3F4] text-[#E53935] font-semibold text-xs shadow-sm">
                    1
                  </span>
                  <span>
                    Kupujesz auto za{" "}
                    <strong className="text-gray-900">120 000 zł</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF3F4] text-[#E53935] font-semibold text-xs shadow-sm">
                    2
                  </span>
                  <span>
                    Po 2 latach dochodzi do{" "}
                    <strong className="text-[#E53935]">kradzieży / szkody całkowitej</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF3F4] text-[#E53935] font-semibold text-xs shadow-sm">
                    3
                  </span>
                  <span>
                    Ubezpieczyciel wypłaca wartość rynkową:{" "}
                    <strong className="text-gray-900">85 000 zł</strong>
                  </span>
                </li>
              </ol>

              <div className="mt-auto bg-gradient-to-r from-[#FF4D4F] to-[#E53935] rounded-2xl px-5 sm:px-6 py-4 flex items-center justify-between text-white shadow-lg">
                <div className="text-xs sm:text-sm font-semibold opacity-90">
                  TRACISZ:
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <X className="hidden sm:block h-5 w-5" />
                  <span className="text-lg sm:text-2xl font-extrabold whitespace-nowrap">
                    35 000 zł
                  </span>
                </div>
              </div>
            </div>

            {/* Prawa karta — Z GAP */}
            <div className="relative bg-green-100 rounded-[24px] shadow-[0_18px_45px_rgba(48,15,230,0.15)] border border-green-200 px-5 sm:px-6 py-6 sm:py-7 flex flex-col transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1">
              {/* Wstążka POLECANE */}
              <div className="absolute -top-3 right-4 sm:right-6">
                <div className="inline-flex items-center gap-1 rounded-full bg-[#300FE6] px-3 py-1 text-[11px] sm:text-xs font-semibold text-white shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  POLECANE
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#E3E0FF] text-[#300FE6] shadow-sm">
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-wide">
                      Z GAP
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Pełna ochrona inwestycji
                    </p>
                  </div>
                </div>
              </div>

              <ol className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base mb-5 sm:mb-6 flex-1">
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3F0FF] text-[#300FE6] font-semibold text-xs shadow-sm">
                    1
                  </span>
                  <span>
                    Kupujesz auto za{" "}
                    <strong className="text-gray-900">120 000 zł</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3F0FF] text-[#300FE6] font-semibold text-xs shadow-sm">
                    2
                  </span>
                  <span>
                    Po 2 latach dochodzi do{" "}
                    <strong className="text-[#300FE6]">kradzieży / szkody całkowitej</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3F0FF] text-[#300FE6] font-semibold text-xs shadow-sm">
                    3
                  </span>
                  <span>
                    Dostajesz pełną wartość fakturową:{" "}
                    <strong className="text-gray-900">120 000 zł</strong>
                  </span>
                </li>
              </ol>

              <div className="mt-auto bg-gradient-to-r from-[#16AB59] to-[#11A04F] rounded-2xl px-5 sm:px-6 py-4 flex items-center justify-between text-white shadow-lg">
                <div className="text-xs sm:text-sm font-semibold opacity-95 flex items-center gap-2">
                  <Car className="hidden sm:block h-5 w-5" />
                  TRACISZ:
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Check className="hidden sm:block h-5 w-5" />
                  <span className="text-lg sm:text-2xl font-extrabold whitespace-nowrap">
                    0 zł
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dolne benefity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/90 border border-[#FFE7CC] px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF9B50] text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  Ochrona do 300 000 zł
                </p>
                <p className="text-[11px] sm:text-xs text-gray-500">
                  Dla nowych i używanych aut
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/90 border border-[#E3E0FF] px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#300FE6] text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  Okres do 5 lat
                </p>
                <p className="text-[11px] sm:text-xs text-gray-500">
                  Elastyczny czas ochrony
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/90 border border-[#C3F0D6] px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16AB59] text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  Płatność ratalna
                </p>
                <p className="text-[11px] sm:text-xs text-gray-500">
                  Dopasowana do Twojego budżetu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GapComparisonSection;
