import Link from "next/link";
import { BILLING_HREF } from "@/components/space/space-sections";
import { Icon } from "@/components/ui/Icon";

type CsvPlanNoticeProps = {
  pendingCount: number;
  publishedCount: number;
  planName: string;
  limit: number | null;
  /** After the import, the sentences move from the future to the present. */
  isDone: boolean;
};

const count = (value: number, singular: string, plural: string) => `${value} ${value > 1 ? plural : singular}`;

const remainVerb = (pendingCount: number, isDone: boolean) =>
  pendingCount > 1 ? (isDone ? "restent" : "resteront") : isDone ? "reste" : "restera";

const describePublished = (publishedCount: number, isDone: boolean) => {
  if (publishedCount === 0) return null;
  if (publishedCount === 1) return `Le premier du fichier ${isDone ? "est publié" : "sera publié"}.`;
  return `Les ${publishedCount} premiers du fichier ${isDone ? "sont publiés" : "seront publiés"}.`;
};

const describeKept = (pendingCount: number, publishedCount: number, isDone: boolean) => {
  const isOne = pendingCount === 1;
  const subject = publishedCount === 0 ? (isOne ? "Il" : "Ils") : isOne ? "L'autre" : `Les ${pendingCount} autres`;
  const verb = isOne ? (isDone ? "est" : "sera") : isDone ? "sont" : "seront";
  const all = publishedCount === 0 && !isOne ? " tous" : "";
  const shown = isDone
    ? `${isOne ? "il s'affiche" : "ils s'affichent"} dès que vous passez au plan Essentiel`
    : `${isOne ? "il s'affichera" : "ils s'afficheront"} dès que vous passerez au plan Essentiel`;
  return `${subject} ${verb}${all} ${isOne ? "gardé" : "gardés"} en attente : rien n'est perdu, ${shown}.`;
};

const describe = ({ pendingCount, publishedCount, planName, limit, isDone }: CsvPlanNoticeProps) =>
  [
    `Votre plan ${planName} affiche ${limit} témoignages.`,
    describePublished(publishedCount, isDone),
    describeKept(pendingCount, publishedCount, isDone),
  ]
    .filter(Boolean)
    .join(" ");

/** Past the plan's limit, the imported testimonials wait in pending: the creator knows how many, and why. */
export const CsvPlanNotice = (props: CsvPlanNoticeProps) => (
  <section className="flex items-start gap-3 bg-paper-100 p-4 desktop:p-5">
    <Icon name="info" size={20} className="mt-[2px]" />
    <div className="flex flex-col gap-2">
      <p className="text-body font-semibold">
        {`${count(props.pendingCount, "témoignage", "témoignages")} ${remainVerb(props.pendingCount, props.isDone)} en attente`}
      </p>
      <p className="text-small">{describe(props)}</p>
      <Link
        href={BILLING_HREF}
        className="self-start text-small font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
      >
        Voir le plan Essentiel
      </Link>
    </div>
  </section>
);
