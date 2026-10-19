import Link from "next/link";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { FoldedTableOfContents, TableOfContents } from "@/components/marketing/reading/TableOfContents";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { ABOUT_REVIEWS_SECTIONS } from "@/content/about-reviews";
import { cn } from "@/lib/cn";

const CONTENTS_TITLE = "Sur cette page";

const HEADINGS = ABOUT_REVIEWS_SECTIONS.map(({ id, title }) => ({ id, title }));

const BREADCRUMB_LINK_CLASSES = cn("underline decoration-2 underline-offset-4 hover:text-ink-800", FOCUS_RING);

/**
 * Maquette 3.5, « À propos de ces avis » (charte v2, ajouts 3.5, Lecture): on Nuage, the article on a white plate,
 * radius 24, padding 40 48, 760 at most; its contents on a white plate of 320 beside it, the title being read on a Ciel
 * pill; on a phone, the contents folded under the page's heading.
 */
export const AboutReviewsArticle = () => (
  <section aria-labelledby="about-reviews-title" className="bg-cloud px-page-gutter">
    <div className="mx-auto flex max-w-content flex-col gap-6 py-8 desktop:gap-8 desktop:py-12">
      <nav aria-label="Fil d'Ariane" className="text-small">
        <ol className="flex items-center gap-3">
          <li>
            <Link href={MARKETING_PATHS.home} className={BREADCRUMB_LINK_CLASSES}>
              Accueil
            </Link>
          </li>
          <li aria-hidden="true" className="flex">
            <Icon name="chevronRight" size={16} />
          </li>
          <li aria-current="page" className="text-gray">
            À propos de ces avis
          </li>
        </ol>
      </nav>
      <header className="flex max-w-[680px] flex-col gap-4">
        <h1 id="about-reviews-title" className="font-display text-h1">
          À propos de ces avis
        </h1>
        <p className="text-lead">
          Les témoignages affichés avec PULSACITY suivent les règles de cette page. Elles valent pour tous les créateurs,
          quel que soit leur plan.
        </p>
      </header>
      <div className="desktop:hidden">
        <FoldedTableOfContents title={CONTENTS_TITLE} headings={HEADINGS} isPlate />
      </div>
      <div className="grid items-start gap-12 desktop:grid-cols-[760px_320px]">
        <article className="flex min-w-[0] flex-col gap-10 rounded-panel bg-white px-5 py-8 desktop:px-12 desktop:py-10">
          {ABOUT_REVIEWS_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={section.id} className="flex flex-col gap-4">
              <h2 id={section.id} className="scroll-mt-28 font-display text-h2">
                {section.title}
              </h2>
              {section.content}
            </section>
          ))}
        </article>
        <aside className="hidden desktop:block desktop:self-stretch">
          <TableOfContents title={CONTENTS_TITLE} headings={HEADINGS} isPlate />
        </aside>
      </div>
    </div>
  </section>
);
