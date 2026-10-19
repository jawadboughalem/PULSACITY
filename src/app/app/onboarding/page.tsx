import { redirect } from "next/navigation";
import { OnboardingStepHeading } from "@/components/onboarding/OnboardingStepHeading";
import { SpaceForm } from "@/components/onboarding/SpaceForm";
import { getDb } from "@/db";
import { readHeardFrom, readSignupSource } from "@/lib/acquisition/signup-source";
import { buildCollectionUrl, displayUrl } from "@/lib/app-url";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { ONBOARDING_FORMATIONS_STEP_PATH } from "@/lib/spaces/space-paths";

const EMPTY_SLUG = "";

const SpaceStepPage = async ({ searchParams }: PageProps<"/app/onboarding">) => {
  const signedInUser = await requireSignedInUser();
  if (await findOwnedSpace(getDb(), signedInUser.id)) redirect(ONBOARDING_FORMATIONS_STEP_PATH);
  // The source of the sign-up, brought by the sign-in link: the form sends it back with the space.
  const parameters = await searchParams;

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
        source={readSignupSource(parameters)}
        heardFrom={readHeardFrom(parameters)}
      />
    </>
  );
};

export default SpaceStepPage;
