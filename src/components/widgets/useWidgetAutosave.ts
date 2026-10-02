"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveWidget } from "@/app/app/(espace)/widgets/widget-actions";
import type { WidgetChange } from "@/lib/widgets/widget-settings";

export type SaveState = "saved" | "saving" | "failed";

/** A typed number waits this long before saving, so that « 12 » is not saved as « 1 » then « 12 ». */
export const TYPING_PAUSE_MS = 600;

/**
 * « Enregistré automatiquement »: each change saves what the creator just changed, and only that, so that an editor
 * left open elsewhere, on the phone for instance, overwrites nothing. Saves go out one after the other, in order. A
 * change whose save failed rides along the next save, or « Réessayer », and a save still waiting when the editor
 * closes goes out at once.
 */
export const useWidgetAutosave = (widgetId: string) => {
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const latestSave = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const unsaved = useRef<WidgetChange>({});
  const pending = useRef<{ timer: number; change: WidgetChange } | null>(null);

  const send = useCallback(
    (change: WidgetChange) => {
      pending.current = null;
      latestSave.current += 1;
      const ticket = latestSave.current;
      setSaveState("saving");
      queue.current = queue.current.then(async () => {
        const toSave = { ...unsaved.current, ...change };
        unsaved.current = {};
        const isSaved = await saveWidget(widgetId, toSave).then(
          (result) => result.ok,
          () => false,
        );
        if (!isSaved) unsaved.current = toSave;
        if (ticket === latestSave.current) setSaveState(isSaved ? "saved" : "failed");
      });
    },
    [widgetId],
  );

  const schedule = useCallback(
    (change: WidgetChange, delayMs = 0) => {
      const waiting = pending.current;
      if (waiting) window.clearTimeout(waiting.timer);
      const merged = { ...waiting?.change, ...change };
      const timer = window.setTimeout(() => send(merged), delayMs);
      pending.current = { timer, change: merged };
    },
    [send],
  );

  const retry = useCallback(() => send({}), [send]);

  useEffect(
    () => () => {
      const waiting = pending.current;
      if (!waiting) return;
      window.clearTimeout(waiting.timer);
      send(waiting.change);
    },
    [send],
  );

  return { saveState, schedule, retry };
};
