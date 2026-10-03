# Lot 6, fin — « Demander un avis » (m20) : recette

Dans l'ordre. Chaque bloc est un prompt à coller tel quel dans Claude in Chrome.

- Prompt 1 : l'espace de démonstration de recette, rempli depuis la branche de la PR #25.
- Prompts 2 et 3 : recette sur l'aperçu de la PR #25, avant la fusion.

Adresse de l'aperçu : https://pulsacity-git-claude-zen-cori-x7joes-jawadboughalems-projects.vercel.app. « Recette database migration » applique la migration 0008 à la base de recette dès l'ouverture de la PR.

Déjà vérifié par Claude Code dans son conteneur, à 1440 px et 360 px, à côté de m20 :
- les huit états : formulaire, confirmation, déjà une demande, personne désinscrite, adresse incomplète, plafond du jour (20 saisies), plan Gratuit plein, aucune offre ;
- le bouton de l'accueil ouvre Demandes avec le formulaire ouvert ; la croix le referme sans le rouvrir au rechargement ;
- l'e-mail part au bon client, avec « vous avez acheté Atelier cuisine auprès de Julie Nutrition le … » ;
- une demande saisie à la main part même si les demandes automatiques de l'offre sont désactivées ;
- aucun débordement sur le côté.

À savoir :
- Sur un aperçu, rien ne part tout seul : la demande saisie part avec « Envoyer maintenant ».
- Le plafond du jour, le plan Gratuit plein et l'espace sans offre ne se reproduisent pas sans fabriquer des données : ils sont vérifiés dans le conteneur.

---

## 1. GitHub — l'espace de démonstration de recette, depuis la branche de la PR

```
Tu m'aides à remplir l'espace de démonstration de PULSACITY sur la base de recette, depuis la branche d'une PR.

Où : https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml

Étapes :
1. Clique sur « Run workflow ».
2. « Use workflow from » : choisis la branche claude/zen-cori-x7joes (pas main).
3. « Adresse e-mail du compte de recette » : demande-la-moi et mets celle que je te donne.
4. Plan : free.
5. Clique sur « Run workflow », puis attends la fin : l'exécution doit être verte.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Compte rendu à me donner : la branche choisie, le plan, et la couleur de l'exécution. Pas l'adresse e-mail.
```

---

## 2. Recette sur ordinateur, sur l'aperçu : demander un avis à un client, puis l'e-mail

Avant ce prompt : connectez-vous vous-même à l'aperçu, avec l'adresse du prompt 1, fenêtre en grand. Choisissez une adresse de client de test qui arrive dans votre boîte (par exemple un alias avec « +client8 ») et remplacez ADRESSE_CLIENT_TEST par elle dans le prompt, aux deux endroits. Gardez votre messagerie ouverte dans le même navigateur.

```
Tu fais la recette de « Demander un avis » de PULSACITY sur l'aperçu où je suis connecté, fenêtre en grand. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

A. Le formulaire
1. Sur l'accueil, clique sur « Demander un avis ». La page Demandes s'ouvre (l'adresse finit par ?demander=1) avec une fenêtre par-dessus : titre « Demander un avis », une croix, et « Pour un client qui a acheté en dehors d'un outil connecté : virement, séance, autre plateforme. Il reçoit le même e-mail qu'après une vente Systeme.io, au nom de Julie Nutrition. »
2. Les champs : « Prénom (facultatif) » et « Nom (facultatif) » côte à côte, puis « L'e-mail commence par « Bonjour Élodie, ». Sans prénom : « Bonjour, ». » ; « Adresse e-mail » ; « Offre » (« Choisir une offre ») ; « Date d'achat » à la date du jour, puis « L'e-mail dira : « vous avez acheté [l'offre] auprès de Julie Nutrition le … » » ; la case « Cette personne a acheté cette offre auprès de moi. » ; le bouton « Envoyer la demande », le lien « Annuler », et « Elle part au prochain envoi, dans les minutes qui suivent. Sans réponse, une seule relance part quatre jours plus tard. »
3. Clique sur la croix : la fenêtre se ferme et l'adresse redevient /app/demandes. Recharge : la fenêtre ne se rouvre pas. Clique sur « Demander un avis » en haut à droite de Demandes : elle se rouvre.
4. Clique sur « Envoyer la demande » sans rien remplir. Trois messages rouges : sous l'adresse « Indiquez l'adresse e-mail de cette personne : c'est là que part la demande. », sous l'offre « Choisissez l'offre que cette personne a achetée. », sous la case « Cochez cette case : une demande ne part qu'à un client qui a acheté l'offre. »
5. Écris « Camille » en prénom : la phrase dit « L'e-mail commence par « Bonjour Camille, ». ». Écris « camille@gmail » en adresse et clique sur « Envoyer la demande » : sous l'adresse, « Il manque la fin de l'adresse, par exemple camille@gmail.com. »
6. Choisis l'offre « Atelier cuisine » : la phrase sous la date dit « vous avez acheté Atelier cuisine auprès de Julie Nutrition le … ».

B. La demande
7. Remplace l'adresse par ADRESSE_CLIENT_TEST, écris « T. » en nom, coche la case, clique sur « Envoyer la demande ». La fenêtre se ferme ; l'adresse finit par ?demande=… ; un bandeau vert dit « Demande prête pour Camille T. » puis « Elle part au prochain envoi, dans les minutes qui suivent, à … Sans réponse, une relance partira le … » (dans quatre jours). Les pastilles disent « Planifiées (5) ».
8. Dans la liste : « Camille T. · Atelier cuisine », « Part au prochain envoi », badge « Planifiée ». Clique sur la croix du bandeau : il disparaît.
9. Sur la ligne de Camille T., clique sur « Envoyer maintenant » : elle passe « Envoyée », « Envoyée le … · relance prévue le … ».
10. Dis-moi : « Ouvrez l'e-mail reçu à l'adresse de test, puis dites-moi OK. » Attends mon OK. Je vérifie moi-même : objet « Camille, votre avis sur Atelier cuisine ? », expéditeur « Julie Nutrition via PULSACITY », et en bas « vous avez acheté Atelier cuisine auprès de Julie Nutrition le … ».

C. Les refus
11. Rouvre « Demander un avis ». Mets ADRESSE_CLIENT_TEST, l'offre « Atelier cuisine », coche la case, envoie. En haut du formulaire, un encadré rouge : « Camille T. a déjà une demande pour Atelier cuisine. », « Elle lui a été envoyée le … ; une relance est prévue le … Une seule demande par client et par offre : ainsi, personne ne reçoit plus de deux e-mails. » (un seul point après la date), « À faire : si cette personne vous a dit vouloir donner son avis, envoyez-lui vous-même votre lien de collecte. », puis « Copier mon lien de collecte » et « Voir sa demande ». Clique sur « Copier mon lien de collecte » : il dit « Lien copié ». Clique sur « Voir sa demande » : la fenêtre se ferme, l'adresse finit par ?statut=envoyees, la ligne de Camille T. y est.
12. Dis-moi : « Cliquez sur « Ne plus recevoir ces e-mails » en bas de l'e-mail, puis dites-moi OK. » Attends mon OK.
13. Rouvre « Demander un avis ». Mets ADRESSE_CLIENT_TEST, l'offre « Programme 30 jours », coche la case, envoie. Encadré rouge : « Camille T. ne reçoit plus vos e-mails. », « Cette personne s'est désinscrite le … des demandes d'avis de Julie Nutrition. PULSACITY ne lui écrira plus, quelle que soit l'offre. », « À faire : si elle souhaite tout de même donner son avis, partagez-lui votre lien de collecte par un autre moyen, à sa demande. » et « Copier mon lien de collecte ». Ferme la fenêtre.

Ne touche à aucun autre réglage de l'espace.

Compte rendu à me donner : les points 1 à 13 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK. Jamais l'adresse e-mail de test.
```

---

## 3. Recette à 360 px, sur l'aperçu

Avant ce prompt : connecté à l'aperçu, en 360 × 800 (le même cadre que d'habitude).

```
Tu vérifies « Demander un avis » de PULSACITY en largeur téléphone, 360 × 800, sur l'aperçu où je suis connecté. Tu ne modifies rien et tu n'envoies aucune demande. Pour chaque point, note « OK » ou décris ce que tu vois. Vérifie dans la console qu'il n'y a pas de débordement : document.documentElement.scrollWidth === window.innerWidth.

1. Onglet « Demandes » : sous le titre et son texte, le bouton blanc « Demander un avis » sur toute la largeur.
2. Clique dessus : le formulaire prend tout l'écran, sans barre d'onglets. En haut, une croix et « Demander un avis ». « Prénom » et « Nom » sont l'un sous l'autre ; la date d'achat prend toute la largeur ; « Envoyer la demande » prend toute la largeur ; il n'y a pas de lien « Annuler » (la croix suffit).
3. Fais défiler jusqu'en bas : la barre avec la croix reste en haut de l'écran. Le dernier texte est « Elle part au prochain envoi, dans les minutes qui suivent. Sans réponse, une seule relance part quatre jours plus tard. »
4. Clique sur la croix : Demandes revient, avec la barre d'onglets.

Compte rendu à me donner : les points 1 à 4 avec « OK » ou ta description, et une capture d'écran du formulaire en haut et en bas.
```
