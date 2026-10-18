# Lot 4.12 — Accueil et acquisition : vos actions et la recette

Adresse de l'aperçu (PR #41) : https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app

Dans l'ordre :
- Prompt 0 : si la dernière recette date de plus d'une semaine, réveiller la base de recette (prompt 0 bis de `lot-4-1-decisions.md`).
- Prompt 1 : GitHub, la migration de recette et deux espaces de démonstration (A au plan Gratuit, P au plan Pro).
- Prompt 2 : Umami Cloud, le site pulsacity.com, et sa variable dans Vercel.
- Prompt 3 : Supabase (lecture seule) et Vercel, l'espace P devient « l'espace PULSACITY » de l'aperçu.
- Prompt 4 : Stripe (test), le webhook de recette vers l'aperçu de cette PR.
- Prompt 5 : recette, la source d'inscription et les liens courts, sans compte.
- Prompt 6 : recette, Parrainage dans l'espace A.
- Prompt 7 : recette, un filleul B arrive par le lien de A, s'inscrit, reçoit J0, paie ; A reçoit son mois.
- Prompt 8 : recette, l'image de partage d'un témoignage (espace A).
- Prompt 9 : recette, le mur et le badge de PULSACITY (espace P, puis un redéploiement de l'aperçu), Umami sur l'aperçu, la politique de confidentialité.
- Prompt 10 : Supabase (lecture seule), ce que la base a enregistré.
- Prompt 11 : à 360 px.
- Après la fusion : prompts 12 (l'espace PULSACITY en production), 13 (Resend Pro, avant le lancement), 14 (un code de partenaire, le jour où il arrive), 15 (vérification en production, à la toute fin avec celles des autres lots).

Trois adresses, à garder pour vous (jamais dans un compte rendu) :
- **A** : celle des recettes précédentes, l'espace « Julie Nutrition » de la recette ;
- **P** : une autre de vos adresses (un alias suffit), pour l'espace qui joue PULSACITY sur l'aperçu ;
- **B** : un troisième alias, pour le filleul que vous créez vous-même au prompt 7.

Déjà vérifié par Claude Code dans son conteneur :
- le parcours complet dans Chromium : arrivée par `/go/linkedin`, Tarifs, « Créer mon espace gratuit » (l'adresse porte la source), la question, le lien de connexion (il porte la source et la réponse), la création de l'espace : la source est enregistrée, J0 part ;
- Parrainage avec et sans filleuls, la carte « Parrainage » d'« Abonnement et factures », « Plus », la fenêtre « Partager » et les deux images, le mur et le badge avec la mention bêta-testeur, la page de désinscription des e-mails d'accueil, les quatre e-mails d'accueil, à 1440 et 360 px, sans débordement, à côté des maquettes 3.3, 3.4 et 3.6 ;
- la récompense du parrain (Gratuit, abonné, deux filleuls, Stripe qui ne répond pas, fin du mois offert), les e-mails J1, J3, J7 (échéances, arrêt à l'étape faite, jamais deux fois), sur un faux Stripe et une base de test ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts`, qui échoue déjà sur `main` dans ce conteneur et passe en CI.

Ce que la recette ne voit pas : J1, J3 et J7 attendent des jours ; ils se vérifient en production sur votre espace de test (prompt 15). Umami ne compte rien sur un aperçu (seul pulsacity.com compte) : le comptage se vérifie en production.

---

## 1. GitHub — la migration de recette et deux espaces de démonstration

```
Tu m'aides à préparer la recette du lot 4.12 de PULSACITY, sur la base de recette, depuis la branche de la PR #41.

Où : https://github.com/jawadboughalem/PULSACITY/actions

Étapes :
1. Dans https://github.com/jawadboughalem/PULSACITY/actions/workflows/db-migrate-recette.yml , vérifie que la dernière exécution sur la branche claude/lot-4-12-accueil-acquisition-318dj8 est verte (elle applique la migration 0013). Si elle est rouge ou absente, arrête-toi et dis-le-moi.
2. Ouvre https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml et clique sur « Run workflow ».
3. « Use workflow from » : la branche claude/lot-4-12-accueil-acquisition-318dj8 (pas main).
4. « Adresse e-mail du compte de recette » : demande-moi l'adresse A et mets celle que je te donne. Plan : free.
5. Clique sur « Run workflow », attends la fin : l'exécution doit être verte.
6. Recommence les étapes 2 à 5 avec l'adresse P que je te donne, plan : pro.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Compte rendu à me donner : la migration de recette (couleur, date), puis pour chaque exécution la branche, le plan et la couleur. Pas les adresses e-mail.
```

---

## 2. Umami Cloud — le site pulsacity.com, et sa variable dans Vercel

Avant ce prompt : créez vous-même votre compte sur https://cloud.umami.is (offre gratuite « Hobby », sans carte), avec contact@pulsacity.com ; si une région des données vous est proposée, prenez l'Europe. Connectez-vous aussi à Vercel. L'identifiant du site n'est pas un secret (il est lisible dans chaque page du site).

```
Tu m'aides à brancher la mesure d'audience Umami Cloud sur pulsacity.com. Je suis connecté à Umami Cloud et à Vercel.

Ce qu'il ne faut surtout pas toucher : dans Umami, rien d'autre que le site ajouté ici ; dans Vercel, aucune autre variable, ni les domaines, ni « Deployment Protection », ni un déploiement.

1. Umami Cloud (https://cloud.umami.is) : ajoute un site (« Add website » ou « Ajouter un site ») : nom « pulsacity.com », domaine « pulsacity.com ». Ne coche rien de plus (pas de partage public).
2. Ouvre les réglages de ce site et repère son identifiant (« Website ID », un UUID, aussi visible dans le « Tracking code » : data-website-id="…"). Note aussi l'adresse du script dans ce code (src="…").
3. Repère où sont gardées les statistiques (région, pays ou hébergeur, si Umami l'indique) et leur durée de conservation pour l'offre Hobby (page de facturation ou de l'offre).
4. Vercel, https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables : ajoute la variable NEXT_PUBLIC_UMAMI_WEBSITE_ID, valeur : l'identifiant de l'étape 2, environnements : Production et Preview (pas Development). Type normal, pas « Sensitive ».
5. Si l'adresse du script de l'étape 2 n'est pas exactement https://cloud.umami.is/script.js, ajoute aussi NEXT_PUBLIC_UMAMI_SCRIPT_URL avec cette adresse, Production et Preview. Sinon, n'ajoute rien.
6. Ne redéploie rien : je te le dirai.

Compte rendu à me donner : le site ajouté (nom, domaine), l'adresse du script, la région et la durée de conservation trouvées (ou « non indiquées »), les variables ajoutées et leurs environnements. L'identifiant du site peut y figurer.
```

---

## 3. Supabase (lecture seule) et Vercel — l'espace P joue « l'espace PULSACITY » de l'aperçu

Avant ce prompt : prompt 1 fait ; connectez-vous à Supabase et à Vercel.

```
Tu m'aides à désigner, sur l'aperçu de la PR #41 de PULSACITY, l'espace qui joue « l'espace PULSACITY ». Je suis connecté à Supabase et à Vercel.

Ce qu'il ne faut surtout pas toucher : le projet Supabase de production « PULSACITY » ; dans le projet de recette, tu ne modifies rien (lecture seule, une seule requête) ; dans Vercel, les variables de Production, les domaines, « Deployment Protection ».

1. Supabase, projet « pulsacity-recette », éditeur SQL. Demande-moi l'adresse P, puis lance cette requête en remplaçant ADRESSE_P (garde les apostrophes) :
   select s.id, s.name, s.plan from spaces s join "user" u on u.id = s.user_id where u.email = 'ADRESSE_P';
   Une ligne doit sortir : « Julie Nutrition », plan pro. Copie son id (un UUID).
2. Vercel, https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables : ajoute la variable PULSACITY_SPACE_ID, valeur : cet id, environnement : Preview seulement. Type normal.
3. Ne redéploie rien : le redéploiement se fait au prompt 9, une fois l'espace préparé (l'accueil et Tarifs se construisent au déploiement, puis toutes les heures).

Compte rendu à me donner : la ligne trouvée (nom, plan, sans l'adresse), la variable ajoutée et son environnement.
```

---

## 4. Stripe (test) — le webhook de recette vers l'aperçu de cette PR

Le webhook de recette créé au lot 4.5 envoie les événements à l'aperçu de la PR #40. Il doit désormais viser celui de la PR #41, pour que le paiement du filleul (prompt 7) offre son mois au parrain. Vous changez vous-même le début de l'adresse : la fin contient le secret de Vercel, que l'agent ne lit pas.

```
Tu m'aides à faire viser le webhook Stripe de recette de PULSACITY vers l'aperçu de la PR #41. Tu ne lis jamais un secret : c'est moi qui modifie l'adresse.

Ce qu'il ne faut surtout pas toucher : le mode réel de Stripe, les produits, les prix, le portail, les coupons, les événements choisis du webhook, sa version d'API ; tout autre webhook.

1. Stripe, https://dashboard.stripe.com/ , environnement de test « PULSACITY » (vérifie-le). Développeurs › « Webhooks » (ou Workbench › « Webhooks »), destination « PULSACITY recette (aperçu de la PR 40) ».
2. Ouvre « Modifier la destination » (« Edit destination »). Arrête-toi et dis-moi : « Dans l'adresse, remplacez pulsacity-git-claude-dreamy-edi-e47f0f-jawadboughalems-projects.vercel.app par pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app, sans toucher au reste, puis dites-moi OK. » Attends mon OK.
3. Renomme la destination « PULSACITY recette (aperçu de la PR 41) » et enregistre.
4. Vérifie que la destination est « Active » et que sa liste d'événements n'a pas changé (20 événements, dont invoice.paid).

Compte rendu à me donner : nom et état de la destination, nombre d'événements, l'hôte de l'adresse (la partie avant /api/stripe/webhook). Jamais la fin de l'adresse.
```

---

## 5. Recette — la source d'inscription et les liens courts, sans compte

Avant ce prompt : une fenêtre de navigation privée (vous n'y êtes pas connecté), fenêtre en grand. Si l'aperçu demande une connexion Vercel, connectez-vous vous-même.

```
Tu fais la recette de la source d'inscription de PULSACITY sur l'aperçu https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app , fenêtre en grand, sans être connecté à un espace. Pour chaque point, note « OK » ou décris ce que tu vois. Tu ne crées aucun compte et n'envoies aucun formulaire.

1. Ouvre https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app/go/linkedin : tu arrives sur l'accueil, et l'adresse finit par ?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin.
2. Clique « Tarifs » dans l'en-tête : l'adresse de Tarifs n'a plus ces mots. Survole (sans cliquer) le bouton « Créer mon espace gratuit » de l'en-tête : le lien affiché en bas de la fenêtre se termine par /inscription?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin.
3. Survole « Choisir Essentiel » : son lien contient /app/facturation/payer?plan=essentiel&periode=mensuel puis les mêmes mots utm_….
4. Clique « Créer mon espace gratuit » de l'en-tête : la page « Créez votre espace » s'ouvre, son adresse porte les trois mots utm_….
5. Sous « Adresse e-mail », un champ « Comment avez-vous connu PULSACITY ? (facultatif) », le « (facultatif) » en gris, une liste qui affiche « Choisissez une réponse ». Ouvre-la : neuf réponses, dans cet ordre : « Un groupe Facebook ou une communauté », « Un formateur ou un partenaire », « Le badge « Propulsé par PULSACITY » sur une page », « Un créateur qui m'en a parlé », « LinkedIn », « Instagram », « YouTube », « Une recherche sur internet », « Autre ». Choisis « YouTube ».
6. Écris « test@exemple » dans l'adresse et clique « Recevoir mon lien » : l'erreur « Cette adresse e-mail est incomplète… » s'affiche sous l'adresse, et la liste affiche toujours « YouTube ». N'envoie rien d'autre.
7. Ouvre https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app/go/marie-coach : l'adresse finit par ?utm_source=lien-court&utm_medium=lien&utm_campaign=marie-coach.
8. Ouvre https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app/go/tarifs : tu arrives sur Tarifs, avec ?utm_source=lien-court&utm_medium=lien&utm_campaign=tarifs.
9. Ouvre https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app/p/personne-inconnue : tu arrives sur l'accueil, sans rien après la barre (/).
10. Ouvre https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app/connexion : la page n'a pas la question « Comment avez-vous connu PULSACITY ? ».

Compte rendu à me donner : les points 1 à 10 avec « OK » ou ta description, et une capture de chaque point qui n'est pas OK.
```

---

## 6. Recette — Parrainage dans l'espace A

Avant ce prompt : dans une fenêtre normale, connectez-vous vous-même sur l'aperçu avec l'adresse A, fenêtre en grand.

```
Tu fais la recette de la page « Parrainage » de PULSACITY sur l'aperçu https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app , connecté à l'espace « Julie Nutrition », fenêtre en grand. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre le menu du compte (en bas de la colonne de gauche, « Julie Nutrition ») : dans l'ordre, « Mon compte », « Abonnement et factures », « Parrainage » (icône de cadeau), « Aide et contact ». Clique « Parrainage ».
2. La page : le titre « Parrainage », puis « Invitez un créateur. Quand il passe à un plan payant, vous recevez un mois d'Essentiel offert. »
3. À gauche, une carte « Votre lien » : le libellé « Votre lien de parrainage », un champ qui affiche l'adresse de l'aperçu suivie de /p/julie-nutrition (ou /p/julie-nutrition-xxxxxx), un bouton jaune « Copier le lien », dessous « Le créateur qui ouvre ce lien crée son espace comme tout le monde : même plan Gratuit, mêmes prix. »
4. Clique « Copier le lien » : le bouton devient « Lien copié » avec une coche, et « Le lien est copié. » apparaît en vert sous le champ, puis tout revient au bout de quelques secondes.
5. Sous la carte, trois tuiles : « 2 filleuls inscrits », « 1 filleul abonné », et sur fond jaune « 1 mois d'Essentiel offert ».
6. À droite, « Comment ça marche » : trois étapes numérotées sur des ronds jaunes (« Partagez votre lien », « Le créateur crée son espace », « Il passe à un plan payant »), puis « Au plan Gratuit, le mois offert vous fait passer au plan Essentiel pendant un mois. Avec un abonnement, un mois d'Essentiel est déduit de vos prochains paiements. »
7. En bas, sur toute la largeur, « Vos filleuls » : un tableau à en-tête bleu pâle (« Espace », « Inscrit le », « Statut », « Votre mois offert ») ; « Atelier Sophie », une date, le badge vert « Abonné », « Offert le » et une date ; puis « Coaching Karim », une date, le badge bleu « Inscrit », « Quand il passera à un plan payant ». Dessous, « Vous voyez le nom de leur espace et leur statut, rien d'autre. »
8. Ouvre « Abonnement et factures » : tout en bas, une carte avec une icône de cadeau, « Parrainage », « Un mois d'Essentiel offert pour chaque créateur parrainé qui s'abonne. » et le lien « Voir mon lien de parrainage », qui ramène à la page Parrainage.
9. Note l'adresse exacte affichée dans le champ « Votre lien de parrainage » : elle sert au prompt suivant (elle n'est pas personnelle).

Compte rendu à me donner : les points 1 à 9 avec « OK » ou ta description, l'adresse du point 9, et une capture de chaque point qui n'est pas OK.
```

---

## 7. Recette — un filleul B arrive par le lien de A, s'inscrit, reçoit J0, paie ; A reçoit son mois

Avant ce prompt : une fenêtre de navigation privée, fenêtre en grand. C'est vous qui écrivez l'adresse B et qui ouvrez le lien de connexion (un compte de test se crée vous-même). La carte de test 4242 4242 4242 4242 ne débite rien.

```
Tu fais la recette du parrainage de PULSACITY sur l'aperçu https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app , dans une fenêtre privée. Je crée moi-même le compte du filleul. Pour chaque point, note « OK » ou décris ce que tu vois.

A. Arriver par le lien de parrainage
1. Ouvre l'adresse de parrainage que je te donne (relevée au prompt 6) : tu arrives sur l'accueil, l'adresse finit par ?utm_source=parrainage&utm_medium=lien&ref= suivi d'un code de 8 caractères.
2. Clique « Créer mon espace gratuit » (en haut de l'accueil) : la page « Créez votre espace » s'ouvre, l'adresse porte utm_source=parrainage et ref=….
3. Choisis « Un créateur qui m'en a parlé » dans « Comment avez-vous connu PULSACITY ? ». Arrête-toi et dis-moi : « Écrivez l'adresse B, cliquez sur « Recevoir mon lien », ouvrez le lien reçu dans cette même fenêtre, puis dites-moi OK. » Attends mon OK.
4. Tu es sur « Votre espace » (étape 1 de la création), et l'adresse de la page porte encore utm_source=parrainage, ref=… et connu=bouche-a-oreille. Nom de l'activité : « Filleul recette 4.12 ». Clique « Créer mon espace ». L'étape 2 « Vos formations » s'ouvre : n'ajoute rien, clique « Ouvrir mon espace ».

B. L'e-mail J0
5. Dis-moi : « Regardez la boîte B : un e-mail de PULSACITY, objet « Votre espace Filleul recette 4.12 est prêt », est-il arrivé ? Dites-moi ce que vous voyez, puis cliquez « Ne plus recevoir les e-mails d'accueil » tout en bas, et dites-moi ce que la page affiche. » Attends ma réponse et note-la.

C. Le paiement du filleul
6. Dans l'espace du filleul, ouvre « Abonnement et factures ». Clique « Passer au plan Essentiel » (mensuel). La page de paiement de Stripe (mode test) s'ouvre : carte 4242 4242 4242 4242, date 12/34, code 123, nom « Filleul recette ». Paie. Tu reviens sur « Abonnement et factures », qui annonce le paiement (si la page dit « en cours », recharge-la après 20 secondes).

D. Le parrain
7. Dis-moi : « Dans votre fenêtre normale (espace A), rechargez la page Parrainage, puis dites-moi OK. » Attends mon OK, puis regarde avec moi (je te montre la fenêtre, ou je te décris) : les tuiles disent « 3 filleuls inscrits », « 2 filleuls abonnés », « 2 mois d'Essentiel offerts » ; « Filleul recette 4.12 » apparaît en dernier dans « Vos filleuls », badge « Abonné », « Offert le » et la date du jour.
8. Dans l'espace A, « Abonnement et factures » : la carte du plan dit « Plan Essentiel » et « Ce mois d'Essentiel vous est offert par le parrainage, jusqu'au » suivi de la date dans un mois, « : aucun paiement. Ensuite, votre espace repasse au plan Gratuit, sans rien perdre. »

Compte rendu à me donner : les points 1 à 8 avec « OK » ou ta description, ce que j'ai vu dans la boîte B et sur la page de désinscription (sans l'adresse), et une capture de chaque point qui n'est pas OK. Jamais d'adresse e-mail ni de numéro de carte autre que celui de test.
```

---

## 8. Recette — l'image de partage d'un témoignage (espace A)

Avant ce prompt : fenêtre normale, connectée à l'espace A, en grand.

```
Tu fais la recette de « Partager » sur l'aperçu https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app , espace « Julie Nutrition ». Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre « Témoignages », puis la fiche de « Camille R. » (validée). En haut à droite, un bouton bordé « Partager » (icône de partage) à côté de « Masquer ».
2. Ouvre la fiche d'un témoignage « En attente » s'il y en a un : il n'a pas de bouton « Partager ». Reviens sur Camille R.
3. Clique « Partager » : une fenêtre « Partager le témoignage de Camille », « Une image aux couleurs de votre espace, à publier sur vos réseaux. », une bascule « Portrait 1080 × 1350 » (choisi, fond bleu marine) / « Paysage 1200 × 630 », puis l'aperçu de l'image : fond vert (la couleur de l'espace), le nom « Julie Nutrition » et son monogramme ou son logo en haut, cinq étoiles blanches, la citation entre guillemets, « Camille R. », « Enseignante », « Avis du … , achat en … », et en bas à droite « Propulsé par » et le logo PULSACITY.
4. Sous l'aperçu : « Seuls les témoignages validés se partagent : Camille a accepté leur publication. Date de l'avis et mois de l'achat inclus. » Puis « Annuler » et le bouton jaune « Télécharger l'image ».
5. Choisis « Paysage 1200 × 630 » : l'aperçu devient une image large, les étoiles en haut à droite, le nom et le titre sur une ligne en bas.
6. Clique « Télécharger l'image » : un fichier « temoignage-camille-r-1200x630.png » se télécharge. Ouvre-le : c'est l'image de l'aperçu.
7. Échap ferme la fenêtre ; « Partager » la rouvre.

Compte rendu à me donner : les points 1 à 7 avec « OK » ou ta description, et les deux images (portrait et paysage) en pièce jointe.
```

---

## 9. Recette — le mur et le badge de PULSACITY (espace P), Umami sur l'aperçu, la confidentialité

Avant ce prompt : fenêtre normale ; connectez-vous vous-même sur l'aperçu avec l'adresse P (déconnectez A d'abord, ou utilisez un autre profil du navigateur), et à Vercel. Prompts 2 et 3 faits.

```
Tu fais la recette de « l'espace PULSACITY » sur l'aperçu https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app , connecté à l'espace P (« Julie Nutrition », plan Pro), fenêtre en grand. Pour chaque point, note « OK » ou décris ce que tu vois.

A. Préparer l'espace P (comme le fera le fondateur en production)
1. « Offres » : ajoute une offre « Bêta PULSACITY » et enregistre.
2. « Témoignages » : ouvre la fiche de « Camille R. », choisis « Bêta PULSACITY » dans « Offre associée » : « Offre enregistrée. » s'affiche dessous. Fais de même pour « Thomas L. ».
3. « Widgets » : crée un widget de type « Badge » (garde les réglages proposés). Ouvre ensuite le mur existant et le badge : dans chacun, coche « Masquer « Propulsé par PULSACITY » » et enregistre.
3 bis. Vercel (je suis connecté), onglet « Deployments » du projet « pulsacity » : redéploie le dernier déploiement de la branche claude/lot-4-12-accueil-acquisition-318dj8 (« Redeploy », sans cocher « Use existing Build Cache »), pour qu'il prenne PULSACITY_SPACE_ID et NEXT_PUBLIC_UMAMI_WEBSITE_ID et construise l'accueil et Tarifs avec le mur et le badge. Attends qu'il soit « Ready ». Ne touche à rien d'autre dans Vercel.

B. Sur le site public (dans une fenêtre privée, sans être connecté)
4. Ouvre l'accueil de l'aperçu. Avant « Vos questions », une section « Les avis des premiers créateurs » montre le mur : des cartes de témoignages ; sous le nom de Camille R. et de Thomas L., une ligne « Bêta-testeur · plan Essentiel offert pendant la bêta » ; pas sous les autres. Sous le mur : « Sélection de PULSACITY : avis mis en avant, puis les plus récents. » et « Certains clients ont reçu une contrepartie pour leur avis. » Aucun « Propulsé par PULSACITY » sous le mur.
5. Ouvre Tarifs : sous les colonnes de prix et la ligne « Sans engagement · … », le badge (trois visages, les étoiles, « …/5 · … avis »), puis « Certains clients ont reçu une contrepartie pour leur avis. »
6. Affiche le code source de l'accueil (clic droit › « Afficher le code source de la page ») et cherche « umami » : un script dont l'adresse finit par /script.js, avec data-website-id="…", data-domains="pulsacity.com", data-do-not-track="true" et data-before-send="pulsacityBeforeSend". Cherche « creer-mon-espace » : il apparaît sur les boutons « Créer mon espace gratuit ».
7. Ouvre la politique de confidentialité (/confidentialite) : une rubrique « La mesure d'audience » parle d'Umami Cloud, sans cookie, et cite « Créer mon espace gratuit » ; « Umami » apparaît dans « Qui reçoit vos données » ; dans « Cookies », la phrase « La mesure d'audience n'en dépose aucun. » et la ligne « Plan choisi (pulsacity-plan-choisi) ».

Compte rendu à me donner : les points 1 à 7 avec « OK » ou ta description, et une capture de chaque point qui n'est pas OK.
```

---

## 10. Supabase (lecture seule) — ce que la base a enregistré

Avant ce prompt : prompts 5 à 9 faits ; connectez-vous à Supabase.

```
Tu relis, en lecture seule, ce que la base de recette de PULSACITY a enregistré pendant la recette du lot 4.12. Tu ne modifies rien.

Où : Supabase, projet « pulsacity-recette » (jamais « PULSACITY »), éditeur SQL. Lance ces requêtes une par une et recopie leurs résultats.

1. select a.utm_source, a.utm_medium, a.heard_from, a.referral_code is not null as a_un_code, a.created_at
   from space_acquisitions a order by a.created_at desc limit 5;
   La plus récente : parrainage, lien, bouche-a-oreille, a_un_code vrai.
2. select r.reward, r.rewarded_at is not null as offert, r.reward_invoice_id is not null as facture
   from referrals r order by r.created_at desc limit 3;
   La plus récente : free-month, offert vrai, facture vraie.
3. select step, sent_at is not null as envoye, skipped_at is not null as saute from welcome_emails order by claimed_at desc limit 5;
   Au moins une ligne j0, envoye vrai.
4. select welcome_emails_unsubscribed_at is not null as desinscrit, referral_essentiel_until is not null as mois_offert, plan
   from spaces order by created_at desc limit 3;
5. select type, processed_at is not null as traite, error from stripe_events order by received_at desc limit 8;
   Tous traités, sans erreur.

Compte rendu à me donner : les résultats des requêtes 1 à 5 (ils ne contiennent ni adresse ni nom).
```

---

## 11. À 360 px

```
Tu fais la recette du lot 4.12 de PULSACITY à la largeur d'un téléphone, sur l'aperçu https://pulsacity-git-claude-lot-4-12-a-2c0d9c-jawadboughalems-projects.vercel.app . Mets la fenêtre à 360 px de large (outils de développement, mode appareil, largeur 360) ou utilise un téléphone. Pour chaque point, note « OK » ou décris ce que tu vois, et vérifie qu'aucune page ne défile sur le côté.

1. /inscription (sans être connecté) : le titre, l'adresse, « Comment avez-vous connu PULSACITY ? » puis « (facultatif) » à la ligne, la liste, le bouton jaune « Recevoir mon lien » sur toute la largeur.
2. Connecté à l'espace A : « Plus » (dernier onglet en bas) › « Votre compte » liste « Mon compte », « Abonnement et factures », « Parrainage », « Aide et contact ». Ouvre « Parrainage ».
3. Parrainage : « ‹ Plus » en haut, le titre et la phrase ; la carte « Votre lien » avec le champ, le bouton jaune « Partager mon lien », puis « Copier le lien » bordé ; deux tuiles côte à côte et la jaune dessous ; « Vos filleuls » en liste (nom et badge sur une ligne, « Inscrit le … », « Votre mois : … ») ; « Comment ça marche » en dernier.
4. « Partager mon lien » ouvre le partage du téléphone (ou copie le lien sur ordinateur).
5. Fiche de Camille R. : « Partager » sur toute la largeur ; la fenêtre s'ouvre en bas de l'écran, la bascule « Portrait » / « Paysage » tient sur la largeur, l'aperçu, « Télécharger l'image » puis « Annuler ».
6. L'accueil de l'aperçu (fenêtre privée) : le mur de PULSACITY sur une colonne.

Compte rendu à me donner : les points 1 à 6 avec « OK » ou ta description, et une capture de chaque point qui n'est pas OK.
```

---

## Après la fusion

### 12. L'espace PULSACITY en production (avant la bêta)

Avant ce prompt : sur https://pulsacity.com/inscription, créez vous-même votre espace avec votre adresse : nom « PULSACITY », adresse de la page de collecte « pulsacity », couleur d'accent Soleil (#FFBE3B), e-mail de réponse contact@pulsacity.com. Puis connectez-vous à Supabase et à Vercel.

```
Tu m'aides à préparer l'espace PULSACITY en production, où PULSACITY recueille les avis de ses bêta-testeurs. Je suis connecté à pulsacity.com (espace « PULSACITY »), à Supabase et à Vercel.

Ce qu'il ne faut surtout pas toucher : les autres espaces, les autres variables de Vercel, les domaines ; dans Supabase, rien d'autre que la ligne de l'espace PULSACITY (étape 4).

1. pulsacity.com › « Offres » : ajoute l'offre « Bêta PULSACITY » (son adresse doit être beta-pulsacity), délai 0 jour, demandes automatiques coupées (les bêta-testeurs reçoivent « Demander un avis » à la main, arbitrage n° 10).
2. « Réglages » : coche « J'offre une contrepartie à mes clients » (les bêta-testeurs ont Essentiel offert), enregistre.
3. « Widgets » : garde le mur créé avec l'espace ; ajoute un widget « Badge ».
4. Supabase, projet de production « PULSACITY », éditeur SQL. D'abord, lis :
   select id, name, slug, plan from spaces where slug = 'pulsacity';
   Une ligne : « PULSACITY », plan free. Puis, et seulement si c'est bien cette ligne, offre-lui le plan Pro :
   update spaces set plan = 'pro' where slug = 'pulsacity' and stripe_subscription_id is null;
   Le résultat doit dire « 1 row affected ». Copie l'id de la ligne.
5. pulsacity.com › « Widgets » : dans le mur, puis dans le badge, coche « Masquer « Propulsé par PULSACITY » » et enregistre. « Abonnement et factures » dit « Plan Pro » et « Ce plan vous est offert par PULSACITY : aucun paiement. »
6. Vercel, https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables : ajoute PULSACITY_SPACE_ID, valeur : l'id de l'étape 4, environnement : Production seulement. Puis redéploie le dernier déploiement de production (« Redeploy »).
7. Sur https://pulsacity.com : tant que l'espace n'a pas 5 témoignages validés, l'accueil n'a pas de section « Les avis des premiers créateurs » et Tarifs n'a pas de badge. C'est normal : ils apparaissent dans l'heure qui suit la validation du cinquième.

Compte rendu à me donner : chaque étape faite, le plan affiché, la variable ajoutée. Ni adresse ni id.
```

### 13. Resend Pro (avant le lancement)

Le plan gratuit de Resend s'arrête à 100 e-mails par jour, pour les demandes d'avis, les liens de connexion, les e-mails d'accueil et « Écrivez-nous » réunis. Vous souscrivez vous-même (20 $ par mois).

```
Tu m'aides à passer le compte Resend de PULSACITY à l'offre Pro, avant le lancement. Je suis connecté à Resend ; c'est moi qui saisis le paiement.

Ce qu'il ne faut surtout pas toucher : les domaines (envois.pulsacity.com), les clés d'API, les webhooks, l'équipe.

1. https://resend.com/settings/billing : repère l'offre actuelle (Free) et ses limites (e-mails par jour, par mois).
2. Choisis l'offre « Pro » (envoi d'e-mails transactionnels), au mois. Arrête-toi à la saisie du paiement et dis-moi : « Saisissez votre carte et validez, puis dites-moi OK. » Attends mon OK.
3. Vérifie que l'offre affichée est « Pro », et relève ses limites (e-mails par mois, par jour s'il y en a une).
4. https://resend.com/domains : envois.pulsacity.com est toujours « Verified », région eu-west-1.

Compte rendu à me donner : l'offre avant et après, ses limites, l'état du domaine. Rien sur la carte.
```

Après ce compte rendu, Claude Code relève la limite de 30 messages par jour de « Écrivez-nous » (`src/lib/support/contact-message.ts`).

### 14. Un code de partenaire (le jour où un partenaire arrive)

Remplacez NOM par le nom court du partenaire (minuscules, tirets) et CODE par le code qu'il donnera (majuscules). La remise se décide avec lui ; la proposition ci-dessous : un mois d'Essentiel offert.

```
Tu m'aides à créer le code promotionnel d'un partenaire de PULSACITY dans Stripe. Je suis connecté à Stripe.

Ce qu'il ne faut surtout pas toucher : les produits, les prix, le coupon des bêta-testeurs (beta-essentiel-3-mois), les autres coupons, le portail.

1. Stripe, mode réel (ou test, si je te le dis), « Catalogue de produits » › « Coupons » › « Créer un coupon » :
   - ID du coupon : partenaire-NOM (exactement, en minuscules : c'est lui que PULSACITY lit) ;
   - nom : Partenaire NOM ;
   - type : pourcentage, 100 % ; durée : « Plusieurs mois », 1 mois (ou ce que je te dis) ;
   - produits : seulement « Essentiel ».
2. Dans ce coupon, « Ajouter un code promotionnel » : code CODE, sans date d'expiration ni limite, sauf si je te le dis ; « Première commande uniquement » coché.
3. Vérifie le coupon et son code dans la liste.

Compte rendu à me donner : l'ID du coupon, le code, la remise, la durée, les produits.
```

Le partenaire peut aussi partager https://pulsacity.com/go/NOM : ses visiteurs comptent dans la campagne NOM, sans nouvelle livraison. Le tableau de bord (`docs-internes/requetes/tableau-de-bord-fondateur.md`) compte les deux.

### 15. Vérification en production (à la toute fin, avec celles des autres lots)

```
Tu vérifies le lot 4.12 sur https://pulsacity.com , sans créer de compte. Pour chaque point, note « OK » ou décris ce que tu vois.

1. https://pulsacity.com/go/linkedin mène à l'accueil avec ?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin ; « Créer mon espace gratuit » mène à /inscription avec les mêmes mots.
2. /inscription montre « Comment avez-vous connu PULSACITY ? (facultatif) ».
3. Le code source de l'accueil contient le script d'Umami avec data-domains="pulsacity.com".
4. Dis-moi : « Dans Umami Cloud, le site pulsacity.com compte-t-il la visite de maintenant ? Et dans « Événements », voyez-vous creer-mon-espace après un clic sur ce bouton ? » Note ma réponse.
5. Dis-moi : « Votre espace de test créé cette semaine a-t-il reçu J0, puis J1 le lendemain vers 10 h, J3 et J7, chacun seulement si son étape n'était pas faite ? » Note ma réponse.

Compte rendu à me donner : les points 1 à 5.
```
