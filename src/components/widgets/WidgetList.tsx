"use client";

import Link from "next/link";
import { useActionState } from "react";
import { type CreateWidgetResult, createWidgetFromList } from "@/app/app/(espace)/widgets/widget-actions";
import { BILLING_HREF, WIDGETS_SECTION_HREF } from "@/components/space/space-sections";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { WidgetType } from "../../../widget/src/payload";
import { WIDGET_TYPE_OPTIONS, describeWidget } from "./describe-widget";

export type ListedWidget = {
  id: string;
  type: WidgetType;
  offerName: string | null;
  /** « Sur une page depuis le 12 sept. », or null before the first display. */
  shownSince: string | null;
};

type WidgetListProps = {
  widgets: ListedWidget[];
  canCreate: boolean;
  planName: string;
};

const CREATE_ERRORS: Record<CreateWidgetResult["error"], string> = {
  "plan-limit": "Votre plan ne permet pas un widget de plus. Passez au plan supérieur pour en créer d'autres.",
  "space-not-found": "Votre espace est introuvable. Rechargez la page.",
};

/** The widgets of the space, each with its type, its offer, and whether it already shows on a page. */
export const WidgetList = ({ widgets, canCreate, planName }: WidgetListProps) => {
  const [result, createWidget, isCreating] = useActionState<CreateWidgetResult | null>(createWidgetFromList, null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5 border-b border-ink-900 pb-5 desktop:flex-row desktop:items-end desktop:justify-between desktop:pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-h1 font-medium">Widgets</h1>
          <p className="max-w-text text-body text-slate-600">
            Chaque widget a son code, à coller une fois sur votre page de vente.
          </p>
        </div>
        <div className="flex flex-col gap-2 desktop:items-end">
          <form action={createWidget}>
            <button
              type="submit"
              disabled={!canCreate || isCreating}
              className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
            >
              {isCreating ? "Création…" : "Créer un widget"}
            </button>
          </form>
          {canCreate ? null : (
            <p className="max-w-[360px] text-small text-slate-600 desktop:text-right">
              {`Le plan ${planName} comprend un widget. `}
              <Link href={BILLING_HREF} className={cn(DISCREET_BUTTON_CLASSES, "inline min-h-[0] p-[0] text-small")}>
                Voir les plans
              </Link>
            </p>
          )}
        </div>
      </div>
      {result && !result.ok ? <FieldError id="create-widget-error" message={CREATE_ERRORS[result.error]} /> : null}
      <ul className="flex flex-col">
        {widgets.map((widget) => {
          const icon = WIDGET_TYPE_OPTIONS.find((option) => option.type === widget.type)?.icon ?? "wall";
          return (
            <li key={widget.id} className="border-b border-hairline-200">
              <Link
                href={`${WIDGETS_SECTION_HREF}/${widget.id}`}
                className="flex min-h-[72px] items-center gap-4 py-4 hover:bg-paper-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
              >
                <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-paper-100 text-ink-900">
                  <Icon name={icon} size={24} />
                </span>
                <span className="flex min-w-[0] flex-1 flex-col">
                  <span className="text-body font-semibold">{describeWidget(widget.type, widget.offerName)}</span>
                  <span className={cn("text-small", widget.shownSince ? "text-success" : "text-slate-600")}>
                    {widget.shownSince ?? "Pas encore collé sur une page"}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-body font-semibold text-carmine">
                  <span className="hidden desktop:inline">Modifier</span>
                  <Icon name="chevronRight" size={20} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
