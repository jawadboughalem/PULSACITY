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

## 3. Captures (12 octobre 2026, à compléter)

Phase de capture : le connecteur est enregistré, il garde chaque envoi brut dans `webhook_events` et n'en lit aucun (`normalize` renvoie `null`, résultat « Gardé de côté, sans demande d'avis »).

Pour chaque outil, deux envois de test vers l'aperçu de la PR du lot 4.1 b, l'un en JSON, l'autre en formulaire, avec des données fictives (`example.com`) :

| Outil | Envoi | `content-type` reçu | `user-agent` reçu | Corps reçu |
| --- | --- | --- | --- | --- |
| Make | JSON | à capturer | | |
| Make | formulaire | à capturer | | |
| n8n | JSON | à capturer | | |
| n8n | formulaire | à capturer | | |
| Zapier | JSON | à capturer | | |
| Zapier | formulaire | à capturer | | |

Relevé par une requête dans l'éditeur SQL du projet Supabase de recette (prompt de `docs-internes/recette/lot-4-1-b-universel.md`), sans autre en-tête que `content-type` et `user-agent`.

## 4. Ce que la normalisation en retient

À écrire après les captures : nombres en texte ou non, virgule décimale, formats de date de chaque outil, champs vides envoyés comme `""` ou absents, encodage des accents en formulaire.
