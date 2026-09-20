import { ImageResponse } from 'next/og';

import { MARK, MARK_VIEWBOX } from '@pulsacity/design/logo';
import { HEX } from '@pulsacity/design/tokens';

import { liveLines } from '@/lib/lines';
import { formatEurHt } from '@/lib/pricing';
import { loadSite } from '@/lib/site-content';

export const alt = 'PULSACITY';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const MARK_SIZE = 96;

/** The mark, laid out as boxes: `next/og` renders a subset of CSS, not SVG. */
function Mark() {
  const scale = MARK_SIZE / MARK_VIEWBOX;

  return (
    <div style={{ display: 'flex', position: 'relative', width: MARK_SIZE, height: MARK_SIZE }}>
      {MARK.map((block) => (
        <div
          key={`${block.x}-${block.y}`}
          style={{
            position: 'absolute',
            left: block.x * scale,
            top: block.y * scale,
            width: block.width * scale,
            height: block.height * scale,
            borderRadius: block.radius * scale,
            background: block.role === 'accent' ? HEX.accent : HEX.ink,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Generated at build time from the content, so it cannot drift from the page. The price
 * is read from the line's offer — never written here, and simply absent when the line
 * declares none.
 */
export default function OpengraphImage() {
  const site = loadSite();
  const line = liveLines()[0];
  const hero = line?.sections.find((section) => section.type === 'hero');
  const price = line?.offer ? formatEurHt(line.offer.priceHtCents) : undefined;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: HEX.ground,
        padding: '72px 80px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Mark />
        <div style={{ display: 'flex', fontSize: 30, letterSpacing: 8, color: HEX.ink }}>
          {site.brand}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 76,
            lineHeight: 1.05,
            color: HEX.ink,
            letterSpacing: -2,
          }}
        >
          {hero?.title ?? site.brand}
        </div>
        {price ? (
          <div style={{ display: 'flex', marginTop: 26, fontSize: 34, color: HEX.accentInk }}>
            {price}
          </div>
        ) : null}
      </div>
    </div>,
    size,
  );
}
