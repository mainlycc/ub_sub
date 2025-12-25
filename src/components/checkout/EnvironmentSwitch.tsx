"use client";

import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { useEnvironmentStore, ENVIRONMENTS } from "@/lib/environment";
import { AlertCircle } from "lucide-react";

export const EnvironmentSwitch = () => {
  const { isProduction, setIsProduction } = useEnvironmentStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Sprawdź localStorage przy montowaniu
    try {
      const stored = window.localStorage.getItem('environment-storage');
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state.isProduction !== isProduction) {
          setIsProduction(state.isProduction);
        }
      }
    } catch (error) {
      // Błąd odczytu stanu - ignoruj w produkcji
      if (process.env.NODE_ENV === 'development') {
        console.error('EnvironmentSwitch - błąd odczytu stanu:', error);
      }
    }
    
    setIsMounted(true);
  }, [isProduction, setIsProduction]);

  const handleEnvironmentChange = async (checked: boolean) => {
    if (!checked) {
      if (window.confirm('UWAGA: Czy na pewno chcesz przełączyć na środowisko testowe?\n\n' +
        'Ta operacja spowoduje, że:\n' +
        '- Aplikacja będzie używać testowego API (https://test.v2.idefend.eu)\n' +
        '- Wszystkie operacje będą wykonywane na danych testowych\n' +
        '- Polisy będą rejestrowane w systemie testowym\n\n' +
        'Czy jesteś pewien?')) {
        setIsProduction(false);
        await new Promise(resolve => setTimeout(resolve, 100));
        window.location.reload();
      }
    } else {
      setIsProduction(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.reload();
    }
  };

  // Nie renderuj nic podczas SSR
  if (typeof window === 'undefined') {
    return null;
  }

  // Nie renderuj nic przed zamontowaniem
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted">
      <div className="flex items-center gap-2">
        <Switch
          checked={isProduction}
          onCheckedChange={handleEnvironmentChange}
        />
        <span className={`font-medium ${isProduction ? 'text-[#300FE6]' : 'text-yellow-600'}`}>
          {isProduction ? ENVIRONMENTS.PRODUCTION.label : ENVIRONMENTS.TEST.label}
        </span>
      </div>
      {!isProduction && (
        <div className="flex items-center gap-1 text-yellow-600">
          <AlertCircle size={16} />
          <span className="text-sm font-bold">Tryb testowy - wszystkie operacje są wykonywane w systemie testowym</span>
        </div>
      )}
    </div>
  );
}; 