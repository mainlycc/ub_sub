'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Download, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Definicja typu dokumentu (powinna pasować do definicji w API route)
interface PolicyDocument {
  code: string;
  name: string;
  url: string;
  mimeType: string;
  createdAt: string;
}

const CheckoutSuccessPage = () => {
  const searchParams = useSearchParams();
  const policyId = searchParams.get('policyId');

  // Stany do obsługi dokumentów
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!policyId) {
      setError('Brak ID polisy w adresie URL.');
      setIsLoading(false);
      return;
    }

    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/get-policy-documents?policyId=${policyId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Nie udało się pobrać dokumentów.');
        }

        setDocuments(data.documents || []);
      } catch (err: any) { // Poprawiono typ błędu
        console.error("Błąd podczas pobierania dokumentów:", err);
        setError(err.message || 'Wystąpił nieoczekiwany błąd.');
        setDocuments([]); // Wyczyść dokumenty w razie błędu
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [policyId]); // Wywołaj efekt, gdy policyId się zmieni (lub raz po załadowaniu)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Polisa została pomyślnie utworzona!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Twoje ubezpieczenie GAP jest gotowe.
        </p>
        {policyId ? (
          <div className="bg-gray-100 p-4 rounded-lg mb-8 inline-block">
            <p className="text-sm text-gray-500">Numer Twojej polisy:</p>
            <p className="text-xl font-bold text-gray-800">{policyId}</p>
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded-lg mb-8 inline-block">
            <p className="text-yellow-700">Nie udało się pobrać numeru polisy.</p>
          </div>
        )}

        {/* Sekcja pobierania dokumentów */}
        <div className="mb-8 border-t pt-8 mt-8">
          <h2 className="text-xl font-semibold mb-4">Dokumenty polisy</h2>
          {isLoading ? (
            <div className="flex items-center justify-center text-gray-500">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Pobieranie dokumentów...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="h-5 w-5 mr-2" />
              Błąd: {error}
            </div>
          ) : documents.length > 0 ? (
            <ul className="space-y-3 text-left max-w-md mx-auto">
              {documents.map((doc) => (
                <li key={doc.code || doc.url} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
                  <span className="text-gray-700 font-medium truncate mr-4">{doc.name}</span>
                  <a
                    href={doc.url} // Link bezpośrednio do URL z API
                    target="_blank" // Otwórz w nowej karcie
                    rel="noopener noreferrer"
                    download // Sugeruje przeglądarce pobranie pliku (może nie zawsze działać zależnie od serwera)
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors whitespace-nowrap"
                  >
                    <Download size={16} className="mr-1.5" />
                    Pobierz
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nie znaleziono dostępnych dokumentów do pobrania.</p>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Wiadomość e-mail z potwierdzeniem i dokumentami została (lub wkrótce zostanie) wysłana na Twój adres e-mail.
        </p>

        <Link href="/">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
            Wróć na stronę główną
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage; 