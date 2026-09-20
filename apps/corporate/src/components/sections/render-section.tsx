import type { Section } from '@/lib/lines';
import { firstMobileShot } from '@/lib/showcase';
import { loadCards } from '@/lib/showcase-content';
import { planSections } from '@/lib/surface-score';

import { CtaSection } from './cta';
import { FaqSection } from './faq';
import { FeaturesSection } from './features';
import { HeroSection } from './hero';
import { PricingSection } from './pricing';
import { SectionBand } from './section-band';
import { ShowcaseSection } from './showcase';
import { StepsSection } from './steps';

/**
 * Renders a line's sections. The page knows section *types*, never offers:
 * what is being sold lives entirely in `content/lines/`.
 *
 * Which surface each band sits on, where a hairline falls, how wide its column
 * is and which anchor it answers to are all derived by `planSections` from the
 * charter's rule — never listed here.
 */
export function RenderSections({ sections }: { sections: Section[] }) {
  const cards = loadCards();
  const phoneShot = firstMobileShot(cards);

  return (
    <>
      {planSections(sections, { hasCards: cards.length > 0 }).map(
        ({ section, tone, divided, anchor, width }, index) => (
          <SectionBand
            key={`${section.type}-${index}`}
            tone={tone}
            divided={divided}
            id={anchor}
            width={width}
          >
            {section.type === 'hero' ? <HeroSection section={section} /> : null}
            {section.type === 'features' ? <FeaturesSection section={section} /> : null}
            {section.type === 'showcase' ? (
              <ShowcaseSection section={section} cards={cards} />
            ) : null}
            {section.type === 'steps' ? (
              <StepsSection section={section} phoneShot={phoneShot} />
            ) : null}
            {section.type === 'pricing' ? <PricingSection section={section} /> : null}
            {section.type === 'faq' ? <FaqSection section={section} /> : null}
            {section.type === 'cta' ? <CtaSection section={section} /> : null}
          </SectionBand>
        ),
      )}
    </>
  );
}
