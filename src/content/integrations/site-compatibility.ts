import { NO_BREAK_SPACE } from "@/lib/french/typography";

/** Where the widget pastes (decisions/connecteurs.md, « Compatible avec votre site »): about the sales page, not the tool. */
export type CompatibilityVerdict = "yes" | "plan" | "untested" | "no";

export type SiteCompatibility = { site: string; verdict: CompatibilityVerdict; condition: string };

/** The rows of maquettes 3.5, in the order of connecteurs.md, with their conditions in words. */
export const SITE_COMPATIBILITY_ROWS: SiteCompatibility[] = [
  { site: "Systeme.io", verdict: "yes", condition: "Avec un bloc de code dans votre page." },
  { site: "WordPress installé vous-même", verdict: "yes", condition: "Avec un compte administrateur." },
  { site: "WordPress.com", verdict: "plan", condition: "Plan Business ou Commerce." },
  { site: "Wix", verdict: "plan", condition: "Plan Premium, avec un domaine connecté et sans publicité." },
  { site: "Squarespace", verdict: "plan", condition: "Plan Core ou supérieur." },
  { site: "Webflow", verdict: "plan", condition: "Plan payant de site ou d'espace de travail." },
  { site: "Carrd", verdict: "plan", condition: "Plan Pro Standard ou supérieur." },
  { site: "Framer", verdict: "untested", condition: "Test en cours sur le plan gratuit." },
  {
    site: "Shopify, Kajabi, Podia, Learnybox, SchoolMaker",
    verdict: "untested",
    condition: `Pas encore testés${NO_BREAK_SPACE}: écrivez-nous si vous l'avez fait.`,
  },
  { site: "Notion, Linktree", verdict: "no", condition: "Ces pages n'acceptent pas de code. Pas pour l'instant." },
];
