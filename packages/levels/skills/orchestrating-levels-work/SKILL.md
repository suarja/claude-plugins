---
name: orchestrating-levels-work
description: Préserver l'objectif humain, la simplicité du moteur et la réception des résultats de Levels et Presi. Use when resuming a mandate, comparing solutions, delegating or reviewing work, or changing an editorial recipe or pipeline.
---

# Travail sur Levels et Presi

## Mandat et reprise

Charge ce skill au début d'un mandat concerné et transmets-le aux agents.
Il fixe le comportement stable. docs/chantier.md contient les décisions et
autorisations courantes. Les benchmarks conservent les preuves.
Un skill présent sur disque peut ne pas avoir été lu ou suivi.

À la reprise, retrouve l'objectif humain, le périmètre approuvé, les décisions
retirées et la prochaine preuve dans l'état court du projet et les pièces utiles.
Vérifie le code et Git au point concerné. Évite de relire tous les documents
ou de recopier les historiques. Une archive n'autorise aucun travail.

Avant une nouvelle implémentation, présente l'état, le petit résultat visible
attendu, les exclusions et la preuve prévue. Obtiens l'accord du propriétaire
sur ce périmètre. Poursuis ensuite les étapes nécessaires jusqu'au rapport final.
Décide des détails techniques ordinaires. Fais arbitrer les changements de
produit, de couverture, de copie ou de direction visuelle par le propriétaire.
Explique pourquoi une question est nécessaire, d'où elle vient et ce que la
réponse change. Intègre les nouveaux messages humains au mandat sans improviser
un changement de direction.

## Petites slices testables

Choisis la plus petite slice verticale qui livre un comportement utile et
testable de bout en bout dans l'interface. Avant de commencer, fixe une entrée
précise, un résultat observable, un test court pour le propriétaire et un échec
pertinent à vérifier. Raccorde les données, la persistance, le traitement et le
rendu réels selon le besoin. Ne construis pas des couches backend entières avant
de pouvoir essayer l'écran. N'anticipe pas les prochaines slices avec une
architecture générique. Une petite slice conserve la promesse finale du produit.

À chaque slice, livre le lien ou parcours à essayer et la preuve obtenue.
Propose sa réception au propriétaire. Intègre son retour avant d'étendre lorsque
son jugement conditionne la suite. Travaille de façon autonome à l'intérieur de
la slice sans demander un accord pour chaque détail technique.

## Choisir une solution simple

Garde l'objectif humain pendant l'audit, la délégation et la reprise.
La présence du code ne suffit pas à justifier un petit correctif.
Une objection ne suffit pas à réduire la promesse du produit.
L'échec d'une implémentation ne prouve pas que le produit est impossible.
Compare ta recommandation à une approche plus simple. Donne les gains, pertes,
effets pour le lecteur, coût, délai et complexité. Sépare preuves, hypothèses
et décision attendue. Signale les estimations.

Conserve un seul pipeline dans la codebase. Vise nettement sous 10 000 lignes
physiques pour le système éditorial complet. Compte source, prompts, auxiliaires,
instrumentation et tests séparément, puis donne le total.
Ne déplace pas le code hors du comptage. N'utilise ni compression ni minification
pour atteindre la cible. Retire les compatibilités sans besoin réel.
Chaque ligne doit servir un besoin actuel que tu peux justifier.
Utilise les capacités natives utiles et les mécanismes existants avant d'ajouter
un framework de coordination. Vérifie le fonctionnement de bout en bout.
Conserve la provenance, les diagnostics utiles et la matière à traiter.

## Quatre contrôles sur le résultat

- Retrouve ce qu'une source établit, les extraits qui le montrent, leur portée,
  leurs réserves et les questions ouvertes. Vérifie ces conclusions dans la
  mémoire transmise. Un historique de lectures ou de déplacements ne suffit pas.
- Compare la matière avant sélection, après fusion et dans la sortie.
  Transmets et restitue les passages fusionnés, choix politiques, auteur, sens,
  négation et incertitudes. Donne une raison explicite pour chaque omission.
- Lis les vraies sorties avec leurs sources dans l'interface utilisée.
  Vérifie fidélité, couverture et qualité de l'explication. Tests verts,
  publication et durée satisfaisante ne prouvent pas ces qualités.
- Écris l'hypothèse et les changements précis avant l'essai. Isole les paramètres
  de calibration. Juge une refonte qui change plusieurs facteurs dans son
  ensemble. N'attribue pas son résultat à un modèle sans comparaison qui l'isole.

## Recette, résultats et évaluation

Garde les prompts et réglages agents en base et relie-les aux entrées et sorties
produites. Avec le résultat, conserve la configuration effective et sa version,
le coût, le temps, les erreurs et rejets utiles, puis l'évaluation.
Le réglage courant ne remplace pas celui de la course. Distingue coût exact,
estimé et inconnu. Réutilise le registre, la calibration et les journaux existants.

Si ce contrat est couvert, garde une recette courte et un résultat traçable.
Référence les gros objets dans le stockage natif. N'ajoute ni registre complexe,
ni graphe d'événements, ni framework d'évaluation, ni schéma exhaustif.
Évite les historiques dupliqués. Vérifie l'existant avant de conclure qu'il manque.

Pour comparer, construis à la demande une petite page HTML depuis les résultats
en base. Montre les vraies sorties, une référence comparable, coût, durée,
différences de recette et observations. Affiche ces données sans créer un second
stockage.
Après la course, évalue les sorties avec le propriétaire. Distingue avis agent
et avis humain. Attache commentaire ou exemple à la sortie exacte.
Juge qualité, fidélité, couverture et explication. Présente coût et délai
séparément. Une bonne moyenne ne compense pas un contresens.
N'impose aucune échelle ou pondération arbitraire. Ne remplace pas la réception
humaine par une note du générateur sur sa propre sortie.
Avant un prompt éditorial ou sa réception, charge `reviewing-levels-prompts`.

## Agents et livraison

Quand le mandat demande une délégation, utilise GPT-6.1 Sol pour l'orchestration,
l'intégration et le jugement complexe. Utilise Luna 6 pour une implémentation
bornée. Fournis un plan précis avec fichiers, contrats, comportement, échecs,
contrôles et commit attendu. N'utilise ni GPT-5.6 ni l'ancien GPT-6 Sol.
Choisis explicitement un effort proportionné. Utilise low pour simple, medium
pour courant, high pour sensible ou complexe. Justifie un effort supérieur.
Ces modèles servent au développement. Lis le choix des modèles produit dans
l'état courant du projet.

Laisse l'agent finir son mandat autonome et reçois son rapport final.
Ne surveille, ne relance et ne corrige pas son travail par routine.
Interviens sur demande humaine ou preuve concrète de blocage.
Fais relire le résultat par un agent indépendant de l'auteur. Il juge le résultat
réel, la pertinence de la solution et sa qualité, ainsi que le respect du plan.
Corrige les défauts importants dans le périmètre. Diffère les extensions.

Au démarrage, vérifie branche, index, fichiers non suivis et diff préexistant.
Signale aussitôt une accumulation de changements, un mélange de lots ou un risque
de chevauchement. Préserve les modifications des autres. Travaille sur `dev` ou
la branche attribuée. Fais de petits commits cohérents tôt et après chaque
incrément vérifié, avant transmission ou élargissement. N'attends pas la fin de
la refonte ou sa réception complète pour conserver un résultat technique vérifié.
Indexe les chemins exacts et donne le statut des contrôles avec chaque commit.
N'utilise ni `git add -A`, ni reset, ni stash, ni clean. Ne mélange pas dans un
commit massif des changements dont l'attribution n'est pas établie.
Un commit local reste distinct de la qualité reçue, du push, du merge et du
déploiement. Appel fournisseur, achat et publication exigent leur mandat.
Ne lance pas un nouveau benchmark payant par habitude de vérification.

Écris en français. Garde commits et commentaires de code en anglais.
Commence par acquis, conséquence et limite ou décision. Rapporte `PASS`, `FAIL`,
`NOT RUN` ou `BLOCKED` avec preuve exacte, gains, pertes, causes vérifiées,
hypothèses, limites et prochaine preuve. Distingue tests, appareil, réception
humaine, DEV et production. Mets à jour l'état court lorsqu'il change.
Évite les journaux de session et les règles dupliquées.
