"use client"

import React, { useEffect, useState } from 'react';
import { humanizeRawApiError } from '@/lib/user-facing-errors';

interface VehicleMake {
  id: number;
  name: string;
}

interface VehicleMakeSelectProps {
  selectedMakeId: string | null;
  onMakeSelect: (makeId: string, makeName: string) => void;
  error?: string;
}

export const VehicleMakeSelect: React.FC<VehicleMakeSelectProps> = ({
  selectedMakeId,
  onMakeSelect,
  error
}) => {
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        const response = await fetch('/api/vehicles/makes');
        
        if (!response.ok) {
          throw new Error('Nie udało się wczytać listy marek. Odśwież stronę lub spróbuj ponownie za chwilę.');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setMakes(data.map(make => ({
            id: make.id,
            name: make.name
          })));
          console.log('Pobrano marki:', data.length);
        } else {
          console.error('Nieprawidłowy format danych:', data);
          throw new Error('Lista marek jest chwilowo niedostępna. Spróbuj ponownie za chwilę.');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania marek:', error);
        setLoadError(
          humanizeRawApiError(
            error instanceof Error
              ? error.message
              : 'Nie udało się wczytać marek pojazdów. Odśwież stronę.'
          )
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMakes();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Marka pojazdu *
        </label>
        <div className="text-sm p-2 border border-amber-200 rounded-md bg-amber-50 text-amber-900">
          {loadError}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Marka pojazdu *
      </label>
      <select
        className={`w-full p-2 border ${error ? 'border-amber-500' : 'border-gray-300'} rounded-md bg-white`}
        value={selectedMakeId || ''}
        onChange={(e) => {
          const makeId = e.target.value;
          const selectedMake = makes.find(m => String(m.id) === makeId);
          console.log('Wybrano markę:', makeId, selectedMake?.name);
          onMakeSelect(makeId, selectedMake?.name || '');
        }}
      >
        <option value="">Wybierz markę</option>
        {makes.map((make) => (
          <option key={make.id} value={make.id}>
            {make.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-amber-800">{error}</p>
      )}
    </div>
  );
}; 