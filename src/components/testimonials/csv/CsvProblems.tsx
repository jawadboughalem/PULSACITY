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
  <section role="status" className="flex flex-col gap-4 border-2 border-error p-4 desktop:p-5">
    <div className="flex items-start gap-3">
      <Icon name="alert" size={20} className="mt-[2px] text-error" />
      <div className="flex flex-col gap-1">
        <p className="text-body font-semibold text-error">{title}</p>
        <p className="text-small">{intro}</p>
      </div>
    </div>
    <ul className="flex flex-col border-t border-hairline-200">
      {rows.map((row) => (
        <li
          key={row.line}
          className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 border-b border-hairline-200 py-3 text-small desktop:grid-cols-[88px_minmax(0,1fr)]"
        >
          <span className="font-semibold">{`Ligne ${row.line}`}</span>
          <span className="flex flex-col gap-1">
            <span className="font-semibold">{row.authorName || "Nom manquant"}</span>
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
