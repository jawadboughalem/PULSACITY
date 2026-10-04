import type { ReactNode } from "react";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { ProseColumn } from "@/components/marketing/ProseColumn";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { isLegalValidated } from "@/lib/legal/is-legal-validated";

type LegalPageProps = {
  title: string;
  /** « 4 octobre 2026 »: the day of the text's last change. */
  updatedOn: string;
  children: ReactNode;
};

/** Mentions légales, CGU, CGV, confidentialité: one column of text, a banner while the texts are drafts. */
export const LegalPage = ({ title, updatedOn, children }: LegalPageProps) => (
  <MarketingSection labelledBy="legal-title" className="desktop:pt-7">
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 id="legal-title" className="font-serif text-h1 font-medium">
          {title}
        </h1>
        <p className="text-small text-slate-600">{`Dernière mise à jour : ${updatedOn}`}</p>
      </header>
      {isLegalValidated() ? null : (
        <div className="max-w-text">
          <StatusBanner tone="waiting" title="Brouillon en cours de relecture">
            Ce texte n&apos;est pas encore définitif. Les passages marqués « À COMPLÉTER » attendent les informations de
            l&apos;entreprise.
          </StatusBanner>
        </div>
      )}
      <div className="border-t border-hairline-200 pt-6">
        <ProseColumn>{children}</ProseColumn>
      </div>
    </article>
  </MarketingSection>
);
