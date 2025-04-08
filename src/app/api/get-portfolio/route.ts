import { NextResponse } from 'next/server';
import { Portfolio } from '@/types/portfolio';
import { ResultProduct, portfolioData } from '@/data/portfolio-data';

// Mapowanie danych z RESULT.txt na naszą strukturę Portfolio
function mapResultToPortfolio(result: ResultProduct[]): Portfolio {
  return {
    products: result.map(product => ({
      code: product.productCode,
      name: product.productDerivativeAlias,
      vehicleCategories: product.vehicleCategories.map(cat => ({
        code: cat.code,
        name: cat.name
      })),
      usageLimitations: product.inputSchemeItems
        .find(item => item.field === 'vehicleSnapshot.usage')
        ?.limitations?.map(limit => ({
          categoryCode: limit.onlyForCategories ? limit.onlyForCategories[0] : '*',
          usageCode: limit.code
        })) || [],
      optionTypes: product.optionTypes.map(type => ({
        code: type.code,
        name: type.name,
        options: type.options.map(opt => ({
          code: opt.code,
          name: opt.name,
          value: opt.code
        }))
      })),
      disabledOptionCombinations: product.disabledOptionCombinations.map(combo => {
        const [option1, option2] = combo.optionCodes;
        return {
          optionTypeCode: option1.split('_')[0] + '_TERM',
          optionCode: option1,
          disabledOptionTypeCode: option2.split('_')[0] + '_METHOD',
          disabledOptionCode: option2
        };
      }),
      inputScheme: product.inputSchemeItems
        .filter(item => item.field !== 'vehicleSnapshot.usage')
        .map(item => ({
          code: item.field.split('.').pop() || item.field,
          name: item.field,
          type: item.field.includes('Date') ? 'date' : 
                item.field.includes('price') || item.field.includes('mileage') ? 'number' : 'string',
          required: item.requiredForCalculation || item.requiredForConfirmation,
          validation: {
            min: undefined,
            max: undefined,
            pattern: undefined
          }
        }))
    }))
  };
}

export async function GET() {
  try {
    const portfolio = mapResultToPortfolio(portfolioData);
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error processing portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to process portfolio data' },
      { status: 500 }
    );
  }
} 