import { join } from 'node:path';

import showcaseJson from '../../../content/showcase.json';
import type { Section } from '@/lib/lines';
import { firstMobileShot, parseShowcase, toCards } from '@/lib/showcase';

import { CtaSection } from './cta';
import { FaqSection } from './faq';
import { FeaturesSection } from './features';
import { HeroSection } from './hero';
import { PricingSection } from './pricing';
import { ShowcaseSection } from './showcase';
import { StepsSection } from './steps';

/**
 * Renders a line's sections. The page knows section *types*, never offers:
 * what is being sold lives entirely in `content/lines/`.
 */
export function RenderSections({ sections }: { sections: Section[] }) {
  const phoneShot = firstMobileShot(
    toCards(parseShowcase(showcaseJson), join(process.cwd(), 'public')),
  );

  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.type}-${index}`;
        switch (section.type) {
          case 'hero':
            return <HeroSection key={key} section={section} />;
          case 'features':
            return <FeaturesSection key={key} section={section} />;
          case 'showcase':
            return <ShowcaseSection key={key} section={section} />;
          case 'steps':
            return <StepsSection key={key} section={section} phoneShot={phoneShot} />;
          case 'pricing':
            return <PricingSection key={key} section={section} />;
          case 'faq':
            return <FaqSection key={key} section={section} />;
          case 'cta':
            return <CtaSection key={key} section={section} />;
        }
      })}
    </>
  );
}
