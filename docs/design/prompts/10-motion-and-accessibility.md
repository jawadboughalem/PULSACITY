# 10 — Mouvement, accessibilité, performance

> Prérequis : `00-context.md`, `01`, `02`.
> Livrable : **code** — `packages/design`, `globals.css`, et les composants concernés.
> À passer une fois que `03` à `07` ont produit quelque chose à mettre en mouvement.

---

## Ton rôle

Tu règles les trois qualités qui ne se voient que lorsqu'elles manquent. Le dépôt part de
haut : ne casse rien en ajoutant de la vie.

## L'existant

Dans `apps/corporate/src/app/globals.css` :

```css
@keyframes pulsacity-pulse {
  /* le point du logotype, 2.4s, en boucle */
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: reveal-rise linear both;
      animation-timeline: view();
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  /* défilement et battement coupés */
}
```

C'est bien fait : animations pilotées par le défilement, en CSS seul, sans JavaScript ;
dégradation propre sur les navigateurs sans `animation-timeline` ; préférence système
respectée. Trois défauts seulement :

1. **Les durées sont en dur** — `2.4s` ici, `duration-200` dans `sections/faq.tsx`. Elles
   doivent devenir des jetons (prompt `02`).
2. **`.reveal` est posée à la main** dans sept composants, sans règle écrite : personne ne
   sait ce qui doit apparaître et ce qui ne doit pas.
3. **`prefers-reduced-motion: reduce` coupe le battement et le défilement doux, mais pas
   `.reveal`** — la révélation n'est active que sous `no-preference`, ce qui est correct,
   mais la logique est éclatée entre trois blocs. Rassemble-la.

## Le système de mouvement à écrire

Pas un catalogue d'effets. Trois ou quatre règles, chacune avec sa raison.

- **Ce qui bouge tout seul.** Aujourd'hui, une seule chose : le point du logotype. C'est le
  bon nombre. Si la charte en ajoute, justifie.
- **Ce qui apparaît au défilement.** Écris la règle : quelles sections, à quelle amplitude,
  et surtout **ce qui n'apparaît jamais** — rien au-dessus de la ligne de flottaison. Le
  dépôt a déjà corrigé ce défaut une fois : une révélation sur un contenu déjà visible
  produit un demi-fondu figé, que Lighthouse échantillonne en pleine transition.
- **Ce qui réagit au doigt.** Survol, focus, pression, ouverture d'un `<details>`. Deux
  durées suffisent : une rapide pour la couleur, une un peu moins pour la géométrie.
- **Ce qui ne bouge jamais.** Le texte à la lecture. Les prix. Les messages d'erreur, qui
  doivent être là instantanément.

Chaque durée et chaque courbe vient d'un jeton. `prefers-reduced-motion: reduce` doit tout
désactiver **en un seul endroit** : aujourd'hui la logique est éparpillée.

## L'accessibilité

Le dépôt annonce 96 en accessibilité sur Lighthouse, mobile et bureau. Objectif : 100, sans
tricher.

**Contraste** — chaque paire texte/fond est mesurée et écrite. 4.5:1 pour le texte courant,
3:1 pour le texte large et les bordures signifiantes. `--color-accent` est à L = 0.58 parce
que c'est le corail le plus clair qui porte du texte blanc à 4.5:1 : toute nouvelle couleur
subit la même vérification. `--color-ink-faint` (L = 0.63) ne passe pas 4.5:1 sur le fond
papier : dis explicitement où il a le droit de servir.

**Focus** — `:focus-visible { outline: 2px solid accent; offset: 2px }` est déjà global.
Vérifie qu'il reste visible sur fond encré, sur fond corail, et sur les cases à cocher
dessinées du prompt `03`. Il ne disparaît nulle part, jamais.

**Cibles tactiles** — 44 px au moins pour tout ce qui se touche. Les cases et boutons radio
du formulaire de brief sont à 16 px aujourd'hui.

**Structure** — un seul `h1`, ordre séquentiel, points de repère (`header`, `main`, `nav`,
`footer`) nommés quand il y en a plusieurs, un lien d'évitement vers le contenu s'il n'y en
a pas déjà un.

**Formulaires** — chaque champ a son étiquette, chaque erreur est liée par
`aria-describedby` et annoncée, `aria-invalid` posé sur le champ fautif, l'`autocomplete`
juste (il est déjà correct dans `brief-form.tsx`).

**Sans JavaScript** — toute la page, hors les deux formulaires, doit fonctionner. La FAQ en
`<details>` natifs et le formulaire en action serveur sont les bons choix : ne les remplace
pas par des composants pilotés par l'état.

**Zoom** — à 200 %, rien ne se coupe, rien ne déborde horizontalement.

**Lecteur d'écran** — le point du logotype est décoratif et déjà `aria-hidden`. Toute image
de capture porte une alternative qui dit **de qui** est le site, pas « capture d'écran ».

## La performance

Le score actuel est de 99 à 100 en mobile comme en bureau. C'est un actif : on ne le
dépense pas pour un effet.

- **Polices** — deux familles au plus, `display: swap`, sous-ensemble latin, et seulement
  les graisses réellement employées. Chaque graisse variable supplémentaire coûte.
- **Images** — toutes dimensionnées, en WebP, avec `sizes` juste. Aucune image décorative
  lourde.
- **Pas de JavaScript ajouté.** Les composants serveur restent la règle ; `'use client'` est
  une exception qui se justifie.
- **Aucune animation sur le plus grand élément de contenu visible**, ni sur quoi que ce soit
  qui déplace la mise en page après le premier rendu.
- **Aucun CDN, aucune dépendance nouvelle** pour un effet visuel.

## Contraintes non négociables

- Chaque durée, chaque courbe, chaque couleur vient d'un jeton.
- `prefers-reduced-motion: reduce` neutralise tout mouvement, depuis un seul endroit.
- Aucune régression sur les quatre scores Lighthouse.
- L'accessibilité ne se dégrade pas pour un effet, jamais.

## Critères d'acceptation

- [ ] Le système de mouvement tient en trois ou quatre règles écrites.
- [ ] Plus aucune durée ni courbe en dur dans un composant.
- [ ] La règle d'emploi de `.reveal` est écrite, et rien n'anime au-dessus de la ligne de
      flottaison.
- [ ] `prefers-reduced-motion` est traité en un seul endroit.
- [ ] Chaque paire texte/fond est mesurée et documentée ; aucune sous son seuil.
- [ ] Le focus est visible sur toutes les surfaces, y compris encrées.
- [ ] Aucune cible tactile sous 44 px.
- [ ] La page se parcourt entièrement au clavier, et sans JavaScript hors formulaires.
- [ ] Lighthouse : 100 en accessibilité, aucune baisse ailleurs.
