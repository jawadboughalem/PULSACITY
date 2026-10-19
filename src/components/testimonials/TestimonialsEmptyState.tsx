import Link from "next/link";
import { CopyLinkField } from "@/components/space/CopyLinkField";
import { ShareLinkButton } from "@/components/space/ShareLinkButton";
import { CONNECTORS_SECTION_HREF } from "@/components/space/space-sections";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export const EMPTY_TESTIMONIALS_TEXT =
  "Partagez votre lien de collecte ou connectez l'outil où vous vendez pour recevoir vos premiers avis.";

/**
 * Maquettes 3.4, Témoignages vides: a white card with its illustration. One main button per screen: on a computer,
 * « Ajouter un témoignage » is it, so « Copier le lien » is secondary.
 */
export const TestimonialsEmptyState = ({ collectionUrl }: { collectionUrl: string }) => (
  <section className="flex flex-col gap-6 rounded-panel bg-white p-5 desktop:p-9">
    <div className="flex flex-col gap-4 desktop:gap-6">
      <EmptyIllustration icon="quote" />
      <p className="max-w-text text-body">{EMPTY_TESTIMONIALS_TEXT}</p>
    </div>
    <div className="hidden flex-col gap-6 desktop:flex">
      <CopyLinkField url={collectionUrl} buttonVariant="secondary" />
      <div className="flex items-center gap-4">
        <span className="text-body text-gray">ou</span>
        <Link href={CONNECTORS_SECTION_HREF} className={SECONDARY_BUTTON_CLASSES}>
          <Icon name="connection" size={20} />
          Connecter mon outil
        </Link>
      </div>
    </div>
    <div className="flex flex-col gap-4 desktop:hidden">
      <ShareLinkButton url={collectionUrl} />
      <Link href={CONNECTORS_SECTION_HREF} className={cn(SECONDARY_BUTTON_CLASSES, "w-full")}>
        <Icon name="connection" size={20} />
        Connecter mon outil
      </Link>
    </div>
  </section>
);
