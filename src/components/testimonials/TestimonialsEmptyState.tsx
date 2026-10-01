import Link from "next/link";
import { CopyLinkField } from "@/components/space/CopyLinkField";
import { ShareLinkButton } from "@/components/space/ShareLinkButton";
import { SYSTEME_CONNECTOR_HREF } from "@/components/space/space-sections";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export const EMPTY_TESTIMONIALS_TEXT =
  "Partagez votre lien de collecte ou connectez Systeme.io pour recevoir vos premiers avis.";

export const TestimonialsEmptyState = ({ collectionUrl }: { collectionUrl: string }) => (
  <section className="flex flex-col gap-5 border-t border-ink-900 pt-5 desktop:gap-6 desktop:pt-6">
    <p className="max-w-text text-body">{EMPTY_TESTIMONIALS_TEXT}</p>
    <div className="hidden flex-col gap-6 desktop:flex">
      <CopyLinkField url={collectionUrl} />
      <div className="flex items-center gap-4">
        <span className="text-body text-slate-600">ou</span>
        <Link href={SYSTEME_CONNECTOR_HREF} className={SECONDARY_BUTTON_CLASSES}>
          <Icon name="connection" size={20} />
          Connecter Systeme.io
        </Link>
      </div>
    </div>
    <div className="flex flex-col gap-3 desktop:hidden">
      <ShareLinkButton url={collectionUrl} />
      <Link href={SYSTEME_CONNECTOR_HREF} className={cn(SECONDARY_BUTTON_CLASSES, "w-full")}>
        <Icon name="connection" size={20} />
        Connecter Systeme.io
      </Link>
    </div>
  </section>
);
