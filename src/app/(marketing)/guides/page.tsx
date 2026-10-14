import Link from "next/link";
import { FinalCall } from "@/components/marketing/FinalCall";
import { GuideList } from "@/components/marketing/guides/GuideList";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { GUIDES, GUIDE_GROUPS } from "@/content/guides";
import { cn } from "@/lib/cn";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Guides : récolter et afficher les témoignages de vos clients",
    description:
      "Des guides concrets pour les formateurs, coachs et consultants : récolter des témoignages, relier Zapier, Make ou n8n, les afficher, respecter le RGPD.",
    path: MARKETING_PATHS.guides,
  });

/** Maquette 22, « Guides »: the guides by group, each beside its title, where to ask, then the call of m7. */
const GuidesPage = () => (
  <>
    <MarketingSection labelledBy="guides-title">
      <div className="flex max-w-[680px] flex-col gap-4">
        <h1 id="guides-title" className="font-display text-h1">
          Guides
        </h1>
        <p className="text-lead">
          Recueillir vos premiers avis, les afficher, rester dans les règles. Des guides courts, tenus à jour à chaque
          changement.
        </p>
      </div>
      <div className="mt-10 flex flex-col gap-12 desktop:mt-12">
        {GUIDE_GROUPS.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`guides-${group.id}`}
            className="grid gap-6 desktop:grid-cols-[448px_minmax(0,1fr)] desktop:gap-8"
          >
            <div className="flex flex-col gap-3">
              <h2 id={`guides-${group.id}`} className="font-display text-h2">
                {group.title}
              </h2>
              <p className="text-body text-gray desktop:text-small">{group.text}</p>
            </div>
            <GuideList guides={GUIDES.filter((guide) => guide.group === group.id)} />
          </section>
        ))}
      </div>
    </MarketingSection>
    <MarketingSection labelledBy="guides-question" tone="paper">
      <div className="flex flex-col items-start gap-4">
        <SectionTitle id="guides-question">Une question sans réponse ici ?</SectionTitle>
        <p className="max-w-text text-body text-gray">
          Écrivez-nous. Si c&apos;est une installation, nous la faisons avec vous, en partage d&apos;écran.
        </p>
        <Link href={MARKETING_PATHS.contact} className={cn(SECONDARY_BUTTON_CLASSES, "mt-2 w-full desktop:w-auto")}>
          Nous écrire
        </Link>
      </div>
    </MarketingSection>
    <FinalCall
      title="Vos clients ont déjà quelque chose à dire."
      text="Reliez l'outil où vous vendez : la prochaine vente fait le reste."
    />
  </>
);

export default GuidesPage;
