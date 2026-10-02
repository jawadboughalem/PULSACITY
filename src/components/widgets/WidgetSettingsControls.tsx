"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { nameColor } from "@/lib/colors/name-color";
import type { WidgetCardStyle, WidgetTheme, WidgetType } from "../../../widget/src/payload";
import { WIDGET_TYPE_OPTIONS } from "./describe-widget";

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

export const INK = "#16213E";

export const CARMINE = "#A3243B";

type TypePickerProps = { value: WidgetType; onChange: (type: WidgetType) => void };

/** Maquette 6, « Type »: three tiles, the chosen one on Paper with an Ink border. */
export const WidgetTypePicker = ({ value, onChange }: TypePickerProps) => (
  <fieldset className="flex min-w-[0] flex-col">
    <legend className="mb-2 text-small font-semibold">Type</legend>
    <div className="grid grid-cols-3 gap-2">
      {WIDGET_TYPE_OPTIONS.map((option) => {
        const isChosen = option.type === value;
        return (
          <button
            key={option.type}
            type="button"
            aria-pressed={isChosen}
            onClick={() => onChange(option.type)}
            className={cn(
              "flex h-[72px] flex-col items-center justify-center gap-1 rounded-sm text-body text-ink-900",
              FOCUS_RING,
              isChosen ? "border-2 border-ink-900 bg-paper-100 font-semibold" : "border border-gray-400 bg-white hover:bg-paper-100",
            )}
          >
            <Icon name={option.icon} size={24} />
            {option.label}
          </button>
        );
      })}
    </div>
  </fieldset>
);

type Swatch = { value: string | null; color: string | null; name: string };

/** The page's own colour first (that of the space, or else of the links of the page), then Encre and Carmin. */
export const buildSwatches = (pageAccent: string | null, chosen: string | null): Swatch[] => {
  const swatches: Swatch[] = [
    {
      value: null,
      color: pageAccent,
      name: pageAccent ? `${nameColor(pageAccent)} de votre page · ${pageAccent}` : "Couleur des liens de votre page",
    },
    { value: INK, color: INK, name: `Encre · ${INK}` },
    { value: CARMINE, color: CARMINE, name: `Carmin · ${CARMINE}` },
  ];
  if (chosen && !swatches.some((swatch) => swatch.value === chosen)) {
    swatches.push({ value: chosen, color: chosen, name: `Couleur choisie · ${chosen}` });
  }
  return swatches;
};

type AccentSwatchesProps = {
  swatches: Swatch[];
  value: string | null;
  onChange: (accentColor: string | null) => void;
};

export const AccentSwatches = ({ swatches, value, onChange }: AccentSwatchesProps) => {
  const chosen = swatches.find((swatch) => swatch.value === value) ?? swatches[0];
  return (
    <fieldset className="flex min-w-[0] flex-col gap-3">
      <legend className="mb-2 text-small font-semibold">Couleur d&apos;accent</legend>
      <div className="flex items-center gap-3">
        <div className="flex shrink-0">
          {swatches.map((swatch) => {
            const isChosen = swatch === chosen;
            return (
              <button
                key={swatch.name}
                type="button"
                aria-pressed={isChosen}
                aria-label={swatch.name}
                onClick={() => onChange(swatch.value)}
                className={cn("flex size-[44px] items-center justify-center rounded-full", FOCUS_RING)}
              >
                <span
                  className={cn(
                    "flex size-[36px] items-center justify-center rounded-full border-2 p-[2px]",
                    isChosen ? "border-ink-900" : "border-transparent",
                  )}
                >
                  {swatch.color ? (
                    <span className="size-full rounded-full" style={{ backgroundColor: swatch.color }} />
                  ) : (
                    <span className="flex size-full items-center justify-center rounded-full border border-gray-400 bg-white text-ink-900">
                      <Icon name="connection" size={16} />
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <p className="min-w-[0] text-small text-slate-600">{chosen.name}</p>
      </div>
    </fieldset>
  );
};

export type AccentWarning = { text: string; offersInk: boolean };

type AccentWarningNoteProps = { warning: AccentWarning | null; onUseInk: () => void };

/**
 * Below the theme, so that it never moves the control being used. The charter proposes Encre on light cards only:
 * on dark cards it would show even less.
 */
export const AccentWarningNote = ({ warning, onUseInk }: AccentWarningNoteProps) => (
  <div role="status" className={cn("flex flex-col items-start gap-1", !warning && "hidden")}>
    {warning ? (
      <>
        <p className="flex items-start gap-2 text-small text-attention">
          <Icon name="alert" size={20} />
          <span>{warning.text}</span>
        </p>
        {warning.offersInk ? (
          <button
            type="button"
            onClick={onUseInk}
            className={cn("min-h-[44px] px-1 text-small font-semibold text-carmine hover:text-carmine-dark hover:underline", FOCUS_RING)}
          >
            Utiliser Encre
          </button>
        ) : null}
      </>
    ) : null}
  </div>
);

type SegmentedChoiceProps<Value extends string> = {
  id: string;
  label: string;
  options: Array<{ value: Value; label: string }>;
  value: Value;
  hint: string;
  onChange: (value: Value) => void;
};

/** The charter's segmented selector: Ink for the chosen option, aria-pressed on each. */
const SegmentedChoice = <Value extends string>({ id, label, options, value, hint, onChange }: SegmentedChoiceProps<Value>) => (
  <div className="flex flex-col gap-2">
    <p id={id} className="text-small font-semibold">
      {label}
    </p>
    <div
      role="group"
      aria-labelledby={id}
      className="grid h-[48px] grid-flow-col auto-cols-fr rounded-sm border border-ink-900"
    >
      {options.map((option) => {
        const isChosen = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isChosen}
            onClick={() => onChange(option.value)}
            className={cn(
              "text-body font-semibold",
              FOCUS_RING,
              isChosen ? "bg-ink-900 text-white" : "bg-white text-ink-900 hover:bg-paper-100",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
    <p className="text-small text-slate-600">{hint}</p>
  </div>
);

const THEME_OPTIONS: Array<{ value: WidgetTheme; label: string }> = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "auto", label: "Auto" },
];

export const ThemeSelector = ({ value, onChange }: { value: WidgetTheme; onChange: (theme: WidgetTheme) => void }) => (
  <SegmentedChoice
    id="widget-theme-label"
    label="Thème"
    options={THEME_OPTIONS}
    value={value}
    hint="Auto suit le fond de votre page."
    onChange={onChange}
  />
);

const CARD_STYLE_OPTIONS: Array<{ value: WidgetCardStyle; label: string }> = [
  { value: "sharp", label: "Droits" },
  { value: "soft", label: "Arrondis" },
];

/** Maquette 6, « Coins des cartes »: 2 px or 16 px, like the buttons of the creator's page. */
export const CardStyleSelector = ({
  value,
  onChange,
}: {
  value: WidgetCardStyle;
  onChange: (cardStyle: WidgetCardStyle) => void;
}) => (
  <SegmentedChoice
    id="widget-card-style-label"
    label="Coins des cartes"
    options={CARD_STYLE_OPTIONS}
    value={value}
    hint="Choisissez comme les boutons de votre page."
    onChange={onChange}
  />
);
