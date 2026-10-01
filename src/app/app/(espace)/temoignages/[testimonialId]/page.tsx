import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { SpacePage } from "@/components/space/SpacePage";
import { TESTIMONIALS_SECTION_HREF } from "@/components/space/space-sections";
import { FirstApprovalCelebration } from "@/components/testimonials/FirstApprovalCelebration";
import { TestimonialDetailView } from "@/components/testimonials/TestimonialDetailView";
import { Icon } from "@/components/ui/Icon";
import { canAddTestimonial } from "@/config/plans";
import { getDb } from "@/db";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceProducts } from "@/lib/spaces/list-space-products";
import { countApprovedTestimonials } from "@/lib/testimonials/count-approved-testimonials";
import { loadTestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";

export const metadata: Metadata = {
  title: "Témoignage · PULSACITY",
};

const TestimonialPage = async ({ params }: PageProps<"/app/temoignages/[testimonialId]">) => {
  const { testimonialId } = await params;
  if (!z.uuid().safeParse(testimonialId).success) notFound();

  const { space } = await getCurrentSpace();
  const database = getDb();
  const [testimonial, products, approvedCount] = await Promise.all([
    loadTestimonialDetail(database, space.id, testimonialId),
    listSpaceProducts(database, space.id),
    countApprovedTestimonials(database, space.id),
  ]);
  if (!testimonial) notFound();

  return (
    <>
      <header className="flex h-[60px] shrink-0 items-center border-b border-hairline-200 px-5 desktop:hidden">
        <Link
          href={TESTIMONIALS_SECTION_HREF}
          className="-ml-1 flex min-h-[44px] items-center gap-2 px-1 text-body font-medium text-carmine hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        >
          <Icon name="chevronLeft" size={20} />
          Témoignages
        </Link>
      </header>
      <SpacePage>
        <FirstApprovalCelebration>
          <TestimonialDetailView
            key={`${testimonial.id}-${testimonial.displayEditedAt?.getTime() ?? "original"}`}
            testimonial={testimonial}
            products={products}
            isApprovalAllowed={canAddTestimonial(space, approvedCount)}
            listHref={TESTIMONIALS_SECTION_HREF}
            proofHref={`${TESTIMONIALS_SECTION_HREF}/${testimonial.id}/preuve`}
          />
        </FirstApprovalCelebration>
      </SpacePage>
    </>
  );
};

export default TestimonialPage;
