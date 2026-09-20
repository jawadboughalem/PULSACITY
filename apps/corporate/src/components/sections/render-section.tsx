import { join } from 'node:path';

import showcaseJson from '../../../content/showcase.json';
import type { ContainerProps } from '@/components/ui/container';
import type { Section } from '@/lib/lines';
import { firstMobileShot, parseShowcase, toCards } from '@/lib/showcase';
import { scoreSections } from '@/lib/surface-score';

import { CtaSection } from './cta';
import { FaqSection } from './faq';
import { FeaturesSection } from './features';
import { HeroSection } from './hero';
import { PricingSection } from './pricing';
import { SectionBand } from './section-band';
import { ShowcaseSection } from './showcase';
import { StepsSection } from './steps';

/** Anchors the content links to, e.g. « Voir un site livré » → `#realisations`. */
const ANCHOR: Partial<Record<Section['type'], string>> = {
  showcase: 'realisations',
  steps: 'methode',
  faq: 'faq',
};

/** Long-form questions read better in a narrower column. */
const WIDTH: Partial<Record<Section['type'], ContainerProps['width']>> = { faq: 'narrow' };

/**
 * A section that would draw nothing is not part of the score.
 *
 * Otherwise it leaves an empty band — its padding, and a hairline computed
 * against a surface nobody can see.
 */
function renders(section: Section, hasCards: boolean): boolean {
  if (section.type !== 'showcase') return true;
  return hasCards || section.empty !== undefined;
}

/**
 * Renders a line's sections. The page knows section *types*, never offers:
 * what is being sold lives entirely in `content/lines/`.
 *
 * Which surface each band sits on, and where a hairline falls, is derived by
 * `scoreSections` from the charter's rule — not listed here.
 */
export function RenderSections({ sections }: { sections: Section[] }) {
  const cards = toCards(parseShowcase(showcaseJson), join(process.cwd(), 'public'));
  const phoneShot = firstMobileShot(cards);
  const visible = sections.filter((section) => renders(section, cards.length > 0));

  return (
    <>
      {scoreSections(visible).map(({ section, tone, divided }, index) => (
        <SectionBand
          key={`${section.type}-${index}`}
          tone={tone}
          divided={divided}
          id={ANCHOR[section.type]}
          width={WIDTH[section.type]}
        >
          {section.type === 'hero' ? <HeroSection section={section} /> : null}
          {section.type === 'features' ? <FeaturesSection section={section} /> : null}
          {section.type === 'showcase' ? <ShowcaseSection section={section} /> : null}
          {section.type === 'steps' ? (
            <StepsSection section={section} phoneShot={phoneShot} />
          ) : null}
          {section.type === 'pricing' ? <PricingSection section={section} /> : null}
          {section.type === 'faq' ? <FaqSection section={section} /> : null}
          {section.type === 'cta' ? <CtaSection section={section} /> : null}
        </SectionBand>
      ))}
    </>
  );
}
