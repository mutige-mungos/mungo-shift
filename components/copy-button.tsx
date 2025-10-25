"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy as CopyIcon } from "iconoir-react";

import { Button } from "@/components/ui/button";
import { useCopyNotification } from "@/components/copy-notification-provider";

export interface CopyButtonProps {
  value: string;
  initiallyCopied?: boolean;
  onCopied?: (value: string) => void;
}

export function CopyButton({
  value,
  initiallyCopied = false,
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [hasCopied, setHasCopied] = useState(initiallyCopied);
  const { notifyCopy } = useCopyNotification();

  useEffect(() => {
    setHasCopied(initiallyCopied);
  }, [initiallyCopied]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setHasCopied(true);
      notifyCopy(`Code ${value} wurde kopiert`);
      onCopied?.(value);
    } catch (error) {
      console.error("Failed to copy code", error);
      setCopied(false);
    }
  }, [notifyCopy, onCopied, value]);

  const hasCopiedBefore = hasCopied;
  const isActive = copied;

  return (
    <Button
      type="button"
      onClick={handleCopy}
      aria-label={hasCopiedBefore ? "Code bereits kopiert" : `Copy ${value}`}
      variant="outline"
      size="icon"
      className="h-9 w-9 rounded-full border border-border/70 bg-background/80 text-muted-foreground transition-transform transition-colors hover:border-orange-400/60 hover:text-orange-500 sm:h-10 sm:w-10 data-[copied=true]:border-emerald-400/60 data-[copied=true]:text-emerald-500 data-[active=true]:scale-105"
      title={hasCopiedBefore ? "Code kopiert" : "Code kopieren"}
      data-copied={hasCopiedBefore}
      data-active={isActive}
    >
      <CopyIcon className="h-4 w-4" aria-hidden />
      <span className="sr-only">
        {hasCopiedBefore ? "Code copied" : "Copy code"}
      </span>
    </Button>
  );
}
