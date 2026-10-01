"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { nameColor } from "@/lib/colors/name-color";
import type { WidgetTheme, WidgetType } from "../../../widget/src/payload";
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
  warning: string | null;
  onChange: (accentColor: string | null) => void;
  onUseInk: () => void;
};

export const AccentSwatches = ({ swatches, value, warning, onChange, onUseInk }: AccentSwatchesProps) => {
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
      {warning ? (
        <div role="status" className="flex flex-col items-start gap-1">
          <p className="flex items-start gap-2 text-small text-attention">
            <Icon name="alert" size={20} />
            <span>{warning}</span>
          </p>
          {value !== INK ? (
            <button
              type="button"
              onClick={onUseInk}
              className={cn("min-h-[44px] px-1 text-small font-semibold text-carmine hover:text-carmine-dark hover:underline", FOCUS_RING)}
            >
              Utiliser Encre
            </button>
          ) : null}
        </div>
      ) : null}
    </fieldset>
  );
};

const THEME_OPTIONS: Array<{ value: WidgetTheme; label: string }> = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "auto", label: "Auto" },
];

type ThemeSelectorProps = { value: WidgetTheme; onChange: (theme: WidgetTheme) => void };

/** The charter's segmented selector: Ink for the chosen option, aria-pressed on each. */
export const ThemeSelector = ({ value, onChange }: ThemeSelectorProps) => (
  <div className="flex flex-col gap-2">
    <p id="widget-theme-label" className="text-small font-semibold">
      Thème
    </p>
    <div role="group" aria-labelledby="widget-theme-label" className="grid h-[48px] grid-cols-3 rounded-sm border border-ink-900">
      {THEME_OPTIONS.map((option) => {
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
    <p className="text-small text-slate-600">Auto suit le fond de votre page.</p>
  </div>
);
