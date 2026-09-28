"use client";

import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
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
      <legend className="mb-2 text-small font-semibold">
        Couleur d&apos;accent <span className="font-normal text-slate-600">(facultatif)</span>
      </legend>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-ink-900 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink-900">
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
      <p id="accent-color-hint" className="text-small text-slate-600">
        Elle colore les étoiles de vos widgets. Sans choix, ils reprennent la couleur des liens de votre page de vente.
      </p>
      {isHardToRead ? (
        <p role="status" className="flex items-start gap-2 text-small text-attention">
          <Icon name="alert" size={20} />
          <span>Cette couleur ressort peu sur fond blanc : vos étoiles seraient peu lisibles. Choisissez-la plus foncée.</span>
        </p>
      ) : null}
      <input type="hidden" name="accentColor" value={value ?? ""} />
    </fieldset>
  );
};
