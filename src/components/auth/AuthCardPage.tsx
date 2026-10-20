import type { ReactNode } from "react";
import { SiteHeader } from "@/components/ui/SiteHeader";

/**
 * Maquettes 3.4, Inscription, Connexion and Démarrage: on a computer, a white card on Nuage under the header; on a
 * phone, the page itself, white.
 */
export const AuthCardPage = ({
  children,
  cardWidthClassName = "desktop:max-w-[640px]",
  headerAction,
}: {
  children: ReactNode;
  /** 640 for signing in, 720 for the first steps of the space. */
  cardWidthClassName?: string;
  headerAction?: ReactNode;
}) => (
  <>
    <SiteHeader action={headerAction} />
    <main className="min-h-[calc(100dvh-64px)] bg-white px-page-gutter py-8 desktop:min-h-[calc(100dvh-88px)] desktop:bg-cloud desktop:py-12">
      <div
        className={`mx-auto flex w-full max-w-text flex-col gap-8 desktop:rounded-panel desktop:bg-white desktop:p-11 ${cardWidthClassName}`}
      >
        {children}
      </div>
    </main>
  </>
);
