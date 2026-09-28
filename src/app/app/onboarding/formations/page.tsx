import Link from "next/link";
import { redirect } from "next/navigation";
import { AddFormationForm } from "@/components/onboarding/AddFormationForm";
import { FormationRow } from "@/components/onboarding/FormationRow";
import { OnboardingStepHeading } from "@/components/onboarding/OnboardingStepHeading";
import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { getDb } from "@/db";
import { buildCollectionUrl, displayUrl } from "@/lib/app-url";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { cn } from "@/lib/cn";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { listSpaceProducts } from "@/lib/spaces/list-space-products";
import { ONBOARDING_SPACE_STEP_PATH, SPACE_HOME_PATH } from "@/lib/spaces/space-paths";

const FormationsStepPage = async () => {
  const signedInUser = await requireSignedInUser();
  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  if (!space) redirect(ONBOARDING_SPACE_STEP_PATH);
  const formations = await listSpaceProducts(database, space.id);

  return (
    <>
      <OnboardingStepHeading
        step={2}
        title="Vos formations"
        description="Ajoutez les formations et offres que vous vendez. Chacune aura son lien de collecte. Vous pourrez les relier à Systeme.io ensuite."
      />
      <AddFormationForm key={formations.length} />
      {formations.length > 0 ? (
        <ul className="border-t border-ink-900">
          {formations.map((formation) => (
            <FormationRow
              key={formation.id}
              id={formation.id}
              name={formation.name}
              collectionAddress={displayUrl(buildCollectionUrl(space.slug, formation.slug))}
            />
          ))}
        </ul>
      ) : (
        <p className="text-body text-slate-600">
          Aucune formation pour l&apos;instant. Ajoutez la première, ou passez cette étape.
        </p>
      )}
      <Link href={SPACE_HOME_PATH} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}>
        Ouvrir mon espace
      </Link>
    </>
  );
};

export default FormationsStepPage;
