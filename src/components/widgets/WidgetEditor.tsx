"use client";

import Link from "next/link";
import { useCallback, useId, useMemo, useState } from "react";
import { BILLING_HREF, TESTIMONIALS_SECTION_HREF, WIDGETS_SECTION_HREF } from "@/components/space/space-sections";
import { useCopyLink } from "@/components/space/useCopyLink";
import { DISCREET_BUTTON_CLASSES, INLINE_LINK_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Checkbox } from "@/components/ui/Checkbox";
import { FieldError } from "@/components/ui/FieldError";
import {
  FIELD_CLASSES,
  FIELD_HINT_CLASSES,
  FIELD_LABEL_CLASSES,
  OPTIONAL_MARK_CLASSES,
} from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import {
  SEGMENTED_CLASSES,
  SEGMENTED_OPTION_CHOSEN_CLASSES,
  SEGMENTED_OPTION_CLASSES,
  SEGMENTED_OPTION_IDLE_CLASSES,
} from "@/components/ui/segmented-styles";
import { SelectControl } from "@/components/ui/SelectControl";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";
import { MIN_ACCENT_CONTRAST_RATIO, calculateContrastRatio } from "@/lib/colors/contrast-ratio";
import { type PreviewLook, buildPreviewPayload } from "@/lib/widgets/build-preview-payload";
import { buildWidgetSnippet } from "@/lib/widgets/build-widget-snippet";
import type { WidgetPreviewData } from "@/lib/widgets/load-widget-preview";
import {
  type EditableWidget,
  MAX_WIDGET_MAX_ITEMS,
  MAX_WIDGET_NAME_LENGTH,
  MIN_WIDGET_MAX_ITEMS,
  type WidgetEdit,
} from "@/lib/widgets/widget-settings";
import type { WidgetPayload } from "../../../widget/src/payload";
import { ALL_OFFERS_LABEL, describeWidget } from "./describe-widget";
import { SystemePasteGuide } from "./SystemePasteGuide";
import { TYPING_PAUSE_MS, type SaveState, useWidgetAutosave } from "./useWidgetAutosave";
import { WidgetInstallPanel } from "./WidgetInstallPanel";
import { WidgetPreview } from "./WidgetPreview";
import {
  type AccentWarning,
  AccentSwatches,
  AccentWarningNote,
  CardStyleSelector,
  INK,
  ThemeSelector,
  WidgetTypePicker,
  buildSwatches,
} from "./WidgetSettingsControls";

const LIGHT_CARD = "#FFFFFF";
const DARK_CARD = "#22262D";

const MAX_ITEMS_ERROR = `Indiquez un nombre entre ${MIN_WIDGET_MAX_ITEMS} et ${MAX_WIDGET_MAX_ITEMS}.`;

/** No « Date » any more (lot 4.13): the law asks for the date of each review, the widget always shows it. */
const DISPLAY_OPTIONS = [
  { key: "showPhoto", label: "Photo" },
  { key: "showRating", label: "Note en étoiles" },
] as const;

const readMaxItems = (text: string): number | null => {
  if (!/^\d+$/.test(text.trim())) return null;
  const value = Number(text);
  return value >= MIN_WIDGET_MAX_ITEMS && value <= MAX_WIDGET_MAX_ITEMS ? value : null;
};

const hasSomethingToShow = (payload: WidgetPayload) =>
  payload.total > 0 && (payload.type === "badge" ? payload.avatars.length > 0 : payload.testimonials.length > 0);

/** The charter asks 3:1 of the accent on the cards: the editor warns, the widget falls back. */
const describeAccentWarning = (accent: string | null, theme: WidgetEdit["theme"]): AccentWarning | null => {
  if (!accent) return null;
  if (theme === "dark") {
    return calculateContrastRatio(accent, DARK_CARD) < MIN_ACCENT_CONTRAST_RATIO
      ? {
          text: "La couleur d'accent ressort peu sur des cartes sombres : vos étoiles s'afficheront en carmin clair.",
          offersInk: false,
        }
      : null;
  }
  return calculateContrastRatio(accent, LIGHT_CARD) < MIN_ACCENT_CONTRAST_RATIO
    ? {
        text: "La couleur d'accent ressort peu sur des cartes blanches : vos étoiles s'afficheront en Encre.",
        offersInk: true,
      }
    : null;
};

const SAVE_LABELS: Record<Exclude<SaveState, "failed">, string> = {
  saving: "Enregistrement…",
  saved: "Enregistré automatiquement",
};

const SaveStatus = ({ saveState, onRetry }: { saveState: SaveState; onRetry: () => void }) =>
  saveState === "failed" ? (
    <span className="inline-flex flex-wrap items-center gap-x-3">
      <span className="inline-flex items-center gap-2 text-error">
        <Icon name="alert" size={20} />
        Vos derniers réglages ne sont pas enregistrés.
      </span>
      <button type="button" onClick={onRetry} className={DISCREET_BUTTON_CLASSES}>
        Réessayer
      </button>
    </span>
  ) : (
    <span className="text-gray">{SAVE_LABELS[saveState]}</span>
  );

/** Maquette 6, desktop: « Code copié » with its check on the button itself (charte v2), and where to paste it next. */
const CopyCodeBlock = ({ isCopied, onCopy }: { isCopied: boolean; onCopy: () => void }) => (
  <div className="flex flex-col gap-3">
    <button
      type="button"
      onClick={onCopy}
      className={cn(PRIMARY_BUTTON_CLASSES, "w-full")}
    >
      <Icon name={isCopied ? "valid" : "copy"} size={20} />
      {isCopied ? "Code copié" : "Copier le code"}
    </button>
    <p aria-live="polite" className={FIELD_HINT_CLASSES}>
      {isCopied
        ? "Collez-le maintenant dans votre page. Sur Systeme.io, suivez les 4 étapes ci-dessous."
        : "Un seul code pour ce widget : vos réglages s'appliquent même après l'avoir collé."}
    </p>
  </div>
);

type EditorTab = "settings" | "preview";

const TABS: Array<{ value: EditorTab; label: string }> = [
  { value: "settings", label: "Réglages" },
  { value: "preview", label: "Aperçu" },
];

type WidgetEditorProps = {
  widget: EditableWidget;
  offers: Array<{ id: string; name: string }>;
  preview: WidgetPreviewData;
  look: PreviewLook;
  spaceName: string;
  appUrl: string;
  email: string;
  guideHref: string;
};

/**
 * Maquette 6. On a computer, the settings on the left, saved as they change, and the creator's page with the widget
 * on the right. On a phone, « Réglages » and « Aperçu » take turns, and « Installer le widget » follows both.
 */
export const WidgetEditor = ({ widget, offers, preview, look, spaceName, appUrl, email, guideHref }: WidgetEditorProps) => {
  const { id: widgetId, ...initialEdit } = widget;
  const [edit, setEdit] = useState<WidgetEdit>(initialEdit);
  const [tab, setTab] = useState<EditorTab>("settings");
  const tabsId = useId();
  const [maxItemsText, setMaxItemsText] = useState(String(initialEdit.maxItems));
  const [isMaxItemsTouched, setIsMaxItemsTouched] = useState(false);
  const { saveState, schedule, retry } = useWidgetAutosave(widgetId);

  const change = (patch: Partial<WidgetEdit>, delayMs = 0) => {
    setEdit({ ...edit, ...patch });
    schedule(patch, delayMs);
  };

  const toggleDisplay = (key: (typeof DISPLAY_OPTIONS)[number]["key"], isShown: boolean) => {
    const patch: Partial<WidgetEdit> = {};
    patch[key] = isShown;
    change(patch);
  };

  const payload = useMemo(() => buildPreviewPayload(preview, edit, look), [preview, edit, look]);
  const loadMore = useCallback(
    async (offset: number) => buildPreviewPayload(preview, edit, look, offset),
    [preview, edit, look],
  );

  const offerName = offers.find((offer) => offer.id === edit.productId)?.name ?? null;
  const swatches = buildSwatches(look.spaceAccentColor, edit.accentColor);
  const accentWarning = describeAccentWarning(edit.accentColor ?? look.spaceAccentColor, edit.theme);
  const isMaxItemsValid = readMaxItems(maxItemsText) !== null;
  const showsMaxItemsError = !isMaxItemsValid && (isMaxItemsTouched || maxItemsText.trim() !== "");
  const isEmpty = !hasSomethingToShow(payload);
  const derivedName = describeWidget(edit.type, offerName);
  const label = edit.name?.trim() || derivedName;
  const snippet = buildWidgetSnippet(appUrl, { id: widgetId, type: edit.type });
  const { isCopied, handleCopy } = useCopyLink(snippet);

  const settings = (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor="widget-name" className={FIELD_LABEL_CLASSES}>
          Nom du widget <span className={OPTIONAL_MARK_CLASSES}>(facultatif)</span>
        </label>
        <input
          id="widget-name"
          type="text"
          value={edit.name ?? ""}
          maxLength={MAX_WIDGET_NAME_LENGTH}
          placeholder={derivedName}
          aria-describedby="widget-name-hint"
          onChange={(event) => change({ name: event.target.value }, TYPING_PAUSE_MS)}
          className={FIELD_CLASSES}
        />
        <p id="widget-name-hint" className={FIELD_HINT_CLASSES}>
          Pour le retrouver dans votre liste. Vos visiteurs ne le voient pas.
          <span className="hidden desktop:inline">{` Laissé vide : « ${derivedName} ».`}</span>
        </p>
      </div>
      <WidgetTypePicker value={edit.type} onChange={(type) => change({ type })} />
      <div className="flex flex-col gap-2">
        <label htmlFor="widget-offer" className={FIELD_LABEL_CLASSES}>
          Offre
        </label>
        <SelectControl
          id="widget-offer"
          value={edit.productId ?? ""}
          onChange={(event) => change({ productId: event.target.value || null })}
        >
          <option value="">{ALL_OFFERS_LABEL}</option>
          {offers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.name}
            </option>
          ))}
        </SelectControl>
      </div>
      {edit.type === "badge" ? null : (
        <div className="flex flex-col gap-2">
          <label htmlFor="widget-max-items" className={FIELD_LABEL_CLASSES}>
            Nombre maximum de témoignages
          </label>
          <input
            id="widget-max-items"
            type="text"
            inputMode="numeric"
            value={maxItemsText}
            aria-invalid={showsMaxItemsError || undefined}
            aria-describedby={showsMaxItemsError ? "widget-max-items-error" : undefined}
            onChange={(event) => {
              setMaxItemsText(event.target.value);
              const maxItems = readMaxItems(event.target.value);
              if (maxItems !== null) change({ maxItems }, TYPING_PAUSE_MS);
            }}
            onBlur={() => setIsMaxItemsTouched(true)}
            className={cn(FIELD_CLASSES, "w-[120px]")}
          />
          {showsMaxItemsError ? <FieldError id="widget-max-items-error" message={MAX_ITEMS_ERROR} /> : null}
        </div>
      )}
      <fieldset className="flex min-w-[0] flex-col gap-1">
        <legend className={cn(FIELD_LABEL_CLASSES, "mb-1")}>Afficher</legend>
        {DISPLAY_OPTIONS.map((option) => (
          <label key={option.key} className="flex min-h-[44px] cursor-pointer items-center gap-3">
            <Checkbox checked={edit[option.key]} onChange={(event) => toggleDisplay(option.key, event.target.checked)} />
            <span className="text-body">{option.label}</span>
          </label>
        ))}
      </fieldset>
      <AccentSwatches swatches={swatches} value={edit.accentColor} onChange={(accentColor) => change({ accentColor })} />
      <ThemeSelector value={edit.theme} onChange={(theme) => change({ theme })} />
      <AccentWarningNote warning={accentWarning} onUseInk={() => change({ accentColor: INK })} />
      <CardStyleSelector value={edit.cardStyle} onChange={(cardStyle) => change({ cardStyle })} />
      <div className="flex items-start justify-between gap-4 pt-6">
        <div className="flex min-w-[0] flex-col gap-1">
          <span id="widget-hide-powered-label" className={cn("text-body", !look.canHideBadge && "text-gray")}>
            Masquer « Propulsé par PULSACITY »
          </span>
          {look.canHideBadge ? null : (
            <p id="widget-hide-powered-hint" className={FIELD_HINT_CLASSES}>
              Disponible avec le plan Pro ·{" "}
              <Link href={BILLING_HREF} className={INLINE_LINK_CLASSES}>
                Voir les plans
              </Link>
            </p>
          )}
        </div>
        <Switch
          id="widget-hide-powered"
          isOn={edit.hidePoweredBy && look.canHideBadge}
          labelId="widget-hide-powered-label"
          descriptionId={look.canHideBadge ? undefined : "widget-hide-powered-hint"}
          isDisabled={!look.canHideBadge}
          onChange={(hidePoweredBy) => change({ hidePoweredBy })}
        />
      </div>
    </>
  );

  const tabId = (value: EditorTab) => `${tabsId}-${value}`;

  return (
    <div className="flex flex-col">
      <header className="hidden items-center justify-between gap-6 px-10 py-4 desktop:flex">
        <div className="flex min-w-[0] flex-col">
          <nav aria-label="Fil d'Ariane" className="text-small text-gray">
            <Link href={WIDGETS_SECTION_HREF} className={INLINE_LINK_CLASSES}>
              Widgets
            </Link>{" "}
            / <span aria-current="page">{label}</span>
          </nav>
          <h1 className="font-display text-h2">Modifier le widget</h1>
        </div>
        <p aria-live="polite" className="min-h-[20px] text-small">
          <SaveStatus saveState={saveState} onRetry={retry} />
        </p>
      </header>
      <div className="flex flex-col gap-2 px-6 pt-6 desktop:hidden">
        <h1 className="font-display text-h1">Modifier le widget</h1>
        <p aria-live="polite" className="text-small text-gray">
          {`${label} · `}
          <SaveStatus saveState={saveState} onRetry={retry} />
        </p>
        <div role="tablist" aria-label="Modifier le widget" className={cn(SEGMENTED_CLASSES, "mt-3")}>
          {TABS.map((option) => {
            const isChosen = option.value === tab;
            return (
              <button
                key={option.value}
                id={tabId(option.value)}
                type="button"
                role="tab"
                aria-selected={isChosen}
                aria-controls={`${tabId(option.value)}-panel`}
                onClick={() => setTab(option.value)}
                className={cn(
                  SEGMENTED_OPTION_CLASSES,
                  isChosen ? SEGMENTED_OPTION_CHOSEN_CLASSES : SEGMENTED_OPTION_IDLE_CLASSES,
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col desktop:min-h-[1194px] desktop:flex-row">
        <div
          id={`${tabId("settings")}-panel`}
          role="tabpanel"
          aria-labelledby={tabId("settings")}
          className={cn(
            "flex-col gap-8 px-6 py-6 desktop:flex desktop:w-[380px] desktop:shrink-0 desktop:py-8 desktop:pr-8 desktop:pl-10",
            tab === "settings" ? "flex" : "hidden",
          )}
        >
          {settings}
          <div className="mt-auto hidden pt-10 desktop:block">
            <CopyCodeBlock isCopied={isCopied} onCopy={handleCopy} />
          </div>
        </div>
        <section
          id={`${tabId("preview")}-panel`}
          role="tabpanel"
          aria-labelledby={tabId("preview")}
          className={cn(
            "min-w-[0] flex-col gap-4 bg-sky px-6 py-6 desktop:flex desktop:flex-1 desktop:px-8 desktop:py-8",
            tab === "preview" ? "flex" : "hidden",
          )}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-small font-bold">Aperçu en direct</h2>
            <p className="text-small text-gray">
              <span className="desktop:hidden">Votre page, sur mobile</span>
              <span className="hidden desktop:inline">Votre page de vente, réduite</span>
            </p>
          </div>
          {isEmpty ? (
            <p className="text-small">
              {edit.productId ? "Aucun témoignage validé pour cette offre" : "Aucun témoignage validé pour l'instant"} : le
              widget reste invisible sur votre page.{" "}
              <Link href={TESTIMONIALS_SECTION_HREF} className={INLINE_LINK_CLASSES}>
                Voir mes témoignages
              </Link>
            </p>
          ) : null}
          <WidgetPreview
            payload={payload}
            isEmpty={isEmpty}
            spaceName={spaceName}
            pageTitle={offerName ?? offers[0]?.name ?? spaceName}
            pageAccent={look.spaceAccentColor}
            loadMore={loadMore}
          />
          <p className="text-small text-gray desktop:hidden">L&apos;aperçu suit vos réglages.</p>
        </section>
      </div>

      <div className="px-6 pt-2 pb-[108px] desktop:hidden">
        <WidgetInstallPanel widgetId={widgetId} snippet={snippet} email={email} guideHref={guideHref} />
      </div>
      <div className="hidden px-10 pb-10 desktop:block">
        <SystemePasteGuide isCodeCopied={isCopied} />
      </div>
    </div>
  );
};
