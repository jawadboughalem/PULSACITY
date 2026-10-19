import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SignupSourceCapture } from "@/components/acquisition/SignupSourceCapture";
import { readSiteUrl } from "@/lib/site-url";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(readSiteUrl()),
  title: "PULSACITY",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#16213E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${figtree.variable}`}>
      <body>
        {children}
        <SignupSourceCapture />
      </body>
    </html>
  );
}
