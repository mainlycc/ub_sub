import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResendSendOk, getResendClient, getResendDefaults } from "@/lib/resend";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(5000),
  acceptTerms: z.literal(true),
});

export async function POST(req: Request) {
  try {
    const json = (await req.json().catch(() => null)) as unknown;
    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Nieprawidłowe dane formularza", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = parsed.data;
    const resend = getResendClient();
    const { from, toContact } = getResendDefaults();

    const subject = `Kontakt: ${name}`;
    const text = [
      "Nowa wiadomość z formularza kontaktowego.",
      "",
      `Imię i nazwisko: ${name}`,
      `Email: ${email}`,
      `Telefon: ${phone || "-"}`,
      "",
      "Wiadomość:",
      message,
    ].join("\n");

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;">
        <h2>Nowa wiadomość z formularza kontaktowego</h2>
        <p><strong>Imię i nazwisko:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(phone || "-")}</p>
        <hr />
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `;

    const sendResult = await resend.emails.send({
      from,
      to: [toContact],
      replyTo: email,
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

