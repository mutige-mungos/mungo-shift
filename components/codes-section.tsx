"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  HelpCircle,
  Key as KeyIcon,
  Shirt,
  List,
  WarningCircle,
} from "iconoir-react";

import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SanitizedCode } from "@/lib/filter";

type CodeFilter = "all" | "active" | "expired";

type FilterOption = {
  id: CodeFilter;
  label: string;
  icon: ComponentType<ComponentPropsWithoutRef<"svg">>;
};

const FILTER_OPTIONS: FilterOption[] = [
  { id: "all", label: "Alle", icon: List },
  { id: "active", label: "Verfügbar", icon: CheckCircle },
  { id: "expired", label: "Abgelaufen", icon: WarningCircle },
];

function getTodayStart(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

function getEndOfDay(date: Date): number {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy.getTime();
}

function isExpiredCode(item: SanitizedCode): boolean {
  if (item.expired === true) {
    return true;
  }

  if (!item.expires) {
    return false;
  }

  const parsed = new Date(item.expires);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return getTodayStart() > getEndOfDay(parsed);
}

function formatDateOnly(timestamp?: string): string | null {
  if (!timestamp) {
    return null;
  }

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function UnknownIndicator({ label = "unbekannt" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1.5 text-xs text-muted-foreground sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
      <HelpCircle
        className="h-3.5 w-3.5 text-orange-500 sm:h-4 sm:w-4"
        aria-hidden
      />
      <span className="font-medium text-foreground">{label}</span>
    </span>
  );
}

function InfoChip({
  icon,
  children,
  title,
}: {
  icon: ReactNode;
  children: ReactNode;
  title: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-orange-300/50 hover:bg-muted/70 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
      title={title}
    >
      <span className="text-orange-500">{icon}</span>
      <span className="font-medium text-foreground">{children}</span>
    </span>
  );
}

function CodesList({ codes }: { codes: SanitizedCode[] }) {
  if (codes.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-muted bg-muted/60 p-6 text-sm text-muted-foreground">
        Keine Codes für diesen Filter.
      </p>
    );
  }

  return (
    <ul className="space-y-4 sm:space-y-6">
      {codes.map((item) => {
        const archivedFormatted = formatDateOnly(item.archived);
        const archivedDisplay = archivedFormatted ?? "???";
        const expiresFormatted = formatDateOnly(item.expires);
        const expiresDisplay = expiresFormatted ?? "???";
        const expired = isExpiredCode(item);

        const reward = item.reward ? (
          <InfoChip
            icon={
              item.reward.toLowerCase().includes("cosmetic") ? (
                <Shirt className="h-4 w-4" aria-hidden />
              ) : (
                <KeyIcon className="h-4 w-4" aria-hidden />
              )
            }
            title="Belohnung"
          >
            {item.reward}
          </InfoChip>
        ) : (
          <UnknownIndicator />
        );

        const archivedChip = (
          <InfoChip
            icon={<Calendar className="h-4 w-4" aria-hidden />}
            title="Archiviert am"
          >
            {archivedDisplay}
          </InfoChip>
        );

        const expiresChip = (
          <InfoChip
            icon={<Clock className="h-4 w-4" aria-hidden />}
            title="Bis"
          >
            {`Bis: ${expiresDisplay}`}
          </InfoChip>
        );

        return (
          <li key={item.code}>
            <Card
              className={cn(
                "overflow-hidden border-border/60 bg-card/80 transition-all hover:-translate-y-0.5 hover:border-orange-300/70 hover:shadow-lg",
                expired &&
                  "border-border/40 bg-muted/70 opacity-70 hover:-translate-y-0 hover:border-border/40 hover:shadow-none"
              )}
            >
              <CardHeader className="space-y-3 sm:space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className={cn(
                      "flex items-center gap-2 font-mono text-base font-semibold tracking-[0.18em] text-foreground sm:text-xl sm:tracking-[0.35em]",
                      expired && "line-through decoration-2 decoration-red-400"
                    )}
                  >
                    {item.code}
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {expired ? (
                      <Badge
                        variant="subtle"
                        className="gap-1 px-2 py-1 text-[11px] normal-case text-red-500 border-red-500/40 bg-red-500/10 sm:text-xs"
                      >
                        Abgelaufen
                      </Badge>
                    ) : (
                      <Badge
                        variant="success"
                        className="gap-1 px-2 py-1 text-[11px] normal-case sm:text-xs"
                      >
                        Verfügbar
                      </Badge>
                    )}
                    <CopyButton value={item.code} />
                  </div>
                </div>
                {item.source ? (
                  <Link
                    href={item.source}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-orange-500 sm:text-sm"
                    target={
                      item.source.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      item.source.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <ArrowUpRight
                      className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                      aria-hidden
                    />
                    <span className="font-medium">Quelle ansehen</span>
                  </Link>
                ) : null}
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 text-xs sm:gap-3 sm:text-sm">
                {reward}
                {archivedChip}
                {expiresChip}
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

export function CodesSection({ codes }: { codes: SanitizedCode[] }) {
  const [activeFilter, setActiveFilter] = useState<CodeFilter>("all");

  const filteredCodes = useMemo(() => {
    switch (activeFilter) {
      case "active":
        return codes.filter((item) => !isExpiredCode(item));
      case "expired":
        return codes.filter((item) => isExpiredCode(item));
      default:
        return codes;
    }
  }, [codes, activeFilter]);

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-border/60 bg-muted/40 p-2">
        {FILTER_OPTIONS.map(({ id, label, icon: Icon }) => {
          const isActive = activeFilter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFilter(id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:text-foreground sm:px-4 sm:py-2",
                isActive &&
                  "border-border/70 bg-background/90 text-foreground shadow-sm"
              )}
              aria-pressed={isActive}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
      <CodesList codes={filteredCodes} />
    </section>
  );
}
