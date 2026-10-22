import { notFound } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/db";
import { PULSACITY_BETA_OFFER_SLUG, readPulsacitySpaceId } from "@/config/pulsacity-space";
import { getAppUrl } from "@/lib/app-url";
import { buildConsentText } from "@/lib/testimonials/build-consent-text";
import { loadCollectionPage } from "@/lib/testimonials/load-collection-page";
import { WITHDRAWAL_STEPS, type WithdrawalStep } from "@/lib/testimonials/withdrawal-parameter";
import { withdrawConsentFromPage } from "@/app/t/[spaceSlug]/withdraw-consent-action";
import { CollectShell } from "./CollectShell";
import type { CollectionIncentive } from "./IncentiveNote";
import { CollectionView } from "./CollectionView";
import { InactiveLinkScreen } from "./InactiveLinkScreen";
import { ConfirmWithdrawalScreen, RemovedReviewScreen, SavedReviewScreen, WithdrawnScreen } from "./ManageReviewScreens";

const NO_BREAK_SPACE = " ";

export const loadCollectionPageOnce = cache(
  (spaceSlug: string, productSlug: string | null, requestToken: string | null) =>
    loadCollectionPage(getDb(), spaceSlug, productSlug, requestToken),
);

const buildTitle = (spaceName: string, productName: string | null) =>
  productName
    ? `Votre avis sur «${NO_BREAK_SPACE}${productName}${NO_BREAK_SPACE}»${NO_BREAK_SPACE}?`
    : `Votre avis compte pour ${spaceName}`;

/** PULSACITY's own page for its beta testers says their counterpart; any other declared one, the space's. */
const readIncentive = (
  space: { id: string; incentiveDeclaredAt: Date | null },
  productSlug: string | null,
): CollectionIncentive | null => {
  if (space.id === readPulsacitySpaceId() && productSlug === PULSACITY_BETA_OFFER_SLUG) return "beta";
  return space.incentiveDeclaredAt ? "declared" : null;
};

type CollectionPageContentProps = {
  spaceSlug: string;
  productSlug: string | null;
  requestToken: string | null;
  /** « Gérer mon avis »: the step of the withdrawal, on the link of a request already answered. */
  withdrawalStep: WithdrawalStep | null;
};

export const CollectionPageContent = async ({
  spaceSlug,
  productSlug,
  requestToken,
  withdrawalStep,
}: CollectionPageContentProps) => {
  const page = await loadCollectionPageOnce(spaceSlug, productSlug, requestToken);
  if (!page) notFound();

  const { space } = page;
  // On PULSACITY's own pages, « Propulsé par PULSACITY » makes no sense (maquettes 3.6, page of the beta testers).
  const poweredBy =
    space.id === readPulsacitySpaceId() ? null : { homeUrl: getAppUrl(), referralCode: space.referralCode };

  if (page.status === "review-saved") {
    return (
      <CollectShell identity={space} poweredBy={poweredBy}>
        {withdrawalStep === WITHDRAWAL_STEPS.confirm ? (
          <ConfirmWithdrawalScreen
            spaceName={space.name}
            replyToEmail={space.replyToEmail}
            spaceSlug={space.slug}
            requestToken={page.requestToken}
            action={withdrawConsentFromPage}
          />
        ) : (
          <SavedReviewScreen spaceName={space.name} replyToEmail={space.replyToEmail} requestToken={page.requestToken} />
        )}
      </CollectShell>
    );
  }
  if (page.status === "review-removed") {
    return (
      <CollectShell identity={space} poweredBy={poweredBy}>
        {withdrawalStep === WITHDRAWAL_STEPS.done ? (
          <WithdrawnScreen spaceName={space.name} replyToEmail={space.replyToEmail} />
        ) : (
          <RemovedReviewScreen spaceName={space.name} replyToEmail={space.replyToEmail} />
        )}
      </CollectShell>
    );
  }
  if (page.status === "link-inactive") {
    return (
      <CollectShell identity={space} poweredBy={poweredBy}>
        <InactiveLinkScreen spaceName={space.name} replyToEmail={space.replyToEmail} />
      </CollectShell>
    );
  }
  return (
    <CollectionView
      spaceSlug={space.slug}
      productSlug={page.request ? null : (page.product?.slug ?? null)}
      requestToken={page.request?.token ?? null}
      prefilledName={page.request?.prefilledName ?? ""}
      spaceName={space.name}
      logoUrl={space.logoUrl}
      accentColor={space.accentColor}
      replyToEmail={space.replyToEmail}
      poweredBy={poweredBy}
      title={buildTitle(space.name, page.product?.name ?? null)}
      consentText={buildConsentText(space.name, page.request ? "request" : "public-link")}
      incentive={readIncentive(space, page.product?.slug ?? null)}
    />
  );
};
