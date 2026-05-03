"use client";

import React from "react";
import { Shield, Clock, BadgeCheck, ArrowDownRight } from "lucide-react";
import { trackLead } from "@/lib/facebook-pixel";

type HeroSectionProps = {
  onCtaClick: () => void;
};

const HeroSection: React.FC<HeroSectionProps> = ({ onCtaClick }) => {
  return (
    <section className="pt-10 sm:pt-14 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <div className="bg-white/80 backdrop-blur-sm rounded-[28px] border border-white/60 shadow-2xl p-7 sm:p-9">
            <p className="inline-flex items-center rounded-full bg-[#FF8E3D]/15 text-[#B84A00] px-3 py-1 text-xs sm:text-sm font-semibold">
              Ubezpieczenie GAP — kradzież / szkoda całkowita
            </p>

            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.05]">
              Stracisz nawet{" "}
              <span className="text-[#E53935]">35 000 zł</span> na aucie — chyba że masz GAP
            </h1>

            <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-xl">
              AC wypłaca wartość rynkową. GAP dopłaca różnicę do wartości z dnia zakupu.
              Sprawdź w 60 sekund, czy to ma sens w Twoim przypadku.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  trackLead("Hero CTA — pre-qual", "Home");
                  onCtaClick();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-[20px] px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-[#300FE6] to-[#2208B0] shadow-md shadow-[#300FE6]/25 hover:from-[#4024E9] hover:to-[#300FE6] transition-colors"
              >
                Sprawdź czy GAP ma sens (60 sek)
                <ArrowDownRight className="ml-2 h-5 w-5" />
              </button>

              <div className="w-full sm:w-auto rounded-[20px] border border-gray-200 bg-white px-5 py-4 text-sm sm:text-base text-gray-700">
                Dla aut nowych i używanych (do 5 lat ochrony).
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#E3E0FF] px-4 py-3 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#300FE6] text-white">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Ochrona</p>
                  <p className="text-xs text-gray-600">do 300 000 zł</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#FFE7CC] px-4 py-3 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF8E3D] text-white">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Szybko</p>
                  <p className="text-xs text-gray-600">wycena online</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#C3F0D6] px-4 py-3 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16AB59] text-white">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Bez ryzyka</p>
                  <p className="text-xs text-gray-600">14 dni na zwrot</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] overflow-hidden border border-white/60 shadow-2xl bg-gradient-to-b from-white to-[#EAE7FC] p-7 sm:p-9">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              „AHA” w 10 sekund
            </h2>
            <p className="mt-2 text-base sm:text-lg text-gray-700">
              Kupujesz auto za <strong>120 000 zł</strong>. Po 2 latach kradzież.
              AC wypłaca <strong>85 000 zł</strong>.{" "}
              <strong className="text-[#E53935]">Tracisz 35 000 zł</strong>.
              GAP może dopłacić brakującą różnicę.
            </p>

            <div className="mt-5 rounded-2xl bg-white border border-gray-200 p-5">
              <div className="grid grid-cols-2 gap-3 text-sm sm:text-base">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-xs text-gray-500">Wartość zakupu</div>
                  <div className="mt-1 font-bold text-gray-900">120 000 zł</div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-xs text-gray-500">Wypłata z AC</div>
                  <div className="mt-1 font-bold text-gray-900">85 000 zł</div>
                </div>
                <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
                  <div className="text-xs text-gray-500">Strata bez GAP</div>
                  <div className="mt-1 font-extrabold text-[#E53935]">35 000 zł</div>
                </div>
                <div className="rounded-2xl bg-green-50 p-4 border border-green-100">
                  <div className="text-xs text-gray-500">Z GAP</div>
                  <div className="mt-1 font-extrabold text-[#16AB59]">0 zł</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                To przykład — realna różnica zależy od wartości pojazdu i warunków polisy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

