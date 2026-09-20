# 06 — Le parcours de commande

> Prérequis : `00-context.md`, `01`, `02`, `03`.
> Livrable : **maquette** des cinq écrans, puis **code**.

---

## Ton rôle

Tu dessines le tunnel : de « je veux un site » à « c'est payé ». C'est la partie du produit
où une hésitation coûte un client, et où l'utilisateur est le moins à l'aise — un artisan
qui remplit un formulaire au pouce, dans sa camionnette, et qui n'a jamais acheté de site.

## Le parcours réel

```
page d'accueil
   └─ « Demander mon site »
        └─ /commander                     formulaire de brief (13 champs)
             └─ /commander/merci?lead=…   demande envoyée, paiement possible mais non demandé
                  └─ Stripe Checkout      hors du domaine
                       ├─ /merci          paiement reçu, les quatre étapes suivantes
                       └─ /commande-indisponible   le lien de paiement n'a pas pu être créé

demo.pulsacity.com/<slug>
   └─ bannière fixe → Stripe Checkout directement (le site existe déjà)
```

Le paiement n'est jamais un préalable : le client voit son site avant de régler. Le tunnel
doit refléter cette promesse — un écran qui pousse au paiement trahit l'argument de vente.

## Écran par écran

### `/commander` — le formulaire de brief

Treize champs aujourd'hui : nom de l'entreprise, activité, ville, téléphone, e-mail
facultatif, lien de fiche Google facultatif, description libre, six cases « les pages dont
vous avez besoin », un champ « autre », les sites aimés, et deux boutons radio pour les
photos et le logo. Plus un piège à robots caché.

La promesse affichée en tête est « trois minutes suffisent ». Treize champs d'affilée ne
font pas trois minutes **perçues**. C'est le problème de design à résoudre : la densité
ressentie, sans retirer d'information utile au brief.

Pistes à évaluer et à trancher — pas à empiler : regrouper en deux ou trois blocs nommés ;
distinguer visuellement l'obligatoire du facultatif (six champs sur treize sont
facultatifs et rien ne le dit assez) ; poser d'abord les quatre champs qui permettent de
rappeler, puis tout le reste comme « pour aller plus vite ensuite » ; indiquer où l'on en
est. **Ce que tu ne fais pas :** découper en plusieurs pages — le formulaire est une action
serveur sans JavaScript, et un tunnel multi-étapes coûterait cette propriété.

Traite aussi : l'erreur par champ (`role="alert"` existe déjà), l'erreur globale, l'état
d'envoi du bouton, ce que voit un utilisateur au clavier seul, et le comportement du clavier
tactile sur `tel`, `email`, `url`.

### `/commander/merci` — la demande est partie

Le message est juste : « Merci. Je vous appelle sous 24 h. » Puis un encadré discret « Vous
préférez régler dès maintenant ? » avec, en toutes lettres, « ce n'est pas nécessaire ».

Cette page fait une chose difficile : proposer de payer tout en disant de ne pas se presser.
Dessine cette hiérarchie sans que l'encadré ressemble ni à une vente forcée, ni à une note
de bas de page qu'on ne lit pas.

### `/merci` — le paiement est reçu

Quatre étapes suivantes en liste numérotée : domaine réservé, appel pour les corrections,
mise en ligne sous 72 h, facture envoyée par Stripe. C'est le seul moment de soulagement du
parcours ; il mérite mieux qu'un `h1` et une liste. Sans confettis.

Note : la pastille numérotée y est en `size-7` alors que `steps` l'a en `size-8`. Les deux
passent par le même `Bullet` après le prompt `03`.

### `/commande-indisponible` — le paiement n'a pas pu s'ouvrir

« Rien n'a été débité. Réessayez dans quelques instants. » Plus l'e-mail de contact, s'il
existe dans `content/site.json` — il n'existe pas aujourd'hui, donc **le seul recours
affiché disparaît**. Dessine cet écran dans son état réel, et propose quoi mettre à la place
sans inventer de coordonnées.

### La bannière de démo

`components/demo-banner.tsx` : barre fixe en bas, fond encré, nom du client, prix, délai,
bouton « Je le prends ». Elle est posée **par-dessus le site du client**, qui a ses propres
couleurs.

Trois exigences : elle ne doit jamais masquer le contenu du site (aujourd'hui le
`pb-28` qui lui fait de la place est écrit dans la page, pas dans le composant — le lien
entre les deux doit venir d'un jeton) ; elle doit rester lisible quel que soit le site
en dessous ; et elle ne doit pas se faire passer pour un élément du site du client. On
comprend en une seconde que c'est PULSACITY qui parle.

Sur un téléphone, deux lignes de texte plus un bouton dans une barre fixe, c'est étroit :
dessine-la d'abord à 375 px.

## Un détail à uniformiser au passage

Les liens textuels du produit sont incohérents : `text-accent-ink` avec
`underline-offset-4` dans le pied de page et les sections, `text-accent` avec
`underline-offset-2` dans `legal-page.tsx` et `commande-indisponible`. Fixe **une** façon
d'écrire un lien, et applique-la partout.

## Contraintes non négociables

- Aucun prix codé dans un composant. `formatEurHt(line.offer.priceHtCents)` lit le fichier
  de la ligne, côté serveur.
- Montants en centimes, jamais de flottant.
- Le formulaire fonctionne **sans JavaScript** : action serveur, méthode POST. Rien de ce
  que tu dessines ne peut en dépendre.
- Le piège à robots caché reste caché, y compris pour un lecteur d'écran.
- Aucun texte ne promet ce que le produit ne tient pas. Et jamais les mots garantie,
  assurance, assistance, couverture.
- Toute cible tactile à 44 px au moins. Chaque erreur annoncée au lecteur d'écran.

## Critères d'acceptation

- [ ] Le formulaire donne l'impression de trois minutes sans perdre un champ utile.
- [ ] L'obligatoire et le facultatif se distinguent d'un coup d'œil.
- [ ] Chaque état est dessiné : vide, en cours de saisie, en erreur par champ, en erreur
      globale, en envoi, envoyé.
- [ ] `/commander/merci` propose le paiement sans le réclamer.
- [ ] `/commande-indisponible` reste utile quand aucun e-mail de contact n'est renseigné.
- [ ] La bannière de démo est lisible sur n'importe quel site, sans masquer son contenu, et
      la place qu'elle réserve vient d'un jeton.
- [ ] Une seule façon d'écrire un lien dans tout le produit.
- [ ] Tout le tunnel se parcourt au clavier, sans souris, sans JavaScript.
