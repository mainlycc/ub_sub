"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { idefendApi } from "@/lib/idefend-api";

interface PolicyDetails {
  id: string;
  status: string;
  productName: string;
  vehicle: {
    make: string;
    model: string;
    registrationNumber: string;
  };
  client: {
    firstName: string;
    lastName: string;
    email: string;
  };
  premium: number;
  documents: Array<{
    type: string;
    url: string;
  }>;
}

export default function PolicyConfirmationPage() {
  const params = useParams();
  const [policyData, setPolicyData] = useState<PolicyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPolicyData = async () => {
      try {
        const data = await idefendApi.getPolicyDetails(params.id as string);
        const documents = await idefendApi.getPolicyDocuments(params.id as string);
        setPolicyData({ ...data, documents });
        setLoading(false);
      } catch (err) {
        setError("Nie udało się załadować danych polisy");
        setLoading(false);
      }
    };

    loadPolicyData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <div className="text-center">Ładowanie danych polisy...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">{error}</Alert>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">Nie znaleziono polisy</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Polisa została wystawiona</h1>
            <p className="text-gray-600">
              Numer polisy: {policyData.id}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Dane ubezpieczenia</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Produkt</p>
                  <p className="font-medium">{policyData.productName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Składka</p>
                  <p className="font-medium">{policyData.premium.toLocaleString('pl-PL')} PLN</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Dane pojazdu</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Pojazd</p>
                  <p className="font-medium">{policyData.vehicle.make} {policyData.vehicle.model}</p>
                </div>
                <div>
                  <p className="text-gray-600">Nr rejestracyjny</p>
                  <p className="font-medium">{policyData.vehicle.registrationNumber}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Dane ubezpieczającego</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Imię i nazwisko</p>
                  <p className="font-medium">{policyData.client.firstName} {policyData.client.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{policyData.client.email}</p>
                </div>
              </div>
            </div>

            {policyData.documents.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Dokumenty do pobrania:</h2>
                <div className="space-y-2">
                  {policyData.documents.map((doc, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      {doc.type}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => window.print()}>
              Drukuj
            </Button>
            <Button onClick={() => window.location.href = "/"}>
              Powrót do strony głównej
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 