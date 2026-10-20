import localFont from "next/font/local";

/** Charte v2: titles, key figures and prices in Bricolage Grotesque 800, its optical size following the text. */
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque-800-latin.woff2",
  weight: "800",
  style: "normal",
  fallback: ["Arial Black", "system-ui", "sans-serif"],
  variable: "--font-bricolage",
});

/** Charte v2: the interface and the text in Figtree 400, 600 and 700 (one variable file). */
const figtree = localFont({
  src: "./fonts/figtree-latin.woff2",
  weight: "300 900",
  style: "normal",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  variable: "--font-figtree",
});

/** On <html>: the two families, for the root layout and for the error of the root layout, which replaces it. */
export const FONT_VARIABLES = `${bricolage.variable} ${figtree.variable}`;
