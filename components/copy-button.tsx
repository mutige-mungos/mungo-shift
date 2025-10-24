"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy as CopyIcon } from "iconoir-react";

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

  const showCopiedState = copied || hasCopied;

  return (
    <Button
      type="button"
      onClick={handleCopy}
      aria-label={showCopiedState ? "Code copied" : `Copy ${value}`}
      variant={showCopiedState ? "secondary" : "outline"}
      size="icon"
      className="rounded-full transition-colors hover:border-orange-400/60 hover:text-orange-500 data-[copied=true]:border-emerald-400/60 data-[copied=true]:text-emerald-500"
      title={showCopiedState ? "Code kopiert" : "Code kopieren"}
      data-copied={showCopiedState}
    >
      {showCopiedState ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <CopyIcon className="h-4 w-4" aria-hidden />
      )}
      <span className="sr-only">
        {showCopiedState ? "Code copied" : "Copy code"}
      </span>
    </Button>
  );
}
