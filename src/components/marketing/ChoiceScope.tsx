"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import {
  SEGMENTED_CLASSES,
  SEGMENTED_OPTION_CHOSEN_CLASSES,
  SEGMENTED_OPTION_CLASSES,
  SEGMENTED_OPTION_IDLE_CLASSES,
} from "@/components/ui/segmented-styles";
import { cn } from "@/lib/cn";

type ChoiceState = { value: string; choose: (value: string) => void };

const ChoiceContext = createContext<ChoiceState | null>(null);

type ChoiceScopeProps = {
  initial: string;
  /** A named Tailwind group, « group/billing »: the content reacts with group-data-[choice=…]/billing. */
  className: string;
  children: ReactNode;
};

/**
 * One choice for a part of a page, such as Mensuel or Annuel on m8. The content is rendered on the server with every
 * option; the scope only says which one shows, through data-choice.
 */
export const ChoiceScope = ({ initial, className, children }: ChoiceScopeProps) => {
  const [value, choose] = useState(initial);
  return (
    <ChoiceContext.Provider value={{ value, choose }}>
      <div data-choice={value} className={className}>
        {children}
      </div>
    </ChoiceContext.Provider>
  );
};

type ChoiceToggleProps = {
  label: string;
  options: Array<{ value: string; label: string }>;
  /** Read once the choice changes, for screen readers: what the page now shows, option by option. */
  announcements: Record<string, string>;
  className?: string;
};

/** Charte v2, Bascule à deux choix (Mensuel / Annuel): the chosen option in Encre. aria-pressed. */
export const ChoiceToggle = ({ label, options, announcements, className }: ChoiceToggleProps) => {
  const state = useContext(ChoiceContext);
  const [announcement, setAnnouncement] = useState("");
  if (!state) throw new Error("ChoiceToggle needs a ChoiceScope around it.");

  return (
    <div className={className}>
      <div role="group" aria-label={label} className={SEGMENTED_CLASSES}>
        {options.map((option) => {
          const isActive = option.value === state.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                state.choose(option.value);
                setAnnouncement(announcements[option.value] ?? "");
              }}
              className={cn(
                SEGMENTED_OPTION_CLASSES,
                isActive ? SEGMENTED_OPTION_CHOSEN_CLASSES : SEGMENTED_OPTION_IDLE_CLASSES,
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </div>
  );
};
