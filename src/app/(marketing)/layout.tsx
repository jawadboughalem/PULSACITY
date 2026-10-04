import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";

const MAIN_ID = "contenu";

/** The public site: home, prices, connectors, guides and legal texts share their header and footer. */
const MarketingLayout = ({ children }: LayoutProps<"/">) => (
  <div className="flex min-h-dvh flex-col">
    <a
      href={`#${MAIN_ID}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-30 focus:bg-white focus:px-4 focus:py-3 focus:text-body focus:font-semibold focus:outline-2 focus:outline-ink-900"
    >
      Aller au contenu
    </a>
    <MarketingHeader />
    <main id={MAIN_ID} className="flex-1">
      {children}
    </main>
    <MarketingFooter />
  </div>
);

export default MarketingLayout;
