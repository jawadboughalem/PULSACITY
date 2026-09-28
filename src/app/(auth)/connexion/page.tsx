import type { Metadata } from "next";
import Link from "next/link";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { MAGIC_LINK_LIFETIME_MINUTES } from "@/lib/auth/magic-link-lifetime";
import { redirectSignedInUser } from "@/lib/auth/redirect-signed-in-user";

export const metadata: Metadata = {
  title: "Connexion · PULSACITY",
};

const SignInPage = async ({ searchParams }: PageProps<"/connexion">) => {
  await redirectSignedInUser();
  const { error } = await searchParams;

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-h1 font-medium">Retrouvez votre espace</h1>
        <p className="text-body text-slate-600">
          Indiquez l&apos;adresse e-mail de votre espace. Vous recevrez un lien pour entrer, sans mot de passe.
        </p>
      </div>
      {error ? (
        <StatusBanner tone="error" title="Ce lien de connexion n'est plus valable.">
          Il a peut-être déjà servi, ou ses {MAGIC_LINK_LIFETIME_MINUTES} minutes sont passées. Demandez-en un
          nouveau ci-dessous.
        </StatusBanner>
      ) : null}
      <MagicLinkForm />
      <p className="flex flex-wrap items-center gap-x-1 border-t border-hairline-200 pt-5 text-body">
        Pas encore d&apos;espace ?
        <Link href="/inscription" className={DISCREET_BUTTON_CLASSES}>
          Créer mon espace gratuit
        </Link>
      </p>
    </>
  );
};

export default SignInPage;
