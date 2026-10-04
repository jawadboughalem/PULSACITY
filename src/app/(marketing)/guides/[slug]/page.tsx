import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCall } from "@/components/marketing/FinalCall";
import { GuideList } from "@/components/marketing/guides/GuideList";
import { formatGuideMeta } from "@/components/marketing/guides/format-guide-meta";
import { MARKETING_PATHS, guidePath } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { TEXT_LINK_CLASSES } from "@/components/marketing/marketing-styles";
import { ProseColumn } from "@/components/marketing/ProseColumn";
import { GUIDES, findGuide } from "@/content/guides";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const dynamicParams = false;

export const generateStaticParams = () => GUIDES.map((guide) => ({ slug: guide.slug }));

export const generateMetadata = async ({ params }: PageProps<"/guides/[slug]">) => {
  const guide = findGuide((await params).slug);
  if (!guide) return {};
  return buildPageMetadata({ title: guide.title, description: guide.description, path: guidePath(guide.slug) });
};

/** A guide of /guides: its MDX text in one column, then the other guides. No maquette of its own. */
const GuidePage = async ({ params }: PageProps<"/guides/[slug]">) => {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  const { default: GuideText } = await guide.load();
  const otherGuides = GUIDES.filter((other) => other.slug !== guide.slug);

  return (
    <>
      <MarketingSection labelledBy="guide-title" className="desktop:pt-7">
        <article className="flex flex-col gap-6 desktop:gap-7">
          <header className="flex flex-col gap-4 desktop:max-w-[880px]">
            <nav aria-label="Fil d'Ariane" className="text-small">
              <Link href={MARKETING_PATHS.guides} className={TEXT_LINK_CLASSES}>
                Guides
              </Link>
            </nav>
            <h1 id="guide-title" className="font-serif text-h1 font-medium">
              {guide.title}
            </h1>
            <p className="max-w-text font-serif text-quote">{guide.description}</p>
            <p className="text-small text-slate-600">{formatGuideMeta(guide)}</p>
          </header>
          <div className="border-t border-hairline-200 pt-6 desktop:pt-7">
            <ProseColumn>
              <GuideText />
            </ProseColumn>
          </div>
        </article>
      </MarketingSection>

      <MarketingSection labelledBy="other-guides" tone="paper">
        <div className="grid gap-6 desktop:grid-cols-[448px_1fr]">
          <SectionTitle id="other-guides">Autres guides</SectionTitle>
          <GuideList guides={otherGuides} />
        </div>
      </MarketingSection>

      <FinalCall
        title="Vos ventes deviennent des témoignages, automatiquement."
        text="Une demande d'avis à votre nom après chaque vente, et les avis validés sur votre page."
      />
    </>
  );
};

export default GuidePage;
