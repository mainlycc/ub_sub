"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { idefendApi } from "@/lib/idefend-api";

type SmsSignatureProps = {
  phoneNumber: string;
  policyId: string;
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
};

export function SmsSignature({
  phoneNumber,
  policyId,
  onVerify,
  onCancel,
}: SmsSignatureProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async () => {
    if (!code) {
      setError("Wprowadź kod SMS");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onVerify(code);
    } catch (err) {
      setError("Nieprawidłowy kod SMS");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      setError(null);
      await idefendApi.resendSmsCode(policyId);
      setResendDisabled(true);
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError("Nie udało się wysłać kodu SMS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Podpis SMS</h3>
          <p className="text-sm text-gray-500">
            Kod weryfikacyjny został wysłany na numer {phoneNumber}
          </p>
        </div>

        {error && <Alert variant="destructive">{error}</Alert>}

        <div className="space-y-2">
          <Label htmlFor="sms-code">Kod z SMS</Label>
          <Input
            id="sms-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Wprowadź kod z SMS"
            maxLength={6}
          />
        </div>

        <div className="flex flex-col space-y-4">
          <Button
            variant="outline"
            onClick={handleResendCode}
            disabled={loading || resendDisabled}
          >
            {resendDisabled
              ? `Wyślij ponownie (${countdown}s)`
              : "Wyślij kod ponownie"}
          </Button>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Anuluj
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              Potwierdź
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 