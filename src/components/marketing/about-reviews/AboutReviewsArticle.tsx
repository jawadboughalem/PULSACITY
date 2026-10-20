import { Breadcrumb } from "@/components/marketing/Breadcrumb";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { SITE_PAGE_TITLE_CLASSES } from "@/components/marketing/marketing-styles";
import { ReadingLayout } from "@/components/marketing/reading/ReadingLayout";
import { ABOUT_REVIEWS_SECTIONS } from "@/content/about-reviews";

const HEADINGS = ABOUT_REVIEWS_SECTIONS.map(({ id, title }) => ({ id, title }));

/**
 * Maquette 3.5, « À propos de ces avis » (charte v2, ajouts 3.5, Lecture): its seven rules on the white plate of the
 * long texts, beside their contents.
 */
export const AboutReviewsArticle = () => (
  <ReadingLayout
    labelledBy="about-reviews-title"
    breadcrumb={<Breadcrumb parent={{ href: MARKETING_PATHS.home, label: "Accueil" }} current="À propos de ces avis" />}
    header={
      <>
        <h1 id="about-reviews-title" className={SITE_PAGE_TITLE_CLASSES}>
          À propos de ces avis
        </h1>
        <p className="max-w-[680px] text-lead">
          Les témoignages affichés avec PULSACITY suivent les règles de cette page. Elles valent pour tous les créateurs,
          quel que soit leur plan.
        </p>
      </>
    }
    contentsTitle="Sur cette page"
    headings={HEADINGS}
  >
    <div className="flex flex-col gap-10">
      {ABOUT_REVIEWS_SECTIONS.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="flex flex-col gap-4">
          <h2 id={section.id} className="font-display text-h2">
            {section.title}
          </h2>
          {section.content}
        </section>
      ))}
    </div>
  </ReadingLayout>
);
