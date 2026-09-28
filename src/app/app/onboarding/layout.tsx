import type { Metadata } from "next";
import { SiteHeader } from "@/components/ui/SiteHeader";

export const metadata: Metadata = {
  title: "Votre espace · PULSACITY",
};

const OnboardingLayout = ({ children }: LayoutProps<"/app/onboarding">) => (
  <>
    <SiteHeader />
    <main className="px-page-gutter py-7">
      <div className="mx-auto flex w-full max-w-text flex-col gap-6">{children}</div>
    </main>
  </>
);

export default OnboardingLayout;
