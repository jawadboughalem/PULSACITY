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

const Value = ({ value }: { value: ComparisonValue }) => {
  if (value.kind === "included") {
    return (
      <>
        <Icon name="check" size={20} className="ml-auto desktop:ml-[0]" />
        <span className="sr-only">Inclus</span>
      </>
    );
  }
  return (
    <span className={value.kind === "excluded" ? "text-slate-600" : "font-semibold"}>{value.label}</span>
  );
};

/** « Comparer en détail » of maquette 8: one row per feature, grouped; Essentiel's column on Papier. */
export const PlanComparison = () => (
  <table className="w-full border-collapse text-left text-body">
    <caption className="sr-only">Ce que comprend chaque plan</caption>
    <colgroup>
      <col className="desktop:w-[40%]" />
      {PLAN_IDS.map((id) => (
        <col key={id} className="desktop:w-[20%]" />
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
          <tr className="border-b border-ink-900">
            <th
              scope="colgroup"
              colSpan={PLAN_IDS.length + 1}
              className="pt-7 pb-3 text-small font-semibold text-slate-600"
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
