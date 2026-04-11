import { NextResponse } from "next/server";
import { validateFile } from "@/lib/file-validation";
import { assertResendSendOk, getResendClient, getResendDefaults } from "@/lib/resend";

export const runtime = "nodejs";

type DocKind = "ac" | "rc" | "invoice";

type IncomingDoc = {
  kind: DocKind;
  file: File;
};

function parseDocs(fd: FormData): { policyId?: string; docs: IncomingDoc[] } {
  const policyIdRaw = fd.get("policyId");
  const policyId = typeof policyIdRaw === "string" && policyIdRaw.trim() ? policyIdRaw.trim() : undefined;

  const docs: IncomingDoc[] = [];
  const kinds: DocKind[] = ["ac", "rc", "invoice"];

  for (const kind of kinds) {
    // pozwól na wiele plików na grupę
    for (let i = 0; i < 20; i++) {
      const f = fd.get(`${kind}[${i}]`);
      if (f == null) break;
      if (f instanceof File) docs.push({ kind, file: f });
    }
  }

  return { policyId, docs };
}

function labelForKind(kind: DocKind): string {
  if (kind === "ac") return "Polisa_AC";
  if (kind === "rc") return "Dowod_rejestracyjny";
  return "Faktura";
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("multipart/form-data")) {
      return NextResponse.json(
        { ok: false, error: "Nieprawidłowy format danych. Oczekiwano multipart/form-data" },
        { status: 400 }
      );
    }

    const fd = await req.formData();
    const { policyId, docs } = parseDocs(fd);

    if (docs.length === 0) {
      return NextResponse.json({ ok: false, error: "Brak plików do wysłania" }, { status: 400 });
    }

    const validationErrors: string[] = [];
    for (const d of docs) {
      const v = await validateFile(d.file);
      if (!v.isValid) {
        validationErrors.push(`${labelForKind(d.kind)}: ${d.file.name} — ${v.errors.join(", ")}`);
      }
    }
    if (validationErrors.length > 0) {
      return NextResponse.json({ ok: false, error: "Nieprawidłowe pliki", details: validationErrors }, { status: 400 });
    }

    const resend = getResendClient();
    const { from, toContact } = getResendDefaults();

    const subject = policyId ? `Dokumenty (tymczasowo e-mail) – polisa ${policyId}` : "Dokumenty (tymczasowo e-mail)";

    const sendResult = await resend.emails.send({
      from,
      to: [toContact],
      subject,
      text: [
        "Tymczasowy tryb: dokumenty nie zostały wysłane do Defend, tylko na e-mail admina.",
        policyId ? `Polisa: ${policyId}` : "Polisa: (brak)",
        "",
        "Załączniki:",
        ...docs.map((d) => `- ${labelForKind(d.kind)}: ${d.file.name}`),
      ].join("\n"),
      attachments: await Promise.all(
        docs.map(async (d) => ({
          filename: sanitizeFilename(`${labelForKind(d.kind)}_${d.file.name}`),
          content: Buffer.from(await d.file.arrayBuffer()),
        }))
      ),
    });
    assertResendSendOk(sendResult);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Nieznany błąd";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

function sanitizeFilename(name: string): string {
  return name.replaceAll(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 180);
}

