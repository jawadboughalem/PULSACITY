import Link from "next/link";
import { FinalCall, PAGE_FINAL_CALL_TITLE } from "@/components/marketing/FinalCall";
import { GuideList } from "@/components/marketing/guides/GuideList";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import {
  SITE_GROUP_TITLE_CLASSES,
  SITE_LARGE_PAGE_TITLE_CLASSES,
  SITE_PANEL_TITLE_CLASSES,
} from "@/components/marketing/marketing-styles";
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
    socialTitle: "Guides",
  });

/**
 * Maquettes 3.5, Guides, on Nuage: the guides by group, each beside its title, where to ask on a Ciel panel, then the
 * final call on white.
 */
const GuidesPage = () => (
  <>
    <MarketingSection labelledBy="guides-title" tone="cloud" className="desktop:pt-12">
      <div className="flex max-w-[680px] flex-col gap-4">
        <h1 id="guides-title" className={SITE_LARGE_PAGE_TITLE_CLASSES}>
          Guides
        </h1>
        <p className="text-lead">
          Recueillir vos premiers avis, les afficher, rester dans les règles. Des guides courts, tenus à jour à chaque
          changement.
        </p>
      </div>
      <div className="mt-10 flex flex-col gap-10 desktop:mt-14 desktop:gap-14">
        {GUIDE_GROUPS.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`guides-${group.id}`}
            className="grid grid-cols-[minmax(0,1fr)] gap-5 desktop:grid-cols-[400px_minmax(0,1fr)] desktop:gap-12"
          >
            <div className="flex flex-col gap-2">
              <h2 id={`guides-${group.id}`} className={SITE_GROUP_TITLE_CLASSES}>
                {group.title}
              </h2>
              <p className="text-small text-gray">{group.text}</p>
            </div>
            <GuideList guides={GUIDES.filter((guide) => guide.group === group.id)} surface="white" />
          </section>
        ))}
      </div>
      <section
        aria-labelledby="guides-question"
        className="mt-10 flex flex-col items-start gap-4 rounded-panel bg-sky p-6 desktop:mt-14 desktop:px-12 desktop:py-10"
      >
        <h2 id="guides-question" className={SITE_PANEL_TITLE_CLASSES}>
          Une question sans réponse ici ?
        </h2>
        <p className="max-w-text text-body">
          Écrivez-nous. Si c&apos;est une installation, nous la faisons avec vous, en partage d&apos;écran.
        </p>
        <Link href={MARKETING_PATHS.contact} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
          Nous écrire
        </Link>
      </section>
    </MarketingSection>
    <FinalCall title={PAGE_FINAL_CALL_TITLE} text="Reliez l'outil où vous encaissez : chaque vente suivante fait le reste." />
  </>
);

export default GuidesPage;
