import { FinalCall } from "@/components/marketing/FinalCall";
import { GuideList } from "@/components/marketing/guides/GuideList";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { GUIDES, GUIDE_GROUPS } from "@/content/guides";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Guides : récolter et afficher les témoignages de vos clients",
    description:
      "Des guides concrets pour les formateurs, coachs et consultants : récolter des témoignages, les afficher sur Systeme.io, respecter le RGPD.",
    path: MARKETING_PATHS.guides,
  });

/** Maquette 22, « Guides »: the guides in two groups, each beside its title, then the call of m7. */
const GuidesPage = () => (
  <>
    <MarketingSection labelledBy="guides-title">
      <div className="flex max-w-[680px] flex-col gap-4">
        <h1 id="guides-title" className="font-serif text-display font-medium tracking-title">
          Guides
        </h1>
        <p className="font-serif text-quote">
          Recueillir vos premiers avis, les afficher, rester dans les règles. Des guides courts, tenus à jour à chaque
          changement.
        </p>
      </div>
      <div className="mt-7 flex flex-col gap-8 desktop:mt-8">
        {GUIDE_GROUPS.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`guides-${group.id}`}
            className="grid gap-5 desktop:grid-cols-[448px_minmax(0,1fr)] desktop:gap-6"
          >
            <div className="flex flex-col gap-3">
              <h2 id={`guides-${group.id}`} className="font-serif text-h2 font-medium">
                {group.title}
              </h2>
              <p className="text-body text-slate-600 desktop:text-small">{group.text}</p>
            </div>
            <GuideList guides={GUIDES.filter((guide) => guide.group === group.id)} />
          </section>
        ))}
      </div>
    </MarketingSection>
    <FinalCall
      title="Vos clients ont déjà quelque chose à dire."
      text="Deux minutes pour connecter Systeme.io, et la prochaine vente fait le reste."
    />
  </>
);

export default GuidesPage;
