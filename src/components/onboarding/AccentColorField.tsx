"use client";

import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES, OPTIONAL_MARK_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { MIN_ACCENT_CONTRAST_RATIO, calculateContrastRatio } from "@/lib/colors/contrast-ratio";

const PICKER_STARTING_COLOR = "#16213E";
const CARD_BACKGROUND = "#FFFFFF";

type AccentColorFieldProps = {
  value: string | null;
  onChange: (color: string | null) => void;
};

export const AccentColorField = ({ value, onChange }: AccentColorFieldProps) => {
  const isHardToRead = value !== null && calculateContrastRatio(value, CARD_BACKGROUND) < MIN_ACCENT_CONTRAST_RATIO;

  return (
    <fieldset className="flex min-w-[0] flex-col gap-3" aria-describedby="accent-color-hint">
      <legend className={cn(FIELD_LABEL_CLASSES, "mb-2")}>
        Couleur d&apos;accent <span className={OPTIONAL_MARK_CLASSES}>(facultatif)</span>
      </legend>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink">
          <span className="sr-only">Choisir la couleur d&apos;accent</span>
          <input
            type="color"
            value={value ?? PICKER_STARTING_COLOR}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            className="size-[30px] cursor-pointer appearance-none rounded-full border-0 bg-transparent p-[0] [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-[0]"
          />
        </label>
        <span className="text-small">{value ?? "Couleur des liens de votre page"}</span>
        {value ? (
          <button type="button" onClick={() => onChange(null)} className={DISCREET_BUTTON_CLASSES}>
            Retirer la couleur
          </button>
        ) : null}
      </div>
      <p id="accent-color-hint" className={FIELD_HINT_CLASSES}>
        Elle colore les étoiles de vos widgets. Sans choix, ils reprennent la couleur des liens de votre page de vente.
      </p>
      {isHardToRead ? (
        <p role="status" className="flex items-start gap-3 rounded-card bg-waiting-surface p-4 text-body font-bold text-waiting desktop:p-5">
          <Icon name="alert" size={24} className="shrink-0" />
          <span>Cette couleur ressort peu sur fond blanc : vos étoiles seraient peu lisibles. Choisissez-la plus foncée.</span>
        </p>
      ) : null}
      <input type="hidden" name="accentColor" value={value ?? ""} />
    </fieldset>
  );
};
