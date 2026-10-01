import type { Metadata } from "next";
import Link from "next/link";
import { BackBar, Breadcrumb } from "@/components/space/BackBar";
import { SpacePage } from "@/components/space/SpacePage";
import { IMPORT_TESTIMONIALS_HREF, TESTIMONIALS_SECTION_HREF } from "@/components/space/space-sections";
import { ManualTestimonialForm } from "@/components/testimonials/ManualTestimonialForm";
import { getDb } from "@/db";
import { readParisDate } from "@/lib/dates/paris-date";
import { quoteInFrench } from "@/lib/french/typography";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceProducts } from "@/lib/spaces/list-space-products";

export const metadata: Metadata = {
  title: "Ajouter un témoignage · PULSACITY",
};

const formatFrenchDay = ({ year, month, day }: { year: number; month: number; day: number }) =>
  `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;

const AddTestimonialPage = async () => {
  const { space } = await getCurrentSpace();
  const products = await listSpaceProducts(getDb(), space.id);

  return (
    <>
      <BackBar href={TESTIMONIALS_SECTION_HREF} label="Témoignages" />
      <SpacePage className="desktop:max-w-[1192px]">
        <Breadcrumb parentHref={TESTIMONIALS_SECTION_HREF} parentLabel="Témoignages" current="Ajouter un témoignage" />
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-h1 font-medium">Ajouter un témoignage</h1>
          <p className="max-w-text text-body text-slate-600">
            Pour un avis reçu ailleurs : un message WhatsApp, un e-mail, un mot après une séance.
          </p>
        </div>
        <div className="flex flex-col gap-7 min-[1280px]:grid min-[1280px]:grid-cols-[minmax(0,632px)_minmax(280px,368px)] min-[1280px]:items-start min-[1280px]:gap-8">
          <ManualTestimonialForm
            products={products}
            dateExample={formatFrenchDay(readParisDate(new Date()))}
            testimonialsHref={TESTIMONIALS_SECTION_HREF}
            importHref={IMPORT_TESTIMONIALS_HREF}
          />
          <aside className="hidden flex-col gap-4 bg-paper-100 p-5 min-[1280px]:flex">
            <h2 className="font-serif text-quote font-medium">Bon à savoir</h2>
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
            <div className="flex flex-col gap-2 border-t border-hairline-200 pt-4">
              <p className="text-small font-semibold">Vous en avez beaucoup ?</p>
              <Link
                href={IMPORT_TESTIMONIALS_HREF}
                className="self-start text-small font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
              >
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
