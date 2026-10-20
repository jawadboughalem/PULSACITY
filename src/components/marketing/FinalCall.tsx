import { cn } from "@/lib/cn";
import { CallToAction } from "./CallToAction";
import { MarketingSection, type SectionTone } from "./MarketingSection";
import { SITE_LARGE_PAGE_TITLE_CLASSES, SITE_PAGE_TITLE_CLASSES } from "./marketing-styles";

/** Maquettes 3.5: the call at the end of the pages of tools and of the guides. */
export const PAGE_FINAL_CALL_TITLE = "Vos clients ont déjà quelque chose à dire.";

type FinalCallProps = {
  title: string;
  text: string;
  tone?: SectionTone;
  /** The home's own: centred, its title at the top of the scale of the pages (60). */
  isHome?: boolean;
};

/** The end of a page (maquettes 3.5): a large title, one sentence, « Créer mon espace gratuit » and its mention. */
export const FinalCall = ({ title, text, tone = "white", isHome = false }: FinalCallProps) => (
  <MarketingSection id={isHome ? "appel-final" : undefined} labelledBy="final-call" tone={tone}>
    <div className={cn("flex flex-col gap-4 desktop:gap-6", isHome && "desktop:items-center desktop:text-center")}>
      <h2
        id="final-call"
        className={cn(
          isHome ? SITE_LARGE_PAGE_TITLE_CLASSES : SITE_PAGE_TITLE_CLASSES,
          "max-w-[760px]",
          isHome && "desktop:max-w-[1080px]",
        )}
      >
        {title}
      </h2>
      <p className="text-lead">{text}</p>
      <CallToAction place="appel-final" isCentered={isHome} className="mt-2 desktop:mt-[0]" />
    </div>
  </MarketingSection>
);
