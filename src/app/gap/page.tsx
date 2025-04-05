"use client"

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
import { PhoneCall, Globe } from 'lucide-react';

const GapPurchasePage = () => {
  const router = useRouter();

  return (
    <div className="py-12 bg-gradient-to-br from-white to-gray-50">
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
                onClick={() => router.push('/kontakt')}
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
                onClick={() => router.push('/new-policy')}
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