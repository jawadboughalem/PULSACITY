import { Fragment } from "react";
import { Icon } from "@/components/ui/Icon";
import { PLAN_IDS, PLANS, type PlanId } from "@/config/plans";
import { type ComparisonValue, PLAN_COMPARISON, RECOMMENDED_PLAN } from "@/content/plan-offer";
import { cn } from "@/lib/cn";

/**
 * Inside the comparison scope (group/compare): on a phone, only the chosen plan's column shows, as on m8 mobile;
 * on a computer, all three.
 */
const PHONE_VISIBILITY: Record<PlanId, string> = {
  free: "hidden group-data-[choice=free]/compare:table-cell desktop:table-cell",
  essentiel: "hidden group-data-[choice=essentiel]/compare:table-cell desktop:table-cell",
  pro: "hidden group-data-[choice=pro]/compare:table-cell desktop:table-cell",
};

/** m8: in bold on a phone, where one plan shows at a time; regular on a computer, where the three sit side by side. */
/** m8 on a computer: the features take two fifths, Pro a little less than the others. */
const COLUMN_WIDTHS: Record<PlanId, string> = {
  free: "desktop:w-[20.5%]",
  essentiel: "desktop:w-[20%]",
  pro: "desktop:w-[18.5%]",
};

const Value = ({ value }: { value: ComparisonValue }) => {
  switch (value.kind) {
    case "included":
      return (
        <>
          <Icon name="check" size={20} className="ml-auto desktop:ml-[0]" />
          <span className="sr-only">Inclus</span>
        </>
      );
    case "excluded":
      return (
        <span className="text-slate-600">
          <span className="desktop:hidden">{value.label}</span>
          <span aria-hidden="true" className="hidden desktop:inline">
            —
          </span>
          <span className="sr-only hidden desktop:inline">{value.label}</span>
        </span>
      );
    case "soon":
      return <span className="font-semibold desktop:font-normal desktop:text-slate-600">{value.label}</span>;
    case "text":
      return <span className="font-semibold desktop:font-normal">{value.label}</span>;
  }
};

/** « Comparer en détail » of maquette 8: one row per feature, grouped; Essentiel's column on Papier. */
export const PlanComparison = () => (
  <table className="w-full border-collapse text-left text-body">
    <caption className="sr-only">Ce que comprend chaque plan</caption>
    <colgroup>
      <col className="desktop:w-[41%]" />
      {PLAN_IDS.map((id) => (
        <col key={id} className={COLUMN_WIDTHS[id]} />
      ))}
    </colgroup>
    <thead className="sr-only desktop:not-sr-only">
      <tr className="border-b border-ink-900">
        <td />
        {PLAN_IDS.map((id) => (
          <th
            key={id}
            scope="col"
            className={cn(
              "px-4 py-4 font-serif text-quote font-medium",
              id === RECOMMENDED_PLAN && "bg-paper-100",
              PHONE_VISIBILITY[id],
            )}
          >
            {PLANS[id].name}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {PLAN_COMPARISON.map((group) => (
        <Fragment key={group.title}>
          <tr className="border-b border-ink-900 desktop:border-b-[0]">
            <th
              scope="colgroup"
              colSpan={PLAN_IDS.length + 1}
              className="pt-7 pb-3 text-small font-semibold text-slate-600 desktop:pt-6 desktop:pb-2"
            >
              {group.title}
            </th>
          </tr>
          {group.rows.map((row) => (
            <tr key={row.label} className="border-b border-hairline-200">
              <th scope="row" className="py-3 pr-3 font-normal desktop:py-4 desktop:pr-4">
                {row.label}
              </th>
              {PLAN_IDS.map((id) => (
                <td
                  key={id}
                  className={cn(
                    "py-3 text-right whitespace-nowrap desktop:px-4 desktop:py-4 desktop:text-left",
                    id === RECOMMENDED_PLAN && "desktop:bg-paper-100",
                    PHONE_VISIBILITY[id],
                  )}
                >
                  <span className="flex items-center justify-end desktop:justify-start">
                    <Value value={row.values[id]} />
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </Fragment>
      ))}
    </tbody>
  </table>
);
