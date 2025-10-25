"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HalfMoon, SunLight } from "iconoir-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const audio = new Audio("/audio/switch.ogg");
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const currentTheme = useMemo(() => {
    if (!mounted) {
      return null;
    }

    if (theme === "system") {
      return resolvedTheme;
    }

    return theme;
  }, [mounted, theme, resolvedTheme]);

  if (!mounted || !currentTheme) {
    return null;
  }

  const isDark = currentTheme === "dark";

  const handleSelect = (mode: "light" | "dark") => {
    if ((mode === "dark" && isDark) || (mode === "light" && !isDark)) {
      return;
    }

    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        void audioRef.current.play();
      } catch (error) {
        console.error("Failed to play switch sound", error);
      }
    }

    setTheme(mode);
  };

  return (
    <div
      role="group"
      aria-label="Theme toggle"
      className={cn(
        "relative inline-flex overflow-hidden rounded-full border border-black/5 bg-white/60 p-1 text-xs backdrop-blur-xl backdrop-brightness-105 backdrop-saturate-150 shadow-sm shadow-black/5 transition-colors dark:border-white/10 dark:bg-neutral-900/60 dark:shadow-black/40",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-1 w-10 rounded-full bg-neutral-900/70 shadow-md shadow-black/30 transition-transform duration-200 ease-out outline outline-1 outline-black/5 dark:bg-white/80 dark:shadow-white/20 dark:outline-white/20",
          isDark ? "translate-x-0" : "translate-x-[calc(100%+0.25rem)]",
        )}
      />
      <button
        type="button"
        onClick={() => handleSelect("dark")}
        className={cn(
          "relative z-10 flex h-8 w-10 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
          isDark
            ? "text-white"
            : "text-neutral-600 hover:text-neutral-700 dark:text-neutral-300",
        )}
        aria-pressed={isDark}
        aria-label="Dark mode"
      >
        <HalfMoon className="h-4 w-4" aria-hidden />
        <span className="sr-only">Dark mode</span>
      </button>
      <button
        type="button"
        onClick={() => handleSelect("light")}
        className={cn(
          "relative z-10 flex h-8 w-10 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
          !isDark
            ? "text-white"
            : "text-neutral-600 hover:text-neutral-300",
        )}
        aria-pressed={!isDark}
        aria-label="Light mode"
      >
        <SunLight className="h-4 w-4" aria-hidden />
        <span className="sr-only">Light mode</span>
      </button>
    </div>
  );
}
