import type { Metadata, Viewport } from "next";
import { SignupSourceCapture } from "@/components/acquisition/SignupSourceCapture";
import { readSiteUrl } from "@/lib/site-url";
import { FONT_VARIABLES } from "./site-fonts";
import "./globals.css";

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
    <html lang="fr" className={FONT_VARIABLES}>
      <body>
        {children}
        <SignupSourceCapture />
      </body>
    </html>
  );
}
