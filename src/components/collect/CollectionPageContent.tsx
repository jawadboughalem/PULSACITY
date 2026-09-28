import { notFound } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import { buildConsentText } from "@/lib/testimonials/build-consent-text";
import { loadCollectionPage } from "@/lib/testimonials/load-collection-page";
import { CollectionView } from "./CollectionView";
import { InactiveLinkScreen } from "./InactiveLinkScreen";

const NO_BREAK_SPACE = " ";

export const loadCollectionPageOnce = cache(
  (spaceSlug: string, productSlug: string | null, requestToken: string | null) =>
    loadCollectionPage(getDb(), spaceSlug, productSlug, requestToken),
);

const buildTitle = (spaceName: string, productName: string | null) =>
  productName
    ? `Votre avis sur «${NO_BREAK_SPACE}${productName}${NO_BREAK_SPACE}»${NO_BREAK_SPACE}?`
    : `Votre avis compte pour ${spaceName}`;

type CollectionPageContentProps = {
  spaceSlug: string;
  productSlug: string | null;
  requestToken: string | null;
};

export const CollectionPageContent = async ({ spaceSlug, productSlug, requestToken }: CollectionPageContentProps) => {
  const page = await loadCollectionPageOnce(spaceSlug, productSlug, requestToken);
  if (!page) notFound();

  const { space } = page;
  const homeUrl = getAppUrl();

  return (
    <div className="min-h-dvh bg-paper-100 px-page-gutter py-5 text-ink-900">
      <main className="mx-auto flex min-h-[calc(100dvh-48px)] w-full max-w-text flex-col gap-5">
        {page.status === "link-inactive" ? (
          <InactiveLinkScreen
            spaceName={space.name}
            logoUrl={space.logoUrl}
            replyToEmail={space.replyToEmail}
            homeUrl={homeUrl}
            referralCode={space.referralCode}
          />
        ) : (
          <CollectionView
            spaceSlug={space.slug}
            productSlug={page.request ? null : (page.product?.slug ?? null)}
            requestToken={page.request?.token ?? null}
            prefilledName={page.request?.prefilledName ?? ""}
            spaceName={space.name}
            logoUrl={space.logoUrl}
            replyToEmail={space.replyToEmail}
            referralCode={space.referralCode}
            homeUrl={homeUrl}
            title={buildTitle(space.name, page.product?.name ?? null)}
            consentText={buildConsentText(space.name)}
          />
        )}
      </main>
    </div>
  );
};
