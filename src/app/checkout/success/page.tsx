"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const policyId = searchParams.get('policyId');

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Dziękujemy za zakup ubezpieczenia!
        </h1>

        <p className="text-lg text-gray-600">
          Twoja polisa została pomyślnie zarejestrowana.
          {policyId && (
            <span className="block mt-2">
              Numer polisy: <span className="font-medium">{policyId}</span>
            </span>
          )}
        </p>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Co dalej?</h2>
          <div className="space-y-4 text-left">
            <p className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-[#300FE6] text-white flex items-center justify-center mr-3 mt-0.5">1</span>
              <span>Na Twój adres email wysłaliśmy potwierdzenie zakupu wraz z dokumentami polisy.</span>
            </p>
            <p className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-[#300FE6] text-white flex items-center justify-center mr-3 mt-0.5">2</span>
              <span>Sprawdź swoją skrzynkę odbiorczą i postępuj zgodnie z instrukcjami zawartymi w wiadomości.</span>
            </p>
            <p className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-[#300FE6] text-white flex items-center justify-center mr-3 mt-0.5">3</span>
              <span>W razie pytań lub wątpliwości, skontaktuj się z naszym biurem obsługi klienta.</span>
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Wróć do strony głównej
          </Button>
          <Button
            className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
            onClick={() => window.print()}
          >
            Drukuj potwierdzenie
          </Button>
        </div>
      </div>
    </main>
  );
} 