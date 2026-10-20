import type { Metadata } from "next";
import { Breadcrumb } from "@/components/space/BackBar";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { MobileBackLink } from "@/components/space/MobileBackLink";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { TESTIMONIALS_SECTION_HREF } from "@/components/space/space-sections";
import { CsvImport } from "@/components/testimonials/CsvImport";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Importer des témoignages · PULSACITY",
};

const ImportTestimonialsPage = async () => {
  const { signedInUser, space } = await getCurrentSpace();

  return (
    <>
      <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />
      <SpacePage className="desktop:gap-6">
        <div className="flex flex-col gap-4 desktop:gap-6">
          <Breadcrumb parentHref={TESTIMONIALS_SECTION_HREF} parentLabel="Témoignages" current="Importer un fichier CSV" />
          <MobileBackLink href={TESTIMONIALS_SECTION_HREF} label="Témoignages" />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-h1">Importer des témoignages</h1>
            <p className="max-w-text text-lead">
              Vous avez déjà des avis dans un tableur ? Importez-les en une fois, depuis un fichier CSV.
            </p>
          </div>
        </div>
        <CsvImport testimonialsHref={TESTIMONIALS_SECTION_HREF} />
      </SpacePage>
    </>
  );
};

export default ImportTestimonialsPage;
