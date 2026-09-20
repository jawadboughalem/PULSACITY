# @pulsacity/design

La seule source du look. Si une couleur, une taille ou un rayon est décidé ailleurs, c'est un bug.

## Ce qu'il y a dedans

| Fichier                         | Rôle                                                                |
| ------------------------------- | ------------------------------------------------------------------- |
| `src/tokens.css`                | Les jetons que lit le navigateur, dans un bloc `@theme` Tailwind v4 |
| `src/tokens.ts`                 | Les mêmes valeurs, pour ce qui ne lit pas de CSS : images, SVG, PNG |
| `src/logo.ts`                   | La géométrie de la marque, et le rendu SVG                          |
| `src/brand-assets.ts`           | La liste des fichiers de marque et leur contenu attendu             |
| `src/logo/*`                    | Les fichiers produits — **jamais modifiés à la main**               |
| `scripts/build-brand-assets.ts` | Ce qui les produit                                                  |

## Deux fichiers de jetons, une seule vérité

`tokens.css` est lu par le navigateur ; `tokens.ts` par `next/og`, par le générateur de SVG
et par tout ce qui rastérise une icône. Les deux déclarent les mêmes valeurs OKLCH, et
`src/tokens.test.ts` échoue si l'un s'écarte de l'autre.

La conversion OKLCH → `#rrggbb` est faite dans `tokens.ts`, vérifiée contre les primaires
sRGB. Aucune valeur hexadécimale n'est tapée à la main.

## Refaire les fichiers de marque

```bash
pnpm brand:assets
```

Écrit les SVG de `src/logo/`, `apps/corporate/src/app/icon.svg` et les deux PNG d'icône
d'application. `src/brand-assets.test.ts` compare ce qui est commité à ce que le script
produirait : modifier un SVG à la main fait échouer la suite.

## Ajouter un jeton

Un jeton se nomme d'après son **rôle**, jamais d'après son apparence : `--color-accent`,
pas `--color-orange` ; `--container-prose`, pas `--container-768`.

La règle qui tranche les litiges : **si une valeur apparaît deux fois dans deux
composants, c'est un jeton.**

Une couleur ajoutée à `tokens.css` doit l'être aussi à `OKLCH` dans `tokens.ts`, sinon le
test le dit.
