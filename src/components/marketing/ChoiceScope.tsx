"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
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

/** The charter's segmented selector: 48 high, a rule of Encre, the active option in Encre. aria-pressed. */
export const ChoiceToggle = ({ label, options, announcements, className }: ChoiceToggleProps) => {
  const state = useContext(ChoiceContext);
  const [announcement, setAnnouncement] = useState("");
  if (!state) throw new Error("ChoiceToggle needs a ChoiceScope around it.");

  return (
    <div className={className}>
      <div role="group" aria-label={label} className="flex h-[48px] rounded-sm border border-ink-900">
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
                "flex-1 px-5 text-body font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
                isActive ? "bg-ink-900 text-white" : "bg-white text-ink-900 hover:bg-paper-100",
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
