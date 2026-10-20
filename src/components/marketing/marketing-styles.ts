import { DISCREET_BUTTON_CLASSES, INLINE_LINK_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

/** The call to create a space (charte v2, ajouts 3.5, Appel principal): full width on a phone. */
export const LARGE_BUTTON_CLASSES = cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto");

/** A link of the public site that stands on its own (« Voir toutes les intégrations »): charte v2, Bouton discret. */
export const TEXT_LINK_CLASSES = DISCREET_BUTTON_CLASSES;

/** The first step of a breadcrumb: a link in the line of the text, 44 high to be easy to touch. */
export const BREADCRUMB_LINK_CLASSES = cn(INLINE_LINK_CLASSES, "inline-flex min-h-[44px] items-center font-normal");

/**
 * Charte v2, ajouts 3.5, Titres du site: the home's large title, Bricolage 800, 72/72 on a computer and 40/40 on a
 * phone, −0,04 em.
 */
export const SITE_HERO_TITLE_CLASSES =
  "font-display text-[40px] leading-[40px] font-extrabold tracking-[-0.04em] desktop:text-[72px] desktop:leading-[72px]";

/** A page's title (« Intégrations », the legal texts, a guide): the charter's h1, 52 on a computer. */
export const SITE_PAGE_TITLE_CLASSES = "font-display text-h1";

/**
 * The title of a page that opens on its promise (Tarifs, Guides, a tool's page): the top of the « 52 à 64 » of the
 * charter, as drawn on 3.5, 60/60 on a computer and 36/36 on a phone.
 */
export const SITE_LARGE_PAGE_TITLE_CLASSES =
  "font-display text-[36px] leading-[36px] font-extrabold tracking-[-0.035em] desktop:text-[60px] desktop:leading-[60px]";

/** A section's title: Bricolage 800, 44/48 on a computer and 30/33 on a phone, −0,03 em, 28 characters a line at most. */
export const SITE_SECTION_TITLE_CLASSES =
  "font-display text-[30px] leading-[33px] font-extrabold tracking-[-0.03em] desktop:text-[44px] desktop:leading-[48px]";

/**
 * A title in a narrow column or a panel (« Installer la connexion Systeme.io, pas à pas », « Une question sans réponse
 * ici ? »): 34/38 on a computer, the h1 of a phone, as drawn on 3.5.
 */
export const SITE_PANEL_TITLE_CLASSES =
  "font-display text-[30px] leading-[33px] font-extrabold tracking-[-0.03em] desktop:text-[34px] desktop:leading-[38px] desktop:tracking-[-0.035em]";

/** The title of a group inside a section (« Démarrer », a family of tools): the charter's h2. */
export const SITE_GROUP_TITLE_CLASSES = "font-display text-h2";
