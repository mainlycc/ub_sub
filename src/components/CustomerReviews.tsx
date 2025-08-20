"use client"

import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  insuranceType: string;
}

const CustomerReviews: React.FC = () => {
  const reviews: Review[] = [
    {
      id: 1,
      name: "Marek Kowalski",
      rating: 5,
      comment: "Świetna obsługa! Business Care pomógł mi znaleźć najlepsze OC za połowę ceny niż u poprzedniego ubezpieczyciela. Polecam każdemu kierowcy!",
      date: "15.01.2025",
      insuranceType: "OC + AC"
    },
    {
      id: 2,
      name: "Anna Nowak",
      rating: 5,
      comment: "Profesjonalne podejście i szybka pomoc w doborze ubezpieczenia. Dzięki Business Care mam kompleksową ochronę samochodu w atrakcyjnej cenie.",
      date: "08.01.2025",
      insuranceType: "OC + AC + GAP"
    },
    {
      id: 3,
      name: "Piotr Wiśniewski",
      rating: 5,
      comment: "Po wypadku samochodowym Business Care załatwił wszystko za mnie. Szybka wypłata odszkodowania i pomoc w naprawie. Polecam!",
      date: "22.12.2024",
      insuranceType: "OC + AC + Assistance"
    },
    {
      id: 4,
      name: "Katarzyna Zielińska",
      rating: 4,
      comment: "Business Care znalazł dla mnie ubezpieczenie w rozsądnej cenie. Obsługa klienta na najwyższym poziomie.",
      date: "05.12.2024",
      insuranceType: "OC"
    },
    {
      id: 5,
      name: "Tomasz Dąbrowski",
      rating: 5,
      comment: "Kupiłem ubezpieczenie GAP i jestem bardzo zadowolony. Business Care wyjaśnił wszystkie szczegóły i pomógł w wyborze najlepszej opcji.",
      date: "18.11.2024",
      insuranceType: "OC + GAP"
    },
    {
      id: 6,
      name: "Magdalena Lewandowska",
      rating: 4,
      comment: "Szybka kalkulacja online, przejrzyste warunki i konkurencyjne ceny. Business Care to mój wybór numer jeden dla ubezpieczeń samochodowych.",
      date: "12.11.2024",
      insuranceType: "OC + AC + NNW"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="customer-reviews" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek sekcji */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Co mówią o nas klienci?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sprawdź opinie naszych zadowolonych klientów o ubezpieczeniach samochodowych Business Care
          </p>
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#300FE6] mb-2">98%</div>
            <div className="text-gray-600">Zadowolonych klientów</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#300FE6] mb-2">15+</div>
            <div className="text-gray-600">Lat doświadczenia</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#300FE6] mb-2">50k+</div>
            <div className="text-gray-600">Ubezpieczonych pojazdów</div>
          </div>
        </div>

        {/* Opinie klientów */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Ocena gwiazdkowa */}
              <div className="flex items-center mb-4">
                {renderStars(review.rating)}
                <span className="ml-2 text-sm text-gray-500">
                  {review.rating}/5
                </span>
              </div>

              {/* Komentarz */}
              <blockquote className="text-gray-700 mb-4 italic">
                "{review.comment}"
              </blockquote>

              {/* Informacje o kliencie */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {review.name}
                  </div>
                  <div className="text-sm text-[#300FE6] font-medium">
                    {review.insuranceType}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {review.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#300FE6] to-[#2208B0] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Dołącz do grona zadowolonych klientów!
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Sprawdź naszą ofertę ubezpieczeń samochodowych i przekonaj się, 
              dlaczego tysiące kierowców wybiera Business Care
            </p>
            <button className="bg-white text-[#300FE6] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Sprawdź ofertę
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
