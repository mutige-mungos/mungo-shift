import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

const CARD_PLACEHOLDERS = Array.from({ length: 3 });

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:py-12 sm:px-8">
      <header className="space-y-4 sm:space-y-5">
        <Skeleton className="h-5 w-28 rounded-full" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-9 w-48" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="hidden h-10 w-10 rounded-full sm:block" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-orange-400/20 bg-orange-400/10 p-3 sm:gap-4 sm:p-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </header>

      <section className="space-y-5 sm:space-y-6">
        <div className="flex flex-wrap items-center gap-2 rounded-full border border-border/60 bg-muted/40 p-2">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <div className="space-y-4 sm:space-y-6">
          {CARD_PLACEHOLDERS.map((_, index) => (
            <div
              key={`skeleton-card-${index}`}
              className="rounded-xl border border-border/60 bg-card/80 p-4 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-6 w-40" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer className="mt-auto" />
    </main>
  );
}
