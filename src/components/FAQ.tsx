"use client"

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type FAQItemProps = {
  question: string;
  answer: string;
  accentColor: string;
  hoverColor: string;
  bgColor: string;
};

const FAQItem = ({ question, answer, accentColor, hoverColor, bgColor }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border-b border-gray-200 last:border-b-0 ${isOpen ? bgColor : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between items-center w-full py-5 px-4 text-left focus:outline-none hover:${hoverColor}`}
      >
        <h3 className={`text-lg font-medium ${isOpen ? accentColor : 'text-gray-900'}`}>{question}</h3>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className={`h-5 w-5 ${accentColor}`} />
          ) : (
            <ChevronDown className={`h-5 w-5 ${accentColor}`} />
          )}
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-5 px-4' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

type FAQCategoryProps = {
  title: string;
  items: Omit<FAQItemProps, 'accentColor' | 'hoverColor' | 'bgColor'>[];
  accentColor: string;
  borderColor: string;
  hoverColor: string;
  bgColor: string;
  iconBgColor: string;
};

const FAQCategory = ({ title, items, accentColor, borderColor, hoverColor, bgColor, iconBgColor }: FAQCategoryProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className={`${iconBgColor} p-2 rounded-full mr-3`}>
          <svg className={`h-5 w-5 ${accentColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        </div>
        <h2 className={`text-xl font-bold ${accentColor}`}>{title}</h2>
      </div>
      <div className={`bg-white rounded-xl shadow-lg border ${borderColor} overflow-hidden`}>
        {items.map((item, index) => (
          <FAQItem 
            key={index} 
            question={item.question} 
            answer={item.answer}
            accentColor={accentColor}
            hoverColor={hoverColor}
            bgColor={bgColor}
          />
        ))}
      </div>
    </div>
  );
};

const FAQ = () => {
  // Dane FAQ
  const faqData = [
    {
      title: "Ubezpieczenia GAP",
      items: [
        {
          question: "Co to jest ubezpieczenie GAP?",
          answer: "Ubezpieczenie GAP (Guaranteed Asset Protection) to dodatkowa ochrona finansowa, która pokrywa różnicę między kwotą odszkodowania z polisy AC a początkową wartością pojazdu lub kwotą pozostałą do spłaty leasingu/kredytu w przypadku całkowitego zniszczenia lub kradzieży pojazdu."
        },
        {
          question: "Jakie są rodzaje ubezpieczeń GAP?",
          answer: "Oferujemy dwa główne rodzaje ubezpieczeń GAP: GAP Fakturowy (pokrywa różnicę między wartością fakturową a odszkodowaniem z AC) oraz GAP MAX (pokrywa różnicę między wartością rynkową z dnia zakupu a odszkodowaniem z AC). Oba rodzaje zapewniają ochronę przed utratą wartości pojazdu."
        },
        {
          question: "Czy ubezpieczenie GAP jest obowiązkowe?",
          answer: "Nie, ubezpieczenie GAP nie jest obowiązkowe. Jest to dodatkowe, dobrowolne ubezpieczenie, które zapewnia ochronę finansową w sytuacji szkody całkowitej lub kradzieży pojazdu. Jest jednak szczególnie zalecane przy zakupie nowego samochodu lub finansowaniu samochodu kredytem/leasingiem."
        },
        {
          question: "Na jaki okres mogę zawrzeć ubezpieczenie GAP?",
          answer: "Ubezpieczenie GAP można zawrzeć na okres od 12 do 60 miesięcy, w zależności od indywidualnych potrzeb i planowanego okresu użytkowania pojazdu. Im dłuższy okres ubezpieczenia, tym dłuższa ochrona przed utratą wartości pojazdu."
        }
      ],
      accentColor: "text-[#300FE6]",
      borderColor: "border-[#E1EDFF]",
      hoverColor: "bg-[#E1EDFF]/20",
      bgColor: "bg-[#E1EDFF]/10",
      iconBgColor: "bg-[#E1EDFF]"
    },
    {
      title: "Składki i płatności",
      items: [
        {
          question: "Jak obliczana jest składka ubezpieczenia GAP?",
          answer: "Składka ubezpieczenia GAP jest obliczana na podstawie kilku czynników, w tym wartości pojazdu, jego wieku, okresu ubezpieczenia oraz wybranego limitu odpowiedzialności. Możesz użyć naszego kalkulatora na stronie, aby otrzymać szybką wycenę."
        },
        {
          question: "Czy składkę można rozłożyć na raty?",
          answer: "Tak, oferujemy możliwość płatności składki w ratach miesięcznych, kwartalnych lub półrocznych, aby dostosować się do Twoich możliwości finansowych. W przypadku wyboru płatności ratalnej, może zostać naliczona dodatkowa opłata administracyjna."
        },
        {
          question: "Jakie metody płatności akceptujecie?",
          answer: "Akceptujemy płatności kartą kredytową/debetową, przelewem bankowym oraz za pośrednictwem popularnych systemów płatności elektronicznych. Wszystkie transakcje są bezpieczne i szyfrowane."
        }
      ],
      accentColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      hoverColor: "bg-emerald-50",
      bgColor: "bg-emerald-50/30",
      iconBgColor: "bg-emerald-100"
    },
    {
      title: "Odszkodowania i roszczenia",
      items: [
        {
          question: "Jak zgłosić szkodę z ubezpieczenia GAP?",
          answer: "Aby zgłosić szkodę, należy skontaktować się z naszym działem obsługi klienta telefonicznie lub przez formularz na stronie internetowej. Następnie należy dostarczyć dokumentację dotyczącą szkody, w tym decyzję o wypłacie odszkodowania z ubezpieczenia AC/OC."
        },
        {
          question: "Jaki jest maksymalny limit odszkodowania?",
          answer: "Standardowy limit odszkodowania wynosi 100 000 PLN, ale oferujemy również podwyższony limit do 150 000 PLN. Limit jest określony w polisie ubezpieczeniowej i stanowi maksymalną kwotę, jaką wypłacimy w ramach odszkodowania GAP."
        },
        {
          question: "Jak szybko otrzymam odszkodowanie?",
          answer: "Po skompletowaniu całej dokumentacji i zatwierdzeniu roszczenia, odszkodowanie jest wypłacane w ciągu 14 dni roboczych. Dokładamy wszelkich starań, aby proces wypłaty odszkodowania był jak najbardziej sprawny i przejrzysty."
        }
      ],
      accentColor: "text-rose-600",
      borderColor: "border-rose-100",
      hoverColor: "bg-rose-50",
      bgColor: "bg-rose-50/30",
      iconBgColor: "bg-rose-100"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white to-[#E1EDFF]/20" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 bg-[#E1EDFF] text-[#300FE6] rounded-full text-sm font-semibold mb-3">
            FAQ
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Pytania i odpowiedzi</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące ubezpieczeń GAP
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {faqData.map((category, index) => (
            <FAQCategory
              key={index}
              title={category.title}
              items={category.items}
              accentColor={category.accentColor}
              borderColor={category.borderColor}
              hoverColor={category.hoverColor}
              bgColor={category.bgColor}
              iconBgColor={category.iconBgColor}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Nie znalazłeś odpowiedzi na swoje pytanie?</p>
          <div className="inline-block p-0.5 bg-gradient-to-r from-[#300FE6] to-[#2208B0] rounded-lg">
            <a 
              href="/kontakt" 
              className="block py-3 px-8 bg-white hover:bg-[#E1EDFF] text-[#300FE6] font-medium rounded-lg transition-colors duration-300"
            >
              Skontaktuj się z nami
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 