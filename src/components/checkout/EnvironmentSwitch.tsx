"use client";

import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { useEnvironmentStore, ENVIRONMENTS } from "@/lib/environment";
import { AlertCircle } from "lucide-react";

export const EnvironmentSwitch = () => {
  const { isProduction, setIsProduction } = useEnvironmentStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEnvironmentChange = (checked: boolean) => {
    if (checked) {
      if (window.confirm('UWAGA: Czy na pewno chcesz przełączyć na środowisko produkcyjne? Ta operacja może mieć wpływ na rzeczywiste dane.')) {
        setIsProduction(true);
      }
    } else {
      setIsProduction(false);
    }
  };

  if (!isMounted) {
    return null; // lub możesz zwrócić skeleton/placeholder
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted">
      <div className="flex items-center gap-2">
        <Switch
          checked={isProduction}
          onCheckedChange={handleEnvironmentChange}
        />
        <span className={`font-medium ${isProduction ? 'text-red-600' : 'text-green-600'}`}>
          {isProduction ? ENVIRONMENTS.PRODUCTION.label : ENVIRONMENTS.TEST.label}
        </span>
      </div>
      {isProduction && (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle size={16} />
          <span className="text-sm">Środowisko produkcyjne</span>
        </div>
      )}
    </div>
  );
}; 