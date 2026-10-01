---
name: reviewing-levels-prompts
description: Auditer, creer ou versionner un prompt editorial de Levels dont la sortie est visible par le lecteur. Utiliser aussi pour juger une sortie reelle, une regression de ton, une attribution de locuteur ou une couverture insuffisante.
---

# Reviewing Levels Prompts

## Références obligatoires

Lire, dans cet ordre :

1. `docs/foundations/charte-des-prompts-editoriaux.md` ;
2. la section de `docs/direction/11-ninon-2027-le-decodeur.md` qui décrit la
   posture de Presi ;
3. le prompt, son schéma, ses gardes déterministes et sa surface de rendu ;
4. au moins une sortie réelle du module.

## Méthode

1. Nommer la fonction lecteur de chaque champ. Refuser tout champ sans usage
   visible ou aval explicite.
2. Tracer les entrées d'autorité : transcription, noms, fonctions, faits,
   sources et sorties précédentes. Ne pas laisser le modèle combler une
   identité absente.
3. Auditer la sortie réelle : personnes nommées, fonctions justes, français de
   table, phrases courtes, posture didactique, fidélité, couverture de toute la
   matière et absence de répétition entre champs.
4. Distinguer le défaut du prompt, du schéma, de la garde, de
   l'orchestration et du rendu. Ne pas corriger une dépendance ou un état UI
   avec davantage de texte dans le prompt.
5. Proposer une nouvelle version immuable. Ne jamais modifier le texte d'une
   version déjà servie.
6. Comparer avant/après sur un Corpus court et un Corpus long à plusieurs
   voix. Mesurer séparément qualité, latence, coût, reprises et rejets.
7. Lire le résultat dans la vraie surface. Un JSON valide et un test de schéma
   ne constituent pas une validation produit.
8. Mettre à jour `docs/pipeline.md` et la matrice des versions dans le même
   changement.

## Compte rendu

Rendre quatre blocs courts : `PASS`, `FAIL`, `NOT RUN`, `BLOCKED`. Pour chaque
échec, donner un exemple réel, la couche responsable et le plus petit prochain
test. Ne pas déployer, resemer ou rejouer une vidéo sans autorisation explicite.
