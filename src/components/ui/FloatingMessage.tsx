"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "./Icon";

const VISIBLE_MS = 4000;

type ShownMessage = { text: string; id: number };

/** One message at a time: a new one replaces the one on screen, and stays its own 4 s. */
export const useFloatingMessage = () => {
  const [message, setMessage] = useState<ShownMessage | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [message]);

  const show = useCallback((text: string) => setMessage({ text, id: Date.now() }), []);

  return { message, show };
};

type FloatingMessageProps = {
  message: ShownMessage | null;
};

/**
 * Charte v2, Message après une action, flottant: Encre, white text 15/22 600, a Soleil check 20, radius-card, padding
 * 14 20, the floating shadow; at the bottom in the middle, above the tab bar on a phone; 4 s; never a button. The live
 * region stays in the page, so that a screen reader announces each message.
 */
export const FloatingMessage = ({ message }: FloatingMessageProps) => (
  <div
    role="status"
    className="pointer-events-none fixed inset-x-[0] bottom-[108px] z-30 flex justify-center px-page-gutter desktop:bottom-8"
  >
    {message ? (
      <p
        key={message.id}
        data-ouvert="true"
        className="pz-flottant flex items-center gap-3 rounded-card bg-ink px-5 py-[14px] text-small font-semibold text-white shadow-float"
      >
        <Icon name="check" size={20} className="shrink-0 text-sun" />
        {message.text}
      </p>
    ) : null}
  </div>
);
