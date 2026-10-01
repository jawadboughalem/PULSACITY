import type { Metadata } from "next";
import { BackBar, Breadcrumb } from "@/components/space/BackBar";
import { SpacePage } from "@/components/space/SpacePage";
import { TESTIMONIALS_SECTION_HREF } from "@/components/space/space-sections";
import { CsvImport } from "@/components/testimonials/CsvImport";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Importer des témoignages · PULSACITY",
};

const ImportTestimonialsPage = async () => {
  await getCurrentSpace();

  return (
    <>
      <BackBar href={TESTIMONIALS_SECTION_HREF} label="Témoignages" />
      <SpacePage className="desktop:max-w-[1024px]">
        <Breadcrumb parentHref={TESTIMONIALS_SECTION_HREF} parentLabel="Témoignages" current="Importer un fichier" />
        <div className="flex flex-col gap-2 border-b border-ink-900 pb-5 desktop:pb-6">
          <h1 className="font-serif text-h1 font-medium">Importer des témoignages</h1>
          <p className="max-w-text text-body text-slate-600">
            Depuis un tableur, enregistrez vos avis en CSV. Vous verrez chaque ligne avant l&apos;import.
          </p>
        </div>
        <CsvImport testimonialsHref={TESTIMONIALS_SECTION_HREF} />
      </SpacePage>
    </>
  );
};

export default ImportTestimonialsPage;
