import { ComingLinesSection } from '@/components/sections/coming-lines';
import { RenderSections } from '@/components/sections/render-section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { comingLines, liveLines } from '@/lib/lines';

/**
 * The home page is the live lines rendered one after another, then the lines still
 * in preparation. It knows no offer of its own.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        {liveLines().map((line) => (
          <RenderSections key={line.slug} sections={line.sections} />
        ))}
        <ComingLinesSection lines={comingLines()} />
      </main>
      <SiteFooter />
    </>
  );
}
