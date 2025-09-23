"use client";

import { useCallback, useEffect, useState } from "react";
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
      variant={copied ? "secondary" : "default"}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
