import { getCurrentEnvironment } from './environment';

// Konfiguracja kodu sprzedawcy zgodnie z dokumentacją GAP
const SELLER_NODE_CODE = "PL_TEST_GAP_25";

export const getSellerNodeCode = () => {
  return SELLER_NODE_CODE;
};

// Funkcja do walidacji kodu sprzedawcy
export const validateSellerNodeCode = (code: string) => {
  return code === SELLER_NODE_CODE;
}; 