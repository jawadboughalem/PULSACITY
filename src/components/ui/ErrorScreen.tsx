import type { ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./icon-paths";
import { SiteHeader } from "./SiteHeader";

type ErrorScreenProps = {
  icon: IconName;
  title: string;
  text: string;
  /** The main action: « Revenir à l'accueil », « Réessayer ». */
  action: ReactNode;
  /** The discreet link beside it: « Écrire à l'équipe », « Revenir à l'accueil ». */
  link: ReactNode;
};

/**
 * Maquettes 3.5, Introuvable et erreur (m14): the header reduced to the logo, no menu and no footer; on Nuage, a white
 * plate of 720 with its pictogram in a Ciel circle, its title, a sentence that says what to do, a main action and a link.
 * On a phone, the action takes the whole width and the link is centred under it.
 */
export const ErrorScreen = ({ icon, title, text, action, link }: ErrorScreenProps) => (
  <div className="flex min-h-dvh flex-col bg-cloud">
    <SiteHeader />
    <main className="flex-1 px-page-gutter pt-8 pb-14 desktop:pt-14">
      <div className="mx-auto flex max-w-[720px] flex-col gap-5 rounded-panel bg-white px-5 py-7 desktop:p-14">
        <span className="flex size-[72px] items-center justify-center rounded-full bg-sky">
          <Icon name={icon} size={32} />
        </span>
        <h1 className="font-display text-h1">{title}</h1>
        <p className="text-lead">{text}</p>
        <div className="flex flex-col gap-3 *:last:self-center desktop:flex-row desktop:items-center desktop:gap-5 desktop:*:last:self-auto">
          {action}
          {link}
        </div>
      </div>
    </main>
  </div>
);
