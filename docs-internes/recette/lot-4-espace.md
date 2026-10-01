# Lot 4 — l'espace du créateur : actions du fondateur et recette

À lancer après la fusion de la PR sur `main`, dans l'ordre. Chaque bloc est un prompt à coller tel quel dans Claude in Chrome.

Fichier utilisé par la recette : `docs-internes/recette/temoignages-50-lignes.csv`. Il contient 50 témoignages, dont 3 lignes invalides : 12, 27 et 41. Téléchargez-le depuis GitHub : ouvrez le fichier, puis cliquez sur « Download raw file ».

---

## 1. GitHub — appliquer les migrations 0003 et 0004

```
Tu m'aides à appliquer deux migrations de base de données sur le projet PULSACITY, depuis GitHub.

Où : https://github.com/jawadboughalem/PULSACITY/actions

Étapes :
1. Dans la colonne de gauche, ouvre le workflow « Database migration ».
2. Clique sur « Run workflow ». Laisse la branche sur « main ». Valide avec le bouton vert « Run workflow ».
3. Attends la fin de l'exécution (une à deux minutes), puis ouvre-la.

Ne touche surtout pas :
- aux secrets du dépôt (Settings › Secrets) ;
- aux autres workflows, comme « CI » ;
- à aucune branche autre que « main ».

Vérification : l'exécution est verte. Dans le journal de l'étape de migration, tu lis « migrations applied successfully ». Les migrations appliquées sont « 0003_displayed_text_and_widget_load » et « 0004_space_milestones ».

Compte rendu à me donner : la date et l'heure de l'exécution, son statut (vert ou rouge), et la dernière ligne du journal de migration. Ne recopie aucune adresse de connexion à la base, ni aucun mot de passe.
```

## 2. Cloudflare — vérifier que le jeton R2 peut supprimer une photo

La suppression définitive d'un témoignage efface aussi sa photo du bucket. Le jeton actuel doit donc pouvoir supprimer des objets. Ce prompt ne fait que vérifier : il ne modifie rien.

```
Tu m'aides à vérifier un réglage sur Cloudflare, sans rien modifier.

Où : https://dash.cloudflare.com, puis R2 Object Storage › « Manage R2 API Tokens » (ou « Gérer les jetons d'API R2 »).

Étapes :
1. Dans la liste des jetons, repère le jeton « pulsacity-production ».
2. Ouvre son détail (ou survole-le) pour lire ses permissions et le bucket auquel il donne accès.

Ne touche surtout pas :
- ne crée, ne renouvelle et ne supprime aucun jeton ;
- ne modifie pas le bucket « pulsacity-photos », ni son CORS, ni son accès public.

Vérification : le jeton « pulsacity-production » a la permission « Object Read & Write » (lecture et écriture des objets) sur le bucket « pulsacity-photos » seulement.

Compte rendu à me donner : la permission exacte affichée et le ou les buckets concernés. Ne recopie jamais l'identifiant de clé ni le secret du jeton.
```

## 3. Recette sur ordinateur

Avant ce prompt : connectez-vous vous-même à https://pulsacity.com avec votre compte de test (un agent ne crée pas de compte). Ouvrez la fenêtre en grand (1440 px de large ou plus).

```
Tu fais la recette de l'espace créateur de PULSACITY sur https://pulsacity.com. Je suis déjà connecté avec mon compte de test. Tu ne crées aucun compte et tu ne changes aucun réglage hors de cet espace. Pour chaque point, note « OK » ou décris précisément ce que tu vois.

A. Identité
1. L'onglet du navigateur montre le favicon : une fusée blanche portée par une étoile rose, sur fond bleu nuit.
2. Dans la colonne de gauche, le logo est une fusée suivie du mot « Pulsacity ».

B. Accueil (https://pulsacity.com/app)
3. Si l'espace n'a encore aucun témoignage : le titre « Pas encore de témoignage » a la fusée au-dessus, et la page propose « Copier le lien » et « Connecter Systeme.io ».
4. S'il a des témoignages : quatre chiffres (témoignages validés, note moyenne, en attente, taux de réponse ce mois), « Derniers témoignages reçus » avec « Valider », « Masquer » et « Ouvrir », et le bloc « Étapes restantes ».

C. Ajout manuel
5. Va sur « Témoignages », clique sur « Ajouter un témoignage ».
6. Clique sur « Ajouter le témoignage » sans rien remplir : un message rouge s'affiche sous le nom, la note, le texte et la case d'accord.
7. Remplis : Nom affiché « Recette Manuelle », note 4 étoiles, texte « Reçu par WhatsApp : merci pour tout. », coche « J'ai l'accord de cette personne pour publier son témoignage. ». Clique sur « Ajouter le témoignage ».
8. La fiche du témoignage s'ouvre, avec le badge « Validé ». Si c'est le premier témoignage validé de l'espace, un bandeau vert dit « Votre premier témoignage est en ligne. ». Recharge la page : le bandeau ne revient pas.

D. Import CSV
9. Va sur « Témoignages › Ajouter un témoignage », puis clique sur « Importez un fichier CSV ».
10. Arrête-toi et demande-moi de choisir le fichier « temoignages-50-lignes.csv ». Attends que je te dise que c'est fait.
11. L'aperçu annonce « 47 témoignages prêts, 3 lignes à revoir ». Le bloc rouge liste la ligne 12 (note « 6 » non reconnue), la ligne 27 (nom vide) et la ligne 41 (texte vide et date « 35/08/2026 » non reconnue). Si l'espace est en plan Gratuit, un bloc gris dit combien de témoignages resteront en attente.
12. Clique sur « Importer 47 témoignages » sans cocher la case : un message demande de la cocher. Coche-la, puis clique à nouveau.
13. Le rapport dit « 47 témoignages importés. » et liste les 3 lignes non importées, avec leurs raisons.

E. Liste
14. Clique sur « Voir mes témoignages ». En haut : le nombre de validés, en attente et masqués.
15. Tape « Manuelle » dans « Rechercher », puis Entrée : seul « Recette Manuelle » reste. Efface la recherche.
16. Choisis « En attente » dans « Statut » : la liste ne garde que les témoignages en attente.
17. Sur une ligne en attente, clique sur « Valider » : le badge passe à « Validé » tout de suite, sans recharger la page. Si le bouton est grisé, lis le texte sous la ligne : il doit dire « Pour l'afficher : passez au plan Essentiel, ou masquez un témoignage déjà publié. ».
18. Sur une ligne validée, clique sur le marque-page de la colonne « En avant » : il se remplit tout de suite.
19. Clique sur « Masquer » : une fenêtre demande « Masquer l'avis de … ? ». Clique sur « Masquer l'avis » : le badge passe à « Masqué » tout de suite.
20. Recharge la page : les trois changements sont toujours là.

F. Fiche d'un témoignage
21. Ouvre « Recette Manuelle » (bouton « ··· » puis « Ouvrir », ou clic sur le nom).
22. Dans « Texte affiché », remplace le texte par « Merci pour tout. », puis clique sur « Enregistrer les modifications » : la page dit « Modifications enregistrées. ».
23. Recharge la page : « Texte affiché » montre « Merci pour tout. ». Le bloc « Texte original de Recette » est ouvert, avec l'original « Reçu par WhatsApp : merci pour tout. », marqué « conservé tel quel, non modifiable ».
24. Clique sur « Télécharger la preuve de consentement » : un fichier texte se télécharge, avec le texte coché et sa date.
25. En bas de la fiche, clique sur « Supprimer définitivement », puis sur « Supprimer l'avis » : tu reviens à la liste, et « Recette Manuelle » n'y est plus.

G. Offres
26. Va sur « Offres ». Ajoute l'offre « Recette Offre ». Note son lien de collecte.
27. Clique sur « Renommer », écris « Recette Offre 2 », clique sur « Enregistrer » : le nom change, le lien de collecte reste le même.
28. Mets le délai à 7, puis appuie sur Entrée : « Délai enregistré. » s'affiche. Décoche « Demander un avis après chaque vente » : « Demandes automatiques désactivées. » s'affiche. Recharge : les deux réglages sont gardés.
29. Clique sur « Retirer », puis sur « Retirer l'offre » : elle disparaît.

H. Compte
30. En bas de la colonne de gauche, clique sur ton nom : un menu s'ouvre avec « Mon compte », « Abonnement et factures », « Aide et contact » et « Se déconnecter ». Ne clique pas sur « Se déconnecter ».

Compte rendu à me donner : la liste des points 1 à 30 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK. Ne recopie aucune adresse e-mail de client.
```

## 4. Recette sur téléphone (360 px)

Avant ce prompt : dans Chrome, ouvrez les outils de développement (F12), activez la barre d'appareils (Ctrl+Maj+M), puis réglez la largeur sur 360 et la hauteur sur 800.

```
Tu fais la recette de l'espace créateur de PULSACITY en largeur téléphone, sur https://pulsacity.com/app. Je suis déjà connecté, et la page est affichée en 360 × 800. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

1. En haut de l'accueil : le logo (fusée et « Pulsacity ») à gauche, un cercle avec des initiales à droite.
2. En bas : quatre onglets, « Accueil », « Témoignages », « Demandes » et « Plus ». Rien ne déborde sur le côté.
3. Sur l'accueil, les quatre chiffres tiennent sur deux lignes de deux, puis « Demander un avis » prend toute la largeur.
4. Onglet « Témoignages » : en haut, le titre « Témoignages » et un bouton « + ». En dessous, la recherche, puis trois boutons « Statut », « Offre » et « Note » sur une ligne.
5. Touche « Statut » et choisis « En attente » : le bouton affiche « En attente », et la liste se filtre.
6. Chaque carte montre le nom, l'offre et la date, les étoiles, le badge de statut et le texte. Les cartes en attente ont « Valider » et « Masquer ».
7. Touche le nom d'un témoignage : la fiche s'ouvre avec « Témoignages » et une flèche en haut. « Valider » et « Masquer » prennent toute la largeur.
8. Reviens, puis touche l'onglet « Plus » : « Votre espace » (Offres, Widgets, Connecteurs, Réglages), « Votre compte », et le bouton « Se déconnecter ». N'appuie pas dessus.
9. Touche « Offres » : la page s'ouvre, et l'onglet « Plus » reste allumé.

Compte rendu à me donner : les points 1 à 9 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```
