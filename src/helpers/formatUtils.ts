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

// Definicje typów
interface Address {
  street: string;
  city: string;
  postCode: string;
  countryCode: string;
  addressLine1: string;
}

interface PersonalData {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  type: string;
  phoneNumber: string;
  email: string;
  emailAddress?: string;
  address: Address;
  companyName?: string;
  taxId?: string;
  isCompany?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  correspondenceAddressLine1?: string;
  correspondenceAddressLine2?: string;
  correspondenceCity?: string;
  correspondenceCountryCode?: string;
  correspondencePostalCode?: string;
  countryCode?: string;
  postalCode?: string;
}

interface InsuredData {
  inheritFrom?: string;
  personData?: PersonalData;
}

/**
 * Konwertuje dane formularza na format wymagany przez API
 */
export function convertToApiFormat(data: {
  policyHolder: PersonalData;
  insured: InsuredData;
  vehicleOwner: InsuredData;
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
function formatPersonDataForApi(personData: PersonalData) {
  return {
    addressLine1: personData.addressLine1 || personData.address?.addressLine1,
    addressLine2: personData.addressLine2 || null,
    city: personData.address?.city || '',
    companyName: personData.isCompany ? personData.companyName : null,
    correspondenceAddressLine1: personData.correspondenceAddressLine1 || personData.addressLine1 || personData.address?.addressLine1,
    correspondenceAddressLine2: personData.correspondenceAddressLine2 || personData.addressLine2 || null,
    correspondenceCity: personData.correspondenceCity || personData.address?.city || '',
    correspondenceCountryCode: personData.correspondenceCountryCode || 'POL',
    correspondencePostalCode: personData.correspondencePostalCode ? formatPostalCode(personData.correspondencePostalCode) : formatPostalCode(personData.postalCode || personData.address?.postCode || ''),
    countryCode: personData.countryCode || personData.address?.countryCode || 'POL',
    emailAddress: personData.emailAddress || personData.email,
    firstName: personData.isCompany ? null : personData.firstName,
    identificationNumber: personData.identificationNumber,
    isCompany: personData.isCompany || false,
    lastName: personData.isCompany ? null : personData.lastName,
    phoneNumber: formatPhoneNumber(personData.phoneNumber),
    postalCode: formatPostalCode(personData.postalCode || personData.address?.postCode || '')
  };
} 