import type { Metadata } from "next";
import Link from "next/link";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { redirectSignedInUser } from "@/lib/auth/redirect-signed-in-user";

export const metadata: Metadata = {
  title: "Créer mon espace · PULSACITY",
};

const SignUpPage = async () => {
  await redirectSignedInUser();

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-h1 font-medium">Créez votre espace</h1>
        <p className="text-body text-slate-600">
          Indiquez votre adresse e-mail. Vous recevrez un lien pour entrer, sans mot de passe.
        </p>
      </div>
      <MagicLinkForm />
      <p className="flex flex-wrap items-center gap-x-1 border-t border-hairline-200 pt-5 text-body">
        Vous avez déjà un espace ?
        <Link href="/connexion" className={DISCREET_BUTTON_CLASSES}>
          Me connecter
        </Link>
      </p>
    </>
  );
};

export default SignUpPage;
