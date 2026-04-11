import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import { getCurrentEnvironment } from "@/lib/environment";
import { validateFile } from "@/lib/file-validation";
import { safeLog } from "@/lib/logger";
import { assertResendSendOk, getResendClient, getResendDefaults } from "@/lib/resend";

export const runtime = "nodejs";

type BatchItem = { documentType: string; file: File };

function parseBatchFormData(fd: FormData): BatchItem[] {
  // Format:
  // - items[0][documentType], items[0][file]
  // - items[1][documentType], items[1][file]
  const items: BatchItem[] = [];
  for (let i = 0; i < 50; i++) {
    const dt = fd.get(`items[${i}][documentType]`);
    const f = fd.get(`items[${i}][file]`);
    if (dt == null && f == null) break;
    if (typeof dt !== "string" || !dt.trim() || !(f instanceof File)) continue;
    items.push({ documentType: dt.trim(), file: f });
  }
  return items;
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-2, -1)[0];

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Nieprawidłowy format danych. Oczekiwano multipart/form-data" },
        { status: 400 }
      );
    }

    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ error: "Nie udało się uzyskać tokenu autoryzacyjnego" }, { status: 401 });
    }

    const formData = await request.formData();
    const items = parseBatchFormData(formData);
    if (items.length === 0) {
      return NextResponse.json({ error: "Brak plików do wysłania" }, { status: 400 });
    }

    // Validate upfront
    const validationErrors: string[] = [];
    for (const it of items) {
      const v = await validateFile(it.file);
      if (!v.isValid) {
        validationErrors.push(`${it.documentType}: ${it.file.name} — ${v.errors.join(", ")}`);
      }
    }
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Nieprawidłowe pliki", details: validationErrors }, { status: 400 });
    }

    const environment = getCurrentEnvironment();
    const results: Array<{ documentType: string; ok: boolean; status?: number; error?: string }> = [];

    for (const it of items) {
      const apiFormData = new FormData();
      apiFormData.append("file", it.file);
      apiFormData.append("uploadType", it.documentType);

      const res = await fetch(`${environment.apiUrl}/policies/${id}/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-NODE-JWT-AUTH-TOKEN": token,
        },
        body: apiFormData,
      });

      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        let err = `HTTP ${res.status}`;
        try {
          if (ct.includes("application/json")) {
            const j = (await res.json()) as unknown;
            err = typeof j === "string" ? j : JSON.stringify(j);
          } else {
            const t = await res.text();
            if (t.trim()) err = t.substring(0, 200);
          }
        } catch {
          // ignore
        }
        results.push({ documentType: it.documentType, ok: false, status: res.status, error: err });
      } else {
        results.push({ documentType: it.documentType, ok: true, status: res.status });
      }
    }

    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0) {
      safeLog.error("uploads-batch: część plików nie przeszła", failed);
      return NextResponse.json(
        { ok: false, error: "Nie wszystkie pliki zostały wysłane", results },
        { status: 502 }
      );
    }

    // Send one email with attachments to contact
    const resend = getResendClient();
    const { from, toContact } = getResendDefaults();

    const sendResult = await resend.emails.send({
      from,
      to: [toContact],
      subject: `Dokumenty polisy ${id}`,
      text: `Użytkownik przesłał dokumenty dla polisy ${id}.\n\nZałączniki: ${items.map((x) => `${x.documentType}: ${x.file.name}`).join(", ")}`,
      attachments: await Promise.all(
        items.map(async (x) => ({
          filename: sanitizeFilename(`${x.documentType}_${x.file.name}`),
          content: Buffer.from(await x.file.arrayBuffer()),
        }))
      ),
    });
    assertResendSendOk(sendResult);

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    safeLog.error("uploads-batch: błąd", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Wystąpił błąd podczas przetwarzania żądania",
        details: error instanceof Error ? error.message : "Nieznany błąd",
      },
      { status: 500 }
    );
  }
}

function sanitizeFilename(name: string): string {
  return name.replaceAll(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 180);
}

