import type { Metadata } from "next";
import { signOut } from "@/app/app/sign-out-action";
import { AuthCardPage } from "@/components/auth/AuthCardPage";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Votre espace · PULSACITY",
};

/** Maquettes 3.4, Démarrage: the card of 720 on Nuage; « Se déconnecter » in the header, on a computer. */
const OnboardingLayout = ({ children }: LayoutProps<"/app/onboarding">) => (
  <AuthCardPage
    cardWidthClassName="desktop:max-w-[720px]"
    headerAction={
      <form action={signOut} className="max-desktop:hidden">
        <button type="submit" className={cn(DISCREET_BUTTON_CLASSES, "-mr-[10px]")}>
          Se déconnecter
        </button>
      </form>
    }
  >
    {children}
  </AuthCardPage>
);

export default OnboardingLayout;
