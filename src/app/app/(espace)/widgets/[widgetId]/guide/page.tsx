import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { Breadcrumb } from "@/components/space/BackBar";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { MobileBackLink } from "@/components/space/MobileBackLink";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { widgetEditorHref } from "@/components/space/space-sections";
import { INLINE_LINK_CLASSES } from "@/components/ui/button-styles";
import { PasteGuideSteps } from "@/components/widgets/SystemePasteGuide";
import { WidgetGuideActions } from "@/components/widgets/WidgetGuideActions";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { buildWidgetSnippet } from "@/lib/widgets/build-widget-snippet";
import { PASTE_GUIDE_SUMMARY } from "@/lib/widgets/paste-guide-steps";
import { findOwnedWidget } from "@/lib/widgets/space-widgets";

export const metadata: Metadata = {
  title: "Coller dans Systeme.io · PULSACITY",
};

/**
 * Maquettes 3.4, « Coller dans Systeme.io »: the guide on its own page, its steps on a white card, then the code, then
 * where to ask. On a computer, the same page in a column of 720.
 */
const WidgetGuidePage = async ({ params }: PageProps<"/app/widgets/[widgetId]/guide">) => {
  const { widgetId } = await params;
  const { signedInUser, space } = await getCurrentSpace();
  if (!z.uuid().safeParse(widgetId).success) notFound();
  const widget = await findOwnedWidget(getDb(), signedInUser.id, widgetId);
  if (!widget) notFound();

  return (
    <>
      <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />
      <SpacePage className="desktop:max-w-[832px] desktop:gap-6">
        <div className="flex flex-col gap-4 desktop:gap-6">
          <Breadcrumb parentHref={widgetEditorHref(widget.id)} parentLabel="Modifier le widget" current="Coller dans Systeme.io" />
          <MobileBackLink href={widgetEditorHref(widget.id)} label="Modifier le widget" />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-h1">Coller dans Systeme.io</h1>
            <p className="text-body">{`${PASTE_GUIDE_SUMMARY}. Plus simple depuis un ordinateur.`}</p>
          </div>
        </div>
        <div className="rounded-panel bg-white p-4 desktop:p-8">
          <PasteGuideSteps layout="column" />
        </div>
        <WidgetGuideActions widgetId={widget.id} snippet={buildWidgetSnippet(getAppUrl(), widget)} />
        <p className="text-small text-gray">
          {"Un souci à une étape ? "}
          <Link href={MARKETING_PATHS.contact} className={INLINE_LINK_CLASSES}>
            Écrivez-nous
          </Link>
          {" : nous le faisons avec vous, en partage d'écran."}
        </p>
      </SpacePage>
    </>
  );
};

export default WidgetGuidePage;
