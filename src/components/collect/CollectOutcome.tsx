import type { ReactNode } from "react";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icon-paths";
import { cn } from "@/lib/cn";
import { COLLECT_TITLE_CLASSES } from "./CollectShell";

type CollectOutcomeProps = {
  icon: IconName;
  title: string;
  /** Each line a paragraph; the second of a pair is often Gris, what to know rather than what happened. */
  lines: Array<{ text: string; isSecondary?: boolean }>;
  action?: ReactNode;
};

/**
 * Maquettes 3.6, « Lien plus actif », « Désinscription », « Réponse à une correction »: the icon 32 in a round of 64 on
 * the collect page's neutral, the title, the texts, then a link; 16 between each.
 */
export const CollectOutcome = ({ icon, title, lines, action }: CollectOutcomeProps) => (
  <div className="flex flex-col gap-4">
    <span className="flex size-[64px] items-center justify-center rounded-full bg-widget-light-card">
      <Icon name={icon} size={32} />
    </span>
    <h1 className={COLLECT_TITLE_CLASSES}>{title}</h1>
    {lines.map((line) => (
      <p key={line.text} className={cn("text-body", line.isSecondary && "text-gray")}>
        {line.text}
      </p>
    ))}
    {action}
  </div>
);

/** « Écrire à Julie Nutrition »: a link, not a filled button (the only one of the collect page is « Envoyer mon avis »). */
export const WriteToCreatorLink = ({ spaceName, replyToEmail }: { spaceName: string; replyToEmail: string }) => (
  <a href={`mailto:${replyToEmail}`} className={cn(DISCREET_BUTTON_CLASSES, "-ml-[10px] self-start")}>
    <Icon name="email" size={20} />
    {`Écrire à ${spaceName}`}
  </a>
);
