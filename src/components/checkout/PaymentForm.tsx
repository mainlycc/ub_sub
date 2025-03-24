"use client"

interface PaymentFormProps {
  data: PaymentData;
  onChange: (data: PaymentData) => void;
  errors?: { [key: string]: string };
}

interface PaymentData {
  term: string;
  claimLimit: string;
  paymentTerm: string;
  paymentMethod: string;
}

export const PaymentForm = ({ data, onChange, errors }: PaymentFormProps) => {
  // Implementacja formularza płatności
}; 