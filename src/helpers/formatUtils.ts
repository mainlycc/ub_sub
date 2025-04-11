/**
 * Formatuje numer telefonu do wymaganego formatu
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';
  // Usuń wszystkie znaki niebędące cyframi
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  // Jeśli numer zaczyna się od +48 lub 48, usuń ten prefix
  return digitsOnly.replace(/^(\+48|48)/, '');
}

/**
 * Formatuje kod pocztowy do formatu XX-XXX
 */
export function formatPostalCode(postalCode: string): string {
  if (!postalCode) return '';
  // Usuń wszystkie znaki niebędące cyframi
  const digitsOnly = postalCode.replace(/\D/g, '');
  // Jeśli mamy dokładnie 5 cyfr, sformatuj jako XX-XXX
  if (digitsOnly.length === 5) {
    return `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2)}`;
  }
  return digitsOnly;
}

/**
 * Konwertuje dane formularza na format wymagany przez API
 */
export function convertToApiFormat(data: {
  policyHolder: any;
  insured: {
    inheritFrom?: string;
    personData?: any;
  };
  vehicleOwner: {
    inheritFrom?: string;
    personData?: any;
  };
}) {
  // Przygotowanie danych klienta
  const client = {
    policyHolder: {
      personData: formatPersonDataForApi(data.policyHolder)
    },
    insured: {
      inheritFrom: data.insured.inheritFrom,
      personData: data.insured.personData ? formatPersonDataForApi(data.insured.personData) : undefined
    },
    vehicleOwner: {
      inheritFrom: data.vehicleOwner.inheritFrom,
      personData: data.vehicleOwner.personData ? formatPersonDataForApi(data.vehicleOwner.personData) : undefined
    }
  };

  // Przygotowanie danych pojazdu
  // (w tym momencie dane pojazdu są przekazywane osobno w handleSubmit)
  const vehicleSnapshot = {}; 

  return {
    client,
    vehicleSnapshot
  };
}

/**
 * Formatuje dane osobowe na format wymagany przez API
 */
function formatPersonDataForApi(personData: any) {
  return {
    addressLine1: personData.addressLine1,
    addressLine2: personData.addressLine2 || null,
    city: personData.city,
    companyName: personData.isCompany ? personData.companyName : null,
    correspondenceAddressLine1: personData.correspondenceAddressLine1 || personData.addressLine1,
    correspondenceAddressLine2: personData.correspondenceAddressLine2 || personData.addressLine2 || null,
    correspondenceCity: personData.correspondenceCity || personData.city,
    correspondenceCountryCode: personData.correspondenceCountryCode || 'POL',
    correspondencePostalCode: personData.correspondencePostalCode ? formatPostalCode(personData.correspondencePostalCode) : formatPostalCode(personData.postalCode),
    countryCode: personData.countryCode || 'POL',
    emailAddress: personData.emailAddress,
    firstName: personData.isCompany ? null : personData.firstName,
    identificationNumber: personData.identificationNumber,
    isCompany: personData.isCompany || false,
    lastName: personData.isCompany ? null : personData.lastName,
    phoneNumber: formatPhoneNumber(personData.phoneNumber),
    postalCode: formatPostalCode(personData.postalCode)
  };
} 