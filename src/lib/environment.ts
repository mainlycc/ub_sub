import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  label: string;
}

// Konfiguracja środowisk zgodnie z dokumentacją GAP
export const ENVIRONMENTS: Record<'TEST' | 'PRODUCTION', EnvironmentConfig> = {
  TEST: {
    baseUrl: 'https://test.v2.idefend.eu',
    apiUrl: 'https://test.v2.idefend.eu/api',
    label: 'Tryb testowy'
  },
  PRODUCTION: {
    baseUrl: 'https://v2.idefend.eu',
    apiUrl: 'https://v2.idefend.eu/api',
    label: 'Tryb rzeczywisty'
  }
} as const;

interface EnvironmentStore {
  isProduction: boolean;
  setIsProduction: (value: boolean) => void;
  initialized: boolean;
}

const isClient = typeof window !== 'undefined';

// Sprawdź początkowy stan z localStorage tylko po stronie klienta
const getInitialState = () => {
  if (!isClient) return true;
  
  try {
    const stored = window.localStorage.getItem('environment-storage');
    if (stored) {
      const { state } = JSON.parse(stored);
      console.log('Odczytany stan z localStorage:', state);
      return state.isProduction;
    }
  } catch (error) {
    console.error('Błąd odczytu stanu z localStorage:', error);
  }
  return true;
};

export const useEnvironmentStore = create<EnvironmentStore>()(
  persist(
    (set, get) => ({
      isProduction: getInitialState(),
      initialized: false,
      setIsProduction: (value: boolean) => {
        console.log('Próba zmiany środowiska na:', value ? 'PRODUKCYJNE' : 'TESTOWE');
        if (isClient) {
          window.localStorage.setItem('environment-storage', JSON.stringify({
            state: { isProduction: value, initialized: true }
          }));
        }
        set({ 
          isProduction: value,
          initialized: true
        });
        console.log('Zapisano nowy stan:', value ? 'PRODUKCYJNE' : 'TESTOWE');
      },
    }),
    {
      name: 'environment-storage',
      storage: isClient
        ? createJSONStorage(() => window.localStorage)
        : createJSONStorage(() => ({
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          })),
      skipHydration: true,
    }
  )
);

export const getCurrentEnvironment = () => {
  if (!isClient) {
    return ENVIRONMENTS.PRODUCTION;
  }
  
  const state = useEnvironmentStore.getState();
  const env = state.isProduction ? ENVIRONMENTS.PRODUCTION : ENVIRONMENTS.TEST;
  console.log('getCurrentEnvironment - stan:', {
    isProduction: state.isProduction,
    initialized: state.initialized,
    environment: env,
    isClient
  });
  return env;
}; 