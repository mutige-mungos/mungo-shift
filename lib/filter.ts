import type { UpstreamEntry } from "./fetchUpstream";

export const BL4_REGEX = /\b(borderlands\s*4|bl4)\b/i;
export const CODE_REGEX = /^[A-Z0-9]{5}(?:-[A-Z0-9]{5}){4}$/;

export interface SanitizedCode {
  code: string;
  archived?: string;
  archivedRaw?: string;
  expires?: string;
  expiresRaw?: string;
  expired?: boolean;
  reward?: string;
  source?: string;
}

function pickString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return undefined;
}

function pickBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalised = value.trim().toLowerCase();
    if (normalised === "true") {
      return true;
    }
    if (normalised === "false") {
      return false;
    }
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
  }

  return undefined;
}

function startOfDay(date: Date): number {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
}

function endOfDay(date: Date): number {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy.getTime();
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

export function getArchivedIso(entry: UpstreamEntry): string | null {
  const raw = pickString(entry.archived);
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
  const expiredFlag = pickBoolean((entry as { expired?: unknown }).expired);
  if (expiredFlag === true) {
    return false;
  }

  const raw = pickString(entry.expires) ?? pickString(entry.expiry);
  if (!raw) {
    return true;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return true;
  }

  const today = startOfDay(now);
  const expiryDay = endOfDay(parsed);

  return today <= expiryDay;
}

export function sanitize(entry: UpstreamEntry, code?: string): SanitizedCode | null {
  const extracted = code ?? extractCode(entry);
  if (!extracted) {
    return null;
  }

  const rawExpires = pickString(entry.expires) ?? pickString(entry.expiry) ?? undefined;
  const expires = getExpiryIso(entry) ?? undefined;
  const rawArchived = pickString(entry.archived) ?? undefined;
  const archived = getArchivedIso(entry) ?? undefined;
  const expired = pickBoolean((entry as { expired?: unknown }).expired);
  const reward = pickString(entry.reward) ?? pickString(entry.prize) ?? undefined;
  const source = pickString(entry.source) ?? undefined;

  const sanitized: SanitizedCode = {
    code: extracted,
    archived,
    expires,
    expiresRaw: rawExpires,
    archivedRaw: rawArchived,
    expired,
    reward,
    source,
  };

  return sanitized;
}
