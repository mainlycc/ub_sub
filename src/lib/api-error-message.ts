/**
 * Defend / API Platform często zwraca `error` jako obiekt lub pola `detail`, `hydra:description`.
 */

export function toApiErrorMessage(payload: unknown): string {
  if (payload == null || payload === "") return "";
  if (typeof payload === "string") return payload;
  if (typeof payload === "number" || typeof payload === "boolean") {
    return String(payload);
  }
  if (typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    if (typeof o.detail === "string") return o.detail;
    if (typeof o.title === "string") return o.title;
    if (typeof o.description === "string") return o.description;
    const hydraDesc = o["hydra:description"];
    if (typeof hydraDesc === "string") return hydraDesc;
    const hydraTitle = o["hydra:title"];
    if (typeof hydraTitle === "string") return hydraTitle;
    if ("error" in o && o.error != null) return toApiErrorMessage(o.error);
    try {
      return JSON.stringify(payload);
    } catch {
      return "Nieznany błąd API";
    }
  }
  return String(payload);
}

/** Odczyt czytelnego komunikatu z body odpowiedzi JSON (Next proxy lub bezpośrednio API). */
export function extractErrorFromResponseBody(data: unknown): string {
  if (data == null) return "";
  if (typeof data !== "object") return toApiErrorMessage(data);
  const o = data as Record<string, unknown>;
  if ("error" in o && o.error != null) return toApiErrorMessage(o.error);
  if (typeof o.message === "string") return o.message;
  if (typeof o.detail === "string") return o.detail;
  return toApiErrorMessage(data);
}
