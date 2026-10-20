"use client";

import { useState } from "react";
import {
  SEGMENTED_CLASSES,
  SEGMENTED_OPTION_CHOSEN_CLASSES,
  SEGMENTED_OPTION_CLASSES,
  SEGMENTED_OPTION_IDLE_CLASSES,
} from "@/components/ui/segmented-styles";
import { cn } from "@/lib/cn";

type ChoiceButtonsProps<Value extends string> = {
  label: string;
  options: ReadonlyArray<{ value: Value; label: string }>;
  value: Value;
  onChoose: (value: Value) => void;
  /** Read once the choice changes, for screen readers: what the page now shows. */
  announcement: (value: Value) => string;
  className?: string;
};

/**
 * Charte v2, Bascule à deux choix and Onglets de panneau: a Ciel pill, padding 4, the chosen option in Encre with white
 * text (aria-pressed). Mensuel / Annuel on Tarifs, Mur / Carrousel / Badge on the home.
 */
export const ChoiceButtons = <Value extends string>({
  label,
  options,
  value,
  onChoose,
  announcement,
  className,
}: ChoiceButtonsProps<Value>) => {
  const [spoken, setSpoken] = useState("");
  return (
    <div className={className}>
      <div role="group" aria-label={label} className={SEGMENTED_CLASSES}>
        {options.map((option) => {
          const isChosen = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isChosen}
              onClick={() => {
                onChoose(option.value);
                setSpoken(announcement(option.value));
              }}
              className={cn(SEGMENTED_OPTION_CLASSES, isChosen ? SEGMENTED_OPTION_CHOSEN_CLASSES : SEGMENTED_OPTION_IDLE_CLASSES)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p role="status" className="sr-only">
        {spoken}
      </p>
    </div>
  );
};
