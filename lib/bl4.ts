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
  count: number;
  items: SanitizedCode[];
}

function sortCodes(items: SanitizedCode[]): SanitizedCode[] {
  return [...items].sort((a, b) => {
    if (a.expires && b.expires) {
      return new Date(a.expires).getTime() - new Date(b.expires).getTime();
    }

    if (a.expires) {
      return -1;
    }

    if (b.expires) {
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
  const { list, fetchedAt } = await fetchUpstream({ force });

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

  return {
    updatedAt: new Date(fetchedAt).toISOString(),
    count: items.length,
    items,
  };
}
