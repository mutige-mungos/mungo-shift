import type { UpstreamEntry } from "./fetchUpstream";

export const BL4_REGEX = /\b(borderlands\s*4|bl4)\b/i;
export const CODE_REGEX = /^[A-Z0-9]{5}(?:-[A-Z0-9]{5}){4}$/;

export interface SanitizedCode {
  code: string;
  added?: string;
  expires?: string;
  expiresRaw?: string;
  addedRaw?: string;
  reward?: string;
  source?: string;
}

function pickString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return undefined;
}

export function isBL4(entry: UpstreamEntry): boolean {
  const fields = [entry.game, entry.title, entry.notes];

  return fields.some((field) => {
    if (typeof field !== "string") {
      return false;
    }

    return BL4_REGEX.test(field);
  });
}

export function extractCode(entry: UpstreamEntry): string | null {
  const raw = pickString(entry.code) ?? pickString(entry.shift) ?? pickString(entry.value);
  if (!raw) {
    return null;
  }

  const uppercased = raw.toUpperCase();
  return CODE_REGEX.test(uppercased) ? uppercased : null;
}

export function getExpiryIso(entry: UpstreamEntry): string | null {
  const raw = pickString(entry.expires) ?? pickString(entry.expiry);
  if (!raw) {
    return null;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

export function getAddedIso(entry: UpstreamEntry): string | null {
  const raw = pickString((entry as { added?: unknown }).added) ?? pickString(entry.archived);
  if (!raw) {
    return null;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

export function isActive(entry: UpstreamEntry, now: Date = new Date()): boolean {
  const raw = pickString(entry.expires) ?? pickString(entry.expiry);
  if (!raw) {
    return true;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return true;
  }

  return parsed.getTime() >= now.getTime();
}

export function sanitize(entry: UpstreamEntry, code?: string): SanitizedCode | null {
  const extracted = code ?? extractCode(entry);
  if (!extracted) {
    return null;
  }

  const rawExpires = pickString(entry.expires) ?? pickString(entry.expiry) ?? undefined;
  const expires = getExpiryIso(entry) ?? undefined;
  const rawAdded = pickString((entry as { added?: unknown }).added) ?? pickString(entry.archived) ?? undefined;
  const added = getAddedIso(entry) ?? undefined;
  const reward = pickString(entry.reward) ?? pickString(entry.prize) ?? undefined;
  const source = pickString(entry.source) ?? undefined;

  const sanitized: SanitizedCode = {
    code: extracted,
    added,
    expires,
    expiresRaw: rawExpires,
    addedRaw: rawAdded,
    reward,
    source,
  };

  return sanitized;
}
