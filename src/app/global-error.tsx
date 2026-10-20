"use client";

import { DisplayError } from "@/components/ui/DisplayError";
import { FONT_VARIABLES } from "./site-fonts";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * The error of the root layout itself (maquettes 3.5: « à créer avec ce modèle »): it replaces the whole document, so
 * it brings its own <html>, in French, its fonts and its styles.
 */
const GlobalError = ({ error, retry }: GlobalErrorProps) => (
  <html lang="fr" className={FONT_VARIABLES}>
    <body>
      <DisplayError error={error} retry={retry} />
    </body>
  </html>
);

export default GlobalError;
