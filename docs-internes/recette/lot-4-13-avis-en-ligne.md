# Lot 4.13 — Les avis en ligne : vos actions et la recette

Adresse de l'aperçu (PR #43) : https://pulsacity-git-claude-affectiona-24a504-jawadboughalems-projects.vercel.app

Dans l'ordre :
- Prompt 0 : si la dernière recette date de plus d'une semaine, réveiller la base de recette (prompt 0 bis de `lot-4-1-decisions.md`).
- Prompt 1 : GitHub, la migration de recette et l'espace de démonstration (A, plan Gratuit).
- Prompt 2 : recette, la fiche d'un témoignage : les cinq provenances, le masquage avec motif, les corrections, un nom masqué.
- Prompt 3 : recette, l'aperçu du widget : dates, sélection, « À propos de ces avis », note du badge.
- Prompt 4 : recette, la contrepartie (Réglages, widget, page de collecte).
- Prompt 5 : recette, la page publique « À propos de ces avis ».
- Prompt 6 : recette de bout en bout avec votre adresse B : une demande, votre avis, une correction refusée.
- Prompt 7 : recette de bout en bout : une correction acceptée, la limite de deux, « Masquer un nom ou une coordonnée ».
- Prompt 8 : recette de bout en bout : « Masquer » avec un motif, l'e-mail du motif, la note du badge.
- Prompt 9 : Supabase (lecture seule), ce que la base a enregistré.
- Prompt 10 : à 360 px.
- Après la fusion : prompt 11 (vérification en production, à la toute fin avec celles des autres lots).

Deux adresses, à garder pour vous (jamais dans un compte rendu) :
- **A** : celle des recettes précédentes, l'espace « Julie Nutrition » de la recette ;
- **B** : une autre de vos adresses (un alias suffit), qui joue la cliente : elle reçoit la demande, la correction et le motif. Sa boîte de réception est ouverte dans un onglet du groupe « PULSACITY ».

Aucun compte n'est créé. Les clients de l'espace de démonstration ont des adresses en `@exemple.fr`, qui ne sont pas à vous : les prompts ne masquent ni ne corrigent jamais leurs avis (un e-mail leur partirait). Tout ce qui envoie un e-mail se fait sur l'avis de B.

Déjà vérifié par Claude Code dans son conteneur :
- chaque état de la fiche (maquettes 3.4, fiche 01 à 15), la fenêtre « Masquer » (motif manquant, « Autre motif »), la page de réponse à une correction, « À propos de ces avis », l'aperçu du widget, la page de collecte avec la contrepartie, à 1440 et 360 px dans Chromium, à côté des maquettes ;
- par des tests : la provenance à la réception (vente reçue, demande, lien public) et son remplissage par la migration pour les avis déjà reçus ; le motif envoyé une fois, jamais à un client désinscrit ni sans adresse, renvoyé par la tâche planifiée s'il n'est pas parti ; la correction acceptée (le texte affiché change, l'original jamais), refusée (rien ne change), annulée, la limite de deux, une seule en attente ; le passage masqué ; la note du badge (en attente comprise, masqués avec un motif exclus) ; les deux e-mails ; l'export ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts`, qui échoue déjà sur `main` dans ce conteneur et passe en CI ; `w.js` : 10,2 Ko gzip.

Ce que la recette ne voit pas : sur un aperçu, la protection de Vercel bloque les données du widget demandées depuis une autre page ; le widget se vérifie dans son aperçu de l'éditeur ici, et sur une vraie page Systeme.io en production (prompt 11).

---

## 1. GitHub — la migration de recette et l'espace de démonstration

```
Tu m'aides à préparer la recette du lot 4.13 de PULSACITY, sur la base de recette, depuis la branche de la PR #43.

Où : https://github.com/jawadboughalem/PULSACITY/actions

Étapes :
1. Dans https://github.com/jawadboughalem/PULSACITY/actions/workflows/db-migrate-recette.yml , vérifie que la dernière exécution sur la branche claude/affectionate-mccarthy-2dhrsy est verte (elle applique la migration 0014). Si elle est rouge ou absente, arrête-toi et dis-le-moi.
2. Ouvre https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml et clique sur « Run workflow ».
3. « Use workflow from » : la branche claude/affectionate-mccarthy-2dhrsy (pas main).
4. « Adresse e-mail du compte de recette » : demande-moi l'adresse A et mets celle que je te donne. Plan : free.
5. Clique sur « Run workflow », attends la fin : l'exécution doit être verte.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Compte rendu à me donner : la migration de recette (couleur, date), puis l'exécution de l'espace de démonstration (branche, plan, couleur). Pas l'adresse e-mail.
```

---

## 2. Recette — la fiche d'un témoignage

Avant ce prompt : connectez-vous à l'aperçu avec l'adresse A (lien de connexion reçu sur A), fenêtre en grand.

```
Tu fais la recette de la fiche d'un témoignage de PULSACITY sur l'aperçu où je suis connecté, fenêtre en grand : https://pulsacity-git-claude-affectiona-24a504-jawadboughalems-projects.vercel.app/app/temoignages

Règle absolue : tu ne cliques sur aucun bouton « Masquer », « Masquer l'avis », « Corriger le texte affiché », « Envoyer la correction », « Valider » ni « Supprimer définitivement » dans ce prompt. Tu lis seulement, et tu ouvres et refermes « Texte original de … ». Pour chaque point, note « OK » ou décris ce que tu vois.

Ouvre chaque témoignage depuis la liste (filtre « Statut » sur « Tous » si besoin), en cliquant sur son nom.

1. Manon G. : bloc « Provenance » à droite : « Vente reçue · Systeme.io », « Achat du … · demande envoyée le …, réponse après … jours », puis en plus petit « Dans vos widgets : avis du …, achat en … ». Sous « Texte affiché », un bandeau vert « Manon G. a accepté votre correction le … » et « Le texte corrigé s'affiche. L'original reste gardé, ci-dessous. » Le texte affiché dit « comment composer une assiette ». Ouvre « Texte original de Manon » : il dit « comment composé une assiette », avec « Envoyé le … · conservé tel quel, non modifiable ». Pas de bouton « Corriger le texte affiché ».
2. Camille R. : « Demande manuelle », « Achat du … · demande envoyée le …, réponse après … ». Sous « Texte affiché », un bandeau « Correction envoyée à Camille R. le … » avec « Elle s'affichera quand Camille l'acceptera. En attendant, le texte d'origine reste affiché. » et le lien « Annuler la correction » (ne clique pas). Puis deux encadrés : « Affiché aujourd'hui » (« En 30 jours j'ai arrêté… ») et « Correction proposée » (« En 30 jours, j'ai arrêté… ») sur fond bleu.
3. Thomas L. : « Ajout », « Ajouté par vous le … · date d'achat inconnue », « Dans vos widgets : avis du … » (sans achat).
4. Jade K. : « Import », « Importé par vous le … · date d'achat inconnue ».
5. Inès V. : « Lien public », « Laissé depuis votre lien de collecte · date d'achat inconnue ».
6. Pour Thomas, Jade et Inès : sous le texte affiché, « Sans adresse e-mail de …, une correction ne peut pas lui être proposée : vous pouvez masquer un nom ou une coordonnée. » et seulement le lien « Masquer un nom ou une coordonnée » (pas de bouton « Corriger le texte affiché »).
7. Kévin R. (statut Masqué) : en haut, un bandeau gris « Masqué le … » et « Motif envoyé à Kévin R. : « Il ne parle pas de mon offre ». » Le bouton en haut à droite est « Valider ».
8. Arthur B. (Masqué) : « Masqué le … » et « Motif gardé avec l'avis : « La personne m'a demandé de le retirer ». Sans adresse e-mail, il n'est pas envoyé. »
9. Emma S. : dans le texte affiché, « Ma fille » suivi d'une pastille grise « nom masqué », puis « en redemande ». « Texte original d'Emma » dit « Ma fille Léna en redemande ».
10. Nadia B. (En attente) : clique sur « Masquer » en haut à droite, sans rien choisir. Une fenêtre « Masquer l'avis de Nadia B. ? » s'ouvre, avec « Motif », « Nadia B. le reçoit par e-mail, avec votre nom. » et six choix : « Il ne parle pas de mon offre », « Il contient des propos insultants ou discriminants », « Il donne des informations personnelles », « Il ne vient pas d'un de mes clients », « La personne m'a demandé de le retirer », « Autre motif ». Choisis « Autre motif » : un champ « Précisez le motif » apparaît. Puis clique sur « Annuler » (surtout pas « Masquer l'avis ») : la fenêtre se ferme, Nadia B. reste En attente.
11. Sur chaque fiche ouverte : aucune mention « vérifié », « avis vérifiés » ni « authentifié ».

Compte rendu à me donner : les 11 points, OK ou ce que tu vois, avec les phrases exactes quand elles diffèrent.
```

---

## 3. Recette — l'aperçu du widget

```
Tu fais la recette de l'aperçu du widget de PULSACITY sur l'aperçu où je suis connecté, fenêtre en grand : https://pulsacity-git-claude-affectiona-24a504-jawadboughalems-projects.vercel.app/app/widgets

Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre le widget « Mur · Toutes les offres ». À gauche, sous « Afficher », seulement « Photo » et « Note en étoiles » : plus de case « Date ».
2. Dans « Aperçu en direct », en haut du mur : « 4,7/5 · 12 avis » (12 = les avis validés et en attente ; Arthur B. et Kévin R., masqués pour un motif, ne comptent pas).
3. Sous le nom de chaque carte, une ligne de dates : Camille R. et Manon G. ont « Avis du …, achat en … » (un mois et une année) ; les autres « Avis du … » seulement. Sous Emma S., le texte dit « Ma fille [nom masqué] en redemande ». Manon G. montre le texte corrigé (« composer »).
4. Fais défiler l'aperçu jusqu'en bas du mur : « Sélection de Julie Nutrition : avis mis en avant, puis les plus récents. », puis un lien « À propos de ces avis », à part de « Propulsé par PULSACITY ». Survole le lien « À propos de ces avis » : il mène à /a-propos-des-avis.
5. Dans « Type », choisis « Carrousel » : la même ligne « Sélection de Julie Nutrition… » et le lien « À propos de ces avis » sous le carrousel.
6. Choisis « Badge » : « 4,7/5 · 12 avis » avec trois avatars, et le lien « À propos de ces avis ».
7. Remets le type « Mur ». Le réglage s'enregistre seul (« Enregistré automatiquement »).

Compte rendu à me donner : les 7 points, OK ou ce que tu vois.
```

---

## 4. Recette — la contrepartie

```
Tu fais la recette de la contrepartie de PULSACITY sur l'aperçu où je suis connecté, fenêtre en grand.

Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre https://pulsacity-git-claude-affectiona-24a504-jawadboughalems-projects.vercel.app/t/julie-nutrition dans un nouvel onglet (si l'adresse a un suffixe, prends l'adresse affichée dans Réglages, « Adresse de votre page de collecte »). Au-dessus du formulaire : aucun encadré sur une contrepartie.
2. Ouvre Réglages (/app/reglages). Coche « J'offre une contrepartie à mes clients » et enregistre.
3. Recharge la page de collecte : un encadré avec une icône de cadeau, « Julie Nutrition offre une contrepartie pour chaque avis, quel qu'il soit. Elle est indiquée avec les avis publiés. », au-dessus de « Votre note ».
4. Ouvre Widgets › « Mur · Toutes les offres », et fais défiler l'aperçu jusqu'en bas : « Certains clients ont reçu une contrepartie pour leur avis. » entre la ligne de sélection et « À propos de ces avis ».
5. Retourne dans Réglages, décoche la case, enregistre. Recharge la page de collecte : l'encadré a disparu.

Compte rendu à me donner : les 5 points, OK ou ce que tu vois.
```

---

## 5. Recette — la page publique « À propos de ces avis »

```
Tu fais la recette d'une page publique de PULSACITY, fenêtre en grand : https://pulsacity-git-claude-affectiona-24a504-jawadboughalems-projects.vercel.app/a-propos-des-avis

Tu ne modifies rien. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Fil d'Ariane « Accueil › À propos de ces avis », titre « À propos de ces avis », phrase « Les témoignages affichés avec PULSACITY suivent les règles de cette page. Elles valent pour tous les créateurs, quel que soit leur plan. »
2. À droite, un encadré blanc « Sur cette page » avec sept titres : « D'où viennent les avis », « Les dates », « Contrepartie », « Modification », « Ordre d'affichage », « Motifs de refus », « Une question sur un avis ». Clique sur « Motifs de refus » : la page y descend, et ce titre est surligné en bleu clair dans l'encadré.
3. « Contrepartie » cite les deux mentions : « Certains clients ont reçu une contrepartie pour leur avis. » et « Bêta-testeur · plan Essentiel offert pendant la bêta ».
4. « Motifs de refus » liste six motifs, du point de vue du lecteur (« Il ne parle pas de l'offre achetée », …, « Autre motif, précisé à l'auteur »).
5. « Une question sur un avis » : le lien « écrivez à l'équipe PULSACITY » mène à /aide#contact (« Écrivez-nous »).
6. Nulle part sur la page : « vérifié », « avis vérifiés », « authentifié ».
7. Ouvre le code source de la page (view-source:) et cherche « robots » : la balise dit « noindex » (la page reste hors des moteurs de recherche tant que les textes légaux ne sont pas validés). Ouvre /sitemap.xml : « a-propos-des-avis » n'y est pas.

Compte rendu à me donner : les 7 points, OK ou ce que tu vois.
```

---

## 6. Recette de bout en bout — une demande, votre avis, une correction refusée

Avant ce prompt : connecté à l'aperçu avec A ; la boîte de B ouverte dans un autre onglet.

```
Tu fais une recette de bout en bout de PULSACITY sur l'aperçu où je suis connecté (adresse A), avec une deuxième adresse, B, qui joue la cliente. Sa boîte de réception est ouverte dans un autre onglet. Tu ne crées aucun compte.

Aperçu : https://pulsacity-git-claude-affectiona-24a504-jawadboughalems-projects.vercel.app

Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre /app/demandes, clique sur « Demander un avis ». Demande-moi l'adresse B et mets-la ; prénom « Clara », nom « Test » ; offre « Atelier cuisine » ; coche la case, envoie. Attendu : la demande est envoyée.
2. Dans la boîte de B : l'e-mail « Clara, votre avis sur Atelier cuisine ? », au nom de Julie Nutrition. Clique sur « Donner mon avis (1 minute) ».
3. Sur la page de collecte : 5 étoiles, le texte « Les recettes sont simples et rapide. Je les refais chaque semaine. », le nom « Clara T. », coche le consentement, « Envoyer mon avis ». Attendu : la page de remerciement.
4. Dans l'espace (onglet A), Témoignages : « Clara T. » en attente. Ouvre sa fiche. Provenance : « Demande manuelle », « Achat du … (aujourd'hui) · demande envoyée le …, réponse après … ». Sous le texte affiché : « Une correction part à Clara T. pour accord : elle ne s'affiche qu'avec son accord. Sans accord, vous pouvez masquer un nom ou une coordonnée. », le bouton « Corriger le texte affiché » et le lien « Masquer un nom ou une coordonnée ».
5. Clique sur « Corriger le texte affiché ». Dans le champ, remplace « simples et rapide » par « simples et rapides », puis « Envoyer à Clara T. pour accord ». Attendu : le bandeau « Correction envoyée à Clara T. le … », « Affiché aujourd'hui » (ancien texte), « Correction proposée » (nouveau texte).
6. Dans la boîte de B : l'e-mail « Clara, puis-je corriger votre avis ? », au nom de Julie Nutrition. « Votre texte », « Le texte corrigé » avec « rapides » en gras souligné, « Rien ne change sans votre accord. Votre texte d'origine reste gardé. », deux boutons « Accepter la correction » et « Garder mon texte », « Sans réponse de votre part, votre texte d'origine reste affiché. », et le lien « Ne plus recevoir ces e-mails » en bas (ne clique pas dessus).
7. Clique sur « Garder mon texte ». Une page s'ouvre : « Puis-je corriger votre avis ? », les deux versions, et les deux boutons. Rien n'est encore décidé. Clique sur « Garder mon texte » sur cette page. Attendu : « Votre texte reste tel quel », « C'est noté. Julie Nutrition garde votre avis avec votre texte d'origine. », et « Écrire à Julie Nutrition ».
8. Recharge cette page : « Vous avez déjà répondu », « Votre réponse à cette correction est bien enregistrée. »
9. Dans l'espace, recharge la fiche de Clara T. : un bandeau « Clara T. a refusé votre correction le … » avec « Le texte d'origine reste affiché. Vous pouvez masquer un nom ou une coordonnée, ou masquer l'avis. » ; le texte affiché est resté « simples et rapide ».

Compte rendu à me donner : les 9 points, OK ou ce que tu vois, avec les phrases exactes des bandeaux et des pages. Pas les adresses e-mail.
```

---

## 7. Recette de bout en bout — une correction acceptée, la limite de deux, un nom masqué

```
Tu continues la recette de bout en bout de PULSACITY sur l'aperçu où je suis connecté (adresse A), avec la boîte de B ouverte dans un autre onglet. Aperçu : https://pulsacity-git-claude-affectiona-24a504-jawadboughalems-projects.vercel.app

Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre la fiche de Clara T. Clique sur « Corriger le texte affiché », remplace « simples et rapide » par « simples et rapides », puis « Envoyer à Clara T. pour accord ».
2. Dans la boîte de B, ouvre le nouvel e-mail « Clara, puis-je corriger votre avis ? », clique sur « Accepter la correction », puis sur la page qui s'ouvre, « Accepter la correction ». Attendu : « Correction acceptée », « Merci. Votre avis s'affiche désormais avec le texte corrigé. », « Votre texte d'origine reste gardé, tel que vous l'avez écrit. »
3. Recharge la fiche de Clara T. : bandeau vert « Clara T. a accepté votre correction le … », le texte affiché dit « simples et rapides » ; « Texte original de Clara » dit toujours « simples et rapide ».
4. Sous le texte affiché, ni « Corriger le texte affiché » ni « Masquer un nom ou une coordonnée » : l'auteur a accepté ce texte. Dans « Texte original de Clara », le lien « Afficher le texte original » (ne clique pas).
5. Ouvre la fiche de Hugo P. (lien public). Clique sur « Masquer un nom ou une coordonnée ». Un encadré « Masquer un nom ou une coordonnée » s'ouvre avec le texte affiché. Sélectionne le mot « budget » dans ce texte (double-clic dessus) : il se surligne en jaune. Choisis « Un nom », puis « Masquer ce passage ». Attendu : « Passage masqué. L'original reste gardé. », et dans le texte affiché une pastille grise « nom masqué » à la place du mot.
6. « Texte original de Hugo » dit toujours « pour un petit budget ».
7. Ouvre « Texte original de Hugo » et clique sur « Afficher le texte original » : le texte affiché redevient l'original, sans pastille.

Compte rendu à me donner : les 7 points, OK ou ce que tu vois. Pas les adresses e-mail.
```

---

## 8. Recette de bout en bout — « Masquer » avec un motif

```
Tu continues la recette de bout en bout de PULSACITY sur l'aperçu où je suis connecté (adresse A), avec la boîte de B ouverte dans un autre onglet. Aperçu : https://pulsacity-git-claude-affectiona-24a504-jawadboughalems-projects.vercel.app

Tu ne masques que l'avis de Clara T., jamais un autre. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre Widgets › « Mur · Toutes les offres » : en haut de l'aperçu, « 4,7/5 · 13 avis » (l'avis de Clara T., en attente, compte déjà). Note la note exacte.
2. Ouvre la fiche de Clara T. Clique sur « Masquer », puis tout de suite sur « Masquer l'avis » sans choisir : un message rouge « Choisissez un motif : il est envoyé à Clara T. » (un seul point à la fin), et les ronds en rouge. Rien n'est masqué.
3. Choisis « Il ne vient pas d'un de mes clients », puis « Masquer l'avis ». Attendu : la fiche passe à « Masqué », un bandeau « Masqué le … » et « Motif envoyé à Clara T. : « Il ne vient pas d'un de mes clients ». »
4. Dans la boîte de B : l'e-mail « Clara, votre avis n'est pas affiché », au nom de Julie Nutrition : « Je ne l'affiche pas sur mes pages, pour ce motif : », le motif en gras dans un encadré, « Votre avis n'est pas supprimé : je peux l'afficher à nouveau à tout moment. », « Une question ? Répondez simplement à cet e-mail. », le lien « À propos de ces avis », et en bas « Ne plus recevoir ces e-mails » (ne clique pas). Clique sur « À propos de ces avis » : la page publique s'ouvre.
5. Ouvre Widgets › « Mur · Toutes les offres » : « 4,7/5 · 12 avis » (l'avis masqué pour un motif ne compte plus dans la note).
6. Retourne sur la fiche de Clara T., clique sur « Valider » : elle passe à Validé, le bandeau de masquage disparaît.
7. Clique sur « Masquer », choisis « Autre motif » sans rien écrire, « Masquer l'avis » : « Écrivez le motif en quelques mots : Clara T. le lira tel quel. » Écris « Test de la recette », puis « Masquer l'avis ». Attendu : bandeau « Masqué le … » et « Motif : « Test de la recette ». Clara T. a déjà reçu un motif pour cet avis : un seul e-mail par avis. »
8. Dans la boîte de B : aucun deuxième e-mail de motif (attends une minute, recharge).

Compte rendu à me donner : les 8 points, OK ou ce que tu vois, avec la note exacte des points 1 et 5. Pas les adresses e-mail.
```

---

## 9. Supabase (lecture seule) — ce que la base a enregistré

```
Tu m'aides à vérifier ce que la base de recette de PULSACITY a enregistré. Je suis connecté à Supabase.

Ce qu'il ne faut surtout pas toucher : le projet de production « PULSACITY » ; dans le projet « pulsacity-recette », tu ne modifies rien : seulement les requêtes ci-dessous, en lecture, dans l'éditeur SQL.

1. Lance :
   select provenance, count(*) from testimonials group by provenance order by provenance;
   Attendu : des lignes pour sale, request, added, import, public-link ; aucune ligne avec provenance vide (null).
2. Lance :
   select t.author_name, t.status, t.provenance, t.hidden_reason, t.hidden_reason_sent_at is not null as motif_envoye, t.display_body is not null as texte_corrige
   from testimonials t where t.author_name in ('Clara T.', 'Kévin R.', 'Arthur B.', 'Manon G.', 'Emma S.') order by t.author_name;
   Recopie le résultat (il ne contient que des données fictives).
3. Lance :
   select c.outcome, c.sent_at is not null as envoyee, c.answered_at is not null as repondue
   from testimonial_corrections c join testimonials t on t.id = c.testimonial_id
   where t.author_name = 'Clara T.' order by c.created_at;
   Attendu : deux lignes, refused puis accepted, envoyées et répondues.

Compte rendu à me donner : les trois résultats recopiés. Aucun identifiant, aucune adresse, aucun token.
```

---

## 10. Recette à 360 px

Avant ce prompt : connecté à l'aperçu avec A, fenêtre réduite à 360 × 800 (mode appareil des outils de développement).

```
Tu fais la recette de PULSACITY en largeur téléphone, 360 × 800, sur l'aperçu où je suis connecté : https://pulsacity-git-claude-affectiona-24a504-jawadboughalems-projects.vercel.app

Pour chaque page, vérifie : rien ne dépasse à droite (pas de défilement horizontal), aucun texte coupé, les boutons font toute la largeur. Note « OK » ou décris ce que tu vois.

1. La fiche de Camille R. : le bandeau de la correction en attente, les deux encadrés, puis plus bas la Provenance.
2. La fiche de Clara T. (masquée) : le bandeau de masquage sous le nom.
3. La fiche de Nadia B. : « Masquer » ouvre la fenêtre en feuille ancrée en bas, les six motifs lisibles, « Masquer l'avis » et « Annuler » pleine largeur. Clique sur « Annuler ».
4. La page publique /a-propos-des-avis : sous le titre, « Sur cette page » replié ; l'ouvrir montre les sept titres.
5. Ouvre le dernier e-mail « Clara, puis-je corriger votre avis ? » de la boîte de B, et son lien, dans ce cadre de 360 px : la page « Vous avez déjà répondu », le nom de l'espace en haut sur une bande teintée, la page blanche dessous.
6. Pour finir, la fiche de Camille R. : clique sur « Annuler la correction ». Le bandeau disparaît, « Corriger le texte affiché » revient. Aucun e-mail ne part.

Compte rendu à me donner : les 6 points, OK ou ce que tu vois.
```

---

## 11. Après la fusion — vérification en production (à la toute fin, avec celles des autres lots)

Avant ce prompt : la PR #43 est fusionnée, les workflows « CI » et « Database migration » sont verts sur `main`, Vercel a mis la production en ligne. Une vraie page Systeme.io avec le widget de votre espace de test est ouverte.

```
Tu vérifies la mise en ligne du lot 4.13 de PULSACITY en production. Tu ne modifies rien et tu ne crées aucun compte.

1. https://github.com/jawadboughalem/PULSACITY/actions/workflows/db-migrate.yml : la dernière exécution sur main est verte (migration 0014).
2. https://pulsacity.com/a-propos-des-avis s'affiche (titre « À propos de ces avis », sept sections). Dans le code source, la balise robots dit « noindex » tant que les textes légaux ne sont pas validés.
3. Sur la page Systeme.io où est collé le widget de mon espace de test (je te donne son adresse) : sous le nom de chaque avis, « Avis du … » (et « achat en … » pour un avis reçu après une demande) ; sous le mur, « Sélection de … : avis mis en avant, puis les plus récents. », puis le lien « À propos de ces avis », qui mène à pulsacity.com/a-propos-des-avis ; rien ne déborde ni ne casse la mise en page de la page.
4. Sur l'accueil de pulsacity.com, si le mur « Les avis des premiers créateurs » s'affiche : la ligne de sélection et le lien « À propos de ces avis » sont ceux du widget (une seule fois chacun).

Compte rendu à me donner : les 4 points, OK ou ce que tu vois.
```
