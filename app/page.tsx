import { Barcode, Clock } from "iconoir-react";

import { Footer } from "@/components/footer";
import { CodesSection } from "@/components/codes-section";
import { NewCodesBadge } from "@/components/new-codes-badge";
import { loadActiveBl4Codes } from "@/lib/bl4";

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

export default async function Home() {
  try {
    const data = await loadActiveBl4Codes();
    const updatedText = formatUpdated(data.updatedAt);
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:py-12 sm:px-8">
        <header className="space-y-4 sm:space-y-5">
          <h1 className="sr-only">SHiFT Codes</h1>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-orange-400/20 bg-orange-400/10 p-3 text-xs text-muted-foreground sm:gap-4 sm:p-4 sm:text-sm">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <Clock className="h-4 w-4 text-orange-500" aria-hidden />
              <span>Aktualisiert {updatedText}</span>
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <Barcode className="h-4 w-4 text-orange-500" aria-hidden />
              <span>
                <span className="hidden sm:inline">
                  {data.count} aktive {data.count === 1 ? "Code" : "Codes"}
                </span>
                <span className="sm:hidden">
                  {data.count} aktiv
                </span>
              </span>
            </span>
            <NewCodesBadge codes={data.items} className="inline-flex items-center gap-2 whitespace-nowrap" />
          </div>
        </header>
        <CodesSection codes={data.items} />
        <Footer className="mt-auto" />
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
