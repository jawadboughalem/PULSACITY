import Link from "next/link";
import { MARKETING_PATHS } from "./marketing-paths";
import { MarketingSection } from "./MarketingSection";
import { LARGE_BUTTON_CLASSES } from "./marketing-styles";

type FinalCallProps = {
  title: string;
  text: string;
};

/** The end of a page of m7: a large title, one sentence, « Créer mon espace gratuit ». */
export const FinalCall = ({ title, text }: FinalCallProps) => (
  <MarketingSection labelledBy="final-call">
    <h2 id="final-call" className="max-w-[760px] font-display text-display font-semibold ">
      {title}
    </h2>
    <p className="mt-8 text-body text-gray">{text}</p>
    <Link href={MARKETING_PATHS.signUp} className={`${LARGE_BUTTON_CLASSES} mt-8 desktop:mb-14`}>
      Créer mon espace gratuit
    </Link>
  </MarketingSection>
);
