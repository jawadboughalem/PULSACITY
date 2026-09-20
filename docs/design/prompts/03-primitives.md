# 03 — Les primitives

> Prérequis : `00-context.md`, la charte de `01`, les jetons de `02`.
> Livrable : **maquette** (planche de composants) puis **code** dans
> `apps/corporate/src/components/ui/`.

---

## Ton rôle

Tu construis la boîte à outils : les briques que toutes les sections assemblent. Elles
doivent être ennuyeuses à utiliser et impossibles à mal utiliser.

## Ce qui existe, et ce qui manque

`apps/corporate/src/components/ui/` contient quatre fichiers — `button.tsx` (cva, quatre
variantes, trois tailles), `input.tsx`, `label.tsx`, `card.tsx` (une `div` bordée). Tout le
reste est improvisé sur place :

- le `<textarea>` de `brief-form.tsx` recopie à la main les classes de `Input` — deux champs
  qui doivent se ressembler et qui divergeront ;
- les cases à cocher et les boutons radio du même formulaire sont des `<input>` natifs en
  `size-4` avec `accent-[var(--color-accent)]` — une valeur arbitraire de plus, et une cible
  de 16 px pour un utilisateur de 55 ans qui remplit le formulaire au pouce ;
- `FieldError` et `Field` sont définis dans `brief-form.tsx`, donc invisibles pour
  `notify-form.tsx`, qui refait son erreur autrement ;
- trois pages — `not-found.tsx`, `demo-unavailable.tsx`, `commande-indisponible.tsx` —
  répètent le même bloc centré à trois hauteurs différentes (`min-h-[70vh]`, `min-h-[60vh]`) ;
- la pastille numérotée existe en `size-8` dans `sections/steps.tsx` et en `size-7` dans
  `merci/page.tsx` ;
- `Card` n'est utilisée nulle part, alors que quatre endroits dessinent une carte à la main.

## L'inventaire à livrer

Pour chaque primitive : l'API TypeScript, les variantes, **tous** les états, et le
comportement au clavier.

### Action

- **`Button`** — variantes `default`, `secondary`, `ghost`, `link`, `inverse` (sur fond
  encré) ; tailles `sm`, `default`, `lg`. États : repos, survol, focus visible, pressé,
  désactivé, **en cours** (le formulaire de brief affiche déjà « Envoi… » : l'état
  d'attente appartient au bouton, pas à l'appelant).
  Sur mobile, hauteur de cible d'au moins 44 px pour `default` et `lg`.
- **`ButtonLink`** — la même apparence pour un `next/link`. Aujourd'hui les appelants
  passent `buttonVariants()` à la main sur un `<Link>` : c'est le bon réflexe, mais il doit
  être nommé, pour que « un lien qui ressemble à un bouton » reste une décision et non une
  habitude.

### Saisie

- **`Field`** — étiquette, mention facultative, aide, message d'erreur, champ. Il câble
  `htmlFor`, `aria-describedby` et `aria-invalid`. Il sort de `brief-form.tsx` pour devenir
  partageable.
- **`Input`**, **`Textarea`** — mêmes bordures, mêmes rayons, mêmes états, par
  construction et non par copie.
- **`Checkbox`**, **`Radio`** — dessinés, pas natifs, mais bâtis **sur** l'input natif
  (l'input reste dans le DOM, visuellement masqué, pour garder le clavier, l'autofill et le
  formulaire sans JavaScript). Cible d'au moins 44 px, la totalité de l'étiquette
  cliquable, état focus visible sur le carré ou le rond, pas sur le texte.
- **`FieldError`** — `role="alert"`, une seule façon d'échouer dans tout le produit.
- **`Fieldset`** — légende traitée comme une étiquette, espacement identique à `Field`.

### Contenant

- **`Card`** — variantes `plain`, `outlined`, `inked`, `accent`. Densités `comfortable` et
  `compact`. Elle sert enfin.
- **`Callout`** — un encart d'information court. Tons `neutral`, `accent`, `danger`.
- **`Badge`** — pour « En préparation » de `sections/coming-lines.tsx`, aujourd'hui composé
  de six classes sur place.
- **`Bullet`** — la pastille numérotée ou pointée, **une seule taille**, qui remplace les
  deux d'aujourd'hui. C'est le motif signature de la charte : il mérite un composant.
- **`Divider`** — le filet, avec sa variante ornée du point si la charte en prévoit une.

### Mise en page

- **`Container`** — largeurs `page`, `prose`, `narrow`, issues des jetons. Plus aucun
  `max-w-*` choisi à vue dans une page.
- **`Stack`** ou l'équivalent : le rythme vertical vient d'un jeton, pas d'un `space-y-*`
  décidé au cas par cas.
- **`CenteredMessage`** — le bloc titre + texte + action des trois pages d'état, en un seul
  composant, une seule hauteur.

### Marque et produit

- **`Wordmark`** — le logotype et son point battant, tailles issues de la charte,
  variantes clair et encré. L'approche `tracking-[0.2em]` devient un jeton.
- **`PhoneFrame`** — existe déjà ; à reprendre selon la charte, rayons issus des jetons.
- **`BrowserFrame`** — à créer si la charte prévoit de montrer une capture bureau. Pas de
  fausse barre d'URL avec un domaine inventé : soit le vrai domaine du site livré, soit pas
  de barre.

## Contraintes non négociables

- **Composants serveur par défaut.** `'use client'` seulement là où un état ou un écouteur
  l'impose. `Button` doit rester utilisable des deux côtés.
- Aucun texte français codé en dur dans une primitive. Une primitive reçoit ses mots ; les
  seules chaînes admises sont des étiquettes d'accessibilité, et elles se passent en
  propriété.
- Variantes en `cva`, composition en `cn()`, comme `button.tsx` aujourd'hui.
- Aucune valeur en dur : le test de la règle 10 écrit en `02` doit passer.
- Pas de dépendance nouvelle. `lucide-react`, `clsx`, `tailwind-merge` et
  `class-variance-authority` sont déjà là et suffisent. Pas de bibliothèque de composants.
- Chaque primitive interactive se pilote au clavier seul, avec un focus visible en
  permanence.

## Le livrable maquette

Un fichier `primitives.html` : chaque composant, chaque variante, **chaque état côte à
côte** — repos, survol, focus, désactivé, en attente, en erreur. Le survol et le focus
sont montrés figés, pas seulement déclenchables : on doit pouvoir tout juger d'une capture.

Puis trois compositions grandeur nature qui prouvent que les briques tiennent ensemble :
un formulaire de brief complet, une carte de site livré, un encart de prix.

## Critères d'acceptation

- [ ] `Textarea`, `Checkbox`, `Radio`, `Field`, `FieldError`, `Badge`, `Bullet`, `Callout`,
      `Container`, `CenteredMessage` existent et sont employés par le code existant.
- [ ] `brief-form.tsx` et `notify-form.tsx` ne définissent plus aucun composant local.
- [ ] Les trois pages d'état passent par `CenteredMessage` et ont la même hauteur.
- [ ] La pastille numérotée a une seule taille dans tout le produit.
- [ ] Aucune cible tactile sous 44 px dans un formulaire.
- [ ] Chaque état interactif est visible sans souris.
- [ ] Le test de la règle 10 passe, exceptions vides.
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` passe.
