"use client";

import { useEffect, useState } from "react";
import { Sparks } from "iconoir-react";

import { cn } from "@/lib/utils";
import type { SanitizedCode } from "@/lib/filter";

type NewCodesBadgeProps = {
  codes: SanitizedCode[];
  className?: string;
};

const KNOWN_CODES_STORAGE_KEY = "knownCodes";

export function NewCodesBadge({ codes, className }: NewCodesBadgeProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const readStoredSet = (storage: Storage, key: string) => {
      try {
        const raw = storage.getItem(key);
        if (!raw) {
          return new Set<string>();
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          return new Set<string>();
        }

        return new Set<string>(
          parsed.filter((value): value is string => typeof value === "string")
        );
      } catch (error) {
        console.error(`Failed to read ${key} from storage`, error);
        return new Set<string>();
      }
    };

    const knownCodes = readStoredSet(window.localStorage, KNOWN_CODES_STORAGE_KEY);
    const unseenCount = codes.reduce((acc, item) => {
      return knownCodes.has(item.code) ? acc : acc + 1;
    }, 0);
    setCount(unseenCount);

    const listener = (event: Event) => {
      const detail = (event as CustomEvent<number>).detail;
      setCount(detail);
    };

    window.addEventListener("codes:new-count", listener as EventListener);

    return () => {
      window.removeEventListener("codes:new-count", listener as EventListener);
    };
  }, [codes]);

  if (count === null) {
    return null;
  }

  if (count === 0) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap text-foreground",
        className
      )}
    >
      <Sparks className="h-4 w-4 text-orange-500" aria-hidden />
      <span>
        <span className="hidden sm:inline">
          {count} neue {count === 1 ? "Code" : "Codes"}
        </span>
        <span className="sm:hidden">{count} neu</span>
      </span>
    </span>
  );
}
