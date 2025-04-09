"use client"

import React, { useEffect, useState } from 'react';

interface VehicleMake {
  id: number;
  name: string;
}

interface VehicleMakeSelectProps {
  selectedMakeId: string | null;
  onMakeSelect: (makeId: string) => void;
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
          throw new Error('Nie udało się pobrać listy marek');
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
          throw new Error('Nieprawidłowy format danych z API');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania marek:', error);
        setLoadError(error instanceof Error ? error.message : 'Nie udało się pobrać listy marek');
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
        <div className="text-red-500 text-sm p-2 border border-red-300 rounded-md bg-red-50">
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
        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white`}
        value={selectedMakeId || ''}
        onChange={(e) => {
          console.log('Wybrano markę:', e.target.value);
          onMakeSelect(e.target.value);
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
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}; 