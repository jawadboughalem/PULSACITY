import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { CsvRow } from "@/lib/testimonials/csv/read-testimonial-csv";

type CsvProblemsProps = {
  title: string;
  intro: string;
  rows: CsvRow[];
  children?: ReactNode;
};

/**
 * The lines that stay out of the import, each with what to fix. Maquettes 3.4: a white card with the Erreur border, its
 * title in Erreur with the alert, each line on Erreur fond.
 */
export const CsvProblems = ({ title, intro, rows, children }: CsvProblemsProps) => (
  <section role="status" className="flex flex-col gap-4 rounded-card border-2 border-error bg-white p-4 desktop:p-6">
    <div className="flex flex-col gap-2">
      <p className="flex items-start gap-2 text-body font-bold text-error">
        <Icon name="alert" size={20} className="mt-[3px]" />
        {title}
      </p>
      <p className="text-small">{intro}</p>
    </div>
    <ul className="flex flex-col gap-2">
      {rows.map((row) => (
        <li
          key={row.line}
          className="grid grid-cols-1 gap-x-3 rounded-field bg-error-surface px-4 py-3 text-small desktop:grid-cols-[88px_minmax(0,1fr)]"
        >
          <span className="font-bold">{`Ligne ${row.line}`}</span>
          <span className="flex flex-col gap-1">
            <span className="font-bold">{row.authorName || "Nom manquant"}</span>
            {row.problems.map((problem) => (
              <span key={problem}>{problem}</span>
            ))}
          </span>
        </li>
      ))}
    </ul>
    {children}
  </section>
);
