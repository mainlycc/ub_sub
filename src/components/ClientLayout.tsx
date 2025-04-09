"use client"

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DevPanel } from '@/components/DevPanel';
import { TEST_DATA } from '@/hooks/useFormPersist';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const clearTestData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const restoreTestData = () => {
    localStorage.setItem('vehicleData', JSON.stringify(TEST_DATA.vehicleData));
    localStorage.setItem('personalData', JSON.stringify(TEST_DATA.personalData));
    localStorage.setItem('paymentData', JSON.stringify(TEST_DATA.paymentData));
    localStorage.setItem('calculationResult', JSON.stringify(TEST_DATA.calculationResult));
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <DevPanel
        onClearData={clearTestData}
        onRestoreData={restoreTestData}
      />
    </div>
  );
} 