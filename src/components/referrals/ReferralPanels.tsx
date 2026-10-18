import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import type { ReferralOverview, ReferralRow } from "@/lib/referrals/read-referral-overview";
import { CopyReferralLinkButton } from "./ReferralLinkCard";

const countWords = (count: number, singular: string, plural: string) => `${count <= 1 ? singular : plural}`;

type FigureTileProps = { value: number; label: string; isHighlighted?: boolean };

const FigureTile = ({ value, label, isHighlighted = false }: FigureTileProps) => (
  <div className={cn("flex min-w-[0] flex-col gap-3 rounded-panel p-5 desktop:p-6", isHighlighted ? "bg-sun" : "bg-white")}>
    <span className="font-display text-figure">{value}</span>
    <span className="text-body">{label}</span>
  </div>
);

/** Maquettes 3.3: three tiles, the months offered on Soleil; two by two on a phone. */
export const ReferralFigures = ({ overview }: { overview: ReferralOverview }) => (
  <section aria-label="Vos chiffres du parrainage" className="grid grid-cols-2 gap-3 desktop:grid-cols-3 desktop:gap-4">
    <FigureTile value={overview.signedUp} label={countWords(overview.signedUp, "filleul inscrit", "filleuls inscrits")} />
    <FigureTile
      value={overview.subscribed}
      label={countWords(overview.subscribed, "filleul abonné", "filleuls abonnés")}
    />
    <FigureTile
      value={overview.monthsOffered}
      label={countWords(overview.monthsOffered, "mois d'Essentiel offert", "mois d'Essentiel offerts")}
      isHighlighted
    />
  </section>
);

const StatusBadge = ({ referral }: { referral: ReferralRow }) =>
  referral.isSubscribed ? (
    <ToneBadge tone="success" label="Abonné" icon="valid" />
  ) : (
    <ToneBadge tone="soon" label="Inscrit" />
  );

/** « Votre mois offert »: given, waiting for a first payment, or for a paid plan. */
const describeMonth = (referral: ReferralRow): string => {
  if (referral.rewardedAt !== null) return `Offert le ${formatDayMonthYear(referral.rewardedAt)}`;
  return referral.isSubscribed ? "À son premier paiement" : "Quand il passera à un plan payant";
};

const PRIVACY_NOTE = "Vous voyez le nom de leur espace et leur statut, rien d'autre.";

const HEADER_CELL_CLASSES = "h-[48px] bg-sky px-4 text-small font-bold";

/** Maquettes 3.3, « Vos filleuls »: a table on a computer, a list on a phone; empty, one sentence and the link. */
export const ReferralList = ({ overview, url }: { overview: ReferralOverview; url: string }) => (
  <SettingsSection id="referees-title" title="Vos filleuls">
    {overview.referrals.length === 0 ? (
      <>
        <p className="text-body">
          Pas encore de filleul. Partagez votre lien : chaque créateur qui passe à un plan payant vous offre un mois
          d&apos;Essentiel.
        </p>
        <CopyReferralLinkButton url={url} />
      </>
    ) : (
      <>
        <table className="hidden w-full table-fixed border-separate border-spacing-[0] text-left text-body desktop:table">
          <thead>
            <tr>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "rounded-l-field")}>
                Espace
              </th>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "w-[18%]")}>
                Inscrit le
              </th>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "w-[18%]")}>
                Statut
              </th>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "w-[30%] rounded-r-field")}>
                Votre mois offert
              </th>
            </tr>
          </thead>
          <tbody>
            {overview.referrals.map((referral) => (
              <tr key={referral.id}>
                <td className="px-4 py-[18px] font-bold break-words">{referral.spaceName}</td>
                <td className="px-4 py-[18px] tabular-nums">{formatDayMonthYear(referral.signedUpAt)}</td>
                <td className="px-4 py-[18px]">
                  <StatusBadge referral={referral} />
                </td>
                <td className="px-4 py-[18px]">{describeMonth(referral)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="flex flex-col gap-6 desktop:hidden">
          {overview.referrals.map((referral) => (
            <li key={referral.id} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <strong className="min-w-[0] text-body font-bold break-words">{referral.spaceName}</strong>
                <StatusBadge referral={referral} />
              </div>
              <p className="text-small text-gray">{`Inscrit le ${formatDayMonthYear(referral.signedUpAt)}`}</p>
              <p className="text-small">{`Votre mois : ${describeMonth(referral).replace(/^Q/, "q")}`}</p>
            </li>
          ))}
        </ul>
        <p className="text-small text-gray">{PRIVACY_NOTE}</p>
      </>
    )}
  </SettingsSection>
);

const STEPS = [
  { title: "Partagez votre lien", text: "Dans un groupe, un message, une formation que vous donnez." },
  {
    title: "Le créateur crée son espace",
    text: "Il apparaît dans « Vos filleuls », avec la date de son inscription.",
  },
  {
    title: "Il passe à un plan payant",
    text: "Un mois d'Essentiel vous est offert. Un mois par filleul payant, sans limite.",
  },
];

/** Maquettes 3.3, « Comment ça marche »: a true sequence, numbered on Soleil (charte, Étapes numérotées). */
export const HowReferralWorks = ({ className }: { className?: string }) => (
  <SettingsSection id="how-referral-works" title="Comment ça marche" className={className}>
    <ol className="flex flex-col gap-6">
      {STEPS.map((step, index) => (
        <li key={step.title} className="flex gap-5">
          <span
            aria-hidden="true"
            className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-sun font-display text-[18px] leading-none"
          >
            {index + 1}
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-body font-bold">{step.title}</h3>
            <p className="text-small text-gray">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
    <p className="text-small text-gray">
      Au plan Gratuit, le mois offert vous fait passer au plan Essentiel pendant un mois. Avec un abonnement, un mois
      d&apos;Essentiel est déduit de vos prochains paiements.
    </p>
  </SettingsSection>
);
