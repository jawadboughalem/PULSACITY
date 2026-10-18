import type { ReactNode } from "react";
import { PaymentProblemBanner } from "@/components/billing/PaymentProblemBanner";
import { cn } from "@/lib/cn";

type SpacePageProps = {
  children: ReactNode;
  className?: string;
  /** « Abonnement et factures » shows the failed payment in its own banner. */
  hidesPaymentProblem?: boolean;
};

/**
 * Charte v2, the page of the space: padding 48 × 56 on a computer; on a phone, the page's gutter, and room under the
 * content for the tab bar (84) and 24 more. A failed payment puts its banner on top of every page.
 */
export const SpacePage = ({ children, className, hidesPaymentProblem = false }: SpacePageProps) => (
  <main
    className={cn(
      "flex flex-col gap-6 px-page-gutter pt-6 pb-[108px] desktop:gap-10 desktop:px-11 desktop:py-10",
      className,
    )}
  >
    {hidesPaymentProblem ? null : <PaymentProblemBanner />}
    {children}
  </main>
);
