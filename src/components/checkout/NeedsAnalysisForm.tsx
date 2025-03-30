import React from 'react';
import { Button } from "@/components/ui/button";

interface NeedsAnalysisData {
  isInterestedInGapInsurance: boolean;
  hasValidAcPolicy: boolean;
  isVehiclePrivileged: boolean;
  isVehicleLeased: boolean;
  isVehicleFinanced: boolean;
  isVehicleUsedCommercially: boolean;
}

interface NeedsAnalysisFormProps {
  data: NeedsAnalysisData;
  onChange: (data: NeedsAnalysisData) => void;
  errors?: { [key: string]: string };
}

const QUESTIONS = [
  {
    key: 'isInterestedInGapInsurance',
    question: 'Czy chcesz zabezpieczyć się przed utratą wartości pojazdu?',
    description: 'W przypadku szkody całkowitej lub kradzieży, standardowe ubezpieczenie AC wypłaca odszkodowanie według wartości rynkowej pojazdu, która jest znacznie niższa od ceny zakupu. Ubezpieczenie GAP pokrywa tę różnicę.',
    required: true
  },
  {
    key: 'hasValidAcPolicy',
    question: 'Czy posiadasz ważne ubezpieczenie AC pojazdu?',
    description: 'Ubezpieczenie GAP działa w połączeniu z polisą AC. Wymagane jest posiadanie ważnej polisy AC przez cały okres ubezpieczenia GAP.',
    required: true
  },
  {
    key: 'isVehiclePrivileged',
    question: 'Czy Twój pojazd jest pojazdem uprzywilejowanym?',
    description: 'Dotyczy pojazdów takich jak: karetki, radiowozy, wozy strażackie itp. Dla takich pojazdów możemy zaproponować specjalne warunki ubezpieczenia.',
    required: true
  },
  {
    key: 'isVehicleLeased',
    question: 'Czy pojazd jest w leasingu?',
    description: 'W przypadku leasingu, ubezpieczenie GAP może być szczególnie istotne ze względu na zobowiązania finansowe wobec leasingodawcy.',
    required: true
  },
  {
    key: 'isVehicleFinanced',
    question: 'Czy pojazd jest finansowany kredytem?',
    description: 'Przy finansowaniu kredytem, ubezpieczenie GAP zabezpiecza przed sytuacją, gdy wartość odszkodowania z AC jest niższa niż pozostała do spłaty kwota kredytu.',
    required: true
  },
  {
    key: 'isVehicleUsedCommercially',
    question: 'Czy pojazd jest lub będzie używany do celów zarobkowych?',
    description: 'Dotyczy wykorzystania pojazdu w działalności gospodarczej, np. jako taksówka, w firmie kurierskiej, lub do innych celów komercyjnych.',
    required: true
  }
] as const;

export const NeedsAnalysisForm = ({ data, onChange, errors }: NeedsAnalysisFormProps) => {
  const handleChange = (key: keyof NeedsAnalysisData, value: boolean) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Analiza potrzeb</h2>
        <p className="text-gray-600">
          Odpowiedz na poniższe pytania, aby pomóc nam dobrać najlepszy wariant ubezpieczenia GAP dla Ciebie.
          Twoje odpowiedzi pozwolą nam lepiej zrozumieć Twoje potrzeby i zaproponować optymalne rozwiązanie.
        </p>
      </div>
      
      <div className="space-y-8">
        {QUESTIONS.map((q) => (
          <div key={q.key} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{q.question}</h3>
              <p className="text-sm text-gray-500 mt-1">{q.description}</p>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant={data[q.key] === true ? "default" : "outline"}
                className={`w-24 ${data[q.key] === true ? 'bg-[#300FE6] text-white' : ''}`}
                onClick={() => handleChange(q.key, true)}
              >
                Tak
              </Button>
              <Button
                type="button"
                variant={data[q.key] === false ? "default" : "outline"}
                className={`w-24 ${data[q.key] === false ? 'bg-[#300FE6] text-white' : ''}`}
                onClick={() => handleChange(q.key, false)}
              >
                Nie
              </Button>
            </div>

            {errors?.[q.key] && (
              <p className="text-sm text-red-600">{errors[q.key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 