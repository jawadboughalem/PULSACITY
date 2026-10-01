import { z } from "zod";
import { getDb } from "@/db";
import { getSignedInUser } from "@/lib/auth/get-signed-in-user";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { slugify } from "@/lib/spaces/slugify";
import { buildConsentProof } from "@/lib/testimonials/build-consent-proof";
import { loadTestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";

const notFound = () =>
  new Response("Ce témoignage est introuvable.", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

export const GET = async (
  _request: Request,
  { params }: RouteContext<"/app/temoignages/[testimonialId]/preuve">,
): Promise<Response> => {
  const { testimonialId } = await params;
  const signedInUser = await getSignedInUser();
  if (!signedInUser || !z.uuid().safeParse(testimonialId).success) return notFound();

  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  const testimonial = space ? await loadTestimonialDetail(database, space.id, testimonialId) : null;
  if (!space || !testimonial) return notFound();

  const fileName = `consentement-${slugify(testimonial.authorName) || "temoignage"}-${testimonial.id.slice(0, 8)}.txt`;
  return new Response(buildConsentProof(space.name, testimonial), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
};
