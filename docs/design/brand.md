# Charte graphique PULSACITY

> Planche : [`brand-charter.html`](./brand-charter.html). Ce document porte les mêmes décisions,
> avec la raison de chacune — c'est lui qu'on relira dans six mois pour savoir pourquoi.
>
> Les dix règles de `CLAUDE.md` s'appliquent, la 10 en particulier : **tout ce qui est décidé ici
> s'exprime en jetons.** Une décision qui ne peut pas devenir un jeton n'entrera jamais dans le
> code ; elle est reformulée jusqu'à ce qu'elle le puisse.

---

## 1. L'idée de marque

**PULSACITY est un artisan qui fabrique des sites pour d'autres artisans.**

La page tient de la lettre soignée, pas de la page d'atterrissage : on y achète quelqu'un, pas un
abonnement — et cela se voit avant d'être lu.

Trois principes de composition en découlent.

1. **Une idée par écran.** Une section dit une chose et la dit en grand. Si deux idées se disputent
   la même hauteur, c'est qu'il manque une section.
2. **Le vide sépare, pas le trait.** Un changement de surface _est_ une séparation. Le filet ne sert
   qu'entre deux sections posées sur la même surface.
3. **Le texte porte le dessin.** Ni illustration, ni ornement : deux familles typographiques, trois
   surfaces, un point corail. Rien d'autre à produire — ce qui est aussi ce qui rend la charte
   tenable pour une personne seule.

---

## 2. Les cinq décisions

### 2.1 Quelle marque ? — **L'atelier.** Hypothèse retenue.

Éditorial, chaud, tactile, direct.

**Pourquoi**, en trois raisons tirées du produit et non du goût :

- Le contenu est **déjà écrit à la première personne du singulier** : « Je rédige vos textes »,
  « Vous m'appelez, je réponds », « Un interlocuteur, pas un ticket ». Une langue SaaS contredirait
  le texte à chaque ligne. Le dessin ne doit pas se battre avec les mots.
- La **règle 6** interdit les références inventées. Une page d'atterrissage SaaS tourne à la preuve
  sociale — mur de logos, statistiques, témoignages — dont nous ne disposons pas. Un atelier tourne
  à la voix de celui qui fabrique, dont nous disposons.
- La **règle 7** fixe un prix unique, sans code promo, sans option, sans quantité. C'est un tarif
  d'artisan, pas une matrice tarifaire. Un tableau à trois colonnes promettrait un choix qui
  n'existe pas.

**Ce que cela exclut :** dégradés violets, verre dépoli, nuages de cartes flottantes, captures
d'interface en perspective, illustrations abstraites de type _undraw_, « étoiles IA ».

### 2.2 Une seconde famille typographique ? — **Oui.** Fraunces en display, Manrope pour le reste.

**Pourquoi Fraunces**, parmi les trois candidates :

- Son axe **`opsz` (9–144)** épaissit le dessin quand la taille baisse. C'est la réponse directe à la
  contrainte : rester net à 16 px sur un téléphone d'entrée de gamme. Les navigateurs appliquent cet
  axe seuls (`font-optical-sizing: auto`).
- Son axe **`SOFT`** arrondit les terminaisons. Réglé à 30, il donne la main de l'atelier sans verser
  dans le rond — et il rime avec le point du logotype.
- Elle est **variable** : un fichier, une plage de graisses. On emploie 500 pour le display, jamais
  un gras.

**Écartées, et pourquoi :**

- **Instrument Serif** : une seule coupe, un fort contraste de graisse dessiné pour les grandes
  tailles. Ses déliés s'effondrent sous 28 px, c'est-à-dire exactement à la taille de nos titres de
  section sur mobile. Et c'est la fonte de la moitié des pages d'atterrissage de l'année : le
  contraire d'un caractère.
- **Newsreader** : excellente à 16 px, sans voix à 72 px. Or 72 px est justement l'endroit où il
  faut une voix — le texte courant, lui, est déjà le travail de Manrope. Ce serait un second neutre,
  donc aucun gain.

**Manrope est conservée.** L'hygiène typographique du dépôt est bonne ; une troisième famille ne
réglerait rien que le contraste des deux premières ne règle.

**Plancher :** Fraunces ne descend jamais sous 20 px. En dessous, c'est Manrope.

### 2.3 Comment montrer le produit sans rien inventer ? — **Deux états dessinés de la même zone.**

`content/showcase.json` est vide, et la règle 6 interdit toute capture fabriquée. Le produit est
donc invisible alors que c'est l'argument principal. Les deux états sont dessinés, tous deux sur
l'encre, et **la zone garde la même hauteur dans les deux cas** (`--size-showcase-min-h`) : le jour
où la première capture arrive, rien ne bouge autour.

- **État plein** — une capture réelle dans un cadre de téléphone. Art direction en §9.
- **État vide** — une page de titre assumée : le titre de la section, une phrase qui dit franchement
  qu'aucun site n'est encore publié, et les cinq pages que le site contiendra, en liste pointée.
  Sur le papier, un vide se lit comme un manque ; sur l'encre, il se lit comme une intention.

**La phrase de l'état vide vit dans `content/`, jamais dans un composant.** C'est la règle 1 : la
page ne connaît aucune offre. La section `showcase` gagne un bloc optionnel :

```json
{
  "type": "showcase",
  "title": "Un site livré",
  "empty": {
    "text": "Aucun site n'est encore publié ici.",
    "items": ["Accueil", "Prestations", "Tarifs", "Avis", "Contact"]
  }
}
```

Conformément à la règle 9, un `empty` absent n'est **pas** remplacé par une valeur de repli inventée
dans le composant : la section est alors omise, comme aujourd'hui. C'est un manque de contenu à
corriger dans `content/`, pas un cas à rattraper dans le code.

### 2.4 Quel motif signature ? — **Le point.** Hypothèse retenue, et systématisée.

Il existe déjà, seul, dans `.wordmark-dot` : le seul élément distinctif du dépôt. On en fait un
système de cinq déclinaisons (§8). Un seul ornement, décliné partout, coûte zéro à produire et se
reconnaît de loin — ce qu'aucune illustration achetée ne ferait.

### 2.5 Mode sombre ? — **Non en V1.** Mais le mécanisme est construit.

Ni sur `pulsacity.com`, ni sur les sites livrés.

**Pourquoi non :** le fond papier chaud **est** l'identité ; un thème sombre la dilue et double la
relecture des contrastes. Et les captures de la vitrine sont des sites _clients_, qui sont clairs :
une page sombre autour d'une capture claire se lit comme une visionneuse, pas comme une page.

**Pourquoi le mécanisme existe quand même :** les jetons sont **redéclarés par contexte**. Le
sélecteur `.surface-inverted` redonne une valeur à `--color-ink`, `--color-line`,
`--color-accent-ink` et aux autres. Aucun composant ne sait sur quelle surface il est posé :
`text-ink` s'écrit pareil des deux côtés.

C'est exactement le mécanisme qu'un thème sombre demanderait. Il est construit, il est testé, et il
sert **dès aujourd'hui** aux deux blocs encrés de la page. Ajouter un mode sombre plus tard ne
touchera aucun composant.

---

## 3. La palette

Un seul accent chromatique : le corail. Pas de couleur secondaire décorative. Chaque jeton porte un
rôle **et un interdit** — un jeton sans interdit finit par tout faire.

### 3.1 Sur papier

| Jeton                       | `oklch()`               | sRGB      | Rôle                                                                         | Jamais                                                            | Statut      |
| --------------------------- | ----------------------- | --------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- |
| `--color-ground`            | `oklch(0.985 0.004 85)` | `#fbfaf7` | Le papier. Fond de la page et de la plupart des sections.                    | sur une carte : une carte posée sur le papier doit s'en détacher. | conservé    |
| `--color-surface`           | `oklch(0.995 0.002 85)` | `#fefdfc` | La carte posée sur le papier : champ, encart.                                | en pleine largeur. `surface` ne fait pas une section.             | **corrigé** |
| `--color-surface-sunken`    | `oklch(0.965 0.006 85)` | `#f5f3ef` | L'encart creusé. Un seul par page : le prix.                                 | deux fois sur la même page.                                       | **nouveau** |
| `--color-surface-inverted`  | `oklch(0.22 0.012 55)`  | `#1f1915` | Le bloc encré : la réalisation, puis l'appel final.                          | en haut ni en bas du document, ni deux blocs voisins.             | **nouveau** |
| `--color-ink`               | `oklch(0.19 0.008 60)`  | `#171310` | Titres et texte courant.                                                     | en aplat de fond : l'aplat, c'est `surface-inverted`.             | conservé    |
| `--color-ink-muted`         | `oklch(0.48 0.008 60)`  | `#615d59` | Texte secondaire, paragraphes d'accompagnement.                              | pour un titre.                                                    | conservé    |
| `--color-ink-faint`         | `oklch(0.55 0.008 60)`  | `#75716d` | Métadonnées, aide de saisie, texte de substitution.                          | plus clair : c'est le plancher du texte.                          | **relevé**  |
| `--color-line`              | `oklch(0.91 0.005 70)`  | `#e3e1de` | Le filet qui sépare, et rien d'autre.                                        | en bordure de contrôle : 1,25:1, il n'informe pas.                | conservé    |
| `--color-line-strong`       | `oklch(0.635 0.008 70)` | `#8e8a85` | La bordure d'un contrôle : champ, case, bouton secondaire, cadre de capture. | en séparateur de section.                                         | **relevé**  |
| `--color-accent`            | `oklch(0.58 0.19 32)`   | `#d33e25` | L'aplat corail : bouton principal, et le point.                              | en couleur de texte sur le papier (4,49:1).                       | conservé    |
| `--color-accent-hover`      | `oklch(0.52 0.19 32)`   | `#be260b` | Le même aplat au survol et à l'appui.                                        | au repos.                                                         | conservé    |
| `--color-accent-ink`        | `oklch(0.42 0.14 32)`   | `#892312` | Le corail lisible : lien, badge, chiffre mis en avant.                       | en aplat de fond.                                                 | conservé    |
| `--color-accent-soft`       | `oklch(0.96 0.02 40)`   | `#ffeee8` | Le fond d'un badge, l'anneau de focus.                                       | en fond de section.                                               | **corrigé** |
| `--color-accent-foreground` | `oklch(0.99 0 0)`       | `#fcfcfc` | Le libellé posé sur `accent`.                                                | sur le papier.                                                    | conservé    |
| `--color-danger`            | `oklch(0.51 0.18 27)`   | `#b72725` | Le message d'erreur d'un formulaire.                                         | pour attirer l'œil ailleurs.                                      | conservé    |
| `--color-success`           | `oklch(0.52 0.11 155)`  | `#267b4c` | La confirmation d'un envoi.                                                  | comme seconde couleur décorative.                                 | **nouveau** |

**Les quatre changements, et leur raison.**

- **`surface` était `oklch(1 0 0)`** — du blanc pur, écrit juste sous un commentaire qui promet
  « No pure #fff, no pure #000 ». Contre un papier chaud, le blanc pur vire au bleu. La nouvelle
  valeur garde la chroma du papier, une lueur plus haut.
- **`ink-faint` était `0.63`**, soit **3,36:1** sur le papier — sous le plancher de 4,5:1 alors que
  le jeton porte déjà du texte : la ville dans `templates/src/render.tsx`, l'aide de
  `brief-form.tsx`, le texte de substitution de `ui/input.tsx`. Relevé à `0.55` → **4,64:1**.
- **`line-strong` était `0.84`**, soit **1,56:1** — or c'est la bordure du champ de saisie, de la
  case à cocher, du bouton secondaire et du cadre de capture. Une bordure qui délimite un contrôle
  demande 3:1 (WCAG 1.4.11). Relevé à `0.635` → **3,29:1 sur le papier, 3,38:1 sur `surface`,
  3,09:1 sur `surface-sunken`** : la valeur est choisie pour passer sur les trois surfaces claires,
  pas seulement sur le papier.
- **`accent-soft` était `oklch(0.96 0.03 40)`**, **hors du gamut sRGB** : le navigateur l'écrêtait à
  `#ffece3`, donc la valeur déclarée n'était pas celle affichée. Chroma ramenée à `0.02`.

### 3.2 Sur encre — les mêmes noms, d'autres valeurs

```css
.surface-inverted {
  --color-ground: oklch(0.22 0.012 55); /* #1f1915 */
  --color-surface: oklch(0.27 0.013 55); /* #2c2520 */
  --color-ink: oklch(0.97 0.004 85); /* #f6f5f2 */
  --color-ink-muted: oklch(0.74 0.008 70); /* #aeaaa5 */
  --color-ink-faint: oklch(0.62 0.008 70); /* #898581 */
  --color-line: oklch(0.32 0.012 55); /* #38312d */
  --color-line-strong: oklch(0.52 0.012 55); /* #6f6762 */
  --color-accent-ink: oklch(0.72 0.15 38); /* #f27f5c */
  --color-accent-soft: oklch(0.32 0.04 38); /* #452c24 */
  --color-danger: oklch(0.7 0.15 25); /* #ed756e */
  --color-success: oklch(0.75 0.13 155); /* #62c689 */
}
```

`--color-accent`, `--color-accent-hover` et `--color-accent-foreground` **ne sont pas redéclarés** :
le bouton plein est exactement le même objet sur le papier et sur l'encre. Sa surface fait 3,71:1
contre l'encre (plancher 3:1 pour un aplat porteur de sens) et son libellé 4,56:1.

### 3.3 Les contrastes mesurés

Chaque rapport est calculé depuis la valeur `oklch()` convertie en sRGB, puis arrondi au centième
vers le bas. **Aucune paire n'est sous son plancher.**

**Sur papier** — plancher 4,5:1 pour du texte, 3:1 pour une bordure de contrôle et un aplat
porteur de sens.

| Paire                                  | Mesuré  | Min | Usage                                           |
| -------------------------------------- | ------- | --- | ----------------------------------------------- |
| `ink` sur `ground`                     | 17,69:1 | 4,5 | Titres et texte courant                         |
| `ink-muted` sur `ground`               | 6,25:1  | 4,5 | Texte secondaire                                |
| `ink-faint` sur `ground`               | 4,64:1  | 4,5 | Métadonnées, aide de saisie                     |
| `ink` sur `surface`                    | 18,18:1 | 4,5 | Texte sur une carte                             |
| `ink-muted` sur `surface`              | 6,42:1  | 4,5 | Secondaire sur une carte                        |
| `ink-faint` sur `surface`              | 4,76:1  | 4,5 | Texte de substitution d'un champ                |
| `ink` sur `surface-sunken`             | 16,66:1 | 4,5 | Le bloc prix                                    |
| `ink-muted` sur `surface-sunken`       | 5,89:1  | 4,5 | Le bloc prix, secondaire                        |
| `accent-foreground` sur `accent`       | 4,56:1  | 4,5 | Libellé du bouton plein                         |
| `accent-foreground` sur `accent-hover` | 5,90:1  | 4,5 | Bouton plein, au survol                         |
| `accent-ink` sur `ground`              | 8,70:1  | 4,5 | Lien corail                                     |
| `accent-ink` sur `surface`             | 8,94:1  | 4,5 | Lien sur une carte                              |
| `accent-ink` sur `accent-soft`         | 8,06:1  | 4,5 | Badge « En préparation »                        |
| `danger` sur `ground`                  | 6,04:1  | 4,5 | Message d'erreur                                |
| `success` sur `ground`                 | 5,00:1  | 4,5 | Message d'envoi                                 |
| `line-strong` sur `ground`             | 3,29:1  | 3   | Bordure de champ, de case, de bouton secondaire |
| `line-strong` sur `surface`            | 3,38:1  | 3   | Bordure de champ sur une carte                  |
| `line-strong` sur `surface-sunken`     | 3,09:1  | 3   | Bordure dans l'encart prix                      |
| `accent` sur `ground`                  | 4,49:1  | 3   | Surface du bouton plein                         |
| `surface-inverted` sur `ground`        | 16,65:1 | 3   | Le bloc encré posé sur le papier                |

**Sur encre**

| Paire                            | Mesuré  | Min | Usage                   |
| -------------------------------- | ------- | --- | ----------------------- |
| `ink` sur `ground`               | 15,94:1 | 4,5 | Titre sur l'encre       |
| `ink-muted` sur `ground`         | 7,53:1  | 4,5 | Texte secondaire        |
| `ink-faint` sur `ground`         | 4,75:1  | 4,5 | Métadonnées             |
| `accent-ink` sur `ground`        | 6,59:1  | 4,5 | Lien corail sur l'encre |
| `accent-foreground` sur `accent` | 4,56:1  | 4,5 | Libellé du bouton plein |
| `ink` sur `surface`              | 13,83:1 | 4,5 | Texte sur une carte     |
| `accent-ink` sur `accent-soft`   | 4,86:1  | 4,5 | Badge sur l'encre       |
| `danger` sur `ground`            | 6,10:1  | 4,5 | Erreur                  |
| `success` sur `ground`           | 8,24:1  | 4,5 | Envoi confirmé          |
| `accent` sur `ground`            | 3,71:1  | 3   | Surface du bouton plein |
| `line-strong` sur `ground`       | 3,14:1  | 3   | Bordure de contrôle     |

**Le plancher, en une phrase :** 4,5:1 pour tout texte, 3:1 pour une bordure qui délimite un
contrôle et pour un aplat porteur de sens. Une paire absente de ces deux tableaux n'a pas le droit
d'exister dans un composant : on l'ajoute ici, mesurée, ou on ne l'emploie pas.

---

## 4. La typographie

Fraunces dit qui parle ; Manrope fait lire. Deux familles, jamais trois, toutes deux variables et
en sous-jeu latin seul.

### 4.1 Ce qui est réellement chargé

```ts
// apps/corporate/src/app/layout.tsx
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT'],
});
```

Deux fichiers variables, rien d'autre. `WONK` reste à sa valeur par défaut (0) : l'axe n'est pas
demandé, donc pas téléchargé. Réglage de la marque, posé une fois sur la classe qui porte Fraunces :

```css
font-variation-settings:
  'SOFT' 30,
  'WONK' 0;
font-optical-sizing: auto; /* défaut du navigateur : l'axe opsz suit la taille */
```

**Graisses employées** — Fraunces : 500, et rien d'autre. Manrope : 400, 500, 600 ; ni 700 ni 800.
Aucune coupe statique n'est chargée en plus.

### 4.2 L'échelle

| Jeton             | Bureau           | Mobile           | Interligne | Approche | Graisse | Famille            | Où                                               |
| ----------------- | ---------------- | ---------------- | ---------- | -------- | ------- | ------------------ | ------------------------------------------------ |
| `--text-display`  | 4.5rem / 72px    | 2.75rem / 44px   | 1.02       | −0.02em  | 500     | Fraunces           | Le `h1`. Un seul par page.                       |
| `--text-figure`   | 3.5rem / 56px    | 2.5rem / 40px    | 1.0        | −0.02em  | 500     | Fraunces           | Le prix. Le seul chiffre mis en scène.           |
| `--text-title`    | 2.5rem / 40px    | 1.75rem / 28px   | 1.12       | −0.015em | 500     | Fraunces           | Le `h2` de chaque section.                       |
| `--text-subtitle` | 1.375rem / 22px  | 1.25rem / 20px   | 1.3        | −0.01em  | 600     | Manrope            | Le `h3` : titre de bloc, question de FAQ, étape. |
| `--text-lead`     | 1.1875rem / 19px | 1.125rem / 18px  | 1.6        | 0        | 400     | Manrope            | Le paragraphe du hero, l'intro d'une section.    |
| `--text-body`     | 1.0625rem / 17px | 1rem / 16px      | 1.65       | 0        | 400     | Manrope            | Tout le texte courant.                           |
| `--text-body-sm`  | 0.9375rem / 15px | 0.875rem / 14px  | 1.55       | 0        | 400     | Manrope            | Légende, mention légale, aide de formulaire.     |
| `--text-caption`  | 0.8125rem / 13px | 0.8125rem / 13px | 1.45       | 0.01em   | 500     | Manrope            | Métadonnée sous une capture (`secteur · ville`). |
| `--text-eyebrow`  | 0.75rem / 12px   | 0.75rem / 12px   | 1.2        | 0.14em   | 600     | Manrope, capitales | Sur-titre de section, badge « En préparation ».  |

**Les deux écarts avec le dépôt, et leur raison.**

- **`display` sur mobile : 3.25rem → 2.75rem.** Fraunces a une chasse plus large que Manrope à
  taille égale. À 52 px, « Votre site, fait pour vous. » laisse « vous. » seul sur sa dernière ligne
  dans une colonne de 327 px. 44 px tient la composition.
- **`title` sur mobile : 2rem → 1.75rem.** Même raison : « Questions fréquentes » à 32 px occupe
  presque toute la colonne et se coupe mal. 28 px respire.

Les valeurs bureau (`4.5rem`, `2.5rem`) et `--text-lead` sont **conservées telles quelles** : elles
sont justes.

**Fraunces ne descend jamais sous 20 px.** `--text-subtitle` et tout ce qui est plus petit est en
Manrope. C'est ce qui garantit la netteté sur un écran d'entrée de gamme, en plus de l'axe optique.

---

## 5. Le rythme

### 5.1 Les mesures

| Jeton                   | Valeur              | Note                                                                                                  |
| ----------------------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| `--spacing`             | `0.5rem`            | La grille : 8 px. Toute dimension en est un multiple, sauf les filets (1 px) et les tailles de texte. |
| `--width-prose`         | `34rem`             | Mentions légales, réponse de FAQ. Environ 68 signes à 17 px.                                          |
| `--width-narrow`        | `48rem`             | Formulaires, encart prix, sections de texte seul. Conservé (`max-w-3xl`).                             |
| `--width-wide`          | `64rem`             | La page. Conservé (`max-w-5xl`).                                                                      |
| `--space-gutter`        | `1.5rem` / `2rem`   | Marge latérale, mobile puis bureau. `1rem` était trop court sous un titre de 44 px.                   |
| `--space-section`       | `5rem` / `7.5rem`   | Respiration verticale d'une section.                                                                  |
| `--space-section-tight` | `3rem` / `4rem`     | Les sections brèves : « À venir », le pied de page.                                                   |
| `--space-title`         | `2.5rem` / `3.5rem` | Du titre de section à son contenu.                                                                    |

### 5.2 La règle d'alternance

Le dépôt pose aujourd'hui **toutes** ses sections sur le même fond, séparées par un filet :
`border-t` huit fois de suite. C'est propre et c'est muet. Trois surfaces et une partition fixe
suffisent à donner un relief à la page, sans une image de plus.

1. **Au plus deux blocs encrés par page**, jamais voisins, et toujours les deux mêmes rôles : ce
   qu'on vend (la réalisation), puis la sortie (l'appel à l'action).
2. **Un filet ne sépare que deux sections posées sur la même surface.** Un changement de surface
   _est_ la séparation ; y ajouter un filet, c'est faire deux fois le même travail.
3. **`surface` ne prend jamais la pleine largeur.** C'est ce qui pose une carte sur le papier,
   jamais ce qui fait une section.
4. **`surface-sunken` : un seul encart par page**, le prix, sur `--width-narrow`.
5. **Le document commence et finit sur le papier.** Un bloc encré ne touche jamais le bord haut ni
   le bord bas.

### 5.3 La partition de `creation-de-sites.json`

| Section      | Surface            | Filet au-dessus | Pourquoi                                                           |
| ------------ | ------------------ | --------------- | ------------------------------------------------------------------ |
| `hero`       | `ground`           | non             | C'est le haut du document.                                         |
| `features`   | `ground`           | **oui**         | Même surface que la section précédente.                            |
| `showcase`   | `surface-inverted` | non             | Bloc encré n° 1. Le changement de surface sépare.                  |
| `steps`      | `ground`           | non             | On sort d'une autre surface.                                       |
| `pricing`    | `surface-sunken`   | non             | L'encart creusé, sur `--width-narrow`. Il ne touche pas les bords. |
| `faq`        | `ground`           | **oui**         | L'encart est posé sur le papier : on n'a pas changé de sol.        |
| `cta`        | `surface-inverted` | non             | Bloc encré n° 2 : la sortie.                                       |
| `à venir`    | `ground`           | **oui**         | —                                                                  |
| pied de page | `ground`           | **oui**         | Le document finit sur le papier, comme il a commencé.              |

Le pied de page passe de `bg-surface` à `ground` : l'appel final en encre doit rester la dernière
note forte, et le pied doit s'effacer derrière lui.

---

## 6. Le logotype

**Construction.** PULSACITY en Manrope 600, capitales, approche `0.2em`. Le bas-de-casse n'existe
pas.

**Le point n'est pas un caractère.** Le dépôt écrit aujourd'hui un « . » de Manrope, dont la taille
suit la graisse et dont l'alignement suit la fonte : il ne se règle pas. Il est remplacé par un
`<span>` dont les dimensions sont exprimées en `em` :

- diamètre `0.18em` de la hauteur de capitale ;
- écart `0.10em` après le Y ;
- posé sur la ligne de base.

| Point           | Valeur                                                                              |
| --------------- | ----------------------------------------------------------------------------------- |
| Taille minimale | **12 px.** En dessous, l'approche de `0.2em` désagrège le mot : on emploie l'icône. |
| Zone de respect | Une hauteur de capitale sur les quatre côtés. Rien n'y entre, pas même un filet.    |
| Sur papier      | `ink` + point `accent`.                                                             |
| Sur encre       | Les mêmes jetons, redéclarés : le mot s'éclaircit, le point ne change pas.          |
| Interdits       | Sur une photo, sur un aplat corail, incliné, détouré, ou avec un second point.      |
| Pulsation       | **Une seule par page**, dans l'en-tête. Le mot-symbole du pied de page est fixe.    |

### 6.1 L'icône carrée

**Construction : le logotype ramené à sa première lettre et à son point.**

- Carré `--color-surface-inverted`, rayon `12/64` de la largeur.
- La lettre **P** en Fraunces 500 (`SOFT 30`, `opsz 144`), en `ink` inversé (`#f6f5f2`), 15,94:1.
- Le point corail (`accent`), diamètre `8/64`, posé sur la ligne de base à droite du P. 3,71:1
  contre le carré.
- **Sous 32 px, le point disparaît et le P passe en corail** : à cette échelle un disque de 2 px se
  lit comme une poussière.

L'icône actuelle (`apps/corporate/src/app/icon.svg`) est un carré **bleu `#2a4a9c`** : une couleur
qui n'existe dans aucun jeton, écrite à la main dans un fichier. Elle ne vient de rien et n'annonce
rien. Elle est remplacée.

---

## 7. Le motif signature — le point

| #   | Déclinaison           | Spécification                                                                                                                                     |
| --- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **La pulsation**      | 2,4 s, `ease-in-out`, infini. Opacité 1 → 0,45, échelle 1 → 0,82. Une seule occurrence : l'en-tête.                                               |
| 2   | **La puce**           | Un disque corail de 5 px remplace `list-disc`, remonté de 2 px pour s'asseoir sur la ligne d'x.                                                   |
| 3   | **Le point final**    | Chaque titre de section se termine par un point corail.                                                                                           |
| 4   | **Le fil des étapes** | Un filet vertical relie les étapes ; chaque étape est marquée par un disque de 9 px. Le numéro disparaît — la position dans la liste le dit déjà. |
| 5   | **Le sur-titre**      | Le sur-titre est précédé d'un disque de 5 px.                                                                                                     |

**La règle qui tient l'ensemble : un seul point corail par coup d'œil.** Deux points dans le même
bloc et le motif cesse d'être une signature, il devient de la décoration. Elle tranche les
collisions : sur-titre présent, le titre perd son point ; liste à puces dans une section, les puces
l'emportent sur le point final.

**Jamais** de point dans un bouton — le bouton est déjà corail. Jamais de point décoratif entre deux
paragraphes. Jamais en série de trois.

**Note d'implémentation (déclinaison 3).** Le point final est **coloré** par le composant, jamais
ajouté par le contenu : `content/` écrit « Comment ça se passe » et le rendu met en corail le point
terminal s'il existe. Un titre sans point dans le contenu n'en reçoit pas — la règle 9 interdit
d'inventer ce que le contenu ne dit pas.

---

## 8. L'iconographie

`lucide-react` est déjà installé.

- **Épaisseur de trait : 1.5.** Le 2 par défaut est trop lourd à côté de Manrope 400 et d'un serif.
- **Taille : 20 px** en ligne avec du texte, **24 px** isolée. Jamais plus : une icône n'est jamais
  un élément de titre.
- **Couleur : `currentColor`, toujours.** En pratique, deux seulement : `ink-muted` (fonctionnel) ou
  `accent` (un état).

**Les cinq usages permis. La liste est close ; en ajouter un, c'est modifier la charte.**

1. Le chevron d'un `<details>` de FAQ — il dit qu'on peut ouvrir, le texte ne le dit pas.
2. La marque de lien externe après « Voir le site » — elle prévient qu'un onglet s'ouvre.
3. L'état d'un formulaire : envoyé, ou en erreur. Deux icônes, deux jetons de couleur.
4. Le téléphone et l'enveloppe du pied de page — la forme distingue les deux lignes plus vite que le
   mot.
5. La fermeture de la bannière de démo — un bouton sans libellé a besoin d'une forme, et d'un
   `aria-label`.

**Jamais** à côté d'un titre de section, à côté d'un titre de bloc (« Vos mots », « Votre image »),
en puce — c'est le rôle du point — ni en ornement. Une icône décorative à côté de chaque titre est
un réflexe d'agence, pas une décision. Une icône qui ne dit rien que le texte ne dise déjà, on
l'enlève.

---

## 9. L'image

**Les seules images du site sont des captures de sites réellement livrés.** Aucune photo d'ambiance,
aucune illustration, aucun rendu 3D.

- **Deux captures par site** : mobile 390 × 844, bureau 1280 × 800, toutes deux en @2x
  (`pnpm showcase:shots`).
- **Toujours le haut de page, coupé net** à la hauteur de la fenêtre. Jamais un assemblage de
  défilement.
- **La mobile est la principale** ; la bureau ne sert que si aucune mobile n'existe.
- **Le cadre** : un filet `line`, 8 px de marge intérieure, rayon `--radius-phone` (téléphone) ou
  `--radius-lg` (bureau). **Aucune ombre.**
- **Posée sur l'encre**, la capture devient l'objet le plus clair de la page. C'est voulu : le
  produit est ce qui brille.
- **Légende** : le nom, `secteur · ville`, le lien. Jamais un avis, jamais un chiffre.

**Jamais** : chrome de navigateur, barre d'adresse, curseur, main, bureau, perspective, reflet, ni
biseau d'appareil autre que ce cadre.

**L'image de partage (OG)** est une composition typographique, jamais une photo. Voir §11 pour la
contrainte de jetons qui s'y applique.

---

## 10. Le mouvement

| Règle                          | Chiffres                              | Détail                                                                                                                                               |
| ------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Le point bat.**              | 2,4 s · `ease-in-out` · infini        | Opacité 1 → 0,45, échelle 1 → 0,82. La seule animation autonome de la page, et une seule occurrence : l'en-tête.                                     |
| **Les sections montent.**      | `entry 0% → 40%` · `translateY` 12 px | Piloté par le défilement (`animation-timeline: view()`). **Sur le bloc de section, jamais sur chaque enfant.**                                       |
| **Tout le reste dure 150 ms.** | `cubic-bezier(.2, 0, 0, 1)`           | Et ne touche que `color`, `background-color`, `border-color`, `opacity`. Pas de `transform` au survol, pas d'agrandissement, pas d'ombre qui gonfle. |

Jetons : `--duration-fast: 150ms`, `--duration-pulse: 2400ms`, `--ease-out: cubic-bezier(0.2, 0, 0, 1)`.

`prefers-reduced-motion: reduce` arrête **tout**, le point compris. Le dépôt le fait déjà ; la
charte le rend obligatoire pour toute animation ajoutée ensuite.

---

## 11. Do / Don't

Aucune des six erreurs n'est inventée pour l'exemple : chacune est à la ligne indiquée, aujourd'hui,
dans le dépôt.

| #   | Sujet                                                                                            | À éviter                                                                                                                                                                  | À faire                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Séparer** — `sections/section-shell.tsx:22`                                                    | Huit sections sur le même fond, huit `border-t`. La page devient une liste : rien n'avance, rien ne conclut.                                                              | Le changement de surface sépare. Le filet ne sert plus qu'entre deux sections de même sol — il redevient lisible parce qu'il est rare. |
| 2   | **La surface blanche** — `packages/design/src/tokens.css:11`                                     | `--color-surface: oklch(1 0 0)`, du blanc pur, juste sous un commentaire qui promet « no pure #fff ». Contre un papier chaud, il vire au bleu.                            | `oklch(0.995 0.002 85)` : la chroma du papier, une lueur plus haut. La carte se détache sans changer de température.                   |
| 3   | **Le point** — `site-header.tsx` · `site-footer.tsx`                                             | Le mot-symbole est employé deux fois et `.wordmark-dot` anime les deux. Deux pulsations sur un même écran : le motif n'est plus une signature, c'est un tic.              | Une seule pulsation, dans l'en-tête. Le mot-symbole du pied garde son point, fixe.                                                     |
| 4   | **La révélation** — `steps.tsx:15` · `coming-lines.tsx:13` · `showcase.tsx:24`                   | `.reveal` sur chaque `<li>` : quatre à huit éléments qui montent en cascade. On regarde l'animation, plus le texte.                                                       | `.reveal` sur le bloc de section, une fois. Le contenu arrive d'un seul tenant : une page qui se pose, pas un diaporama.               |
| 5   | **L'icône et les couleurs écrites à la main** — `app/icon.svg` · `app/opengraph-image.tsx:10-12` | Un carré bleu absent de tout jeton, et trois hexadécimaux recopiés dans l'image de partage — dont un corail (`#e2603c`) qui n'est pas le corail de la marque (`#d33e25`). | L'icône sort du logotype et ne connaît que des jetons. Pour l'image OG, voir ci-dessous.                                               |
| 6   | **L'état vide** — `sections/showcase.tsx:17`                                                     | `if (cards.length === 0) return null` : la section disparaît, la page perd son argument principal, et deux filets se retrouvent collés.                                   | Un bloc encré qui dit franchement qu'aucun site n'est publié et nomme les pages à venir. La zone garde sa hauteur.                     |

### Le cas de l'image OG

`opengraph-image.tsx` s'exécute dans un runtime qui ne lit pas le CSS : il **ne peut pas** consommer
`tokens.css`. La contrainte de la règle 10 y est donc tenue autrement — par un test, pas par un
espoir : le test parse `packages/design/src/tokens.css`, convertit chaque `oklch()` en sRGB, et
**échoue si une constante de `opengraph-image.tsx` ou de `icon.svg` ne correspond pas au jeton
qu'elle prétend reprendre.**

---

## 12. Ce que la suite doit tenir

Ce document fige les décisions ; `02-design-tokens` écrit `packages/design/src/tokens.css` et le
test qui tient la règle 10. Ce test doit, au minimum :

1. **Interdire toute couleur littérale** (`#…`, `rgb(`, `hsl(`) dans `apps/corporate/src/**` et
   `packages/templates/src/**`, à la seule exception de `opengraph-image.tsx` et `icon.svg`, dont
   les constantes sont comparées aux jetons.
2. **Vérifier que chaque `--color-*` employé par un composant existe** dans `tokens.css`.
3. **Recalculer les contrastes** depuis `tokens.css` et échouer si une paire des tableaux du §3.3
   passe sous son plancher.

C'est le troisième point qui compte : il transforme la charte en test. Une valeur de jeton modifiée
sans mesure fait échouer `pnpm test`, et la règle cesse de dépendre de la vigilance de qui relit.
