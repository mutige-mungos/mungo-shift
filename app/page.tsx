import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { loadActiveBl4Codes } from "@/lib/bl4";

function formatUpdated(timestamp: string): string {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(parsed);
}

function formatExpiry(timestamp?: string): string | null {
  if (!timestamp) {
    return null;
  }

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(parsed);
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
    <ul className="space-y-4">
      {codes.map((item) => {
        const formattedExpiry = formatExpiry(item.expires);

        return (
          <li
            key={item.code}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="font-mono text-lg font-semibold tracking-[0.3em] text-foreground sm:text-xl">
                  {item.code}
                </p>
                {item.reward ? (
                  <p className="text-sm text-muted-foreground">{item.reward}</p>
                ) : null}
                {item.source ? (
                  <p className="text-xs text-muted-foreground">
                    Source: {" "}
                    {item.source.startsWith("http") ? (
                      <Link
                        href={item.source}
                        className="underline underline-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.source}
                      </Link>
                    ) : (
                      item.source
                    )}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {formattedExpiry ? (
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    Expires {formattedExpiry}
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    No expiry listed
                  </span>
                )}
                <CopyButton value={item.code} />
              </div>
            </div>
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

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-4 py-12 sm:px-8">
        <header className="space-y-3">
          <p className="text-sm font-medium text-primary">Borderlands 4</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Active SHiFT codes</h1>
          <p className="text-sm text-muted-foreground">
            Last refreshed {updatedText} UTC · {data.count} active code
            {data.count === 1 ? "" : "s"}
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <Link
              href="/bl4.txt"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Plain text export
            </Link>
            <Link
              href="/bl4.rss"
              className="underline underline-offset-4 hover:text-foreground"
            >
              RSS feed
            </Link>
            <a
              href="https://github.com/DankestMemeLord/autoshift-codes"
              className="underline underline-offset-4 hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Upstream feed
            </a>
          </div>
        </header>
        <CodesList codes={data.items} />
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
