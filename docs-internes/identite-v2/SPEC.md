# PULSACITY — Identité v2 : spécification d'implémentation

Destinataire : Claude Code. Émetteur : Design. Statut : direction validée par Design, à implémenter telle quelle.

**Règle générale : n'ajoute aucune fusée et aucune animation au-delà de ce document.** Si un cas n'est pas prévu ici, ne fais rien et signale-le à Design.

Référence visuelle : canvas PULSACITY, page « Identité v2 » (planches 1 à 7). Les exports PNG sont dans `docs-internes/maquettes/`, fichiers `c0-charte-06` à `c0-charte-12`.

---

## 1. Concept (ne pas réinterpréter)

- **Le symbole** : une fusée droite, en Encre, portée par une étoile en Carmin. L'étoile remplace la flamme. Sa pointe haute s'engage dans une encoche à la base de la fusée, séparée d'elle par un vide constant.
- **Le récit** : les avis (les étoiles) font décoller l'activité (la fusée).
- **Le reste de l'identité ne change pas** : palette, typographies (Newsreader, Public Sans), échelle de tailles, espacements, rayons, ombres, composants et ton de voix restent ceux de `charte.md`. Seules les parties « Logo » et « Favicon » de la charte sont remplacées par ce document.

## 2. Assets fournis

N'utilise que les fichiers de `assets/`. Ne redessine rien, ne modifie aucun tracé, ne ré-exporte rien.

| Fichier | Usage |
| --- | --- |
| `svg/pulsacity-logo.svg` | Logo horizontal clair. Symbole normal, texte vectorisé. Pour une hauteur affichée de 32 px ou plus. |
| `svg/pulsacity-logo-sombre.svg` | Idem, sur fond Encre. |
| `svg/pulsacity-logo-petit.svg` | Logo horizontal clair avec le symbole petit format. Pour une hauteur affichée de moins de 32 px. |
| `svg/pulsacity-logo-petit-sombre.svg` | Idem, sur fond Encre. |
| `svg/pulsacity-logo-compact.svg`, `-sombre` | Symbole au-dessus du texte. Formats carrés uniquement (avatar social, impression). Non utilisé dans l'application. |
| `svg/pulsacity-symbole.svg`, `-sombre` | Symbole normal, à partir de 32 px. |
| `svg/pulsacity-symbole-petit.svg`, `-petit-sombre` | Symbole petit format (sans hublot), de 16 à 31 px. |
| `svg/pulsacity-symbole-mono.svg`, `-petit-mono` | Symbole monochrome en `currentColor`, pour les mentions « Propulsé par ». |
| `svg/pulsacity-wordmark.svg`, `-sombre` | Wordmark seul (logo v1, avec l'étoile du ı). |
| `svg/favicon.svg`, `favicon.ico`, `png/favicon-16/32/48.png` | Favicon. Le 16 px est dessiné au pixel : ne le remplace pas par une réduction du SVG. |
| `png/apple-touch-icon.png` (180), `png/icon-192.png`, `png/icon-512.png`, `png/icon-maskable-512.png` | Icônes d'application. |
| `png/email-symbole-48.png` | Symbole pour les e-mails, affiché à 24 × 24 px. |
| `code/pulsacity-motion.css` | Jetons de mouvement, keyframes et réduction du mouvement. |
| `code/head-favicons.html`, `code/site.webmanifest` | Balises `<head>` et manifeste. |

**Note technique.** Les SVG utilisent un `<mask>` pour l'encoche et le hublot.
- Pour un affichage statique, utilise-les en `<img>` : c'est le cas par défaut.
- Si tu les intègres en ligne (cas du symbole animé), donne à chaque instance un identifiant de masque unique, sinon deux instances se masquent mutuellement.
- Les classes `pz-fusee` (groupe de la fusée) et `pz-etoile` (étoile) doivent être conservées : ce sont elles que les animations ciblent.

## 3. Choisir la bonne variante

Applique cet ordre, sans exception :

1. **Écran de l'espace, hors navigation**, et tout composant (bouton, carte, menu, tableau, formulaire, badge, onglet, toast) : **aucun symbole.**
2. **Barre de navigation ou en-tête** : **logo horizontal**.
   - Hauteur affichée de 32 px ou plus : `pulsacity-logo(-sombre).svg`.
   - Moins de 32 px : `pulsacity-logo-petit(-sombre).svg`.
3. **Place très réduite, ou marque déjà nommée juste à côté** (favicon, mention « Propulsé par ») : **symbole seul**.
   - À partir de 32 px : version normale.
   - Moins de 32 px : `-petit`.
4. **Documents, pied de page légal, ou écran où le symbole est déjà visible** : **wordmark seul**.
5. **Fond** : fond Encre, utilise `-sombre`. Tout autre fond (Blanc, Papier) : utilise la version claire. Aucune autre couleur de fond n'accueille le logo.

Tailles minimales :
- logo horizontal : 21 px de haut (texte de 16 px) ;
- symbole : 16 px ;
- wordmark : 16 px de haut.

Zone de protection : un vide égal à 0,4 × la hauteur du symbole sur les quatre côtés.

## 4. Où remplacer le logo

| Endroit | Aujourd'hui | Remplacer par | Hauteur affichée |
| --- | --- | --- | --- |
| Navigation desktop de l'espace (composant `EspaceNav`, haut de la barre) | Wordmark 28 px | `pulsacity-logo-petit.svg` | 27 px |
| En-tête mobile de l'espace | Wordmark 22 px | `pulsacity-logo-petit.svg` | 24 px |
| En-têtes publics desktop : accueil, tarifs, inscription, connexion, onboarding, pages d'erreur | Wordmark 28 px | `pulsacity-logo.svg` | 32 px |
| En-têtes publics mobiles, mêmes pages | Wordmark 22 px | `pulsacity-logo-petit.svg` | 24 px |
| Pied de page du site (fond Encre, s'il existe) | Wordmark | `pulsacity-logo-sombre.svg` | 32 px |
| En-tête des e-mails : demande, relance, lien de connexion, nouveau témoignage | Texte « Pulsacity » en Georgia | `email-symbole-48.png` à 24 × 24 px, `alt=""`, suivi du texte « Pulsacity » en Georgia 20 px gras, espace de 8 px | 24 px |
| Mention « Propulsé par » : pied de la page de collecte, badge des widgets | « Propulsé par » + « Pulsacity » en Newsreader | « Propulsé par » + `pulsacity-symbole-petit-mono.svg` + « Pulsacity ». Le symbole prend la couleur du texte de la mention (`currentColor`), espace de 4 px | 14 px (12 px au minimum) |
| Favicon et icônes d'application | « P » sur Encre | Fichiers du tableau 2, balises de `code/head-favicons.html` | — |

Accessibilité :
- Un logo qui sert de lien : `aria-label="Pulsacity, accueil"` sur le lien, `alt=""` sur l'image.
- Un logo seul : `alt="Pulsacity"`.
- Un symbole placé à côté du texte « Pulsacity » : décoratif, `alt=""` ou `aria-hidden="true"`.

## 5. Les seuls moments de marque dans le produit

| Moment | Contenu | Symbole | Animation |
| --- | --- | --- | --- |
| Ouverture de l'espace après le lien de connexion, si l'attente dépasse 1 s | Symbole centré, texte « Ouverture de votre espace… » en 16 px gras, puis « Cela prend quelques secondes la première fois. » en 14 px Ardoise | `pulsacity-symbole.svg`, 48 px | Attente |
| État vide « Premier jour » (tableau de bord sans témoignage) | Symbole au-dessus du titre « Pas encore de témoignage », aligné à gauche, 16 px d'écart | `pulsacity-symbole.svg`, 48 px | Décollage, une seule fois (voir 6.3) |
| Premier témoignage validé | Bandeau de succès existant « Votre premier témoignage est en ligne. », le symbole remplace l'icône | `pulsacity-symbole-petit.svg`, 24 px | Décollage, une seule fois (voir 6.3) |

Aucun autre état vide, écran ou composant ne reçoit le symbole.

## 6. Micro-animations

Il y en a quatre, exactement. Les classes, keyframes et jetons sont dans `code/pulsacity-motion.css`.

Principes :
- On anime seulement `transform` et `opacity`, rien qui décale la mise en page.
- Au plus une animation de marque par écran.
- La règle de la charte « pas d'animation d'apparition » reste en vigueur : aucun fondu ni glissement au chargement des pages, cartes ou listes.
- `prefers-reduced-motion: reduce` est toujours respecté, avec la version décrite pour chaque animation.
- Les transitions de couleur au survol et au focus restent à 120 ms. Ce ne sont pas des animations.

### 6.1 Étoile choisie
- **Composant** : sélecteur de note de la page de collecte, et lui seul.
- **Déclencheur** : choix d'une note (toucher, clic, clavier).
- **Mouvement** : l'étoile choisie passe de l'échelle 1 à 1,18 puis revient à 1, en 200 ms, courbe standard. Les étoiles précédentes se remplissent sans délai ni cascade.
- **Implémentation** : ajouter la classe `is-choisie` sur le bouton de l'étoile choisie. Pour rejouer l'animation, retirer puis remettre la classe.
- **Mouvement réduit** : remplissage seul.

### 6.2 Attente
- **Composant** : nouveau composant `ChargementMarque` (symbole 48 px et texte obligatoire). Conteneur `.pz-chargement`, `role="status"`.
- **Où** : ouverture de l'espace après le lien de connexion, premier import des ventes Systeme.io, première génération d'un widget.
- **Déclencheur** : l'attente dépasse 1 s. Avant 1 s, rien ne s'affiche. Le composant disparaît sans animation.
- **Mouvement** : l'étoile seule respire (opacité 1 → 0,55 → 1, échelle 1 → 0,9 → 1), 1 400 ms en boucle. La fusée ne bouge pas.
- **Mouvement réduit** : symbole statique, texte inchangé.
- **Jamais** dans un bouton, une liste, une carte ou un tableau. Ceux-là gardent leur état de chargement actuel : le bouton « Envoi… » désactivé et le squelette du mur de widgets.

### 6.3 Décollage
- **Composants** : le symbole de l'état « Premier jour », et le bandeau de succès « Votre premier témoignage est en ligne. » (bandeau `succes` existant, avec le symbole petit format 24 px à la place de l'icône).
- **Déclencheur** : une seule fois par compte et par moment.
  - Première arrivée dans l'espace après l'onboarding.
  - Premier témoignage validé.
  - Mémorise côté serveur que chaque moment a déjà eu lieu. L'animation n'est jamais rejouée, ni au rechargement ni sur un autre appareil.
- **Mouvement** : 640 ms, courbe décollage.
  - Fusée : translation verticale 0 → +0,6 → −3 → 0 unité de grille.
  - Étoile : échelle 1 → 0,9 → 1,14 → 1, avec l'origine à sa pointe haute.
  - Tout revient à sa place.
- **Implémentation** : ajouter la classe `.pz-decollage` sur le conteneur du symbole intégré en ligne.
- **Mouvement réduit** : aucun mouvement.

### 6.4 Témoignage validé
- **Composant** : badge de statut, dans la liste et dans le détail d'un témoignage.
- **Déclencheur** : clic sur « Valider ».
- **Mouvement** : le badge passe d'« En attente » à « Validé ». Ses couleurs changent en 200 ms. La coche (second tracé de l'icône, classe `pz-coche`) se trace en 240 ms. La ligne ne bouge pas.
- **Mouvement réduit** : changement immédiat.
- **Pas de fusée.**

### Animations écartées : ne pas implémenter
- Mouvement du logo au survol.
- Fondu ou cascade à l'apparition des pages, cartes et listes.
- Compteurs animés du tableau de bord.
- Confettis, étoiles qui tombent, fusée qui traverse l'écran.
- Fusée dans un bouton pendant un envoi.

## 7. Ce qui ne change pas

- Toute la charte hors logo et favicon : couleurs, typographies, tailles, espacements, rayons, ombres, focus, ton de voix.
- Tous les composants : boutons, champs, cases, badges, bandeaux, cartes, menus, tableaux, onglets, navigation (hors logo), barre d'onglets mobile.
- Tout le contenu de l'espace :
  - tableau de bord (hors état « Premier jour »), liste, détail, demandes ;
  - offres, widgets, connecteurs, éditeur de widget, réglages.
- La page de collecte, qui reste aux couleurs du créateur. Seule la mention du bas change.
- Les widgets (hors mention « Propulsé par »), la page d'accueil et la page tarifs (hors en-tête).
- La bibliothèque d'icônes : **aucune icône « fusée » n'y entre.** Le symbole n'est pas une icône.

## 8. Interdits

- Incliner, étirer, recolorer ou redessiner le symbole.
- Séparer l'étoile de la fusée, ou combler le vide entre elles.
- Ajouter une flamme, de la fumée ou une traînée.
- Mettre le symbole dans un bouton, une puce, une icône de liste, un état de chargement de composant ou un toast (seule exception : le bandeau décrit en 6.3).
- Utiliser l'émoji 🚀 dans un texte, un e-mail ou une notification.
- Afficher deux symboles en grand sur le même écran.
- Placer le symbole sur un fond qui n'est ni Blanc, ni Papier, ni Encre (sauf la version monochrome des mentions « Propulsé par »).

## 9. Critères d'acceptation

- [ ] Les huit endroits du tableau 4 affichent la bonne variante, à la bonne hauteur.
- [ ] Aucune autre occurrence du symbole dans le code : il n'apparaît que dans les en-têtes, les e-mails, les mentions « Propulsé par », les favicons et les trois moments du tableau 5.
- [ ] Le favicon 16 px est le PNG dessiné au pixel.
- [ ] Les e-mails restent lisibles avec les images bloquées : le texte « Pulsacity » reste visible.
- [ ] Les quatre animations respectent les durées et les déclencheurs ci-dessus. Aucune autre animation n'a été ajoutée.
- [ ] Avec `prefers-reduced-motion: reduce`, aucune ne bouge.
- [ ] Le décollage ne se joue qu'une fois par compte et par moment, même après un rechargement.
- [ ] Aucun composant existant n'a changé de style.
