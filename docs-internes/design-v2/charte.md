# Charte PULSACITY — v2
Direction « Tournesol », logo « Galet ». Remplace entièrement `charte.md` (v1) et `identite-v2/SPEC.md` pour tout ce qui est visuel. Les écrans, leurs contenus, leurs états et leurs textes restent ceux d'aujourd'hui, sauf les décisions du 12 octobre 2026 (lot 4.1), déjà reprises ici. En cas de conflit avec quick-reference.md ou pro-rules.md, cette charte et les interdits l'emportent.
Référence visuelle : canvas « PULSACITY v2 », pages « Charte v2 », « Logo final » et « Coques » ; exports dans `maquettes/` (voir `INDEX.md`).

## Couleurs
| Nom | Hex | Usage |
| --- | --- | --- |
| Soleil | #FFBE3B | Fond du bouton principal (texte Encre), étoiles pleines (toujours avec contour Encre 1,3 px), onglet actif du téléphone, page actuelle de la navigation, pastille de filtre choisie, pouce de l'interrupteur, aplats. Jamais en couleur de texte. |
| Soleil survol | #F7B021 | Survol de tout élément Soleil cliquable. |
| Soleil appui | #EBA112 | Appui de tout élément Soleil cliquable. |
| Corail | #F0674A | Étoile du logo, illustrations, pastille de comptage de la navigation (texte Encre), aplat de la bande des outils sur l'accueil. Jamais en couleur de texte. |
| Encre | #16213E | Texte principal, titres, contours, bouton secondaire, focus, cases cochées, piste de l'interrupteur activé, fonds sombres (pied de page, message flottant, onglet de panneau choisi). |
| Encre 800 | #2B3A63 | Survol des liens et des éléments Encre ; surfaces posées sur un fond Encre. |
| Gris | #565B6B | Texte secondaire (aides, dates, métiers, mentions), bord des champs au repos, étoile vide hors widget, icône et libellé inactifs, texte des éléments désactivés. |
| Givre | #B9C2D6 | Texte secondaire sur fond Encre uniquement ; pointillés de construction. |
| Blanc | #FFFFFF | Fond du site, cartes, champs, navigation de l'espace, barre d'onglets. |
| Nuage | #F4F8FF | Fond de l'espace créateur, fond des e-mails, survol d'une ligne de tableau, champ en lecture seule. |
| Ciel | #DCEBFF | Sections, panneaux, avatars sans photo, bandeau d'information, en-tête de tableau, squelettes, survol du bouton secondaire, du bouton icône, d'une option de menu ; colonne de prix mise en avant ; conteneur des onglets de panneau. |
| Ciel appui | #C9DDFB | Appui du bouton secondaire, du bouton icône, d'une pastille ; survol d'une option d'onglets de panneau. |
| Gris clair | #E9EDF3 | Fond des éléments désactivés, badge « Masqué », piste de l'interrupteur désactivé. Jamais en couleur de texte. |
| Bord désactivé | #C9CED8 | Bord des champs, cases et boutons désactivés. Jamais en couleur de texte. |
| Pousse | #1A6B45 | Texte et icône de succès (Validé, Connecté, Disponible, coches des listes). |
| Pousse fond | #DFF3E6 | Fond des badges et bandeaux de succès. |
| Attente | #8A5300 | Texte et icône d'attente (En attente, À associer). |
| Attente fond | #FFF4DB | Fond des badges et bandeaux d'attente. |
| Erreur | #B42318 | Texte, icône et bord 2 px d'erreur ; fond du bouton danger. Toujours avec l'icône « alerte ». |
| Erreur survol | #8F1C13 | Survol et appui du bouton danger. |
| Erreur fond | #FDECEA | Fond des bandeaux et messages d'échec ; survol d'une action destructrice dans un menu. |
| Voile | rgba(22, 33, 62, 0.56) | Derrière les fenêtres de dialogue et le menu du téléphone. |
| Widget clair — carte | #F2F4F8 | Fond des cartes du widget en thème clair. |
| Widget sombre — carte | #22262D | Fond des cartes du widget en thème sombre. |
| Widget sombre — trait | #2F343D | Avatars sans photo et squelettes du widget en thème sombre. |
| Widget sombre — texte | #EDEEF0 | Texte principal du widget en thème sombre. |
| Widget sombre — secondaire | #A4A8B1 | Texte secondaire du widget en thème sombre. |
| Étoile vide du widget | #7E8390 | Étoile vide du widget, dans les deux thèmes. |

Contrastes vérifiés (WCAG 2.1) : Encre/Blanc 15,89:1 · Encre/Nuage 14,92:1 · Encre/Ciel 13,15:1 · Encre/Gris clair 13,53:1 · Encre/Ciel appui 11,52:1 · Encre/Soleil 9,60:1 · Encre/Soleil survol 8,47:1 · Encre/Soleil appui 7,30:1 · Encre/Corail 5,10:1 · Gris/Blanc 6,76:1 · Gris/Nuage 6,35:1 · Gris/Ciel 5,60:1 · Gris/Gris clair 5,76:1 · Blanc/Encre 15,89:1 · Givre/Encre 8,89:1 · Soleil/Encre 9,60:1 · Corail/Encre 5,10:1 · Blanc/Encre 800 11,12:1 · Soleil/Encre 800 6,72:1 · Pousse/Pousse fond 5,60:1 · Pousse/Blanc 6,50:1 · Attente/Attente fond 5,79:1 · Attente/Blanc 6,33:1 · Erreur/Erreur fond 5,75:1 · Erreur/Blanc 6,57:1 · Blanc/Erreur 6,57:1 · Blanc/Erreur survol 8,96:1 · Encre sur Attente fond, Pousse fond, Erreur fond : 14,54 / 13,70 / 13,90:1 · bord des champs Gris/Blanc 6,76:1 · widget clair : Encre/carte 14,43:1, Gris/carte 6,14:1, étoile vide/carte 3,44:1 · widget sombre : texte/carte 13,08:1, secondaire/carte 6,37:1, étoile vide/carte 4,00:1, Soleil/carte 9,17:1 · exemple d'accent créateur #4F6F52 : Blanc/accent 5,63:1, accent/carte claire 5,12:1.
Combinaisons interdites : Soleil sur Blanc (1,66:1) et Blanc sur Soleil (1,66:1) · Corail en texte sur Blanc (3,11:1, formes seulement) et Blanc sur Corail (3,11:1) · Gris sur Soleil (4,08:1 : sur Soleil, tout texte est en Encre) · Givre ailleurs que sur Encre · Gris clair ou Bord désactivé en couleur de texte · étoile Soleil sans son contour Encre sur un fond clair · logo sur Soleil, Corail, photo ou dégradé.

## Typographie
| Rôle | Famille | Source (Google Fonts ou autre) | Graisses |
| --- | --- | --- | --- |
| Titres, chiffres clés, prix, logotype | Bricolage Grotesque (repli : "Arial Black", system-ui, sans-serif) | Google Fonts, SIL OFL 1.1 — https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&display=swap · à auto-héberger (next/font/google ou @fontsource-variable/bricolage-grotesque), aucun appel à Google en production | 800 uniquement · taille optique automatique (font-optical-sizing: auto, axe opsz 12 à 96) |
| Interface et texte | Figtree (repli : system-ui, -apple-system, "Segoe UI", sans-serif) | Google Fonts, SIL OFL 1.1 — https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700&display=swap · même règle d'hébergement (next/font/google ou @fontsource-variable/figtree) | 400 texte · 600 liens de navigation, message flottant · 700 boutons, libellés de champ, noms, badges |
| E-mails uniquement | Helvetica, Arial, sans-serif | Polices système, aucun chargement | 400 · 700 |
| Widget | Police de la page hôte (font-family: inherit) | Page hôte | Celles de la page hôte |

Règles : casse de phrase partout. Aucun italique, aucune capitale espacée, aucun mot de titre mis en couleur ou en italique. Interlettrage 0 pour Figtree ; Bricolage selon l'échelle ci-dessous. Longueur de ligne : texte 68ch maximum, citations 60ch maximum. Champs de saisie en 17 px (jamais moins de 16). Chiffres des tableaux : font-variant-numeric: tabular-nums. Le logotype en capitales est un dessin vectorisé, pas du texte.

## Échelle de tailles
| Nom | Taille px | Interligne | Usage |
| --- | --- | --- | --- |
| display | 84 | 84 | Grand titre de l'accueil (Bricolage 800, −0,04 em). Mobile : 42/44, −0,035 em. |
| h1 | 52 | 54 | Titre de page (Bricolage 800, −0,035 em). Mobile : 34/38. |
| chiffre | 60 | 60 | Chiffres clés du tableau de bord, prix (Bricolage 800, −0,03 em). Mobile : 40/44. « € » à la même taille, après une espace insécable. |
| h2 | 30 | 34 | Titre de section (Bricolage 800, −0,02 em). Mobile : 26/30. |
| h3 | 24 | 28 | Titre de carte, de fenêtre, d'étape (Bricolage 800). Mobile : 22/26. |
| lead | 20 | 30 | Chapeau sous un grand titre (Figtree 400). Mobile : 17/26. |
| quote | 19 | 28 | Citations de témoignages dans le site et l'espace (Figtree 400). Mobile : 17/26. |
| body | 17 | 26 | Texte courant, champs, boutons (700), liens de navigation (600). Identique sur mobile. |
| small | 15 | 22 | Libellés de champ (700), aides, noms et métiers, bandeau (détail), message flottant (600). |
| badge | 14 | 20 | Badges de statut (700), légendes des planches. |
| legal | 13 | 18 | Libellés des onglets du téléphone, mentions sous un bouton, « Exemple, avis fictifs ». |
| mention | 12 | 16 | « Propulsé par » du widget. Taille minimale absolue. |

Exceptions : le logo suit ses propres hauteurs (voir `SPEC-logo-v2.md`) ; les e-mails ont leur échelle (section E-mails) ; le widget a ses tailles fixes (section Widget).

## Espacements
| Nom | Valeur px |
| --- | --- |
| space-1 | 4 |
| space-2 | 8 |
| space-3 | 12 |
| space-4 | 16 |
| space-5 | 20 |
| space-6 | 24 |
| space-7 | 28 |
| space-8 | 32 |
| space-9 | 40 |
| space-10 | 48 |
| space-11 | 56 |
| space-12 | 64 |
| space-13 | 80 |
| space-14 | 96 |
| page-gutter-mobile | 20 |
| page-gutter-desktop | 80 |
| content-max | 1280 |
| nav-espace-desktop | 264 |
| tab-bar-mobile | 84 (dont 24 de zone sûre) |

Aucune autre valeur de marge, de padding ou d'écart. Exceptions : chevauchements négatifs (avatars superposés : −10 px) et alignements optiques d'icônes. Cibles tactiles : 44 × 44 au moins, 48 × 48 pour les flèches du carrousel, 56 × 56 pour les étoiles de la page de collecte.

## Point de rupture
| Nom | Valeur px | Usage |
| --- | --- | --- |
| desktop | 1024 | À partir de cette largeur : tailles desktop, page-gutter-desktop, navigation latérale de l'espace, tableaux. En dessous : tailles mobiles, page-gutter-mobile, barre d'onglets, listes en cartes. Rien ne déborde à 360 px. |

## Rayons
| Nom | Valeur px | Usage |
| --- | --- | --- |
| radius-check | 7 | Cases à cocher. |
| radius-field | 14 | Champs, listes déroulantes, options de liste et de menu, en-tête de tableau, lignes de tableau, squelettes de texte en bloc. |
| radius-card | 20 | Cartes, bandeaux, menus, listes ouvertes, messages flottants, cartes du widget (réglage « doux », défaut), carte des e-mails, captures. |
| radius-panel | 24 | Panneaux, tuiles de chiffres, fenêtres de dialogue, colonnes de prix, feuille du téléphone (24 en haut seulement). |
| radius-block | 32 | Grands aplats et visuels de l'accueil. |
| radius-net | 6 | Cartes et flèches du widget, réglage « net ». |
| radius-full | 999 | Boutons, badges, pastilles, onglets, avatars, interrupteurs. |

## Ombres
| Nom | Valeur CSS | Usage |
| --- | --- | --- |
| shadow-float | 0 2px 6px rgba(22, 33, 62, 0.08), 0 12px 32px rgba(22, 33, 62, 0.16) | Uniquement ce qui flotte : menus, listes ouvertes, fenêtres de dialogue, messages flottants, en-tête du site une fois la page défilée de 8 px. Jamais sur une carte posée dans la page. |
| shadow-tab-bar | 0 -1px 0 rgba(22, 33, 62, 0.04), 0 -8px 24px rgba(22, 33, 62, 0.06) | Barre d'onglets du téléphone uniquement. |

## Bordures
| Nom | Valeur | Usage |
| --- | --- | --- |
| border-field | 2px solid #565B6B | Champs, listes déroulantes et cases au repos. |
| border-strong | 2px solid #16213E | Survol et focus d'un champ, bouton secondaire, pastille de filtre, flèches du carrousel. |
| border-error | 2px solid #B42318 | Champ, liste ou case en erreur ; message d'échec. |
| border-disabled | 2px solid #C9CED8 | Champ, case ou bouton désactivé. |
| focus-ring | outline: 2px solid #16213E; outline-offset: 3px | Tout élément interactif au clavier (:focus-visible). |
| focus-ring-on-ink | outline: 2px solid #FFBE3B; outline-offset: 3px | Même chose sur fond Encre (pied de page, message flottant). |

Aucun filet entre les sections, ni entre les lignes d'une liste ou d'un tableau, ni sous la navigation : on sépare par l'espacement et par les fonds.

## Composants
**Bouton principal** — hauteur 56, padding 0 28, radius-full, fond Soleil, texte Encre Figtree 700 17/26. Survol : fond #F7B021 (120 ms). Appui : fond #EBA112 et translation de 1 px vers le bas. Focus : focus-ring. Désactivé : fond Gris clair, texte Gris, aria-disabled. Chargement : spinner 20 (arc M12 3a9 9 0 1 1-9 9, trait 3, rotation 0,8 s linéaire) + « Envoi… », aria-busy="true", non cliquable. Un seul par écran.
**Bouton secondaire** — hauteur 52, padding 0 24, radius-full, fond Blanc, border-strong, texte Encre 700 17/26 (16 dans les rangées serrées). Survol : fond Ciel. Appui : fond Ciel appui + translation 1 px. Focus : focus-ring. Désactivé : bord #C9CED8, texte Gris. Chargement : spinner 18 + « Envoi… ». Variante compacte des tableaux : hauteur 44, padding 0 18.
**Bouton discret** — zone de 44 de haut, padding 0 10, sans fond, texte Encre 700 17, souligné 2 px, décalage 4 px. Survol : Encre 800, soulignement 3 px. Appui : fond Ciel, radius-full. Focus : focus-ring. Désactivé : Gris, sans soulignement. Pas d'état de chargement : l'action suit dans une fenêtre ou sur place.
**Bouton danger** — hauteur 52, padding 0 24, radius-full, fond Erreur, texte Blanc 700. Survol et appui : fond #8F1C13 (appui + 1 px). Focus : focus-ring. Désactivé : fond Gris clair, texte Gris. Chargement : spinner blanc + « Suppression… ». Uniquement dans une fenêtre de confirmation.
**Bouton icône** — 44 × 44, radius-full, sans fond, icône 20 ou 24 Encre. Survol : Ciel. Appui : Ciel appui. Focus : focus-ring. Désactivé : icône #C9CED8. aria-label obligatoire. Flèches du carrousel : 48 × 48, border-strong.
**Bouton de la page de collecte** — pleine largeur, hauteur 60, radius-full, fond = couleur d'accent du créateur ; texte Blanc si le contraste atteint 4,5:1, sinon Encre ; sans accent : Soleil et Encre. Figtree 700 18. Survol : accent assombri de 8 %. Pendant l'envoi d'une photo : désactivé, avec « Le bouton revient dès que la photo est envoyée. » Pendant l'envoi : « Envoi… ».
**Champ de texte** — hauteur 56, padding 0 16, radius-field, fond Blanc, texte Encre Figtree 400 17/26, border-field. Libellé au-dessus 15/22 700 à 8 px ; aide en dessous 15/22 Gris ; « (facultatif) » dans le libellé en 400 Gris. Survol : bord Encre. Focus : bord Encre + focus-ring. Erreur : border-error + message 15/22 Erreur avec l'icône « alerte » 20 à 6 px, relié par aria-describedby, aria-invalid="true" sur le champ. Désactivé : fond Gris clair, border-disabled, texte Gris. Lecture seule (lien à copier) : fond Nuage. Zone de texte : 160 de haut au moins, padding 16 18.
**Liste déroulante** — même boîte que le champ, chevron 20 à droite (padding 0 14 0 16). Ouverte : panneau Blanc, radius-card, padding 8, shadow-float, 4 px sous le champ ; options de 48, padding 0 14, radius-field ; survol et option active au clavier : Ciel ; option choisie : Ciel, 700 et coche 20 à droite. Erreur et désactivé : comme le champ. Texte d'invite (« Choisir une offre ») en Gris.
**Case à cocher** — 24 × 24, radius-check, fond Blanc, border-field. Survol : bord Encre. Cochée : fond Encre, coche Blanc trait 2,4 (tracée en 240 ms, courbe ressort). Focus : focus-ring. Erreur : border-error. Désactivée : fond Gris clair, border-disabled. La ligne entière (libellé 17/26 ou 16/24) est cliquable, 44 de haut au moins ; consentement de la page de collecte : ligne sur fond Nuage, radius-card, padding 16.
**Interrupteur** — piste 52 × 32 dans une zone de 44, radius-full, role="switch", aria-checked. Activé : piste Encre, pouce Soleil 24. Désactivé (off) : piste Gris clair, bord 2 px Gris, pouce Gris 22. Le pouce glisse en 240 ms (ressort). Focus : focus-ring. Inactif (disabled) : piste Gris clair, bord #C9CED8.
**Étoiles de note** — tracé étoile 24 × 24 (STAR_PATH en annexe). Pleine : fond Soleil, contour Encre 1,3. Vide : contour Gris 1,5, sans fond. Demi : vide + moitié gauche pleine (moyennes uniquement). Tailles : 16 badges et listes, 18 tableaux, 20 cartes, 46 dans une cible de 56 (collecte). Toujours avec le chiffre en texte ou un aria-label « 4 sur 5 ». Étoile choisie (collecte) : échelle 1 → 1,18 → 1, 240 ms, ressort.
**Avatar** — cercle radius-full, 32 / 36 / 44 / 64. Sans photo : fond Ciel (Blanc sur fond Ciel), initiales Figtree 700 en 12 / 13 / 15 / 20. Avec photo : object-fit: cover. Superposition : −10 px, bord 2 px couleur du fond.
**Badge de statut** — hauteur 32, padding 0 12, radius-full, Figtree 14/20 700, icône 16 au trait 2 à 6 px du texte. En attente : Attente sur Attente fond, icône horloge. Validé : Pousse sur Pousse fond, icône coche cerclée (la coche se trace en 240 ms quand le statut vient de changer). Masqué : Gris sur Gris clair, icône œil barré. Connecté : comme Validé. À associer : comme En attente. Problème : Erreur sur Erreur fond, icône alerte cerclée. Disponible : Pousse sur Pousse fond. Bientôt : Encre sur Ciel, sans date ; dans une liste d'outils, toujours suivi de « En attendant : avec Zapier ou Make ». La couleur n'est jamais seule : l'icône et le mot portent l'état.
**Pastille de comptage** — 26 × 26 (min-width 26, padding 0 8), radius-full, fond Corail, texte Encre 14 700, aria-label « 3 en attente ». Uniquement sur « Témoignages » dans la navigation.
**Bandeau** (succès, attente, erreur, information) — radius-card, padding 20 24 (16 20 sur mobile), icône 24 à 14 px, titre 17/26 700, détail 15/22. Succès : Pousse fond, icône Pousse. Attente : Attente fond, icône Attente. Information : Ciel, icône Encre. Erreur : Erreur fond + border-error + toujours une action (bouton secondaire, ex. « Mettre à jour ma carte »). role="status" (succès, attente, information) ou role="alert" (erreur). Le bandeau de paiement échoué s'affiche en haut de chaque page de l'espace. Premier témoignage validé : le symbole petit 24 remplace l'icône (voir SPEC logo).
**Fenêtre de dialogue** — fond Blanc, radius-panel, padding 32, largeur 520 au plus, shadow-float, centrée sur le voile. Titre h3 24/28 relié par aria-labelledby, texte 17/26, actions à droite (« Annuler » secondaire, puis action principale ou danger), croix 44 « Fermer » en haut à droite. role="dialog", aria-modal="true", focus piégé, focus initial sur « Annuler » pour une action destructrice, Échap ferme, retour du focus au bouton d'origine, défilement de la page bloqué. Clic sur le voile : ferme, sauf pendant un envoi. Pendant l'envoi : action en « Envoi… », « Annuler » désactivé. Échec : bandeau d'erreur dans la fenêtre (« La modification n'a pas été enregistrée. Vérifiez votre connexion, puis réessayez. »). Téléphone : feuille ancrée en bas, radius 24 24 0 0, padding 24 20 28, boutons pleine largeur, action en premier. Ouverture : opacité + translation de 8 px, 320 ms.
**Menu** — fond Blanc, radius-card, padding 8, shadow-float, 232 px de large au moins. Options de 48 (44 au minimum), padding 0 14, radius-field, Figtree 17 (15 dans le menu du compte), icône 20 à 12 px. Survol et focus clavier : Ciel. Action destructrice en dernier, texte Erreur 700, survol Erreur fond, ouvre toujours une fenêtre de confirmation. Déclencheur : bouton icône « Autres actions pour l'avis de … » (aria-expanded, aria-controls). Flèches haut/bas, Échap ferme et rend le focus.
**Onglets de panneau** (role="tablist", ex. « Réglages » / « Aperçu ») — conteneur Ciel, radius-full, padding 4 ; onglets de 44, Figtree 700 17 ; onglet choisi : fond Encre, texte Blanc ; survol d'un onglet non choisi : Ciel appui. Focus : focus-ring.
**Bascule à deux choix** (Mensuel / Annuel, aria-pressed) — même dessin que les onglets de panneau. « Annuel : 2 mois offerts » à 16 px à droite (dessous sur mobile), 15/22 700.
**Liens d'une rubrique** (navigation du site) — Figtree 600 17, zone de 44, page actuelle : soulignement 3 px (box-shadow inset 0 −3px 0 Encre) et aria-current="page" ; survol : Encre 800 et soulignement 2 px.
**Pastille de filtre** — hauteur 40 dans une zone de 44, padding 0 16, radius-full, border-strong, fond Blanc, Figtree 700 15. Survol : Ciel. Appui : Ciel appui. Focus : focus-ring. Choisie : fond Soleil + coche 16 à gauche (padding 0 16 0 12), aria-pressed="true". Désactivée : fond Gris clair, border-disabled, texte Gris. Un seul choix par groupe (role="group"). Au téléphone, la rangée défile à l'horizontale ; « Offre » et « Note » restent des listes déroulantes.
**Tableau** (ordinateur) — en-tête : hauteur 48, fond Ciel, radius-field aux extrémités, Figtree 15/22 700, padding 0 16. Lignes : fond Blanc, padding 18 16, 80 de haut environ, 2 lignes de texte au plus (line-clamp), aucun filet ; survol : Nuage. Colonnes des témoignages : Client 170 · Témoignage (reste) · Note 136 · Offre 190 · Statut 150 · En avant 104 · Actions 250 (en-tête masqué « Actions »). Actions : « Valider » secondaire compact 44, « Masquer » discret, menu. « En avant » : bouton icône signet (aria-pressed) ; activé : fond Soleil. Chiffres en tabular-nums.
**Liste en cartes** (téléphone, sous 1024) — cartes Blanc sur Nuage, radius-card, padding 16, 12 entre deux cartes, sans ombre. Ordre : badge et menu, étoiles 18, citation (3 lignes au plus), nom 700 · offre Gris, actions (« Valider » secondaire 44 et « Masquer » discret, côte à côte).
**État vide** — on dit ce qui manque et comment l'obtenir, avec les mots de l'écran. Liste vide : illustration simple de 120 px au plus (88 au téléphone), phrase 17/26, puis les actions. Texte v2 des témoignages : « Partagez votre lien de collecte ou connectez l'outil où vous vendez pour recevoir vos premiers avis. » + champ « Votre lien de collecte » (lecture seule) + « Copier le lien » (principal) + « ou » + « Connecter mon outil » (secondaire, icône connexion, mène à la liste des connecteurs). Téléphone : « Partager mon lien » (principal) puis « Connecter mon outil », pleine largeur. Filtre sans résultat : « Aucun témoignage ne correspond à ces filtres. » + « Effacer les filtres » (discret), sans illustration. Jamais de faux contenu ni de zéro mis en avant.
**Message après une action** — Sur place, quand l'action a un bouton visible (copier un lien, un code, une clé) : le bouton passe 2 s à « Lien copié » (coche), une zone aria-live polie annonce « Le lien est copié. ». Message flottant sinon : fond Encre, texte Blanc 15/22 600, coche Soleil 20, radius-card, padding 14 20, shadow-float, en bas au centre (au-dessus de la barre d'onglets au téléphone), 4 s, role="status", un seul à la fois, jamais de bouton (« Modifications enregistrées. », « Demande d'avis envoyée »). Échec : jamais automatique ; près de ce qui a échoué, fond Erreur fond, border-error, radius-card, icône alerte, croix « Fermer » 44, role="alert", reste jusqu'à fermeture ou nouvel essai.
**Squelette de chargement** — formes Ciel (#2F343D dans le widget sombre) à la place exacte du contenu attendu : lignes de texte en pilule de 16 px, badges et boutons à leur taille, cartes radius-card. Pulsation d'opacité 1 → 0,6, 1 200 ms, en boucle, sans reflet. role="status" et texte pour lecteurs d'écran (« Chargement des avis… »). La hauteur ne change pas à l'arrivée du contenu.
**Chargement de marque** (ChargementMarque) — seulement à l'ouverture de l'espace et si l'attente dépasse 1 s : symbole normal 48 centré, « Ouverture de votre espace… » 17/26 600, « Cela prend quelques secondes la première fois. » 15/22 Gris, fond Nuage, role="status". Disparaît sans animation.
**Colonnes de prix** (Tarifs et accueil) — titre « Tarifs », dessous : « Prix finaux : rien ne s'ajoute au paiement. » Bascule Mensuel / Annuel + « Annuel : 2 mois offerts ». Trois colonnes de même structure, rangée par rangée : « Recommandé » (15/20 700, 20 px réservés partout), nom (h2), prix en chiffre 60/60 + « par mois » / « par an » / « pour toujours » 15 Gris, ligne de lancement 15/22 Gris sur 44 px réservés (vide sous Gratuit), phrase 17/26, bouton dans une zone de 56, liste à coches Pousse 20. Essentiel : fond Ciel, bouton principal « Choisir Essentiel ». Gratuit et Pro : fond Blanc, bouton secondaire (« Créer mon espace gratuit », « Choisir Pro »). radius-panel, padding 32 28. Prix : Gratuit 0 € ; Essentiel 9,99 € par mois ou 99 € par an ; Pro 19,99 € par mois ou 199 € par an. Ligne de lancement : « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois. » (Pro : 24,99 € par mois ; Annuel : « Ensuite, 149 € par an. » et « Ensuite, 249 € par an. »). Ni prix barré, ni compteur, ni « TVA comprise », ni « HT ». Téléphone : colonnes empilées, liste avant le bouton, pas de place réservée.
**Navigation** — Site, ordinateur : en-tête 88, fond Blanc, logo horizontal 32 (lien « PULSACITY, accueil »), liens Intégrations · Tarifs · Guides · Se connecter (28 d'écart), puis « Créer mon espace gratuit » secondaire ; position sticky, shadow-float après 8 px de défilement. Site, téléphone : en-tête 64, logo petit 24, bouton 44 « Ouvrir le menu » / « Fermer le menu » (aria-expanded) ; menu ouvert : panneau Blanc sous l'en-tête, radius 0 0 24 24, padding 8 20 24, lignes de 56 (radius-field, chevron 20 Gris, page actuelle sur Ciel 700), puis « Créer mon espace gratuit » principal pleine largeur ; voile sur la page, défilement bloqué. Pied de page : fond Encre, padding 56 80 48 (40 20 32 au téléphone), logo sombre 32, liens Mentions légales · CGU · CGV · Confidentialité · Cookies · Contact en Blanc 15/22 soulignés (zone de 44 ; grille de 2 colonnes au téléphone), « © 2026 PULSACITY ». Espace, ordinateur : colonne 264, fond Blanc sur page Nuage, padding 28 16 20, logo petit 27, liens de 48, padding 0 16, radius-full, icône 24 à 12 px, Figtree 600 17 ; page actuelle : fond Soleil, 700, aria-current="page" ; survol : Ciel. Ordre : Accueil, Témoignages (+ pastille de comptage), Offres, Widgets, Connecteurs, Demandes, Réglages. En bas : bouton du compte (64 de haut, radius-full, fond Nuage ; ouvert : Ciel), avatar 44, nom 700 15, chevron. Menu du compte : au-dessus du bouton, 296 de large, nom 15 700, adresse 15 Gris, « Plan Essentiel » 13 Gris, puis Mon compte · Abonnement et factures · Aide et contact · Se déconnecter (icônes user, card, help, logout). Espace, téléphone : en-tête 64 fond Blanc, logo petit 24, avatar 44 « Votre compte » (mène à « Plus ») ; barre d'onglets fixe 84 (padding 4 8 24), fond Blanc, shadow-tab-bar, 4 onglets de 56 : Accueil, Témoignages, Demandes, Plus ; icône 24 dans une pilule 56 × 32, libellé 13/18 ; actuel : pilule Soleil, Encre 700 ; autres : Gris 600. Page « Plus » : titre h1, intertitres « Votre espace » et « Votre compte » 15/22 700 Gris, groupes sur cartes Blanc radius-card padding 8, lignes de 56 (icône 24, chevron 20 Gris) ; Votre espace : Offres, Widgets, Connecteurs, Réglages ; Votre compte : avatar 44 + nom + adresse + plan, puis Mon compte, Abonnement et factures, Aide et contact ; « Se déconnecter » secondaire pleine largeur.
**Jauge de consommation** (plan Gratuit) — libellé 15/22 700 à gauche, « 12 sur 15 » à droite (chiffre 17 700, tabular-nums), barre de 10 px radius-full sur Ciel, remplissage Encre ; à la limite ou au-delà : remplissage Attente et « Limite atteinte » 14/20 Attente 700 (ou la règle qui s'applique : « Le widget en montre 15… »). role="progressbar", aria-valuenow, aria-valuemax.
**Question dépliable** (Aide) — bouton pleine largeur, fond Blanc, radius-card, 56 de haut au moins, padding 12 24 (12 16 au téléphone), question 17/26 700, chevron 20 à droite (retourné quand ouvert), aria-expanded ; réponse 17/26 dessous, 68ch. Une seule ouverte par défaut. Lien de guide sous chaque thème : icône file 20 + texte discret souligné.
**Carte d'outil** (Intégrations) — fond Blanc, radius-card, padding 20 ; monogramme 44 (initiales Bricolage sur Ciel, radius-field : aucun logo de marque dans le catalogue), nom en lien 17 700 + chevron, badge « Disponible » ou « Bientôt », phrase 15/22, puis 14/20 Gris « En attendant : avec Zapier ou Make » (Bientôt) ou « Déjà possible avec le connecteur universel : voir le guide » (outils servis par un guide). Grille de 4 colonnes, 14 d'écart ; 1 colonne au téléphone. Dans l'espace : même contenu en lignes, action à droite (« Gérer », « Connecter », « Me prévenir », ou « Nous vous préviendrons par e-mail » en Pousse quand on est inscrit).
**Monogramme** — carré radius-field, fond Ciel, une ou deux initiales en Bricolage 800 (38 % du côté). Remplace les logos d'outils tiers partout, sauf sur la page publique de l'outil si sa marque le permet.
**Badges ajoutés** — Affiché (Pousse, coche cerclée), En pause (Gris sur Gris clair, icône pause), Inscrit (Encre sur Ciel), Abonné (Pousse), Bêta-testeur et Prix de lancement (Encre sur Ciel), Votre plan (Encre sur Soleil, sans icône), compatibilité : Oui (Pousse), Selon la formule (Encre sur Ciel), Pas encore testé (Gris sur Gris clair), Non (Gris sur Gris clair, icône annulé).
**Étapes numérotées** (vraie séquence : connexion, guides, parrainage) — pastille 36 Soleil, chiffre Bricolage 18, titre h3, texte 16/24 ou 17/26, 28 à 32 d'écart.
**Menu du compte et page « Plus »** — ajout de « Parrainage » (icône gift) entre « Abonnement et factures » et « Aide et contact ».
**Icônes** — voir la section Icônes.

## Widget
- **Police** : font-family: inherit. Le widget ne charge aucune police ; la mention « Propulsé par » utilise le SVG vectorisé `pulsacity-mention-mono.svg` (aucun chargement de Bricolage).
- **Tailles** : px fixes, indépendantes de la page. Carte : citation 16/24 (carrousel 17/26), nom 14/20 700, titre · date 14/20 secondaire, étoiles 18 (carrousel 22, résumé 20, badge 16). Mur mobile : citation 15/22. « Propulsé par » 12/16.
- **Couleur du texte** : celle de la page hôte si elle atteint 4,5:1 sur la carte, sinon Encre (clair) ; #EDEEF0 en thème sombre.
- **Couleur d'accent** : choisie par le créateur (par défaut, la couleur des liens de sa page). Elle colore les étoiles pleines (fond et contour), le bouton « Voir les … autres avis » (bord et texte) et le point actif du carrousel. Contraste exigé : 3:1 sur le fond des cartes, sinon Encre (clair) ou Soleil (sombre), et l'éditeur prévient.
- **Neutres, thème clair** : carte #F2F4F8, sans bord ni ombre, texte #16213E, secondaire #565B6B, avatar #DCEBFF, étoile vide #7E8390, squelette #DCEBFF.
- **Neutres, thème sombre** : carte #22262D, sans bord ni ombre, texte #EDEEF0, secondaire #A4A8B1, avatar #2F343D, étoile vide #7E8390, squelette #2F343D.
- **Thème auto** : choisi selon la luminance du fond de l'élément parent (luminance < 0,5 → sombre). Réglages : Clair, Sombre, Auto (défaut).
- **Rayon des cartes** : réglable, « doux » 20 (défaut) ou « net » 6 ; les flèches du carrousel suivent (radius-full ou 6).
- **Carte** : padding 20, écarts 12, aplat sans bord ni ombre. Ordre : étoiles, citation, auteur (avatar 36, nom, puis titre · date). À valider : la v1 du mur mettait l'auteur en premier.
- **Mise en page** : mur en maçonnerie, 3 colonnes au-delà de 1024 px de large, 2 en dessous, 1 sous 340 px (largeur du widget, pas de l'écran). Écart 14 (12 sur mobile). Carrousel : 3 cartes au-delà de 1024 px, 1 en dessous, flèches 48 bordées 2 px, points de 10 dans des zones de 44 (24 × 24 visibles, zone étendue).
- **Résumé** : étoiles 20 + « 4,7/5 · 12 avis » (valeurs réelles), 600, aria-label « Note moyenne 4,7 sur 5, 12 avis ».
- **Badge compact** : pilule radius-full, fond carte, hauteur 44, padding 0 18, étoiles 16, moyenne et nombre d'avis réels, lien vers le mur de la même page.
- **Mention « Propulsé par PULSACITY »** : sous chaque widget, « Propulsé par » 12/16 couleur secondaire, puis `pulsacity-mention-mono.svg` à 12–14 px de haut en couleur secondaire, espace de 6 px. Visible sur Gratuit et Essentiel, retirable sur Pro.
- **Chargement** : espace réservé de hauteur fixe (600 desktop, 560 mobile), squelettes aux proportions des cartes, « Chargement des avis… » en role="status", aria-busy="true", pulsation 1 → 0,6 en 1 200 ms, arrêtée si prefers-reduced-motion.
- **Photos** : avatars en cercle ; photo jointe sur toute la largeur de la carte, hauteur 220 (140 sur mobile), radius-field.
- **Exemples** : tout widget montré sur le site porte « Exemple, avis fictifs » dessous, note d'exemple 4,7/5.

## E-mails
- **Format** : 600 px de large, fond de page #F4F8FF, carte Blanc radius 20 (carré sous Outlook), padding 40 (24 au téléphone). Polices système seulement : Helvetica, Arial, sans-serif. Texte 16/24 Encre, titres 22/28 700, petit texte 14/20 Gris, mentions légales 13/18 Gris.
- **En-tête, e-mails au client (au nom du créateur)** : logo du créateur 44 en cercle (ou initiales sur Ciel, Helvetica 700 16), nom 20/28 700.
- **En-tête, e-mails au créateur (au nom de PULSACITY)** : `email-symbole-48.png` affiché à 24 × 24, alt="", puis « PULSACITY » en texte Helvetica 20/24 700, espace de 8 px.
- **Bouton** : hauteur 52 (56 au téléphone), padding 0 28, radius-full (carré sous Outlook), Helvetica 700 16. E-mails au client : fond = accent du créateur, texte Blanc si 4,5:1 sinon Encre ; sans accent : fond Encre, texte Blanc. E-mails au créateur : fond Soleil, texte Encre. Toujours suivi de « Le bouton ne s'affiche pas ? Ouvrez ce lien : » + le lien en clair.
- **Étoiles** : caractères ★ en Encre et ☆ en Gris, toujours suivis de « 5 sur 5 » en texte.
- **Demande** : objet « Camille, votre avis sur Programme 30 jours ? » ; bouton « Donner mon avis ». **Relance v2, sans durée** : objet « Camille, un mot sur Programme 30 jours ? » ; texte « Je reviens vers vous une seule fois, sans insister. Votre avis sur Programme 30 jours m'aiderait beaucoup. » (remplace « une minute pour… » et « Si vous avez une minute… »).
- **Mode sombre des messageries** : pas de fond imposé hors de la carte ; le symbole des e-mails reste lisible sur fond sombre grâce à son étoile Corail et au nom en texte.

## Icônes
Trait 2 px, grille 24 (zone utile 20, marge de 2), extrémités et angles arrondis (stroke-linecap et stroke-linejoin: round), coins de rayon 2 à 3, currentColor, aucun remplissage. Tailles : 16 (badges), 20 (boutons, champs, menus), 24 (navigation, bandeaux, onglets). Seule icône pleine : l'étoile de note (Soleil + contour Encre 1,3). Couleurs : Encre (actif), Gris (inactif), Blanc (sur Encre). Une icône seule a toujours un aria-label ; sinon aria-hidden="true". Jamais d'émoji en guise d'icône. Le symbole du logo n'est pas une icône. Jeu complet (mêmes noms que la v1, tracés v2 en annexe) : alert, valid, clock, cancelled, close, replay, photo, email, copy, connection, share, home, quote, tag, grid, mail, sliders, more, user, card, help, logout, chevronDown, chevronRight, chevronLeft, bookmark, search, plus, info, hidden, upload, download, wall, carousel, badge, menu, bag, check, et depuis 3.3 : gift (parrainage), pause (widget en pause), external (lien vers Stripe), file (guide), monitor et phone (appareils connectés).

## Captures et illustrations
- Captures : de vrais écrans de PULSACITY, à 100 % ou 50 %, jamais redessinés « en mieux » ; recadrés sur ce qui compte, posés sur un aplat Soleil ou Ciel, radius 20, bord qui déborde.
- Sous chaque exemple : « Exemple, avis fictifs » (13/18). Note d'exemple : 4,7/5. Aucun client, logo, compteur ou témoignage inventé présenté comme réel ; jamais « avis vérifiés ».
- Illustrations : formes simples (bulle, étoile, soleil, fusée) en aplats Soleil, Corail, Ciel, Blanc, contour Encre 3 px ; pas de personnage, pas de dégradé, pas de 3D, pas de photo de banque d'images. Une illustration par écran au plus. Rotation de 2° au plus, seulement pour poser un exemple.
- Outils tiers : leur nom en texte sous « Fonctionne avec … » ; leur logo seulement sur la page de leur connecteur, à la taille du texte ; jamais « partenaire officiel ».

## Mouvement
| Nom | Durée | Courbe | Ce qui s'anime |
| --- | --- | --- | --- |
| motion-couleur | 120 ms | ease-out | Survol et focus : fonds, bords, soulignements. |
| motion-ressort | 240 ms | cubic-bezier(0.34, 1.36, 0.64, 1) | Étoile choisie de la collecte (1 → 1,18 → 1), pouce de l'interrupteur, coche d'une case, coche du badge « Validé » qui se trace, appui (translation 1 px). |
| motion-entree | 320 ms | cubic-bezier(0.2, 0, 0, 1) | Ouverture d'un menu, d'une liste, d'une fenêtre (opacité 0 → 1 et translation 8 px → 0), message flottant, note posée sur le mur de la démo. Fermeture : 200 ms, même courbe, sans translation. |
| motion-marque | 640 ms | cubic-bezier(0.6, 0, 0.2, 1) | Décollage du symbole, une seule fois par compte et par moment : état « Premier jour », premier témoignage validé. Fusée : translateY 0 → +1,2 → −6 → 0 (unités de la grille 64) ; étoile : échelle 1 → 0,9 → 1,14 → 1, origine à sa pointe haute. |
| motion-attente | 1 400 ms | cubic-bezier(0.4, 0, 0.6, 1), en boucle | Chargement de marque : l'étoile seule respire (opacité 1 → 0,55 → 1, échelle 1 → 0,9 → 1). |
| motion-squelette | 1 200 ms | cubic-bezier(0.4, 0, 0.6, 1), en boucle | Pulsation d'opacité 1 → 0,6 des squelettes. |

Ce qui ne s'anime jamais : rien au chargement d'une page, rien au défilement, aucun fondu ni cascade d'apparition, aucun compteur qui défile, aucun carrousel automatique, aucune parallaxe, aucun mouvement du logo au survol. Seuls transform et opacity s'animent. Au plus une animation de marque par écran. Réduction du mouvement (prefers-reduced-motion: reduce) : durées à 0, aucune boucle (l'étoile reste fixe, les squelettes restent pleins), état final immédiat ; les changements de couleur restent. Jetons et keyframes : `logo/code/pulsacity-motion.css`.

## Interdits
Étiquettes en majuscules espacées au-dessus des titres · un mot du titre en couleur ou en italique · flèches « → » dans les boutons · grilles de cartes identiques avec la même ombre · dégradés décoratifs · animations d'apparition sur chaque section · numérotation 01/02/03 hors d'une vraie séquence · filets fins pour séparer · titres à empattements sur fond crème · durées d'installation ou de saisie (« 2 minutes », « moins d'une minute ») · « TVA comprise », « HT » · « tout Systeme.io » · « partenaire officiel » · « avis vérifiés » · prix barré, compteur de places.

## Ton de voix
Inchangé depuis la v1.
1. **Toujours vouvoyer.** Le créateur comme son client. Chaleureux ne veut pas dire familier.
2. **Une idée par phrase, quinze mots au plus.** Si une phrase a besoin d'une virgule de trop, on la coupe.
3. **Le bouton dit ce qui va se passer.** Un verbe à l'infinitif et son objet : « Envoyer mon avis », jamais « Valider » seul pour un envoi, ni « OK ».
4. **Zéro jargon.** « Page de vente », pas « landing » ; « avis », pas « UGC » ; « connexion », pas « intégration API » ; « adresse de connexion », pas « webhook ».
5. **Rassurer, jamais presser.** Pas d'urgence, aucune durée promise, pas de points d'exclamation en série. Une erreur dit ce qui se passe et quoi faire, sans accuser.

Libellés de référence :
- Bouton : « Demander un avis »
- Succès : « Merci Camille, votre avis est bien envoyé. Julie le lira très vite. »
- Erreur : « Cette photo dépasse 10 Mo. Choisissez une image plus légère. »
- État vide : « Pas encore de témoignage. Envoyez votre lien à vos clients, ou connectez l'outil où vous vendez pour qu'une demande parte après chaque vente. »
- Page de collecte (v2, sans durée) : « Julie Nutrition lira chaque mot. Une note et quelques mots suffisent. »
- E-mail : objet « Camille, votre avis sur Programme 30 jours ? » — bouton « Donner mon avis »
- Confirmation : « Masquer l'avis de Nadia B. ? Il n'apparaîtra plus sur vos pages. Vous pourrez l'afficher à nouveau à tout moment. » — boutons « Masquer l'avis » / « Annuler »
- Connecteurs : « Fonctionne avec l'outil où vous vendez » ; outils à venir : « Bientôt », sans date, puis « En attendant : avec Zapier ou Make ».

Libellés figés dans tous les écrans : « Créer mon espace gratuit » · « Demander un avis » · « Envoyer mon avis » · « Donner mon avis » · « Valider » · « Masquer » · « Copier le code » · « Connecter mon outil » · « Vérifier la connexion » · « Me prévenir » · statuts « En attente », « Validé », « Masqué ».

## Annexe — tracés des icônes v2
Chaque entrée est une liste de tracés SVG dessinés avec fill="none", stroke="currentColor", stroke-width="2", stroke-linecap="round", stroke-linejoin="round", viewBox="0 0 24 24". Remplace `src/components/ui/icon-paths.ts` sans changer les noms.

```ts
export const STAR_PATH = "M12 2.8l2.8 5.7 6.3.9-4.55 4.43 1.07 6.27L12 17.1l-5.62 2.95 1.07-6.27L2.9 9.4l6.3-.9z";

export const ICON_PATHS = {
  alert: ["M10.27 5a2 2 0 0 1 3.46 0l7.2 12.5a2 2 0 0 1-1.73 3H4.8a2 2 0 0 1-1.73-3z", "M12 10v4", "M12 17.2v.1"],
  valid: ["M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M8 12.5l2.8 2.8L16 10"],
  clock: ["M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M12 7v5l3 2"],
  cancelled: ["M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M9 9l6 6", "M15 9l-6 6"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  replay: ["M20 12a8 8 0 1 1-2.34-5.66L20 8.6", "M20 4v4.6h-4.6"],
  photo: ["M4 9a2 2 0 0 1 2-2h1.5l1.4-2.1A2 2 0 0 1 10.6 4h2.8a2 2 0 0 1 1.7.9L16.5 7H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z", "M8.5 12.5a3.5 3.5 0 1 0 7.0 0a3.5 3.5 0 1 0 -7.0 0"],
  email: ["M6 5h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z", "M4 7.5l8 6 8-6"],
  copy: ["M11 8h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z", "M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"],
  connection: ["M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1", "M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"],
  share: ["M12 4v11", "M8 8l4-4 4 4", "M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"],
  home: ["M4 10.6l8-6.6 8 6.6V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"],
  quote: ["M7 5h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9.5L5 19.5V8a3 3 0 0 1 2-3z"],
  tag: ["M3.5 11.6V5.5a2 2 0 0 1 2-2h6.1l9 9a2 2 0 0 1 0 2.8l-5.3 5.3a2 2 0 0 1-2.8 0z", "M6.5 8a1.5 1.5 0 1 0 3.0 0a1.5 1.5 0 1 0 -3.0 0"],
  grid: ["M6 4h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M15 4h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M6 13h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z", "M15 13h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z"],
  mail: ["M6 5h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z", "M4 7.5l8 6 8-6"],
  sliders: ["M4 7h9M19 7h1M4 17h3M13 17h7", "M13.5 7a2.5 2.5 0 1 0 5.0 0a2.5 2.5 0 1 0 -5.0 0", "M7.5 17a2.5 2.5 0 1 0 5.0 0a2.5 2.5 0 1 0 -5.0 0"],
  more: ["M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"],
  user: ["M8 8a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", "M4.5 20c.6-3.6 3.7-6 7.5-6s6.9 2.4 7.5 6"],
  card: ["M6 5.5h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3z", "M3 10h18", "M7 14.5h3"],
  help: ["M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6", "M12 17.2v.1"],
  logout: ["M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7", "M10 12h10", "M17 9l3 3-3 3"],
  chevronDown: ["M6 9l6 6 6-6"],
  chevronRight: ["M9 6l6 6-6 6"],
  chevronLeft: ["M15 6l-6 6 6 6"],
  bookmark: ["M8 3h8a2 2 0 0 1 2 2v16l-6-5-6 5V5a2 2 0 0 1 2-2z"],
  search: ["M4.5 11a6.5 6.5 0 1 0 13.0 0a6.5 6.5 0 1 0 -13.0 0", "M16 16l4.5 4.5"],
  plus: ["M12 5v14", "M5 12h14"],
  info: ["M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M12 11v6", "M12 7.2v.1"],
  hidden: ["M3.5 12s3-6 8.5-6 8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6z", "M9.5 12a2.5 2.5 0 1 0 5.0 0a2.5 2.5 0 1 0 -5.0 0", "M4 4l16 16"],
  upload: ["M12 15V4", "M8 8l4-4 4 4", "M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"],
  download: ["M12 4v11", "M8 11l4 4 4-4", "M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"],
  wall: ["M5.5 4h3.5a1.5 1.5 0 0 1 1.5 1.5V12a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 12V5.5A1.5 1.5 0 0 1 5.5 4z", "M15 4h3.5A1.5 1.5 0 0 1 20 5.5V7a1.5 1.5 0 0 1-1.5 1.5H15A1.5 1.5 0 0 1 13.5 7V5.5A1.5 1.5 0 0 1 15 4z", "M5.5 16.5h3.5a1.5 1.5 0 0 1 1.5 1.5v.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18.5V18a1.5 1.5 0 0 1 1.5-1.5z", "M15 11.5h3.5a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-1.5 1.5H15a1.5 1.5 0 0 1-1.5-1.5V13a1.5 1.5 0 0 1 1.5-1.5z"],
  carousel: ["M8.5 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z", "M3.5 8v8", "M20.5 8v8"],
  badge: ["M7 8h10a3.5 3.5 0 0 1 0 7H7a3.5 3.5 0 0 1 0-7z", "M6.5 11.5a1.5 1.5 0 1 0 3.0 0a1.5 1.5 0 1 0 -3.0 0"],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  bag: ["M5.6 8h12.8a1 1 0 0 1 1 1.1l-.9 10a1 1 0 0 1-1 .9H6.5a1 1 0 0 1-1-.9l-.9-10a1 1 0 0 1 1-1.1z", "M9 10V7a3 3 0 0 1 6 0v3"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  gift: ["M5 11h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z", "M4 7h16v4H4z", "M12 7v14", "M12 7C10.5 4 7 3.6 7 5.6 7 7 9.5 7 12 7z", "M12 7c1.5-3 5-3.4 5-1.4 0 1.4-2.5 1.4-5 1.4z"],
  pause: ["M9 6v12", "M15 6v12"],
  external: ["M14 5h5v5", "M19 5l-8 8", "M17 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4"],
  file: ["M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M14 3v5h5"],
  monitor: ["M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z", "M9 21h6", "M12 17v4"],
  phone: ["M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M11 18h2"],
} as const;
```

## Ajouts 3.4 (espace du créateur)
**Badges d'une demande** — même gabarit que les badges de statut. Planifiée : Encre sur Ciel, horloge. Envoyée : Encre, contour Encre 2 px, enveloppe. Relancée : Encre, contour Encre 2 px, rejouer. Complétée : Pousse sur Pousse fond, coche cerclée. Annulée : Gris sur Gris clair, annulé. Échec : Erreur sur Erreur fond, alerte.
**Ligne d'événement** (connecteur, historique) — aplat Blanc, radius-card, padding 16 20 ; pastille 40 teintée selon le ton (Pousse fond, Attente fond, Gris clair, Erreur fond) avec icône 20 ; libellé 700 + « · offre · client » 16/24 ; détail 15/22 Gris (Erreur si échec, Attente 700 si vente gardée de côté) ; heure 15/22 Gris à droite (sous le détail au téléphone) ; « Rejouer » secondaire compact.
**Provenance** — pastille 40 Ciel avec icône (connection, mail, quote, upload, share), libellé 17/26 700 (« Vente reçue · Systeme.io », « Demande manuelle », « Ajout », « Import », « Lien public »), détail 15/22, puis « Dans vos widgets : … » 15/22 Gris.
**Choix exclusif** (motif de masquage) — rond 24, bord 2 px Gris ; choisi : bord Encre et point Encre 12 ; ligne de 44 au moins, libellé 17/26 ; erreur : bord Erreur et message au-dessus des choix.
**Texte affiché et correction** — texte en aplat Nuage, radius-field, padding 16 18, citation 19/28 ; correction proposée sur Ciel, avec son étiquette 14/20 700 Gris ; passage choisi : surligné Soleil, contour Encre 2 px ; passage masqué : pilule Gris clair, texte Gris 700 (« coordonnée masquée », « nom masqué »).
**Note de planche** (canvas seulement) — fond Attente fond, « Note de la v2 » 15/22 700 Attente, titre Bricolage 24, liste 16/24.
**Étapes d'un formulaire** (démarrage, import) — « Étape 1 sur 2 · Votre espace » 15/22 700, puis segments de 8 px, radius-full, Encre jusqu'à l'étape courante, Gris clair ensuite.

## Ajouts 3.5 (site public)
**Section de site** — pleine largeur, fond Blanc, Nuage ou Ciel en alternance, padding 96 80 (ordinateur) / 48 20 (téléphone), jamais de filet entre deux sections. Contenu dans 1280 px.
**Titres du site** — grand titre Bricolage 800, 72/72 (ordinateur) et 40/40 (téléphone), interlettrage −0,04 em ; titre de page 52 à 64 ; titre de section Bricolage 800 44/48 (ordinateur), 30/33 (téléphone), interlettrage −0,03 em, 28 caractères au plus par ligne.
**Appel principal** — bouton primaire Soleil 56, toujours suivi de « Gratuit, sans carte bancaire. » 15/22 Gris ; pleine largeur au téléphone, ligne centrée dessous.
**Colonne de prix** — aplat Blanc, radius 24, padding 32 28 ; Essentiel en Ciel avec « Recommandé » 15/20 700 ; nom Bricolage 30 ; prix Bricolage 800 60/60 et période 15 Gris ; ligne de lancement 15/22 Gris dans un emplacement de 44 (vide sur les autres plans à l'ordinateur) ; phrase 17/26 ; bouton ; coches Pousse 20. Au téléphone, la liste passe avant le bouton.
**Comparatif** — lignes en bandes Blanc de 6 px d'écart sur Nuage, coins 14 aux extrémités, colonne Essentiel en Ciel ; libellé 17/24 600 sur 41 % ; titres de groupe 15/22 700 Gris ; « Inclus » = coche Pousse 22. Téléphone : sélecteur Gratuit, Essentiel, Pro et une valeur à droite, en gras.
**Questions** — chaque question est une bande arrondie de 56 au moins (Blanc sur Nuage, ou Nuage sur Blanc), question 17/26 700, chevron qui pivote ; une seule ouverte, la première au chargement ; titre à gauche sur 400 px à l'ordinateur.
**Lecture** (guides, pages légales, À propos de ces avis) — article en aplat Blanc, radius 24, padding 40 48, 760 px au plus, texte 17/27, 68 caractères ; titres Bricolage 30/34 ; sommaire collant à droite (320 px, aplat Blanc), titre en cours sur pilule Ciel 700 ; au téléphone, sommaire replié de 56 px sous l'en-tête de page, sans titre en cours.
**Brouillon et champs à compléter** — bandeau Attente (horloge) « Brouillon en cours de relecture » ; champ « [À COMPLÉTER : …] » surligné Attente fond, texte Attente 700, radius 4, répété ligne par ligne.
**Ligne de guide** — bande Blanc (ou Nuage sur Blanc), radius 20, titre Bricolage 22/28, résumé 17/26, « Mis à jour le … · N minutes de lecture » 14/20 Gris, chevron 20.
**Barre fixe du téléphone** — fond Blanc, ombre vers le haut, padding 10 16 14 ; « Gratuit, sans carte bancaire » 14/20 600 centré, bouton Soleil 48 pleine largeur ; hauteur 98, la page garde 98 px de marge en bas.
**Menu du téléphone** — panneau Blanc sous l'en-tête, coins bas 28 ; liens Bricolage 22 sur des lignes de 56, page en cours sur Ciel ; appel principal pleine largeur ; voile Encre à 48 %.
**Démo à manipuler** — formulaire en aplat Blanc (note, avis, prénom facultatif, « Envoyer mon avis ») à côté d'un mur de démonstration ; l'avis arrivé porte un liseré Soleil 2 px ; « Exemple, avis fictifs » sous le mur.
**Pages introuvable et erreur** — en-tête réduit au logo ; carte Blanc 720 sur Nuage, pictogramme 32 dans un rond Ciel 72, titre, texte 20/30, action primaire et lien.
**Images de partage** — 1200 × 630 ; à gauche sur Blanc, logo 48, titre Bricolage 800 72 (60 au-delà de 48 caractères), promesse Figtree 28/36 Gris ; à droite, colonne Soleil de 360 avec le symbole en Encre (seul, « avec » l'initiale de l'outil, ou avec « Guide »). Ni dégradé ni filet.
**Typographie française** — espace insécable avant « : ; ? ! », à l'intérieur des guillemets, avant « € » et « % » ; « e-mail » ne se coupe pas.

## Ajouts 3.6 (collecte, e-mails, widget)
**Page de collecte** — identité du créateur seulement : logo 44 en rond et nom 17/26 700 en tête, sur une teinte de son accent (accent à 9 % sur Blanc) ; carte Blanc radius 24, padding 48 56, colonne de 640 (ordinateur) ; au téléphone, bande teintée en tête et page Blanc. Police d'interface Figtree (titres 800, 32/38, 26/32 au téléphone, −0,01 em) ; pas de Bricolage. Étoiles 46 (42 au téléphone) dans des cibles de 56, pleines en accent (fond et contour) si 3:1 sur Blanc, sinon Encre ; sans accent, Soleil contour Encre. Bouton « Envoyer mon avis » : seul bouton plein, 60, radius-full, accent, texte Blanc si 4,5:1 sinon Encre. Photo : rond de 72, bord 2 px tireté Gris (Erreur en cas d'erreur), portrait recadré une fois choisie. Consentement sur #F2F4F8 (Erreur fond et bord 2 px Erreur si manquant). Mention de contrepartie : aplat #F2F4F8, icône gift 20, 15/22. « Propulsé par PULSACITY » 12/16 Gris, centré sous la carte.
**Widget, ajouts** — ligne « Avis du {date}, achat en {mois} » 13/18 secondaire, sous le titre (deux morceaux insécables, coupure à la virgule) ; sous le mur et le carrousel : « Sélection de {espace} : avis mis en avant, puis les plus récents. », la contrepartie s'il y a lieu, puis « À propos de ces avis » 13/18 600 souligné, couleur du texte de la page ; « Propulsé par » à droite (large) ou dessous, centré (étroit). Badge : « À propos de ces avis » 12/16 et « Propulsé par » à côté de la pilule (dessous si la page est centrée). Cartes claires Blanc quand le fond de la page est déjà teinté (écart de luminance < 0,06 avec #F2F4F8). Mention bêta-testeur 13/18 secondaire sous l'auteur.
**E-mails, ajouts** — planche à 600 px dans 680 ; en-tête client : logo du créateur 44 et nom ; bouton client en accent ; deux actions (accord de correction) : principale en accent, secondaire bordée Encre 2 px ; versions côte à côte sur Nuage, radius 16, étiquette 13/18 700 Gris, passage changé en gras souligné. E-mails au créateur : symbole 24 et « PULSACITY » ; liste d'étapes de l'accueil sur Nuage, pastille 24 numérotée (Gris) ou cochée (Pousse sur Pousse fond). Pied : 13/18 Gris, raison, désinscription, mention et adresse postale.
**Image de partage d'un témoignage** — 1080 × 1350 et 1200 × 630, fond = accent du créateur (texte Blanc si 4,5:1) ou fond de sa page sombre ; logo et nom en tête, étoiles 64 (40 en paysage), citation Figtree 600 66/84 (56/72 au-delà de 100 caractères ; 40/52 en paysage), nom, titre, date de l'avis et mois de l'achat, contrepartie s'il y a lieu, « Propulsé par » discret en bas à droite. Ni dégradé ni filet.
