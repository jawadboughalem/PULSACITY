import Link from "next/link";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { TextColumnPage } from "@/components/ui/TextColumnPage";
import { cn } from "@/lib/cn";

const NotFoundPage = () => (
  <TextColumnPage>
    <title>Page introuvable · PULSACITY</title>
    <div className="flex flex-col gap-2">
      <h1 className="font-serif text-h1 font-medium">Cette page n&apos;existe pas</h1>
      <p className="text-body text-slate-600">
        L&apos;adresse est peut-être incomplète. Vérifiez le lien que vous avez reçu, puis ouvrez-le à nouveau.
      </p>
    </div>
    <Link href="/" className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
      Aller à l&apos;accueil
    </Link>
  </TextColumnPage>
);

export default NotFoundPage;
