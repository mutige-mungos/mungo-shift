export interface UpstreamEntry {
  [key: string]: unknown;
}

export interface FetchOptions {
  force?: boolean;
  fetchImpl?: typeof fetch;
}

export interface FetchResult {
  list: UpstreamEntry[];
  fetchedAt: number;
  generatedAt?: string;
}

const DEFAULT_UPSTREAM_URL =
  process.env.UPSTREAM_URL ??
  "https://raw.githubusercontent.com/DankestMemeLord/autoshift-codes/refs/heads/main/shiftcodes.json";

const MIN_TTL = 1000 * 60 * 5; // 5 minutes
const MAX_TTL = 1000 * 60 * 15; // 15 minutes

function resolveTtl(): number {
  const raw = process.env.UPSTREAM_CACHE_TTL_MS;
  if (!raw) {
    return MIN_TTL;
  }

  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    return MIN_TTL;
  }

  return Math.min(Math.max(parsed, MIN_TTL), MAX_TTL);
}

const TTL = resolveTtl();

let cachedResult: FetchResult | null = null;
let inflight: Promise<FetchResult> | null = null;

interface NormalisedPayload {
  list: UpstreamEntry[];
  metaGenerated?: string;
}

function extractMetaGenerated(container: unknown): string | undefined {
  if (!container || typeof container !== "object") {
    return undefined;
  }

  const meta = (container as { meta?: unknown }).meta;
  if (!meta || typeof meta !== "object") {
    return undefined;
  }

  const generated = (meta as { generated?: unknown }).generated;
  if (typeof generated === "string") {
    return generated;
  }

  if (generated && typeof generated === "object" && "human" in generated) {
    const human = (generated as { human?: unknown }).human;
    if (typeof human === "string") {
      return human;
    }
  }

  return undefined;
}

function normalisePayload(data: unknown): NormalisedPayload {
  const payload: NormalisedPayload = {
    list: [],
    metaGenerated: undefined,
  };

  function pushEntry(entry: unknown) {
    if (entry !== null && typeof entry === "object") {
      payload.list.push(entry as UpstreamEntry);
    }
  }

  function handleContainer(container: unknown) {
    if (!container || typeof container !== "object") {
      return;
    }

    if (!payload.metaGenerated) {
      payload.metaGenerated = extractMetaGenerated(container);
    }

    const maybeCodes = (container as { codes?: unknown }).codes;
    if (Array.isArray(maybeCodes)) {
      for (const item of maybeCodes) {
        pushEntry(item);
      }
      return;
    }

    pushEntry(container);
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      handleContainer(item);
    }
    return payload;
  }

  if (data && typeof data === "object" && "codes" in data) {
    handleContainer(data);
    return payload;
  }

  return payload;
}

export async function fetchUpstream(
  options: FetchOptions = {},
): Promise<FetchResult> {
  const { force = false, fetchImpl } = options;

  const now = Date.now();
  if (!force && cachedResult && now - cachedResult.fetchedAt < TTL) {
    return cachedResult;
  }

  if (!force && inflight) {
    return inflight;
  }

  const fetcher = fetchImpl ?? globalThis.fetch;
  if (!fetcher) {
    throw new Error("Fetch API is not available in this environment");
  }

  const upstreamUrl = DEFAULT_UPSTREAM_URL;

  const request = fetcher(upstreamUrl, {
    headers: {
      accept: "application/json",
      "user-agent": "mungo-shift/1.0 (BL4 monitor)",
    },
    cache: "no-store",
  });

  inflight = request
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch upstream: ${response.status}`);
      }

      const data = await response.json();
      const { list, metaGenerated } = normalisePayload(data);

      const result: FetchResult = {
        list,
        fetchedAt: Date.now(),
        generatedAt: metaGenerated,
      };

      cachedResult = result;
      return result;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function clearUpstreamCache(): void {
  cachedResult = null;
  inflight = null;
}
