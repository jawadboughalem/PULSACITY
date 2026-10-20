import type { ReactNode } from "react";
import { RatingStars } from "@/components/testimonials/RatingStars";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { quoteInFrench } from "@/lib/french/typography";
import { JULIE_ACCENT } from "./julie-page";

/** Time 1: the tool tells PULSACITY of the sale, like a notification on the creator's phone. */
const SaleNotification = () => (
  <div className="flex w-full gap-3 rounded-card bg-white p-4 shadow-float">
    <span className="flex size-[36px] shrink-0 items-center justify-center rounded-field bg-ink text-white">
      <Icon name="bag" size={20} />
    </span>
    <span className="flex min-w-[0] flex-1 flex-col text-small">
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-bold">Systeme.io</span>
        <span className="text-gray">maintenant</span>
      </span>
      <span className="font-bold">Nouvelle vente :</span>
      <span>Programme 30 jours — Camille</span>
    </span>
  </div>
);

/** Time 2: the e-mail in short, in the system font of every e-mail (charte v2, E-mails), its button in Julie's green. */
const RequestEmail = () => (
  <div className="flex w-full flex-col gap-2 rounded-card bg-white p-4 font-[Helvetica,Arial,sans-serif]">
    <span className="text-legal text-gray">Julie Nutrition via PULSACITY</span>
    <span className="text-small font-bold">Camille, votre avis sur Programme 30 jours ?</span>
    <span className="text-legal">
      Bonjour Camille, merci d&apos;avoir suivi le programme. Une note et quelques mots suffisent.
    </span>
    <span
      style={{ backgroundColor: JULIE_ACCENT }}
      className="mt-1 inline-flex h-[36px] items-center self-start rounded-full px-4 text-legal font-bold whitespace-nowrap text-white"
    >
      Donner mon avis
    </span>
  </div>
);

/** Time 3: what Camille sent from the collection page. */
const ReviewCard = () => (
  <div className="flex w-full flex-col gap-3 rounded-card bg-white p-4">
    <RatingStars rating={5} size={20} />
    <p className="text-small">
      {quoteInFrench("En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser.")}
    </p>
    <span className="text-legal text-gray">Camille R., Enseignante</span>
  </div>
);

/** A wall seen from afar: its cards drawn smaller than the text of the page, as on maquettes 3.5 (11/14). */
const MiniCard = ({ quote, name, isNew = false }: { quote: string; name: string; isNew?: boolean }) => (
  <div
    className={cn(
      "flex flex-col gap-1 rounded-field bg-white p-2 text-[11px] leading-[14px]",
      isNew && "outline-2 -outline-offset-2 outline-sun",
    )}
  >
    {isNew ? <RatingStars rating={5} size={16} /> : null}
    <p>{quoteInFrench(quote)}</p>
    <span className="font-bold">{name}</span>
  </div>
);

/** Time 4: validated, Camille's review joins the others on the wall, edged with Soleil. */
const MiniWall = () => (
  <div className="grid w-full grid-cols-2 items-start gap-2">
    <div className="flex flex-col gap-2">
      <MiniCard quote="J'ai arrêté de grignoter le soir." name="Camille R." isNew />
      <MiniCard quote="Toute la famille mange mieux." name="Sophie D." />
    </div>
    <div className="flex flex-col gap-2">
      <MiniCard quote="Les recettes sont rapides et le groupe motive vraiment." name="Thomas L." />
      <MiniCard quote="Enfin des conseils adaptés aux horaires décalés." name="Nadia B." />
    </div>
  </div>
);

type DemoStep = {
  title: string;
  text: string;
  illustration: ReactNode;
};

/** positionnement.md, section 4: the four times of a real sequence, numbered. */
const DEMO_STEPS: DemoStep[] = [
  {
    title: "La vente",
    text: "Un client achète votre formation ou réserve une séance. PULSACITY le reçoit depuis l'outil où vous encaissez.",
    illustration: <SaleNotification />,
  },
  {
    title: "L'e-⁠mail",
    text: "Quatorze jours plus tard, ou au délai choisi pour cette offre, il reçoit un e-⁠mail à votre nom. Une relance au plus.",
    illustration: <RequestEmail />,
  },
  {
    title: "L'avis",
    text: "Il note, écrit quelques mots et ajoute une photo s'il le veut, depuis son téléphone. Il accepte la publication d'un clic.",
    illustration: <ReviewCard />,
  },
  {
    title: "Le mur",
    text: "Vous validez. Son témoignage s'affiche sur votre page de vente.",
    illustration: <MiniWall />,
  },
];

/**
 * Maquettes 3.5, Accueil, section 4: a sale of Julie Nutrition becomes a testimonial on her wall, in four numbered
 * times (charte v2, Étapes numérotées), the drawings of v1 redrawn on Nuage. Side by side on a computer, one below the
 * other on a phone. Still: the charter allows no appearing animation.
 */
export const SaleToWallDemo = () => (
  <ol aria-label="De la vente au témoignage, en quatre temps" className="grid gap-8 desktop:grid-cols-4 desktop:grid-rows-[auto_auto_auto] desktop:gap-x-6 desktop:gap-y-[0]">
    {DEMO_STEPS.map((step, index) => (
      <li key={step.title} className="flex flex-col gap-4 desktop:row-span-3 desktop:grid desktop:grid-rows-subgrid">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-sun font-display text-[18px] leading-[1]"
          >
            {index + 1}
          </span>
          <h3 className="font-display text-h3">{step.title}</h3>
        </div>
        {/* On a computer, the frames of the four times share one row: as high as the wall, the highest. */}
        <div aria-hidden="true" className="flex items-center rounded-panel bg-cloud p-4 desktop:min-h-[216px]">
          {step.illustration}
        </div>
        <p className="text-[16px] leading-[24px]">{step.text}</p>
      </li>
    ))}
  </ol>
);
