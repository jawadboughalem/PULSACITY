# Lot 5, fin — réponses de Design, enregistrement de l'éditeur, prix TVA comprise : recette

Dans l'ordre. Chaque bloc est un prompt à coller tel quel dans Claude in Chrome, sauf le contrôle au doigt (à faire vous-même sur votre téléphone) et le dernier prompt, pour Claude Design.

- Prompt 1 : sur l'aperçu de la PR #22, avant la fusion.
- Prompt 2 et contrôle au doigt : sur la page Systeme.io de test, après la fusion.
- Prompt 3 : pour Claude Design.

Adresse de l'aperçu, la même que pour les PR #20 et #21 : https://pulsacity-git-claude-amazing-ar-eb60d3-jawadboughalems-projects.vercel.app. Cette PR n'a pas de migration.

Déjà vérifié par Claude Code dans son conteneur :
- deux éditeurs ouverts sur le même widget : l'un choisit « Arrondis », l'autre, resté sur « Droits », passe le type sur « Carrousel » ; la base garde le carrousel et les coins arrondis ;
- sur une page de test avec 24 px de marge, le mur passe à une colonne à 360 px (widget de 312 px) et garde deux colonnes à 390 px (widget de 342 px), comme m2 mobile ; le chargement suit ;
- le chargement du carrousel montre quatre points sur téléphone, trois sur ordinateur.

---

## 1. Recette sur ordinateur, sur l'aperçu

Avant ce prompt : connectez-vous vous-même à l'aperçu avec le compte de l'espace « Julie Nutrition », fenêtre en grand.

```
Tu fais la recette d'une correction de PULSACITY sur l'aperçu de la PR où je suis connecté, fenêtre en grand. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

A. Deux éditeurs ouverts sur le même widget
1. Ouvre « Widgets », puis « Modifier ». Note le type et les coins des cartes affichés, pour les remettre à la fin.
2. Ouvre la même page de l'éditeur dans un deuxième onglet. On appelle « onglet A » le premier et « onglet B » le second.
3. Dans l'onglet A : choisis « Droits » dans « Coins des cartes » et « Mur » comme type, et attends « Enregistré automatiquement ». Recharge l'onglet B : il montre « Droits » et « Mur ».
4. Dans l'onglet A : choisis « Arrondis ». Attends « Enregistré automatiquement ». Ne recharge pas l'onglet B : il montre encore « Droits ».
5. Dans l'onglet B : choisis le type « Carrousel ». Attends « Enregistré automatiquement ».
6. Recharge l'onglet A. Il doit montrer le type « Carrousel » ET les coins « Arrondis ». Avant la correction, l'onglet B aurait remis « Droits ».
7. Remets le type et les coins notés au point 1, puis ferme l'onglet B.

B. Le prix du plan Essentiel
8. Reviens sur « Widgets ». Sous la liste, l'encadré gris dit « Avec le plan Essentiel, à 9 € par mois, vous créez autant de widgets que vous voulez : un pour chaque page de vente. », sans « HT ».

Ne touche à aucun autre réglage de l'espace.

Compte rendu à me donner : les points 1 à 8 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```

---

Après le prompt 1 : envoyez le compte rendu à Claude Code. S'il n'y a rien à corriger, la PR #22 est fusionnée, puis attendez que la production soit « Ready » dans Vercel.

## 2. Systeme.io — le mur sur un téléphone étroit (production)

Avant ce prompt : ouvrez l'adresse publique de la page Systeme.io de test, dans un cadre de 360 × 800, comme pour les recettes précédentes sur téléphone. Le widget doit être sur « Mur ».

```
Tu vérifies le widget de PULSACITY sur la page Systeme.io de test, en largeur téléphone. Tu ne modifies rien.

1. Fais défiler jusqu'au mur d'avis. Mesure la largeur du widget avec la console : document.querySelector("[data-pulsacity-widget]").offsetWidth. Note-la, avec la largeur de la fenêtre (window.innerWidth).
2. Si le widget fait moins de 340 px : le mur est sur une seule colonne, chaque carte sur toute la largeur. S'il fait 340 px ou plus : deux colonnes. Note le nombre de colonnes que tu vois.
3. Élargis le cadre à 414 × 800 et recharge. Mesure de nouveau le widget, et note le nombre de colonnes : deux si le widget fait 340 px ou plus.
4. Dans les deux cas, rien ne déborde sur le côté, et « Voir les 3 autres avis » prend toute la largeur du widget.

Compte rendu à me donner : pour chaque largeur, la largeur de la fenêtre, celle du widget et le nombre de colonnes, puis une capture d'écran du haut du mur à chaque largeur.
```

## Contrôle au doigt, sur votre téléphone (sans Claude)

Le 2 octobre, Claude in Chrome n'a pas pu faire glisser le carrousel au doigt. À faire vous-même, une fois :

1. Dans PULSACITY, passez le widget sur « Carrousel ». Attendez une minute.
2. Sur votre téléphone, ouvrez la page Systeme.io de test et rechargez-la deux fois.
3. Faites glisser la carte vers la gauche : la suivante arrive, et le compteur sous la carte passe de « 1 sur 12 » à « 2 sur 12 » sans revenir en arrière.
4. Remettez le widget sur « Mur ».

Dites simplement à Claude Code « OK » ou ce que vous avez vu.

---

## 3. Pour Claude Design (hors Chrome)

```
Pour PULSACITY, merci pour les réponses du 2 octobre : la règle d'une colonne sous 340 px est construite, et les PNG sont dans le dépôt. Une décision change la page Tarifs avant qu'on la construise : les prix sont TVA comprise. Le montant affiché est celui que le créateur paie (9 € et 19 € par mois, 90 € et 190 € par an). À aligner, sans rien redessiner d'autre :
1. m8, sous chaque prix : « par mois » (ou « par an » en annuel), sans « HT ».
2. m8, sous le titre : « Commencez gratuitement. Passez à Essentiel quand les avis arrivent. Sans engagement, TVA comprise. »
3. m8, question « Les prix incluent-ils la TVA ? », nouvelle réponse : « Oui. Le prix affiché est celui que vous payez, TVA comprise. Si votre entreprise récupère la TVA, la facture la détaille : Essentiel vous revient à 7,50 € HT par mois. Avec un numéro de TVA d'un autre pays de l'Union européenne, la TVA est autoliquidée : vous payez 9 €, sans TVA. »
4. m8, « Tri par offre » : le choix d'une offre par widget est ouvert à tous les plans. Retire-le des avantages d'Essentiel (garde les trois autres lignes) et, dans le comparatif, montre-le inclus dans les trois plans.
5. m18, encadré du plan Gratuit, en desktop et en mobile : « à 9 € par mois » au lieu de « à 9 € HT par mois ».
Exporte seulement les PNG modifiés, avec leurs noms actuels.
```
