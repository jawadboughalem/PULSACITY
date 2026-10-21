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

/**
 * m23, while the texts are drafts. Charte v2, Bandeau d'attente: Attente fond, its icon in Attente, the text in Encre.
 */
const DraftBanner = () => (
  <div role="note" className="flex items-start gap-[14px] rounded-card bg-waiting-surface px-5 py-4 desktop:px-6 desktop:py-5">
    <Icon name="clock" size={24} className="mt-[1px] shrink-0 text-waiting" />
    <div className="flex flex-col gap-1">
      <p className="text-body font-bold">Brouillon en cours de relecture</p>
      <p className="text-small">Ce texte n&apos;est pas encore validé.</p>
    </div>
  </div>
);

/** Maquette 23: mentions légales, CGU, CGV, confidentialité, beside their contents. */
export const LegalPage = async ({ name, title, updatedOn, children }: LegalPageProps) => (
  <ReadingLayout
    labelledBy="legal-title"
    header={
      <>
        <h1 id="legal-title" className="font-display text-h1">
          {title}
        </h1>
        <p className="text-small text-gray">{`Version du ${updatedOn}`}</p>
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
