import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { STAR_PATH } from "@/components/ui/icon-paths";
import { cn } from "@/lib/cn";

const Stars = ({ size }: { size: number }) => (
  <span className="flex gap-1 text-carmine">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={STAR_PATH} />
      </svg>
    ))}
  </span>
);

/** Time 1: Systeme.io tells PULSACITY of the sale, like a notification on the creator's phone. */
const SaleNotification = () => (
  <div className="flex w-full gap-3 rounded-lg border border-hairline-200 bg-white p-4 shadow-float">
    <span className="flex size-[36px] shrink-0 items-center justify-center bg-ink-900 text-white">
      <Icon name="bag" size={20} />
    </span>
    <span className="flex min-w-[0] flex-1 flex-col">
      <span className="flex items-baseline justify-between gap-2 text-small">
        <span className="font-semibold">Systeme.io</span>
        <span className="text-slate-600">maintenant</span>
      </span>
      <span className="text-body font-semibold">Nouvelle vente :</span>
      <span className="text-body">Programme 30 jours — Camille</span>
    </span>
  </div>
);

/** Time 2: the e-mail of maquette 3, in short, in Georgia like every e-mail. */
const RequestEmail = () => (
  <div className="flex w-full flex-col gap-2 border border-hairline-200 bg-white p-4">
    <span className="text-legal text-slate-600">Julie Nutrition via PULSACITY</span>
    <span className="text-small font-semibold">Camille, votre avis sur le Programme 30 jours ?</span>
    <span className="font-[Georgia,'Times_New_Roman',serif] text-legal">
      Bonjour Camille, merci d&apos;avoir suivi le programme. Une note et quelques mots suffisent.
    </span>
    <span className="mt-1 inline-flex h-[36px] items-center self-start rounded-lg border-2 border-ink-900 bg-carmine px-4 text-legal font-semibold whitespace-nowrap text-white">
      Donner mon avis (1 minute)
    </span>
  </div>
);

/** Time 3: what Camille sent from the collection page. */
const ReviewCard = () => (
  <div className="flex w-full flex-col gap-3 border border-hairline-200 bg-white p-4">
    <Stars size={20} />
    <p className="font-serif text-quote">
      « En 30 jours j&apos;ai arrêté de grignoter le soir. Julie explique sans culpabiliser. »
    </p>
    <span className="text-small text-slate-600">Camille R., Enseignante</span>
  </div>
);

const MiniCard = ({ quote, name, isNew = false }: { quote: string; name: string; isNew?: boolean }) => (
  <div
    className={cn(
      "flex flex-col gap-2 bg-white p-3",
      isNew ? "border-2 border-carmine" : "border border-hairline-200",
    )}
  >
    {isNew ? <Stars size={12} /> : null}
    <p className="font-serif text-legal">{`« ${quote} »`}</p>
    <span className="text-legal font-semibold">{name}</span>
  </div>
);

/** Time 4: validated, Camille's review joins the others on the wall, outlined in carmine. */
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
  label: string;
  caption: string;
  illustration: ReactNode;
  /** The wall fills its frame from the top, and grows on a narrow screen; the others sit in the middle. */
  isTopAligned?: boolean;
};

const DEMO_STEPS: DemoStep[] = [
  {
    label: "Jour 0 · la vente arrive",
    caption: "Systeme.io nous prévient. Vous n'avez rien à faire.",
    illustration: <SaleNotification />,
  },
  {
    label: "Jour 30 · la demande part",
    caption: "Un e-⁠mail au nom de Julie, au moment choisi.",
    illustration: <RequestEmail />,
  },
  {
    label: "2 minutes plus tard · l'avis",
    caption: "5 étoiles et quelques mots, avec son accord.",
    illustration: <ReviewCard />,
  },
  {
    label: "Sur la page · le mur",
    caption: "Validé en un clic, il rejoint les autres.",
    illustration: <MiniWall />,
    isTopAligned: true,
  },
];

/**
 * Maquette 7, « Composant démo »: a sale of Julie Nutrition becomes a testimonial on her wall, in four times. Side by
 * side on a computer, one below the other along a line on a phone. Still: the charter allows no appearing animation.
 */
export const SaleToWallDemo = () => (
  <div className="relative">
    <span aria-hidden="true" className="absolute inset-x-[0] top-[20px] hidden h-px bg-ink-900 desktop:block" />
    <ol
      aria-label="D'une vente à un témoignage, en quatre temps"
      className="relative grid gap-6 desktop:grid-cols-4 desktop:grid-rows-[auto_auto_auto]"
    >
      {DEMO_STEPS.map((step, index) => (
        <li
          key={step.label}
          className="relative grid grid-cols-[40px_1fr] gap-x-3 desktop:row-span-3 desktop:grid-cols-1 desktop:grid-rows-subgrid desktop:gap-y-4"
        >
          {index === DEMO_STEPS.length - 1 ? null : (
            <span aria-hidden="true" className="absolute top-[40px] -bottom-6 left-[20px] w-px bg-ink-900 desktop:hidden" />
          )}
          <div className="contents desktop:flex desktop:items-center desktop:gap-3">
            <span
              aria-hidden="true"
              className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-ink-900 font-serif text-quote text-white"
            >
              {index + 1}
            </span>
            <span className="flex min-h-[40px] items-center text-small font-semibold desktop:bg-white desktop:pr-3">
              {step.label}
            </span>
          </div>
          {/* On a computer, the frames of the four times share one row: as high as the wall, the highest. */}
          <div className="col-start-2 mt-4 flex flex-col gap-4 desktop:contents">
            <div
              aria-hidden="true"
              className={cn(
                "flex min-h-[248px] justify-center bg-paper-100 px-4",
                step.isTopAligned ? "items-start py-4" : "items-center",
              )}
            >
              {step.illustration}
            </div>
            <p className="text-small text-slate-600">{step.caption}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
);
