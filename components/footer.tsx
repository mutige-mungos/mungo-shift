"use client";

import { Download, Github, InfoCircle, RssFeed } from "iconoir-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const githubUrl = "https://github.com/mutige-mungos/mungo-shift";
const licenseUrl =
  "https://github.com/mutige-mungos/mungo-shift/blob/main/LICENSE";

function CurrentYear() {
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    const now = new Date().getFullYear();
    if (now !== year) {
      setYear(now);
    }
  }, [year]);

  return <>{year}</>;
}

function VaultHunterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("h-3.5 w-3.5", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 6.2 7.2 17.8h9.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.6 17.8h4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FooterMeta({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-center text-xs text-muted-foreground",
        "flex flex-wrap items-center justify-center gap-x-2 gap-y-1",
        className
      )}
    >
      <span>
        &copy; <CurrentYear /> Mutige Mungos
      </span>
      <span>&#183;</span>
      <Link
        href={licenseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-2 hover:underline"
      >
        Open Source under MIT License
      </Link>
      <span>&#183;</span>
      <span className="inline-flex items-center gap-1.5">
        <VaultHunterIcon className="text-orange-500" />
        <span>Made for Vault Hunters</span>
      </span>
    </p>
  );
}

function Actions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="rounded-full border border-border/60 bg-background/70 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground active:scale-95 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Source on GitHub"
        >
          <Github className="h-5 w-5" aria-hidden />
          <span className="sr-only">Open source on GitHub</span>
        </Link>
      </Button>
    </div>
  );
}

const iconLinkClassName =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition transform-gpu hover:bg-muted/60 hover:text-foreground active:scale-95 focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn("border-t border-border/80 bg-background", className)}
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8 md:py-8">
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 md:w-auto md:justify-start">
            <Link href="/disclaimer" className={iconLinkClassName}>
              <InfoCircle className="h-5 w-5" aria-hidden />
              <span className="sr-only">Read disclaimer</span>
            </Link>
            <Link href="/bl4.rss" className={iconLinkClassName}>
              <RssFeed className="h-5 w-5" aria-hidden />
              <span className="sr-only">Subscribe via RSS</span>
            </Link>
            <Link href="/bl4.txt" className={iconLinkClassName}>
              <Download className="h-5 w-5" aria-hidden />
              <span className="sr-only">Download as .txt</span>
            </Link>
          </div>

          <Actions className="w-full justify-center gap-3 md:w-auto md:justify-end" />
        </div>
        <FooterMeta className="mt-6" />
      </div>
    </footer>
  );
}
