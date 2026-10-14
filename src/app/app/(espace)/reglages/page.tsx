import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { SettingsPageHeading } from "@/components/settings/SettingsSection";
import { SpaceSettingsForm } from "@/components/settings/SpaceSettingsForm";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { MobileBackLink } from "@/components/space/MobileBackLink";
import { OFFERS_SECTION_HREF } from "@/components/space/space-sections";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { buildCollectionUrl, displayUrl } from "@/lib/app-url";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { EXAMPLE_PRODUCT_NAME } from "@/lib/spaces/render-request-email-preview";

export const metadata: Metadata = {
  title: "Réglages · PULSACITY",
};

const SettingsPage = async () => {
  const { signedInUser, space } = await getCurrentSpace();
  const [firstOffer] = await getDb()
    .select({ name: products.name })
    .from(products)
    .where(eq(products.spaceId, space.id))
    .orderBy(asc(products.createdAt))
    .limit(1);
  const collectionUrl = buildCollectionUrl(space.slug);

  return (
    <>
      <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />
      <SpacePage className="desktop:max-w-[1176px] desktop:gap-8">
        <div className="flex flex-col gap-4">
          <MobileBackLink />
          <SettingsPageHeading title="Réglages" lead="Votre espace, vos e-mails à vos clients, vos notifications." />
        </div>
        {/* Two columns once the form has room for both (3.3: 712 and 320, the first one may narrow); below, the preview follows « Votre espace ». */}
        <div className="@container">
          <SpaceSettingsForm
            initial={{
              name: space.name,
              slug: space.slug,
              accentColor: space.accentColor,
              logoUrl: space.logoUrl,
              replyToEmail: space.replyToEmail,
              senderPostalAddress: space.senderPostalAddress,
              newTestimonialEmailEnabled: space.newTestimonialEmailEnabled,
              offersIncentive: space.incentiveDeclaredAt !== null,
            }}
            collectionAddressPrefix={displayUrl(collectionUrl).slice(0, -space.slug.length)}
            previewProductName={firstOffer?.name ?? EXAMPLE_PRODUCT_NAME}
            offersHref={OFFERS_SECTION_HREF}
          />
        </div>
      </SpacePage>
    </>
  );
};

export default SettingsPage;
