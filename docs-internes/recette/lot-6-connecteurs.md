# Lot 6 — moteur de connecteurs, Systeme.io, demandes d'avis : actions et recette

Dans l'ordre. Chaque bloc est un prompt à coller tel quel dans Claude in Chrome, sauf le dernier, pour Claude Design.

- Prompts 1 et 2 : le secret de la tâche d'envoi, dans Vercel puis dans GitHub. Avant la fusion.
- Prompt 3 : l'espace de démonstration de recette, rempli depuis la branche de la PR.
- Prompts 4 à 6 : recette sur l'aperçu de la PR #23, avant la fusion.
- Prompt 7 : une vraie vente sur le compte Systeme.io de test, en production, après la fusion.
- Prompt 8 : pour Claude Design.

Adresse de l'aperçu : https://pulsacity-git-claude-zen-cori-x7joes-jawadboughalems-projects.vercel.app. La migration 0006 est déjà appliquée à la base de recette (« Recette database migration », vert).

Déjà vérifié par Claude Code dans son conteneur :
- une vente au format capturé le 27 septembre, signée avec la clé de la connexion, arrive (200), attend d'être associée, puis crée l'achat et la demande dès que son produit est associé ;
- un faux connecteur « test », ajouté avec un dossier et une ligne dans le registre, a reçu et traité une vente, puis a été retiré : son adresse répond 404 ;
- « Envoyer maintenant » envoie l'e-mail de la maquette 3, le lien ouvre le formulaire, l'avis est lié au client, la demande passe « Complétée » ; le lien de désinscription mène à « Désinscription confirmée » ;
- la même vente reçue deux fois ne crée ni second achat ni seconde demande ; deux envois lancés en même temps ne partent qu'une fois ;
- pages à 360 px et 1440 px, sans débordement, à côté de m5, m17 et m3.

À savoir avant la recette :
- Vercel est sur le plan Hobby, qui ne lance une tâche Cron qu'une fois par jour. Les demandes partent donc toutes les 15 minutes par le workflow GitHub « Send review requests », et Vercel Cron passe une fois par jour en filet de sécurité. Les deux envoient le même secret, `CRON_SECRET` (prompts 1 et 2). Le workflow ne tourne qu'après la fusion, sur `main`.
- Sur un aperçu, rien ne part tout seul : on fait partir une demande avec « Envoyer maintenant », sur la page Demandes.
- Systeme.io ne peut pas joindre un aperçu, protégé par Vercel Authentication. Sur l'aperçu, une vente Systeme.io est donc simulée depuis la page, au format exact capturé le 27 septembre et signée avec la clé de la connexion (prompt 5). La vraie vente se fait en production (prompt 7).

---

## Avant les prompts 1 et 2 : créer la valeur du secret, vous-même

Une suite de lettres et de chiffres, au moins 32 caractères, que vous ne réutilisez nulle part :
- au bureau, dans PowerShell : `-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object { [char]$_ })`
- sur Mac, dans le Terminal : `openssl rand -hex 32`

Copiez-la. Vous la collerez vous-même dans Vercel (prompt 1) puis dans GitHub (prompt 2). Elle ne va dans aucune conversation, aucun compte rendu, aucun fichier.

## 1. Vercel — la variable CRON_SECRET (production)

```
Tu m'aides à ajouter une variable d'environnement au projet Vercel de PULSACITY. Tu ne vois jamais sa valeur : c'est moi qui la colle.

Où : https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables

Étapes :
1. Clique sur « Add New » (ou « Add Environment Variable »).
2. Key : CRON_SECRET
3. Environments : coche « Production » seulement. Décoche « Preview » et « Development ».
4. Arrête-toi et dis-moi : « Collez la valeur dans le champ Value, puis dites-moi OK. » Attends mon OK. Ne lis pas la valeur, ne la recopie pas.
5. Après mon OK, clique sur « Save ».

Ne touche surtout pas :
- aux autres variables, ni à leurs environnements ;
- aux réglages de domaine, de build, de Git ou de Deployment Checks ;
- à un redéploiement : la variable sera prise par le déploiement de la fusion.

Vérification : la liste montre CRON_SECRET, environnement « Production », valeur masquée.

Compte rendu à me donner : le nom de la variable et ses environnements. Jamais sa valeur.
```

## 2. GitHub — le secret CRON_SECRET

```
Tu m'aides à ajouter un secret au dépôt GitHub de PULSACITY. Tu ne vois jamais sa valeur : c'est moi qui la colle.

Où : https://github.com/jawadboughalem/PULSACITY/settings/secrets/actions

Étapes :
1. Clique sur « New repository secret ».
2. Name : CRON_SECRET
3. Arrête-toi et dis-moi : « Collez dans Secret la même valeur que dans Vercel, puis dites-moi OK. » Attends mon OK. Ne lis pas la valeur.
4. Après mon OK, clique sur « Add secret ».

Ne touche surtout pas :
- aux secrets DATABASE_URL et RECETTE_DATABASE_URL ;
- aux réglages du dépôt, aux rulesets, aux workflows.

Vérification : la liste des secrets montre CRON_SECRET, avec DATABASE_URL et RECETTE_DATABASE_URL toujours présents.

Compte rendu à me donner : la liste des noms de secrets. Jamais une valeur.
```

Après le prompt 2 : effacez la valeur de votre presse-papiers (copiez n'importe quel mot).

## 3. GitHub — l'espace de démonstration de recette, depuis la branche de la PR

L'espace « Julie Nutrition » de la branche a maintenant une connexion Systeme.io, des produits à associer et des événements reçus. Le workflow remet l'espace à zéro pour l'adresse donnée.

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

## 4. Recette sur ordinateur, sur l'aperçu : les écrans Connecteurs

Avant ce prompt : connectez-vous vous-même à l'aperçu, avec l'adresse du prompt 3, fenêtre en grand. Ouvrez bien l'adresse de l'aperçu ci-dessus (celle de la branche), pas une autre adresse de déploiement.

```
Tu fais la recette des écrans Connecteurs de PULSACITY sur l'aperçu où je suis connecté, fenêtre en grand. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

A. La liste
1. Clique sur « Connecteurs » dans le menu. Titre « Connecteurs », sous-titre « Reliez l'outil où vous vendez : chaque achat déclenche une demande d'avis. »
2. Ligne Systeme.io : badge vert « Connecté », texte « Formations, coachings et tunnels de vente · dernière vente reçue il y a … · 1 produit à associer », bouton « Gérer ».
3. Lignes Stripe et Calendly : badge gris « Bientôt » et bouton « Me prévenir ». Clique sur « Me prévenir » de Stripe : le bouton laisse place à « Nous vous préviendrons par e-mail ». Recharge : le message reste.
4. Sous la liste : « Vous vendez ailleurs ? Dites-nous quel outil. … ». Clique sur « Dites-nous quel outil », écris « Learnybox », clique sur « Envoyer » : « Merci, c'est noté. … ».

B. La page Systeme.io
5. Clique sur « Gérer ». En haut : « Connecteurs > Systeme.io », titre « Connecter Systeme.io ».
6. Bandeau vert : « Connecté — dernière vente reçue il y a … », puis « Tout fonctionne. Vous n'avez plus rien à faire ici. »
7. « La connexion en 3 étapes », étape 1 : « Adresse de connexion » (commence par l'adresse de l'aperçu, puis /api/connectors/systeme/) avec « Copier », et « Clé secrète » masquée avec « Copier ». Clique sur chaque « Copier » : le bouton dit « Copiée ». Ne colle la clé nulle part.
8. Étape 2 : trois dessins des réglages Systeme.io, avec les légendes 1, 2 et 3 (« Paramètres » et « Webhooks », champs « URL » et « Secret », « Nouvelle vente » et « Vente annulée »). Aucun texte ne se chevauche dans les dessins.
9. Étape 3 : « Faire une vente test, ou attendre la prochaine » et le bouton « Vérifier la connexion ».
10. « Offres à associer » : « Programme 30 jours - Mieux manger sans régime », « 297 € · première vente le … », offre « Programme 30 jours », badge « Associée » ; « Suivi individuel 3 mois », « 590 € · première vente hier à 18:42 », « Choisir une offre », badge « À associer ». Sous le tableau : « Tant qu'un produit n'est pas associé, ses ventes sont gardées de côté : aucune demande n'est envoyée. »
11. « Derniers événements reçus » : trois ventes lisibles, sans JSON (« Nouvelle vente · … · Léa », « … · Karim » avec « En attente : associez ce produit à une offre », « … · Hélène »), puis « Connexion établie · Systeme.io ».

C. Associer un produit
12. Sur la ligne « Suivi individuel 3 mois », choisis l'offre « Suivi individuel 3 mois ». Message « Produit associé. Ses ventes gardées de côté sont traitées. », badge « Associée ».
13. Dans « Derniers événements reçus », la vente de Karim dit maintenant « Demande d'avis prévue le … » (environ 14 jours après hier).
14. Ouvre « Offres ». « Suivi individuel 3 mois » affiche « 590 € » sous son nom, et dans « Identifiants par connecteur » : « Systeme.io », « Produit « Suivi individuel 3 mois » » et « Modifier ». « Atelier cuisine » affiche « Systeme.io · aucun produit associé » et le lien « Associer un produit Systeme.io », qui ramène au tableau de la page Systeme.io.

D. Changer d'adresse
15. Sur la page Systeme.io, note les dix derniers caractères de l'adresse de connexion. Clique sur « Changer d'adresse et de clé » : une fenêtre demande confirmation. Clique sur « Changer d'adresse ».
16. L'adresse a changé (ses dix derniers caractères aussi), le bandeau dit « En attente de votre première vente… ». Clique sur « Vérifier la connexion » : le bandeau reste en attente et dit « Toujours rien reçu. Vérifiez les étapes 1 et 2, puis faites un achat test. »

Ne touche à aucun autre réglage de l'espace.

Compte rendu à me donner : les points 1 à 16 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```

## 5. Recette sur l'aperçu : une vente, l'e-mail, le rejeu, la désinscription

Avant ce prompt : restez connecté à l'aperçu, fenêtre en grand. Choisissez une adresse de client de test qui arrive dans votre boîte, par exemple un alias avec « +client6 », et remplacez ADRESSE_CLIENT_TEST par elle dans le prompt, aux deux endroits. Gardez votre messagerie ouverte dans le même navigateur : l'aperçu ne s'ouvre qu'avec votre session Vercel.

```
Tu fais la recette de la réception des ventes et des demandes d'avis de PULSACITY, sur l'aperçu où je suis connecté. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

Le script ci-dessous simule une vente Systeme.io au format exact capturé le 27 septembre, signée avec la clé de la page, comme Systeme.io le ferait. Il lit l'adresse et la clé dans la page sans les afficher. Tu le colles dans la console des outils de développement, sur la page Connecteurs > Systeme.io, et tu ne l'affiches jamais dans ton compte rendu.

const EMAIL = "ADRESSE_CLIENT_TEST";
const address = document.querySelector("#connection-address").value;
const secret = document.querySelector("#connection-secret").value;
if (location.origin !== new URL(address).origin) throw new Error("Ouvre l'aperçu à l'adresse " + new URL(address).origin);
const sign = async (key, body) => {
  const cryptoKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(body));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};
window.sale = async (orderItemId, { pricePlanId = 3456303, name = "Produit physique test PULSACITY", key = secret, to = address } = {}) => {
  const at = new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00");
  const body = JSON.stringify({ customer: { id: 12799002, clientIp: "203.0.113.10", contactId: 445573087, email: EMAIL, fields: { first_name: "Camille", country: "FR", postcode: "75001" }, paymentProcessor: "cash on delivery", sourceUrl: "https://exemple.systeme.io/466f06b8" }, coupon: null, funnelStep: { id: 25610405, name: "Bon de commande", type: "offer-form", funnel: { id: 7648170, name: "Tunnel test PULSACITY" } }, checkoutPage: null, order: { id: 12768300 + orderItemId, createdAt: at, discountAmount: null, discountType: null, shippingFee: null, totalPrice: 100, vat: 0.0 }, orderItem: { createdAt: at, id: orderItemId, resources: [{ course: null, courseBundle: null, enrollmentAccessType: null, enrollmentDrippingAccessCourse: null, physicalProduct: { id: 170454, name, options: [] }, tag: null }] }, pricePlan: { id: pricePlanId, name, type: "one_shot", amount: 100, currency: "eur", innerName: name, recurringOptions: null, statementDescriptor: "" } });
  const response = await fetch(to, { method: "POST", headers: { "content-type": "application/json", "x-webhook-event": "SALE_NEW", "x-webhook-signature": await sign(key, body) }, body });
  return response.status;
};
"prêt";

A. Une vente d'un produit inconnu
1. Ouvre « Offres ». Sur « Atelier cuisine », mets le délai avant la demande à 0 jour, puis clique ailleurs : « Délai enregistré. » et « Pour une vente aujourd'hui, la demande partira le … » (aujourd'hui).
2. Ouvre « Connecteurs », puis « Gérer » sur Systeme.io. Ouvre la console, colle le script. Elle répond « prêt ».
3. Dans la console : await sale(900001). Elle répond 200. Recharge la page.
4. « Offres à associer » a une nouvelle ligne « Produit physique test PULSACITY », « 1 € · première vente à l'instant », badge « À associer ». En haut des événements : « Nouvelle vente · Produit physique test PULSACITY · Camille », « En attente : associez ce produit à une offre ».
5. Sur cette ligne, choisis l'offre « Atelier cuisine ». L'événement dit « Demande d'avis prévue le … » (aujourd'hui).

B. La demande et l'e-mail
6. Ouvre « Demandes ». En haut de la liste : « Camille · Atelier cuisine », badge « Planifiée », « Part au prochain envoi ». Clique sur « Envoyer maintenant ». La ligne passe à « Envoyée », « Envoyée le … · relance prévue le … » (dans 4 jours).
7. Dis-moi : « Ouvrez l'e-mail reçu à l'adresse de test, puis dites-moi OK. » Attends mon OK. Je vérifie moi-même : expéditeur « Julie Nutrition via PULSACITY », objet « Camille, votre avis sur Atelier cuisine ? », « Répondre à » l'adresse du compte de recette, bouton « Donner mon avis (1 minute) », lien « Ne plus recevoir ces e-mails » en bas.
8. Je clique sur le bouton de l'e-mail et je te donne l'onglet. Le formulaire s'appelle « Votre avis sur « Atelier cuisine » ? », le nom est déjà rempli avec « Camille ». Donne 5 étoiles, écris « Test de recette du lot 6 : très bon atelier. », coche le consentement, clique sur « Envoyer mon avis ». Message de remerciement.
9. Retourne sur l'aperçu, ouvre « Témoignages » : le nouvel avis de Camille est « En attente ». Ouvre sa fiche : sa provenance cite le connecteur Systeme.io. Ouvre « Demandes » : la ligne de Camille est « Complétée », « Avis reçu le … ».

C. La même vente, reçue une seconde fois
10. Retourne sur Connecteurs > Systeme.io. Dans la console (recolle le script s'il a disparu) : await sale(900001). Elle répond 200. Recharge.
11. Le nouvel événement dit « Déjà reçue : rien de nouveau ». « Demandes » n'a pas de nouvelle ligne pour Camille. Aucun nouvel e-mail n'arrive (demande-moi de vérifier, et attends mon OK).

D. Une clé qui ne correspond plus
12. Dans la console : await sale(900002, { key: "mauvaise-cle" }). Elle répond 200. Recharge.
13. Le bandeau devient rouge : « Problème de connexion », « Depuis aujourd'hui à …, Systeme.io nous envoie vos ventes avec une clé secrète qui ne correspond plus. Aucune vente n'est perdue : nous les gardons de côté. », puis « À faire : », « Copier la clé secrète » et « Revoir l'étape 2 ». « Revoir l'étape 2 » fait descendre à l'étape 2.
14. L'événement dit « Clé secrète différente : gardée de côté », avec un bouton « Rejouer ». Clique sur « Rejouer » : il dit maintenant « Ce client a déjà une demande pour cette offre ».
15. Dans la console : await sale(900003). Elle répond 200. Recharge : le bandeau redevient vert, « Connecté — dernière vente reçue à l'instant » ou « il y a 1 min ».

E. La désinscription
16. Dis-moi : « Cliquez sur « Ne plus recevoir ces e-mails » en bas de l'e-mail, puis donnez-moi l'onglet. » La page dit « Désinscription confirmée », « Vous ne recevrez plus de demande d'avis de Julie Nutrition. ».
17. Retourne sur Connecteurs > Systeme.io. Dans la console : await sale(900004, { pricePlanId: 3456399, name: "Programme test désinscription" }). Elle répond 200. Recharge. Associe le nouveau produit « Programme test désinscription » à l'offre « Programme 30 jours ».
18. L'événement dit « Pas de demande : ce client s'est désinscrit ». « Demandes » n'a pas de ligne « Camille · Programme 30 jours ».

F. Une adresse inconnue
19. Dans la console : await sale(900005, { to: address.slice(0, -4) + "abcd" }). Elle répond 404, et rien n'apparaît dans les événements.

Enfin, remets le délai d'« Atelier cuisine » à 14 jours. Ne touche à aucun autre réglage.

Compte rendu à me donner : les points 1 à 19 avec « OK » ou ta description, les codes renvoyés par la console, et une capture d'écran de chaque point qui n'est pas OK. Jamais l'adresse de connexion, la clé secrète, ni l'adresse e-mail de test.
```

## 6. Recette à 360 px, sur l'aperçu

Avant ce prompt : connecté à l'aperçu, fenêtre réduite à 360 × 800 (mode appareil des outils de développement).

```
Tu vérifies trois pages de PULSACITY en largeur téléphone, 360 × 800, sur l'aperçu où je suis connecté. Tu ne modifies rien. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Onglet « Plus », puis « Connecteurs ». Chaque ligne montre le carré du logo, le nom, le badge et le texte, puis son bouton sur toute la largeur. Rien ne déborde sur le côté (vérifie dans la console : document.documentElement.scrollWidth === window.innerWidth).
2. « Gérer » sur Systeme.io. Le lien « Connecteurs » de retour est en haut. Le bandeau, puis les étapes : les champs « Adresse de connexion » et « Clé secrète » sont l'un sous l'autre, chaque « Copier » sur toute la largeur. Les trois dessins sont l'un sous l'autre et lisibles.
3. « Offres à associer » : chaque produit est un bloc, avec « Offre PULSACITY », « Demande d'avis » et le badge d'état. Rien ne déborde.
4. « Derniers événements reçus » : chaque ligne a son rond d'icône, le texte, puis l'heure en dessous.
5. Onglet « Demandes » : les quatre chiffres sur deux lignes, le filtre « Statut », puis la liste. Une demande planifiée a « Envoyer maintenant » sur toute la largeur et « Annuler » dessous. Choisis « Complétées » dans le filtre : la liste ne garde que les demandes complétées. Remets « Toutes ».
6. Vérifie l'absence de débordement sur chaque page, comme au point 1.

Compte rendu à me donner : les points 1 à 6 avec « OK » ou ta description, et une capture d'écran de chaque page.
```

## 6 bis. Contre-recette sur l'aperçu : l'ordre et le filtre de Demandes

Après la correction du 3 octobre (voir le compte rendu en bas de page). Connecté à l'aperçu, fenêtre en grand ; rien à remplir de nouveau.

```
Tu vérifies deux corrections de la page Demandes de PULSACITY, sur l'aperçu où je suis connecté. Tu ne modifies rien. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Recharge la page (Ctrl+Maj+R) pour être sûr d'avoir la dernière version. Ouvre « Demandes ».
2. Les premières lignes sont les demandes « Planifiée », celle qui part le plus tôt en haut : les dates « Partira le … » vont croissant. Viennent ensuite les autres demandes, la plus récente activité d'abord : « Camille · Atelier cuisine », « Avis reçu le 3 oct. », est la première d'entre elles.
3. Sous les chiffres, la case « envoyées » ne dit plus « dont 0 relancée ».
4. Dans « Statut », choisis « Complétées ». L'adresse finit par ?statut=completees, la liste ne garde que des lignes « Complétée », et le bas de page dit « 1 à … sur … demandes » avec ce nombre. Le menu montre « Complétées ».
5. Recharge la page : le filtre et la liste restent les mêmes.
6. Choisis « Planifiées » : seules les lignes « Planifiée » restent, la plus proche en haut. Choisis « Toutes » : toute la liste revient.
7. En 360 × 800 (le même cadre qu'au prompt 6) : choisis « Complétées ». Le bouton du filtre affiche « Complétées » au lieu de « Statut », et la liste est filtrée. Remets « Toutes ».

Compte rendu à me donner : les points 1 à 7 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```

---

Après les prompts 4 à 6 : envoyez les comptes rendus à Claude Code. S'il n'y a rien à corriger, la PR #23 est fusionnée ; « Database migration » applique la migration 0006 en production, puis Vercel met la production en ligne. Vérifiez dans GitHub, onglet Actions, que le workflow « Send review requests » apparaît et passe au vert toutes les 15 minutes.

## 7. Production — une vraie vente sur le compte Systeme.io de test

Avant ce prompt : connectez-vous vous-même à pulsacity.com avec votre compte de test, et à Systeme.io avec le compte de test, dans deux onglets du groupe « PULSACITY ». L'offre du tunnel de test doit pouvoir s'acheter sans payer (code promo à 100 %, ou paiement à la livraison comme le 27 septembre). Choisissez une adresse de client de test (un autre alias, par exemple « +client7 ») et remplacez ADRESSE_CLIENT_TEST.

```
Tu m'aides à brancher le compte Systeme.io de test sur PULSACITY en production, puis à vérifier qu'une vraie vente déclenche une demande d'avis. Tu ne crées aucun compte. Tu ne recopies jamais l'adresse de connexion ni la clé secrète dans ton compte rendu.

A. Brancher Systeme.io
1. Onglet PULSACITY : ouvre https://pulsacity.com/app/connecteurs, puis « Connecter Systeme.io » (ou « Gérer »). Le bandeau dit « En attente de votre première vente… ».
2. Onglet Systeme.io : photo de profil, « Paramètres », « Webhooks ». S'il existe déjà un webhook « PULSACITY capture test » vers webhook.site, ne le supprime pas : désactive-le seulement (interrupteur « Actif(ve) »), puis enregistre.
3. Clique sur « Créer ». Nom : PULSACITY.
4. URL : dans l'onglet PULSACITY, clique sur « Copier » à côté de « Adresse de connexion », puis colle dans le champ « URL ».
5. Secret : dans l'onglet PULSACITY, clique sur « Copier » à côté de « Clé secrète », puis colle dans le champ « Secret ».
6. Coche « Nouvelle vente » et « Vente annulée ». Active le webhook. Enregistre.

B. Une vraie vente
7. Dans PULSACITY, ouvre « Offres » et note le délai de l'offre que tu associeras au point 10 (crée-la si besoin avec « Ajouter une offre », nom « Produit physique test PULSACITY »). Mets son délai à 0 jour.
8. Ouvre l'adresse publique du tunnel « Tunnel test PULSACITY » dans un nouvel onglet. Achète l'offre avec l'adresse ADRESSE_CLIENT_TEST et le prénom Camille, sans payer (code promo à 100 % ou paiement à la livraison).
9. Dans PULSACITY, Connecteurs > Systeme.io : recharge jusqu'à voir la vente dans « Derniers événements reçus » (une minute au plus). Le bandeau passe au vert : « Connecté — dernière vente reçue … ».
10. Dans « Offres à associer », associe le produit reçu à l'offre du point 7. L'événement dit « Demande d'avis prévue le … » (aujourd'hui).
11. Ouvre « Demandes » : « Camille · … », « Planifiée », « Part au prochain envoi ». Ne clique pas sur « Envoyer maintenant » : on vérifie l'envoi automatique.
12. Attends au plus 20 minutes en rechargeant « Demandes » toutes les 5 minutes : la ligne passe à « Envoyée ». Dis-moi alors : « Vérifiez l'e-mail reçu à l'adresse de test. » et attends mon OK.
13. Remets le délai de l'offre à la valeur notée au point 7.

Ne touche surtout pas :
- aux autres webhooks, règles d'automatisation, tunnels ou contacts de Systeme.io ;
- aux réglages de l'espace PULSACITY autres que le délai du point 7.

Compte rendu à me donner : les points 1 à 13 avec « OK » ou ta description, l'heure de la vente et l'heure où la demande est passée « Envoyée ». Jamais l'adresse de connexion, la clé, ni l'adresse e-mail de test.
```

Facultatif, après le prompt 7 : pour les inscriptions sans vente (formation offerte), une règle d'automatisation Systeme.io « Inscrit à la formation » → « Appeler un webhook », avec la même adresse de connexion, suffit. Le plan gratuit de Systeme.io n'en permet qu'une.

---

## 8. Pour Claude Design (hors Chrome)

```
Pour PULSACITY, le lot des connecteurs est construit (maquettes 3 et 5). Merci de dessiner ce qui manque, dans la charte et le style de m4, m5 et m17 :
1. Page « Demandes » (desktop 1440 et mobile 360). Elle existe déjà, construite avec les éléments de m4 et m5 : en haut quatre chiffres (planifiées, envoyées dont relancées, complétées par un avis, taux de réponse), un filtre « Statut » (Toutes, Planifiées, Envoyées, Relancées, Complétées, Annulées, Échecs), puis une ligne par demande : « Camille R. · Programme 30 jours », une phrase (« Partira le 27 oct. », « Envoyée le 3 oct. · relance prévue le 7 oct. », « Avis reçu le 5 oct. »), un badge de statut (Planifiée, Envoyée, Relancée, Complétée, Annulée, Échec) et les actions « Envoyer maintenant » et « Annuler » (ou « Annuler la relance »). Quand le plan Gratuit a envoyé ses 20 demandes du mois, un encadré dit que les suivantes partiront le 1er du mois suivant. Proposez la mise en page, la couleur des badges Envoyée, Relancée et Annulée (la charte n'en a pas), et l'état vide.
2. Maquette 5 en mobile 360 : la liste des connecteurs et la page Systeme.io (bandeau, trois étapes, « Offres à associer », événements).
3. Maquette 5, deux états absents : une ligne d'événement « Clé secrète différente : gardée de côté » avec son bouton « Rejouer », et le lien discret « Changer d'adresse et de clé » sous l'étape 1, avec sa fenêtre de confirmation.
4. Maquette 5, étape 2 : nous avons dessiné les trois écrans de Systeme.io à la place des captures. Les captures réelles sont-elles préférables ? Et les logos de Systeme.io, Stripe et Calendly à la place de « [Logo] » : sont-ils autorisés, et sous quelle forme ?
5. Maquette 5, une étape facultative pour les inscriptions sans vente (formation offerte) : une règle d'automatisation Systeme.io « Inscrit à la formation » → « Appeler un webhook », avec la même adresse.
6. Page de confirmation de la désinscription (mobile et desktop), dans le style de m1 « lien inactif » : « Désinscription confirmée », « Vous ne recevrez plus de demande d'avis de Julie Nutrition. », « Un lien déjà reçu reste valable : vous pouvez toujours donner votre avis. », « Écrire à Julie Nutrition ».
7. m3 : la ligne « Julie Martin · Julie Nutrition, Lyon » et l'adresse postale du pied supposent le prénom du créateur, sa ville et son adresse, que PULSACITY ne demande pas. L'e-mail signe pour l'instant du nom de l'espace. Faut-il les demander, et où ?
Exporte les PNG, avec des noms qui suivent INDEX.md.
```

---

## Compte rendu de la recette sur l'aperçu (3 octobre)

- Prompts 1 et 2 : `CRON_SECRET` ajouté dans Vercel (Production seulement, valeur masquée, pas de redéploiement) et dans les secrets GitHub, à côté de `DATABASE_URL` et `RECETTE_DATABASE_URL`.
- Prompt 3 : « Recette demo space #4 » depuis la branche `claude/zen-cori-x7joes`, plan free, vert en 40 s.
- Prompt 4 : 16 points sur 16 (fenêtre de 1 536 px). La flèche du dessin 1 touche le coin du bouton « Créer » : voulu, le texte reste lisible.
- Prompt 5 : 18 points sur 19. Point 6 : la demande de Camille, qui partait au prochain envoi, était sixième, sous cinq demandes planifiées : la liste triait tout par date décroissante. Corrigé : les demandes à envoyer d'abord, la plus proche en haut, puis les autres par activité la plus récente. Le reste : vente simulée, association, « Envoyer maintenant », e-mail, formulaire pré-rempli, avis lié au client (« Connecteur Systeme.io »), rejeu sans doublon, clé différente puis « Rejouer », désinscription et adresse inconnue (404) sont conformes.
- Prompt 6 : mise en page à 360 px conforme, aucun débordement. Le filtre « Statut » ne filtrait pas (ni en mobile, ni sur ordinateur) : la page lisait le nom du paramètre depuis un composant client, où elle recevait une référence au lieu du texte « statut ». Corrigé, et vérifié dans le conteneur à 1440 et 360 px. Contre-recette : prompt 6 bis.
- Remarques sans correction :
  - le libellé d'un événement prend le nom de l'offre une fois le produit associé (« Nouvelle vente · Atelier cuisine · Camille ») : voulu, c'est le nom que le créateur connaît ;
  - « Atelier cuisine » affiche « 1 € » sur la page Offres : c'est le prix du produit de test associé pendant la recette ;
  - le logo de l'e-mail « Nouveau témoignage » ne s'affichait pas : sur un aperçu, l'image est servie par l'adresse de l'aperçu, protégée par Vercel Authentication, que la messagerie ne peut pas lire. En production, pulsacity.com la sert à tous ;
  - la photo met environ une seconde à apparaître : adresse r2.dev, déjà prévue avant le lancement.
- Prompt 6 bis (contre-recette) : 7 points sur 7. Les demandes planifiées sont en tête, par date de départ croissante, puis « Camille · Atelier cuisine », « Avis reçu le 3 oct. » ; « 9 envoyées », sans « dont 0 relancée » ; « Complétées » garde les 4 demandes complétées, « 1 à 4 sur 4 demandes », après rechargement aussi ; « Planifiées » garde les 5 planifiées. À 360 px, le bouton du filtre affiche « Complétées ». Dans le cadre de 360 px, le menu natif du téléphone ne réagit pas aux clics de Claude in Chrome (comme au prompt 6) : le choix a été fait par la console. À essayer au doigt sur un vrai téléphone, comme le filtre de Témoignages, qui repose sur le même composant.

