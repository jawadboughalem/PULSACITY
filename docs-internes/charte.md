# Charte PULSACITY — v1
## Couleurs
| Nom | Hex | Usage |
| --- | --- | --- |
| Carmin (accent) | #A3243B | Étoiles pleines, liens, bouton discret, étoile du logo. Fond plein autorisé uniquement pour le bouton « Envoyer mon avis » de la page de collecte et le bouton des e-mails. |
| Carmin foncé | #861C30 | Survol et appui de tout élément Carmin. |
| Carmin clair | #F08A9A | Étoiles, liens et étoile du logo sur fond sombre (Encre ou thème sombre du widget) uniquement. |
| Encre 900 | #16213E | Texte principal, titres, bouton principal, focus, cases cochées, fond sombre (pied de page). |
| Encre 800 | #2B3656 | Survol du bouton principal. |
| Ardoise 600 | #5A5F6E | Texte secondaire (métier, dates, aides, mentions), texte des boutons désactivés, badge « Masqué ». |
| Gris 400 | #7E8390 | Bordures de champs et de cases à cocher, étoile vide. Jamais pour du texte. |
| Filet 200 | #D8D9DD | Séparateurs, bordures de cartes, bordure du bouton désactivé. Jamais pour du texte sur fond clair. |
| Papier 100 | #F3F3F0 | Fonds de section, fond de la page de collecte, avatar sans photo, bouton désactivé, colonne mise en avant. |
| Blanc | #FFFFFF | Fond de page, champs, cartes. |
| Succès | #1D6B43 | Texte et icône de succès (validé, connecté, envoyé). |
| Succès fond | #E7F3EC | Fond des badges et messages de succès. |
| Attention | #8A5300 | Texte et icône d'attente (en attente, à associer). |
| Attention fond | #FFF4DB | Fond des badges et messages d'attente. |
| Erreur | #B42318 | Texte, icône et bordure 2 px d'erreur. Toujours avec l'icône « alerte ». |
| Erreur fond | #FDECEA | Fond des messages d'erreur. |
| Widget sombre — carte | #22262D | Fond des cartes du widget en thème sombre. |
| Widget sombre — trait | #2F343D | Bordure des cartes, fond des avatars et des squelettes de chargement en thème sombre. |
| Widget sombre — texte | #EDEEF0 | Texte principal du widget en thème sombre. |
| Widget sombre — secondaire | #A4A8B1 | Texte secondaire du widget en thème sombre. |

Contrastes vérifiés (WCAG 2.1) : Encre/Blanc 15,9:1 · Encre/Papier 14,3:1 · Ardoise/Blanc 6,4:1 · Ardoise/Papier 5,7:1 · Carmin/Blanc 7,3:1 · Carmin/Papier 6,6:1 · Blanc/Encre 900 15,9:1 · Blanc/Encre 800 11,9:1 · Blanc/Carmin 7,3:1 · Blanc/Carmin foncé 9,5:1 · Carmin clair/Encre 6,7:1 · Succès/fond 5,7:1 · Attention/fond 5,8:1 · Erreur/fond 5,8:1 · Erreur/Blanc 6,6:1 · Filet/Encre 11,3:1 · Gris 400/Blanc 3,8:1 et Gris 400/Papier 3,4:1 (bordures uniquement) · Widget sombre texte/carte 13,1:1 · secondaire/carte 6,4:1 · Gris 400/carte sombre 4,0:1 (étoile vide).
Combinaisons interdites : Carmin sur Encre (2,2:1) · Gris 400 ou Filet 200 en couleur de texte.

## Typographie
| Rôle | Famille | Source (Google Fonts ou autre) | Graisses |
| --- | --- | --- | --- |
| Titres, citations, logo | Newsreader (repli : Georgia, "Times New Roman", serif) | Google Fonts — https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap | 400 citations · 500 titres · 600 logo et initiales d'avatar |
| Interface et texte | Public Sans (repli : system-ui, -apple-system, "Segoe UI", sans-serif) | Google Fonts — https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600&display=swap | 400 texte · 500 libellés, liens · 600 boutons, prénoms, libellés de champ |
| E-mails uniquement | Georgia (corps) et Arial (interface) | Polices système, aucun chargement | 400 · 600 |
| Widget | Police de la page hôte (font-family: inherit) | Page hôte | Celles de la page hôte |

Règles : interlettrage 0 partout, sauf le grand titre (−0,01 em). Aucun italique, aucune capitale espacée, aucun mot de titre mis en couleur. Longueur de ligne : texte 68ch maximum, citations 60ch maximum. Champs de saisie : jamais moins de 16 px.

## Échelle de tailles
| Nom | Taille px | Interligne | Usage |
| --- | --- | --- | --- |
| display | 48 | 52 | Grand titre desktop (Newsreader 500, −0,01 em), chiffres clés du tableau de bord, prix. Mobile : 36/42. |
| h1 | 36 | 42 | Titre de page desktop, grand titre mobile. Mobile : 28/34. |
| h2 | 28 | 34 | Titre de section, titre de page mobile, titre de la page de collecte. |
| quote | 20 | 28 | Citations de témoignages, titres de carte et d'étape (Newsreader 400 ou 500). |
| body | 16 | 24 | Texte courant, boutons (600), champs. |
| small | 14 | 20 | Libellés de champ (600), noms et métiers, badges de statut (500), aides. |
| legal | 12 | 16 | Mentions, « Propulsé par », onglets mobiles. Taille minimale absolue. |

Exceptions : le logo (logotype) suit ses propres tailles (96, 72, 28, 22, 15 px), toujours Newsreader 600, interligne 1.

## Espacements
| Nom | Valeur px |
| --- | --- |
| space-1 | 4 |
| space-2 | 8 |
| space-3 | 12 |
| space-4 | 16 |
| space-5 | 24 |
| space-6 | 32 |
| space-7 | 48 |
| space-8 | 64 |
| space-9 | 96 |
| page-gutter-mobile | 24 |
| page-gutter-desktop | 80 |

Aucune autre valeur de marge, de padding ou d'écart. Seules exceptions : les chevauchements négatifs (avatars superposés : −8 à −10 px) et les alignements optiques d'icônes.

## Rayons
| Nom | Valeur px | Usage |
| --- | --- | --- |
| radius-s | 2 | Défaut : boutons, champs, cartes, sélecteurs, favicon, cartes du widget (réglage « net »). |
| radius-l | 16 | Page de collecte (champs, bloc étoiles, bouton), bouton des e-mails, messages d'état de la collecte, cartes du widget (réglage « doux »). |
| radius-full | 999 | Avatars, badges de statut, badge compact du widget, points du carrousel, boutons icônes cerclés. |

## Ombres
| Nom | Valeur CSS | Usage |
| --- | --- | --- |
| shadow-relief | 0 4px 0 #16213E | Uniquement le bouton principal de la page de collecte (et « Recevoir un nouveau lien »). À l'appui : ombre 0 et translation de 4 px vers le bas. |
| shadow-float | 0 8px 24px rgba(22, 33, 62, 0.12) | Menus, fenêtres, messages flottants. Jamais sur une carte posée dans la page. |

## Bordures
| Nom | Valeur | Usage |
| --- | --- | --- |
| border-thin | 1px solid #D8D9DD | Filets, séparateurs, cartes. |
| border-thin-strong | 1px solid #16213E | Filet de tête de section et de tableau, bouton secondaire, sélecteur segmenté. |
| border-field | 1px solid #7E8390 | Champs de l'espace créateur au repos. |
| border-thick | 2px solid #16213E | Champs de la page de collecte, focus d'un champ, bloc étoiles, bouton de collecte, plan mis en avant. |
| border-error | 2px solid #B42318 | Champ ou case en erreur. |
| focus-ring | outline: 2px solid #16213E; outline-offset: 2px | Tout élément interactif au clavier. |

## Composants
**Bouton principal** — hauteur 48, padding 0 24, radius-s, fond Encre 900, texte Blanc Public Sans 600 16/24. Survol : fond Encre 800. Désactivé : fond Papier, bordure 1px Filet, texte Ardoise. Focus : focus-ring. Un seul par écran.
**Bouton principal · page de collecte** — pleine largeur, hauteur 56, radius-l, fond Carmin, bordure 2px Encre, texte Blanc 600 16/24, shadow-relief. Survol : fond Carmin foncé. Appui : ombre 0, translation 4 px.
**Bouton des e-mails** — hauteur 52 desktop / 56 mobile, padding 0 28, radius-l (carré sous Outlook), fond Carmin, bordure 2px Encre, texte Blanc Arial 600 16. Sans ombre. Toujours suivi d'un lien de secours en texte.
**Bouton secondaire** — hauteur 48, padding 0 24, radius-s, fond Blanc, bordure 1px Encre, texte Encre 600 16/24. Survol : fond Papier.
**Bouton discret** — hauteur 48 (zone cliquable ≥ 44), padding 0 4, sans fond, texte Carmin 600 16/24. Survol : Carmin foncé, souligné (décalage 3 px).
**Bouton icône** — 44 × 44 (48 × 48 pour les flèches du carrousel, cerclé 1px Encre, radius-full), icône 20 ou 24 au trait, aria-label obligatoire.
**Sélecteur segmenté** (Mensuel/Annuel, thème, plan) — hauteur 48, bordure 1px Encre, radius-s. Option active : fond Encre, texte Blanc 600. Inactive : fond Blanc, texte Encre 600. aria-pressed.
**Champ de texte** — hauteur 48 (zone de texte : 136 à 176), padding 0 16 (16 pour la zone de texte), radius-s, fond Blanc, texte Encre Public Sans 16/24, libellé au-dessus en 14/20 600 à 8 px. Normal : border-field. Focus : 2px Encre (padding 0 15). Erreur : 2px Erreur + message 14/20 Erreur avec icône alerte 20, relié par aria-describedby. Variante page de collecte : bordure 2px Encre au repos, radius-l ; focus = focus-ring en plus.
**Case à cocher** — 24 × 24, radius-s. Vide : fond Blanc, bordure 2px Gris 400. Cochée : fond Encre, coche Blanc au trait 2. Erreur : bordure 2px Erreur. La ligne entière (libellé 16/24) est cliquable, hauteur minimale 44.
**Étoiles de note** — tracé étoile 24 × 24. Pleine : fond et trait Carmin (ou accent du widget). Vide : trait 1,5 Gris 400, sans fond. Demi : vide + moitié gauche pleine (affichage des moyennes uniquement). Tailles : 16 widget et listes, 20 cartes et détail, 36 dans un bouton de 56 (collecte). Toujours accompagnées du chiffre en texte ou d'un aria-label « 4 sur 5 ».
**Avatar** — cercle radius-full, 32 / 44 / 64. Sans photo : fond Papier (Blanc sur fond Papier), filet 1px Filet, initiales Newsreader 600 en 12 / 16 / 20. Avec photo : même cercle, object-fit: cover. Superposition : −10 px, bordure 2px couleur du fond.
**Badge de statut** — hauteur 28, padding 0 12 0 8, radius-full, texte 14/20 500, icône 16 au trait à 8 px du texte. En attente : Attention sur Attention fond, icône horloge. Validé : Succès sur Succès fond, icône coche cerclée. Masqué : Ardoise sur Papier, icône œil barré. À associer / Associée (connecteurs) : mêmes couleurs qu'En attente / Validé.
**Message d'état** (bandeau) — padding 24 (16 sur mobile), icône 24 ou 20, titre 16/24 600, détail 14/20. Succès : fond Succès fond. Attente : fond Papier. Erreur : fond Erreur fond + bordure 2px Erreur + action. radius-l sur la page de collecte, 0 ailleurs. role="status" ou role="alert".
**Carte de témoignage · widget** — fond Blanc, border-thin, radius-s (ou radius-l selon réglage), padding 24 (16 sur mobile), écarts 16 (12 sur mobile), aucune ombre. Ordre : avatar 44 + nom 16/24 600 + métier 14/20, étoiles 16, citation, photo jointe éventuelle, date 14/20 secondaire.
**Carte de témoignage · tableau de bord** — même carte (ou ligne de liste séparée par un filet), plus badge de statut en haut à droite et actions (Valider · Masquer) séparées par un filet.
**Navigation** — desktop : colonne 248, fond Blanc, filet droit, liens 44 de haut, padding 0 12, texte 14/20 ; actif : fond Papier, 600, aria-current="page". Mobile : barre d'onglets 84 (dont 24 de zone sûre), 5 onglets (Accueil, Témoignages, Demandes, Widgets, Plus), icône 24, libellé 12/16 ; actif Encre 600, inactif Ardoise.
**Icônes** — trait 1,5 px, grille 24, bouts et angles arrondis, currentColor, tailles 16 / 20 / 24. Pleine uniquement pour l'étoile de note. Jeu de base : étoile, photo, e-mail, validé, attente, masquer, modifier, connexion, copier, alerte.

## Widget
- **Police** : font-family: inherit. Le widget n'embarque aucune police ; seule la mention « Propulsé par » charge Newsreader 600 pour le logotype.
- **Tailles** : échelle de la charte en px fixes, indépendantes de la page. Carrousel : citation 20/28. Mur desktop : citation 16/24. Mur mobile : citation 14/20, nom 14/20, métier et date 12/16. Nom 16/24 600, métier et date 14/20.
- **Couleur du texte** : héritée de la page hôte (color: inherit) en thème clair ; #EDEEF0 en thème sombre.
- **Couleur d'accent** : réglée par le créateur (par défaut, la couleur des liens de sa page). Elle colore les étoiles pleines, le point actif du carrousel et le bouton « Voir les autres avis ». Contraste exigé : 3:1 minimum sur le fond des cartes, sinon l'éditeur prévient et propose Encre.
- **Neutres, thème clair** : carte #FFFFFF, bordure #D8D9DD, secondaire #5A5F6E, avatar #F3F3F0, étoile vide #7E8390.
- **Neutres, thème sombre** : carte #22262D, bordure #2F343D, texte #EDEEF0, secondaire #A4A8B1, avatar #2F343D, étoile vide #7E8390.
- **Thème auto** : choisi selon la luminance du fond de l'élément parent (luminance < 0,5 → sombre). Réglages possibles : Clair, Sombre, Auto (défaut).
- **Rayon des cartes** : réglable, radius-s (défaut) ou radius-l.
- **Mise en page** : mur en colonnes type maçonnerie, 3 colonnes au-delà de 1024 px de large, 2 en dessous, écart 24 (12 sur mobile). Carrousel : 3 cartes visibles au-delà de 1024 px, 1 en dessous, flèches 48 cerclées et points dans des zones de 44 × 44.
- **Badge compact** : pilule radius-full, bordure 1px, padding 4 16 4 4, 3 avatars de 32 superposés, étoiles 14, « 4,8/5 · 47 avis » en 16 600. À placer près du bouton d'achat. Lien vers le mur, aria-label « Note moyenne 4,8 sur 5, 47 avis ».
- **Mention « Propulsé par PULSACITY »** : sous chaque widget, « Propulsé par » en 12/16 couleur secondaire, suivi du logotype Newsreader 600 14 px en couleur du texte (#EDEEF0 sur sombre). Toujours visible sur les plans Gratuit et Essentiel ; retirable uniquement sur le plan Pro.
- **Chargement** : espace réservé de hauteur fixe (600 px desktop, 560 px mobile), blocs gris aux proportions des cartes (Papier en clair, #2F343D en sombre), texte « Chargement des avis… » en role="status", aria-busy="true". Pulsation d'opacité 1 → 0,6 en 1,2 s, désactivée si prefers-reduced-motion.
- **Photos** : avatars en cercle, photos jointes dans la carte, sur toute la largeur, hauteur 220 (140 sur mobile), même rayon que la carte.

## Ton de voix
1. **Toujours vouvoyer.** Le créateur comme son client. Chaleureux ne veut pas dire familier.
2. **Une idée par phrase, quinze mots au plus.** Si une phrase a besoin d'une virgule de trop, on la coupe.
3. **Le bouton dit ce qui va se passer.** Un verbe à l'infinitif et son objet : « Envoyer mon avis », jamais « Valider » seul pour un envoi, ni « OK ».
4. **Zéro jargon.** « Page de vente », pas « landing » ; « avis », pas « UGC » ; « connexion », pas « intégration API » ; « adresse de connexion », pas « webhook ».
5. **Rassurer, jamais presser.** Pas d'urgence, pas de points d'exclamation en série. Une erreur dit ce qui se passe et quoi faire, sans accuser.

Libellés de référence :
- Bouton : « Demander un avis »
- Succès : « Merci Camille, votre avis est bien envoyé. Julie le lira très vite. »
- Erreur : « Cette photo dépasse 10 Mo. Choisissez une image plus légère. »
- État vide : « Pas encore de témoignage. Envoyez votre lien à vos clients, ou connectez Systeme.io pour qu'une demande parte après chaque vente. »
- E-mail : objet « Camille, votre avis sur le Programme 30 jours ? » — bouton « Donner mon avis (1 minute) »
- Confirmation : « Masquer l'avis de Nadia B. ? Il n'apparaîtra plus sur vos pages. Vous pourrez l'afficher à nouveau à tout moment. » — boutons « Masquer l'avis » / « Annuler »

Libellés figés dans tous les écrans : « Créer mon espace gratuit » · « Demander un avis » · « Envoyer mon avis » · « Donner mon avis (1 minute) » · « Valider » · « Masquer » · « Copier le code » · « Connecter Systeme.io » · « Vérifier la connexion » · « Me prévenir » · statuts « En attente », « Validé », « Masqué ».
