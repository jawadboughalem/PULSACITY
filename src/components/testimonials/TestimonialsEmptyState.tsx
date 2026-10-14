import Link from "next/link";
import { CopyLinkField } from "@/components/space/CopyLinkField";
import { ShareLinkButton } from "@/components/space/ShareLinkButton";
import { CONNECTORS_SECTION_HREF } from "@/components/space/space-sections";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export const EMPTY_TESTIMONIALS_TEXT =
  "Partagez votre lien de collecte ou connectez l'outil où vous vendez pour recevoir vos premiers avis.";

export const TestimonialsEmptyState = ({ collectionUrl }: { collectionUrl: string }) => (
  <section className="flex flex-col gap-6 desktop:gap-8">
    <p className="max-w-text text-body">{EMPTY_TESTIMONIALS_TEXT}</p>
    <div className="hidden flex-col gap-8 desktop:flex">
      <CopyLinkField url={collectionUrl} />
      <div className="flex items-center gap-4">
        <span className="text-body text-gray">ou</span>
        <Link href={CONNECTORS_SECTION_HREF} className={SECONDARY_BUTTON_CLASSES}>
          <Icon name="connection" size={20} />
          Connecter mon outil
        </Link>
      </div>
    </div>
    <div className="flex flex-col gap-3 desktop:hidden">
      <ShareLinkButton url={collectionUrl} />
      <Link href={CONNECTORS_SECTION_HREF} className={cn(SECONDARY_BUTTON_CLASSES, "w-full")}>
        <Icon name="connection" size={20} />
        Connecter mon outil
      </Link>
    </div>
  </section>
);
