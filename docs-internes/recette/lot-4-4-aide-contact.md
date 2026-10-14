# Lot 4.4 — Aide et contact : recette

Dans l'ordre :
- Prompt 1 : `/aide` sur ordinateur, sans être connecté, jusqu'à un premier vrai message.
- Prompt 2 : à faire vous-même, dans votre boîte : le message est arrivé, et « Répondre » écrit à l'expéditeur.
- Prompt 3 : `/aide` connecté à l'espace A, deuxième message.
- Prompt 4 : trop de messages d'affilée.
- Prompt 5 : tous les liens qui mènent à `/aide`.
- Prompt 6 : à 360 px.
- Prompt 7 : vérification sur pulsacity.com, après la fusion, à la toute fin avec celles des autres lots.

Ce lot ne touche à aucun service : aucune action de votre côté sur Vercel, Supabase, Cloudflare, Resend ou Stripe, aucune variable, aucune migration. L'aperçu envoie déjà ses e-mails par la clé Resend de recette : un message écrit sur l'aperçu part pour de vrai vers contact@pulsacity.com, donc vers votre boîte (redirection OVH).
Si la dernière recette date de plus d'une semaine, réveillez d'abord la base de recette (prompt 0 bis de `lot-4-1-decisions.md`).

Adresse de l'aperçu (PR #38) : https://pulsacity-git-claude-funny-hawk-dbef15-jawadboughalems-projects.vercel.app

Deux adresses, à garder pour vous (ne les collez pas dans les comptes rendus) :
- **A** : celle des recettes précédentes, celle de l'espace « Julie Nutrition » de la recette ;
- votre boîte, celle qui reçoit contact@pulsacity.com.

Les messages de la recette partent pour de vrai : comptez jusqu'à six e-mails « Recette lot 4.4 » dans votre boîte.

Déjà vérifié par Claude Code dans son conteneur :
- `/aide` à 1440 et 360 px, à côté des cinq maquettes `v2-site-aide-*`, mesurées au pixel : écarts de 2 à 4 px au plus ; aucun débordement, aucune erreur dans la console ;
- les cinq états du formulaire (repos, connecté, erreurs, envoyé, trop d'envois), et l'e-mail produit, connecté et non connecté (affiché dans le terminal, sans clé Resend) ;
- les liens : « Contact » du pied de page, `/guides`, les guides, Systeme.io et le connecteur universel, le guide du widget au téléphone, « Votre espace est supprimé », l'échec de l'export ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts`, qui échoue déjà sur `main` dans ce conteneur et passe en CI ;
- Lighthouse mobile sur `/aide` : accessibilité, bonnes pratiques et SEO 100, performance 90 à 97.

Ce que la recette regarde : qu'un vrai message arrive dans votre boîte et que la réponse revienne à l'expéditeur ; que la page suive ses maquettes ; que chaque « Écrivez-nous » y mène.

---

## 1. /aide sur ordinateur, sans être connecté

Avant ce prompt : ouvrez une fenêtre de navigation privée (vous n'y êtes pas connecté), fenêtre en grand.

```
Tu fais la recette de la page « Aide et contact » de PULSACITY sur l'aperçu https://pulsacity-git-claude-funny-hawk-dbef15-jawadboughalems-projects.vercel.app, fenêtre en grand (1440 px environ), sans être connecté. Pour chaque point, note « OK » ou décris ce que tu vois. N'envoie que les messages que je te demande.

A. La page (https://pulsacity-git-claude-funny-hawk-dbef15-jawadboughalems-projects.vercel.app/aide)
1. En haut, l'en-tête du site : le logo PULSACITY, « Intégrations », « Tarifs », « Guides », « Se connecter », et le bouton « Créer mon espace gratuit ». Dessous, un fond bleu très pâle, le grand titre « Aide et contact », puis « Les réponses aux questions les plus fréquentes, par thème. Et un formulaire pour nous écrire. »
2. Six pastilles blanches cerclées de bleu marine, sur une ligne : « Démarrer », « Connecteurs », « Demandes », « Widgets », « Abonnement », « Données personnelles ». À droite, à la même hauteur, une carte blanche « Écrivez-nous ».
3. Sous les pastilles, le titre « Démarrer », puis deux cartes blanches. La première est ouverte : « Je ne suis pas technique. C'est pour moi ? » et sa réponse « Oui. Vous collez une adresse dans votre outil de vente, puis un code sur votre page. Chaque étape a son guide, pas à pas. ». La seconde est fermée, avec une flèche vers le bas. Dessous, une petite icône de fichier et le lien souligné « Guide : Comment récolter des témoignages clients pour une formation en ligne ».
4. Plus bas, dans l'ordre, les thèmes « Connecteurs », « Demandes », « Widgets », « Abonnement », « Données personnelles ». « Connecteurs », « Widgets » et « Données personnelles » finissent par un lien « Guide : … » ; « Demandes » et « Abonnement » n'en ont pas.
5. Clique la pastille « Widgets » : la page descend jusqu'au titre « Widgets », visible juste sous l'en-tête.
6. Ouvre « Que se passe-t-il si je dépasse une limite ? » (thème Abonnement) : la réponse parle de 15 témoignages validés, de 20 demandes dans le mois, du 1er du mois suivant et du plan Essentiel, et la flèche se retourne. Clique de nouveau sur la question : elle se referme.
7. Ouvre « Que veut dire « Bientôt » ? » (thème Connecteurs) : la réponse dit qu'aucune date n'est promise, et parle de Zapier, de Make et de « Me prévenir ».
8. Clique « Guide : Témoignages clients et RGPD : ce qu'un formateur doit savoir » : le guide s'ouvre. Reviens sur /aide.

B. Le formulaire « Écrivez-nous »
9. La carte de droite : « Écrivez-nous », « Une question, un blocage, une idée ? Votre message arrive à l'équipe ; la réponse revient à votre adresse. », les champs « Votre adresse e-mail » (vide, exemple « julie@exemple.fr »), « Sujet » (exemple « Par exemple : relier Kajabi »), « Message », le bouton jaune « Envoyer », puis en petit « Nous vous répondons sous deux jours ouvrés. Rien n'est gardé ici : votre message part par e-mail. »
10. Clique « Envoyer » sans rien remplir : en haut de la carte, un cadre rouge « 3 points à corriger avant d'envoyer » avec trois liens « Votre adresse e-mail », « Sujet », « Message ». Les trois champs ont un bord rouge, avec dessous : « Indiquez votre adresse e-mail : c'est là que nous vous répondrons. », « Indiquez le sujet de votre message. », « Écrivez votre message. »
11. Clique le lien « Sujet » du cadre rouge : le curseur va dans le champ « Sujet ».
12. Remplis : adresse « test@exemple », sujet « Recette lot 4.4, message 1 », message « Premier message de la recette du lot 4.4, écrit sans être connecté. ». Clique « Envoyer » : le cadre dit « 1 point à corriger avant d'envoyer », seul le champ de l'adresse est rouge, avec « Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr. ». Le sujet et le message sont toujours là.
13. Demande-moi l'adresse A et remplace l'adresse par celle-ci. Clique « Envoyer » : le bouton affiche « Envoi… » un instant, puis la carte montre un bandeau vert « Message envoyé. » et « Nous vous répondons sous deux jours ouvrés, à » suivi de l'adresse A, puis un lien « Écrire un autre message ».
14. Clique « Écrire un autre message » : le formulaire revient, l'adresse A est toujours remplie, le sujet et le message sont vides, et le curseur est dans « Sujet ». N'envoie rien de plus.

Compte rendu à me donner : les points 1 à 14 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK. Jamais l'adresse A.
```

---

## 2. Votre boîte : le message est arrivé (à faire vous-même)

Dans la boîte qui reçoit contact@pulsacity.com, dans les minutes qui suivent le point 13 :
1. Un e-mail de « Aide et contact PULSACITY », objet « Recette lot 4.4, message 1 », est arrivé (regardez aussi les courriers indésirables : s'il y est, notez-le).
2. Il dit : « De » et l'adresse A ; « Espace » : « Écrit sans être connecté à un espace. » ; « Sujet » ; puis le message, dans un cadre, avec son texte exact.
3. Cliquez « Répondre » : le destinataire proposé est l'adresse A, pas une adresse « notifications@… ». Envoyez une réponse courte (« Bien reçu, recette 4.4. »).
4. Dans la boîte A, la réponse arrive, de votre adresse.

Compte rendu à me donner : les points 1 à 4 avec « OK » ou ce que vous avez vu. Sans aucune adresse.

---

## 3. /aide connecté à l'espace A, sur ordinateur

Avant ce prompt : dans une fenêtre normale, connectez-vous vous-même sur l'aperçu avec l'adresse A, fenêtre en grand.

```
Tu fais la recette de « Aide et contact » de PULSACITY sur l'aperçu https://pulsacity-git-claude-funny-hawk-dbef15-jawadboughalems-projects.vercel.app, fenêtre en grand. Je suis connecté. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre https://pulsacity-git-claude-funny-hawk-dbef15-jawadboughalems-projects.vercel.app/app. En bas de la colonne de gauche, ouvre le menu du compte et clique « Aide et contact » : la page « Aide et contact » s'ouvre, avec l'en-tête et le pied de page du site (pas la colonne de l'espace).
2. Dans « Écrivez-nous », le champ « Votre adresse e-mail » est déjà rempli avec l'adresse du compte (ne me la recopie pas), et dessous, en gris : « Adresse de votre compte : nous répondrons à cette adresse. »
3. Ajoute une lettre à la fin de l'adresse : la phrase grise disparaît. Retire la lettre : elle revient.
4. Sujet « Recette lot 4.4, message 2 », message « Deuxième message de la recette du lot 4.4, écrit depuis l'espace. ». Clique « Envoyer » : le bandeau vert « Message envoyé. » apparaît, avec l'adresse du compte.

Compte rendu à me donner : les points 1 à 4 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK. Jamais l'adresse du compte.
```

Puis, vous-même : dans votre boîte, l'e-mail « Recette lot 4.4, message 2 » dit « Espace » : « Julie Nutrition, plan Gratuit. Écrit en étant connecté. »

---

## 4. Trop de messages d'affilée

Juste après le prompt 3, dans la même fenêtre. Ce prompt envoie jusqu'à quatre messages de plus, que vous recevrez.

```
Tu fais la recette de la limite des messages de « Aide et contact » sur l'aperçu https://pulsacity-git-claude-funny-hawk-dbef15-jawadboughalems-projects.vercel.app/aide, connecté, fenêtre en grand. La page laisse partir trois messages par quart d'heure depuis une même connexion, puis demande d'attendre.

1. Si la carte montre « Message envoyé. », clique « Écrire un autre message ».
2. Envoie un message : sujet « Recette lot 4.4, limite 1 », message « Essai de la limite. ». Si « Message envoyé. » apparaît, clique « Écrire un autre message » et recommence avec « limite 2 », puis « limite 3 », puis « limite 4 ». Arrête-toi dès qu'un bandeau rouge apparaît, et jamais au-delà de « limite 4 ».
3. Le bandeau rouge dit « Plusieurs messages sont partis en peu de temps. » puis « Patientez quelques minutes, puis réessayez. Votre texte est gardé. » Le sujet et le message que tu venais d'écrire sont toujours dans leurs champs.

Compte rendu à me donner : combien de messages sont partis avant le bandeau rouge, le point 3 avec « OK » ou ta description, et une capture du bandeau.
```

---

## 5. Les liens qui mènent à /aide, sur ordinateur

Dans la fenêtre connectée des prompts 3 et 4.

```
Tu vérifies, sur l'aperçu https://pulsacity-git-claude-funny-hawk-dbef15-jawadboughalems-projects.vercel.app, fenêtre en grand, les liens qui mènent à la page « Aide et contact ». N'envoie aucun message. Pour chaque point, note « OK » ou décris ce que tu vois. Ici, « la carte Écrivez-nous » est la carte blanche de droite de /aide.

1. Ouvre /tarifs, descends jusqu'au pied de page bleu marine et clique « Contact » : l'adresse devient /aide#contact, et la carte Écrivez-nous est en vue, juste sous l'en-tête.
2. Ouvre /guides : après les guides, une bande bleu clair « Une question sans réponse ici ? », « Écrivez-nous. Si c'est une installation, nous la faisons avec vous, en partage d'écran. » et un bouton blanc cerclé « Nous écrire ». Clique-le : /aide#contact.
3. Ouvre /guides/envoyer-vos-ventes-avec-make, descends jusqu'à « Toujours rien ? Écrivez-nous : nous le faisons avec vous, en partage d'écran. » Clique « Écrivez-nous » : /aide#contact.
4. Ouvre /integrations/systeme-io, section « Installer la connexion Systeme.io, pas à pas » : sous le texte de gauche, un cadre bleu clair « Un souci à une étape ? Écrivez-nous : nous faisons la connexion avec vous, en partage d'écran. » Clique « Écrivez-nous » : /aide#contact.
5. Même chose sur /integrations/connecteur-universel : le même cadre, sous le texte de gauche de son pas à pas.
6. Ouvre /espace-supprime : clique « Écrivez-nous » : /aide#contact.
7. Ouvre /mentions-legales, rubrique « Contact » : « E-mail : contact@pulsacity.com, ou le formulaire Écrivez-nous », « Écrivez-nous » en lien vers /aide#contact.
8. Ouvre /confidentialite : une rubrique « « Écrivez-nous », sur la page d'aide » dit que rien n'est gardé sur le site ni dans la base, et que le message part par e-mail vers contact@pulsacity.com. Plus haut, « Pour toute question sur vos données : contact@pulsacity.com. »
9. Ouvre /sitemap.xml : une ligne se termine par « /aide ».

Compte rendu à me donner : les points 1 à 9 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```

---

## 6. À 360 px

Dans la fenêtre connectée, avec un cadre de 360 px de large, comme aux recettes précédentes.

```
Tu fais la recette à 360 px de « Aide et contact » de PULSACITY sur l'aperçu https://pulsacity-git-claude-funny-hawk-dbef15-jawadboughalems-projects.vercel.app. Je suis connecté. Règle la fenêtre (ou un cadre) à 360 px de large. N'envoie aucun message. Pour chaque point, note « OK » ou décris ce que tu vois, et vérifie à chaque page qu'il n'y a aucun défilement horizontal.

1. /aide : l'en-tête montre le logo et le bouton du menu. Le titre, la phrase, puis les six pastilles sur trois lignes de deux. Les questions sont sur toute la largeur ; une longue question passe sur deux lignes sans toucher la flèche.
2. Tout en bas, après « Données personnelles » et son guide, la carte « Écrivez-nous », puis le pied de page. Le bouton « Envoyer » prend toute la largeur de la carte.
3. Vide le champ de l'adresse, puis clique « Envoyer » : le cadre rouge « 3 points à corriger avant d'envoyer » apparaît en haut de la carte et la page le montre ; rien ne déborde.
4. Ouvre /app/plus : sous « Votre compte », la ligne « Aide et contact » mène à /aide.
5. Ouvre /app/widgets, puis le premier widget. Descends jusqu'à « Installer le widget » et clique « Voir le guide « Coller dans Systeme.io » » : la page « Coller dans Systeme.io » s'ouvre. Tout en bas, après « Copier le code » : « Un souci à une étape ? Écrivez-nous : nous le faisons avec vous, en partage d'écran. » Clique « Écrivez-nous » : /aide#contact, avec la carte Écrivez-nous en vue.

Compte rendu à me donner : les points 1 à 5 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```

---

## 7. Vérification sur pulsacity.com, après la fusion

À lancer à la toute fin, avec les vérifications en production des autres lots (décision du fondateur, 14 octobre). Sans être connecté.

```
Tu vérifies sur la production de PULSACITY la page « Aide et contact ». Pour chaque point, note « OK » ou décris ce que tu vois. Ne relève pas les erreurs réseau vues par ton outil de surveillance du navigateur : elles ne font pas foi.

1. Ouvre https://pulsacity.com, descends au pied de page et clique « Contact » : https://pulsacity.com/aide#contact s'ouvre, la carte « Écrivez-nous » en vue.
2. Les six thèmes et leurs questions s'affichent ; la première réponse est ouverte.
3. Demande-moi mon adresse de test. Écris-la dans « Votre adresse e-mail », sujet « Vérification production, lot 4.4 », message « Message de vérification de la production. », puis clique « Envoyer » : « Message envoyé. » apparaît.
4. https://pulsacity.com/sitemap.xml contient une ligne qui finit par « /aide ».

Compte rendu à me donner : les points 1 à 4 avec « OK » ou ce que tu as vu. Jamais l'adresse de test.
```

Puis, vous-même : l'e-mail « Vérification production, lot 4.4 » est arrivé dans votre boîte, de « Aide et contact PULSACITY ».
