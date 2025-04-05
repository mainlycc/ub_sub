import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { z } from 'zod';

// Helper function to format date as YYYY-MM-DD
function formatDateForAPI(dateInput: string | Date | undefined): string {
  let date: Date;
  try {
      if (!dateInput) throw new Error("Date is undefined");
      date = new Date(dateInput);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
  } catch (e) {
      console.warn("Invalid or missing date provided to formatDateForAPI, using current date:", dateInput, e);
      date = new Date(); // Użyj aktualnej daty jako fallback
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to format date as ISO string YYYY-MM-DDTHH:mm:ss+Offset
function formatIsoDateTimeForAPI(dateInput: string | Date | undefined): string {
    let date: Date;
    try {
        if (!dateInput) throw new Error("Date is undefined");
        date = new Date(dateInput);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
    } catch (e) {
        console.warn("Invalid or missing date provided to formatIsoDateTimeForAPI, using current date:", dateInput, e);
        date = new Date(); // Użyj aktualnej daty jako fallback
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // Używamy godziny 00:00:00 i offsetu +02:00 jak w przykładzie API
    // UWAGA: Offset może wymagać dostosowania w zależności od strefy czasowej serwera/klienta
    return `${year}-${month}-${day}T00:00:00+02:00`;
}

// --- DEFINICJE SCHEMATÓW ZOD ---
const AddressSchema = z.object({
  street: z.string().min(1, "Ulica jest wymagana"),
  city: z.string().min(1, "Miasto jest wymagane"),
  postCode: z.string().regex(/^\d{2}-\d{3}$/, "Wymagany poprawny kod pocztowy (format: XX-XXX)"),
  countryCode: z.string().length(2, "Wymagany kod kraju (2 znaki)").default('PL'),
});

const PersonalDataSchema = z.object({
  type: z.literal('person').default('person'),
  phoneNumber: z.string().min(1, "Numer telefonu jest wymagany"),
  firstName: z.string().min(1, "Imię jest wymagane"),
  lastName: z.string().min(1, "Nazwisko jest wymagane"),
  email: z.string().email("Wymagany poprawny adres email"),
  identificationNumber: z.string().length(11, "Wymagany poprawny numer PESEL (11 cyfr)"),
  address: AddressSchema,
});

const VehicleDataSchema = z.object({
  purchasedOn: z.string().min(1), // Zakładamy string YYYY-MM-DD
  modelCode: z.string().optional(),
  categoryCode: z.string().optional(),
  usageCode: z.string().optional(),
  mileage: z.number().optional(),
  firstRegisteredOn: z.string().min(1), // Zakładamy string YYYY-MM-DD lub ISO
  evaluationDate: z.string().optional(), // Zakładamy string YYYY-MM-DD
  purchasePrice: z.number().positive(),
  purchasePriceNet: z.number().optional(),
  purchasePriceVatReclaimableCode: z.string().optional(),
  usageTypeCode: z.string().optional(),
  purchasePriceInputType: z.string().optional(),
  vin: z.string().length(17, "Wymagany VIN (17 znaków)"),
  vrm: z.string().min(1, "Numer rejestracyjny jest wymagany"),
  // Można dodać opcjonalne pola z typu VehicleData, jeśli są używane
  make: z.string().optional(),
  model: z.string().optional(),
  vehicleCategory: z.string().optional(),
  usageType: z.string().optional(),
  registrationNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePriceType: z.string().optional(),
  purchasePriceVatReclaimable: z.string().optional(),
  vinNumber: z.string().optional(),
  productionYear: z.number().optional()
}).passthrough(); // Pozwól na inne pola, których nie zdefiniowaliśmy

const PaymentDataSchema = z.object({
  term: z.string().min(1),
  claimLimit: z.string().min(1),
  paymentTerm: z.string().min(1),
  paymentMethod: z.string().min(1),
  premium: z.number().positive(),
}).passthrough();

// Schemat dla całego payloadu przychodzącego do /api/register-policy
const PayloadSchema = z.object({
  vehicleData: VehicleDataSchema,
  personalData: PersonalDataSchema,
  paymentData: PaymentDataSchema,
  productCode: z.string().min(1),
  signatureTypeCode: z.string().min(1),
  sellerNodeCode: z.string().min(1),
}).passthrough();
// --- KONIEC SCHEMATÓW ZOD ---

// Funkcja pomocnicza do obliczania różnicy dni między datami
function daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    // Dodano logowanie surowego body
    console.log('==> /api/register-policy: Otrzymano surowe body żądania:', rawBody);

    // Walidacja przy użyciu Zod
    const validationResult = PayloadSchema.safeParse(rawBody);

    if (!validationResult.success) {
      console.error('==> /api/register-policy: Błąd walidacji Zod:', validationResult.error.errors);
      return NextResponse.json({ success: false, error: 'Nieprawidłowe dane wejściowe', details: validationResult.error.flatten() }, { status: 400 });
    }

    const data = validationResult.data;

    const token = await getAuthToken();
    if (!token) {
      console.error('==> /api/register-policy: Błąd - Brak tokenu autoryzacji');
      return NextResponse.json({ success: false, error: 'Brak autoryzacji' }, { status: 401 });
    }

    const apiUrl = 'https://test.v2.idefend.eu/api/policies';

    // Konstruowanie payloadu dla API iDefend
    const apiPayload = {
      sellerNodeCode: data.sellerNodeCode,
      productCode: data.productCode,
      signatureTypeCode: data.signatureTypeCode,
      saleInitiatedOn: new Date().toISOString().split('T')[0], // Użyj aktualnej daty
      vehicleSnapshot: {
        purchasedOn: data.vehicleData.purchasedOn,
        modelCode: data.vehicleData.modelCode,
        categoryCode: data.vehicleData.categoryCode,
        usageCode: data.vehicleData.usageCode,
        mileage: data.vehicleData.mileage,
        firstRegisteredOn: data.vehicleData.firstRegisteredOn,
        evaluationDate: data.vehicleData.evaluationDate || new Date().toISOString().split('T')[0], // Użyj aktualnej lub z danych
        purchasePrice: Math.round(data.vehicleData.purchasePrice * 100), // Cena w groszach
        purchasePriceNet: data.vehicleData.purchasePriceNet ? Math.round(data.vehicleData.purchasePriceNet * 100) : Math.round(data.vehicleData.purchasePrice * 100),
        purchasePriceVatReclaimableCode: data.vehicleData.purchasePriceVatReclaimableCode,
        usageTypeCode: data.vehicleData.usageTypeCode,
        purchasePriceInputType: data.vehicleData.purchasePriceInputType,
        vin: data.vehicleData.vin,
        vrm: data.vehicleData.vrm,
        owners: [{ contact: { inheritFrom: "policyHolder" } }]
      },
      client: {
        policyHolder: {
          type: 'person',
          phoneNumber: data.personalData.phoneNumber,
          firstName: data.personalData.firstName,
          lastName: data.personalData.lastName,
          email: data.personalData.email,
          identificationNumber: data.personalData.identificationNumber,
          address: {
            addressLine1: `${data.personalData.firstName} ${data.personalData.lastName}`, // Składamy z imienia i nazwiska
            street: data.personalData.address.street,
            city: data.personalData.address.city,
            postCode: data.personalData.address.postCode,
            countryCode: data.personalData.address.countryCode
          }
        },
        insured: { inheritFrom: "policyHolder" },
        beneficiary: { inheritFrom: "policyHolder" }
      },
      options: {
        TERM: data.paymentData.term,
        CLAIM_LIMIT: data.paymentData.claimLimit,
        PAYMENT_TERM: data.paymentData.paymentTerm,
        PAYMENT_METHOD: data.paymentData.paymentMethod
      },
      premium: Math.round(data.paymentData.premium * 100) // Składka w groszach
    };

    // Dodano logowanie payloadu wysyłanego do iDefend
    console.log('==> /api/register-policy: Wysyłanie do iDefend payload:', JSON.stringify(apiPayload, null, 2));

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NODE-JWT-AUTH-TOKEN': token,
        'Accept': 'application/ld+json' // Oczekujemy JSON-LD
      },
      body: JSON.stringify(apiPayload)
    });

    const responseText = await apiResponse.text();
    // Dodano logowanie statusu i surowej odpowiedzi
    console.log(`==> /api/register-policy: Odpowiedź z iDefend - Status: ${apiResponse.status}`);
    console.log('==> /api/register-policy: Odpowiedź z iDefend - Raw Body:', responseText);

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('==> /api/register-policy: Nie udało się sparsować odpowiedzi iDefend jako JSON.');
      if (!apiResponse.ok) {
        // W przypadku błędu rejestracji zwracamy szczegóły
        return NextResponse.json({ success: false, error: 'Błąd API iDefend: Nieprawidłowa odpowiedź', rawResponse: responseText }, { status: apiResponse.status });
      }
      responseData = {}; // Pusta odpowiedź jeśli status OK, ale nie JSON
    }

    if (!apiResponse.ok) {
      console.error('==> /api/register-policy: Błąd API iDefend (po sparsowaniu):', responseData);
      const errorMessage = responseData?.detail || responseData?.message || 'Błąd rejestracji polisy w iDefend';
      // Zwracamy szczegóły błędu z API iDefend
      return NextResponse.json({ success: false, error: errorMessage, details: responseData }, { status: apiResponse.status });
    }

    // Przetwarzanie odpowiedzi JSON-LD
    const policyId = responseData['@id'] ? responseData['@id'].split('/').pop() : null;
    console.log('==> /api/register-policy: Pomyślnie zarejestrowano polisę, ID z @id:', policyId);

    return NextResponse.json({ success: true, policyData: { ...responseData, policyId } }, { status: 201 }); // Zwróć 201 Created

  } catch (error) {
    console.error('==> /api/register-policy: Błąd wewnętrzny serwera:', error);
    // Ukrywamy szczegóły błędu Zod przed użytkownikiem w produkcji
    const errorMessage = error instanceof z.ZodError ? 'Nieprawidłowe dane wejściowe' : 'Błąd wewnętrzny serwera';
    const errorStatus = error instanceof z.ZodError ? 400 : 500;
    return NextResponse.json({ success: false, error: errorMessage }, { status: errorStatus });
  }
} 