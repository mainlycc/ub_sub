"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const KontaktPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    acceptTerms: false
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Imię i nazwisko jest wymagane';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Podaj prawidłowy adres email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Wiadomość jest wymagana';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Musisz zaakceptować politykę prywatności';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Usuwanie błędu podczas wypełniania pola
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormStatus('submitting');
    
    try {
      // Tutaj normalnie byłaby kod wysyłający dane do API
      // Symulacja opóźnienia sieciowego
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Symulacja sukcesu
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        acceptTerms: false
      });
    } catch (error) {
      console.error('Błąd podczas wysyłania formularza:', error);
      setFormStatus('error');
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 bg-[#E1EDFF] text-[#300FE6] rounded-full text-sm font-semibold mb-3">
            Kontakt
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Skontaktuj się z nami</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Masz pytania lub potrzebujesz pomocy? Skorzystaj z formularza kontaktowego lub odwiedź nas w siedzibie firmy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Formularz kontaktowy */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Formularz kontaktowy</h2>
            
            {formStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="mx-auto bg-[#E1EDFF] p-4 rounded-full mb-6 inline-flex">
                  <Send className="h-8 w-8 text-[#300FE6]" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Dziękujemy za kontakt!</h3>
                <p className="text-gray-600">
                  Twoja wiadomość została wysłana. Odpowiemy najszybciej jak to możliwe.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => setFormStatus('idle')}
                    className="py-2 px-4 bg-[#300FE6] hover:bg-[#2208B0] text-white rounded-md"
                  >
                    Wyślij nową wiadomość
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Imię i nazwisko
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent`}
                    placeholder="Jan Kowalski"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent`}
                    placeholder="jan.kowalski@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon (opcjonalnie)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent"
                    placeholder="+48 123 456 789"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Wiadomość
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#300FE6] focus:border-transparent`}
                    placeholder="W czym możemy Ci pomóc?"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>
                
                <div className="flex items-start">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-[#300FE6] focus:ring-[#300FE6] border-gray-300 rounded"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-600">
                    Akceptuję <a href="#" className="text-[#300FE6] underline">politykę prywatności</a> i wyrażam zgodę na przetwarzanie moich danych osobowych
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-500">{errors.acceptTerms}</p>
                )}
                
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-3 bg-gradient-to-r from-[#300FE6] to-[#2208B0] hover:from-[#4024E9] hover:to-[#300FE6] text-white text-lg font-medium rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {formStatus === 'submitting' ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                  </Button>
                </div>
                
                {formStatus === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-500 text-sm">
                      Wystąpił błąd podczas wysyłania wiadomości. Proszę spróbować ponownie później.
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>
          
          {/* Dane kontaktowe */}
          <div className="flex flex-col space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dane kontaktowe</h2>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="bg-[#E1EDFF] p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-[#300FE6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefon</h3>
                    <p className="text-gray-700">+48 796 148 577</p>
                    <p className="text-sm text-gray-500">Pon-Pt: 9:00 - 17:00</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#E1EDFF] p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-[#300FE6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-700">biuro@gapauto.pl</p>
                    <p className="text-sm text-gray-500">Odpowiadamy w ciągu 24h</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#E1EDFF] p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-[#300FE6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Adres</h3>
                    <p className="text-gray-700">Przyszłości 6</p>
                    <p className="text-gray-700">05-140 Skubianka</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#E1EDFF] p-3 rounded-full mr-4">
                    <Clock className="h-5 w-5 text-[#300FE6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Godziny otwarcia</h3>
                    <p className="text-gray-700">Poniedziałek - Piątek: 9:00 - 17:00</p>
                    <p className="text-gray-700">Sobota: 9:00 - 14:00</p>
                    <p className="text-gray-700">Niedziela: Zamknięte</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Obserwuj nas</h2>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/people/BC-Księgowość/61571088134057/"
                  className="bg-[#E1EDFF] p-3 rounded-full hover:bg-[#300FE6] hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-6 w-6 text-[#300FE6] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mapa */}
        <div className="mt-12 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <div className="rounded-lg overflow-hidden h-96 bg-[#E1EDFF]">
            {/* Tutaj normalnie byłaby prawdziwa mapa, np. z Google Maps */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-700">Tutaj będzie osadzona mapa Google</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KontaktPage; 