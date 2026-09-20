import { ImageResponse } from 'next/og';

import { liveLines } from '@/lib/lines';
import { loadSite } from '@/lib/site-content';

export const alt = 'PULSACITY';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/*
 * This image is rendered by a runtime with no stylesheet, so it cannot read
 * packages/design/src/tokens.css. The three constants below mirror it instead,
 * and packages/design/src/tokens.test.ts fails if one of them stops matching the
 * token named beside it.
 */
const GROUND = '#fbfaf7'; // --color-ground
const INK = '#171310'; // --color-ink
const ACCENT = '#d33e25'; // --color-accent

/** Generated at build time from the content, so it cannot drift from the page. */
export default function OpengraphImage() {
  const site = loadSite();
  const sections = liveLines()[0]?.sections;
  const hero = sections?.find((section) => section.type === 'hero');
  const pricing = sections?.find((section) => section.type === 'pricing');

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: GROUND,
        padding: '80px',
      }}
    >
      <div style={{ display: 'flex', fontSize: 30, letterSpacing: 8, color: INK }}>
        {site.brand}
        <span style={{ color: ACCENT }}>.</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{ display: 'flex', fontSize: 82, lineHeight: 1.05, color: INK, letterSpacing: -2 }}
        >
          {hero?.title ?? site.brand}
        </div>
        {/* The price belongs to the line's content; with no pricing section, the line is simply absent. */}
        {pricing ? (
          <div style={{ display: 'flex', marginTop: 28, fontSize: 34, color: ACCENT }}>
            {pricing.headline}
          </div>
        ) : null}
      </div>
      <div style={{ display: 'flex', height: 12, width: 200, background: ACCENT }} />
    </div>,
    size,
  );
}
