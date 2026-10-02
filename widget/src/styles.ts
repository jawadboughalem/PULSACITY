/** Font face added to the page for the logotype of « Propulsé par PULSACITY », the only font the widget loads. */
export const LOGOTYPE_FAMILY = "Pulsacity Logotype";

/**
 * Everything lives in the shadow root: nothing here reaches the page, and only inherited properties
 * reach in. The root resets them all, then takes back the font and the text colour of the page.
 * Sizes follow the charter in fixed pixels; `.wide` is a widget at least 1024 px wide.
 */
export const WIDGET_CSS = `
:host { display: block !important; }
.root {
  all: initial;
  display: block;
  font-family: inherit;
  font-size: 16px;
  line-height: 24px;
  color: var(--page-text);
  direction: ltr;
  text-align: left;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
.root *, .root *::before, .root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0 solid;
  font: inherit;
  color: inherit;
  letter-spacing: 0;
  text-transform: none;
  text-decoration: none;
  background: none;
}
.root ul { list-style: none; }
.root button { cursor: pointer; -webkit-appearance: none; appearance: none; }
.root img { display: block; max-width: none; }
.root :focus-visible { outline: 2px solid var(--page-text); outline-offset: 2px; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.stars { display: inline-flex; flex: none; gap: 2px; }
.stars svg { display: block; width: 16px; height: 16px; }
.stars .full { fill: var(--accent); stroke: var(--accent); }
.stars .empty { fill: none; stroke: var(--star-empty); }
.stars.large { gap: 0; }
.stars.large svg { width: 20px; height: 20px; }
.stars.small svg { width: 14px; height: 14px; }

.avatar {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--card-avatar);
  color: var(--card-text);
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }

.card {
  --accent: var(--card-accent);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--card-line);
  border-radius: 2px;
  background: var(--card-bg);
  color: var(--card-text);
  overflow-wrap: anywhere;
}
.soft .card { border-radius: 16px; }
.author { display: flex; align-items: center; gap: 12px; }
.who { display: flex; flex-direction: column; min-width: 0; }
.name { font-weight: 600; }
.meta, .date { color: var(--card-muted); }
.quote { white-space: pre-line; }

.powered {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 16px;
  color: var(--page-muted);
  white-space: nowrap;
}
.powered:hover .brand { text-decoration: underline; text-underline-offset: 3px; }
.brand {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--page-text);
  font-family: "${LOGOTYPE_FAMILY}", Georgia, "Times New Roman", serif;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
}
.brand svg { display: block; width: 14px; height: 14px; overflow: visible; }

.wall { display: flex; flex-direction: column; gap: 24px; }
.wide .wall { gap: 32px; }
.summary { --accent: var(--page-accent); display: flex; align-items: center; gap: 12px; font-weight: 600; }
.wide .summary { justify-content: flex-end; }
.grid {
  --gap: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1px;
  column-gap: var(--gap);
  align-items: start;
  margin-bottom: calc(var(--gap) * -1);
}
.wide .grid { --gap: 24px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.wall .avatar { width: 32px; height: 32px; font-size: 12px; }
.wall .name, .wall .quote { font-size: 14px; line-height: 20px; }
.wall .meta, .wall .date { font-size: 12px; line-height: 16px; }
.wide .wall .card { gap: 16px; padding: 24px; }
.wide .wall .avatar { width: 44px; height: 44px; font-size: 16px; }
.wide .wall .name, .wide .wall .quote { font-size: 16px; line-height: 24px; }
.wide .wall .meta, .wide .wall .date { font-size: 14px; line-height: 20px; }
.footer { display: flex; flex-direction: column; align-items: center; gap: 24px; }
.wide .footer { flex-direction: row; justify-content: space-between; }
.wide .footer .powered { margin-left: auto; }
.more {
  width: 100%;
  min-height: 48px;
  padding: 0 24px;
  border: 1px solid var(--page-accent);
  border-radius: 2px;
  color: var(--page-accent);
  font-weight: 600;
}
.wide .more { width: auto; }
.soft .more { border-radius: 999px; }
.more:hover { background: var(--hover); }
.more:disabled { cursor: progress; }
.more-error { color: var(--page-text); font-size: 14px; line-height: 20px; text-align: center; }

.carousel { display: grid; grid-template-columns: 48px minmax(0, 1fr) 48px; align-items: center; gap: 16px 8px; }
.wide .carousel { gap: 24px; }
.track {
  grid-row: 1;
  grid-column: 1 / -1;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}
.track::-webkit-scrollbar { display: none; }
.wide .track { grid-column: 2; }
.slides { display: flex; gap: 12px; }
.wide .slides { gap: 24px; }
.slide { display: flex; flex: 0 0 100%; scroll-snap-align: start; }
.wide .slide { flex-basis: calc((100% - 48px) / 3); }
.slide .card { width: 100%; gap: 16px; padding: 24px; }
.wide .slide .card { gap: 24px; padding: 32px; }
.slide .quote { font-size: 20px; line-height: 28px; }
.slide .author { margin-top: auto; }
.slide .meta { font-size: 14px; line-height: 20px; }
.arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--page-text);
  border-radius: 999px;
  background: var(--control-bg);
  color: var(--page-text);
}
.arrow svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.arrow:disabled { opacity: 0.4; cursor: default; }
.prev { grid-row: 2; grid-column: 1; }
.next { grid-row: 2; grid-column: 3; justify-self: end; }
.wide .prev, .wide .next { grid-row: 1; }
.dots { display: flex; justify-content: center; align-items: center; min-height: 44px; }
.count { color: var(--page-muted); font-size: 14px; line-height: 20px; font-variant-numeric: tabular-nums; }
.dot { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; }
.dot::before { content: ""; width: 10px; height: 10px; border: 2px solid var(--page-muted); border-radius: 999px; }
.dot[aria-current="true"]::before { border-color: var(--page-accent); background: var(--page-accent); }
.carousel-footer { display: contents; }
.carousel-footer .dots { grid-row: 2; grid-column: 2; }
.carousel-footer .powered { grid-row: 3; grid-column: 1 / -1; justify-self: center; }
.wide .carousel-footer {
  display: grid;
  grid-row: 2;
  grid-column: 2;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
}
.wide .carousel-footer .dots { grid-row: 1; grid-column: 2; }
.wide .carousel-footer .powered { grid-row: 1; grid-column: 3; justify-self: end; }
.is-still .arrow, .is-still .dots { display: none; }
.is-still .carousel-footer .powered { grid-row: 2; }
.wide .is-still .arrow, .wide .is-still .dots { display: flex; visibility: hidden; }
.wide .is-still .carousel-footer .powered { grid-row: 1; }

.badge-wrap { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
.badge-wrap.stacked { flex-direction: column; justify-content: center; gap: 8px; }
.badge {
  --accent: var(--card-accent);
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 4px 16px 4px 4px;
  border: 1px solid var(--card-line);
  border-radius: 999px;
  background: var(--card-bg);
  color: var(--card-text);
  font-weight: 600;
  white-space: nowrap;
}
a.badge:hover .badge-text { text-decoration: underline; text-underline-offset: 3px; }
.faces { display: inline-flex; }
.faces .avatar { width: 32px; height: 32px; border: 2px solid var(--card-bg); font-size: 12px; }
.faces .avatar + .avatar { margin-left: -8px; }

.loading { display: flex; flex-direction: column; gap: 16px; height: 560px; overflow: hidden; }
.wide .loading { height: 600px; }
.loading.badge-loading { height: auto; }
.loading.carousel-loading { height: auto; }
.status { color: var(--page-muted); font-size: 14px; line-height: 20px; }
.bar { display: block; flex: none; height: 12px; border-radius: 2px; background: var(--card-skeleton); animation: pulse 1.2s ease-in-out infinite; }
.soft .bar { border-radius: 999px; }
.summary-bar { width: 180px; height: 16px; }
.wide .summary-bar { width: 220px; height: 20px; margin-left: auto; }
.sk-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: start; }
.wide .sk-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.sk-column { display: flex; flex-direction: column; gap: 12px; }
.wide .sk-column { gap: 24px; }
.sk-card { display: flex; flex-direction: column; gap: 16px; padding: 16px; border: 1px solid var(--card-line); border-radius: 2px; background: var(--card-bg); }
.wide .sk-card { padding: 24px; }
.soft .sk-card { border-radius: 16px; }
.sk-author { display: flex; align-items: center; gap: 12px; }
.sk-lines { display: flex; flex: 1; flex-direction: column; gap: 8px; }
.sk-avatar { width: 32px; height: 32px; border-radius: 999px; }
.wide .sk-avatar { width: 44px; height: 44px; }
.sk-name { width: 60%; }
.sk-title { width: 40%; height: 10px; }
.sk-stars { width: 96px; height: 14px; }
.sk-text { width: 100%; }
.sk-text.short { width: 70%; }
.sk-photo { width: 100%; height: 140px; }
.wide .sk-photo { height: 180px; }
.sk-carousel { display: grid; grid-template-columns: 48px minmax(0, 1fr) 48px; align-items: center; gap: 16px 8px; }
.wide .sk-carousel { gap: 24px; }
.sk-track { grid-row: 1; grid-column: 1 / -1; overflow: hidden; }
.wide .sk-track { grid-column: 2; }
.sk-row { display: flex; gap: 12px; }
.wide .sk-row { gap: 24px; }
.sk-row .sk-card { flex: 1; min-width: 0; height: 320px; }
.wide .sk-row .sk-card { height: 344px; }
.sk-slide { padding: 24px; }
.wide .sk-slide { padding: 32px; }
.sk-stars-row { display: flex; gap: 4px; }
.sk-star { width: 16px; height: 16px; border-radius: 999px; }
.sk-text.long { width: 90%; }
.sk-bottom { margin-top: auto; }
.sk-arrow { width: 48px; height: 48px; border: 1px solid var(--card-line); border-radius: 999px; }
.sk-arrow.next { justify-self: end; }
.sk-dots { grid-row: 2; grid-column: 2; display: flex; justify-content: center; align-items: center; gap: 12px; min-height: 44px; }
.sk-dot { width: 10px; height: 10px; border-radius: 999px; background: var(--card-line); }
.sk-badge {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 12px;
  padding: 4px 16px 4px 4px;
  border: 1px solid var(--card-line);
  border-radius: 999px;
  background: var(--card-bg);
}
.sk-faces { display: inline-flex; }
.sk-face { width: 32px; height: 32px; border: 2px solid var(--card-bg); border-radius: 999px; }
.sk-face + .sk-face { margin-left: -8px; }
.sk-badge-stars { width: 72px; }
.sk-badge-text { width: 96px; }
@keyframes pulse { 50% { opacity: 0.6; } }
@media (prefers-reduced-motion: reduce) {
  .bar { animation: none; }
  .track { scroll-behavior: auto; }
}
`;
