"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PhoneCall, Globe, X } from 'lucide-react';

const GapPurchasePage = () => {
  const router = useRouter();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredTime: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dane formularza kontaktowego:', contactData);
    // Tutaj normalnie byłoby wysłanie danych do API
    
    // Pokazujemy potwierdzenie
    setFormSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="py-12 bg-gradient-to-br from-white to-gray-50">
      {/* Formularz kontaktowy w modalu */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Formularz kontaktowy</h2>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto bg-[#E1EDFF] p-3 rounded-full mb-4 inline-flex">
                    <svg className="h-8 w-8 text-[#300FE6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Dziękujemy za kontakt!</h3>
                  <p className="text-gray-600 mb-6">
                    Nasz konsultant skontaktuje się z Tobą jak najszybciej w preferowanych godzinach.
                  </p>
                  <Button 
                    className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
                    onClick={() => {
                      setShowContactForm(false);
                      setFormSubmitted(false);
                    }}
                  >
                    Zamknij
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={contactData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numer telefonu *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={contactData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres e-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={contactData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferowane godziny kontaktu
                    </label>
                    <select
                      name="preferredTime"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={contactData.preferredTime}
                      onChange={handleInputChange}
                    >
                      <option value="">Wybierz godziny</option>
                      <option value="8-12">8:00 - 12:00</option>
                      <option value="12-16">12:00 - 16:00</option>
                      <option value="16-20">16:00 - 20:00</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dodatkowe informacje
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={contactData.message}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit"
                      className="w-full bg-[#300FE6] hover:bg-[#2208B0] text-white"
                    >
                      Wyślij
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wybierz sposób zakupu ubezpieczenia</h1>
          <p className="mt-2 text-lg text-gray-600">
            Możesz kupić ubezpieczenie GAP telefonicznie lub wypełnić formularz online
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Opcja telefoniczna */}
          <Card className="border-2 hover:border-[#300FE6] hover:shadow-lg transition-all duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto bg-[#E1EDFF] p-4 rounded-full mb-4">
                <PhoneCall className="h-12 w-12 text-[#300FE6]" />
              </div>
              <CardTitle className="text-2xl">Telefonicznie</CardTitle>
              <CardDescription>
                Porozmawiaj z naszym konsultantem, który pomoże Ci wybrać najlepszą ofertę
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#300FE6] mr-2">✓</span>
                  <span>Osobisty kontakt z doradcą</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#300FE6] mr-2">✓</span>
                  <span>Profesjonalne doradztwo i wybór odpowiedniego wariantu</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#300FE6] mr-2">✓</span>
                  <span>Brak konieczności wypełniania formularzy online</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#300FE6] mr-2">✓</span>
                  <span>Możliwość wyjaśnienia wszystkich wątpliwości</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full text-lg py-6 bg-[#300FE6] hover:bg-[#2208B0] text-white"
                onClick={() => setShowContactForm(true)}
              >
                Wypełnij formularz kontaktowy
              </Button>
            </CardFooter>
          </Card>

          {/* Opcja online */}
          <Card className="border-2 hover:border-[#300FE6] hover:shadow-lg transition-all duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto bg-[#E1EDFF] p-4 rounded-full mb-4">
                <Globe className="h-12 w-12 text-[#300FE6]" />
              </div>
              <CardTitle className="text-2xl">Online</CardTitle>
              <CardDescription>
                Wypełnij formularz i kup ubezpieczenie bez wychodzenia z domu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#300FE6] mr-2">✓</span>
                  <span>Szybki proces zakupu 24/7</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#300FE6] mr-2">✓</span>
                  <span>Wygodny formularz krok po kroku</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#300FE6] mr-2">✓</span>
                  <span>Natychmiastowe potwierdzenie zakupu</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#300FE6] mr-2">✓</span>
                  <span>Płatność online lub przelewem</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full text-lg py-6 bg-[#300FE6] hover:bg-[#2208B0] text-white"
                onClick={() => router.push('/checkout')}
              >
                Wypełnij formularz online
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className="border-gray-300 hover:border-[#300FE6] hover:text-[#300FE6]"
            onClick={() => router.back()}
          >
            Wróć do kalkulatora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GapPurchasePage; 