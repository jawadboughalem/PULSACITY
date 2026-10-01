# Environnement de recette : actions du fondateur

Objectif : chaque PR a son aperçu Vercel, branché sur une base, un bucket et une clé d'e-mail de recette, jamais sur la production. On teste la PR sur son aperçu, puis on fusionne.

État : prompts 1 à 7 faits le 1er octobre 2026 par la session locale du bureau. Le prompt 8 reste à lancer. Compte rendu en bas de page.

Les prompts sont à coller dans Claude in Chrome, dans l'ordre. Chaque secret va directement du service qui le crée à l'endroit où il sert (Vercel ou GitHub). Il n'apparaît jamais dans un compte rendu ni dans une conversation.

À lancer après la fusion de la PR « environnements » sur `main` : les workflows de recette n'apparaissent dans GitHub qu'à ce moment-là.

Ce que le code fait déjà :
- sur un aperçu, l'application prend l'adresse de la branche (`VERCEL_BRANCH_URL`) pour ses liens de connexion, de collecte et ses e-mails ;
- le workflow « Recette database migration » applique les migrations de chaque PR sur la base de recette, puis celles de `main` ;
- le workflow « Recette demo space » remplit un espace de démonstration pour une adresse ;
- le workflow « Database migration » applique les migrations de `main` sur la production, à chaque fusion. Le prompt 6 fait attendre la production jusqu'à ce qu'il soit vert.

---

## 1. Supabase — créer la base de recette

```
Tu m'aides à créer une base de données de recette sur Supabase, à côté de la production, sans toucher à la production.

Où : https://supabase.com/dashboard/projects

Étapes :
1. Clique sur « New project ». Choisis la même organisation que le projet « PULSACITY ».
2. Nom du projet : pulsacity-recette
3. Database Password : clique sur « Generate a password ». Le mot de passe ne doit contenir que des lettres et des chiffres : sinon, régénère-le, car un caractère spécial casse l'adresse de connexion (« URI malformed »). Il ne doit jamais reprendre celui de la production. Garde cet onglet ouvert : tu en auras besoin à l'étape 6. Ne l'écris nulle part ailleurs.
4. Region : « Central EU (Frankfurt) » (eu-central-1). Plan : Free.
5. Clique sur « Create new project » et attends qu'il soit prêt (deux minutes environ).
6. Dans le projet pulsacity-recette, clique sur « Connect » en haut. Onglet « Connection string », mode « Transaction pooler » (port 6543). Copie la chaîne. Remplace [YOUR-PASSWORD] par le mot de passe de l'étape 3, puis ajoute ?sslmode=require à la fin. Garde la chaîne complète pour les prompts 2 et 5, sans la noter ailleurs.

Ne touche surtout pas :
- au projet « PULSACITY » (la production) : ni ses réglages, ni sa base, ni ses mots de passe ;
- aux autres organisations ou projets.

Vérification : le projet pulsacity-recette apparaît en « Active » (ou « Healthy »), région eu-central-1.

Compte rendu à me donner : le nom du projet, sa région et son statut. Ne recopie ni le mot de passe, ni la chaîne de connexion.
```

## 2. GitHub — secret de recette et premières migrations

```
Tu m'aides à donner au dépôt GitHub de PULSACITY l'accès à la base de recette, puis à y appliquer les migrations.

Où : https://github.com/jawadboughalem/PULSACITY/settings/secrets/actions

Étapes :
1. Clique sur « New repository secret ».
2. Name : RECETTE_DATABASE_URL
3. Secret : colle la chaîne de connexion de la base pulsacity-recette, celle du prompt Supabase (port 6543, avec ?sslmode=require à la fin).
4. Clique sur « Add secret ».
5. Va sur https://github.com/jawadboughalem/PULSACITY/actions, ouvre le workflow « Recette database migration », clique sur « Run workflow » sur la branche main, puis valide.
6. Attends la fin : l'exécution doit être verte.
7. Ouvre le workflow « Recette demo space », clique sur « Run workflow » sur main. Dans « Adresse e-mail du compte de recette », mets mon adresse e-mail de recette. Laisse le plan sur free. Valide, puis attends qu'il soit vert.

Ne touche surtout pas :
- au secret DATABASE_URL déjà présent : c'est la production, il ne change pas ;
- au workflow « Database migration » (la production) : ne le lance pas.

Vérification : le secret RECETTE_DATABASE_URL apparaît dans la liste. Les deux workflows ont une exécution verte. Le journal de « Recette demo space » se termine par « Espace « Julie Nutrition » prêt pour … ».

Compte rendu à me donner : la liste des noms de secrets (sans leurs valeurs) et le statut des deux exécutions.
```

## 3. Cloudflare — bucket de photos de recette

```
Tu m'aides à créer un bucket R2 de recette pour les photos, séparé de celui de la production.

Où : https://dash.cloudflare.com, puis R2 Object Storage.

Étapes :
1. Clique sur « Create bucket ». Nom : pulsacity-photos-recette. Emplacement : Europe de l'Ouest (Western Europe), comme le bucket de production. Crée-le.
2. Dans le bucket pulsacity-photos-recette, onglet « Settings » :
   a. « Public access » › « R2.dev subdomain » : clique sur « Allow Access » et confirme. Copie l'adresse publique qui s'affiche (elle commence par https://pub- et finit par .r2.dev).
   b. « CORS Policy » : clique sur « Add CORS policy » (ou « Edit ») et colle exactement :
      [{"AllowedOrigins":["*"],"AllowedMethods":["PUT"],"AllowedHeaders":["content-type"],"MaxAgeSeconds":3600}]
      Puis enregistre.
3. Reviens sur la page R2, ouvre « Manage R2 API Tokens », clique sur « Create API token ».
   - Nom : pulsacity-recette
   - Permissions : « Object Read & Write »
   - Specify bucket(s) : uniquement pulsacity-photos-recette
   - Crée le jeton. Garde ouverts « Access Key ID » et « Secret Access Key » : ils servent au prompt Vercel, et Cloudflare ne les remontre plus.
4. Note aussi l'« Account ID » affiché sur la page R2 : ce n'est pas un secret.

Ne touche surtout pas :
- au bucket pulsacity-photos : ni son CORS, ni son accès public ;
- au jeton pulsacity-production.

Vérification : le bucket pulsacity-photos-recette existe, avec l'accès public r2.dev activé et la règle CORS ci-dessus. Le jeton pulsacity-recette est limité à ce bucket, en « Object Read & Write ».

Compte rendu à me donner : le nom du bucket, son adresse publique r2.dev, la règle CORS enregistrée et la portée du jeton. Ne recopie ni l'Access Key ID ni le Secret Access Key.
```

## 4. Resend — clé d'envoi de recette

```
Tu m'aides à créer une clé Resend réservée à la recette.

Où : https://resend.com/api-keys

Étapes :
1. Clique sur « Create API Key ».
2. Name : pulsacity-recette
3. Permission : « Sending access ». Domain : envois.pulsacity.com.
4. Crée-la. Garde la clé affichée pour le prompt Vercel : Resend ne la remontre plus.

Ne touche surtout pas :
- aux autres clés, en particulier celle de la production ;
- au domaine envois.pulsacity.com et à ses enregistrements DNS.

Vérification : la clé pulsacity-recette apparaît dans la liste, en « Sending access », sur envois.pulsacity.com.

Compte rendu à me donner : le nom, la permission et le domaine de la clé. Ne recopie jamais la clé.
```

## 5. Vercel — brancher les aperçus sur la recette

```
Tu m'aides à brancher les aperçus Vercel de PULSACITY (l'environnement « Preview ») sur la recette, et à les débrancher de la production.

Où : https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables

Étapes :
1. Repère les lignes DATABASE_URL. S'il en existe déjà une pour « Preview » seul, remplace sa valeur à l'étape 2 au lieu d'en créer une. Sinon, ouvre celle de la production (« Edit »), décoche « Preview » dans « Environments », laisse « Production » et enregistre : les aperçus ne doivent plus voir la base de production.
2. Ajoute ces variables, chacune avec seulement « Preview » coché (ni Production, ni Development) :
   - DATABASE_URL = la chaîne de connexion de pulsacity-recette (prompt Supabase)
   - BETTER_AUTH_SECRET = une valeur neuve : ouvre https://generate-secret.vercel.app/32 dans un nouvel onglet et copie la valeur affichée
   - RESEND_API_KEY = la clé pulsacity-recette (prompt Resend)
   - EMAIL_FROM_DOMAIN = envois.pulsacity.com
   - R2_ACCOUNT_ID = l'Account ID Cloudflare (prompt Cloudflare)
   - R2_ACCESS_KEY_ID = l'Access Key ID du jeton pulsacity-recette
   - R2_SECRET_ACCESS_KEY = le Secret Access Key du jeton pulsacity-recette
   - R2_BUCKET = pulsacity-photos-recette
   - R2_PUBLIC_URL = l'adresse publique r2.dev du bucket pulsacity-photos-recette
   - LEGAL_VALIDATED = false
3. Ne crée pas BETTER_AUTH_URL ni NEXT_PUBLIC_APP_URL pour Preview : sur un aperçu, l'application prend toute seule l'adresse de la branche.
4. Va dans Settings › Environment Variables, en bas de page : vérifie que « Automatically expose System Environment Variables » est activé.
5. Va dans « Deployments ». Sur le dernier déploiement « Preview », ouvre le menu « ⋯ » et clique sur « Redeploy ».

6. Va dans Settings › Deployment Protection. Lis le réglage « Vercel Authentication » : il doit être activé, en « Standard Protection », pour que seuls les membres de l'équipe ouvrent les aperçus. S'il ne l'est pas, ne change rien et dis-le-moi.

Ne touche surtout pas :
- aux valeurs « Production » existantes (sauf décocher Preview sur DATABASE_URL) ;
- aux domaines (pulsacity.com, www, pulsacity.fr) ;
- aux réglages de Deployment Protection : tu ne fais que les lire.

Vérification : DATABASE_URL apparaît deux fois, une pour « Production », une pour « Preview ». Les dix variables Preview existent. Le redéploiement Preview est « Ready ».

Compte rendu à me donner : la liste des noms de variables avec leurs environnements (Production, Preview), sans aucune valeur, le statut du redéploiement et le réglage « Vercel Authentication » lu.
```

## 6. Vercel — la production attend la migration de la base

Sans ce réglage, Vercel met la nouvelle version en ligne dès qu'elle est construite, parfois avant que « Database migration » ait ajouté ses colonnes : l'espace échoue alors pendant une minute ou deux.

```
Tu m'aides à faire attendre la production de PULSACITY sur Vercel jusqu'à ce que deux workflows GitHub soient verts.

Où : https://vercel.com/jawadboughalems-projects/pulsacity/settings, rubrique « Deployment Checks ».

Étapes :
1. Ouvre « Deployment Checks », puis clique sur « Add Checks ».
2. Choisis GitHub comme fournisseur, puis coche deux workflows du dépôt jawadboughalem/PULSACITY : « CI » et « Database migration ». Rien d'autre.
3. Enregistre.
4. Va dans Settings › Environments › Production (ou Settings › Domains selon l'interface) et vérifie que l'attribution automatique du domaine de production (« Auto-assign Custom Production Domains ») est activée. Elle l'est par défaut : si elle ne l'est pas, ne change rien et dis-le-moi.

Ne touche surtout pas :
- aux domaines et à leurs redirections ;
- aux variables d'environnement ;
- aux workflows « Recette database migration » et « Recette demo space » : ils ne doivent pas bloquer la production.

Vérification : « Deployment Checks » liste « CI » et « Database migration », et seulement eux. Au prochain déploiement de production, Vercel affiche les deux checks en attente, puis met en ligne une fois les deux verts.

Compte rendu à me donner : les checks enregistrés, et l'état de l'attribution automatique du domaine de production.
```

## 7. Vérification de bout en bout sur un aperçu

```
Tu vérifies que l'aperçu d'une PR de PULSACITY tourne bien sur la recette. Je suis connecté à Vercel dans ce navigateur. Tu ne crées aucun compte.

Où : la PR ouverte https://github.com/jawadboughalem/PULSACITY/pulls (la plus récente). Dans le commentaire de Vercel, clique sur le lien « Preview ».

Étapes :
1. L'adresse ouverte finit par .vercel.app (et non pulsacity.com). Note-la.
2. Va sur /connexion de cette adresse. Demande-moi mon adresse e-mail de recette, saisis-la, et clique sur « Recevoir mon lien ».
3. Demande-moi d'ouvrir l'e-mail « Votre lien pour entrer dans PULSACITY » et de te dire si le lien commence par l'adresse de l'étape 1. Attends ma réponse.
4. Une fois connecté, l'accueil montre l'espace « Julie Nutrition » : « Bonjour Julie », quatre chiffres, les derniers témoignages et les étapes restantes.
5. Va sur « Témoignages » : la liste contient « Sophie D. » et « Nadia B. » en attente.

Ne touche surtout pas : à pulsacity.com, ni à aucun réglage Vercel.

Compte rendu à me donner : l'adresse de l'aperçu, et pour chaque étape « OK » ou ce que tu vois. Ne recopie aucun lien de connexion.
```

## 8. Supabase — un mot de passe propre à la base de recette

```
Tu m'aides à donner à la base de recette pulsacity-recette un mot de passe qui lui est propre, puis à le reporter dans GitHub et dans Vercel. Tu ne touches pas à la production.

Où : https://supabase.com/dashboard/projects, projet pulsacity-recette.

Étapes :
1. Dans pulsacity-recette, ouvre Project Settings › Database, rubrique « Database password », et clique sur « Reset database password ».
2. Clique sur « Generate a password ». Il ne doit contenir que des lettres et des chiffres : sinon, régénère-le. Arrête-toi et demande-moi de le copier moi-même, puis enregistre.
3. Demande-moi de préparer la chaîne de connexion : « Connect », onglet « Connection string », mode « Transaction pooler » (port 6543), [YOUR-PASSWORD] remplacé par le nouveau mot de passe, ?sslmode=require à la fin.
4. Ouvre https://github.com/jawadboughalem/PULSACITY/settings/secrets/actions, puis RECETTE_DATABASE_URL › « Update secret ». Demande-moi de coller la chaîne, puis enregistre.
5. Ouvre https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables, puis la ligne DATABASE_URL de « Preview » › « Edit ». Demande-moi de coller la chaîne, puis enregistre.
6. Sur https://github.com/jawadboughalem/PULSACITY/actions, lance « Recette database migration » sur main et attends qu'il soit vert.
7. Dans Vercel › Deployments, redéploie le dernier déploiement « Preview » et attends « Ready ».

Ne touche surtout pas :
- au projet PULSACITY (la production) ni à son mot de passe ;
- au secret DATABASE_URL du dépôt ;
- à la ligne DATABASE_URL de « Production » dans Vercel.

Vérification : « Recette database migration » est vert avec le nouveau secret. Sur l'aperçu redéployé, après connexion, l'accueil montre toujours l'espace « Julie Nutrition ».

Compte rendu à me donner : la date du changement, le statut du workflow et celui du redéploiement. Ne recopie jamais le mot de passe ni la chaîne de connexion.
```

---

## Compte rendu du 1er octobre 2026

- Prompts 1 à 7 faits.
- Écart au prompt 5 : DATABASE_URL avait déjà une ligne « Preview » séparée. Sa valeur a été remplacée, et la ligne de production n'a pas été modifiée.
- Première exécution de « Recette database migration » en échec, « URI malformed » : le mot de passe contenait un caractère spécial. Elle est passée au vert après changement du mot de passe. Les journaux GitHub n'affichent pas la chaîne de connexion.
- « Recette demo space » est vert, et l'espace « Julie Nutrition » existe sur la recette.
- Deployment Checks : « Lint, typecheck, test, build » et « Apply pending migrations ». Attribution automatique du domaine de production activée.
- Vérification de bout en bout sur l'aperçu de la branche `claude/testimonials-dashboard-ui-6mpnf8` : l'accueil affiche « Bonjour Julie », 10 validés, 4,7/5, 2 en attente et 38 %. Sophie D. et Nadia B. sont « En attente ».

Restent à vérifier :
- le prompt 8 ;
- l'envoi d'une photo depuis un aperçu (bucket et CORS de recette) ;
- que le lien de connexion reçu par e-mail commence par l'adresse de l'aperçu ;
- au prochain déploiement de production, que Vercel attend les deux checks avant la mise en ligne.
