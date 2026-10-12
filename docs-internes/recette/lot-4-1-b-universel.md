# Lot 4.1 b — le connecteur universel : captures, puis recette

Première phase, la capture (règle n° 1 de CLAUDE.md) : le connecteur universel est sur l'aperçu de la PR, il garde chaque vente reçue telle quelle et n'en lit encore aucune. Vous envoyez de vraies ventes de test depuis Make, n8n et Zapier ; Claude Code en tire les fixtures, puis écrit la lecture des ventes, le dédoublonnage, les guides et le catalogue. La recette de la seconde phase suivra dans ce fichier.

Dans l'ordre, chaque bloc dans Claude in Chrome (groupe d'onglets « PULSACITY ») :
- Prompt 1 : Vercel, laisser les outils joindre l'aperçu. Une fois pour toutes : le lot 4.5 en aura besoin pour Stripe.
- Prompt 2 : l'espace de démonstration, depuis la branche de la PR.
- Prompts 3 à 5 : une vente de test en JSON, puis une en formulaire, depuis Make, n8n et Zapier.
- Prompt 6 : relever ce qui est arrivé, dans Supabase.

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
