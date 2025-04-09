"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { TEST_DATA } from '@/hooks/useFormPersist';

interface DevPanelProps {
  onClearData: () => void;
  onRestoreData: () => void;
}

export const DevPanel = ({ onClearData, onRestoreData }: DevPanelProps) => {
  return (
    <div className="fixed bottom-4 right-4 space-x-2 bg-gray-800 p-4 rounded-lg shadow-lg z-[9999]" style={{ position: 'fixed', zIndex: 9999 }}>
      <div className="flex gap-2">
        <Button
          onClick={onClearData}
          variant="destructive"
          size="sm"
          className="hover:bg-red-600 whitespace-nowrap"
        >
          🗑️ Wyczyść dane
        </Button>
        <Button
          onClick={onRestoreData}
          variant="outline"
          size="sm"
          className="bg-white hover:bg-gray-100 whitespace-nowrap"
        >
          📝 Wczytaj dane testowe
        </Button>
      </div>
    </div>
  );
}; 