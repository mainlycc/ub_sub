"use client"

import React from 'react';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import InsuranceTypeCards from '@/components/InsuranceTypeCards';
import AboutUs from '@/components/AboutUs';
import FAQ from '@/components/FAQ';
import { useFormPersist, TEST_DATA } from '@/hooks/useFormPersist';
import { DevPanel } from '@/components/DevPanel';

const HomePage = (): React.ReactNode => {
  const [vehicleData, setVehicleData] = useFormPersist('vehicleData', TEST_DATA.vehicleData);
  const [personalData, setPersonalData] = useFormPersist('personalData', TEST_DATA.personalData);
  const [paymentData, setPaymentData] = useFormPersist('paymentData', TEST_DATA.paymentData);
  const [calculationResult, setCalculationResult] = useFormPersist('calculationResult', TEST_DATA.calculationResult);

  // Funkcja do czyszczenia danych testowych
  const clearTestData = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Funkcja do przywracania danych testowych
  const restoreTestData = () => {
    setVehicleData(TEST_DATA.vehicleData);
    setPersonalData(TEST_DATA.personalData);
    setPaymentData(TEST_DATA.paymentData);
    setCalculationResult(TEST_DATA.calculationResult);
  };

  return (
    <>
      <DevPanel 
        onClearData={clearTestData}
        onRestoreData={restoreTestData}
      />
      
      <main className="min-h-screen p-8">
        <InsuranceCalculator 
          initialVehicleData={vehicleData}
          initialPersonalData={personalData}
          initialPaymentData={paymentData}
          initialCalculationResult={calculationResult}
          onVehicleDataChange={setVehicleData}
          onPersonalDataChange={setPersonalData}
          onPaymentDataChange={setPaymentData}
          onCalculationResultChange={setCalculationResult}
        />
        
        <InsuranceTypeCards />
        <AboutUs />
        <FAQ />
      </main>
    </>
  );
};

export default HomePage;