import { type BadgeTone, ToneBadge } from "@/components/ui/ToneBadge";
import type { IconName } from "@/components/ui/icon-paths";
import { type CompatibilityVerdict, SITE_COMPATIBILITY_ROWS } from "@/content/integrations/site-compatibility";

/** Charte v2, Badges ajoutés, compatibilité: Oui, Selon la formule, Pas encore testé, Non. */
const VERDICT_BADGES: Record<CompatibilityVerdict, { tone: BadgeTone; label: string; icon?: IconName }> = {
  yes: { tone: "success", label: "Oui", icon: "check" },
  plan: { tone: "soon", label: "Selon la formule" },
  untested: { tone: "neutral", label: "Pas encore testé" },
  no: { tone: "neutral", label: "Non", icon: "cancelled" },
};

/**
 * Maquettes 3.5, Intégrations, « Compatible avec votre site »: on a computer, a table on a white card, its header on
 * Ciel, without rules between the rows (charte v2, Tableau); on a phone, a white card per site.
 */
export const SiteCompatibility = () => (
  <>
    <div className="hidden rounded-card bg-white p-2 desktop:block">
      <table className="w-full border-separate border-spacing-[0] text-left text-body">
        <caption className="sr-only">Les pages où le widget se colle</caption>
        <thead>
          <tr className="text-small font-bold">
            <th scope="col" className="h-[48px] w-[29%] rounded-l-field bg-sky px-4">
              Votre site
            </th>
            <th scope="col" className="h-[48px] w-[18%] bg-sky px-4">
              Le widget s&apos;y colle ?
            </th>
            <th scope="col" className="h-[48px] rounded-r-field bg-sky px-4">
              Condition
            </th>
          </tr>
        </thead>
        <tbody>
          {SITE_COMPATIBILITY_ROWS.map((row) => (
            <tr key={row.site}>
              <th scope="row" className="px-4 py-4 font-bold">
                {row.site}
              </th>
              <td className="px-4 py-4">
                <ToneBadge {...VERDICT_BADGES[row.verdict]} />
              </td>
              <td className="px-4 py-4">{row.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ul className="flex flex-col gap-3 desktop:hidden">
      {SITE_COMPATIBILITY_ROWS.map((row) => (
        <li key={row.site} className="flex flex-col items-start gap-3 rounded-card bg-white p-4">
          <h3 className="text-body font-bold">{row.site}</h3>
          <ToneBadge {...VERDICT_BADGES[row.verdict]} />
          <p className="text-small text-gray">{row.condition}</p>
        </li>
      ))}
    </ul>
  </>
);
