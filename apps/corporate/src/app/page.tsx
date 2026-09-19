import { Faq } from '@/components/sections/faq';
import { Hero } from '@/components/sections/hero';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Included } from '@/components/sections/included';
import { Pricing } from '@/components/sections/pricing';
import { Showcase } from '@/components/sections/showcase';
import { SiteCheckSection } from '@/components/sections/site-check-section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Included />
        <Showcase />
        <HowItWorks />
        <SiteCheckSection />
        <Pricing />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
