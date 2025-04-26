import { create } from 'zustand';

interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  label: string;
}

export const ENVIRONMENTS: Record<'TEST' | 'PRODUCTION', EnvironmentConfig> = {
  TEST: {
    baseUrl: 'https://test.v2.idefend.eu',
    apiUrl: 'https://test.v2.idefend.eu/api',
    label: 'Środowisko testowe'
  },
  PRODUCTION: {
    baseUrl: 'https://v2.idefend.eu',
    apiUrl: 'https://v2.idefend.eu/api',
    label: 'Środowisko produkcyjne'
  }
} as const;

interface EnvironmentStore {
  isProduction: boolean;
  setIsProduction: (value: boolean) => void;
}

export const useEnvironmentStore = create<EnvironmentStore>()((set) => ({
  isProduction: false,
  setIsProduction: (value: boolean) => set({ isProduction: value }),
}));

export const getCurrentEnvironment = () => {
  const isProduction = useEnvironmentStore.getState().isProduction;
  return isProduction ? ENVIRONMENTS.PRODUCTION : ENVIRONMENTS.TEST;
}; 