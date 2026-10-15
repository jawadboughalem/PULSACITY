import * as Sentry from "@sentry/nextjs";
import { cookies } from "next/headers";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import { getSignedInUser } from "@/lib/auth/get-signed-in-user";
import {
  BILLING_PATH,
  PLAN_CHOICE_COOKIE,
  decodePlanChoice,
  encodePlanChoice,
  parsePlanChoice,
} from "@/lib/billing/billing-paths";
import { describeBillingError } from "@/lib/billing/billing-notices";
import { startCheckout } from "@/lib/billing/checkout";
import { getStripe, isStripeConfigured, usesStripeTestClocks } from "@/lib/billing/stripe-client";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { ONBOARDING_SPACE_STEP_PATH } from "@/lib/spaces/space-paths";

/** The plan chosen on Tarifs waits two hours for the sign-up or the sign-in, then the payment opens by itself. */
const CHOICE_LIFETIME_SECONDS = 2 * 60 * 60;

const NO_CACHE = { "Cache-Control": "no-store" };

const redirectTo = (location: string, status = 303) =>
  new Response(null, { status, headers: { ...NO_CACHE, Location: location } });

/**
 * « Choisir Essentiel », « Passer au plan Pro »: opens Stripe Checkout for the plan and period of the address. Without a
 * session, the choice is kept in a cookie while the creator signs up (or signs in), creates the space, then comes
 * back here from the space (layout). A space already subscribed changes plan on « Abonnement et factures ».
 */
export const GET = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const choice =
    parsePlanChoice(url.searchParams.get("plan"), url.searchParams.get("periode")) ??
    decodePlanChoice(cookieStore.get(PLAN_CHOICE_COOKIE)?.value);
  if (choice === null) {
    cookieStore.delete(PLAN_CHOICE_COOKIE);
    return redirectTo(BILLING_PATH);
  }

  const signedInUser = await getSignedInUser();
  const database = getDb();
  const space = signedInUser === null ? null : await findOwnedSpace(database, signedInUser.id);
  if (signedInUser === null || space === null) {
    cookieStore.set(PLAN_CHOICE_COOKIE, encodePlanChoice(choice), {
      httpOnly: true,
      sameSite: "lax",
      secure: url.protocol === "https:",
      path: "/",
      maxAge: CHOICE_LIFETIME_SECONDS,
    });
    return redirectTo(signedInUser === null ? MARKETING_PATHS.signUp : ONBOARDING_SPACE_STEP_PATH);
  }
  cookieStore.delete(PLAN_CHOICE_COOKIE);

  if (!isStripeConfigured()) return redirectTo(describeBillingError("checkout"));
  try {
    const opened = await startCheckout(database, getStripe(), {
      space,
      email: signedInUser.email,
      plan: choice.plan,
      period: choice.period,
      appUrl: getAppUrl(),
      withTestClock: usesStripeTestClocks(),
    });
    return redirectTo(opened.status === "opened" ? opened.url : BILLING_PATH);
  } catch (error) {
    Sentry.captureException(error);
    return redirectTo(describeBillingError("checkout"));
  }
};
