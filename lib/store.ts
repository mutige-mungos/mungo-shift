import { promises as fs } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const DEFAULT_STORE_PATH = resolve(process.cwd(), ".data/seen.json");

function ensureArray(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter((item): item is string => typeof item === "string");
}

function resolveStorePath(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    return DEFAULT_STORE_PATH;
  }

  if (raw.startsWith("file:")) {
    return fileURLToPath(new URL(raw));
  }

  if (raw.includes("://")) {
    throw new Error(
      "Only file-based DATABASE_URL values are supported in the JSON store",
    );
  }

  return resolve(process.cwd(), raw);
}

async function readSeenFile(path: string): Promise<Set<string>> {
  try {
    const contents = await fs.readFile(path, "utf8");
    const parsed = JSON.parse(contents) as unknown;
    return new Set(ensureArray(parsed));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return new Set<string>();
    }

    throw error;
  }
}

async function writeSeenFile(path: string, values: Iterable<string>): Promise<void> {
  const directory = dirname(path);
  await fs.mkdir(directory, { recursive: true });
  const unique = Array.from(new Set(values));
  await fs.writeFile(path, JSON.stringify(unique, null, 2), "utf8");
}

export async function getSeen(): Promise<Set<string>> {
  const path = resolveStorePath();
  return readSeenFile(path);
}

export async function saveSeen(codes: Iterable<string>): Promise<void> {
  const path = resolveStorePath();
  const existing = await readSeenFile(path);
  for (const code of codes) {
    existing.add(code);
  }

  await writeSeenFile(path, existing);
}

export async function diffNew(codes: string[]): Promise<string[]> {
  const seen = await getSeen();
  return codes.filter((code) => !seen.has(code));
}
