"use client";

import { FieldError } from "@/components/ui/FieldError";
import { FIELD_CLASSES, FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import { MIN_ACCENT_CONTRAST_RATIO, calculateContrastRatio } from "@/lib/colors/contrast-ratio";
import { readTypedColor } from "@/lib/colors/read-typed-color";

const PICKER_STARTING_COLOR = "#16213E";
const CARD_BACKGROUND = "#FFFFFF";

type SettingsAccentColorFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

/**
 * Réglages, Couleur d'accent: a 56 square that opens the picker, and the code, typed or picked. Below 3:1 on white, the
 * alert of m11, which never prevents saving.
 */
export const SettingsAccentColorField = ({ value, onChange, error }: SettingsAccentColorFieldProps) => {
  const color = readTypedColor(value);
  const isHardToRead = color !== null && calculateContrastRatio(color, CARD_BACKGROUND) < MIN_ACCENT_CONTRAST_RATIO;
  const describedBy = cn("accent-color-hint", isHardToRead && "accent-color-alert", error && "accent-color-error");

  return (
    <div className="flex min-w-[0] flex-col gap-2">
      <label htmlFor="accentColor" className={FIELD_LABEL_CLASSES}>
        Couleur d&apos;accent
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label="Choisir la couleur d'accent"
          value={color ?? PICKER_STARTING_COLOR}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className={cn(
            "pz-couleur size-[56px] shrink-0 cursor-pointer appearance-none rounded-field border-2 border-gray bg-white p-[0] hover:border-ink",
            "[&::-moz-color-swatch]:rounded-[12px] [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-[12px] [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-[0]",
            FOCUS_RING,
          )}
        />
        <input
          id="accentColor"
          name="accentColor"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Couleur des liens de votre page"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={7}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={FIELD_CLASSES}
        />
      </div>
      {error ? <FieldError id="accent-color-error" message={error} /> : null}
      {isHardToRead ? (
        <p id="accent-color-alert" role="status" className="flex items-start gap-[6px] text-small text-waiting">
          <Icon name="alert" size={20} className="mt-[1px]" />
          <span>Cette couleur ressort peu sur fond blanc : vos étoiles seraient peu lisibles. Choisissez-la plus foncée.</span>
        </p>
      ) : null}
      <p id="accent-color-hint" className={FIELD_HINT_CLASSES}>
        Elle colore le bouton de votre page de collecte, vos étoiles et vos widgets.
      </p>
    </div>
  );
};
