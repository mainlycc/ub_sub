// Konfiguracja kodu sprzedawcy zgodnie z dokumentacją GAP
export const SELLER_NODE_CODE = process.env.GAP_SELLER_NODE_CODE || "";

export const getSellerNodeCode = () => {
  return SELLER_NODE_CODE;
};

// Funkcja do walidacji kodu sprzedawcy
export const validateSellerNodeCode = (code: string) => {
  return code === SELLER_NODE_CODE;
}; 