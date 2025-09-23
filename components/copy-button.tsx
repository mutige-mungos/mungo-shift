"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy as CopyIcon } from "iconoir-react";

import { Button } from "@/components/ui/button";

export interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

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
    } catch (error) {
      console.error("Failed to copy code", error);
      setCopied(false);
    }
  }, [value]);

  return (
    <Button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Code copied" : `Copy ${value}`}
      variant={copied ? "secondary" : "outline"}
      size="icon"
      className="rounded-full transition-colors hover:border-orange-400/60 hover:text-orange-500"
      title={copied ? "Code kopiert" : "Code kopieren"}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <CopyIcon className="h-4 w-4" aria-hidden />
      )}
      <span className="sr-only">{copied ? "Code copied" : "Copy code"}</span>
    </Button>
  );
}
