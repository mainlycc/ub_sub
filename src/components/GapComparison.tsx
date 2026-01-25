"use client"

import React from 'react';
import { X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const GapComparison = () => {
  const router = useRouter();

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bez GAP możesz stracić nawet <span className="text-red-600">50 000 zł</span>
          </h2>
          <p className="text-xl text-gray-600">
            Zobacz różnicę między posiadaniem a brakiem ubezpieczenia GAP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Bez GAP */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-8">
            <div className="text-center mb-6">
              <div className="inline-block bg-red-100 p-4 rounded-full mb-4">
                <X className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">BEZ GAP</h3>
              <p className="text-gray-600">Tak wygląda sytuacja bez ochrony</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold mr-3">
                  1
                </div>
                <p className="text-gray-700">Kupiłeś auto za <span className="font-bold">120 000 zł</span></p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold mr-3">
                  2
                </div>
                <p className="text-gray-700">Po 2 latach dochodzi do <span className="font-bold">kradzieży</span></p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold mr-3">
                  3
                </div>
                <p className="text-gray-700">Ubezpieczyciel wypłaca wartość rynkową: <span className="font-bold">85 000 zł</span></p>
              </div>

              <div className="border-t-2 border-red-200 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">TRACISZ:</span>
                  <div className="flex items-center">
                    <X className="h-6 w-6 text-red-600 mr-2" />
                    <span className="text-3xl font-bold text-red-600">35 000 zł</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Z GAP */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg border-2 border-green-300 p-8 relative">
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              POLECANE!
            </div>
            
            <div className="text-center mb-6">
              <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Z GAP</h3>
              <p className="text-gray-600">Pełna ochrona Twojej inwestycji</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold mr-3">
                  1
                </div>
                <p className="text-gray-700">Kupiłeś auto za <span className="font-bold">120 000 zł</span></p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold mr-3">
                  2
                </div>
                <p className="text-gray-700">Po 2 latach dochodzi do <span className="font-bold">kradzieży</span></p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold mr-3">
                  3
                </div>
                <p className="text-gray-700">Dostajesz pełną wartość: <span className="font-bold text-green-600">120 000 zł</span></p>
              </div>

              <div className="border-t-2 border-green-300 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">TRACISZ:</span>
                  <div className="flex items-center">
                    <Check className="h-6 w-6 text-green-600 mr-2" />
                    <span className="text-3xl font-bold text-green-600">0 zł</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={() => router.push('/gap')}
            className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] hover:from-[#4024E9] hover:to-[#300FE6] text-white text-lg px-12 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Zabezpiecz swoje auto teraz
          </Button>
          <p className="text-sm text-gray-600 mt-3">14 dni na rezygnację - pełny zwrot</p>
        </div>

        {/* Dodatkowe informacje */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 max-w-3xl mx-auto">
          <h4 className="font-semibold text-gray-900 mb-3 text-center">Dlaczego to się dzieje?</h4>
          <p className="text-gray-700 text-center">
            Samochody tracą wartość z każdym rokiem użytkowania. Ubezpieczyciel wypłaca odszkodowanie na podstawie 
            aktualnej wartości rynkowej pojazdu, a nie ceny zakupu. Ubezpieczenie GAP pokrywa tę różnicę, 
            chroniąc Cię przed finansową stratą.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GapComparison;
