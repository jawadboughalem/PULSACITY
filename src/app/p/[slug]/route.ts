import * as Sentry from "@sentry/nextjs";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { getDb } from "@/db";
import { resolveReferralLink } from "@/lib/referrals/referral-links";

/** A creator's referral link (pulsacity.com/p/julie-nutrition): the home page, with the referral code in its address. */
export const GET = async (request: Request, { params }: RouteContext<"/p/[slug]">): Promise<Response> => {
  const { slug } = await params;
  let destination: string = MARKETING_PATHS.home;
  try {
    destination = await resolveReferralLink(getDb(), slug);
  } catch (error) {
    // The visitor still reaches the site; only the referral is lost.
    Sentry.captureException(error);
  }
  return Response.redirect(new URL(destination, request.url), 307);
};
