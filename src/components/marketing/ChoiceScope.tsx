"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { ChoiceButtons } from "./ChoiceButtons";

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

/** The buttons of a ChoiceScope: Mensuel / Annuel on Tarifs, the plan to compare on a phone. */
export const ChoiceToggle = ({ label, options, announcements, className }: ChoiceToggleProps) => {
  const state = useContext(ChoiceContext);
  if (!state) throw new Error("ChoiceToggle needs a ChoiceScope around it.");
  return (
    <ChoiceButtons
      label={label}
      options={options}
      value={state.value}
      onChoose={state.choose}
      announcement={(value) => announcements[value] ?? ""}
      className={className}
    />
  );
};
