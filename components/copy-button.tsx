"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy as CopyIcon } from "iconoir-react";

import { Button } from "@/components/ui/button";
import { useCopyNotification } from "@/components/copy-notification-provider";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const COPY_SOUND_URL = "/audio/copy.ogg";

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
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioDataRef = useRef<ArrayBuffer | null>(null);
  const audioDataPromiseRef = useRef<Promise<ArrayBuffer | null> | null>(null);
  const audioBufferPromiseRef = useRef<Promise<AudioBuffer | null> | null>(null);

  const ensureAudioContext = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    const AudioContextConstructor =
      window.AudioContext ?? window.webkitAudioContext ?? null;

    if (!AudioContextConstructor) {
      return null;
    }

    audioContextRef.current = new AudioContextConstructor();
    return audioContextRef.current;
  }, []);

  const preloadAudioData = useCallback(async () => {
    if (audioDataRef.current) {
      return audioDataRef.current;
    }

    if (!audioDataPromiseRef.current) {
      audioDataPromiseRef.current = fetch(COPY_SOUND_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to preload copy sound (${response.status})`,
            );
          }
          return response.arrayBuffer();
        })
        .then((data) => {
          audioDataRef.current = data;
          return data;
        })
        .catch((error) => {
          console.error("Failed to preload copy sound", error);
          audioDataRef.current = null;
          audioDataPromiseRef.current = null;
          return null;
        });
    }

    return audioDataPromiseRef.current;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    void preloadAudioData();

    return () => {
      const context = audioContextRef.current;
      audioContextRef.current = null;
      audioBufferRef.current = null;
      audioDataRef.current = null;
      audioDataPromiseRef.current = null;
      audioBufferPromiseRef.current = null;
      if (context) {
        void context.close();
      }
    };
  }, [preloadAudioData]);

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

  const loadAudioBuffer = useCallback(
    async (context: AudioContext) => {
      if (audioBufferRef.current) {
        return audioBufferRef.current;
      }

      if (!audioBufferPromiseRef.current) {
        audioBufferPromiseRef.current = (async () => {
          const data = await preloadAudioData();

          if (!data) {
            return null;
          }

          try {
            const buffer = await new Promise<AudioBuffer>(
              (resolve, reject) => {
                context.decodeAudioData(data.slice(0), resolve, reject);
              },
            );
            audioBufferRef.current = buffer;
            return buffer;
          } catch (error) {
            console.error("Failed to decode copy sound", error);
            return null;
          }
        })();
      }

      const buffer = await audioBufferPromiseRef.current;

      if (!buffer) {
        audioBufferPromiseRef.current = null;
      }

      return buffer;
    },
    [preloadAudioData],
  );

  const playCopySound = useCallback(async () => {
    try {
      const context = ensureAudioContext();

      if (!context) {
        return;
      }

      if (context.state === "suspended") {
        try {
          await context.resume();
        } catch (error) {
          console.error("Failed to resume audio context", error);
          return;
        }
      }

      const buffer = await loadAudioBuffer(context);

      if (!buffer) {
        return;
      }

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    } catch (error) {
      console.error("Failed to play copy sound", error);
    }
  }, [ensureAudioContext, loadAudioBuffer]);

  const triggerHaptics = useCallback(() => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      navigator.vibrate(20);
    }
  }, []);

  const playFeedback = useCallback(() => {
    void playCopySound();
    triggerHaptics();
  }, [playCopySound, triggerHaptics]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setHasCopied(true);
      notifyCopy(`Code ${value} wurde kopiert`);
      onCopied?.(value);
      playFeedback();
    } catch (error) {
      console.error("Failed to copy code", error);
      setCopied(false);
    }
  }, [notifyCopy, onCopied, playFeedback, value]);

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
