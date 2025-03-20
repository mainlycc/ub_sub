"use client"

import { ArrowLeft, Book, Users, FileText, Scale } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const Terms = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#E1EDFF]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-2" /> Powrót
        </Button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] h-2 w-full"></div>
          
          <div className="p-8">
            {/* Nagłówek z akcentem kolorystycznym */}
            <div className="text-center mb-12">
              <div className="inline-block p-3 bg-[#E1EDFF] rounded-full mb-4">
                <Book className="h-8 w-8 text-[#300FE6]" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Regulamin</h1>
              <div className="mt-4 h-1 w-20 bg-[#FF8E3D] mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-8 text-gray-600">
              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <div className="flex items-start">
                  <div className="bg-[#300FE6]/10 p-2 rounded-lg mr-4">
                    <Scale className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">§1. Postanowienia ogólne</h2>
                    <p>
                      Niniejszy regulamin określa zasady korzystania z serwisu internetowego oferującego ubezpieczenia GAP, 
                      zasady zawierania umów ubezpieczenia oraz prawa i obowiązki Użytkowników i Ubezpieczyciela.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <div className="flex items-start">
                  <div className="bg-[#300FE6]/10 p-2 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">§2. Definicje</h2>
                    <div className="grid gap-4">
                      {[
                        { term: "Serwis", def: "platforma internetowa służąca do zawierania umów ubezpieczenia GAP" },
                        { term: "Użytkownik", def: "osoba korzystająca z Serwisu" },
                        { term: "Ubezpieczyciel", def: "podmiot świadczący usługi ubezpieczeniowe" },
                        { term: "GAP", def: "ubezpieczenie straty finansowej" }
                      ].map((item, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg border border-[#E1EDFF]">
                          <span className="font-semibold text-[#300FE6]">{item.term}</span>
                          <span className="mx-2">-</span>
                          <span>{item.def}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-white to-[#E1EDFF]/30 rounded-xl p-6 border border-[#E1EDFF]">
                <div className="flex items-start">
                  <div className="bg-[#300FE6]/10 p-2 rounded-lg mr-4">
                    <FileText className="h-6 w-6 text-[#300FE6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">§3. Zawarcie umowy ubezpieczenia</h2>
                    <div className="space-y-3">
                      {[
                        "Wypełnienie formularza z danymi pojazdu i właściciela",
                        "Zaakceptowanie warunków ubezpieczenia",
                        "Opłacenie składki ubezpieczeniowej",
                        "Otrzymanie potwierdzenia zawarcia umowy"
                      ].map((step, index) => (
                        <div key={index} className="flex items-center p-4 bg-white rounded-lg border border-[#E1EDFF]">
                          <div className="w-6 h-6 rounded-full bg-[#300FE6]/10 flex items-center justify-center mr-3">
                            <span className="text-[#300FE6] font-semibold">{index + 1}</span>
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§4. Płatności</h2>
                <p>
                  Płatności za ubezpieczenie można dokonać:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Przelewem bankowym</li>
                  <li>Za pomocą szybkich płatności online</li>
                  <li>W systemie ratalnym (po spełnieniu określonych warunków)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§5. Odstąpienie od umowy</h2>
                <p>
                  Użytkownik ma prawo odstąpić od umowy ubezpieczenia w terminie 30 dni od dnia jej zawarcia. 
                  Odstąpienie wymaga formy pisemnej lub elektronicznej.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§6. Reklamacje</h2>
                <p>
                  Reklamacje można składać:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Pisemnie na adres siedziby</li>
                  <li>Elektronicznie poprzez formularz na stronie</li>
                  <li>Telefonicznie</li>
                </ul>
                <p className="mt-2">
                  Reklamacje rozpatrywane są w terminie 30 dni od dnia ich otrzymania.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">§7. Postanowienia końcowe</h2>
                <p>
                  W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego, 
                  w szczególności Kodeksu cywilnego oraz ustawy o działalności ubezpieczeniowej i reasekuracyjnej.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 