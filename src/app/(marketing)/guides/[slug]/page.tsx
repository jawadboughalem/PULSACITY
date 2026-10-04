import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideList } from "@/components/marketing/guides/GuideList";
import { formatGuideMeta } from "@/components/marketing/guides/format-guide-meta";
import { MARKETING_PATHS, guidePath } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { TEXT_LINK_CLASSES } from "@/components/marketing/marketing-styles";
import { ReadingLayout } from "@/components/marketing/reading/ReadingLayout";
import { Icon } from "@/components/ui/Icon";
import { GUIDES, findGuide } from "@/content/guides";
import { readGuideHeadings } from "@/lib/content/read-text-headings";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const dynamicParams = false;

export const generateStaticParams = () => GUIDES.map((guide) => ({ slug: guide.slug }));

export const generateMetadata = async ({ params }: PageProps<"/guides/[slug]">) => {
  const guide = findGuide((await params).slug);
  if (!guide) return {};
  return buildPageMetadata({ title: guide.title, description: guide.description, path: guidePath(guide.slug) });
};

const Breadcrumb = ({ title }: { title: string }) => (
  <nav aria-label="Fil d'Ariane" className="text-small">
    <ol className="flex items-center gap-3">
      <li>
        <Link href={MARKETING_PATHS.guides} className={TEXT_LINK_CLASSES}>
          Guides
        </Link>
      </li>
      <li aria-hidden="true" className="flex text-slate-600">
        <Icon name="chevronRight" size={16} />
      </li>
      <li aria-current="page" className="min-w-[0] text-slate-600">
        {title}
      </li>
    </ol>
  </nav>
);

/** Maquette 22, a guide: its MDX text beside its contents, then the other guides. */
const GuidePage = async ({ params }: PageProps<"/guides/[slug]">) => {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  const [{ default: GuideText }, headings] = await Promise.all([guide.load(), readGuideHeadings(guide.slug)]);
  const otherGuides = GUIDES.filter((other) => other.slug !== guide.slug);

  return (
    <>
      <ReadingLayout
        labelledBy="guide-title"
        breadcrumb={<Breadcrumb title={guide.title} />}
        header={
          <>
            <h1 id="guide-title" className="font-serif text-display font-medium tracking-title">
              {guide.title}
            </h1>
            <p className="text-small text-slate-600">{formatGuideMeta(guide)}</p>
            <p className="mt-2 font-serif text-quote">{guide.description}</p>
          </>
        }
        contentsTitle="Dans ce guide"
        headings={headings}
      >
        <GuideText />
      </ReadingLayout>

      <MarketingSection labelledBy="other-guides" hasTopRule>
        <div className="grid gap-6 desktop:grid-cols-[448px_minmax(0,1fr)] desktop:gap-6">
          <SectionTitle id="other-guides">Autres guides</SectionTitle>
          <GuideList guides={otherGuides} />
        </div>
      </MarketingSection>
    </>
  );
};

export default GuidePage;
