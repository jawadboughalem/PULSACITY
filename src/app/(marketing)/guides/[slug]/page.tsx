import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/marketing/Breadcrumb";
import { GuideList } from "@/components/marketing/guides/GuideList";
import { JsonLd } from "@/components/marketing/JsonLd";
import { formatGuideMeta } from "@/components/marketing/guides/format-guide-meta";
import { MARKETING_PATHS, guidePath } from "@/components/marketing/marketing-paths";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { SITE_GROUP_TITLE_CLASSES, SITE_PAGE_TITLE_CLASSES } from "@/components/marketing/marketing-styles";
import { ReadingLayout } from "@/components/marketing/reading/ReadingLayout";
import { GUIDES, findGuide } from "@/content/guides";
import { readGuideHeadings } from "@/lib/content/read-text-headings";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { buildGuideData } from "@/lib/seo/structured-data";
import { readSiteUrl } from "@/lib/site-url";

export const dynamicParams = false;

export const generateStaticParams = () => GUIDES.map((guide) => ({ slug: guide.slug }));

export const generateMetadata = async ({ params }: PageProps<"/guides/[slug]">) => {
  const guide = findGuide((await params).slug);
  if (!guide) return {};
  return buildPageMetadata({ title: guide.title, description: guide.description, path: guidePath(guide.slug) });
};

/** Maquettes 3.5, a guide: its MDX text on the white plate of the long texts, beside its contents, then the others. */
const GuidePage = async ({ params }: PageProps<"/guides/[slug]">) => {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  const [{ default: GuideText }, headings] = await Promise.all([guide.load(), readGuideHeadings(guide.slug)]);
  const otherGuides = GUIDES.filter((other) => other.slug !== guide.slug);

  return (
    <>
      <JsonLd data={buildGuideData(readSiteUrl(), { ...guide, path: guidePath(guide.slug) })} />
      <ReadingLayout
        labelledBy="guide-title"
        breadcrumb={<Breadcrumb parent={{ href: MARKETING_PATHS.guides, label: "Guides" }} current={guide.title} />}
        header={
          <>
            <h1 id="guide-title" className={SITE_PAGE_TITLE_CLASSES}>
              {guide.title}
            </h1>
            <p className="text-small text-gray">{formatGuideMeta(guide)}</p>
            <p className="mt-1 max-w-[680px] text-lead">{guide.description}</p>
          </>
        }
        contentsTitle="Dans ce guide"
        headings={headings}
      >
        <GuideText />
      </ReadingLayout>

      <MarketingSection labelledBy="other-guides">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 desktop:grid-cols-[400px_minmax(0,1fr)] desktop:gap-12">
          <h2 id="other-guides" className={SITE_GROUP_TITLE_CLASSES}>
            Autres guides
          </h2>
          <GuideList guides={otherGuides} surface="cloud" />
        </div>
      </MarketingSection>
    </>
  );
};

export default GuidePage;
