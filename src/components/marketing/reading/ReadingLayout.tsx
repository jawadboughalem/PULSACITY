import type { ReactNode } from "react";
import { ProseColumn } from "@/components/marketing/ProseColumn";
import type { TextHeading } from "@/lib/content/text-headings";
import { FoldedTableOfContents, TableOfContents } from "./TableOfContents";

type ReadingLayoutProps = {
  labelledBy: string;
  /** Above the title, such as « Guides › Comment ajouter des témoignages sur une page Systeme.io ». */
  breadcrumb?: ReactNode;
  /** The title, its date, and what comes before the text: the lead of a guide, the banner of a draft. */
  header: ReactNode;
  /** « Dans ce guide », « Sur cette page » */
  contentsTitle: string;
  headings: TextHeading[];
  children: ReactNode;
};

/**
 * Charte v2, ajouts 3.5, Lecture (guides, legal texts, « À propos de ces avis »): on Nuage, the article on a white
 * plate, radius 24, padding 40 48, 760 at most; its contents on a white plate of 320 beside it, sticky, the title being
 * read on a Ciel pill; on a phone, the contents folded in 56 px under the page's heading.
 */
export const ReadingLayout = ({ labelledBy, breadcrumb, header, contentsTitle, headings, children }: ReadingLayoutProps) => (
  <section aria-labelledby={labelledBy} className="bg-cloud px-page-gutter">
    <div className="mx-auto flex max-w-content flex-col gap-6 pt-6 pb-10 desktop:gap-8 desktop:pt-10 desktop:pb-14">
      <div className="flex flex-col gap-4">
        {breadcrumb}
        <header className="flex flex-col gap-3">{header}</header>
      </div>
      {headings.length > 1 ? (
        <div className="desktop:hidden">
          <FoldedTableOfContents title={contentsTitle} headings={headings} />
        </div>
      ) : null}
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 desktop:grid-cols-[minmax(0,760px)_320px]">
        <article className="min-w-[0] rounded-panel bg-white px-5 py-8 desktop:px-12 desktop:py-10">
          <ProseColumn>{children}</ProseColumn>
        </article>
        {headings.length > 1 ? (
          <aside className="hidden desktop:block desktop:self-stretch">
            <TableOfContents title={contentsTitle} headings={headings} />
          </aside>
        ) : null}
      </div>
    </div>
  </section>
);
