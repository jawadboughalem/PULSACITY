import type { Metadata } from "next";
import Link from "next/link";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { cn } from "@/lib/cn";

/** The tab says what happened: the root layout's « PULSACITY » alone would win over a <title> in the page. */
export const metadata: Metadata = { title: "Page introuvable · PULSACITY" };

const NotFoundPage = () => (
  <ErrorScreen
    icon="search"
    title="Cette page n'existe pas"
    text="L'adresse est peut-être incomplète. Vérifiez le lien que vous avez reçu, puis ouvrez-le à nouveau."
    action={
      <Link href={MARKETING_PATHS.home} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
        Revenir à l&apos;accueil
      </Link>
    }
    link={
      <Link href={MARKETING_PATHS.contact} className={DISCREET_BUTTON_CLASSES}>
        Écrire à l&apos;équipe
      </Link>
    }
  />
);

export default NotFoundPage;
