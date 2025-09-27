"use client";

import { useEffect, useState } from "react";
import { HalfMoon, SunLight } from "iconoir-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-full border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-orange-300 hover:text-orange-500 sm:px-4 sm:py-2 sm:text-sm"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <SunLight className="h-4 w-4" aria-hidden />
      ) : (
        <HalfMoon className="h-4 w-4" aria-hidden />
      )}
      <span>{isDark ? "Hell" : "Dunkel"}</span>
    </Button>
  );
}
