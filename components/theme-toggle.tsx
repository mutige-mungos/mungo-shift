"use client";

import { useEffect, useState } from "react";
import { HalfMoon, Laptop, SunLight } from "iconoir-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark" | "system";

const MODE_ORDER: ThemeMode[] = ["light", "dark", "system"];

function getNextMode(current: ThemeMode): ThemeMode {
  const index = MODE_ORDER.indexOf(current);
  const nextIndex = (index + 1) % MODE_ORDER.length;
  return MODE_ORDER[nextIndex];
}

function getTooltip(mode: ThemeMode): string {
  switch (mode) {
    case "light":
      return "Toggle theme (Light)";
    case "dark":
      return "Toggle theme (Dark)";
    default:
      return "Toggle theme (System)";
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentMode: ThemeMode = (theme as ThemeMode | undefined) ?? "system";

  const icon =
    currentMode === "system" ? (
      <Laptop className="h-5 w-5" aria-hidden />
    ) : resolvedTheme === "dark" ? (
      <HalfMoon className="h-5 w-5" aria-hidden />
    ) : (
      <SunLight className="h-5 w-5" aria-hidden />
    );

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full border border-border/60 bg-background/70 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground active:scale-95 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      onClick={() => setTheme(getNextMode(currentMode))}
      title={getTooltip(currentMode)}
      aria-label="Toggle theme"
    >
      {icon}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
