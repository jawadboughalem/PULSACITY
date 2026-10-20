import { Fragment } from "react";
import { Icon } from "@/components/ui/Icon";
import { PLAN_IDS, PLANS, type PlanId } from "@/config/plans";
import { type ComparisonValue, PLAN_COMPARISON, RECOMMENDED_PLAN } from "@/content/plan-offer";
import { cn } from "@/lib/cn";

/**
 * Inside the comparison scope (group/compare): on a phone, only the chosen plan's column shows, its value on the
 * right, in bold; on a computer, all three.
 */
const PHONE_VISIBILITY: Record<PlanId, string> = {
  free: "hidden group-data-[choice=free]/compare:table-cell desktop:table-cell",
  essentiel: "hidden group-data-[choice=essentiel]/compare:table-cell desktop:table-cell",
  pro: "hidden group-data-[choice=pro]/compare:table-cell desktop:table-cell",
};

const Value = ({ value }: { value: ComparisonValue }) =>
  value.kind === "included" ? (
    <>
      <Icon name="check" size={22} className="text-success" />
      <span className="sr-only">Inclus</span>
    </>
  ) : (
    <span className="font-bold desktop:font-normal">{value.label}</span>
  );

/**
 * « Comparer en détail » (charte v2, ajouts 3.5, Comparatif): each row a white band on Nuage, 6 px apart, rounded 14 at
 * its ends; Essentiel's column on Ciel, whole from the first row of a group to its last. The labels take 41 %.
 */
export const PlanComparison = () => (
  <table className="w-full border-separate border-spacing-x-[0] border-spacing-y-[6px] text-left text-body">
    <caption className="sr-only">Ce que comprend chaque plan</caption>
    <colgroup>
      <col className="desktop:w-[41%]" />
      {PLAN_IDS.map((id) => (
        <col key={id} className="desktop:w-[19.66%]" />
      ))}
    </colgroup>
    <thead className="sr-only desktop:not-sr-only">
      <tr>
        <td />
        {PLAN_IDS.map((id) => (
          <th
            key={id}
            scope="col"
            className={cn(
              "h-[64px] px-5 font-display text-h3",
              id === RECOMMENDED_PLAN && "rounded-t-field bg-sky",
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
          <tr>
            <th
              scope="colgroup"
              colSpan={PLAN_IDS.length + 1}
              className="pt-6 pb-2 text-small font-bold text-gray desktop:pt-5"
            >
              {group.title}
            </th>
          </tr>
          {group.rows.map((row, rowIndex) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="rounded-l-field bg-white py-3 pr-3 pl-4 font-normal desktop:h-[52px] desktop:py-[0] desktop:pl-5 desktop:text-[17px] desktop:leading-[24px] desktop:font-semibold"
              >
                {row.label}
              </th>
              {PLAN_IDS.map((id, index) => (
                <td
                  key={id}
                  className={cn(
                    "rounded-r-field bg-white py-3 pr-4 text-right whitespace-nowrap desktop:h-[52px] desktop:px-5 desktop:py-[0] desktop:text-left",
                    index < PLAN_IDS.length - 1 && "desktop:rounded-r-none",
                    id === RECOMMENDED_PLAN && "desktop:bg-sky",
                    // The 6 px between two rows stay Ciel in Essentiel's column.
                    id === RECOMMENDED_PLAN && rowIndex > 0 && "desktop:shadow-[0_-6px_0_var(--color-sky)]",
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
