"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface CopyNotificationContextValue {
  notifyCopy: (message?: string) => void;
}

const CopyNotificationContext = createContext<
  CopyNotificationContextValue | undefined
>(undefined);

export function CopyNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notifyCopy = useCallback((customMessage?: string) => {
    setMessage(customMessage ?? "Code kopiert!");
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setMessage(null);
      timeoutRef.current = null;
    }, 2400);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [message]);

  return (
    <CopyNotificationContext.Provider value={{ notifyCopy }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div
          className={cn(
            "transform-gpu rounded-full border border-emerald-400/40 bg-emerald-500/90 px-5 py-2 text-sm font-medium text-white shadow-lg transition-all",
            message ? "opacity-100" : "pointer-events-none opacity-0 -translate-y-2",
          )}
          aria-live="polite"
        >
          {message ?? ""}
        </div>
      </div>
    </CopyNotificationContext.Provider>
  );
}

export function useCopyNotification(): CopyNotificationContextValue {
  const ctx = useContext(CopyNotificationContext);
  if (!ctx) {
    throw new Error(
      "useCopyNotification must be used within a CopyNotificationProvider",
    );
  }
  return ctx;
}
