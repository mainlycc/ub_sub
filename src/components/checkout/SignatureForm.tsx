import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react';

interface SignatureFormProps {
  onSubmit: (code: string) => void;
  onBack: () => void;
  isSubmitting: boolean;
  error?: string;
}

export const SignatureForm: React.FC<SignatureFormProps> = ({
  onSubmit,
  onBack,
  isSubmitting,
  error
}) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Podpis elektroniczny</h2>
      <p className="text-gray-600">
        Na podany numer telefonu został wysłany kod SMS. Wprowadź go poniżej, aby podpisać polisę.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="smsCode">Kod SMS</Label>
          <Input
            id="smsCode"
            type="text"
            placeholder="Wprowadź kod z SMS"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="w-full"
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" /> Wstecz
          </Button>

          <Button
            type="submit"
            disabled={!code || isSubmitting}
            className="bg-[#300FE6] hover:bg-[#2208B0] text-white"
          >
            {isSubmitting ? 'Weryfikacja...' : 'Podpisz polisę'}
          </Button>
        </div>
      </form>
    </div>
  );
}; 