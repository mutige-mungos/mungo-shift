import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Barcode,
  Calendar,
  Clock,
  Gamepad,
  HelpCircle,
  Key as KeyIcon,
  RssFeed,
  Text as TextIcon,
} from "iconoir-react";

import { CopyButton } from "@/components/copy-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { loadActiveBl4Codes } from "@/lib/bl4";
import { cn } from "@/lib/utils";

function formatUpdated(timestamp: string): string {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return "Unbekannt";
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
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

function isExpiredDate(timestamp?: string): boolean {
  if (!timestamp) {
    return false;
  }

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return getTodayStart() > getEndOfDay(parsed);
}

function formatGenerated(timestamp?: string): string | null {
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function UnknownIndicator({ label = "unbekannt" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1.5 text-xs text-muted-foreground sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
      <HelpCircle className="h-3.5 w-3.5 text-orange-500 sm:h-4 sm:w-4" aria-hidden />
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

function CodesList({
  codes,
}: {
  codes: Awaited<ReturnType<typeof loadActiveBl4Codes>>["items"];
}) {
  if (codes.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-muted bg-muted/60 p-6 text-sm text-muted-foreground">
        No active Borderlands 4 SHiFT codes right now. Check back soon!
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
        const expiredFlag = item.expired === true;
        const expired = expiredFlag || isExpiredDate(item.expires);

        const reward = item.reward ? (
          <InfoChip
            icon={<KeyIcon className="h-4 w-4" aria-hidden />}
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
                  "border-border/40 bg-muted/70 opacity-70 hover:-translate-y-0 hover:border-border/40 hover:shadow-none",
              )}
            >
              <CardHeader
                className={cn("space-y-3 sm:space-y-4", expired && "line-through")}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-2 font-mono text-base font-semibold tracking-[0.18em] text-foreground sm:text-xl sm:tracking-[0.35em]">
                    {item.code}
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {expired ? (
                      <Badge
                        variant="subtle"
                        className="gap-1 px-2 py-1 text-[11px] normal-case text-red-500 border-red-500/40 bg-red-500/10 sm:text-xs"
                      >
                        Inactive
                      </Badge>
                    ) : (
                      <Badge
                        variant="success"
                        className="gap-1 px-2 py-1 text-[11px] normal-case sm:text-xs"
                      >
                        Active
                      </Badge>
                    )}
                    <CopyButton value={item.code} />
                  </div>
                </div>
                {item.source ? (
                  <Link
                    href={item.source}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-orange-500 sm:text-sm"
                    target={item.source.startsWith("http") ? "_blank" : undefined}
                    rel={item.source.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
                    <span className="font-medium">Quelle ansehen</span>
                  </Link>
                ) : null}
              </CardHeader>
              <CardContent
                className={cn(
                  "flex flex-wrap gap-2 text-xs sm:gap-3 sm:text-sm",
                  expired && "line-through",
                )}
              >
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

export default async function Home() {
  try {
    const data = await loadActiveBl4Codes();
    const updatedText = formatUpdated(data.updatedAt);
    const generatedText = formatGenerated(data.generatedAt);

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:py-12 sm:px-8">
        <header className="space-y-4 sm:space-y-5">
          <Badge
            variant="outline"
            className="gap-1 border-orange-400/30 px-2 py-1 text-[11px] text-orange-500 sm:text-xs"
          >
            Borderlands 4
          </Badge>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:gap-3 sm:text-4xl">
              <Gamepad className="h-6 w-6 text-orange-500 sm:h-7 sm:w-7" aria-hidden />
              <span>
                <span className="text-orange-500">SHiFT</span> Codes
              </span>
            </h1>
            <Badge
              variant="accent"
              className="gap-1 px-2 py-1 text-[11px] normal-case sm:text-xs"
            >
              Mungo Edition
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-orange-400/20 bg-orange-400/10 p-3 text-xs text-muted-foreground sm:gap-4 sm:p-4 sm:text-sm">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <Clock className="h-4 w-4 text-orange-500" aria-hidden />
              <span>Aktualisiert {updatedText}</span>
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <Barcode className="h-4 w-4 text-orange-500" aria-hidden />
              <span>
                {data.count} aktive {data.count === 1 ? "Code" : "Codes"}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-border/70 bg-background/80 px-3 py-1.5 text-xs text-foreground transition hover:border-orange-300 hover:text-orange-500 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Link href="/bl4.txt" className="flex items-center gap-2">
                <TextIcon className="h-4 w-4" aria-hidden />
                Plain text export
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-border/70 bg-background/80 px-3 py-1.5 text-xs text-foreground transition hover:border-orange-300 hover:text-orange-500 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Link href="/bl4.rss" className="flex items-center gap-2">
                <RssFeed className="h-4 w-4" aria-hidden />
                RSS feed
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-border/70 bg-background/80 px-3 py-1.5 text-xs text-foreground transition hover:border-orange-300 hover:text-orange-500 sm:px-4 sm:py-2 sm:text-sm"
            >
            <a
              href="https://github.com/XxUnkn0wnxX/autoshift-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
                <ArrowUpRight className="h-4 w-4" aria-hidden />
                Upstream feed
              </a>
            </Button>
          </div>
        </header>
        <CodesList codes={data.items} />
        <footer className="mt-auto border-t border-muted pt-4 text-xs text-muted-foreground">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>Quelle aktuallisier {generatedText ?? "Unbekannt"}</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <span className="sm:text-right">(C) 2025 Mutige Mungos</span>
            </div>
          </div>
        </footer>
      </main>
    );
  } catch (error) {
    console.error(error);
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-12 sm:px-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
          <h1 className="text-xl font-semibold">We can&apos;t load codes right now</h1>
          <p className="mt-2 text-sm text-destructive">
            The upstream SHiFT feed is unavailable. Please try again in a few
            minutes.
          </p>
        </div>
      </main>
    );
  }
}
