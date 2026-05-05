/**
 * URL-safe base64 helpers (no padding) for compact task encoding.
 * Works in both Node (Buffer) and Edge/Browser (atob/btoa).
 */

function toBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  // eslint-disable-next-line no-undef
  return btoa(bin);
}

function fromBase64(b64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(b64, "base64"));
  }
  // eslint-disable-next-line no-undef
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function fromUrlSafe(s: string): string {
  const fixed = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = fixed.length % 4 === 0 ? 0 : 4 - (fixed.length % 4);
  return fixed + "=".repeat(pad);
}

export function encodeTask<T>(payload: T): string {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  return toUrlSafe(toBase64(bytes));
}

export class TaskDecodeError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "TaskDecodeError";
  }
}

export function decodeTask<T>(token: string): T {
  if (!token) throw new TaskDecodeError("Leerer Aufgabencode.");
  // basic shape check: url-safe base64 alphabet
  if (!/^[A-Za-z0-9_-]+$/u.test(token)) {
    throw new TaskDecodeError("Aufgabencode enthält ungültige Zeichen.");
  }
  let bytes: Uint8Array;
  try {
    bytes = fromBase64(fromUrlSafe(token));
  } catch (err) {
    throw new TaskDecodeError("Aufgabencode konnte nicht dekodiert werden.", err);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes));
  } catch (err) {
    throw new TaskDecodeError("Aufgabencode enthält kein gültiges JSON.", err);
  }
  return parsed as T;
}
