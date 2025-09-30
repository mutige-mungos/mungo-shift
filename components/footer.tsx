import Link from "next/link";
import { Download, Github, InfoCircle, RssFeed } from "iconoir-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ShiftLogoIcon } from "@/components/shift-logo-icon";
import { cn } from "@/lib/utils";

const githubUrl = "https://github.com/mutige-mungos/mungo-shift";

function Actions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ThemeToggle />
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
    <footer className={cn("border-t border-border/80 bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8 md:py-8">
        <div className="flex flex-col items-center gap-5 md:grid md:grid-cols-3 md:items-center md:gap-x-6">
          <div className="flex items-center justify-center gap-2 text-base font-semibold text-foreground md:justify-start">
            <ShiftLogoIcon className="h-6 w-6" aria-hidden />
            <span>SHiFT Codes</span>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-center">
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
            <Actions className="w-full justify-center gap-3 md:hidden" />
          </div>

          <div className="hidden w-full flex-col items-center gap-2 text-xs text-muted-foreground md:flex md:items-end">
            <Actions className="justify-end gap-2" />
            <span className="text-right">© Mutige Mungos 2025</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center gap-2 text-center text-xs text-muted-foreground md:hidden">
          <span>© Mutige Mungos 2025</span>
        </div>
      </div>
    </footer>
  );
}
