# Connecteur Systeme.io — payloads réels

Statut : **en attente des captures de la semaine 1.** Aucun payload n'a encore été versé ici. Tant que
cette page est vide, le connecteur n'est pas codé (CLAUDE.md, règle absolue 1) et le registre
`src/lib/connectors/registry.ts` ne le contient pas.

## Ce qu'il faut verser

Pour chaque événement que Systeme.io envoie à l'URL de webhook (vente, inscription à une formation, et
tout autre événement reçu pendant la capture) :

1. La date de capture et l'action qui l'a déclenché dans Systeme.io.
2. **Tous les en-têtes HTTP**, tels que reçus.
3. **Le corps brut**, tel que reçu, sans reformater ni retirer de champ.

Les données personnelles des clients (e-mail, prénom, nom, téléphone, adresse, IP) sont remplacées par
des valeurs fictives de même forme avant d'être versées : ce fichier et les fixtures sont commités.
Tout le reste est gardé à l'identique : clés, types, formats de date, identifiants.

Si un en-tête porte une signature, notez ce que Systeme.io en dit (algorithme, secret utilisé). Les
tests de `verify()` re-signeront les fixtures avec un secret de test.

## Fixtures

Chaque capture devient un fichier `src/lib/connectors/systeme/__fixtures__/<evenement>.json` :

```json
{
  "capturedAt": "date ISO 8601 de la capture",
  "headers": {},
  "body": {}
}
```

Les tests de `normalize()` partent de ces fichiers, et uniquement d'eux.

## Captures

_À compléter avec les payloads de la semaine 1._
