# Lot 4.8 — Page de collecte, e-mails et widget en v2 : recette

Adresse de l'aperçu (PR #47) : https://pulsacity-git-claude-sweet-ritc-38d706-jawadboughalems-projects.vercel.app

Maquettes : https://github.com/jawadboughalem/PULSACITY/tree/claude/sweet-ritchie-zo9fad/docs-internes/design-v2/maquettes (fichiers « v2-collecte-… », « v2-email-… » et « v2-widget-… » ; index dans `INDEX.md`, partie « Clients, e-mails, widget — prompt 3.6 »).

Dans l'ordre :
- Prompt 0 : si la dernière recette date de plus d'une semaine, réveiller la base de recette (prompt 0 bis de `lot-4-1-decisions.md`).
- Prompt 1 : GitHub, l'espace de démonstration (A, plan Essentiel).
- Prompt 2 : recette, « Votre lien », l'aperçu de l'e-mail de demande, le widget dans l'éditeur et sur l'accueil, « Code du widget ».
- Prompt 3 : recette de bout en bout avec B : la demande, la page de collecte sur ordinateur, « Nouveau témoignage ».
- Prompt 4 : recette, la page de collecte générale à 360 px.
- Prompt 5 : recette de bout en bout avec B : la correction, le motif, la désinscription.
- Action 6, à faire vous-même : les mêmes e-mails dans Outlook et dans Apple Mail.
- Après la fusion : prompt 7 (vérification en production, avec le widget sur votre vraie page Systeme.io), à la toute fin avec celles des autres lots.

Ce lot ne touche à aucun service : aucune action sur Vercel, Supabase, Cloudflare, Resend ou Stripe, aucune variable, aucune migration. Il change l'apparence de ce que voient vos clients (page de collecte, réponses à une correction, désinscription, e-mails) et du widget, pas ce que fait le produit. Deux adresses changent de forme, l'ancienne continuant de marcher : le lien de connexion (`/entrer/…`) et le lien de désinscription des e-mails (`/desinscription/…`).

Deux adresses, à garder pour vous (jamais dans un compte rendu) :
- **A** : celle des recettes précédentes, l'espace « Julie Nutrition » de la recette ; elle reçoit les e-mails du créateur (« Votre lien », « Nouveau témoignage », « Code du widget ») ;
- **B** : une autre de vos adresses, de préférence une adresse Gmail (un alias suffit), qui joue la cliente : elle reçoit la demande, la correction et le motif. Sa boîte de réception est ouverte dans un onglet du groupe « PULSACITY ».

Aucun compte n'est créé. Les clients de l'espace de démonstration ont des adresses en `@exemple.fr`, qui ne sont pas à vous : les prompts n'envoient jamais rien à ces clients. Tout ce qui envoie un e-mail se fait vers B.

Déjà vérifié par Claude Code dans son conteneur :
- chaque état de la page de collecte (arrivée, saisie, consentement et champs manquants, photo, envoi impossible, envoi réussi, lien plus actif, page générale, contrepartie, bêta PULSACITY, couleur d'accent), des réponses à une correction (acceptée, texte gardé, déjà répondu) et de la désinscription (confirmée, lien invalide, échec), à 1440 et 360 px, à côté des maquettes ;
- les e-mails rendus à 600 px et à 360 px à côté des maquettes : demande, relance, version texte, « Votre lien », « Nouveau témoignage » (standard et plan Gratuit plein), « Code du widget », rappel des bêta-testeurs ; boutons de 52 px (56 au téléphone) ;
- le widget sur deux pages de vente fictives (claire à empattements, sombre sans empattements), à 1440 et 360 px, à côté des maquettes : mur, carrousel, badge, thèmes clair, sombre et automatique, chargements, « Voir les autres avis » (chargement, échec), mentions (contrepartie, plan Pro sans « Propulsé par », badge sans lien), accent trop pâle ;
- par des tests : le rendu du widget (jsdom), les e-mails et leur version texte, les deux nouvelles adresses ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts`, qui échoue déjà sur `main` dans ce conteneur et passe en CI ; `w.js` : 11,2 Ko compressés (limite : 30).

Ce que la recette ne voit pas :
- sur un aperçu, la protection de Vercel bloque les données du widget demandées depuis une autre page : le widget se vérifie ici dans l'aperçu de l'éditeur et sur l'accueil (même dessin que `w.js`), puis sur votre vraie page Systeme.io en production (prompt 7) ;
- la relance ne part que quatre jours après la demande, par l'envoi planifié de la production : son dessin est celui de la demande (vérifié dans le conteneur), elle se verra en production ;
- le rappel des bêta-testeurs et les e-mails d'accueil (seul leur en-tête a changé) : vérifiés dans le conteneur.

Écarts gardés avec les maquettes, à trancher par vous (détail dans la PR et dans `etat.md`, « Décisions du 20 octobre (lot 4.8) ») : initiales de l'avatar sur votre couleur d'accent ; titres des bandeaux en Encre ; coins « nets » toujours par défaut pour les widgets ; note de 4,7 dessinée en quatre étoiles et demie ; squelette d'un widget en pause le temps de la réponse ; photo de l'auteur absente de « Nouveau témoignage ». Ne les relevez pas comme des défauts dans les comptes rendus.

---

## 0. Supabase — réveiller la base de recette (si besoin)

Si la dernière recette date de plus d'une semaine, lancez d'abord le prompt 0 bis de `docs-internes/recette/lot-4-1-decisions.md`, dans Claude in Chrome.

---

## 1. GitHub — l'espace de démonstration (A, plan Essentiel)

À coller dans Claude in Chrome.

```
Tu m'aides à remplir l'espace de démonstration de PULSACITY sur la base de recette, depuis la branche de la PR #47.

Où : https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml

Étapes :
1. Clique sur « Run workflow ».
2. « Use workflow from » : choisis la branche claude/sweet-ritchie-zo9fad (pas main).
3. « Adresse e-mail du compte de recette » : demande-la-moi et mets celle que je te donne.
4. Plan : essentiel.
5. Clique sur « Run workflow », puis attends la fin : l'exécution doit être verte.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Vérification : la dernière exécution de « Recette demo space » est verte, sur la branche claude/sweet-ritchie-zo9fad.

Compte rendu à me donner : la branche choisie, le plan, et la couleur de l'exécution. Pas l'adresse e-mail.
```

---

## 2. Recette — « Votre lien », l'aperçu de la demande, le widget, « Code du widget »

Avant ce prompt : déconnectez-vous de l'aperçu si besoin, fenêtre en grand. Si l'aperçu demande de vous identifier à Vercel, faites-le vous-même. La boîte de réception de A est ouverte dans un onglet du groupe « PULSACITY ».

```
Tu fais la recette du lot 4.8 de PULSACITY sur l'aperçu https://pulsacity-git-claude-sweet-ritc-38d706-jawadboughalems-projects.vercel.app, fenêtre en grand (1440 px environ). Pour chaque point, note « OK » ou décris ce que tu vois. Les maquettes sont dans https://github.com/jawadboughalem/PULSACITY/tree/claude/sweet-ritchie-zo9fad/docs-internes/design-v2/maquettes : ouvre celles que je cite et note toute différence de disposition, de couleur ou d'espacement. Ne crée aucun compte. Ne recopie dans le compte rendu aucune adresse e-mail ni aucun lien de connexion. Ne relève pas les erreurs réseau vues par ton outil de surveillance du navigateur : elles ne font pas foi.

A. « Votre lien »
1. Ouvre /connexion sur l'aperçu, demande-moi l'adresse A, saisis-la et demande le lien.
2. Dans la boîte de réception de A, ouvre l'e-mail « Votre lien pour entrer dans PULSACITY ». Compare à v2-email-votre-lien-desktop-01.png : en haut le petit symbole PULSACITY et « PULSACITY », une carte blanche sur fond bleu très pâle, un titre, une phrase, le bouton jaune « Accéder à mon espace », puis « Le bouton ne s'affiche pas ? Ouvrez ce lien : » et le lien en clair. Le lien en clair est court : l'adresse de l'aperçu suivie de « /entrer/ » et d'un code, sans « api », « token » ni « callback ». Sous la carte, en petit gris, pourquoi cet e-mail est arrivé, puis « PULSACITY ».
3. Clique le bouton : tu arrives dans l'espace (/app), connecté.

B. L'aperçu de l'e-mail de demande
4. Ouvre Réglages (/app/reglages). Clique « Voir l'e-mail de demande ». Une fenêtre montre l'e-mail : en haut « De : Julie Nutrition via PULSACITY · Objet : Camille, votre avis sur Programme 30 jours ? », puis la carte : les initiales « JN » et « Julie Nutrition », « Bonjour Camille, », trois paragraphes, le bouton vert « Donner mon avis », le lien en clair, « Merci d'avance, » et « Julie Nutrition » ; sous la carte, la raison de l'e-mail, « Ne plus recevoir ces e-mails », « Envoyé avec PULSACITY pour Julie Nutrition ». Compare à v2-email-demande-desktop-01.png. Aucune durée (« 1 minute », « 60 secondes ») n'apparaît. Ferme la fenêtre.

C. Le widget dans l'éditeur
5. Ouvre Widgets (/app/widgets), puis le mur. À droite, « Aperçu en direct » : un résumé (les étoiles et « …/5 · … avis » en gras léger), puis des cartes sans bord ni ombre, dans cet ordre : les étoiles vertes, la citation entre guillemets, puis l'avatar rond aux initiales, le nom en gras, le titre et « Avis du …, achat en … » en gris. Sous les cartes : « Sélection de Julie Nutrition : … », « À propos de ces avis » souligné, « Propulsé par » suivi du logo PULSACITY dessiné (une petite fusée et le mot). Compare à v2-widget-page-claire-desktop-01-badge-carrousel-mur.png (le mur, en bas).
6. Thème : choisis « Sombre » : les cartes deviennent gris très foncé, le texte clair, les étoiles jaune soleil (le vert ressort trop peu sur le foncé). Reviens à « Auto ».
7. Coins des cartes : « Arrondis » arrondit nettement les cartes et le bouton « Voir les … autres avis » s'il est affiché ; reviens à « Droits ».
8. Reviens à la liste. Clique « Créer un widget », puis dans l'éditeur choisis le type « Carrousel ». Dans son aperçu : des cartes (étoiles, citation, auteur en bas), deux flèches carrées bordées de 48 px de part et d'autre (celle de gauche estompée au début), des points dessous. Clique la flèche de droite : le carrousel avance d'une carte, la flèche de gauche s'active. Compare à v2-widget-carrousel-desktop-01-fleche-suivante.png.
9. De la même façon, crée un widget de type « Badge ». Son aperçu : une pilule gris très clair avec trois avatars qui se chevauchent, cinq étoiles, « …/5 · … avis » en gras léger ; dessous ou à côté, « À propos de ces avis » et « Propulsé par ». Compare à v2-widget-badge-desktop-01-clair.png.

D. L'exemple de l'accueil
10. Ouvre l'accueil de l'aperçu (/), section « Il prend les couleurs de votre page ». Essaie Mur, Carrousel, Badge, puis Sombre : le widget a le même dessin qu'au point 5 (cartes blanches sur la page beige de Julie, étoiles vertes ; en sombre, cartes foncées et étoiles jaunes), et la page sous le cadre ne saute pas quand tu changes de type.

E. « Code du widget »
11. Règle la fenêtre sur 360 px de large (mode appareil). Ouvre l'éditeur du mur : « Installer le widget », « Plus simple depuis un ordinateur ». Clique « M'envoyer le code ».
12. Dans la boîte de A, ouvre l'e-mail « Le code de votre widget PULSACITY ». Compare à v2-email-code-du-widget-desktop-01.png : la même carte que « Votre lien », « Bonjour, », une phrase, le code dans un encadré bleu très pâle, puis « Coller dans Systeme.io, en … » et les étapes numérotées, et « Voir les guides » en bas. Remets la fenêtre en grand.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Aucune adresse e-mail, aucun lien.
```

---

## 3. Recette de bout en bout avec B — la demande, la page de collecte, « Nouveau témoignage »

Avant ce prompt : toujours connecté à l'aperçu avec A, fenêtre en grand. La boîte de réception de B est ouverte dans un onglet du groupe « PULSACITY ».

```
Tu continues la recette du lot 4.8 de PULSACITY sur l'aperçu https://pulsacity-git-claude-sweet-ritc-38d706-jawadboughalems-projects.vercel.app, connecté à l'espace « Julie Nutrition », fenêtre en grand. Pour chaque point, note « OK » ou décris ce que tu vois. Maquettes : https://github.com/jawadboughalem/PULSACITY/tree/claude/sweet-ritchie-zo9fad/docs-internes/design-v2/maquettes. N'envoie rien à une adresse en @exemple.fr. Ne recopie dans le compte rendu aucune adresse e-mail ni aucun lien.

A. La demande
1. Ouvre Demandes (/app/demandes) et clique « Demander un avis ». Prénom : Camille ; adresse : demande-moi l'adresse B ; offre : « Programme 30 jours » ; date d'achat : celle proposée ; coche « Cette personne a acheté cette offre auprès de moi. » ; clique « Envoyer la demande ».
2. Dans la boîte de B, ouvre l'e-mail. Expéditeur affiché : « Julie Nutrition » ; objet : « Camille, votre avis sur Programme 30 jours ? ». Compare à v2-email-demande-desktop-01.png : comme l'aperçu de Réglages, avec le bouton vert « Donner mon avis ». En bas : « Ne plus recevoir ces e-mails » (ne clique pas) ; son lien commence par l'adresse de l'aperçu suivie de « /desinscription/ ».
3. Dans Gmail, menu « ⋮ » de l'e-mail, « Afficher l'original » : la partie « text/plain » existe et se lit comme une lettre (Bonjour Camille, les paragraphes, « Donner mon avis : » puis le lien, la signature, puis « -- » et les mentions). Compare à v2-email-demande-version-texte-desktop-01.png. Ferme l'onglet.

B. La page de collecte, sur ordinateur
4. Clique « Donner mon avis ». Compare à v2-collecte-page-desktop-01-arrivee.png : la page teintée d'un vert très pâle, en haut les initiales « JN » sur un rond vert et « Julie Nutrition », une carte blanche centrée : le titre, « Julie Nutrition lira chaque mot. Une note et quelques mots suffisent. », cinq grandes étoiles vides, le champ de l'avis, la photo (un rond en pointillés), le prénom, la case de consentement sur fond gris très clair, le bouton vert « Envoyer mon avis » sur toute la largeur. Sous la carte, « Propulsé par PULSACITY » en petit.
5. Clique « Envoyer mon avis » sans rien remplir : un bandeau en haut de la carte et les messages sous les champs manquants. Compare à v2-collecte-page-desktop-04-champs-manquants.png.
6. Choisis 5 étoiles (elles deviennent vertes), écris « Avis de recette du lot 4.8, merci. », ajoute une photo de toi ou n'importe quelle image (demande-moi si tu n'en trouves pas) : elle prend la place du rond, recadrée. Ne coche pas la case et envoie : seule la case est signalée. Compare à v2-collecte-page-desktop-03-consentement-manquant.png.
7. Coche la case et envoie : « Envoi… » apparaît un instant dans le bouton, puis le remerciement. Compare à v2-collecte-page-desktop-07-envoi-reussi.png : le message de remerciement sur la teinte verte, avec le rond vert aux initiales, puis le récapitulatif de ton avis (étoiles vertes, texte).
8. Ouvre à nouveau le lien « Donner mon avis » de l'e-mail : « Ce lien n'est plus actif », avec un lien « Écrire à Julie Nutrition ». Compare à v2-collecte-page-desktop-08-lien-plus-actif.png.

C. « Nouveau témoignage »
9. Dans la boîte de A, ouvre l'e-mail « Nouveau témoignage de Camille (5/5) ». Compare à v2-email-nouveau-temoignage-desktop-01-standard.png : la carte PULSACITY, la note, la citation dans un encadré bleu très pâle, d'où vient l'avis (la demande, l'offre), le bouton jaune « Ouvrir mon espace ».

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Aucune adresse e-mail, aucun lien.
```

---

## 4. Recette — la page de collecte générale, à 360 px

```
Tu continues la recette du lot 4.8 de PULSACITY sur l'aperçu https://pulsacity-git-claude-sweet-ritc-38d706-jawadboughalems-projects.vercel.app. Règle la fenêtre (ou le mode appareil) sur 360 px de large. Pour chaque point, note « OK » ou décris ce que tu vois. Rien ne doit déborder sur le côté : pas de défilement horizontal. Maquettes : https://github.com/jawadboughalem/PULSACITY/tree/claude/sweet-ritchie-zo9fad/docs-internes/design-v2/maquettes (fichiers « v2-collecte-page-mobile-… »).

1. Dans Réglages (/app/reglages), lis « Adresse de votre page de collecte » et ouvre cette adresse dans un nouvel onglet (la page générale, sans offre).
2. Compare à v2-collecte-page-mobile-09-page-generale.png : une bande vert très pâle en haut avec « JN » et « Julie Nutrition », puis la page blanche : le titre, la phrase, les étoiles, les champs, le bouton vert sur toute la largeur, « Propulsé par PULSACITY » en bas.
3. Touche la troisième étoile : trois étoiles vertes. Compare à v2-collecte-page-mobile-01-note-choisie.png.
4. Clique « Envoyer mon avis » sans texte : les messages s'affichent sans rien décaler sur le côté. Compare à v2-collecte-page-mobile-04-champs-manquants.png.
5. Écris « Avis de recette à 360 px. », prénom « Recette », coche la case, envoie : le remerciement. Compare à v2-collecte-page-mobile-07-envoi-reussi.png.
6. Remets la fenêtre en grand. Dans Témoignages, l'avis « Recette » est arrivé, en attente.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 5. Recette de bout en bout avec B — la correction, le motif, la désinscription

Avant ce prompt : connecté à l'aperçu avec A, fenêtre en grand ; la boîte de B ouverte.

```
Tu continues la recette du lot 4.8 de PULSACITY sur l'aperçu https://pulsacity-git-claude-sweet-ritc-38d706-jawadboughalems-projects.vercel.app, connecté à l'espace « Julie Nutrition », fenêtre en grand. Tu ne touches qu'à l'avis de Camille arrivé au prompt précédent (« Avis de recette du lot 4.8, merci. ») : jamais à un autre avis, car un e-mail partirait à un client en @exemple.fr. Pour chaque point, note « OK » ou décris ce que tu vois. Maquettes : https://github.com/jawadboughalem/PULSACITY/tree/claude/sweet-ritchie-zo9fad/docs-internes/design-v2/maquettes. Ne recopie dans le compte rendu aucune adresse e-mail ni aucun lien.

A. La correction acceptée
1. Dans Témoignages, ouvre l'avis de Camille et clique « Valider ».
2. Clique « Corriger le texte affiché », remplace le texte par « Avis de recette du lot 4.8. Merci ! » et clique « Envoyer à Camille pour accord ».
3. Dans la boîte de B, ouvre l'e-mail « Camille, puis-je corriger votre avis ? ». Compare à v2-email-accord-correction-desktop-01.png : la carte au nom de Julie Nutrition, l'ancien et le nouveau texte, le bouton vert « Accepter la correction », « Ne plus recevoir ces e-mails » en bas.
4. Clique le bouton : la page « Puis-je corriger votre avis ? », sur la teinte verte, avec « JN » et « Julie Nutrition » en haut, les deux versions et deux boutons (« Accepter la correction », vert, et « Garder mon texte »). Clique « Accepter la correction » : la page « Correction acceptée ». Compare à v2-collecte-correction-desktop-01-acceptee.png : un rond avec une icône, le titre, deux lignes, et « Écrire à Julie Nutrition » en lien discret.
5. Ouvre à nouveau le lien de l'e-mail : « Vous avez déjà répondu ». Compare à v2-collecte-correction-desktop-03-deja-repondu.png.

B. Le motif
6. Dans l'espace, sur l'avis de Camille, clique « Masquer », choisis un motif (par exemple le premier de la liste) et clique « Masquer l'avis ».
7. Dans la boîte de B, ouvre l'e-mail « Camille, votre avis n'est pas affiché ». Compare à v2-email-motif-avis-masque-desktop-01.png.

C. La désinscription
8. Dans la boîte de B, rouvre l'e-mail de demande du prompt 3 et clique « Ne plus recevoir ces e-mails ». Compare à v2-collecte-desinscription-desktop-01-confirmee.png : la teinte verte, « JN » et « Julie Nutrition », la carte blanche qui confirme, « Propulsé par PULSACITY » dessous.
9. Ouvre l'adresse de l'aperçu suivie de « /desinscription/recette-lien-faux » : la page « lien invalide », sans nom d'espace. Compare à v2-collecte-desinscription-desktop-02-lien-invalide.png.
10. Règle la fenêtre sur 360 px et recharge les pages des points 8 et 9 : rien ne déborde. Compare aux maquettes « mobile » correspondantes.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Aucune adresse e-mail, aucun lien.
```

---

## 6. À faire vous-même — les e-mails dans Outlook et dans Apple Mail

Claude in Chrome ne voit que le navigateur : ce contrôle se fait à la main, en quelques minutes. Les e-mails de A (« Votre lien », « Code du widget », « Nouveau témoignage ») et de B (demande, demande d'accord, motif) sont déjà dans vos boîtes.

- **Outlook** (bureau, Windows) : ouvrez deux ou trois de ces e-mails. Attendu : la carte blanche aux coins carrés (Outlook n'arrondit pas), le bouton plein, de la bonne couleur, avec son texte centré, lisible ; le lien en clair sous le bouton ; aucun texte coupé. Si Outlook bloque les images, le symbole PULSACITY manque en haut : « Télécharger les images » le fait apparaître, le reste se lit sans.
- **Apple Mail** (maison, Mac, et sur iPhone si votre messagerie y est) : les mêmes e-mails. Attendu : la carte arrondie, le bouton arrondi ; sur l'iPhone, la carte occupe la largeur, le bouton fait toute la largeur ou presque, le texte n'est pas minuscule.
- En mode sombre (Apple Mail ou l'application Gmail), notez si un texte devient illisible.

Compte rendu à me renvoyer : pour chaque messagerie, « OK » ou ce qui ne va pas, avec une capture si possible (sans adresse e-mail visible).

---

## 7. Après la fusion — vérification en production (à la toute fin)

À lancer avec les vérifications en production des autres lots, sur pulsacity.com, une fois la PR #47 fusionnée et la production en ligne.

```
Tu vérifies en production le lot 4.8 de PULSACITY : le widget sur ma vraie page Systeme.io, et la page de collecte. Je suis connecté à mon espace sur https://pulsacity.com et à Systeme.io. Tu ne crées aucun compte, tu ne modifies aucun réglage de Systeme.io et tu ne publies rien.

1. Demande-moi l'adresse de ma page de vente Systeme.io où le widget est collé (celle de la vérification du lot 5), et ouvre-la, fenêtre en grand. Si tu n'en as pas, arrête-toi et dis-le-moi.
2. Recharge la page en regardant l'endroit du widget : un squelette gris clair (cartes, lignes en pilule) occupe sa place, puis les avis arrivent sans que la page saute.
3. Le widget a le dessin v2 : cartes sans bord ni ombre (blanches si la section est teintée), étoiles, citation, puis l'auteur en bas ; « 4,7/5 · … avis » en gras léger ; « À propos de ces avis » et « Propulsé par » suivi du logo PULSACITY dessiné. Les polices sont celles de ma page.
4. Si c'est un mur : « Voir les … autres avis » ajoute des avis. Si c'est un carrousel : les flèches et les points font avancer les cartes.
5. Règle la fenêtre sur 360 px : le widget tient dans la largeur, sans débordement ; le mur passe en une colonne, ou en deux avec l'avatar au-dessus du nom.
6. Sur https://pulsacity.com/connexion, demande un lien pour mon adresse (demande-la-moi) : dans l'e-mail, le lien en clair commence par « https://pulsacity.com/entrer/ ». Clique le bouton : j'arrive dans mon espace.
7. Dans mon espace, Réglages, lis l'adresse de ma page de collecte et ouvre-la : la page v2 (teinte de ma couleur, carte blanche, bouton à ma couleur). N'envoie rien.

Compte rendu à me donner : chaque point avec « OK » ou ce que tu as vu. Aucune adresse e-mail, aucun lien.
```
