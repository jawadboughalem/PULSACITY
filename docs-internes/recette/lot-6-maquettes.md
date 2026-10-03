# Lot 6, suite — Demandes (m19), Connecteurs (m5) et désinscription (m1) : recette

Dans l'ordre. Chaque bloc est un prompt à coller tel quel dans Claude in Chrome.

- Prompt 1 : l'espace de démonstration de recette, rempli depuis la branche de la PR #24.
- Prompts 2 à 4 : recette sur l'aperçu de la PR #24, avant la fusion.
- Prompt 5 : production, la demande de la vraie vente du 3 octobre et l'envoi automatique. Les points 1 à 4 peuvent se faire tout de suite.

Adresse de l'aperçu : https://pulsacity-git-claude-zen-cori-x7joes-jawadboughalems-projects.vercel.app. « Recette database migration » applique la migration 0007 à la base de recette dès l'ouverture de la PR.

Déjà vérifié par Claude Code dans son conteneur, à 1440 px et 360 px, à côté des maquettes :
- Demandes : chiffres du mois, pastilles et liste déroulante avec leurs nombres, badges de la planche des statuts, actions par statut, « Afficher les 3 suivantes » au-delà de 50 demandes, état vide, plan Gratuit à 20 demandes envoyées (encadré, « Prévue le … · partira le 1er nov. », plus de « Envoyer maintenant ») ;
- « Corriger l'adresse » : adresse refusée par le navigateur, adresse d'un autre client refusée, adresse corrigée puis demande repartie ; « Voir l'avis » ouvre la fiche du témoignage ;
- Systeme.io : fenêtre « Changer d'adresse et de clé ? », étape facultative, bandeau ambre et vente gardée de côté en tête des événements ;
- « Désinscription confirmée » selon m1 ;
- aucun débordement sur le côté.

À savoir :
- Le plan Gratuit plein (20 demandes envoyées dans le mois) ne se reproduit pas sur l'espace de démonstration, qui en a 9 : il est vérifié dans le conteneur.
- L'état vide de Demandes demande un espace sans aucune demande : vérifié dans le conteneur aussi.
- Les dates « … » dépendent du jour de la recette : seul leur ordre et leur forme comptent.

---

## 1. GitHub — l'espace de démonstration de recette, depuis la branche de la PR

L'espace « Julie Nutrition » de la branche a maintenant une demande relancée, une annulée, une en échec, et trois demandes complétées reliées à leur témoignage. Le workflow remet l'espace à zéro pour l'adresse donnée.

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

## 2. Recette sur ordinateur, sur l'aperçu : Demandes, puis un e-mail et la désinscription

Avant ce prompt : connectez-vous vous-même à l'aperçu, avec l'adresse du prompt 1, fenêtre en grand. Choisissez une adresse de client de test qui arrive dans votre boîte (par exemple un alias avec « +client7 ») et remplacez ADRESSE_CLIENT_TEST par elle dans le prompt. Gardez votre messagerie ouverte dans le même navigateur.

```
Tu fais la recette de la page Demandes de PULSACITY sur l'aperçu où je suis connecté, fenêtre en grand. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

A. L'en-tête et les chiffres
1. Clique sur « Demandes » dans le menu. Titre « Demandes », puis « Une demande d'avis part après chaque vente, au délai réglé dans Offres. Vous pouvez l'envoyer plus tôt ou l'annuler. »
2. Quatre chiffres : « 4 planifiées », « 9 envoyées ce mois, dont 1 relancée », « 3 complétées par un avis », « 33 % taux de réponse ce mois ».
3. Sous les chiffres, « Statut » puis des pastilles : « Toutes (15) », « Planifiées (4) », « Envoyées (5) », « Relancées (1) », « Complétées (3) », « Annulées (1) », « Échecs (1) ». « Toutes (15) » est cerclée de foncé, sur fond gris clair.

B. Les lignes
4. Chaque ligne commence par les initiales du client dans un rond. Première ligne : « Bruno P. · Atelier cuisine », en rouge « Non envoyée le …, après trois essais. Vérifiez l'adresse e-mail. », badge rouge « Échec », lien rouge « Corriger l'adresse » à droite.
5. Puis quatre lignes « Planifiée » (badge gris clair, horloge) : Hélène T., Julia P., Oscar G., Léa M., avec « Partira le … » dans l'ordre des dates. Chacune a deux liens rouges à droite : « Envoyer maintenant » et « Annuler ».
6. « Margot L. · Programme 30 jours » : « Annulée le … », badge « Annulée » au contour gris en pointillé, sans lien.
7. « Marc D. · Suivi individuel 3 mois » : « Envoyée le … · relancée le … », badge blanc cerclé de foncé « Relancée » avec une flèche ronde, sans lien.
8. Les lignes « Envoyée » ont un badge blanc cerclé de foncé avec une enveloppe. Noé F. et Rose B. ont le lien « Annuler la relance » ; les autres n'ont pas de lien.
9. Camille R., Nadia B. et Sophie D. : badge vert « Complétée », « Avis reçu le … », lien « Voir l'avis ». Clique sur « Voir l'avis » de Sophie D. : la fiche du témoignage de Sophie D. s'ouvre. Reviens sur Demandes.

C. Le filtre
10. Clique sur la pastille « Planifiées (4) » : l'adresse finit par ?statut=planifiees, seules les quatre lignes « Planifiée » restent, et la pastille est cerclée de foncé. Clique sur « Toutes (15) ».

D. Corriger l'adresse, l'e-mail, la désinscription
11. Sur la ligne de Bruno P., clique sur « Corriger l'adresse ». Une fenêtre : « Corriger l'adresse de Bruno P. », « La demande repartira au prochain envoi, à cette adresse. », le champ « Adresse e-mail » rempli avec bruno.petit@exemple.fr, et les boutons « Annuler » et « Enregistrer l'adresse ».
12. Remplace l'adresse par sophie.durand@exemple.fr, clique sur « Enregistrer l'adresse » : en rouge sous le champ, « Un autre client de votre espace a déjà cette adresse. Vérifiez-la, puis réessayez. » La fenêtre reste ouverte.
13. Remplace par ADRESSE_CLIENT_TEST, clique sur « Enregistrer l'adresse ». La fenêtre se ferme. La ligne de Bruno P. devient « Planifiée », « Part au prochain envoi », avec « Envoyer maintenant » et « Annuler ». Les pastilles disent « Planifiées (5) » et « Échecs (0) ».
14. Clique sur « Envoyer maintenant » de Bruno P. : la ligne devient « Envoyée », « Envoyée le … · relance prévue le … ». Les chiffres disent « 10 envoyées ce mois, dont 1 relancée » et « 30 % ».
15. Dis-moi : « Ouvrez l'e-mail reçu à l'adresse de test, puis dites-moi OK. » Attends mon OK. Je vérifie moi-même : expéditeur « Julie Nutrition via PULSACITY », objet « Bruno, votre avis sur Atelier cuisine ? ».
16. Je clique sur « Ne plus recevoir ces e-mails » en bas de l'e-mail et je te donne l'onglet. La page, sur fond gris clair : en haut le rond « JN » et « Julie Nutrition » ; un rond cerclé de foncé avec une coche ; « Désinscription confirmée » ; « Vous ne recevrez plus de demande d'avis de Julie Nutrition. » ; en gris « Un lien déjà reçu reste valable : vous pouvez toujours donner votre avis. » ; un bouton rouge sur toute la largeur de la colonne, avec une enveloppe, « Écrire à Julie Nutrition » ; juste dessous, « Propulsé par Pulsacity ». Garde cet onglet ouvert pour le prompt suivant.
17. Retourne sur Demandes et recharge : la ligne de Bruno P. dit « Envoyée le … · sans relance », sans lien.

Ne touche à aucun autre réglage de l'espace.

Compte rendu à me donner : les points 1 à 17 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK. Jamais l'adresse e-mail de test.
```

---

## 3. Recette sur ordinateur, sur l'aperçu : la page Systeme.io

Avant ce prompt : toujours connecté à l'aperçu, fenêtre en grand.

```
Tu fais la recette de la page Connecteurs > Systeme.io de PULSACITY sur l'aperçu où je suis connecté, fenêtre en grand. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

A. Changer d'adresse et de clé
1. Ouvre « Connecteurs », puis « Gérer » sur Systeme.io. Sous les champs de l'étape 1, en petit et en gris : « Adresse partagée par erreur ? », suivi du lien rouge souligné « Changer d'adresse et de clé ».
2. Note les dix derniers caractères de l'adresse de connexion. Clique sur le lien : une fenêtre « Changer d'adresse et de clé ? », puis « Une nouvelle adresse et une nouvelle clé secrète remplacent les anciennes, qui cessent de fonctionner tout de suite. » et « Juste après, collez-les dans Systeme.io, dans le webhook « PULSACITY ». Une vente envoyée entre-temps à l'ancienne adresse ne nous parviendra pas. » En bas à droite : le lien rouge « Annuler », puis le bouton foncé « Changer l'adresse et la clé ».
3. Clique sur « Annuler » : la fenêtre se ferme, l'adresse n'a pas changé.

B. L'étape facultative
4. Sous l'étape 3, un rond cerclé de foncé avec un « + », puis « Facultatif : les inscriptions sans vente » et « Vous offrez une formation ? Systeme.io n'y voit pas de vente. Une règle d'automatisation nous prévient quand même de chaque inscription, à la même adresse. »
5. Deux cadres côte à côte, reliés par un chevron : « Déclencheur », « Inscrit à la formation », « Choisissez la formation offerte. » ; « Action », « Appeler un webhook », « Collez l'adresse de l'étape 1. ». Dessous : « Dans Systeme.io : Automatisations, puis Règles et Créer. Chaque inscription arrive ici avec le nom de la formation : associez-la à une offre, et la demande d'avis part au délai choisi. »

C. Une vente gardée de côté
Le script ci-dessous simule une vente Systeme.io au format exact capturé le 27 septembre, signée avec la clé de la page. Il lit l'adresse et la clé dans la page sans les afficher. Colle-le dans la console des outils de développement, sur cette page, et ne l'affiche jamais dans ton compte rendu.

const address = document.querySelector("#connection-address").value;
const secret = document.querySelector("#connection-secret").value;
if (location.origin !== new URL(address).origin) throw new Error("Ouvre l'aperçu à l'adresse " + new URL(address).origin);
const sign = async (key, body) => {
  const cryptoKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(body));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};
window.sale = async (orderItemId, { pricePlanId = 3456401, name = "Programme 30 jours - Mieux manger sans régime", key = secret } = {}) => {
  const at = new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00");
  const body = JSON.stringify({ customer: { id: 12799003, clientIp: "203.0.113.10", contactId: 445573088, email: "ines.test@exemple.fr", fields: { first_name: "Inès", country: "FR", postcode: "75001" }, paymentProcessor: "cash on delivery", sourceUrl: "https://exemple.systeme.io/466f06b8" }, coupon: null, funnelStep: { id: 25610405, name: "Bon de commande", type: "offer-form", funnel: { id: 7648170, name: "Tunnel test PULSACITY" } }, checkoutPage: null, order: { id: 12768300 + orderItemId, createdAt: at, discountAmount: null, discountType: null, shippingFee: null, totalPrice: 29700, vat: 0.0 }, orderItem: { createdAt: at, id: orderItemId, resources: [{ course: null, courseBundle: null, enrollmentAccessType: null, enrollmentDrippingAccessCourse: null, physicalProduct: { id: 170454, name, options: [] }, tag: null }] }, pricePlan: { id: pricePlanId, name, type: "one_shot", amount: 29700, currency: "eur", innerName: name, recurringOptions: null, statementDescriptor: "" } });
  const response = await fetch(address, { method: "POST", headers: { "content-type": "application/json", "x-webhook-event": "SALE_NEW", "x-webhook-signature": await sign(key, body) }, body });
  return response.status;
};
"prêt";

6. Colle le script dans la console : elle répond « prêt ».
7. Dans la console : await sale(910001, { key: "mauvaise-cle" }). Elle répond 200. Recharge la page. Le bandeau est rouge, « Problème de connexion », comme avant. En tête des « Derniers événements reçus » : un rond ambre avec un triangle, « Nouvelle vente · Programme 30 jours · Inès », en ambre « Clé secrète différente : gardée de côté. Corrigez la clé dans Systeme.io, puis rejouez la vente. », et un bouton « Rejouer » avec une flèche ronde.
8. Recolle le script si la console l'a perdu, puis : await sale(910002). Elle répond 200. Recharge. Le bandeau devient ambre : « 1 vente gardée de côté », « Elle est arrivée avec une autre clé secrète. Rien n'est perdu : corrigez la clé, puis rejouez-la depuis les événements. » La vente gardée de côté reste en tête des événements, au-dessus de la vente plus récente « Nouvelle vente · Programme 30 jours · Inès », « Demande d'avis prévue le … ».
9. Dans la console : await sale(910003, { pricePlanId: 3456402, name: "Suivi individuel 3 mois" }). Elle répond 200. Recharge. « Voir tout l'historique » apparaît à droite du titre « Derniers événements reçus ».
10. Clique sur « Rejouer » de la vente gardée de côté. Elle dit maintenant « Ce client a déjà une demande pour cette offre ». Le bandeau redevient vert, « Connecté — dernière vente reçue … », et les événements reviennent dans l'ordre, le plus récent en haut.

Ne touche à aucun autre réglage de l'espace.

Compte rendu à me donner : les points 1 à 10 avec « OK » ou ta description, les codes renvoyés par la console, et une capture d'écran de chaque point qui n'est pas OK. Jamais l'adresse de connexion ni la clé secrète.
```

---

## 4. Recette à 360 px, sur l'aperçu

Avant ce prompt : connecté à l'aperçu, en 360 × 800 (mode appareil des outils de développement), avec l'onglet de désinscription du prompt 2 encore ouvert.

```
Tu vérifies des pages de PULSACITY en largeur téléphone, 360 × 800, sur l'aperçu où je suis connecté. Tu ne modifies rien. Pour chaque point, note « OK » ou décris ce que tu vois. Sur chaque page, vérifie dans la console qu'il n'y a pas de débordement : document.documentElement.scrollWidth === window.innerWidth.

1. Onglet « Demandes ». En haut, la barre avec le logo et les initiales du compte ; puis le titre « Demandes » et son texte ; les quatre chiffres sur deux lignes de deux ; « Statut » au-dessus d'une liste déroulante sur toute la largeur, qui affiche « Toutes (16) » (les 15 de l'espace, plus la demande d'Inès du prompt 3).
2. Chaque demande : les initiales à gauche ; à droite le nom et l'offre, la phrase, le badge dessous, puis les liens rouges dessous (par exemple « Envoyer maintenant » et « Annuler » côte à côte).
3. Choisis « Complétées (3) » dans la liste déroulante (au doigt si tu peux ; sinon, dans la console : const s = document.querySelector("#request-status"); s.value = "completees"; s.form.requestSubmit();). Seules les demandes « Complétée » restent et la liste affiche « Complétées (3) ». Remets « Toutes ».
4. Onglet « Plus », « Connecteurs », « Gérer » sur Systeme.io. Le carré du logo est au-dessus du titre « Connecter Systeme.io ». Les titres « La connexion en 3 étapes », « Offres à associer » et « Derniers événements reçus » sont plus petits que le titre de la page.
5. Étape 1 : « Adresse partagée par erreur ? » puis le lien « Changer d'adresse et de clé ». Clique sur le lien : la fenêtre a le bouton foncé « Changer l'adresse et la clé » sur toute la largeur, et « Annuler » dessous, en bouton blanc cerclé. Clique sur « Annuler ».
6. Étape 2 : sous son titre, « Plus simple depuis un ordinateur. ». L'étape facultative : les deux cadres l'un sous l'autre, reliés par un chevron vers le bas.
7. Sous la liste des événements : « Voir tout l'historique » (il n'est plus à droite du titre).
8. L'onglet de « Désinscription confirmée » : le contenu du prompt 2, le bouton rouge sur toute la largeur, « Propulsé par Pulsacity » juste dessous.

Compte rendu à me donner : les points 1 à 8 avec « OK » ou ta description, et une capture d'écran de chaque page.
```

---

## 5. Production — la demande de la vraie vente, et l'envoi automatique

Les points 1 à 4 peuvent se faire tout de suite ; le point 1 se refait une heure après la fusion de la PR #24. Connecté à pulsacity.com avec le compte de l'espace « Recette Nutrition ».

```
Tu vérifies l'envoi des demandes d'avis de PULSACITY en production. Tu ne crées aucun compte. Pour chaque point, note ce que tu vois.

1. Ouvre https://github.com/jawadboughalem/PULSACITY/actions/workflows/cron-requests.yml. Donne-moi les cinq dernières exécutions : date et heure, déclencheur (« Scheduled » ou « Manually run »), couleur. Ouvre la plus récente : la dernière ligne de l'étape « Call the requests cron on production » est un résumé en JSON ({"ok":true,…}) ; recopie-le.
2. Sur https://pulsacity.com/app/demandes : la ligne « Camille T. · Produit physique test PULSACITY ». Recopie son badge et sa phrase.
3. Si elle dit « Envoyée » : dis-moi « Vérifiez que l'e-mail est arrivé à l'adresse de test, puis dites-moi OK », et attends mon OK. Puis, dans « Offres », remets le délai de « Produit physique test PULSACITY » à 14 jours et clique ailleurs : « Délai enregistré. ».
4. Dans Systeme.io, sur le « Tunnel test PULSACITY » : désactive le paiement à la livraison. Si le réglage t'est bloqué, dis-moi de le faire moi-même et attends mon OK. Ne supprime ni le tunnel, ni le produit, ni le webhook « PULSACITY ».

Ne touche à rien d'autre, ni dans PULSACITY, ni dans Systeme.io, ni dans GitHub.

Compte rendu à me donner : les points 1 à 4, avec les heures exactes du point 1.
```
