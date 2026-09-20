# 00 — Contexte PULSACITY

> **À coller en tête de chaque prompt du kit.** Sans ce bloc, la marque est réinventée à
> chaque conversation. Avec lui, deux prompts lancés à trois semaines d'intervalle rendent
> le même produit.

---

Tu travailles sur **PULSACITY**, un monorepo TypeScript. Voici tout ce que tu dois savoir
avant de dessiner ou d'écrire une ligne de code.

## Le produit

Une personne seule construit des sites vitrines pour des artisans et des commerçants
français. Une offre est live aujourd'hui, **création de sites** :

- un site vitrine de cinq pages, textes rédigés, photos, demande de devis et prise de
  rendez-vous en ligne ;
- nom de domaine au nom du client, hébergement et certificat SSL compris la première année ;
- **500 € HT, prix unique** : pas de remise, pas d'option, pas de code promo ;
- puis 99 € HT par an pour rester en ligne, 49 € HT la modification ;
- appel sous 24 h après la demande, mise en ligne sous 72 h après le paiement.

Le parcours : le prospect décrit son activité en trois minutes → il est rappelé sous 24 h →
il reçoit son site **par SMS, sur son téléphone** → il regarde, demande des corrections →
il paie → mise en ligne.

L'argument central est visuel : **on voit son site avant de payer.**

Deux autres lignes sont annoncées sans autre promesse qu'une phrase : `pulsa-store` et
`logiciels-metier`.

L'acheteur type a plus de 40 ans, consulte sur téléphone, n'a pas de vocabulaire technique,
et se méfie des agences. Il ne cherche pas une plateforme. Il cherche quelqu'un.

## Le socle — la règle d'architecture qui prime sur tout

**La page ne connaît aucune offre.** Elle rend des fichiers de contenu :

```
apps/corporate/content/
  site.json               marque, prénom du fondateur, contact, liens légaux
  lines/<slug>.json       une ligne commerciale : titre, phrase, prix, sections
  showcase.json           les sites réellement livrés (vide aujourd'hui)
  legal/*.md              mentions légales, confidentialité, CGV
```

Une ligne `live` est **une suite de sections typées**. Le code sait rendre des _types_ de
section ; il ignore ce qui est vendu :

| Type       | Contenu                                                 |
| ---------- | ------------------------------------------------------- |
| `hero`     | `title`, `text`, `primary`, `secondary?`                |
| `features` | `title?`, `items[] { title, text }`                     |
| `showcase` | `title` — rend `showcase.json`, disparaît s'il est vide |
| `steps`    | `title`, `items[] { title, text }`                      |
| `pricing`  | `title`, `headline`, `text`, `action`                   |
| `faq`      | `title`, `items[] { question, answer }`                 |
| `cta`      | `title`, `text`, `action`                               |

Une ligne `coming` se limite à sa phrase : le schéma refuse qu'elle ait des sections.

**Si tu te surprends à écrire un nom d'offre, un prix ou un argument de vente dans un
composant, c'est que la chose appartient à `content/`.** Un composant reçoit du texte, il
n'en produit pas.

## La pile technique

Next.js 15 (App Router, composants serveur par défaut), React 19, Tailwind CSS v4,
TypeScript strict, pnpm workspaces.

```
apps/corporate/            la page pulsacity.com, l'hôte demo.pulsacity.com, Stripe
  src/app/                 routes, globals.css, opengraph-image.tsx, icon.svg
  src/components/          sections/, ui/, site-header, site-footer, phone-frame…
  content/                 le contenu, ci-dessus
packages/design/           src/tokens.css — la seule source du look
packages/templates/        le gabarit du site livré au client + le contrat SiteContent
packages/db/               Drizzle + Supabase
```

Tailwind v4 n'a pas de fichier de configuration : les jetons sont déclarés en CSS dans un
bloc `@theme`, et Tailwind en dérive les utilitaires. `--color-ink` donne `text-ink`,
`bg-ink`, `border-ink` ; `--text-title` donne `text-title`.

## Les jetons existants

`packages/design/src/tokens.css`, dans son état actuel :

```css
@theme {
  --color-ground: oklch(0.985 0.004 85); /* fond papier chaud */
  --color-surface: oklch(1 0 0);
  --color-ink: oklch(0.19 0.008 60); /* texte, quasi-noir chaud */
  --color-ink-muted: oklch(0.48 0.008 60);
  --color-ink-faint: oklch(0.63 0.008 60);
  --color-line: oklch(0.91 0.005 70);
  --color-line-strong: oklch(0.84 0.006 70);

  --color-accent: oklch(0.58 0.19 32); /* corail — le « pulse » */
  --color-accent-hover: oklch(0.52 0.19 32);
  --color-accent-soft: oklch(0.96 0.03 40);
  --color-accent-ink: oklch(0.42 0.14 32); /* corail lisible sur fond clair */
  --color-accent-foreground: oklch(0.99 0 0);
  --color-danger: oklch(0.51 0.18 27);

  --font-sans: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;

  --text-display: 3.25rem; /* 4.5rem ≥ 40rem */
  --text-title: 2rem; /* 2.5rem ≥ 40rem */
  --text-lead: 1.1875rem;

  --spacing: 0.5rem; /* grille de 8 px */
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --shadow-subtle: 0 1px 2px oklch(0.19 0.008 60 / 0.05);
}
```

Deux choses à ne pas défaire sans mesurer :

- `--color-accent` à **L = 0.58** est le corail le plus clair qui porte encore du texte
  blanc à 4.5:1. Une valeur plus claire casse le niveau AA.
- Ni blanc pur ni noir pur. Le fond est un papier chaud, le texte un encre chaude.

## Les dix règles non négociables

Extraites de `CLAUDE.md`. Un livrable qui en enfreint une est refusé, si beau soit-il.

1. **Interface en français, code en anglais.** Tout texte affiché est en français :
   vouvoiement, première personne du singulier, phrases courtes, sobre, concret.
   Identifiants, noms de fichiers, commentaires, commits : en anglais.
2. **Montants en centimes**, toujours (`priceHtCents`). Jamais de flottant pour de l'argent.
3. **Fuseau `Europe/Paris`** à l'affichage, stockage en UTC.
4. **Aucune clé en dur.** Tout secret passe par une variable d'environnement.
5. **`pnpm lint && pnpm typecheck && pnpm test` doit passer** avant tout commit.
6. **Une démo, un site ou une référence ne vient que de données réelles.** Aucune capture
   inventée, aucun logo fictif, aucun avis écrit pour l'exemple.
7. **Le prix vit dans le fichier de la ligne** et se lit côté serveur. Un seul prix, pas de
   remise, pas d'option.
8. **Les démos sont toujours `noindex`.** Seul `pulsacity.com` est indexable.
9. **Aucun texte non remplacé.** Un test échoue si un `{{...}}` atteint le rendu. Une ligne
   dont la variable est vide est **omise**, jamais remplie par une valeur inventée.
10. **Le design ne se change qu'en changeant les jetons de `packages/design`.** Aucune
    couleur, aucune taille de police, aucun rayon, aucune durée en dur dans un composant.

## Interdits de rédaction

Statistiques ou chiffres absents du contexte produit. Superlatifs. Entreprises, clients ou
avis inventés. Et, littéralement, les mots **garantie**, **assurance**, **assistance**,
**couverture**.

Pas de « leader », pas de « +300 clients satisfaits », pas de « 98 % de satisfaction », pas
de logos de clients que personne n'a signés.

## Deux formats de livrable

Chaque prompt te dira lequel il attend.

**Maquette** — un fichier HTML autonome, jugeable dans le navigateur. Contraintes :

- une seule balise `<style>`, aucun CDN, aucune dépendance ;
- toutes les couleurs, tailles, rayons et durées déclarés en variables CSS **portant
  exactement les noms de jetons du dépôt** (`--color-ink`, `--radius-lg`…), puis utilisés
  via `var()`. Pas une seule valeur en dur dans le corps du document ;
- tout nouveau jeton est listé à part, avec sa valeur et la raison de son existence ;
- du contenu **réel**, repris des fichiers `content/` — jamais de faux client ;
- `color-scheme` déclaré explicitement, pour qu'un navigateur en mode sombre n'inverse rien ;
- lisible à 375 px de large comme à 1440 px.

**Code** — des fichiers réels du monorepo, aux chemins exacts, dans le style du dépôt :
composants serveur par défaut, `'use client'` seulement s'il le faut, `cn()` pour composer
les classes, commentaires en anglais et rares, un commentaire n'explique que ce que le code
ne dit pas.

## Le ton, en une ligne

Quelqu'un qui fait bien son travail et le dit simplement. Pas une agence. Pas une startup.
