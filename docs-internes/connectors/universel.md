# Connecteur universel : format et captures réelles

Le format est le nôtre (`docs-internes/decisions/connecteurs.md`, « Connecteur universel ») ; les captures disent comment Make, n8n et Zapier l'envoient vraiment. Selon la règle n° 1 de CLAUDE.md, la normalisation ne s'écrit qu'après ces captures, transformées en fixtures dans `src/lib/connectors/universal/__fixtures__/`.

## 1. Le format

Une vente par envoi, en `POST` vers l'adresse de connexion de l'espace (`/api/connectors/universal/<jeton>`), en JSON (`application/json`) ou en formulaire (`application/x-www-form-urlencoded`).

| Champ | Obligatoire | Contenu |
| --- | --- | --- |
| `email` | oui | L'adresse du client : la demande d'avis part là. |
| `prenom` | non | Son prénom, pour « Bonjour Camille, ». |
| `nom` | non | Son nom. |
| `offre` | non | Le nom de ce qui a été acheté : il arrive dans « Offres à associer ». |
| `date` | non | Le jour de la vente. Sans date : le jour de réception. |
| `montant` | non | Le prix payé. |
| `devise` | non | EUR si rien n'est indiqué. |
| `reference` | non | L'identifiant de la vente dans l'outil : une vente reçue deux fois ne compte qu'une fois. |

La liste affichée dans l'espace et sur la page publique vient de `src/lib/connectors/universal/fields.ts`.

## 2. Authentification

Aucune signature : le jeton secret de l'adresse authentifie l'envoi, comme les inscriptions de Systeme.io. « Changer d'adresse » en crée une nouvelle si elle a fuité.

Sur un aperçu, protégé par Vercel Authentication, les outils ajoutent à l'adresse le paramètre `x-vercel-protection-bypass=<secret>` (« Protection Bypass for Automation » de Vercel). Le récepteur ne garde aucun en-tête `x-vercel-*`, et l'adresse appelée n'est pas enregistrée : le secret n'entre jamais dans la base.

## 3. Captures (12 octobre 2026)

Deux envois de test par outil vers l'aperçu de la PR du lot 4.1 b, l'un en JSON, l'autre en formulaire, avec des données fictives (`example.com`), quand le connecteur gardait chaque envoi brut sans le lire. Relevés par une requête en lecture dans l'éditeur SQL du projet Supabase de recette (prompt 6 de `docs-internes/recette/lot-4-1-b-universel.md`), sans autre en-tête que `content-type` et `user-agent`. Les six sont des fixtures, mot pour mot : `src/lib/connectors/universal/__fixtures__/`, avec leur moment de réception (`received-at.json`).

| Outil | Envoi | `content-type` reçu | `user-agent` reçu | Corps reçu |
| --- | --- | --- | --- | --- |
| Make (module HTTP, plan gratuit) | JSON | `application/json` | `Make/production` | `{"email":"camille.make@example.com","prenom":"Camille","nom":"Martin","offre":"Programme 30 jours","date":"2026-10-12T15:12:13.173Z","montant":97,"devise":"EUR","reference":"make-json-1"}` |
| Make | formulaire | `application/x-www-form-urlencoded` | `Make/production` | `email=camille.make%40example.com&prenom=Camille&nom=Martin&offre=Programme+30+jours&date=2026-10-12T15%3A15%3A56.493Z&montant=97%2C50&devise=EUR&reference=make-form-1` |
| n8n 2.42.7 (nœud HTTP Request) | JSON | `application/json` | `n8n` | `{"email":"camille.n8n@example.com","prenom":"Camille","nom":"Martin","offre":"Programme 30 jours","date":"2026-10-12T19:35:21.044+02:00","montant":"97","devise":"EUR","reference":"n8n-json-1"}` |
| n8n | formulaire | `application/x-www-form-urlencoded` | `n8n` | `email=camille.n8n%40example.com&prenom=Camille&nom=Martin&offre=Programme%2030%20jours&date=2026-10-12T19%3A36%3A50.069%2B02%3A00&montant=97%2C50&devise=EUR&reference=n8n-form-1` |
| Zapier (Webhooks by Zapier, POST, essai Professional) | JSON | `application/json; charset=utf-8` | `Zapier` | `{"date":"Oct 12, 2026","devise":"EUR","email":"camille.zapier@example.com","montant":"97","nom":"Martin","offre":"Programme 30 jours","prenom":"Camille","reference":"zapier-json-1"}` |
| Zapier | formulaire | `application/x-www-form-urlencoded` | `Zapier` | `date=Oct+12%2C+2026&devise=EUR&email=camille.zapier%40example.com&montant=97%2C50&nom=Martin&offre=Programme+30+jours&prenom=Camille&reference=zapier-form-1` |

Ce que les outils montrent en route :
- **Make** : le module HTTP récent n'a plus d'option « Raw ». En JSON : type de corps `application/json`, puis « JSON string ». En formulaire : `application/x-www-form-urlencoded`, un champ par ligne. Après « Run once », le panneau de résultat affiche l'adresse appelée en entier, paramètres compris.
- **n8n** : « Send Body », puis `JSON` ou `Form Urlencoded`. La réponse s'affiche dans la sortie du nœud.
- **Zapier** : « Webhooks by Zapier », action POST, « Payload Type » `json` ou `form`. Réservé aux plans payants (l'essai Professional suffit). « Data out » montre le corps de la réponse, pas son code ; « Data in » et « Troubleshoot » montrent l'adresse.

## 4. Ce que la normalisation en retient

`src/lib/connectors/universal/normalize.ts`, testée sur les six captures (`connector.test.ts`) et de bout en bout (`route.test.ts`) :

- **Le corps** : un objet JSON, ou un formulaire (le moteur le garde en texte). Espaces en `+` (Make, Zapier) ou en `%20` (n8n), accents en UTF-8 : `URLSearchParams` lit les deux. Un `content-type` avec `; charset=utf-8` (Zapier) ne change rien. Un formulaire `multipart/form-data`, une liste de ventes ou un corps qui n'est pas un objet sont gardés de côté (« Contenu illisible »), rejouables.
- **Les noms des champs** : sans majuscules ni accents ni tirets, « Prénom » vaut `prenom`, « E-mail » vaut `email`. Les champs inconnus sont ignorés. Un champ vide (`""`) vaut un champ absent ; envoyé deux fois, la première valeur compte.
- **`email`** : obligatoire, en minuscules, accents acceptés. Absente ou invalide : la vente est gardée de côté.
- **`offre`** : le nom tel qu'écrit s'affiche ; l'offre est la même quelles que soient ses majuscules et ses espaces (`offre:programme 30 jours`). Sans offre : une offre à associer « Sans nom d'offre », commune à toutes ces ventes.
- **`montant`** : nombre (`97`, Make) ou texte (`"97"`, n8n et Zapier), virgule ou point (`97,50` arrive toujours avec une virgule en formulaire), séparateurs de milliers, symbole € accepté. Jamais trois décimales : `1,234` vaut 1 234. Illisible : la vente reste, sans prix (le prix ne sert qu'à l'affichage).
- **`devise`** : trois lettres, ou €, $, £. EUR sans devise.
- **`date`** : ISO en UTC (Make), ISO avec fuseau (n8n), « Oct 12, 2026 » sans heure (Zapier), aussi `2026-10-12`, `12/10/2026` (jour en premier) et l'horodatage Unix. Un jour sans heure vaut midi UTC, comme « Demander un avis ». Sans date, ou illisible : le moment de réception. Jamais après la réception : une date future (une inversion mois et jour, par exemple) vaut le moment de réception.
- **`reference`** : une vente reçue deux fois avec la même référence est enregistrée une fois (`reference:<valeur>`, résultat « Déjà reçue : rien de nouveau »). Sans référence : le même client et la même offre le même jour à Paris sont la même vente (`same-day:…`), pour qu'un outil qui renvoie après un délai dépassé ne crée rien.
- **Le moment de réception** entre dans le contrat : `normalize(payload, headers, { receivedAt })`. Lu dans `webhook_events.received_at`, il donne la même vente à chaque traitement, rejeu compris.
