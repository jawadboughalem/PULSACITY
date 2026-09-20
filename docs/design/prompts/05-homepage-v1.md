# 05 — La première version de pulsacity.com

> Prérequis : `00-context.md`, `01`, `02`, `03`, `04`.
> Livrable : **maquette** de la page entière, mobile et bureau, avec le contenu réel — puis
> **code**, une fois la maquette validée.

---

## Ton rôle

Tu assembles. Toutes les décisions sont prises : la charte, les jetons, les primitives, les
sections. Ce prompt ne rouvre aucune d'elles. Il demande la page — celle qu'on met en ligne.

## Ce que la page rend

`apps/corporate/src/app/page.tsx` fait exactement ceci :

```tsx
{
  liveLines().map((line) => <RenderSections key={line.slug} sections={line.sections} />);
}
<ComingLinesSection lines={comingLines()} />;
```

Une seule ligne est live. Ses sections, dans l'ordre du fichier
`content/lines/creation-de-sites.json` :

1. `hero` — « Votre site, fait pour vous. » + le paragraphe à 500 € HT + deux actions
2. `features` — quatre items : Vos mots / Votre image / Les pages qui comptent / Un
   interlocuteur, pas un ticket
3. `showcase` — « Un site livré » — **vide aujourd'hui**
4. `steps` — « Comment ça se passe » — quatre étapes
5. `pricing` — « Le prix » — « 500 € HT tout compris. »
6. `faq` — « Questions fréquentes » — huit questions
7. `cta` — « Décrivez-moi votre activité »

puis `coming-lines` — Pulsa Store et Logiciels métier — et le pied de page.

**Emploie ces textes mot pour mot.** Ils sont écrits, relus, et conformes aux interdits de
rédaction. Tu composes, tu ne réécris pas. Si un texte te paraît devoir changer, mets-le à
part en fin de réponse comme une proposition de modification de `content/`, avec ta raison.

## Ce qu'on juge sur cette maquette

1. **Les trois premières secondes sur un téléphone.** Un artisan ouvre le lien reçu par SMS,
   sur un écran de 375 px, dans la rue, une main occupée. Que voit-il, que comprend-il, que
   peut-il toucher sans défiler ?
2. **La partition.** En plissant les yeux, on doit voir des zones de densité différentes.
   Si les huit sections se ressemblent, la maquette est refusée.
3. **La promesse rendue visible.** La page vend un site. On doit en voir un, ou comprendre
   honnêtement pourquoi on n'en voit pas encore.
4. **Le prix comme sommet.** Un prix unique, tout compris, sans remise : c'est l'argument
   qui conclut. Il doit se voir de loin.
5. **La longueur.** Sept sections plus les annonces, c'est long pour un téléphone. Le
   défilement doit rester motivé de bout en bout, ou la page doit se raccourcir — et tu
   proposes alors ce qui saute, avec ta raison.

## Les deux états à livrer

Tu livres la même page deux fois. C'est le cœur du problème PULSACITY.

- **État du jour** — `content/showcase.json` vaut `[]`, `content/site.json` n'a ni prénom,
  ni e-mail, ni téléphone. Donc : pas de section « Un site livré », pas de capture dans
  `steps`, pas de contact dans le pied de page. **C'est la page qui se met en ligne.** Elle
  doit être belle ainsi, sans trou et sans mensonge.
- **État complet** — un site livré avec ses captures réelles, le prénom du fondateur, un
  e-mail, un téléphone. C'est la page à trois mois.

Si la maquette n'est belle que dans le second état, elle ne sert à rien.

## Les autres pages du même lot

La page d'accueil n'est pas seule à être publique. Livre aussi, plus rapidement :

- **`/<slug>`** — la page d'une ligne, qui rend les mêmes sections sans les annonces ;
- **`/mentions-legales`, `/confidentialite`, `/cgv`** — du Markdown rendu par
  `.legal-prose`, aujourd'hui sept règles CSS dans `globals.css`. Ces pages sont longues,
  denses, et personne ne les lit avec plaisir : rends-les au moins lisibles. Mesure de
  ligne, hiérarchie, rythme, retour vers l'accueil.

## Contraintes non négociables

- Contenu réel, mot pour mot. Aucun client inventé, aucune capture fabriquée, aucun chiffre
  ajouté.
- Interface en français, vouvoiement, première personne du singulier.
- Un seul `h1`. Ordre des titres séquentiel.
- Les ancres existantes restent : `#inclus`, `#realisations`, `#methode`, `#prix`, `#faq`,
  `#a-venir`, `#contact`.
- Aucune valeur en dur : tout par les jetons de `02`, toutes les briques de `03`.
- La page fonctionne sans JavaScript, hors les deux formulaires.
- Objectif de performance : le score Lighthouse actuel est de 99 à 100 en mobile comme en
  bureau sur les quatre catégories. **Ta maquette ne doit rien proposer qui le fasse
  baisser** — pas de vidéo d'arrière-plan, pas de police supplémentaire au-delà des deux de
  la charte, pas de grande image non dimensionnée, aucune animation sur le plus grand
  élément de contenu visible.

## Format de réponse

1. La maquette HTML autonome, dans ses deux états — deux fichiers, ou un fichier avec un
   basculement clair.
2. Dix lignes : les trois décisions de composition que tu as prises et pourquoi.
3. Ce qui manque dans `content/` pour que l'état complet existe — la liste précise de ce
   qu'il faut produire ou rédiger, sans rien inventer à la place.

## Critères d'acceptation

- [ ] L'état du jour est beau sans le moindre contenu manquant comblé par une invention.
- [ ] À 375 px, la promesse et l'action principale sont lisibles avant tout défilement.
- [ ] En plissant les yeux, la page montre au moins trois niveaux de densité.
- [ ] La section de prix est le point le plus fort.
- [ ] Les textes sont exactement ceux des fichiers de contenu.
- [ ] Aucun texte de vente n'est passé dans un composant.
- [ ] Les trois pages légales sont lisibles, pas seulement conformes.
