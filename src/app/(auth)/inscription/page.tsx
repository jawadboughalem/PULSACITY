import type { Metadata } from "next";
import Link from "next/link";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { readSignupSource } from "@/lib/acquisition/signup-source";
import { redirectSignedInUser } from "@/lib/auth/redirect-signed-in-user";

export const metadata: Metadata = {
  title: "Créer mon espace · PULSACITY",
};

const SignUpPage = async ({ searchParams }: PageProps<"/inscription">) => {
  await redirectSignedInUser();
  const source = readSignupSource(await searchParams);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-h1">Créez votre espace</h1>
        <p className="text-body text-gray">
          Indiquez votre adresse e-mail. Vous recevrez un lien pour entrer, sans mot de passe.
        </p>
      </div>
      <MagicLinkForm source={source} asksHeardFrom />
      <p className="flex flex-wrap items-center gap-x-2 pt-6 text-body">
        Vous avez déjà un espace ?
        <Link href="/connexion" className={DISCREET_BUTTON_CLASSES}>
          Me connecter
        </Link>
      </p>
    </>
  );
};

export default SignUpPage;
