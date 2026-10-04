import type { ReactNode } from "react";
import { ReadingLayout } from "@/components/marketing/reading/ReadingLayout";
import { Icon } from "@/components/ui/Icon";
import { readLegalHeadings } from "@/lib/content/read-text-headings";
import { isLegalValidated } from "@/lib/legal/is-legal-validated";

type LegalPageProps = {
  /** The file of the text in src/content/legal, for its contents. */
  name: "mentions-legales" | "cgu" | "cgv" | "confidentialite";
  title: string;
  /** « 4 octobre 2026 »: the day of the text's last change. */
  updatedOn: string;
  children: ReactNode;
};

/** m23, while the texts are drafts: the passages still to provide are highlighted in Attention. */
const DraftBanner = () => (
  <div role="note" className="flex items-start gap-3 bg-attention-surface p-4 desktop:p-5">
    <Icon name="clock" size={20} className="mt-[2px] shrink-0 text-attention" />
    <div className="flex flex-col gap-1">
      <p className="text-body font-semibold text-attention">Brouillon en cours de relecture</p>
      <p className="text-small">Ce texte n&apos;est pas encore validé. Les passages surlignés restent à compléter.</p>
    </div>
  </div>
);

/** Maquette 23: mentions légales, CGU, CGV, confidentialité, beside their contents. */
export const LegalPage = async ({ name, title, updatedOn, children }: LegalPageProps) => (
  <ReadingLayout
    labelledBy="legal-title"
    header={
      <>
        <h1 id="legal-title" className="font-serif text-display font-medium tracking-title">
          {title}
        </h1>
        <p className="text-small text-slate-600">{`Version du ${updatedOn}`}</p>
        {isLegalValidated() ? null : (
          <div className="mt-2">
            <DraftBanner />
          </div>
        )}
      </>
    }
    contentsTitle="Sur cette page"
    headings={await readLegalHeadings(name)}
  >
    {children}
  </ReadingLayout>
);
