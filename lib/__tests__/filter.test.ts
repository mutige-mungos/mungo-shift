import { describe, expect, it } from "vitest";
import {
  BL4_REGEX,
  extractCode,
  isActive,
  isBL4,
  sanitize,
  type SanitizedCode,
} from "@/lib/filter";
import type { UpstreamEntry } from "@/lib/fetchUpstream";

describe("isBL4", () => {
  it("matches Borderlands 4 variations", () => {
    const base: UpstreamEntry = { game: "Borderlands 4" };
    expect(isBL4(base)).toBe(true);
    expect(isBL4({ title: "BL4 mega drop" })).toBe(true);
    expect(isBL4({ notes: "bonus for borderlands    4 hunters" })).toBe(true);
  });

  it("ignores other games", () => {
    expect(isBL4({ game: "Borderlands 3" })).toBe(false);
    expect(isBL4({ title: "Tiny Tina" })).toBe(false);
  });
});

describe("extractCode", () => {
  it("uses the first populated field", () => {
    const entry: UpstreamEntry = { shift: "aaaaa-bbbbb-ccccc-ddddd-eeeee" };
    expect(extractCode(entry)).toBe("AAAAA-BBBBB-CCCCC-DDDDD-EEEEE");

    const entry2: UpstreamEntry = {
      code: "fffff-ggggg-hhhhh-iiiii-jjjjj",
      value: "zzzzz-zzzzz-zzzzz-zzzzz-zzzzz",
    };
    expect(extractCode(entry2)).toBe("FFFFF-GGGGG-HHHHH-IIIII-JJJJJ");
  });

  it("returns null for malformed codes", () => {
    expect(extractCode({ code: "too-short" })).toBeNull();
    expect(extractCode({ code: "abc" })).toBeNull();
  });
});

describe("isActive", () => {
  const now = new Date("2024-01-01T00:00:00.000Z");

  it("returns true when no expiry", () => {
    expect(isActive({}, now)).toBe(true);
  });

  it("returns true when expiry is in the future", () => {
    expect(isActive({ expires: "2024-02-01" }, now)).toBe(true);
  });

  it("returns false when expiry is in the past", () => {
    expect(isActive({ expiry: "2023-12-31" }, now)).toBe(false);
  });

  it("treats invalid dates as active", () => {
    expect(isActive({ expires: "invalid" }, now)).toBe(true);
  });
});

describe("sanitize", () => {
  it("returns sanitized object", () => {
    const entry: UpstreamEntry = {
      game: "Borderlands 4",
      code: "aaaaa-bbbbb-ccccc-ddddd-eeeee",
      reward: "5 Golden Keys",
      expires: "2025-01-01T00:00:00Z",
      source: "https://example.com",
    };

    const sanitized = sanitize(entry);
    const expected: SanitizedCode = {
      code: "AAAAA-BBBBB-CCCCC-DDDDD-EEEEE",
      added: undefined,
      expires: "2025-01-01T00:00:00.000Z",
      expiresRaw: "2025-01-01T00:00:00Z",
      addedRaw: undefined,
      reward: "5 Golden Keys",
      source: "https://example.com",
    };

    expect(sanitized).toEqual(expected);
  });

  it("parses added timestamps", () => {
    const entry: UpstreamEntry = {
      game: "Borderlands 4",
      code: "aaaaa-bbbbb-ccccc-ddddd-eeeee",
      archived: "2025-09-20 07:26:24.013778+00:00",
    };

    const sanitized = sanitize(entry);
    expect(sanitized?.added).toBe("2025-09-20T07:26:24.013Z");
  });

  it("returns null when no valid code", () => {
    expect(sanitize({ game: "Borderlands 4" })).toBeNull();
  });
});

describe("BL4 regex", () => {
  it("matches expected samples", () => {
    expect(BL4_REGEX.test("Play Borderlands 4 today")).toBe(true);
    expect(BL4_REGEX.test("bl4 keys")).toBe(true);
    expect(BL4_REGEX.test("borderlands   4 code")).toBe(true);
    expect(BL4_REGEX.test("Borderlands3")).toBe(false);
  });
});
