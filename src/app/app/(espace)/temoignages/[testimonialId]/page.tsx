import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { BackBar } from "@/components/space/BackBar";
import { SpacePage } from "@/components/space/SpacePage";
import { TESTIMONIALS_SECTION_HREF } from "@/components/space/space-sections";
import { FirstApprovalCelebration } from "@/components/testimonials/FirstApprovalCelebration";
import { FIRST_APPROVAL_SEARCH_PARAM } from "@/components/testimonials/first-approval-param";
import { TestimonialDetailView } from "@/components/testimonials/TestimonialDetailView";
import { canAddTestimonial } from "@/config/plans";
import { getDb } from "@/db";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceProducts } from "@/lib/spaces/list-space-products";
import { countApprovedTestimonials } from "@/lib/testimonials/count-approved-testimonials";
import { loadTestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";

export const metadata: Metadata = {
  title: "Témoignage · PULSACITY",
};

const TestimonialPage = async ({ params, searchParams }: PageProps<"/app/temoignages/[testimonialId]">) => {
  const { testimonialId } = await params;
  const isFirstApproval = (await searchParams)[FIRST_APPROVAL_SEARCH_PARAM] === "1";
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
      <BackBar href={TESTIMONIALS_SECTION_HREF} label="Témoignages" />
      <SpacePage>
        <FirstApprovalCelebration isInitiallyShown={isFirstApproval && testimonial.status === "approved"}>
          <TestimonialDetailView
            key={testimonial.id}
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
