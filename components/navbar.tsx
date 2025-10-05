"use client";

import { NavArrowDown, OpenNewWindow } from "iconoir-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { GearboxIcon } from "@/components/gearbox-icon";
import Link from "next/link";
import { ShiftLogoIcon } from "@/components/shift-logo-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const redeemUrl = "https://shift.gearboxsoftware.com/rewards";

const toolsLinks = [
  {
    label: "Karte",
    href: "https://mapgenie.io/borderlands-4/maps/kairos",
  },
  {
    label: "Skill Planner",
    href: "https://maxroll.gg/borderlands-4/planner",
  },
  {
    label: "Update Notes",
    href: "https://borderlands.2k.com/borderlands-4/update-notes/",
  },
];

interface NavLinkProps {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1 text-sm font-medium transition-colors",
        "text-muted-foreground hover:text-foreground",
        isActive && "bg-orange-500/20 text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!toolsOpen) {
      return;
    }

    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setToolsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [toolsOpen]);

  const toggleTools = useCallback(() => {
    setToolsOpen((previous) => !previous);
  }, []);

  const closeTools = useCallback(() => setToolsOpen(false), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-8 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
            aria-label="SHiFT Codes home"
          >
            <ShiftLogoIcon className="h-6 w-6 text-orange-500" aria-hidden />
            <span className="text-base font-semibold uppercase tracking-wide text-orange-500">
              SHiFT
            </span>
            <span className="text-sm font-medium tracking-[0.02em] text-foreground">
              Codes
            </span>
          </Link>

          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-3">
            <NavLink href="/" isActive={pathname === "/"}>
              Home
            </NavLink>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={toggleTools}
                className={cn(
                  "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors",
                  "text-muted-foreground hover:text-foreground",
                  toolsOpen && "bg-orange-500/20 text-foreground"
                )}
                aria-haspopup="menu"
                aria-expanded={toolsOpen}
              >
                Tools
                <NavArrowDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    toolsOpen ? "rotate-180" : "rotate-0"
                  )}
                  aria-hidden
                />
              </button>
              {toolsOpen ? (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl bg-white/70 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-110 border border-black/5 shadow-md shadow-black/5 text-neutral-900 dark:bg-neutral-900/80 dark:backdrop-brightness-100 dark:border-white/10 dark:shadow-black/40 dark:text-neutral-100 isolate"
                >
                  <ul className="py-1 text-sm text-muted-foreground">
                    {toolsLinks.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-muted/60 hover:text-foreground"
                          role="menuitem"
                          onClick={closeTools}
                        >
                          <span>{item.label}</span>
                          <OpenNewWindow
                            className="h-4 w-4 opacity-70"
                            aria-hidden
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-2">
            <Button
              asChild
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow transition-colors hover:bg-orange-500/90 sm:text-sm"
            >
              <Link
                href={redeemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <GearboxIcon className="h-4 w-4" aria-hidden />
                Code einlösen
              </Link>
            </Button>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
