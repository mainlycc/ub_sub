import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Settings } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel Administratorski</h1>
        <p className="text-gray-600 mt-2">Witaj w panelu zarządzania aplikacją</p>
      </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Zarządzanie Blogiem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Twórz, edytuj i zarządzaj wpisami na blogu. Publikuj artykuły, zarządzaj statusami i datami publikacji.
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/blog">Przejdź do bloga</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Ustawienia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Zarządzaj ustawieniami aplikacji, konfiguracją i innymi parametrami systemu.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Wkrótce dostępne
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Statystyki</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Opublikowane wpisy</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-gray-600">Szkice</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Zaplanowane</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
