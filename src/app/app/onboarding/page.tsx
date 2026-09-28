import { redirect } from "next/navigation";
import { OnboardingStepHeading } from "@/components/onboarding/OnboardingStepHeading";
import { SpaceForm } from "@/components/onboarding/SpaceForm";
import { getDb } from "@/db";
import { buildCollectionUrl, displayUrl } from "@/lib/app-url";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { ONBOARDING_FORMATIONS_STEP_PATH } from "@/lib/spaces/space-paths";

const EMPTY_SLUG = "";

const SpaceStepPage = async () => {
  const signedInUser = await requireSignedInUser();
  if (await findOwnedSpace(getDb(), signedInUser.id)) redirect(ONBOARDING_FORMATIONS_STEP_PATH);

  return (
    <>
      <OnboardingStepHeading
        step={1}
        title="Votre espace"
        description="Ces informations apparaissent sur la page où vos clients laissent leur avis."
      />
      <SpaceForm
        defaultReplyToEmail={signedInUser.email}
        collectionAddressPrefix={displayUrl(buildCollectionUrl(EMPTY_SLUG))}
      />
    </>
  );
};

export default SpaceStepPage;
