"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

const BlogPostPage = () => {
  return (
    <div className="min-h-screen bg-[#EAE7FC]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/blog" className="inline-flex items-center text-blue-100 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do bloga
            </Link>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Ubezpieczenia
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Wypadek, stłuczka, a może kradzież? Kiedy przyda Ci się assistance i NNW
            </h1>
            <div className="flex items-center justify-center gap-6 text-blue-100 text-sm">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Ekspert BC</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>10 stycznia 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>6 min czytania</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Podstawowe ubezpieczenie OC to absolutna konieczność, która chroni nas przed finansowymi konsekwencjami szkód wyrządzonych innym. Ale co, jeśli to Ty potrzebujesz pomocy? Co, gdy Twój samochód odmówi posłuszeństwa na środku drogi albo Ty sam odniesiesz obrażenia? Właśnie wtedy na ratunek przychodzą ubezpieczenie assistance i ubezpieczenie NNW komunikacyjne. Dowiedz się, kiedy te dodatkowe polisy są nieocenionym wsparciem i dlaczego warto je mieć!
            </p>

            {/* Obraz ilustracyjny */}
            <div className="my-8">
              <Image
                src="/ub2.jpg"
                alt="Uszkodzony samochód na lawecie - ilustracja do artykułu o assistance i NNW"
                width={1200}
                height={675}
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
              />
              <p className="text-sm text-gray-500 text-center mt-2">
                Assistance i NNW to dodatkowa ochrona, która może okazać się nieoceniona w trudnych sytuacjach
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Ubezpieczenie Assistance: Twój anioł stróż na drodze</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Wyobraź sobie sytuację: jedziesz na wakacje, jesteś setki kilometrów od domu i nagle… awaria. Samochód staje, a Ty nie masz pojęcia, co dalej. Właśnie w takich momentach docenisz ubezpieczenie assistance drogowe. To polisa, która gwarantuje Ci pomoc w nieprzewidzianych sytuacjach na drodze.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">Kiedy przyda Ci się assistance?</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Awaria samochodu:</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Holowanie do najbliższego warsztatu, drobne naprawy na miejscu, a nawet samochód zastępczy na czas naprawy.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Wypadek lub stłuczka:</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Organizacja holowania, pomoc prawna, a czasem nawet zakwaterowanie dla Ciebie i pasażerów, jeśli pojazd nie nadaje się do dalszej jazdy.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Brak paliwa, przebita opona, rozładowany akumulator:</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Assistance zapewni dowóz paliwa, wymianę koła czy uruchomienie silnika.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Kradzież pojazdu:</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Często assistance obejmuje pomoc w powrocie do domu lub wynajem samochodu zastępczego po zgłoszeniu kradzieży.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-[#300FE6] p-6 my-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Rodzaje assistance:</h4>
              <p className="text-gray-700 leading-relaxed">
                Pamiętaj, że ubezpieczenie assistance ma różne warianty (podstawowy, standardowy, premium), które różnią się zakresem usług (np. limit kilometrów holowania, długość wynajmu auta zastępczego). Zawsze dokładnie sprawdź, co obejmuje Twoja polisa assistance, aby uniknąć rozczarowań.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Ubezpieczenie NNW komunikacyjne: Ochrona dla Ciebie i pasażerów</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ubezpieczenie NNW (Następstwa Nieszczęśliwych Wypadków) komunikacyjne to polisa, która chroni Ciebie i Twoich pasażerów w przypadku obrażeń ciała doznanych w wypadku drogowym. To dodatkowa warstwa bezpieczeństwa, która może okazać się nieoceniona w trudnych sytuacjach.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">Co obejmuje NNW komunikacyjne?</h3>
            
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li><strong>Śmierć w wypadku komunikacyjnym:</strong> Wypłata świadczenia dla bliskich</li>
              <li><strong>Trwały uszczerbek na zdrowiu:</strong> Odszkodowanie za trwałe następstwa wypadku</li>
              <li><strong>Koszty leczenia i rehabilitacji:</strong> Pokrycie wydatków medycznych</li>
              <li><strong>Zasiłek dzienny:</strong> Wypłata za każdy dzień niezdolności do pracy</li>
              <li><strong>Śmierć bliskiej osoby:</strong> Wsparcie finansowe w przypadku śmierci współmałżonka lub dziecka</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Kiedy warto rozważyć assistance i NNW?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-800 mb-3">Assistance - warto gdy:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Często podróżujesz samochodem</li>
                  <li>• Masz starszy pojazd</li>
                  <li>• Jeździsz na długie trasy</li>
                  <li>• Nie masz znajomych mechaników</li>
                  <li>• Chcesz spokój na drodze</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">NNW - warto gdy:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Masz rodzinę i pasażerów</li>
                  <li>• Jesteś jedynym żywicielem</li>
                  <li>• Nie masz dodatkowego ubezpieczenia</li>
                  <li>• Chcesz ochronę dla bliskich</li>
                  <li>• Często przewozisz dzieci</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">💡 Wskazówka:</h4>
              <p className="text-yellow-700 leading-relaxed">
                Często ubezpieczyciele oferują pakiety OC + AC + Assistance + NNW w atrakcyjnych cenach. Porównaj oferty na gapauto.pl i znajdź optymalny pakiet dla swoich potrzeb!
              </p>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] text-white rounded-lg p-8 text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">Sprawdź oferty assistance i NNW!</h3>
              <p className="text-blue-100 mb-6">
                Skorzystaj z naszego kalkulatora i porównaj pakiety ubezpieczeniowe z assistance i NNW
              </p>
              <Button 
                className="bg-white text-[#300FE6] hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                onClick={() => window.location.href = '/gap'}
              >
                Sprawdź ofertę
              </Button>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Powiązane artykuły</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Jak nie przepłacać za OC? 5 sposobów na tańsze ubezpieczenie samochodu
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                Dowiedz się, jak znacząco obniżyć koszt ubezpieczenia OC dzięki sprawdzonym trikom i porównywarkom.
              </p>
              <Link href="/blog/jak-nie-przeplacac-za-oc" className="text-[#300FE6] hover:underline text-sm font-medium">
                Czytaj więcej →
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                GAP vs AC - różnice i korzyści
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                Poznaj różnice między ubezpieczeniem GAP a autocasco i dowiedz się, które jest lepsze w Twojej sytuacji.
              </p>
              <Link href="/blog" className="text-[#300FE6] hover:underline text-sm font-medium">
                Czytaj więcej →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostPage; 