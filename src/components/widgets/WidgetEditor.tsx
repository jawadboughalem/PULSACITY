"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { SendWidgetCodeButton } from "@/components/dashboard/WidgetCodeButtons";
import { BILLING_HREF, TESTIMONIALS_SECTION_HREF, WIDGETS_SECTION_HREF } from "@/components/space/space-sections";
import { useCopyLink } from "@/components/space/useCopyLink";
import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Checkbox } from "@/components/ui/Checkbox";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";
import { MIN_ACCENT_CONTRAST_RATIO, calculateContrastRatio } from "@/lib/colors/contrast-ratio";
import { type PreviewLook, buildPreviewPayload } from "@/lib/widgets/build-preview-payload";
import type { WidgetPreviewData } from "@/lib/widgets/load-widget-preview";
import {
  type EditableWidget,
  MAX_WIDGET_MAX_ITEMS,
  MIN_WIDGET_MAX_ITEMS,
  type WidgetEdit,
} from "@/lib/widgets/widget-settings";
import type { WidgetPayload } from "../../../widget/src/payload";
import { ALL_OFFERS_LABEL, describeWidget } from "./describe-widget";
import { SystemePasteGuide } from "./SystemePasteGuide";
import { TYPING_PAUSE_MS, type SaveState, useWidgetAutosave } from "./useWidgetAutosave";
import { WidgetPreview } from "./WidgetPreview";
import { AccentSwatches, INK, ThemeSelector, WidgetTypePicker, buildSwatches } from "./WidgetSettingsControls";

const LINK_CLASSES =
  "font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

const LIGHT_CARD = "#FFFFFF";
const DARK_CARD = "#22262D";

const MAX_ITEMS_ERROR = `Indiquez un nombre entre ${MIN_WIDGET_MAX_ITEMS} et ${MAX_WIDGET_MAX_ITEMS}.`;

const DISPLAY_OPTIONS = [
  { key: "showPhoto", label: "Photo" },
  { key: "showRating", label: "Note en étoiles" },
  { key: "showDate", label: "Date" },
] as const;

const readMaxItems = (text: string): number | null => {
  if (!/^\d+$/.test(text.trim())) return null;
  const value = Number(text);
  return value >= MIN_WIDGET_MAX_ITEMS && value <= MAX_WIDGET_MAX_ITEMS ? value : null;
};

const hasSomethingToShow = (payload: WidgetPayload) =>
  payload.total > 0 && (payload.type === "badge" ? payload.avatars.length > 0 : payload.testimonials.length > 0);

/** The charter asks 3:1 of the accent on the cards: the editor warns, the widget falls back. */
const describeAccentWarning = (accent: string | null, theme: WidgetEdit["theme"]): string | null => {
  if (!accent) return null;
  if (theme === "dark") {
    return calculateContrastRatio(accent, DARK_CARD) < MIN_ACCENT_CONTRAST_RATIO
      ? "Cette couleur ressort peu sur des cartes sombres : vos étoiles s'afficheront en carmin clair."
      : null;
  }
  return calculateContrastRatio(accent, LIGHT_CARD) < MIN_ACCENT_CONTRAST_RATIO
    ? "Cette couleur ressort peu sur des cartes blanches : vos étoiles s'afficheront en Encre."
    : null;
};

const SaveStatus = ({ saveState, onRetry }: { saveState: SaveState; onRetry: () => void }) => (
  <div aria-live="polite" className="flex min-h-[20px] flex-wrap items-center gap-x-3 text-small">
    {saveState === "failed" ? (
      <>
        <span className="flex items-center gap-2 text-error">
          <Icon name="alert" size={20} />
          Vos derniers réglages ne sont pas enregistrés.
        </span>
        <button type="button" onClick={onRetry} className={cn(LINK_CLASSES, "min-h-[44px]")}>
          Réessayer
        </button>
      </>
    ) : (
      <span className="text-slate-600">{saveState === "saving" ? "Enregistrement…" : "Enregistré automatiquement"}</span>
    )}
  </div>
);

const CopyCodeBlock = ({ snippet, widgetId, isPhone }: { snippet: string; widgetId: string; isPhone: boolean }) => {
  const { isCopied, handleCopy } = useCopyLink(snippet);
  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={handleCopy} className={cn(PRIMARY_BUTTON_CLASSES, "h-[56px] w-full")}>
        <Icon name={isCopied ? "valid" : "copy"} size={20} />
        {isCopied ? "Code copié" : "Copier le code"}
      </button>
      <p aria-live="polite" className="sr-only">
        {isCopied ? "Le code est copié." : ""}
      </p>
      <p className="text-small text-slate-600">
        Un seul code pour ce widget : vos réglages s&apos;appliquent même après l&apos;avoir collé.
      </p>
      {isPhone ? (
        <>
          <p className="pt-2 text-small text-slate-600">
            Plus simple depuis un ordinateur : nous pouvons vous envoyer le code par e-mail.
          </p>
          <SendWidgetCodeButton widgetId={widgetId} />
        </>
      ) : null}
    </div>
  );
};

type WidgetEditorProps = {
  widget: EditableWidget;
  offers: Array<{ id: string; name: string }>;
  preview: WidgetPreviewData;
  look: PreviewLook;
  spaceName: string;
  snippet: string;
};

/** Maquette 6: the settings on the left, saved as they change, the creator's page with the widget on the right. */
export const WidgetEditor = ({ widget, offers, preview, look, spaceName, snippet }: WidgetEditorProps) => {
  const { id: widgetId, ...initialEdit } = widget;
  const [edit, setEdit] = useState<WidgetEdit>(initialEdit);
  const [maxItemsText, setMaxItemsText] = useState(String(initialEdit.maxItems));
  const [isMaxItemsTouched, setIsMaxItemsTouched] = useState(false);
  const { saveState, schedule, retry } = useWidgetAutosave(widgetId);

  const change = (patch: Partial<WidgetEdit>, delayMs = 0) => {
    const next = { ...edit, ...patch };
    setEdit(next);
    schedule(next, delayMs);
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
  const label = describeWidget(edit.type, offerName);

  const settings = (
    <>
      <WidgetTypePicker value={edit.type} onChange={(type) => change({ type })} />
      <div className="flex flex-col gap-2">
        <label htmlFor="widget-offer" className="text-small font-semibold">
          Offre
        </label>
        <span className="relative flex">
          <select
            id="widget-offer"
            value={edit.productId ?? ""}
            onChange={(event) => change({ productId: event.target.value || null })}
            className="h-[48px] w-full appearance-none rounded-sm border border-gray-400 bg-white pr-7 pl-4 text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:pl-[15px] focus:outline-none"
          >
            <option value="">{ALL_OFFERS_LABEL}</option>
            {offers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.name}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={20} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
        </span>
      </div>
      {edit.type === "badge" ? null : (
        <div className="flex flex-col gap-2">
          <label htmlFor="widget-max-items" className="text-small font-semibold">
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
            className={cn(
              "h-[48px] w-[120px] rounded-sm border border-gray-400 bg-white px-4 text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:px-[15px] focus:outline-none",
              showsMaxItemsError && "border-2 border-error px-[15px]",
            )}
          />
          {showsMaxItemsError ? <FieldError id="widget-max-items-error" message={MAX_ITEMS_ERROR} /> : null}
        </div>
      )}
      <fieldset className="flex min-w-[0] flex-col gap-1">
        <legend className="mb-1 text-small font-semibold">Afficher</legend>
        {DISPLAY_OPTIONS.map((option) => (
          <label key={option.key} className="flex min-h-[44px] cursor-pointer items-center gap-3">
            <Checkbox checked={edit[option.key]} onChange={(event) => toggleDisplay(option.key, event.target.checked)} />
            <span className="text-body">{option.label}</span>
          </label>
        ))}
      </fieldset>
      <AccentSwatches
        swatches={swatches}
        value={edit.accentColor}
        warning={accentWarning}
        onChange={(accentColor) => change({ accentColor })}
        onUseInk={() => change({ accentColor: INK })}
      />
      <ThemeSelector value={edit.theme} onChange={(theme) => change({ theme })} />
      <div className="flex items-start justify-between gap-4 border-t border-hairline-200 pt-5">
        <div className="flex min-w-[0] flex-col gap-1">
          <span id="widget-hide-powered-label" className={cn("text-body", !look.canHideBadge && "text-slate-600")}>
            Masquer « Propulsé par PULSACITY »
          </span>
          {look.canHideBadge ? null : (
            <p id="widget-hide-powered-hint" className="text-small text-slate-600">
              Disponible avec le plan Pro ·{" "}
              <Link href={BILLING_HREF} className={LINK_CLASSES}>
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

  return (
    <div className="flex flex-col">
      <header className="hidden items-center justify-between gap-5 border-b border-hairline-200 px-7 py-4 desktop:flex">
        <div className="flex min-w-[0] flex-col">
          <nav aria-label="Fil d'Ariane" className="text-small text-slate-600">
            <Link href={WIDGETS_SECTION_HREF} className={LINK_CLASSES}>
              Widgets
            </Link>{" "}
            / <span aria-current="page">{label}</span>
          </nav>
          <h1 className="font-serif text-h2 font-medium">Modifier le widget</h1>
        </div>
        <SaveStatus saveState={saveState} onRetry={retry} />
      </header>
      <div className="flex flex-col gap-2 px-5 pt-5 desktop:hidden">
        <h1 className="font-serif text-h1 font-medium">Modifier le widget</h1>
        <p className="text-small text-slate-600">{label}</p>
        <SaveStatus saveState={saveState} onRetry={retry} />
      </div>

      <div className="flex flex-col desktop:min-h-[1194px] desktop:flex-row">
        <div className="flex flex-col gap-6 px-5 py-5 desktop:w-[380px] desktop:shrink-0 desktop:border-r desktop:border-hairline-200 desktop:py-6 desktop:pr-6 desktop:pl-7">
          {settings}
          <div className="mt-auto hidden pt-7 desktop:block">
            <CopyCodeBlock snippet={snippet} widgetId={widgetId} isPhone={false} />
          </div>
        </div>
        <section
          aria-labelledby="widget-preview-title"
          className="flex min-w-[0] flex-col gap-4 bg-paper-100 px-5 py-5 desktop:flex-1 desktop:px-6 desktop:py-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id="widget-preview-title" className="text-small font-semibold">
              Aperçu en direct
            </h2>
            <p className="text-small text-slate-600">Votre page de vente, réduite</p>
          </div>
          {isEmpty ? (
            <p className="text-small">
              {edit.productId ? "Aucun témoignage validé pour cette offre" : "Aucun témoignage validé pour l'instant"} : le
              widget reste invisible sur votre page.{" "}
              <Link href={TESTIMONIALS_SECTION_HREF} className={LINK_CLASSES}>
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
        </section>
        <div className="px-5 py-5 desktop:hidden">
          <CopyCodeBlock snippet={snippet} widgetId={widgetId} isPhone />
        </div>
      </div>

      <div className="px-5 pb-[108px] desktop:px-7 desktop:pb-7">
        <SystemePasteGuide />
      </div>
    </div>
  );
};
