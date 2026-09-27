import type { Metadata } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  fallback: ["Georgia", "Times New Roman", "serif"],
  variable: "--font-newsreader",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  title: "PULSACITY",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${newsreader.variable} ${publicSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
