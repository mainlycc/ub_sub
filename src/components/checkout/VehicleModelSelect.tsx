"use client"

import React, { useEffect, useState } from 'react';
import { Car } from 'lucide-react';

interface VehicleModelSelectProps {
  selectedModelId: string | null;
  makeId: string | null;
  onModelSelect: (modelId: string) => void;
  error?: string;
}

interface VehicleModel {
  id: string;
  code: string;
  name: string;
  makeId: number;
}

export const VehicleModelSelect: React.FC<VehicleModelSelectProps> = ({
  selectedModelId,
  makeId,
  onModelSelect,
  error
}) => {
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      if (!makeId) {
        setModels([]);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const response = await fetch('/api/vehicles/models');
        
        if (!response.ok) {
          throw new Error('Nie udało się pobrać listy modeli');
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          const filteredModels = data
            .filter(model => model.makeId === parseInt(makeId))
            .filter(model => !model.groups || !model.groups.includes('GEX'));
          
          setModels(filteredModels.map(model => ({
            id: model.id.toString(),
            code: model.code || model.id.toString(),
            name: model.name,
            makeId: model.makeId
          })));
          console.log('Pobrano i przefiltrowano modele dla marki:', makeId, 'Liczba modeli:', filteredModels.length);
        } else {
          console.error('Nieprawidłowy format danych:', data);
          throw new Error('Nieprawidłowy format danych z API');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania modeli:', error);
        setLoadError(error instanceof Error ? error.message : 'Nie udało się pobrać listy modeli');
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [makeId]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <Car className="w-4 h-4" />
        Model pojazdu *
      </label>
      <select
        id="vehicleModel"
        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white ${
          isLoading ? 'animate-pulse bg-gray-50' : ''
        }`}
        value={selectedModelId || ''}
        onChange={(e) => {
          const selectedModel = models.find(m => m.id === e.target.value);
          if (selectedModel) {
            console.log('Wybrano model:', selectedModel.name, 'kod:', selectedModel.code);
            onModelSelect(selectedModel.code);
          }
        }}
        disabled={!makeId || isLoading}
      >
        <option value="">{isLoading ? 'Ładowanie...' : 'Wybierz model'}</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {loadError && (
        <p className="text-sm text-red-500">{loadError}</p>
      )}
    </div>
  );
}; 