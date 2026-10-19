import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { canHideBadge } from "@/config/plans";
import { getDb } from "@/db";
import { getSignedInUser } from "@/lib/auth/get-signed-in-user";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { slugify } from "@/lib/spaces/slugify";
import { getDisplayedBody } from "@/lib/testimonials/displayed-body";
import { loadTestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";
import {
  TESTIMONIAL_IMAGE_FORMATS,
  isTestimonialImageFormat,
  renderTestimonialImage,
} from "@/lib/testimonials/render-testimonial-image";

const notFound = () =>
  new Response("Ce témoignage ne se partage pas.", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "private, no-store" },
  });

/**
 * « Partager » on the page of a validated testimonial (maquettes 3.6): its image, portrait or landscape, shown in the
 * window, or downloaded with ?telecharger=1. Only the space's own validated testimonials.
 */
export const GET = async (
  request: Request,
  { params }: RouteContext<"/app/temoignages/[testimonialId]/image">,
): Promise<Response> => {
  const { testimonialId } = await params;
  const search = new URL(request.url).searchParams;
  const format = search.get("format") ?? "portrait";
  const signedInUser = await getSignedInUser();
  if (!signedInUser || !z.uuid().safeParse(testimonialId).success || !isTestimonialImageFormat(format)) return notFound();

  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  const testimonial = space ? await loadTestimonialDetail(database, space.id, testimonialId) : null;
  if (!space || !testimonial || testimonial.status !== "approved") return notFound();

  try {
    const image = await renderTestimonialImage({
      format,
      spaceName: space.name,
      logoUrl: space.logoUrl,
      accentColor: space.accentColor,
      showsPoweredBy: !canHideBadge(space),
      declaresIncentive: space.incentiveDeclaredAt !== null,
      authorName: testimonial.authorName,
      authorTitle: testimonial.authorTitle,
      rating: testimonial.rating,
      text: getDisplayedBody(testimonial),
      reviewedAt: testimonial.createdAt,
      purchasedAt: testimonial.request?.purchasedAt ?? null,
    });
    const { width, height } = TESTIMONIAL_IMAGE_FORMATS[format];
    const fileName = `temoignage-${slugify(testimonial.authorName) || "client"}-${width}x${height}.png`;
    const headers = new Headers(image.headers);
    headers.set("Cache-Control", "private, no-store");
    if (search.get("telecharger") === "1") headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
    return new Response(image.body, { status: 200, headers });
  } catch (error) {
    Sentry.captureException(error);
    return new Response("L'image n'a pas pu être préparée. Réessayez dans un instant.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "private, no-store" },
    });
  }
};
