# Main, caméra et défilement

## Dessin et alignement

Reprendre la main actuelle de `invitation-retournement.tsx`, plutôt que redessiner une main ou employer un emoji. Dans le pilote, l’asset est `assets/main-onboarding.svg`, viewBox `0 0 42 52`, papier #FFF6EC et contour #191713. Vérifier les tokens actuels si la marque change.

Le bout du doigt est vers (17,4), soit 40,5 % de la largeur et 7,7 % de la hauteur. Placer ce point sur la cible : un centrage à 50 % vise avec la paume. Une taille 126 × 156 px convient au rendu 1080 × 1920 ; adapter si elle masque le contrôle.

## Mouvement réutilisable

Créer une fonction de timeline qui reçoit élément, début, instant d’appui et durée. Dans la V3 :
- approche : translation de 38 px à 0, rotation de 8° à 0, opacité de 0 à 1 sur 0,45 s ;
- arrêt sur le contrôle jusqu’à l’appui ;
- pression : 9 px et échelle 0,95 sur 0,16 s, achevées à l’appui ;
- retour : 0 px et échelle 1 sur 0,18 s ;
- retrait : 25 px et fondu sur 0,24 s.

Ce sont des points de départ issus d’une itération reçue positivement, pas des constantes produit. Éviter le tremblement ou le rebond systématique. Garder les mouvements sur la timeline GSAP arrêtée, donc reproductibles au seek ; séparer wrapper caméra et main. Mettre les attributs temporels sur le clip et les transformations de main sur son enfant. Un SVG inline évite la découverte répétée de quatre balises img identiques par le compilateur.

## Grammaire de caméra

La caméra se rapproche, laisse voir le contrôle, puis revient d’un coup au cadre complet à l’appui. Ne pas dézoomer pendant le nouvel écran. Caler l’appui sur la vraie prise à cadence constante.

Dans la V3 : Pause et Partager ×1,6 ; Presi dans la feuille ×1,5, montée de zoom en 0,9 s. La feuille est entière et au repos avant ce mouvement. Aucun zoom pour le retournement de la grande carte. Garder les bords de la capture dans le cadre ; un centrage exact sur une cible basse ne doit pas produire un bord vide.

## Fin avec défilement

Après le retournement, arrêter la main d’appui et laisser lire le haut. Capturer ensuite un vrai glissement vers le haut dans l’application pour descendre dans l’analyse. Une main peut accompagner le trajet, doigt près du texte et hors des mots importants.

Ne montrer ce guide que si le mouvement aide à comprendre l’action. Synchroniser son déplacement avec le début du défilement réel, puis le retirer au repos. Éviter un zoom simultané. Laisser le bas stable et lisible après le glissement. Ajuster la distance à la carte réelle ; les coordonnées d’un autre écran ne sont pas un scénario réutilisable.

Contrôler avant/après glissement et les images intermédiaires pour exclure saut, mauvais sens, défilement interrompu ou contenu encore coupé. Un arrêt final doit montrer ce que le lecteur était censé découvrir.
