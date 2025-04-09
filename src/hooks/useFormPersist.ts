"use client"

import { useState, useEffect } from 'react';

export const useFormPersist = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);

  // Wczytaj dane z localStorage przy pierwszym renderowaniu
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Błąd podczas wczytywania danych z localStorage dla klucza ${key}:`, error);
    }
  }, [key]);

  // Zapisz dane do localStorage przy każdej zmianie
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Błąd podczas zapisywania danych do localStorage dla klucza ${key}:`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
};

// Przykładowe dane testowe
export const TEST_DATA = {
  vehicleData: {
    purchasedOn: "2024-02-24",
    modelCode: "342",
    categoryCode: "PC",
    usageCode: "STANDARD",
    mileage: 1000,
    firstRegisteredOn: "2021-05-01",
    evaluationDate: "2025-02-24",
    purchasePrice: 150000,
    purchasePriceNet: 150000,
    purchasePriceVatReclaimableCode: "NO",
    usageTypeCode: "INDIVIDUAL",
    purchasePriceInputType: "VAT_INAPPLICABLE",
    vin: "12345678901234567",
    vrm: "LU483SF",
    make: "Toyota",
    model: "Corolla"
  },
  personalData: {
    type: "person",
    phoneNumber: "+48327971041",
    firstName: "Tomasz",
    lastName: "Testowy",
    email: "tomasz@test.com",
    identificationNumber: "94052009094",
    address: {
      addressLine1: "Tomasz Testowy",
      street: "al. Niepodległości 213",
      city: "Warszawa",
      postCode: "02-086",
      countryCode: "PL"
    }
  },
  paymentData: {
    term: "T_36",
    claimLimit: "CL_150000",
    paymentTerm: "PT_LS",
    paymentMethod: "PM_PBC"
  },
  calculationResult: {
    premium: 1890,
    details: {
      productName: "GAP MAX AC",
      coveragePeriod: "36 miesięcy",
      vehicleValue: 150000,
      maxCoverage: "150 000 PLN"
    }
  }
}; 