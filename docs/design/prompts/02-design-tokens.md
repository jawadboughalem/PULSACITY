# 02 — Les jetons de design

> Prérequis : `00-context.md`, puis la charte produite par `01`.
> Livrable : **code** — `packages/design/`, plus un test qui protège la règle 10.
> Sans cette étape, tout le reste du kit produit du joli jetable.

---

## Ton rôle

Tu traduis la charte en jetons. `packages/design` est la seule source du look : après ton
passage, changer le produit de peau doit être une modification de ce paquet, jamais une
tournée dans les composants.

Aujourd'hui `packages/design/src/tokens.css` déclare 13 couleurs, 3 tailles de texte, 2
rayons et 1 ombre. C'est trop maigre, et la règle 10 est déjà entamée par ce que les
composants compensent à la main :

| Valeur en dur                            | Fichier                                                  |
| ---------------------------------------- | -------------------------------------------------------- |
| `rounded-[1.75rem]`, `rounded-[1.25rem]` | `components/phone-frame.tsx`                             |
| `tracking-[0.2em]`                       | `components/wordmark.tsx`                                |
| `text-[0.975rem]`                        | `app/globals.css` (`.legal-prose`)                       |
| `min-h-[70vh]`, `min-h-[60vh]`           | `not-found`, `demo-unavailable`, `commande-indisponible` |
| `2.4s`, `duration-200`                   | `globals.css`, `sections/faq.tsx`                        |
| `size-8` ici, `size-7` là                | `sections/steps.tsx`, `merci/page.tsx` — même objet      |
| `max-w-5xl / 3xl / 2xl / lg`             | choisis page par page, sans règle                        |
| `#2a4a9c`, `#e2603c`, `#fbfaf8`          | `app/icon.svg`, `app/opengraph-image.tsx`                |

Chacune de ces lignes doit disparaître au profit d'un jeton.

## Comment Tailwind v4 fonctionne ici

Pas de fichier de configuration. Les jetons sont déclarés dans un bloc `@theme` et Tailwind
en dérive les utilitaires : `--color-ink` donne `text-ink` / `bg-ink` / `border-ink`,
`--text-title` donne `text-title`, `--radius-lg` donne `rounded-lg`.

Trois conséquences à respecter :

- **Un jeton hors espace de noms Tailwind ne produit aucun utilitaire.** `--container-page`
  ou `--section-gap-y` s'emploient alors via `var()` dans une règle CSS ou une classe
  utilitaire que tu déclares toi-même. Dis dans le fichier lequel des deux tu choisis, et
  reste cohérent.
- **Les variables de `@theme` sont émises sur `:root`.** Un thème alternatif se fait en
  redéfinissant ces mêmes variables dans un sélecteur ordinaire, pas dans un second
  `@theme`. Les utilitaires suivent, puisqu'ils lisent `var()`.
- Le fichier actuel fait déjà varier `--text-display` et `--text-title` dans
  `@media (width >= 40rem) { @theme { … } }`. Garde ce procédé si tu gardes une échelle
  fluide, ou passe à `clamp()` — mais choisis, et explique en une ligne.

## Ce que tu dois produire

### A. `packages/design/src/tokens.css`

Réécrit, organisé par familles, chaque famille précédée d'un commentaire en anglais qui dit
**ce que le jeton décide** et non ce qu'il vaut.

1. **Surfaces et encres** — `ground`, `surface`, `surface-sunken`, `surface-inked` (l'aplat
   quasi-noir), `ink`, `ink-muted`, `ink-faint`, `ink-inverse`, `line`, `line-strong`,
   `line-inverse`. Les valeurs existantes se conservent si la charte les valide.
2. **Accent** — `accent`, `accent-hover`, `accent-soft`, `accent-ink`,
   `accent-foreground`, et le corail lisible **sur fond encré** si la charte prévoit des
   sections inversées. `--color-accent` reste à L = 0.58 : c'est le corail le plus clair qui
   porte du texte blanc à 4.5:1.
3. **États** — `danger`, `danger-soft`, `danger-ink`, un jeton de succès si la charte en
   demande un, et `focus` pour l'anneau de focus, aujourd'hui confondu avec l'accent.
4. **Typographie** — les deux familles en `--font-sans` et `--font-display`, alimentées par
   les variables `next/font`. L'échelle complète : `display`, `title`, `subtitle`, `lead`,
   `body`, `body-sm`, `caption`, `eyebrow`, chacune avec son `--line-height` et son
   `--letter-spacing` quand ils s'écartent du défaut.
5. **Rythme et mesure** — `--container-page`, `--container-prose`, `--container-narrow`,
   `--section-gap-y` et sa variante bureau, `--header-height`, `--scroll-offset` (que
   `globals.css` fixe aujourd'hui à `5rem` sans rapport déclaré avec la hauteur de
   l'en-tête : les deux doivent venir du même jeton).
6. **Rayons** — `sm`, `md`, `lg`, `xl`, `pill`, plus `--radius-device` et
   `--radius-screen` pour le cadre de téléphone, aujourd'hui en valeurs arbitraires.
7. **Élévation** — `subtle`, `raised`, `overlay`. Les ombres restent quasi invisibles : ce
   sont les filets qui séparent. Si la charte supprime une élévation, supprime le jeton
   plutôt que de le laisser inutilisé.
8. **Mouvement** — `--duration-fast`, `--duration-base`, `--duration-slow`,
   `--duration-pulse`, et les courbes `--ease-out-soft`, `--ease-in-out-soft`. Plus aucune
   durée ne doit rester écrite dans un composant.

### B. Le reste du paquet

- `packages/design/src/motion.css` si tu sors les animations partagées de
  `apps/corporate/src/app/globals.css` — le battement du point et la révélation au défilement
  ne sont pas propres à la page corporate : le gabarit client peut en avoir besoin.
- `packages/design/package.json` mis à jour : chaque nouveau fichier doit figurer dans
  `exports`, sinon l'import échoue à la compilation.
- `packages/design/README.md` : à quoi sert chaque famille, comment ajouter un jeton, et la
  phrase qui tranche les litiges — _si une valeur apparaît deux fois dans deux composants,
  c'est un jeton._

### C. Le test qui protège la règle 10

Un test Vitest, dans `packages/design`, qui lit les sources de `apps/corporate/src` et
`packages/templates/src` et **échoue** s'il trouve :

- une couleur littérale : `#rrggbb`, `rgb(`, `hsl(`, `oklch(` hors du paquet `design` ;
- une valeur arbitraire Tailwind portant une unité : `[1.75rem]`, `[70vh]`, `[0.975rem]`,
  `[12px]` — en laissant passer les valeurs structurelles sans unité comme
  `grid-cols-[1fr_auto]` ;
- une durée ou une graisse en dur dans une classe.

Le test énumère les fichiers fautifs avec leur ligne, et porte une liste d'exceptions
**vide** au départ. Toute exception ajoutée plus tard devra porter en commentaire la raison
de son existence.

Ce test est le seul moyen que la règle 10 tienne dans six mois. Écris-le avant de migrer les
composants : il doit d'abord échouer, puis passer.

### D. La migration

Remplace, dans `apps/corporate` et `packages/templates`, chaque valeur du tableau du haut par
son jeton. Aucun changement visuel n'est attendu à cette étape, **sauf** ceux que la charte
impose explicitement — et tu les listes alors un par un.

Deux cas particuliers, **déjà traités** — gardés ici pour que la démarche reste lisible :

- `app/icon.svg` est un carré **bleu** `#2a4a9c`, hors charte. Il vient de la charte
  produite en `01`. Le prompt `08` s'occupe du jeu complet d'icônes ; ici, au minimum, la
  couleur ne doit plus contredire la marque.
- `app/opengraph-image.tsx` recopie `INK`, `ACCENT`, `GROUND` en hexadécimal, **et écrit le
  prix en dur** — deux règles enfreintes, la 10 et le socle. `next/og` ne lit pas les
  variables CSS : exporte donc les valeurs depuis un module TypeScript du paquet `design`
  (`packages/design/src/tokens.ts`) et fais-en la source unique, consommée par le CSS comme
  par l'image. Le prix, lui, se lit dans le fichier de la ligne. Le prompt `08` reprend le
  sujet en détail.

## Contraintes non négociables

- Les couleurs restent en `oklch()`. Pas de hexadécimal dans le CSS.
- Aucun jeton n'est nommé d'après son apparence. `--color-accent`, jamais `--color-orange` ;
  `--container-prose`, jamais `--container-768`.
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build` passe.
- Tout nom de jeton, de fichier et de commentaire est en anglais.

## Critères d'acceptation

- [ ] Chaque ligne du tableau des valeurs en dur a disparu au profit d'un jeton.
- [ ] Le test de la règle 10 existe, sa liste d'exceptions est vide, et il passe.
- [ ] `--scroll-offset` et la hauteur de l'en-tête dérivent du même jeton.
- [ ] Le même objet a la même taille partout — les pastilles numérotées de `steps` et de
      `merci` ne peuvent plus diverger.
- [ ] `packages/design/package.json` exporte tout ce que le paquet contient.
- [ ] Le README du paquet permet d'ajouter un jeton sans poser de question.
- [ ] La suite complète passe, et le rendu est inchangé hors des écarts listés.
