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
                <a href="#" className="bg-[#E1EDFF] p-3 rounded-full hover:bg-[#300FE6] hover:text-white transition-colors">
                  <svg className="h-6 w-6 text-[#300FE6] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="bg-[#E1EDFF] p-3 rounded-full hover:bg-[#300FE6] hover:text-white transition-colors">
                  <svg className="h-6 w-6 text-[#300FE6] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="bg-[#E1EDFF] p-3 rounded-full hover:bg-[#300FE6] hover:text-white transition-colors">
                  <svg className="h-6 w-6 text-[#300FE6] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="bg-[#E1EDFF] p-3 rounded-full hover:bg-[#300FE6] hover:text-white transition-colors">
                  <svg className="h-6 w-6 text-[#300FE6] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
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