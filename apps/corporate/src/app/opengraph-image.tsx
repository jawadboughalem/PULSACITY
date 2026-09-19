import { ImageResponse } from 'next/og';

export const alt = 'Le site de votre entreprise, déjà prêt. 500 € HT tout compris.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Generated at build time — no image file to keep in sync. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#ffffff',
        padding: '80px',
      }}
    >
      <div style={{ display: 'flex', fontSize: 30, letterSpacing: 8, color: '#525252' }}>
        PULSACITY
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 76,
            lineHeight: 1.1,
            color: '#171717',
            letterSpacing: -2,
          }}
        >
          Le site de votre entreprise, déjà prêt.
        </div>
        <div style={{ display: 'flex', marginTop: 28, fontSize: 40, color: '#2a4a9c' }}>
          500 € HT tout compris.
        </div>
      </div>
      <div style={{ display: 'flex', height: 12, background: '#2a4a9c', width: 200 }} />
    </div>,
    size,
  );
}
