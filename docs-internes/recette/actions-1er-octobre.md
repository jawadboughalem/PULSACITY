# Actions du 1er octobre 2026 : sécurité, recette du lot 4, vérifications

À lancer dans l'ordre, dans la session locale du bureau (Claude in Chrome), ou à coller un par un à la maison. Les prompts 1 à 5 sont à faire maintenant. Le 6 attend votre décision, le 7 attend le lancement.

Adresse de l'aperçu qui sert à la recette : https://pulsacity-git-claude-testimonia-ce6d5d-jawadboughalems-projects.vercel.app. Elle fait tourner le même code que pulsacity.com, sur la base de recette. Si elle ne répond plus, prenez dans Vercel › Deployments le dernier déploiement « Preview » à l'état « Ready ».

---

## 1. Base de recette : un mot de passe qui lui est propre

C'est le prompt 8 de `docs-internes/recette/environnement-recette.md`. Lancez-le en premier.

## 2. Recette du lot 4, sur l'aperçu

Ce sont les prompts 2, 3 et 4 de `docs-internes/recette/lot-4-espace.md`, avec une différence : partout où ils disent https://pulsacity.com, utilisez l'adresse de l'aperçu ci-dessus. On teste ainsi sans rien ajouter à la production. Connectez-vous à l'aperçu avec votre adresse e-mail de recette : son espace « Julie Nutrition » est déjà rempli.

## 3. Aperçu : envoi d'une photo et lien de connexion

```
Tu vérifies deux choses sur l'aperçu de PULSACITY, sans rien modifier dans Vercel ni dans GitHub. Je suis connecté à Vercel dans ce navigateur. Tu ne crées aucun compte.

Où : https://pulsacity-git-claude-testimonia-ce6d5d-jawadboughalems-projects.vercel.app

Étapes :
1. Va sur /connexion. Demande-moi mon adresse e-mail de recette, saisis-la, puis clique sur « Recevoir mon lien ».
2. Demande-moi d'ouvrir l'e-mail « Votre lien pour entrer dans PULSACITY » et de te dire si le lien commence par https://pulsacity-git-claude-testimonia-ce6d5d-jawadboughalems-projects.vercel.app. Attends ma réponse, puis demande-moi de cliquer sur le lien.
3. Une fois dans l'espace, sur l'accueil, repère le lien de collecte de l'espace (bouton « Copier le lien », ou page « Offres »). Ouvre ce lien dans un nouvel onglet.
4. Sur la page de collecte : choisis 5 étoiles, écris « Test photo de recette. », puis touche « Une photo de vous ? ». Arrête-toi et demande-moi de choisir une image JPEG ou PNG de moins de 10 Mo. Attends que je te dise que c'est fait.
5. Attends que la photo apparaisse, coche la case d'accord, puis clique sur « Envoyer mon avis ». La page doit dire « Merci », suivi du prénom saisi.
6. Retourne dans l'espace, page « Témoignages ». Le nouveau témoignage « Test photo de recette. » est « En attente », avec la photo visible.
7. Ouvre sa fiche, puis clique sur « Supprimer définitivement » et confirme : il disparaît de la liste.

Ne touche surtout pas : à pulsacity.com, aux réglages Vercel, aux autres témoignages.

Vérification : le lien de l'e-mail commence par l'adresse de l'aperçu, la photo s'affiche sur la fiche, et le témoignage de test est supprimé.

Compte rendu à me donner : pour chaque étape, « OK » ou ce que tu vois, et une capture de la fiche avec la photo. Ne recopie aucun lien de connexion.
```

## 4. GitHub : protéger la branche main

Plus rien ne peut arriver sur `main` sans PR et sans CI verte, même par erreur. Sur un dépôt public, c'est gratuit.

```
Tu m'aides à protéger la branche main du dépôt PULSACITY sur GitHub.

Où : https://github.com/jawadboughalem/PULSACITY/settings/rules

Étapes :
1. Clique sur « New ruleset », puis « New branch ruleset ».
2. Ruleset Name : main. Enforcement status : Active.
3. Bypass list : laisse-la vide.
4. Target branches : « Add target », puis « Include default branch ».
5. Dans « Rules », coche :
   - « Restrict deletions » ;
   - « Block force pushes » ;
   - « Require a pull request before merging », avec « Required approvals » à 0 (je suis seul sur le projet : avec 1, aucune PR ne pourrait être fusionnée) ;
   - « Require status checks to pass ». Clique sur « Add checks » et ajoute « Lint, typecheck, test, build » et « GitGuardian Security Checks ». Laisse « Require branches to be up to date before merging » décoché.
6. Laisse toutes les autres règles décochées. Clique sur « Create ».

Ne touche surtout pas :
- aux secrets (Settings › Secrets and variables) ;
- aux autres rulesets s'il y en a ;
- à la visibilité du dépôt.

Vérification : le ruleset « main » apparaît en « Active », ciblant la branche par défaut, avec les quatre règles ci-dessus et les deux checks.

Compte rendu à me donner : le nom du ruleset, son statut, la liste des règles cochées et des checks ajoutés.
```

## 5. GitGuardian : classer l'ancienne alerte

```
Tu m'aides à classer une alerte GitGuardian qui n'est pas un vrai secret.

Où : https://dashboard.gitguardian.com, rubrique « Incidents ».

Étapes :
1. Ouvre l'incident 37781349 (« Generic Password », fichier compose.yaml, dépôt PULSACITY).
2. Résous-le comme faux positif : bouton « Resolve » ou « Ignore », raison « False positive » ou « Test credential », selon ce que propose l'écran. C'était le mot de passe « postgres » d'une base de test locale, retiré depuis.

Ne touche surtout pas : aux autres incidents, aux intégrations, aux réglages de l'espace GitGuardian.

Vérification : l'incident 37781349 n'est plus « Triggered ».

Compte rendu à me donner : le nouveau statut de l'incident et la raison choisie.
```

## 6. GitHub : passer le dépôt en privé (seulement si vous le décidez)

Aujourd'hui, tout le monde peut lire le code, docs-internes et les journaux des workflows. En privé, Vercel, GitGuardian et la CI continuent de fonctionner, et la CI tient dans les 2 000 minutes gratuites par mois. Mais sur le plan GitHub Free, la protection de `main` (prompt 4) ne s'applique plus à un dépôt privé : il faut GitHub Pro, environ 4 $ par mois, pour la garder.

```
Tu m'aides à passer le dépôt PULSACITY en privé. Je l'ai décidé.

Où : https://github.com/jawadboughalem/PULSACITY/settings, tout en bas, « Danger Zone ».

Étapes :
1. Clique sur « Change visibility », puis « Change to private ».
2. GitHub demande de confirmer en tapant le nom du dépôt : arrête-toi et demande-moi de le faire moi-même.
3. Une fois privé, ouvre https://github.com/jawadboughalem/PULSACITY/settings/rules et dis-moi si le ruleset « main » est toujours actif, ou si GitHub indique qu'il faut un plan payant.

Ne touche surtout pas : au transfert du dépôt, à l'archivage, à la suppression, aux secrets.

Vérification : le dépôt affiche « Private » à côté de son nom.

Compte rendu à me donner : la visibilité du dépôt et l'état du ruleset « main ».
```

## 7. Sentry : voir les erreurs de production (avant le lancement)

Le code est prêt : il suffit de renseigner `SENTRY_DSN`. Avant ce prompt, créez vous-même un compte sur https://sentry.io, en choisissant la région de données « European Union » (un agent ne crée pas de compte).

```
Tu m'aides à brancher Sentry sur la production de PULSACITY. Mon compte Sentry existe, en région européenne, et je suis connecté.

Étapes :
1. Sur https://sentry.io, crée un projet : plateforme « Next.js », nom pulsacity, alertes par défaut.
2. Dans les réglages du projet, rubrique « Client Keys (DSN) », repère le DSN. Arrête-toi et demande-moi de le copier moi-même.
3. Ouvre https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables et ajoute SENTRY_DSN, avec « Production » seul coché. Demande-moi de coller la valeur, puis enregistre.
4. Dans Vercel › Deployments, redéploie le dernier déploiement de production et attends « Ready ».

Ne touche surtout pas : aux autres variables, aux domaines, aux variables « Preview ».

Vérification : SENTRY_DSN existe en Production, et le redéploiement de production est « Ready ».

Compte rendu à me donner : le nom du projet Sentry, sa région, et le statut du redéploiement. Ne recopie pas le DSN.
```

---

## Pour Claude Design (hors Chrome)

Trois écrans du lot 4 ont été construits sans maquette. À coller dans Claude Design :

```
Pour PULSACITY, dessine trois écrans de l'espace du créateur qui n'ont pas encore de maquette, dans la charte et les composants existants (maquette 4, « Espace de Julie »), en desktop 1440 px et en mobile 360 px :
1. Ajouter un témoignage reçu ailleurs (WhatsApp, e-mail) : nom affiché, titre facultatif, note, texte, offre facultative, date de réception facultative, case « J'ai l'accord de cette personne pour publier son témoignage. », bouton « Ajouter le témoignage ». États : vide, erreurs sous les champs, envoi.
2. Importer un fichier CSV (colonnes nom, titre, note, texte, formation, date) : choix du fichier, aperçu ligne par ligne avec « 47 témoignages prêts, 3 lignes à revoir », bloc des lignes en erreur, case d'accord, bouton « Importer 47 témoignages », puis rapport final.
3. Offres : liste des offres avec renommer, délai avant la demande (jours), « Demander un avis après chaque vente » activé ou non, lien de collecte de l'offre à copier, identifiants par connecteur, ajout et retrait d'une offre.
Exporte un PNG par état, nommés m15-ajout-manuel-…, m16-import-csv-…, m17-offres-…
```
