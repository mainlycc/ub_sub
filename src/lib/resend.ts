import { Resend } from "resend";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(`Brak zmiennej środowiskowej ${name}`);
  }
  return v.trim();
}

export function getResendClient(): Resend {
  const apiKey = requireEnv("RESEND_API_KEY");
  return new Resend(apiKey);
}

export function getResendDefaults(): { from: string; toContact: string } {
  return {
    from: requireEnv("RESEND_FROM"),
    toContact: process.env.RESEND_TO_CONTACT?.trim() || "kontakt@mainly.pl",
  };
}

/** Resend Node SDK zwraca `{ data, error }` i nie rzuca — trzeba sprawdzić `error`. */
export function assertResendSendOk(result: { data: unknown; error: unknown }): void {
  if (result.error != null) {
    const err = result.error as { message?: string; name?: string };
    const msg =
      typeof err.message === "string" && err.message.trim()
        ? err.message
        : JSON.stringify(result.error);
    throw new Error(msg);
  }
}

