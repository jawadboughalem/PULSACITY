import { ComingLinesSection } from '@/components/sections/coming-lines';
import { RenderSections } from '@/components/sections/render-section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { comingLines, liveLines } from '@/lib/lines';
import { hasDeliveredSite } from '@/lib/showcase-content';
import { lastTone } from '@/lib/surface-score';

/**
 * The home page is the live lines rendered one after another, then the lines
 * still in preparation. It knows no offer of its own.
 *
 * The sections of every live line are planned as one document, so the surface
 * rule holds across the seam between two lines just as it does inside one.
 */
export default function HomePage() {
  const sections = liveLines().flatMap((line) => line.sections);
  const hasCards = hasDeliveredSite();

  return (
    <>
      <SiteHeader />
      <main>
        <RenderSections sections={sections} />
        <ComingLinesSection
          lines={comingLines()}
          divided={lastTone(sections, { hasCards }) === 'ground'}
        />
      </main>
      <SiteFooter />
    </>
  );
}
