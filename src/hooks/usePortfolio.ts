import { useState, useEffect } from 'react';
import { Portfolio, Product, OptionType, Option } from '../types/portfolio';

interface UsePortfolioReturn {
  portfolio: Portfolio | null;
  loading: boolean;
  error: Error | null;
  getProduct: (productCode: string) => Product | undefined;
  getAvailableOptions: (productCode: string, optionTypeCode: string) => Option[];
  isOptionCombinationDisabled: (
    productCode: string,
    optionTypeCode: string,
    optionCode: string,
    selectedOptions: Record<string, string>
  ) => boolean;
  getAvailableUsageTypes: (productCode: string, categoryCode: string) => string[];
  getRequiredFields: (productCode: string) => string[];
}

export function usePortfolio(): UsePortfolioReturn {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/get-portfolio');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio');
        }
        const data = await response.json();
        setPortfolio(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const getProduct = (productCode: string): Product | undefined => {
    return portfolio?.products.find((p) => p.code === productCode);
  };

  const getAvailableOptions = (productCode: string, optionTypeCode: string): Option[] => {
    const product = getProduct(productCode);
    return product?.optionTypes.find((ot) => ot.code === optionTypeCode)?.options || [];
  };

  const isOptionCombinationDisabled = (
    productCode: string,
    optionTypeCode: string,
    optionCode: string,
    selectedOptions: Record<string, string>
  ): boolean => {
    const product = getProduct(productCode);
    if (!product) return false;

    return product.disabledOptionCombinations.some(
      (combo) =>
        (combo.optionTypeCode === optionTypeCode &&
          combo.optionCode === optionCode &&
          selectedOptions[combo.disabledOptionTypeCode] === combo.disabledOptionCode) ||
        (combo.disabledOptionTypeCode === optionTypeCode &&
          combo.disabledOptionCode === optionCode &&
          selectedOptions[combo.optionTypeCode] === combo.optionCode)
    );
  };

  const getAvailableUsageTypes = (productCode: string, categoryCode: string): string[] => {
    const product = getProduct(productCode);
    if (!product) return [];

    return product.usageLimitations
      .filter((limit) => limit.categoryCode === categoryCode)
      .map((limit) => limit.usageCode);
  };

  const getRequiredFields = (productCode: string): string[] => {
    const product = getProduct(productCode);
    if (!product) return [];

    return product.inputScheme
      .filter((item) => item.required)
      .map((item) => item.code);
  };

  return {
    portfolio,
    loading,
    error,
    getProduct,
    getAvailableOptions,
    isOptionCombinationDisabled,
    getAvailableUsageTypes,
    getRequiredFields,
  };
} 