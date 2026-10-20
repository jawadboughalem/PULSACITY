import Link from "next/link";
import { MeanwhileLine } from "@/components/connectors/MeanwhileLine";
import { INLINE_LINK_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icon-paths";
import { FEATURED_INTEGRATIONS, INTEGRATIONS, INTEGRATION_FAMILIES } from "@/content/integrations";
import { cn } from "@/lib/cn";
import { ToolPill } from "../integrations/ToolPill";
import { MARKETING_PATHS } from "../marketing-paths";
import { TEXT_LINK_CLASSES } from "../marketing-styles";

/** Maquettes 3.5, Accueil, section 2: « Fonctionne avec l'outil où vous encaissez », on Ciel. */
export const ToolsBandContent = () => (
  <div className="flex flex-col gap-4 desktop:gap-6">
    <p className="max-w-[720px] text-body">
      Disponible avec Systeme.io et le connecteur universel. Stripe, Calendly, Learnybox, Kajabi et d&apos;autres arrivent
      bientôt. Et tous vos autres outils, avec Zapier, Make ou n8n.
    </p>
    <ul className="flex flex-col items-start gap-3 desktop:flex-row desktop:flex-wrap">
      {FEATURED_INTEGRATIONS.map((integration) => (
        <li key={integration.slug} className="max-w-full">
          <ToolPill integration={integration} surface="white" />
        </li>
      ))}
    </ul>
    <Link href={MARKETING_PATHS.integrations} className={cn(TEXT_LINK_CLASSES, "-ml-[10px] self-start")}>
      Voir toutes les intégrations
    </Link>
  </div>
);

/**
 * Maquettes 3.5, Accueil, section 3: the one figure of the home page, with its source (positionnement.md): Ifop for
 * Guest Suite, January 2026, 1 003 people of 18 and over, published on Guest Suite's site.
 */
export const SurveyFigure = () => (
  <figure className="flex flex-col gap-4 rounded-panel bg-white p-6 desktop:p-10">
    <p className="font-display text-[80px] leading-[80px] tracking-[-0.04em] desktop:text-[120px] desktop:leading-[120px]">
      93 %
    </p>
    <p className="text-lead">des Français consultent des avis avant d&apos;acheter ou de choisir un prestataire.</p>
    <figcaption className="text-small text-gray">
      {"Source : "}
      <a
        href="https://www.guest-suite.com/blog/statistiques-avis-clients"
        rel="noopener"
        className={cn(INLINE_LINK_CLASSES, "font-bold")}
      >
        Ifop pour Guest Suite, janvier 2026
      </a>
    </figcaption>
  </figure>
);

const MOMENTS: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: "monitor",
    title: "Une formation en ligne",
    text: "Après l'achat ou l'inscription, le temps que l'élève avance.",
  },
  { icon: "clock", title: "Une séance", text: "Après la séance, jamais avant." },
  { icon: "user", title: "Un accompagnement", text: "Vers sa fin, en réglant le délai sur sa durée." },
];

/** Maquettes 3.5, Accueil, section 6: when the request leaves, offer by offer. */
export const RightMoments = () => (
  <ul className="grid gap-4 desktop:grid-cols-3">
    {MOMENTS.map((moment) => (
      <li key={moment.title} className="flex flex-col gap-3 rounded-panel bg-cloud p-6">
        <span className="flex size-[48px] items-center justify-center rounded-full bg-white">
          <Icon name={moment.icon} size={24} />
        </span>
        <h3 className="font-display text-h3">{moment.title}</h3>
        <p className="text-body">{moment.text}</p>
      </li>
    ))}
  </ul>
);

/** Maquettes 3.5, Accueil, section 7: the catalog of connecteurs.md, one white card per family, its tools in pills. */
export const HomeCatalog = () => (
  <div className="flex flex-col gap-3">
    {INTEGRATION_FAMILIES.map((family) => {
      const tools = INTEGRATIONS.filter((integration) => integration.family === family.id);
      const firstUpcoming = tools.find((integration) => integration.status === "soon");
      return (
        <section
          key={family.id}
          aria-labelledby={`home-family-${family.id}`}
          className="grid grid-cols-[minmax(0,1fr)] gap-4 rounded-panel bg-white p-5 desktop:grid-cols-[320px_minmax(0,1fr)] desktop:gap-10 desktop:p-8"
        >
          <div className="flex flex-col gap-2">
            <h3 id={`home-family-${family.id}`} className="font-display text-h3">
              {family.title}
            </h3>
            <p className="text-small text-gray">{family.text}</p>
          </div>
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col items-start gap-3 desktop:flex-row desktop:flex-wrap">
              {tools.map((integration) => (
                <li key={integration.slug} className="max-w-full">
                  <ToolPill integration={integration} surface="cloud" />
                </li>
              ))}
            </ul>
            {firstUpcoming?.status === "soon" ? <MeanwhileLine integration={firstUpcoming} /> : null}
          </div>
        </section>
      );
    })}
  </div>
);

/** The two ways out of the home's catalog: every tool, or a tool to ask for. */
export const HomeCatalogLinks = () => (
  <div className="flex flex-col items-stretch gap-4 desktop:flex-row desktop:items-center desktop:gap-6">
    <Link href={MARKETING_PATHS.integrations} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
      Voir toutes les intégrations
    </Link>
    <Link href={`${MARKETING_PATHS.integrations}#dites-nous`} className={cn(TEXT_LINK_CLASSES, "self-center text-small desktop:self-auto")}>
      Votre outil n&apos;y est pas ? Dites-nous lequel.
    </Link>
  </div>
);

/**
 * Maquettes 3.5, Accueil, section 8 (positionnement.md): what is true of every review, today. « Chaque témoignage
 * porte sa date, et celle de l'achat » is true since lot 4.13. Never « avis vérifiés ».
 */
const PROOFS = [
  "Chaque demande d'avis part d'une vraie vente, reçue de votre outil.",
  "Chaque témoignage porte sa date, et celle de l'achat.",
  "Votre client accepte la publication d'un clic. Son accord est daté et gardé.",
  "Deux e-⁠mails au plus par client et par offre, avec un lien de désinscription dans chacun.",
  "Vos données sont hébergées dans l'Union européenne. Vous les exportez ou les supprimez quand vous voulez.",
];

export const ProofList = () => (
  <div className="flex flex-col items-start gap-6">
    <ul className="flex max-w-[720px] flex-col gap-4">
      {PROOFS.map((proof) => (
        <li key={proof} className="flex items-start gap-3 text-body">
          <span className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-success-surface text-success">
            <Icon name="check" size={16} />
          </span>
          <span className="pt-[3px]">{proof}</span>
        </li>
      ))}
    </ul>
    <Link href={MARKETING_PATHS.aboutReviews} className={cn(TEXT_LINK_CLASSES, "-ml-[10px] text-small")}>
      À propos de ces avis
    </Link>
  </div>
);
