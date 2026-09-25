# Promotion indépendante

La migration `20260925000000_product_promotion` ajoute uniquement
`Product.isPromotion BOOLEAN NOT NULL DEFAULT false`, puis initialise ce champ
à `true` lorsque `discount > 0`. Cela conserve les promotions de l'ancien système,
y compris leur classification sur les brouillons. `publishedAt` reste inchangé :
les brouillons ne sont jamais renvoyés par l'API Promotions.

Les nouveaux produits ont la case décochée par défaut. Après migration, modifier
une réduction ne change plus `isPromotion`. Aucun autre champ existant n'est
modifié par le SQL, pas même `updatedAt`.

## État vérifié le 25 septembre 2026

L'accès SSH par clé à `amadou@51.83.43.44:22` fonctionne, avec des expirations
intermittentes lors de certaines connexions. Le chemin réel du projet est
`/home/amadou/mellplus`. Le chargement Next en mode production utilise uniquement
`.env` ; la `DATABASE_URL` effective correspond à celle de ce fichier. Un processus
Next est présent dans ce répertoire, sans `DATABASE_URL` dans son environnement
initial exposé par `/proc`. Aucun secret n'a été affiché.

Une sauvegarde complète de la base a été créée le **2026-09-25 à 09:58 UTC** :

```text
/home/amadou/backups/mellplus/2026-09-25T09-58-41-543Z-before-promotion-uWPVig/database.dump
```

- Format PostgreSQL custom compressé, **85 329 octets**, PostgreSQL/pg_dump 14.24.
- SHA-256 : `1b9e80accd62bc0cbae6ad0f2799b182cbe9f36ad2f7b431343629f5bbef1fad`.
- Répertoire privé `0700`, fichiers `0600`, hors du projet servi.
- Les 15 tables sont présentes dans le sommaire ; `pg_restore --file=/dev/null`
  a décodé intégralement l'archive sans connexion ni écriture dans une base.
- `sha256sum --check` a réussi. Le fichier `database.dump.sha256`, le sommaire
  `archive-list.txt` et le `manifest.json` sont conservés à côté de l'archive.
- Le manifeste contient les comptes et empreintes des lignes de chaque table,
  ainsi que les colonnes produit, catégories et migrations enregistrées. Ces
  contrôles et `pg_dump` partagent un snapshot PostgreSQL exporté depuis une
  transaction en lecture seule : les écritures de l'application n'ont pas été
  suspendues et le site n'a pas été interrompu pour cette sauvegarde.

Au moment du snapshot : **322 produits, 204 publiés, 118 brouillons**, aucun
produit avec `discount > 0`. Répartition : ORDI_SERVEUR 19, RESEAUX_SECURITE 135,
IMPRIMANTE_COPIEUR 14, ACCESSOIRES 154. La colonne `isPromotion` est absente.

**Aucune migration, modification des données ni mise en production effectuée.**
La lecture intégrale de l'archive ne remplace pas une restauration d'essai :
**la restauration isolée reste à effectuer**. La sauvegarde est actuellement
conservée sur le VPS uniquement ; aucune copie hors serveur n'a été effectuée.
Les anciens `backup.dump` / `backup.dum` du dépôt n'ont pas été utilisés.

Conformément à la dernière instruction, toute migration, tout déploiement et
toute commande destructive nécessitent désormais une validation explicite.
Avant migration, terminer la restauration d'essai et les contrôles ci-dessous,
examiner les migrations en attente et renouveler la sauvegarde et le snapshot
pré-migration si les données ont changé. Le manifeste de sauvegarde ne remplace
pas le snapshot attendu par `check-product-promotions.cjs verify`.

## Exécution sur la base cible

1. Utiliser la même `DATABASE_URL` pour l'application, l'audit et Prisma CLI.
   L'audit charge les fichiers d'environnement via Next (`.env.local` prioritaire),
   alors que Prisma CLI charge `.env`. Fournir explicitement la connexion cible
   dans l'environnement du processus évite cette ambiguïté. Ne pas afficher les
   identifiants dans les logs.
2. Suspendre les écritures produit pendant l'audit et la migration. Faire une
   sauvegarde complète via le fournisseur PostgreSQL ou `pg_dump --format=custom`,
   avec des identifiants fournis par un mécanisme sécurisé. Vérifier la sauvegarde
   par une restauration sur une base isolée. Ne jamais restaurer sur la production
   pour tester. Conserver la sauvegarde hors du dépôt (ou dans `.backups/`, ignoré).
3. Exécuter l'audit en lecture seule et enregistrer les empreintes avant migration :

   ```sh
   node scripts/check-product-promotions.cjs snapshot .backups/products-before-promotion.json
   npx prisma migrate status
   ```

   Le snapshot contient les IDs et empreintes de toutes les valeurs produit,
   les définitions des colonnes et catégories, et les comptes par catégorie.
   **Ce snapshot n'est pas une sauvegarde restaurable.** Il refuse d'écraser un
   fichier existant. Si l'audit échoue, ne pas poursuivre.
4. Examiner les migrations en attente. `migrate deploy` applique toutes les
   migrations en attente : ne pas continuer si la liste contient des changements
   inattendus. Tester d'abord cette migration sur la copie restaurée, puis appliquer
   sur la base cible sauvegardée :

   ```sh
   npx prisma migrate deploy
   node scripts/check-product-promotions.cjs verify .backups/products-before-promotion.json
   ```

   Le SQL est transactionnel et ne contient ni suppression, ni réinitialisation.
   La vérification exige les mêmes IDs et empreintes pour **tous** les champs
   préexistants, les mêmes catégories et effectifs, ainsi que le bon `isPromotion`
   pour chaque produit. Cela couvre les prix, stocks, images, descriptions,
   classifications, dates et statuts Publié/Brouillon. Vérifier immédiatement,
   avant de reprendre les écritures, sinon des modifications légitimes feront
   échouer la comparaison. En cas d'échec, ne pas déployer ni réinitialiser la base.
5. Après succès, générer le client et valider la nouvelle application :

   ```sh
   npx prisma generate
   npm test
   npm run build
   ```

   Déployer l'application après la migration vérifiée. Valider dans le navigateur
   le toggle dans Status (succès et erreur réseau), sa persistance après rechargement,
   l'ajout/modification, les quatre combinaisons publication/promotion et les cartes
   sans prix/sans réduction. Vérifier aussi les promotions de l'accueil, qui utilisent
   la même API. Reprendre ensuite les écritures produit.
