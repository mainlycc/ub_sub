import { create } from 'zustand';

export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  label: string;
}

// Konfiguracja produkcyjna
const PRODUCTION_CONFIG: EnvironmentConfig = {
  baseUrl: 'https://v2.idefend.eu',
  apiUrl: 'https://v2.idefend.eu/api',
  label: 'Tryb produkcyjny'
};

// Zawsze zwraca konfigurację produkcyjną
export const getCurrentEnvironment = (): EnvironmentConfig => PRODUCTION_CONFIG; 