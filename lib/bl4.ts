import { fetchUpstream } from "./fetchUpstream";
import {
  extractCode,
  isActive,
  isBL4,
  sanitize,
  type SanitizedCode,
} from "./filter";

export interface Bl4Data {
  updatedAt: string;
  generatedAt?: string;
  count: number;
  items: SanitizedCode[];
}

function sortCodes(items: SanitizedCode[]): SanitizedCode[] {
  return [...items].sort((a, b) => {
    const aArchived = a.archived ? new Date(a.archived).getTime() : null;
    const bArchived = b.archived ? new Date(b.archived).getTime() : null;

    if (aArchived !== null && bArchived !== null) {
      return bArchived - aArchived;
    }

    if (aArchived !== null) {
      return -1;
    }

    if (bArchived !== null) {
      return 1;
    }

    return a.code.localeCompare(b.code);
  });
}

export async function loadActiveBl4Codes(options: {
  force?: boolean;
  now?: Date;
} = {}): Promise<Bl4Data> {
  const { force = false, now = new Date() } = options;
  const { list, fetchedAt, generatedAt } = await fetchUpstream({ force });

  const map = new Map<string, SanitizedCode>();

  for (const entry of list) {
    if (!isBL4(entry)) {
      continue;
    }

    if (!isActive(entry, now)) {
      continue;
    }

    const code = extractCode(entry);
    if (!code) {
      continue;
    }

    const sanitized = sanitize(entry, code);
    if (!sanitized) {
      continue;
    }

    map.set(code, sanitized);
  }

  const items = sortCodes(Array.from(map.values()));

  let generatedIso: string | undefined;
  if (generatedAt) {
    const parsed = new Date(generatedAt);
    if (!Number.isNaN(parsed.getTime())) {
      generatedIso = parsed.toISOString();
    }
  }

  return {
    updatedAt: new Date(fetchedAt).toISOString(),
    generatedAt: generatedIso,
    count: items.length,
    items,
  };
}
