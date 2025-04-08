export interface ResultProduct {
  id: number;
  productCode: string;
  productGroupCode: string;
  productGroupAlias: string;
  productDerivativeAlias: string;
  inputSchemeItems: Array<{
    field: string;
    requiredForCalculation: boolean;
    requiredForConfirmation: boolean;
    minDate: string | null;
    maxDate: string | null;
    limitations?: Array<{
      code: string;
      onlyForCategories: string[] | null;
    }>;
    step: string;
  }>;
  optionTypes: Array<{
    code: string;
    name: string;
    options: Array<{
      code: string;
      name: string;
      sort: number;
    }>;
  }>;
  disabledOptionCombinations: Array<{
    optionCodes: string[];
  }>;
  vehicleCategories: Array<{
    code: string;
    name: string;
  }>;
}

export const portfolioData: ResultProduct[] = [
  {
    "id": 68473,
    "productCode": "5_DCGAP_MG25_GEN",
    "productGroupCode": "3_DCGAP",
    "productGroupAlias": "DEFEND Gap",
    "productDerivativeAlias": "MAX AC",
    "inputSchemeItems": [
      {
        "field": "vehicleSnapshot.category",
        "requiredForCalculation": true,
        "requiredForConfirmation": true,
        "minDate": null,
        "maxDate": null,
        "step": "vehicle"
      },
      {
        "field": "vehicleSnapshot.usage",
        "requiredForCalculation": true,
        "requiredForConfirmation": true,
        "minDate": null,
        "maxDate": null,
        "limitations": [
          {
            "code": "STANDARD",
            "onlyForCategories": null
          },
          {
            "code": "TAXI",
            "onlyForCategories": ["PC", "LCV"]
          },
          {
            "code": "TOWING",
            "onlyForCategories": ["LCV", "TR"]
          }
        ],
        "step": "vehicle"
      }
    ],
    "optionTypes": [
      {
        "code": "CLAIM_LIMIT",
        "name": "Limit odszkodowania",
        "options": [
          {
            "code": "CL_50000",
            "name": "50 000 zł",
            "sort": 120
          },
          {
            "code": "CL_100000",
            "name": "100 000 zł",
            "sort": 130
          },
          {
            "code": "CL_150000",
            "name": "150 000 zł",
            "sort": 140
          },
          {
            "code": "CL_200000",
            "name": "200 000 zł",
            "sort": 150
          },
          {
            "code": "CL_250000",
            "name": "250 000 zł",
            "sort": 160
          },
          {
            "code": "CL_300000",
            "name": "300 000 zł",
            "sort": 170
          }
        ]
      }
    ],
    "disabledOptionCombinations": [
      {
        "optionCodes": ["PT_A", "PM_BY_DLR"]
      },
      {
        "optionCodes": ["PT_LS", "PM_FST_DLR"]
      }
    ],
    "vehicleCategories": [
      {
        "code": "PC",
        "name": "Osobowy (kat. M1)"
      },
      {
        "code": "LCV",
        "name": "Ciężarowy - LCV (DMC do 3500 kg) kat. N1"
      },
      {
        "code": "BK",
        "name": "Motocykle i inne pojazdy (kat. L)"
      }
    ]
  },
  {
    "id": 68474,
    "productCode": "4_DTGAP_MG25_GEN",
    "productGroupCode": "3_DTGAP",
    "productGroupAlias": "DEFEND Truck Gap",
    "productDerivativeAlias": "T-MAX AC",
    "inputSchemeItems": [
      {
        "field": "vehicleSnapshot.category",
        "requiredForCalculation": true,
        "requiredForConfirmation": true,
        "minDate": null,
        "maxDate": null,
        "step": "vehicle"
      },
      {
        "field": "vehicleSnapshot.usage",
        "requiredForCalculation": true,
        "requiredForConfirmation": true,
        "minDate": null,
        "maxDate": null,
        "limitations": [
          {
            "code": "STANDARD",
            "onlyForCategories": null
          },
          {
            "code": "TOWING",
            "onlyForCategories": ["TR"]
          }
        ],
        "step": "vehicle"
      }
    ],
    "optionTypes": [
      {
        "code": "CLAIM_LIMIT",
        "name": "Limit odszkodowania",
        "options": [
          {
            "code": "CL_50000",
            "name": "50 000 zł",
            "sort": 120
          },
          {
            "code": "CL_100000",
            "name": "100 000 zł",
            "sort": 130
          },
          {
            "code": "CL_150000",
            "name": "150 000 zł",
            "sort": 140
          },
          {
            "code": "CL_200000",
            "name": "200 000 zł",
            "sort": 150
          }
        ]
      }
    ],
    "disabledOptionCombinations": [
      {
        "optionCodes": ["PT_A", "PM_BY_DLR"]
      },
      {
        "optionCodes": ["PT_LS", "PM_FST_DLR"]
      }
    ],
    "vehicleCategories": [
      {
        "code": "BUS",
        "name": "Autobus"
      },
      {
        "code": "TR",
        "name": "Ciężarowy (DMC powyżej 3500 kg)"
      },
      {
        "code": "AT",
        "name": "Traktor rolniczy"
      },
      {
        "code": "TRA",
        "name": "Przyczepa / Naczepa"
      }
    ]
  }
]; 