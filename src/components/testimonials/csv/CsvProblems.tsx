import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { CsvRow } from "@/lib/testimonials/csv/read-testimonial-csv";

type CsvProblemsProps = {
  title: string;
  intro: string;
  rows: CsvRow[];
  children?: ReactNode;
};

/** The lines that stay out of the import, each with what to fix. */
export const CsvProblems = ({ title, intro, rows, children }: CsvProblemsProps) => (
  <section role="status" className="flex flex-col gap-4 rounded-card border-2 border-error bg-error-surface p-4 desktop:p-6">
    <div className="flex items-start gap-3">
      <Icon name="alert" size={24} className="mt-[1px] text-error" />
      <div className="flex flex-col gap-1">
        <p className="text-body font-bold">{title}</p>
        <p className="text-small">{intro}</p>
      </div>
    </div>
    <ul className="flex flex-col gap-2">
      {rows.map((row) => (
        <li
          key={row.line}
          className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-card bg-white px-4 py-3 text-small desktop:grid-cols-[88px_minmax(0,1fr)]"
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
