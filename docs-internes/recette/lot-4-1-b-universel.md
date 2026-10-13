# Lot 4.1 b — le connecteur universel : captures, puis recette

Première phase, la capture (règle n° 1 de CLAUDE.md) : faite le 12 octobre 2026, prompts 1 à 6 ci-dessous. Les six ventes de test de Make, n8n et Zapier sont arrivées et sont devenues les fixtures du connecteur (`docs-internes/connectors/universel.md`).

Seconde phase, la recette : prompts 7 à 14, en bas de ce fichier. Le connecteur lit maintenant les ventes ; les guides, le dédoublonnage et le catalogue sont sur l'aperçu.

Dans l'ordre, chaque bloc dans Claude in Chrome (groupe d'onglets « PULSACITY ») :
- Prompt 1 : Vercel, laisser les outils joindre l'aperçu. Une fois pour toutes : le lot 4.5 en aura besoin pour Stripe.
- Prompt 2 : l'espace de démonstration, depuis la branche de la PR.
- Prompts 3 à 5 : une vente de test en JSON, puis une en formulaire, depuis Make, n8n et Zapier.
- Prompt 6 : relever ce qui est arrivé, dans Supabase.
- Prompt 7 : Make et l'aperçu, la vente lue, la vente reçue deux fois, le même client par deux outils.
- Prompt 8 : les pages publiques sur l'aperçu, sur ordinateur puis à 360 px.
- Prompt 9 : les guides face à Make, Zapier et n8n.
- Prompts 10 à 12 : l'app PULSACITY pour Make, créée, essayée, puis partagée par lien.
- Prompt 13 : le ménage de fin de recette, et un nouveau secret Vercel.
- Prompt 14 : la vérification sur pulsacity.com, après la fusion.

Adresse de l'aperçu : https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app

À savoir :
- L'aperçu est protégé par Vercel Authentication : Make, n8n et Zapier n'y entrent qu'avec le secret du prompt 1, ajouté au bout de l'adresse. Ce secret, comme l'adresse de connexion, ne passe jamais par une conversation : vous les collez vous-même dans chaque outil.
- Vous vous connectez vous-même à Make, n8n et Zapier ; l'agent ne crée aucun compte. Make suffit avec son plan gratuit. n8n Cloud et l'étape « Webhooks by Zapier » demandent un essai gratuit ou un plan payant : si vous n'en avez pas, sautez l'outil et dites-le dans le compte rendu.
- Données fictives seulement (`example.com`) : rien ne part à un vrai client.
- Si « Recette demo space » échoue sur « tenant/user not found », réveillez d'abord la base de recette (prompt 0 bis de `lot-4-1-decisions.md`).

---

## Avant les prompts 3 à 5 : votre adresse de test, vous-même

1. Connectez-vous à l'aperçu avec l'adresse du prompt 2, puis ouvrez Connecteurs › Connecteur universel. Copiez l'adresse de connexion avec « Copier ».
2. Dans une note sur votre ordinateur (pas dans une conversation), collez-la, ajoutez juste derrière `?x-vercel-protection-bypass=`, puis le secret du prompt 1. Cela donne `https://…/api/connectors/universal/…?x-vercel-protection-bypass=…` : c'est votre adresse de test.
3. Vous la collerez vous-même dans Make, n8n et Zapier quand l'agent vous le demandera. Effacez la note à la fin du lot.

---

## 1. Vercel — laisser Make, n8n et Zapier joindre l'aperçu

```
Tu m'aides à activer « Protection Bypass for Automation » sur le projet Vercel de PULSACITY. Tu ne vois jamais le secret : c'est moi qui le copie.

Où : https://vercel.com/jawadboughalems-projects/pulsacity/settings/deployment-protection

Étapes :
1. Repère la rubrique « Protection Bypass for Automation ».
2. S'il n'y a pas encore de secret, clique sur le bouton qui en ajoute un (« Add Secret », « Create » ou équivalent), laisse Vercel le générer, et confirme. S'il y en a déjà un, ne crée rien.
3. Arrête-toi et dis-moi : « Copiez le secret affiché et gardez-le pour votre adresse de test, puis dites-moi OK. » Attends mon OK. Ne lis pas le secret à voix haute, ne le recopie nulle part.

Ne touche surtout pas : à « Vercel Authentication » (il reste activé), aux autres protections, aux domaines, aux variables d'environnement, au déploiement de production.

Vérification : la rubrique « Protection Bypass for Automation » montre un secret (masqué ou non), et « Vercel Authentication » est toujours activé.

Compte rendu à me donner : « secret présent », et l'état de Vercel Authentication. Jamais le secret.
```

## 2. GitHub — l'espace de démonstration de recette, depuis la branche de la PR

```
Tu m'aides à remplir l'espace de démonstration de PULSACITY sur la base de recette, depuis la branche d'une PR.

Où : https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml

Étapes :
1. Clique sur « Run workflow ».
2. « Use workflow from » : choisis la branche claude/determined-meitner-gnbd7e (pas main).
3. « Adresse e-mail du compte de recette » : demande-la-moi et mets celle que je te donne.
4. Plan : free.
5. Clique sur « Run workflow », puis attends la fin : l'exécution doit être verte.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Compte rendu à me donner : la branche choisie, le plan, et la couleur de l'exécution. Pas l'adresse e-mail.
```

## 3. Make — une vente en JSON, puis une en formulaire

Avant ce prompt : connectez-vous à Make vous-même, et gardez votre adresse de test à portée de main.

```
Tu m'aides à envoyer deux ventes de test depuis Make vers PULSACITY, avec le module HTTP. Je suis connecté à Make. Tu ne crées aucun compte et tu n'actives aucun scénario.

Où : https://www.make.com/, mon organisation, « Scenarios ».

A. Préparer
1. Crée un nouveau scénario. Nomme-le « PULSACITY — test du connecteur universel ».
2. Ajoute le module « HTTP », action « Make a request » (si Make propose plusieurs modules HTTP, prends celui-ci, sans authentification).
3. Champ URL : arrête-toi et dis-moi « Collez votre adresse de test dans le champ URL, puis dites-moi OK. » Attends mon OK. Ne lis pas l'adresse et ne la recopie pas.
4. Method : POST.

B. Envoi 1, en JSON
5. Body type : « Raw ». Content type : « JSON (application/json) ».
6. Request content, exactement (garde {{now}} : c'est la date du moment, insérée par Make) :
{"email": "camille.make@example.com", "prenom": "Camille", "nom": "Martin", "offre": "Programme 30 jours", "date": "{{now}}", "montant": 97, "devise": "EUR", "reference": "make-json-1"}
7. Enregistre le module (OK), puis clique sur « Run once ». Ouvre le résultat du module : note le code de statut et la réponse.

C. Envoi 2, en formulaire
8. Rouvre le module. Body type : « application/x-www-form-urlencoded ». Ajoute ces champs, un par ligne (clé, valeur) :
   email = camille.make@example.com ; prenom = Camille ; nom = Martin ; offre = Programme 30 jours ; date = {{now}} (insère la variable « now » de Make) ; montant = 97,50 ; devise = EUR ; reference = make-form-1
9. Enregistre, puis « Run once ». Note le code de statut et la réponse.
10. Enregistre le scénario sans l'activer (il reste « OFF »).

Ne touche surtout pas : aux autres scénarios, aux connexions existantes, aux réglages de l'organisation ni à l'abonnement.

Compte rendu à me donner : pour chaque envoi, le code de statut (attendu : 200) et la réponse (attendue : {"received":true}). Si Make a montré un message d'erreur, recopie-le. Jamais l'adresse.
```

## 4. n8n — une vente en JSON, puis une en formulaire

Avant ce prompt : connectez-vous à n8n vous-même (n8n Cloud, ou votre n8n). Sans compte n8n, sautez ce prompt.

```
Tu m'aides à envoyer deux ventes de test depuis n8n vers PULSACITY, avec le nœud HTTP Request. Je suis connecté à n8n. Tu ne crées aucun compte et tu n'actives aucun workflow.

A. Préparer
1. Crée un nouveau workflow nommé « PULSACITY — test du connecteur universel ».
2. Ajoute le déclencheur manuel (« Trigger manually » / « When clicking ‘Test workflow’ »).
3. Ajoute après lui un nœud « HTTP Request ». Method : POST.
4. URL : arrête-toi et dis-moi « Collez votre adresse de test dans le champ URL, puis dites-moi OK. » Attends mon OK. Ne lis pas l'adresse et ne la recopie pas.
5. Authentication : None.

B. Envoi 1, en JSON
6. Active « Send Body ». Body Content Type : JSON. « Specify Body » : « Using Fields Below ». Ajoute ces champs (Name, Value) :
   email = camille.n8n@example.com ; prenom = Camille ; nom = Martin ; offre = Programme 30 jours ; date = {{ $now }} (en mode Expression) ; montant = 97 ; devise = EUR ; reference = n8n-json-1
7. Clique sur « Test step » (ou « Execute step »). Note le code de statut et la réponse affichés dans la sortie du nœud.

C. Envoi 2, en formulaire
8. Body Content Type : « Form Urlencoded ». Garde les mêmes champs, mais montant = 97,50 et reference = n8n-form-1.
9. « Test step » à nouveau. Note le code de statut et la réponse.
10. Enregistre le workflow sans l'activer.

Ne touche surtout pas : aux autres workflows, aux identifiants enregistrés (credentials), aux réglages du compte ni à l'abonnement.

Compte rendu à me donner : la version de n8n si elle est affichée (Cloud ou installée), puis pour chaque envoi le code de statut (attendu : 200) et la réponse (attendue : {"received":true}). Si n8n a montré une erreur, recopie-la. Jamais l'adresse.
```

## 5. Zapier — une vente en JSON, puis une en formulaire

Avant ce prompt : connectez-vous à Zapier vous-même. L'étape « Webhooks by Zapier » demande un plan payant ou un essai : sans eux, sautez ce prompt.

```
Tu m'aides à envoyer deux ventes de test depuis Zapier vers PULSACITY, avec « Webhooks by Zapier ». Je suis connecté à Zapier. Tu ne crées aucun compte, tu ne publies aucun Zap et tu ne changes pas d'abonnement.

A. Préparer
1. Crée un nouveau Zap nommé « PULSACITY — test du connecteur universel ».
2. Déclencheur : « Schedule by Zapier », événement « Every Day ». Teste le déclencheur.
3. Action : « Webhooks by Zapier », événement « POST ». Si Zapier dit que cette action demande un plan supérieur, arrête-toi et dis-le-moi sans rien accepter.
4. URL : arrête-toi et dis-moi « Collez votre adresse de test dans le champ URL, puis dites-moi OK. » Attends mon OK. Ne lis pas l'adresse et ne la recopie pas.

B. Envoi 1, en JSON
5. Payload Type : json. Data, une ligne par champ :
   email = camille.zapier@example.com ; prenom = Camille ; nom = Martin ; offre = Programme 30 jours ; date = le champ de date du déclencheur (« Pretty Date », ou à défaut « Date ») ; montant = 97 ; devise = EUR ; reference = zapier-json-1
6. Laisse « Wrap Request In Array » sur « no » et « Unflatten » sur « yes » (valeurs par défaut).
7. Teste l'étape (« Test step »). Note ce que Zapier affiche de la réponse : code de statut et contenu.

C. Envoi 2, en formulaire
8. Payload Type : form. Mêmes champs, mais montant = 97,50 et reference = zapier-form-1.
9. Teste l'étape à nouveau. Note le code de statut et la réponse.
10. Quitte l'éditeur sans publier le Zap (il reste en brouillon).

Ne touche surtout pas : aux autres Zaps, aux connexions d'applications, à l'abonnement.

Compte rendu à me donner : le plan Zapier affiché (gratuit, essai ou payant), puis pour chaque envoi le code de statut (attendu : 200) et la réponse (attendue : {"received":true}). Si Zapier a montré une erreur, recopie-la. Jamais l'adresse.
```

## 6. Supabase — relever les ventes arrivées

Avant ce prompt : connectez-vous à Supabase vous-même.

```
Tu m'aides à relever les ventes de test arrivées sur la base de recette de PULSACITY. Tu lances une seule requête, en lecture seule, et tu ne modifies rien.

Où : https://supabase.com/dashboard/projects, organisation PULSACITY, projet « pulsacity-recette » (jamais le projet « PULSACITY », la production), puis « SQL Editor ».

Étapes :
1. Ouvre un nouvel onglet de requête et colle exactement :

select w.received_at,
       w.headers->>'content-type' as content_type,
       w.headers->>'user-agent' as user_agent,
       w.raw_body
from webhook_events w
join connections c on c.id = w.connection_id
where c.connector = 'universal'
order by w.received_at;

2. Clique sur « Run ». Si Supabase propose un mode lecture seule, garde-le.
3. Recopie le résultat en entier, ligne par ligne, sans rien couper ni corriger : received_at, content_type, user_agent et raw_body tels qu'ils s'affichent.

Ne touche surtout pas : aux tables, aux autres requêtes enregistrées, aux réglages du projet, au projet de production. Ne lance aucune autre requête.

Vérification : le résultat a une ligne par envoi réussi des prompts 3 à 5 (six au plus).

Compte rendu à me donner : le tableau recopié en entier. Il ne contient que des données fictives (example.com) et aucun secret.
```

---

# Seconde phase — la recette

## Ce que la capture a donné (12 octobre 2026)

- Prompt 1 : « Protection Bypass for Automation » activée, secret généré par Vercel, jamais lu ; Vercel Authentication toujours activé. Vercel le fournit aussi aux déploiements sous `VERCEL_AUTOMATION_BYPASS_SECRET`.
- Prompt 2 : « Recette demo space » n° 9, vert en 40 s, branche de la PR, plan free.
- Prompts 3 à 5 : les six envois répondent 200 et `{"received":true}`. Make (module HTTP récent : « application/json » puis « JSON string », plus d'option « Raw »), n8n 2.42.7, Zapier en essai Professional. Le scénario, le workflow et le Zap restent inactifs.
- Prompt 6 : six lignes, une par envoi, recopiées dans `docs-internes/connectors/universel.md` et devenues les fixtures.
- « 97,50 » en formulaire (n8n, Zapier, Make) : lu 97,50 €, testé sur les trois captures. Le prompt 7 le montre dans l'espace.
- Le secret de contournement est passé à l'écran : dans le panneau de résultat de Make (l'adresse complète dans « Input »), et en haut d'une capture n8n. Il reste enregistré dans les trois outils. Le prompt 13 le remplace et efface les trois tests à la fin de la recette ; ils servent encore aux prompts 7 et 11.

## 7. Make et l'aperçu — la vente lue, la vente reçue deux fois, le même client par deux outils

Avant ce prompt : attendez que l'aperçu soit construit sur le dernier commit de la PR. Connectez-vous vous-même à l'aperçu, avec l'adresse du prompt 2, et à Make, chacun dans un onglet du groupe « PULSACITY ».

```
Tu fais la recette du connecteur universel de PULSACITY, entre Make et l'aperçu https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app, fenêtre en grand. Je suis connecté aux deux. Tu ne crées aucun compte, tu n'actives aucun scénario. Pour chaque point, note « OK » ou décris ce que tu vois.

Règle pour Make : ne touche jamais au champ URL du module HTTP. Après chaque « Run once », lis seulement le code de statut et la réponse, dans « Output », puis ferme le panneau de résultat sans faire défiler « Input » : il affiche l'adresse.

A. Une vente lue
1. Dans Make, ouvre le scénario « PULSACITY — test du connecteur universel ». Ouvre le module HTTP : il est en « application/x-www-form-urlencoded », avec montant = 97,50 et reference = make-form-1. Ne change rien. Ferme-le.
2. Clique sur « Run once ». Attendu : statut 200, réponse {"received":true}.
3. Dans l'aperçu, ouvre Connecteurs, puis Connecteur universel (/app/connecteurs/connecteur-universel) :
   a. En haut, le bandeau vert « Connecté — dernière vente reçue … ».
   b. Étape 1 : un seul champ, « Adresse de connexion », sans « Clé secrète ». Dessous : « Adresse partagée par erreur ? Changer d'adresse » (sans « et de clé »). Ne clique pas dessus.
   c. Étape 2 : huit champs. « date » : « Le jour de la vente, avec ou sans l'heure, ou au format 12/10/2026. Sans date : le jour de réception. » « montant » : « Le prix payé, avec une virgule ou un point. », exemple 97,50. « reference » finit par « Sans référence : une vente par client, par offre et par jour. » Sous la liste : « Pas à pas, dans nos guides : Make (même gratuit), Zapier, n8n et Podia. », chaque nom en lien.
   d. « Offres à associer » : une ligne « Programme 30 jours », avec « 97,50 € · première vente … », état « À associer ».
   e. « Derniers événements reçus », en haut : « Nouvelle vente · Programme 30 jours · Camille M. », « En attente : associez ce produit à une offre ». Ouvre « Voir tout l'historique » : les six ventes de la capture sont là, lues elles aussi (« Nouvelle vente · Programme 30 jours · Camille M. »), avec « Gardé de côté, sans demande d'avis », car reçues avant que le connecteur ne les lise. Reviens à la page du connecteur.
4. Dans « Offres à associer », choisis l'offre « Programme 30 jours » pour la ligne « Programme 30 jours ». Garde 14 jours. Attendu : l'état passe à « Associée », et l'événement du haut devient « Demande d'avis prévue le … », 14 jours après aujourd'hui.

B. La même vente, reçue deux fois
5. Dans Make, clique à nouveau sur « Run once », sans rien changer (même référence make-form-1). Attendu : 200.
6. Dans l'aperçu, recharge la page : un nouvel événement « Déjà reçue : rien de nouveau ». Ouvre Demandes : une seule demande pour Camille Martin (camille.make@example.com).

C. Le même client, par Systeme.io puis par le connecteur universel
7. Dans l'aperçu, ouvre Connecteurs, puis Systeme.io : dans « Derniers événements reçus », la vente de « Léa M. » a sa demande d'avis prévue. Note sa date.
8. Dans Make, ouvre le module HTTP et change seulement ces valeurs : email = lea.marchand@exemple.fr ; prenom = Léa ; nom = Marchand ; offre = Atelier cuisine ; date = 2026-10-12 (efface la variable « now » et écris ce texte ; si l'espace de démonstration a été refait depuis le 12 octobre, mets le jour de la vente de Léa noté au point 7, au format AAAA-MM-JJ) ; montant = 49 ; reference = make-dedup-1. Enregistre le module (OK), puis « Run once ». Attendu : 200.
9. Dans l'aperçu, page Connecteur universel : « Atelier cuisine » arrive dans « Offres à associer ». Choisis l'offre « Atelier cuisine ». Attendu : l'événement de Léa M. devient « Déjà reçu d'un autre outil : une seule demande pour ce client ».
10. Ouvre Demandes : Léa Marchand n'a qu'une demande, celle de « Programme 30 jours », venue de Systeme.io.

D. Une vente sans adresse e-mail
11. Dans Make, vide la valeur du champ email (garde la ligne, sans valeur), et mets reference = make-vide-1. Enregistre, puis « Run once ». Attendu : 200.
12. Dans l'aperçu, page Connecteur universel : un événement « Autre événement », « Contenu illisible : gardé de côté », avec un bouton « Rejouer ». Ne clique pas dessus.
13. Dans Make, remets email = camille.make@example.com, prenom = Camille, nom = Martin, offre = Programme 30 jours, la variable « now » dans date, montant = 97,50, reference = make-form-1. Enregistre le scénario, sans l'activer.

Ne touche surtout pas : au champ URL de Make, aux autres scénarios, à « Changer d'adresse », aux réglages de l'espace.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu, et les codes de statut. Jamais l'adresse.
```

## 8. Les pages publiques sur l'aperçu, sur ordinateur puis à 360 px

```
Tu fais la recette des pages publiques du connecteur universel sur l'aperçu https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app. Tu ne remplis aucun formulaire. Pour chaque point, note « OK » ou décris ce que tu vois.

A. Fenêtre en grand
1. /guides : trois groupes dans l'ordre « Démarrer », « Relier vos outils », « Aller plus loin ». « Relier vos outils », avec « Quand votre outil n'a pas encore son connecteur : avec Zapier, Make ou n8n. », liste quatre guides : « Envoyer vos ventes avec Make », « … avec Zapier », « … avec n8n », « Envoyer vos ventes Podia avec Zapier », chacun « Mis à jour le 12 octobre 2026 ».
2. Ouvre chacun des quatre guides. Chacun a « Dans ce guide » à droite, avec « Avant de commencer » en premier et « Si rien n'arrive » en dernier ; en bas, « Toujours rien ? Écrivez-nous : … », puis « Autres guides ». Clique sur « Écrivez-nous » : il mène aux mentions légales, partie contact.
3. Guide Make : « Le plan gratuit suffit. », l'étape « application/x-www-form-urlencoded », et dans « Activer le scénario » le conseil d'une vérification par jour sur le plan gratuit.
4. /integrations/make : « Bientôt, une app PULSACITY pour Make enverra vos ventes sans réglage technique : … Le guide fait déjà la même chose aujourd'hui. » Dans « En attendant », le premier bloc « Avec le connecteur universel » finit par le lien « Lire le guide pas à pas », qui ouvre le guide Make. Même chose sur /integrations/zapier (guide Zapier), /integrations/n8n (guide n8n) et /integrations/podia (bloc « Avec Zapier », guide Podia).
5. /integrations/stripe : le bloc « Avec Zapier ou Make » mène toujours à « Voir le connecteur universel ».
6. /integrations/connecteur-universel : à l'étape 3, sous la liste des champs, « Pas à pas, dans nos guides : Make (même gratuit), Zapier, n8n et Podia. », chaque nom en lien vers son guide.
7. Sur chacune de ces pages, la console ne montre aucune erreur.

B. À 360 px (outils de développement, mode appareil, largeur 360)
8. /guides, les quatre guides, /integrations/make et /integrations/connecteur-universel : rien ne dépasse à droite (document.documentElement.scrollWidth vaut 360), les titres et les listes se lisent en entier.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

## 9. Les guides face à Make, Zapier et n8n

Avant ce prompt : connectez-vous vous-même à Make, Zapier et n8n.

```
Tu vérifies que les guides de PULSACITY nomment les écrans de Make, Zapier et n8n tels qu'ils sont. Tu lis seulement : tu ne crées rien, tu n'enregistres rien, tu ne lances rien. Ne fais jamais apparaître le champ URL d'un module ou d'un nœud, ni un panneau de résultat.

Les guides : https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/guides/envoyer-vos-ventes-avec-make, …/envoyer-vos-ventes-avec-zapier, …/envoyer-vos-ventes-avec-n8n (même adresse de départ).

1. Make : sur la liste des scénarios, le bouton « Create a new scenario ». Dans le scénario « PULSACITY — test du connecteur universel », le module HTTP : son action « Make a request », ses champs « URL », « Method », « Body content type » et l'option « application/x-www-form-urlencoded », la manière d'ajouter un champ (nom à gauche, valeur à droite ?). En bas de l'éditeur : « Run once », et l'interrupteur qui active le scénario. Ajoute un module de ton choix sans l'enregistrer, juste pour voir si Make marque certains déclencheurs « Instant » ou « Instant trigger », puis annule.
2. Zapier : le bouton « Create », puis « Zaps ». Dans le Zap « PULSACITY — test du connecteur universel » : les mots « Trigger » et « Action », « Test trigger », « Webhooks by Zapier » et son événement « POST », les champs « URL », « Payload Type » (avec l'option « form »), « Data », le bouton « Test step », l'onglet « Data out », le bouton « Publish ».
3. n8n : dans le workflow « PULSACITY — test du connecteur universel », le nœud « HTTP Request » : « Method », « URL », « Send Body », « Body Content Type » (avec « Form Urlencoded »), « Using Fields Below », « Name » et « Value », le bouton « Execute step ». En haut : « Publish ».

Ne touche surtout pas : aux champs URL, aux connexions, aux autres scénarios, Zaps ou workflows, aux abonnements.

Compte rendu à me donner : pour chaque outil, la liste des libellés trouvés tels quels, et pour chaque libellé différent, le libellé exact affiché à la place.
```

## 10. Make — créer l'app PULSACITY

L'app est privée : elle reste dans votre organisation Make jusqu'au prompt 12. Elle n'a pas de connexion : chaque scénario y colle une fois l'adresse du connecteur universel. Avant ce prompt : connectez-vous vous-même à Make.

```
Tu m'aides à créer une app personnalisée (« Custom app ») dans Make, pour PULSACITY. Je suis connecté. Tu ne crées aucun compte, tu ne publies rien, tu ne partages rien.

Où : https://www.make.com/, mon organisation, la rubrique des apps personnalisées (« Custom apps », parfois dans le menu « … » ou « Developer »). Si Make dit que mon plan ne le permet pas, arrête-toi et dis-le-moi.

A. L'app
1. Crée une nouvelle app (« Create a new app ») :
   - Name : pulsacity (si ce nom est pris, pulsacity-app)
   - Label : PULSACITY
   - Description : Envoyez vos ventes à PULSACITY : chacune déclenche une demande d'avis à votre nom.
   - Theme : #16213E
   - Language : French (ou English si French n'existe pas)
   - Audience : Global
   - Pas d'icône pour l'instant.
2. Onglet ou section « Base » : remplace tout le contenu par {} puis enregistre. Si Make refuse, mets {"baseUrl": "https://pulsacity.com"} et enregistre.

B. Le module
3. Section « Modules », crée un module :
   - Type : Action
   - Connection : aucune (« No connection »)
   - Name : sendSale
   - Label : Envoyer une vente
   - Description : Envoie une vente au connecteur universel : votre client reçoit une demande d'avis au délai choisi pour l'offre.
4. Dans ce module, remplace le contenu de chaque onglet par ces textes, exactement, et enregistre chaque onglet :

« Communication » :
{
  "url": "{{parameters.address}}",
  "method": "POST",
  "body": {
    "email": "{{parameters.email}}",
    "prenom": "{{parameters.prenom}}",
    "nom": "{{parameters.nom}}",
    "offre": "{{parameters.offre}}",
    "date": "{{parameters.date}}",
    "montant": "{{parameters.montant}}",
    "devise": "{{parameters.devise}}",
    "reference": "{{parameters.reference}}"
  },
  "response": {
    "output": "{{body}}"
  }
}

« Static parameters » :
[
  {
    "name": "address",
    "type": "url",
    "label": "Adresse de vos ventes",
    "help": "Dans PULSACITY : Connecteurs, puis Connecteur universel, bouton Copier.",
    "required": true
  }
]

« Mappable parameters » :
[
  { "name": "email", "type": "email", "label": "Adresse e-mail du client", "required": true },
  { "name": "prenom", "type": "text", "label": "Prénom" },
  { "name": "nom", "type": "text", "label": "Nom" },
  { "name": "offre", "type": "text", "label": "Offre", "help": "Le nom de ce que le client a acheté. Vous l'associez une fois à une offre PULSACITY." },
  { "name": "date", "type": "date", "label": "Date de la vente", "help": "Sans date : le moment de réception." },
  { "name": "montant", "type": "text", "label": "Montant", "help": "Le prix payé, avec une virgule ou un point." },
  { "name": "devise", "type": "text", "label": "Devise", "help": "EUR si rien n'est indiqué." },
  { "name": "reference", "type": "text", "label": "Référence de la vente", "help": "L'identifiant de la vente dans votre outil : une vente reçue deux fois ne compte qu'une fois." }
]

« Interface » :
[
  { "name": "received", "type": "boolean", "label": "Vente reçue" }
]

5. Laisse les autres onglets (« Samples », « Scope »…) tels quels.

Ne touche surtout pas : aux autres apps, aux scénarios, aux connexions, aux réglages de l'organisation, à l'abonnement. Ne clique sur aucun bouton « Publish », « Share », « Invite » ou « Request review ».

Vérification : l'app « PULSACITY » existe, avec un module « Envoyer une vente » de type Action, et chaque onglet est enregistré sans message d'erreur.

Compte rendu à me donner : le nom retenu (pulsacity ou pulsacity-app), chaque étape avec « OK », et tout message d'erreur de Make recopié tel quel.
```

## 11. Make — essayer l'app sur l'aperçu

Avant ce prompt : gardez votre adresse de test à portée de main (adresse du connecteur universel suivie du paramètre de contournement, comme pour le prompt 3).

```
Tu m'aides à essayer l'app PULSACITY de Make, sur l'aperçu de PULSACITY. Je suis connecté à Make et à l'aperçu https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app. Tu n'actives aucun scénario. Après « Run once », lis seulement « Output », puis ferme le panneau de résultat sans faire défiler « Input ».

1. Dans Make, crée un nouveau scénario nommé « PULSACITY — test de l'app ».
2. Ajoute un module : cherche « PULSACITY », choisis « Envoyer une vente ».
3. « Adresse de vos ventes » : arrête-toi et dis-moi « Collez votre adresse de test dans le champ Adresse de vos ventes, puis dites-moi OK. » Attends mon OK. Ne lis pas l'adresse et ne la recopie pas.
4. Remplis : Adresse e-mail du client = camille.app@example.com ; Prénom = Camille ; Nom = Martin ; Offre = Programme 30 jours ; Date de la vente = vide ; Montant = 97,50 ; Devise = EUR ; Référence de la vente = make-app-1. Clique sur OK.
5. « Run once ». Attendu : pas d'erreur, et dans « Output » : Vente reçue = true (ou received = true).
6. Dans l'aperçu, Connecteurs, puis Connecteur universel : l'événement du haut est « Nouvelle vente · Programme 30 jours · Camille M. », avec « Demande d'avis prévue le … » (l'offre est déjà associée depuis le prompt 7).
7. Enregistre le scénario sans l'activer.

Ne touche surtout pas : aux autres scénarios, à l'app elle-même, aux réglages de l'aperçu.

Compte rendu à me donner : chaque étape avec « OK », ce que montre « Output », et tout message d'erreur de Make recopié tel quel. Jamais l'adresse.
```

## 12. Make — voir comment partager l'app par lien, sans le faire

Partager l'app la rend installable par toute personne qui a le lien. Make peut rendre ce choix définitif : ce prompt relève seulement ce que Make annonce. Vous décidez ensuite, et Claude Code vous donne le prompt qui partage.

```
Tu m'aides à voir comment partager l'app personnalisée « PULSACITY » de Make par un lien. Je suis connecté. Tu lis seulement : tu ne cliques sur aucun bouton qui publie, partage ou demande une validation, et tu ne confirmes aucune fenêtre.

1. Ouvre l'app « PULSACITY » dans les apps personnalisées.
2. Repère les boutons ou menus qui parlent de « Publish », « Share », « Invite », « Invitation link » ou « Request review ».
3. Survole-les ou ouvre leur aide (icône « ? », lien « Learn more »), sans rien valider. Si un clic ouvre une fenêtre de confirmation, recopie son texte et clique sur « Cancel ».

Ne touche surtout pas : à l'app, aux scénarios, aux réglages de l'organisation.

Compte rendu à me donner : le nom exact de chaque bouton trouvé, et pour chacun ce que Make en dit, mot pour mot : ce que voit une personne qui a le lien, si le choix est définitif, si l'app peut redevenir privée.
```

## 13. Le ménage de fin de recette, et un nouveau secret Vercel

À lancer une fois les prompts 7 à 12 au vert, avant la fusion. Les tests de Make, n8n et Zapier gardent le secret de contournement dans leur adresse : on les efface, puis on change le secret.

```
Tu m'aides à faire le ménage après la recette du connecteur universel de PULSACITY. Je suis connecté à Make, Zapier, n8n, Vercel et à l'aperçu https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app. Tu ne vois jamais de secret : quand il le faut, c'est moi qui agis.

1. Make : supprime les scénarios « PULSACITY — test du connecteur universel » et « PULSACITY — test de l'app ». Garde l'app « PULSACITY ».
2. Zapier : supprime le Zap « PULSACITY — test du connecteur universel ».
3. n8n : supprime le workflow « PULSACITY — test du connecteur universel ».
4. Vercel, https://vercel.com/jawadboughalems-projects/pulsacity/settings/deployment-protection, rubrique « Protection Bypass for Automation » : remplace le secret par un nouveau (« Regenerate », ou ajoute un nouveau secret puis supprime l'ancien). Ne lis pas le nouveau secret. Si Vercel demande à quel secret donner `VERCEL_AUTOMATION_BYPASS_SECRET`, choisis le nouveau.
5. Aperçu : Connecteurs, puis Connecteur universel, « Changer d'adresse », puis « Changer l'adresse » dans la fenêtre. Attendu : « Nouvelle adresse créée. Collez-la dans votre outil. » Ne copie pas l'adresse.

Ne touche surtout pas : à l'app « PULSACITY » de Make, aux autres scénarios, Zaps ou workflows, à « Vercel Authentication » (il reste activé), aux variables d'environnement, à la production.

Vérification : les trois tests n'existent plus ; Vercel montre un seul secret de contournement, créé aujourd'hui ; Vercel Authentication est activé.

Compte rendu à me donner : chaque étape avec « OK ». Jamais de secret ni d'adresse.
```

Effacez ensuite vous-même la note qui contenait l'adresse de test.

## 14. Vérification sur pulsacity.com, après la fusion

```
Tu vérifies la mise en ligne du connecteur universel de PULSACITY sur https://pulsacity.com, fenêtre en grand. Tu ne te connectes pas et tu ne remplis aucun formulaire. Pour chaque point, note « OK » ou décris ce que tu vois.

1. https://pulsacity.com/guides : le groupe « Relier vos outils », avec les quatre guides Make, Zapier, n8n et Podia ; chacun s'ouvre.
2. https://pulsacity.com/integrations : 19 outils ; Systeme.io et le connecteur universel « Disponible » ; Zapier, Make, n8n et Podia « Bientôt ».
3. https://pulsacity.com/integrations/make : « Lire le guide pas à pas » ouvre le guide Make.
4. https://pulsacity.com/integrations/connecteur-universel : à l'étape 3, la liste des huit champs, puis « Pas à pas, dans nos guides : Make (même gratuit), Zapier, n8n et Podia. ».
5. Sur ces pages, la console ne montre aucune erreur.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

Puis, vous-même, dans votre espace sur pulsacity.com : Connecteurs, puis Connecteur universel. L'adresse s'affiche seule, sans clé, avec « Changer d'adresse ».

---

## Résultats des prompts 7 à 12 (13 octobre 2026)

- Prompt 7 : 13 points sur 13. Vente lue (« 97,50 € »), associée, « Demande d'avis prévue le 27 oct. » ; reçue deux fois, « Déjà reçue : rien de nouveau », une seule demande ; Léa M. par Systeme.io puis par le connecteur universel, « Déjà reçu d'un autre outil : une seule demande pour ce client », une seule demande ; sans e-mail, « Contenu illisible : gardé de côté ». Remarques, sans correction :
  - Systeme.io affiche « Léa », le connecteur universel « Léa M. » : la vente de démonstration de Systeme.io n'a pas de nom de famille ; le connecteur universel en avait un.
  - « première vente hier à 14:00 » pour une date sans heure : un jour seul vaut midi UTC, 14:00 à Paris, comme « Demander un avis ».
  - « Ses ventes gardées de côté sont traitées » vaut pour les ventes en attente de leur offre ; les six de la capture, reçues avant la lecture, restent sans demande. Aucune n'existe en production.
  - Make affiche le début de l'adresse sous le module : le prompt 13 remplace le secret et l'adresse.
- Prompt 8 : 8 points sur 8, aucune erreur dans la console, 360 px sans débordement. Corrigé ensuite : les accroches de n8n et Podia disent maintenant, comme Make et Zapier, ce qui viendra et « Le guide fait déjà la même chose aujourd'hui. ». Les mentions légales affichent encore « À COMPLÉTER » dans Contact : textes légaux du lot 4.9.
- Prompt 9 : Zapier conforme. Corrigé dans les guides : Make « Create scenario », « Add a field » (Name au-dessus de Value), l'interrupteur en haut à droite à côté de « Every 15 minutes » ; n8n « Form URL Encoded », « Specify Body », « Add Field ».
- Prompt 10 : app « PULSACITY » créée dans Make, privée, module « Envoyer une vente », sans erreur. Make a ajouté un suffixe à son nom technique.
- Prompt 11 : vente envoyée par l'app, lue, demande prévue le 27 oct. Make a demandé d'installer l'app dans l'organisation ; un premier essai sans le paramètre de contournement a reçu 401, le second est passé.
- Prompt 12 : seul bouton, « Publish ». Selon Make, publier est définitif : l'app ne peut plus redevenir privée ni être supprimée, ses modules ne peuvent plus être supprimés. Décision du fondateur : on ne publie pas maintenant. L'app reste une app de test privée ; une version propre sera publiée le jour où elle est proposée aux créateurs, et son lien entrera alors dans le guide Make.
