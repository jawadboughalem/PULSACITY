"use client";

import Link from "next/link";
import { useActionState } from "react";
import { type CreateWidgetResult, createWidgetFromList } from "@/app/app/(espace)/widgets/widget-actions";
import { BILLING_HREF, widgetEditorHref, widgetGuideHref } from "@/components/space/space-sections";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { WidgetType } from "../../../widget/src/payload";
import { WidgetThumbnail } from "./WidgetThumbnail";

const LINK_CLASSES =
  "font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

export type ListedWidget = {
  id: string;
  type: WidgetType;
  /** The creator's name for it, or else « Mur · Toutes les offres ». */
  title: string;
  /** Always « Mur · Toutes les offres »: what it shows. */
  description: string;
  /** « Sur une page depuis le 12 sept. 2026 », or null before the first display. */
  shownSince: string | null;
};

export type CreateLimit = {
  planName: string;
  widgetLimit: number;
  /** « 9,99 € par mois », VAT included, the price of the plan that lifts the limit. */
  nextPlanPrice: string;
};

type WidgetListProps = {
  widgets: ListedWidget[];
  /** Null while the plan allows one more widget. */
  createLimit: CreateLimit | null;
};

const CREATE_ERRORS: Record<CreateWidgetResult["error"], string> = {
  "plan-limit": "Votre plan ne permet pas un widget de plus. Passez au plan supérieur pour en créer d'autres.",
  "space-not-found": "Votre espace est introuvable. Rechargez la page.",
};

const TYPE_CHOICES: Array<{ type: WidgetType; title: string; text: string }> = [
  { type: "wall", title: "Mur", text: "Tous vos avis, en colonnes. Pour une page dédiée." },
  { type: "carousel", title: "Carrousel", text: "Quelques avis qui défilent. Pour le milieu d'une page de vente." },
  { type: "badge", title: "Badge", text: "Votre note et le nombre d'avis. Près du bouton d'achat." },
];

const WidgetStatus = ({ widget }: { widget: ListedWidget }) =>
  widget.shownSince ? (
    <p className="flex items-start gap-2 text-small text-success">
      <Icon name="valid" size={20} className="shrink-0" />
      {widget.shownSince}
    </p>
  ) : (
    <p className="flex items-start gap-2 text-small text-slate-600">
      <Icon name="clock" size={20} className="shrink-0" />
      <span>
        Pas encore collé sur une page ·{" "}
        <Link href={widgetGuideHref(widget.id)} className={cn(LINK_CLASSES, "desktop:hidden")}>
          Voir comment le coller
        </Link>
        <Link href={`${widgetEditorHref(widget.id)}#paste-guide`} className={cn(LINK_CLASSES, "hidden desktop:inline")}>
          Voir comment le coller
        </Link>
      </span>
    </p>
  );

const EmptyState = () => (
  <section aria-labelledby="no-widget" className="flex flex-col gap-4 bg-paper-100 p-5 desktop:p-7">
    <h2 id="no-widget" className="font-serif text-quote font-medium desktop:text-h2">
      Aucun widget pour l&apos;instant
    </h2>
    <p className="max-w-text text-body">
      Créez-en un, réglez-le, puis collez son code sur votre page de vente. Trois formes au choix :
    </p>
    <ul className="flex flex-col border-t border-hairline-200">
      {TYPE_CHOICES.map((choice) => (
        <li key={choice.type} className="flex items-center gap-4 border-b border-hairline-200 py-3">
          <WidgetThumbnail type={choice.type} className="w-[72px]" isOnPaper />
          <span className="flex flex-col">
            <span className="text-body font-semibold">{choice.title}</span>
            <span className="text-small text-slate-600">{choice.text}</span>
          </span>
        </li>
      ))}
    </ul>
  </section>
);

/** Maquette 18: the widgets of the space, each with its shape, what it shows and whether it is on a page yet. */
export const WidgetList = ({ widgets, createLimit }: WidgetListProps) => {
  const [result, createWidget, isCreating] = useActionState<CreateWidgetResult | null>(createWidgetFromList, null);

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          "flex flex-col gap-5 desktop:flex-row desktop:items-start desktop:justify-between",
          widgets.length > 0 && "border-b border-ink-900 pb-5 desktop:pb-6",
        )}
      >
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-h1 font-medium">Widgets</h1>
          <p className="max-w-[600px] text-body text-slate-600">
            Affichez vos témoignages sur vos pages de vente. Chaque widget a son code, à coller une seule fois.
          </p>
        </div>
        <div className="flex flex-col gap-2 desktop:items-end desktop:pt-6">
          <form action={createWidget}>
            <button
              type="submit"
              disabled={createLimit !== null || isCreating}
              className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
            >
              {isCreating ? "Création…" : "Créer un widget"}
            </button>
          </form>
          {createLimit ? (
            <p className="text-small text-slate-600 desktop:text-right">
              {`Le plan ${createLimit.planName} comprend ${createLimit.widgetLimit} widget${createLimit.widgetLimit > 1 ? "s" : ""}. `}
              <Link href={BILLING_HREF} className={LINK_CLASSES}>
                Voir les plans
              </Link>
            </p>
          ) : null}
        </div>
      </div>
      {result && !result.ok ? <FieldError id="create-widget-error" message={CREATE_ERRORS[result.error]} /> : null}

      {widgets.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="-mt-6 flex flex-col">
          {widgets.map((widget) => (
            <li
              key={widget.id}
              className="flex flex-col gap-4 border-b border-hairline-200 py-5 desktop:flex-row desktop:items-center desktop:gap-6"
            >
              <div className="flex min-w-[0] flex-1 items-start gap-4 desktop:gap-6">
                <WidgetThumbnail type={widget.type} className="w-[72px] desktop:w-[120px]" />
                <div className="flex min-w-[0] flex-col gap-1">
                  <h2 className="font-serif text-quote font-medium">{widget.title}</h2>
                  <p className="text-small text-slate-600">{widget.description}</p>
                  <WidgetStatus widget={widget} />
                </div>
              </div>
              <Link
                href={widgetEditorHref(widget.id)}
                aria-label={`Modifier ${widget.title}`}
                className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
              >
                Modifier
              </Link>
            </li>
          ))}
        </ul>
      )}

      {createLimit && widgets.length > 0 ? (
        <aside className="flex items-start gap-3 bg-paper-100 p-5 desktop:px-6">
          <Icon name="info" size={20} className="mt-[2px] shrink-0" />
          <div className="flex flex-col gap-2">
            <p className="text-body font-semibold">Un mur, un carrousel et un badge sur vos pages ?</p>
            <p className="text-small">
              {`Avec le plan Essentiel, à ${createLimit.nextPlanPrice}, vous créez autant de widgets que vous voulez : un pour chaque page de vente.`}
            </p>
            <Link href={BILLING_HREF} className={cn(LINK_CLASSES, "self-start text-small")}>
              Voir le plan Essentiel
            </Link>
          </div>
        </aside>
      ) : null}
    </div>
  );
};
