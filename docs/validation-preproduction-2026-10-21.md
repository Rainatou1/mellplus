# Validation avant préproduction — 21 octobre 2026

## Périmètre et conservation du travail

Le dépôt initial reste sous `C:\Users\raina\OneDrive\Desktop\projet\mellplus` au commit `2c11a5c271e31626a8b9776aa7b865ca875f4a7b`. Les huit fichiers modifiés et les six chemins non suivis de l'implémentation anti-spam ont été conservés. Aucun commit, reset, stash, nettoyage de fichiers, déploiement ou migration n'a été effectué.

Checkout de validation :

`C:\Users\raina\AppData\Local\Temp\mellplus-validation-b4e3d201fb7e4746b9fabfc880f1e141`

Méthode : clone local `git clone --no-hardlinks`, puis copie des fichiers retournés par `git ls-files --cached --others --exclude-standard`, y compris les modifications non commitées et les nouveaux fichiers. Les fichiers ignorés (`.next`, `node_modules`, `.env`, `.env.local`, sauvegardes privées) ne sont pas copiés. Les fichiers supprimés devraient être traités explicitement lors d'une reproduction ; aucun fichier suivi supprimé n'était présent dans l'état initial examiné. Ne pas copier récursivement tout le dossier OneDrive.

La comparaison SHA-256 de 1 395 fichiers entre le workspace et la copie ne révèle aucune différence. Le checkout est ainsi neuf pour les dépendances et les sorties générées, tout en reproduisant le travail en cours, plutôt que le seul dernier commit.

Un premier dossier temporaire `mellplus-validation-6f3f69095ae54d0c99923eff96dfb8d4` a également été conservé après le blocage Windows de Git dans le bac à sable. Il n'a pas servi à la validation.

## Compilation

Observations dans le workspace d'origine :

- `.next/types/routes.d.ts` a les attributs `Archive, ReparsePoint` et aucune cible de lien déclarée.
- Le contenu reste lisible normalement (3 570 octets), mais `fs.readlinkSync` renvoie `EINVAL`. Attention : `readlink` échoue aussi normalement sur un fichier ordinaire ; ce test seul ne prouve pas la cause.
- Pendant l'inspection, `lstat` et `readdir` ne le classent pas comme lien symbolique. La classification d'un fichier de synchronisation Windows peut différer dans le temps ou selon l'API ; la cause bas niveau exacte n'est donc pas démontrée.
- Le nettoyage de Next.js appelle `readlink` lorsqu'une entrée est classée comme lien (`node_modules/next/dist/lib/recursive-delete.js`).

La cause la plus probable est l'interaction entre les sorties générées `.next`, les points de réanalyse de OneDrive et les API de fichiers Windows/Node. Le code applicatif ne nécessite pas de modification pour compiler hors OneDrive. Cette observation ne constitue pas une preuve que tout usage de OneDrive échoue ni que Windows seul serait responsable.

Environnement isolé : Windows, Node `v24.21.0`, npm `11.19.0`, Next.js verrouillé `15.5.7`, React `18.3.1`, Prisma résolu `6.19.1`. `npm ci --no-audit --no-fund` a réinstallé 389 paquets à partir du lockfile et généré Prisma, sans migration.

Seules des valeurs fictives ont été utilisées : `DATABASE_URL=postgresql://validation:validation@127.0.0.1:9/mellplus_validation`, `NEXTAUTH_URL=http://localhost:3000`, secret NextAuth fictif, `OVH_USER` et `OVH_PASSWORD` vides. Aucun fichier d'environnement privé n'a été copié. Le port 9 n'est pas une base de préproduction ; il sert à éviter tout accès à une vraie base pendant cette validation de compilation.

- `npm test` : **95 tests réussis, 0 échec**, code 0.
- `npm run build` : **réussi, code 0**, compilation en 53 secondes et génération des 47 pages.
- Une seconde exécution `npm run build`, dans le même checkout avec `.next` déjà présent : **réussie, code 0**. La réutilisation/nettoyage des sorties générées passe également hors OneDrive.
- Journaux complets conservés dans le checkout : `validation-tests.log`, `validation-build.log` et `validation-rebuild.log`.
- Aucun fichier applicatif, script npm, lockfile ou configuration Next.js modifié pendant cette investigation. Le seul ajout au dépôt pour cette étape est ce rapport. Les modifications anti-spam antérieures restent intactes et non commitées.

Le champ `experimental.missingSuspenseWithCSRBailout` est signalé comme inconnu par Next 15.5.7 ; il n'a pas été modifié et n'empêche pas la compilation. Le script `lint` appelle encore `next lint`, alors que la configuration ESLint est plate ; ne pas confondre ce script historique avec l'étape de lint effectivement exécutée avec succès par le build.

Méthode durable : développer et compiler depuis un dossier local hors synchronisation, garder les sauvegardes et transferts via Git ou archives distinctes, puis reproduire les tests sous Linux avec la version Node retenue pour le VPS. Le dossier temporaire est une preuve de validation, pas un emplacement durable de travail ni un artefact à déployer avec ces variables fictives.

## Analyse SQL, sans exécution

Le diff du schéma ajoute uniquement le modèle `SubmissionGuard`. Les modèles et migrations existants ne sont pas modifiés.

La migration contient exactement :

```sql
CREATE TABLE "SubmissionGuard" (
  "key" TEXT PRIMARY KEY,
  "count" INTEGER NOT NULL,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL
);
CREATE INDEX "SubmissionGuard_expiresAt_idx"
  ON "SubmissionGuard" ("expiresAt");
```

- `key` : texte, unicité et non-nullité imposées par la clé primaire ; PostgreSQL crée son index B-tree unique et la contrainte nommée par défaut `SubmissionGuard_pkey`.
- `count` : entier signé 32 bits obligatoire ; aucune valeur par défaut et aucune contrainte `CHECK` de positivité.
- `expiresAt` : timestamp avec fuseau à précision milliseconde, obligatoire, sans valeur par défaut. L'index explicite est un B-tree non unique.
- Aucune séquence, identité, clé étrangère, trigger, insertion de données, modification ou suppression de table existante. Aucun `ALTER`, `UPDATE`, `DELETE`, `DROP` ou `TRUNCATE`.
- Les valeurs sont fournies par les requêtes applicatives : clé HMAC, compteur initial 1, expiration `NOW() + INTERVAL '10 minutes'`. Le schéma Prisma concorde (`String @id`, `Int`, `DateTime @db.Timestamptz(3)`, index sur `expiresAt`).
- Le SQL est compatible avec le fournisseur PostgreSQL déclaré. Il crée des objets dans le schéma actif ; vérifier le schéma utilisé par `DATABASE_URL` et le chemin de recherche réel avant application.
- La migration n'est pas idempotente (`IF NOT EXISTS` absent) : une table ou un index homonyme préexistant provoquera une erreur. Ne pas ajouter `IF NOT EXISTS` pour masquer une divergence de schéma.
- Le fichier ne contient pas de transaction SQL explicite. Ne pas supposer une application atomique des deux instructions sans vérifier la procédure de migration et la version de Prisma retenues.

La compatibilité structurelle est confirmée à la lecture. L'état réel, les privilèges, la version PostgreSQL et l'historique `_prisma_migrations` de la base n'ont pas été interrogés. Les vérifier en lecture seule sur la future base de préproduction avant d'autoriser toute application. Aucune demande existante n'est ciblée par ce SQL.

## Contrôles serveur

Ordre constaté dans les deux routes POST :

1. Limite des tentatives persistante par IP, avant lecture du corps et avant appel Cloudflare.
2. Lecture bornée à 64 Kio et validation Zod.
3. Honeypot puis Siteverify Turnstile : jeton requis, succès strict, hostname autorisé et action attendue (`contact` ou `quotes`). Délai réseau de 8 secondes ; panne ou configuration absente : refus 503. La clé secrète reste côté serveur. L'expiration et l'usage unique sont contrôlés par Siteverify ; les tests les simulent et ne constituent pas une recette réelle Cloudflare.
4. Transaction PostgreSQL : UPSERT atomiques des compteurs et de la clé de doublon, dans un ordre stable, puis création métier (avec articles pour le devis). Un échec annule les réservations d'acceptation et l'enregistrement. Le compteur de tentatives, volontairement hors transaction métier, reste comptabilisé.
5. Après résolution du commit uniquement : notification puis confirmation SMTP OVH. Aucune notification sur un refus. Une panne SMTP conserve la demande mais aucune file durable ne garantit la reprise après arrêt du processus.

Les fenêtres sont fixes à dix minutes : 120 tentatives par IP, 60 demandes acceptées par IP, 6 par e-mail et une occurrence de chaque empreinte normalisée. Il n'y a pas de stockage uniquement en mémoire. L'e-mail n'est pas vérifié comme appartenant au demandeur ; un tiers pourrait donc consommer son quota. La déduplication normalise casse, espaces et Unicode, mais ne reconnaît pas les paraphrases et expire après dix minutes. La purge périodique de la seule table technique reste à organiser.

Les tests utilisent de fausses écritures Prisma. Ils ne prouvent ni la syntaxe exécutée sur le moteur PostgreSQL réel, ni le comportement de verrous entre plusieurs connexions, ni la reprise après incident.

### IP : confiance non démontrée sur le VPS

`sourceIP` lit exclusivement l'en-tête nommé par `ANTISPAM_IP_HEADER` et vérifie qu'il contient une seule IP valide. Une liste, une valeur invalide ou une absence est refusée. Aucun repli automatique vers `x-forwarded-for`.

Cinq assertions supplémentaires exécutées directement sur `sourceIP` confirment ces refus et montrent que deux valeurs IP différentes fournies dans l'en-tête donnent deux sources différentes. Ce comportement démontre la dépendance à une barrière proxy externe, sans tester le VPS.

**La validité syntaxique n'authentifie pas l'émetteur.** Quiconque peut appeler directement Node ou traverser un proxy transmettant cet en-tête peut choisir sa valeur et contourner les limites IP. Next Request ne fournit ici aucun contrôle du pair réseau. Il est donc impossible de confirmer que l'en-tête est infalsifiable à partir du seul dépôt.

Aucune configuration Nginx, règle de pare-feu ou configuration d'exposition du VPS n'a été trouvée ou consultée. L'exemple du précédent rapport n'est pas une configuration vérifiée.

Conditions de validation : examiner une sortie expurgée de `nginx -T`, les éventuels autres proxies et le pare-feu ; imposer le remplacement de l'en-tête dans chaque chemin vers les routes protégées ; rendre Node inaccessible publiquement (loopback, socket privée ou réseau privé filtré). En accès Nginx direct, l'exemple `proxy_set_header X-Real-IP $remote_addr;` convient seulement si `$remote_addr` représente la bonne source. Avec CDN ou load balancer, définir et vérifier les plages de confiance et le module real-IP ; ne pas faire confiance globalement à un en-tête client.

Tester depuis un client externe que modifier `X-Real-IP`, `X-Forwarded-For`, leur casse ou leurs occurrences multiples ne change pas la source retenue par l'application. Vérifier aussi que l'accès au port Node depuis Internet échoue. En préproduction, utiliser uniquement une observation temporaire pseudonymisée pour comparer les sources, sans journaliser les formulaires ou les jetons.

## Risques ouverts avant production

- **Accès aux contacts :** GET et PATCH `/api/contact` ont leur contrôle de session commenté. Le middleware ne demande une authentification que pour les chemins commençant par `/admin`, donc pas `/api/contact`. Les contacts pourraient être lus et leurs statuts modifiés via des appels anonymes si aucune barrière externe n'existe. Ce risque préexistant est établi par lecture ; aucun appel de production n'a été effectué. Le corriger et tester les droits avant publication.
- **Version Next.js :** `npm ci` signale `next@15.5.7` comme vulnérable. L'[avis officiel du 11 décembre 2025](https://nextjs.org/blog/security-update-2025-12-11) liste notamment les correctifs de la branche 15.5 en 15.5.9. Cela ne garantit pas que 15.5.9 couvre les avis ultérieurs : sélectionner une version actuellement corrigée et effectuer une validation séparée avant production. Aucune mise à jour de dépendance n'a été faite ici.
- Confiance proxy/IP, migration réelle, concurrence SQL, Turnstile réel, accessibilité et affichage mobile restent à vérifier sur l'infrastructure cible.
- La réussite Windows ne remplace pas la compilation Linux/VPS, notamment pour la sensibilité à la casse et les versions d'exécution.

## Prérequis exacts de préproduction

1. Un environnement Linux distinct, avec version Node/npm fixée, dépendances installées par `npm ci`, et compilation propre des mêmes sources ; ne pas transférer les dépendances Windows.
2. Une base PostgreSQL de préproduction isolée et des données exclusivement fictives ; inventaire en lecture seule du schéma et des migrations, privilèges de création, absence de collision de noms. Toute application de migration fera l'objet d'une autorisation ultérieure ; aucune n'est autorisée par ce rapport.
3. Un hostname et un widget Turnstile de préproduction ; `NEXT_PUBLIC_TURNSTILE_SITE_KEY` présent à la compilation, `TURNSTILE_SECRET_KEY`, `TURNSTILE_HOSTNAMES` exacts, `ANTISPAM_HASH_SECRET` aléatoire et identique entre instances. Aucun mode de contournement en production.
4. `ANTISPAM_IP_HEADER` correspondant à la configuration effectivement auditée du proxy, preuve que le port Node n'est pas exposé et essais de falsification d'en-têtes.
5. `DATABASE_URL`, `NEXTAUTH_URL` et `NEXTAUTH_SECRET` propres à la préproduction. Pour tester les e-mails, une boîte OVH de test et des destinataires fictifs contrôlés ; aucune adresse client réelle. L'envoi reste désactivé tant que cette recette n'est pas autorisée.
6. Tests des deux formulaires et appels directs : demande valide, noms Unicode, honeypot, absence/expiration/réutilisation du jeton, mauvais domaine/action, panne Siteverify, limite et expiration de fenêtre ; aucun e-mail sur refus.
7. Essais SQL réels avec plusieurs connexions/processus : deux doublons simultanés donnent une seule demande et une seule paire d'e-mails ; échec d'écriture annule les réservations métier ; panne SMTP conserve la demande ; redémarrage conserve les limites.
8. Correction puis recette de l'authentification GET/PATCH contacts, droits de consultation et modification, essais anonymes et rôles non autorisés.
9. Recette à 320 px, clavier, lecteur d'écran et erreurs du widget, puis organisation de la purge des compteurs techniques expirés et de la surveillance minimale.

Aucun déploiement ni accès en écriture à une base réelle n'a été effectué.
