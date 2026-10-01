import type { Metadata } from "next";
import Link from "next/link";
import { BackBar, Breadcrumb } from "@/components/space/BackBar";
import { SpacePage } from "@/components/space/SpacePage";
import { IMPORT_TESTIMONIALS_HREF, TESTIMONIALS_SECTION_HREF } from "@/components/space/space-sections";
import { ManualTestimonialForm } from "@/components/testimonials/ManualTestimonialForm";
import { getDb } from "@/db";
import { readParisDate } from "@/lib/dates/paris-date";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceProducts } from "@/lib/spaces/list-space-products";

export const metadata: Metadata = {
  title: "Ajouter un témoignage · PULSACITY",
};

const formatIsoDay = ({ year, month, day }: { year: number; month: number; day: number }) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const AddTestimonialPage = async () => {
  const { space } = await getCurrentSpace();
  const products = await listSpaceProducts(getDb(), space.id);

  return (
    <>
      <BackBar href={TESTIMONIALS_SECTION_HREF} label="Témoignages" />
      <SpacePage className="desktop:max-w-[768px]">
        <Breadcrumb parentHref={TESTIMONIALS_SECTION_HREF} parentLabel="Témoignages" current="Ajouter un témoignage" />
        <div className="flex flex-col gap-2 border-b border-ink-900 pb-5 desktop:pb-6">
          <h1 className="font-serif text-h1 font-medium">Ajouter un témoignage</h1>
          <p className="max-w-text text-body text-slate-600">
            Reçu par WhatsApp, par e-mail ou de vive voix : recopiez-le ici. Il est validé dès son ajout.
          </p>
          <p className="text-body text-slate-600">
            Vous en avez beaucoup ?{" "}
            <Link
              href={IMPORT_TESTIMONIALS_HREF}
              className="font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
            >
              Importez un fichier CSV
            </Link>
          </p>
        </div>
        <ManualTestimonialForm
          products={products}
          today={formatIsoDay(readParisDate(new Date()))}
          detailHrefPrefix={TESTIMONIALS_SECTION_HREF}
        />
      </SpacePage>
    </>
  );
};

export default AddTestimonialPage;
