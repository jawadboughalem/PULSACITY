# Systeme.io : capture réelle des webhooks (connecteur PULSACITY)

Capturé le 27/09/2026 sur un compte Systeme.io en **plan gratuit**, avec webhook.site comme récepteur. Aucune donnée client réelle, aucun argent encaissé : la vente est une commande de 1 € en « paiement à la livraison », remboursée ensuite.

> **Données masquées.** Les valeurs personnelles réelles ont été remplacées par des valeurs fictives de même forme :
> - identifiant du compte / sous-domaine `jawadboughalem91` → `utilisateurdemo` ;
> - domaine e-mail réel → `example.com` ;
> - IP client réelle (`clientIp`) → `203.0.113.10` (plage de documentation).
>
> Conséquence : les corps masqués **ne revalident pas** la signature. Les empreintes SHA-256 et la signature données plus bas correspondent aux corps d'origine, vérifiés octet par octet.

---

## 1. Événements proposés par Systeme.io (texte exact)

### 1a. Paramètres → Webhooks (formulaire « Créer webhook »)

Champs : `Nom`, `URL *`, `Secret *`, interrupteur `Actif(ve)`.

Texte d'aide affiché :
- « Créez un webhook : Définissez l'URL du webhook et la clé secrète puis sélectionnez les événements qui doivent déclencher ce webhook »
- « Recevez des messages webhook : systeme.io enverra des requêtes POST à votre URL chaque fois que les événements sélectionnés se produisent, tenant votre compte à jour »

« Quels événements doivent déclencher ce webhook ? »
- **Contact créé** : Se produit quand un nouveau contact est créé
- **Tag ajouté à un contact** : Se produit quand un tag est ajouté à un contact
- **Tag retiré d'un contact** : Se produit quand un tag est retiré d'un contact
- **Opt-In** : Se produit quand un contact s'inscrit via un formulaire d'opt-in
- **Nouvelle vente** : Se produit quand un client fait un achat
- **Vente annulée** : Se produit lorsqu'un paiement unique est remboursé ou qu'un abonnement est annulé (immédiatement ou à la fin de la période payée)

➡️ **Aucun événement « inscription à une formation » dans cet écran.** Le remboursement et l'annulation sont regroupés sous un seul événement, « Vente annulée ».

### 1b. Automatisations → Règle d'automatisation (déclencheurs disponibles, action « Appeler un webhook »)

- Tag ajouté : Se produit lorsque le tag a été ajouté au contact
- Tag supprimé : Se produit lorsque le tag a été supprimé du contact
- Inscription sur la page (optin) : Se produit quand un contact vient de s'inscrire à un formulaire
- Formulaire d'inscription au site web : Se produit lorsqu'un contact vient de se souscrire via un formulaire
- Formulaire souscrit sur une page de blog : Se produit lorsque quelqu'un s'inscrit sur le formulaire de cette page
- Inscrit au formulaire d'une page créateur : Se produit lorsqu'un contact vient de s'inscrire via la section « Capturer des emails » d'une page créateur
- Campagne terminée : Se produit quand un contact vient de terminer une campagne
- Enregistré pour le webinaire : Se produit lorsque le contact vient d'être enregistré sur un webinaire
- **Inscrit à la formation** : Se produit quand le contact vient de s'inscrire à une formation
- Formation terminée : Se produit quand un étudiant vient de terminer une formation
- Module terminé : Se produit quand un étudiant vient de terminer un module
- Chapitre terminé : Se produit quand un étudiant vient de terminer un chapitre
- Inscrit au pack de formations : Se produit quand le contact vient de s'inscrire à un pack de formations
- Inscrit dans la communauté : Se produit lorsqu'un contact vient de s'inscrire dans une communauté
- Nouvelle vente : Se produit quand un client achète une offre
- Vente annulée : Se produit lorsqu'un paiement unique est remboursé ou qu'un abonnement est annulé (immédiatement ou à la fin de la période payée)
- Email ouvert : Se produit lorsqu'un contact ouvre un email
- Lien Email cliqué : Se déclenche lorsqu'un contact a cliqué sur un lien dans vos emails
- Page visitée : Se produit quand une personne visite une page spécifique
- Échec du paiement de l'abonnement : Se produit lorsqu'un paiement d'abonnement échoue
- Réunion programmée : Se produit lorsqu'un contact planifie une réunion

Action « **Appeler un webhook** » : « Une requête HTTP sera envoyée à une URL lorsqu'un événement se produit dans systeme.io ». Un seul champ, `Lien du webhook *`, **sans champ secret**.

➡️ Le plan gratuit permet **une seule** règle d'automatisation. Toute règle supplémentaire est refusée par l'API avec `{"errors":{"common":["Vous avez dépassé les limites de votre plan."]}}`.

---

## 2. Configuration de test utilisée

| Élément | Valeur |
|---|---|
| Webhook (Paramètres) | « PULSACITY capture test », URL webhook.site, secret `pulsacity-capture-test`, événements **Nouvelle vente** et **Vente annulée** |
| Règle d'automatisation | Déclencheur « Inscrit à la formation » (Formation test PULSACITY, id 680647) → « Appeler un webhook » (même URL) |
| Workflow (pour provoquer l'inscription) | Tag `pulsacity-capture-test` ajouté → « Donner accès à une formation » (accès total) |
| Contact de test | Test Capture, alias `+capture` |
| Vente | Tunnel « Tunnel test PULSACITY », produit physique à 1 €, passerelle « Paiement à la livraison » |

---

## 3. Requête n° 1 : inscription à une formation

- **Déclencheur Systeme.io** : règle d'automatisation « Inscrit à la formation » → « Appeler un webhook » (inscription provoquée par le workflow à l'ajout du tag)
- **Heure de réception** : 27/09/2026 21:57:42 (Europe/Berlin), soit 19:57:42 UTC
- **IP émettrice** : 185.236.142.1 · HTTP/1.1
- **Méthode** : `POST`
- **URL** : `https://webhook.site/09c4278e-6c70-496b-87e1-eb9b8100559a`

### En-têtes (complets)

```http
content-length: 433
content-type: application/json
accept-charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
accept-language: en-us,en;q=0.5
accept: application/json
user-agent: Symfony
host: webhook.site
```

**Aucun en-tête de signature.** Les webhooks de règle d'automatisation ne sont pas signés.

### Corps brut

JSON compact sur une seule ligne, 433 octets. SHA-256 du corps d'origine, vérifié : `df5111999a283e6b0449f3a3be91bb7f44174e13af8115b2cbf729473029e14a`.

```json
{"type":"contact.course.enrolled","data":{"course":{"id":680647,"name":"Formation test PULSACITY","description":null},"contact":{"referred_by_contact_id":null,"referred_by_contact_email":null,"id":445573087,"email":"utilisateurdemo+capture@example.com","fields":{"first_name":"Test","surname":"Capture"},"ip":null},"access_type":"full_access"},"account":{"email":"utilisateurdemo@example.com"},"created_at":"2026-09-27T19:57:41+00:00"}
```

---

## 4. Requête n° 2 : nouvelle vente

- **Déclencheur Systeme.io** : webhook des Paramètres, événement « Nouvelle vente » (en-tête `x-webhook-event: SALE_NEW`)
- **Heure de réception** : 27/09/2026 22:16:28 (Europe/Berlin), soit 20:16:28 UTC. Commande créée à 20:16:26 UTC.
- **IP émettrice** : 185.236.142.1 · HTTP/2.0
- **Méthode** : `POST`
- **URL** : `https://webhook.site/09c4278e-6c70-496b-87e1-eb9b8100559a`

### En-têtes (complets, dans l'ordre reçu)

```http
content-length: 1094
accept-encoding: gzip
sentry-trace: c08bb400ced14dc6aadf53c14395164d-ac420cf9b9a846f6
baggage: sentry-trace_id=c08bb400ced14dc6aadf53c14395164d,sentry-sample_rand=0.787026,sentry-public_key=228cda379ba0793937760b7c9969540b,sentry-org_id=380824,sentry-release=a74d6282946cf428aca5984736ae06e2d56151a1,sentry-environment=prod
x-webhook-schema-version: 2
x-webhook-signature: a782e59165d372689c48b905849337f614a217d9f929c3326701f2e258a7ee81
x-webhook-delivery-attempt-timestamp: 2026-09-27T20:16:28+00:00
x-webhook-delivery-attempt-id: 01a0e483-0a93-791e-8aa0-133b57df3f20
x-webhook-event-timestamp: 2026-09-27T20:16:27+00:00
x-webhook-event: SALE_NEW
x-webhook-subscription-id: 01a0e461-30e6-7b5b-b3cb-4b3aceac6b6c
x-webhook-message-id: 01a0e483-09fb-7d11-ac67-be0fb3c6a98b
user-agent: SystemeIO-Webhook
accept: application/json
content-type: application/json
host: webhook.site
```

### Corps brut

JSON compact sur une seule ligne, 1094 octets à l'origine. Les `/` sont échappés en `\/` et `vat` vaut `0.0`. SHA-256 du corps d'origine, vérifié : `45b897d936d0292934e1693b65acb08c18bf96d069ba68afd06f6e630e0d42ce`.

```json
{"customer":{"id":12799002,"clientIp":"203.0.113.10","contactId":445573087,"email":"utilisateurdemo+capture@example.com","fields":{"first_name":"Test","country":"FR","postcode":"75001"},"paymentProcessor":"cash on delivery","sourceUrl":"https:\/\/utilisateurdemo.systeme.io\/466f06b8"},"coupon":null,"funnelStep":{"id":25610405,"name":"Bon de commande","type":"offer-form","funnel":{"id":7648170,"name":"Tunnel test PULSACITY"}},"checkoutPage":null,"order":{"id":12768313,"createdAt":"2026-09-27T20:16:26+00:00","discountAmount":null,"discountType":null,"shippingFee":null,"totalPrice":100,"vat":0.0},"orderItem":{"createdAt":"2026-09-27T20:16:26+00:00","id":15460129,"resources":[{"course":null,"courseBundle":null,"enrollmentAccessType":null,"enrollmentDrippingAccessCourse":null,"physicalProduct":{"id":170454,"name":"Produit physique test PULSACITY","options":[]},"tag":null}]},"pricePlan":{"id":3456303,"name":"Produit physique test PULSACITY","type":"one_shot","amount":100,"currency":"eur","innerName":"Produit physique test PULSACITY","recurringOptions":null,"statementDescriptor":""}}
```

Points à retenir pour le parseur :
- les montants sont en **centimes** (`totalPrice: 100` pour 1,00 €) ;
- `orderItem.resources[]` porte `course`, `courseBundle`, `enrollmentAccessType`, `physicalProduct` et `tag`. Une vente de formation devrait remplir `course` et `enrollmentAccessType` (non observé ici : produit physique).

---

## 5. Remboursement / annulation (« Vente annulée »)

La commande de test a été remboursée depuis la fiche contact (Paiements → ⋯ → Rembourser → Confirmer) à environ 22:18 (Europe/Berlin). **Aucune requête n'est arrivée sur webhook.site dans les ~2 minutes suivantes**, alors que « Vente annulée » était bien cochée.

Explication la plus probable, non confirmée par la documentation : un remboursement de paiement à la livraison n'émet pas `SALE_CANCELED`. Pour capturer ce cas, il faudra une vente via Stripe en mode test.

---

## 6. Clé secrète et signature

- **Clé secrète utilisée** : `pulsacity-capture-test`
- **Ce que dit Systeme.io** : seulement « Définissez l'URL du webhook et la clé secrète… ». L'écran ne décrit ni l'algorithme ni l'en-tête.
- **Vérifié empiriquement sur la requête n° 2** :

```
x-webhook-signature = hex( HMAC-SHA256( key = secret, message = corps brut exact ) )
```

`HMAC-SHA256("pulsacity-capture-test", corps d'origine)` = `a782e59165d372689c48b905849337f614a217d9f929c3326701f2e258a7ee81`, identique à l'en-tête.

Implications pour le connecteur :
- calculer le HMAC sur les **octets bruts** reçus, avant tout parsing JSON : les `\/` et `0.0` ne survivent pas à un parse puis re-sérialisation ;
- comparer en temps constant ;
- `x-webhook-event` donne le type ; `x-webhook-message-id` sert à la déduplication ; `x-webhook-event-timestamp` peut servir de fenêtre anti-rejeu. Le timestamp **ne fait pas partie** du message signé : le HMAC du corps seul correspond.
- Les webhooks de **règles d'automatisation** (dont l'inscription à une formation) **ne sont pas signés** et ont un autre schéma (`type` / `data` / `account` / `created_at`). Pour les authentifier, il faut un jeton secret dans l'URL.
