import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/space/BackBar";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { MobileBackLink } from "@/components/space/MobileBackLink";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { IMPORT_TESTIMONIALS_HREF, TESTIMONIALS_SECTION_HREF } from "@/components/space/space-sections";
import { ManualTestimonialForm } from "@/components/testimonials/ManualTestimonialForm";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { getDb } from "@/db";
import { readParisDate } from "@/lib/dates/paris-date";
import { cn } from "@/lib/cn";
import { quoteInFrench } from "@/lib/french/typography";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceProducts } from "@/lib/spaces/list-space-products";

export const metadata: Metadata = {
  title: "Ajouter un témoignage · PULSACITY",
};

const formatFrenchDay = ({ year, month, day }: { year: number; month: number; day: number }) =>
  `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;

const AddTestimonialPage = async () => {
  const { signedInUser, space } = await getCurrentSpace();
  const products = await listSpaceProducts(getDb(), space.id);

  return (
    <>
      <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />
      <SpacePage className="desktop:gap-6">
        <div className="flex flex-col gap-4 desktop:gap-6">
          <Breadcrumb parentHref={TESTIMONIALS_SECTION_HREF} parentLabel="Témoignages" current="Ajouter un témoignage" />
          <MobileBackLink href={TESTIMONIALS_SECTION_HREF} label="Témoignages" />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-h1">Ajouter un témoignage</h1>
            <p className="max-w-text text-lead">
              Pour un avis reçu ailleurs : un message WhatsApp, un e-mail, un mot après une séance.
            </p>
          </div>
        </div>
        {/* Maquettes 3.4: the form on its white card; « Bon à savoir » on Ciel at its right, from 1280. */}
        <div className="flex flex-col gap-10 min-[1280px]:grid min-[1280px]:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] min-[1280px]:items-start min-[1280px]:gap-7">
          <ManualTestimonialForm
            products={products}
            dateExample={formatFrenchDay(readParisDate(new Date()))}
            testimonialsHref={TESTIMONIALS_SECTION_HREF}
            importHref={IMPORT_TESTIMONIALS_HREF}
          />
          <aside className="hidden flex-col gap-4 rounded-panel bg-sky p-7 min-[1280px]:flex">
            <h2 className="font-display text-h3">Bon à savoir</h2>
            <p className="text-small">
              Vous l&apos;ajoutez vous-même : le témoignage arrive directement en <strong>Validé</strong> et peut
              s&apos;afficher tout de suite.
            </p>
            <p className="text-small">
              Gardez une capture du message de votre côté. Elle prouve l&apos;accord de la personne.
            </p>
            <p className="text-small">
              Il porte la mention {quoteInFrench("Ajouté par vous")} dans votre espace. Vos visiteurs ne la voient pas.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <p className="text-small font-bold">Vous en avez beaucoup ?</p>
              <Link href={IMPORT_TESTIMONIALS_HREF} className={cn(DISCREET_BUTTON_CLASSES, "-ml-[10px] self-start")}>
                Importer un fichier CSV
              </Link>
            </div>
          </aside>
        </div>
      </SpacePage>
    </>
  );
};

export default AddTestimonialPage;
