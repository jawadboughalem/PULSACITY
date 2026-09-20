import { ImageResponse } from 'next/og';

import { liveLines } from '@/lib/lines';
import { loadSite } from '@/lib/site-content';

export const alt = 'PULSACITY';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#2a2522';
const ACCENT = '#e2603c';
const GROUND = '#fbfaf8';

/** Generated at build time from the content, so it cannot drift from the page. */
export default function OpengraphImage() {
  const site = loadSite();
  const hero = liveLines()[0]?.sections.find((section) => section.type === 'hero');

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
        <div style={{ display: 'flex', marginTop: 28, fontSize: 34, color: ACCENT }}>
          500 € HT tout compris.
        </div>
      </div>
      <div style={{ display: 'flex', height: 12, width: 200, background: ACCENT }} />
    </div>,
    size,
  );
}
