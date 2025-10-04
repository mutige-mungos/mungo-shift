"use client";

import { useEffect, useState } from "react";
import { HalfMoon, SunLight } from "iconoir-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const icon =
    nextTheme === "dark" ? (
      <HalfMoon className="h-5 w-5" aria-hidden />
    ) : (
      <SunLight className="h-5 w-5" aria-hidden />
    );
  const tooltip =
    nextTheme === "dark" ? "Switch to dark mode" : "Switch to light mode";

  const handleToggle = () => {
    setTheme(nextTheme);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full border border-border/60 bg-background/70 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground active:scale-95 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      onClick={handleToggle}
      title={tooltip}
      aria-label="Toggle theme"
    >
      {icon}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
