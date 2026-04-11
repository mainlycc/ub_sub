import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResendSendOk, getResendClient, getResendDefaults } from "@/lib/resend";

export const runtime = "nodejs";

const addressSchema = z.object({
  addressLine1: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postCode: z.string().optional().nullable(),
  countryCode: z.string().optional().nullable(),
});

const personalSchema = z.object({
  type: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  identificationNumber: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  address: addressSchema.optional().nullable(),
});

const vehicleSchema = z.object({
  vin: z.string().optional().nullable(),
  vrm: z.string().optional().nullable(),
  purchasedOn: z.string().optional().nullable(),
  firstRegisteredOn: z.string().optional().nullable(),
  purchasePrice: z.number().optional().nullable(),
  make: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
});

const calculationSchema = z.object({
  premium: z.number().optional().nullable(),
  details: z
    .object({
      productName: z.string().optional().nullable(),
      coveragePeriod: z.string().optional().nullable(),
      vehicleValue: z.number().optional().nullable(),
      maxCoverage: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

const paymentSchema = z.object({
  term: z.string().optional().nullable(),
  claimLimit: z.string().optional().nullable(),
  paymentTerm: z.string().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
});

const payloadSchema = z.object({
  personalData: personalSchema,
  vehicleData: vehicleSchema.optional().nullable(),
  paymentData: paymentSchema.optional().nullable(),
  calculationResult: calculationSchema.optional().nullable(),
  policyData: z.unknown().optional(),
});

export async function POST(req: Request) {
  try {
    const json = (await req.json().catch(() => null)) as unknown;
    const parsed = payloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Nieprawidłowe dane do wysyłki maila", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { personalData, vehicleData, paymentData, calculationResult } = parsed.data;
    const customerEmail = personalData.email?.trim();
    if (!customerEmail) {
      return NextResponse.json({ ok: false, error: "Brak email klienta" }, { status: 400 });
    }

    const resend = getResendClient();
    const { from, toContact } = getResendDefaults();

    const subject = "Potwierdzenie zgłoszenia – GAP";
    const text = [
      "Dziękujemy za przesłanie formularza.",
      "",
      "Dane kontaktowe:",
      `${personalData.firstName || ""} ${personalData.lastName || ""}`.trim() || "-",
      `Email: ${customerEmail}`,
      `Telefon: ${personalData.phoneNumber || "-"}`,
      "",
      "Pojazd:",
      `${vehicleData?.make || "-"} ${vehicleData?.model || ""}`.trim(),
      `VIN: ${vehicleData?.vin || "-"}`,
      `Rejestracja: ${vehicleData?.vrm || "-"}`,
      "",
      "Płatność / produkt:",
      `Produkt: ${calculationResult?.details?.productName || "-"}`,
      `Składka: ${typeof calculationResult?.premium === "number" ? `${calculationResult?.premium} PLN` : "-"}`,
      `Okres: ${paymentData?.term || "-"}`,
      "",
      "W razie pytań odpowiedz na tę wiadomość.",
    ].join("\n");

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;">
        <h2>Potwierdzenie zgłoszenia</h2>
        <p>Dziękujemy za przesłanie formularza. Skontaktujemy się możliwie szybko.</p>
        <h3>Dane kontaktowe</h3>
        <ul>
          <li><strong>Imię i nazwisko:</strong> ${escapeHtml(`${personalData.firstName || ""} ${personalData.lastName || ""}`.trim() || "-")}</li>
          <li><strong>Email:</strong> ${escapeHtml(customerEmail)}</li>
          <li><strong>Telefon:</strong> ${escapeHtml(personalData.phoneNumber || "-")}</li>
        </ul>
        <h3>Pojazd</h3>
        <ul>
          <li><strong>Marka / model:</strong> ${escapeHtml(`${vehicleData?.make || "-"} ${vehicleData?.model || ""}`.trim())}</li>
          <li><strong>VIN:</strong> ${escapeHtml(vehicleData?.vin || "-")}</li>
          <li><strong>Nr rej.:</strong> ${escapeHtml(vehicleData?.vrm || "-")}</li>
        </ul>
        <h3>Produkt / płatność</h3>
        <ul>
          <li><strong>Produkt:</strong> ${escapeHtml(calculationResult?.details?.productName || "-")}</li>
          <li><strong>Składka:</strong> ${
            typeof calculationResult?.premium === "number"
              ? escapeHtml(`${calculationResult.premium} PLN`)
              : "-"
          }</li>
          <li><strong>Okres:</strong> ${escapeHtml(paymentData?.term || "-")}</li>
        </ul>
        <p style="color:#6b7280;font-size:12px;">Jeśli to nie Ty wysłałeś/aś formularz, zignoruj tę wiadomość.</p>
      </div>
    `;

    const sendResult = await resend.emails.send({
      from,
      to: [customerEmail],
      cc: [toContact],
      replyTo: toContact,
      subject,
      text,
      html,
    });
    assertResendSendOk(sendResult);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Nieznany błąd";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

