/**
 * Everything lives in the shadow root: nothing here reaches the page, and only inherited properties
 * reach in. The root resets them all, then takes back the font and the text colour of the page.
 * Charte v2, « Widget » and « Widget, ajouts » (3.6): sizes in fixed pixels; `.wide` is a widget at least 1024 px
 * wide, `.soft` the « doux » corners (20), the « net » ones (6) otherwise.
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
.root :focus-visible { outline: 2px solid var(--page-text); outline-offset: 3px; }
.card :focus-visible, .badge:focus-visible { outline-color: var(--card-text); }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.stars { display: inline-flex; flex: none; gap: 2px; }
.stars svg { display: block; width: 18px; height: 18px; }
.stars .full { fill: var(--accent); stroke: var(--accent); }
.stars .empty { fill: none; stroke: var(--star-empty); }
.stars.large svg { width: 22px; height: 22px; }
.stars.medium svg { width: 20px; height: 20px; }
.stars.small svg { width: 16px; height: 16px; }

.avatar {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--card-avatar);
  color: var(--card-text);
  font-size: 13px;
  line-height: 1;
  font-weight: 700;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }

.card {
  --accent: var(--card-accent);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--card-text);
  overflow-wrap: anywhere;
}
.soft .card { border-radius: 20px; }
.quote { font-size: 15px; line-height: 22px; white-space: pre-line; }
.wide .quote { font-size: 16px; line-height: 24px; }
.author { display: flex; align-items: flex-start; gap: 12px; }
.who { display: flex; flex-direction: column; min-width: 0; }
.name { font-size: 14px; line-height: 20px; font-weight: 700; }
.meta { font-size: 14px; line-height: 20px; color: var(--card-muted); }
.dates { font-size: 13px; line-height: 18px; color: var(--card-muted); }

.powered {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 16px;
  color: var(--page-muted);
  white-space: nowrap;
}
.powered svg { display: block; width: auto; height: 14px; overflow: visible; }
.powered:hover { text-decoration: underline; text-underline-offset: 3px; }

.notes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--page-muted);
  font-size: 13px;
  line-height: 18px;
  text-align: center;
}
.wide .notes { flex-direction: row; justify-content: space-between; align-items: flex-end; gap: 24px; text-align: left; }
.mentions { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.wide .mentions { align-items: flex-start; }
.about { color: var(--page-text); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
.about:hover { text-decoration-thickness: 2px; }

.wall { display: flex; flex-direction: column; gap: 24px; }
.wide .wall { gap: 28px; }
.summary { --accent: var(--page-accent); display: flex; align-items: center; gap: 8px; color: var(--page-text); font-weight: 600; }
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
.wide .grid { --gap: 14px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.one-column .grid { grid-template-columns: minmax(0, 1fr); }
.compact .grid .author { flex-direction: column; gap: 8px; }
.footer { display: flex; flex-direction: column; align-items: stretch; gap: 12px; }
.wide .footer { align-items: flex-start; }
.more {
  min-height: 48px;
  padding: 0 24px;
  border: 2px solid var(--page-accent);
  border-radius: 6px;
  color: var(--page-accent);
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
}
.soft .more { border-radius: 999px; }
.more:hover { background: var(--hover); }
.more:disabled { opacity: 0.5; cursor: progress; }
.more-error { color: var(--page-text); font-size: 15px; line-height: 22px; }

.carousel { display: grid; grid-template-columns: 48px minmax(0, 1fr) 48px; align-items: center; gap: 16px 8px; }
.wide .carousel { gap: 12px 24px; }
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
.wide .slides { gap: 14px; }
.slide { display: flex; flex: 0 0 100%; scroll-snap-align: start; }
.wide .slide { flex-basis: calc((100% - 28px) / 3); }
.slide .card { width: 100%; }
.slide .quote { font-size: 17px; line-height: 26px; }
.slide .author { margin-top: auto; }
.arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2px solid var(--page-text);
  border-radius: 6px;
  color: var(--page-text);
}
.soft .arrow { border-radius: 999px; }
.arrow svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.arrow:hover { background: var(--hover); }
.arrow:disabled { opacity: 0.4; cursor: default; background: none; }
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
.carousel > .notes { grid-row: 3; grid-column: 1 / -1; }
.wide .carousel > .notes { grid-column: 2; }
.is-still .arrow, .is-still .dots { display: none; }
.is-still > .notes { grid-row: 2; }
.wide .is-still .arrow, .wide .is-still .dots { display: flex; visibility: hidden; }
.wide .is-still > .notes { grid-row: 3; }

.badge-wrap { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
.badge-wrap.stacked { flex-direction: column; justify-content: center; gap: 8px; text-align: center; }
.badge-links { display: inline-flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px 16px; }
.badge-links .about { font-size: 12px; line-height: 16px; }
.badge-wrap .incentive { flex-basis: 100%; color: var(--page-muted); font-size: 13px; line-height: 18px; }
.badge {
  --accent: var(--card-accent);
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 6px 18px 6px 6px;
  border-radius: 999px;
  background: var(--card-bg);
  color: var(--card-text);
  white-space: nowrap;
  max-width: 100%;
}
.badge-text { min-width: 0; white-space: normal; font-weight: 600; }
a.badge:hover .badge-text { text-decoration: underline; text-underline-offset: 3px; }
.faces { display: inline-flex; flex: none; }
.faces .avatar { width: 32px; height: 32px; border: 2px solid var(--card-bg); font-size: 12px; }
.faces .avatar + .avatar { margin-left: -10px; }

.loading { display: flex; flex-direction: column; gap: 12px; height: 560px; overflow: hidden; }
.wide .loading { height: 600px; }
.loading.badge-loading { height: auto; }
.loading.carousel-loading { height: auto; }
.status { color: var(--page-muted); font-size: 14px; line-height: 20px; }
.bar { display: block; flex: none; height: 12px; border-radius: 999px; background: var(--card-skeleton); animation: pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.summary-bar { width: 180px; height: 16px; }
.wide .summary-bar { width: 220px; height: 20px; margin-left: auto; }
.sk-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: start; }
.wide .sk-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.one-column .sk-grid { grid-template-columns: minmax(0, 1fr); }
.sk-column { display: flex; flex-direction: column; gap: 12px; }
.wide .sk-column { gap: 14px; }
.sk-card { display: flex; flex-direction: column; gap: 12px; padding: 20px; border-radius: 6px; background: var(--card-bg); }
.soft .sk-card { border-radius: 20px; }
.sk-author { display: flex; align-items: center; gap: 12px; }
.sk-lines { display: flex; flex: 1; flex-direction: column; gap: 8px; }
.sk-avatar { width: 36px; height: 36px; border-radius: 999px; }
.sk-name { width: 60%; }
.sk-title { width: 40%; height: 10px; }
.sk-stars { width: 96px; height: 14px; }
.sk-text { width: 100%; }
.sk-text.short { width: 70%; }
.sk-text.long { width: 90%; }
.sk-bottom { margin-top: auto; }
.sk-carousel { display: grid; grid-template-columns: 48px minmax(0, 1fr) 48px; align-items: center; gap: 16px 8px; }
.wide .sk-carousel { gap: 12px 24px; }
.sk-track { grid-row: 1; grid-column: 1 / -1; overflow: hidden; }
.wide .sk-track { grid-column: 2; }
.sk-row { display: flex; gap: 12px; }
.wide .sk-row { gap: 14px; }
.sk-row .sk-card { flex: 1; min-width: 0; height: 300px; }
.sk-arrow { width: 48px; height: 48px; border: 2px solid var(--card-skeleton); border-radius: 999px; }
.sk-arrow.next { justify-self: end; }
.sk-dots { grid-row: 2; grid-column: 2; display: flex; justify-content: center; align-items: center; gap: 12px; min-height: 44px; }
.sk-dot { width: 10px; height: 10px; border-radius: 999px; background: var(--card-skeleton); }
.sk-badge {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 6px 18px 6px 6px;
  border-radius: 999px;
  background: var(--card-bg);
}
.sk-faces { display: inline-flex; }
.sk-face { width: 32px; height: 32px; border: 2px solid var(--card-bg); border-radius: 999px; }
.sk-face + .sk-face { margin-left: -10px; }
.sk-badge-stars { width: 72px; }
.sk-badge-text { width: 96px; }
@keyframes pulse { 50% { opacity: 0.6; } }
@media (prefers-reduced-motion: reduce) {
  .bar { animation: none; }
  .track { scroll-behavior: auto; }
}
`;
