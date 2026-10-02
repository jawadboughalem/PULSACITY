"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveWidget } from "@/app/app/(espace)/widgets/widget-actions";
import type { WidgetEdit } from "@/lib/widgets/widget-settings";

export type SaveState = "saved" | "saving" | "failed";

/** A typed number waits this long before saving, so that « 12 » is not saved as « 1 » then « 12 ». */
export const TYPING_PAUSE_MS = 600;

/**
 * « Enregistré automatiquement »: each change saves the whole widget. Only the answer to the latest save counts, and
 * a save still waiting when the editor closes goes out at once.
 */
export const useWidgetAutosave = (widgetId: string) => {
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const latestSave = useRef(0);
  const pending = useRef<{ timer: number; edit: WidgetEdit } | null>(null);
  const lastEdit = useRef<WidgetEdit | null>(null);

  const send = useCallback(
    (edit: WidgetEdit) => {
      pending.current = null;
      lastEdit.current = edit;
      latestSave.current += 1;
      const ticket = latestSave.current;
      setSaveState("saving");
      saveWidget(widgetId, edit)
        .then((result) => {
          if (ticket === latestSave.current) setSaveState(result.ok ? "saved" : "failed");
        })
        .catch(() => {
          if (ticket === latestSave.current) setSaveState("failed");
        });
    },
    [widgetId],
  );

  const schedule = useCallback(
    (edit: WidgetEdit, delayMs = 0) => {
      if (pending.current) window.clearTimeout(pending.current.timer);
      const timer = window.setTimeout(() => send(edit), delayMs);
      pending.current = { timer, edit };
    },
    [send],
  );

  const retry = useCallback(() => {
    if (lastEdit.current) send(lastEdit.current);
  }, [send]);

  useEffect(
    () => () => {
      if (!pending.current) return;
      window.clearTimeout(pending.current.timer);
      void saveWidget(widgetId, pending.current.edit);
    },
    [widgetId],
  );

  return { saveState, schedule, retry };
};
