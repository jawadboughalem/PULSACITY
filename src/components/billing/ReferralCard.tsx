import Link from "next/link";
import { REFERRAL_HREF } from "@/components/space/space-sections";
import { INLINE_LINK_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";

/** Maquettes 8.3, the last card of « Abonnement et factures »: the way to Parrainage. */
export const ReferralCard = () => (
  <section aria-labelledby="referral-card" className="flex flex-col gap-3 rounded-panel bg-white p-5 desktop:p-8">
    <h2 id="referral-card" className="flex items-center gap-3 font-display text-h3">
      <Icon name="gift" size={24} />
      Parrainage
    </h2>
    <p className="text-body">Un mois d&apos;Essentiel offert pour chaque créateur parrainé qui s&apos;abonne.</p>
    <Link href={REFERRAL_HREF} className={`${INLINE_LINK_CLASSES} self-start`}>
      Voir mon lien de parrainage
    </Link>
  </section>
);
