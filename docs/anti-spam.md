# Protection des formulaires Mellplus

## Audit du 16 octobre 2026

- `/contact` → POST `/api/contact` → Prisma `Contact` → notification et confirmation SMTP OVH.
- `/devis` → POST `/api/quotes` → Prisma `QuoteRequest` et ses items → notification et confirmation SMTP OVH.
- `/contacts` envoyait directement vers Formspree sans passer par PostgreSQL ou SMTP OVH. Cette ancienne URL redirige désormais vers `/contact`. Le compte Formspree reste à désactiver séparément si inutilisé.
- Aucun formulaire, endpoint de dépôt de CV ou Server Action de soumission identifié.
- Zod était déjà installé, mais les chaînes n'étaient pas normalisées ou plafonnées. Aucun Turnstile, honeypot, Redis ou limite persistante identifié.
- Les dernières modifications SMTP (`475be37`, `4b328a4`, `7e8f1f0`) concernent OVH. Le fonctionnement actuel attend les envois et conserve les demandes en cas de panne SMTP. Il est préservé.

## Configuration obligatoire avant mise en service

1. Créer un widget Turnstile dans Cloudflare pour les domaines réels autorisés.
2. Définir `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (publique, disponible à la compilation), `TURNSTILE_SECRET_KEY` (serveur seulement) et `TURNSTILE_HOSTNAMES` (hôtes exacts séparés par des virgules, sans protocole ni chemin).
3. Générer un secret indépendant (`openssl rand -hex 32`) pour `ANTISPAM_HASH_SECRET`. Le garder identique entre instances. Ne pas employer les valeurs fictives des tests.
4. Configurer le reverse proxy pour **remplacer**, et non transmettre, un en-tête IP unique. Avec Nginx directement exposé : `proxy_set_header X-Real-IP $remote_addr;`, puis `ANTISPAM_IP_HEADER=x-real-ip`. Rendre le port Node inaccessible depuis Internet. En présence d'un autre proxy, configurer sa chaîne de confiance explicitement avant activation. Une IP arbitraire fournie par le visiteur ne doit jamais être considérée fiable.
5. Examiner la migration `20261016000000_submission_guard`, puis appliquer les migrations selon la procédure habituelle (`npx prisma migrate deploy`) sur l'environnement choisi. Cette étape n'a pas été exécutée. La migration ajoute uniquement une table technique et un index ; aucune demande existante n'est modifiée.
6. Générer Prisma, reconstruire Next.js et redémarrer selon la procédure habituelle, après autorisation de déploiement. Conserver `DATABASE_URL`, `OVH_USER` et `OVH_PASSWORD` existants.

Sans configuration complète, les API refusent les demandes ; aucun contournement automatique de Turnstile n'est prévu. Une panne Cloudflare renvoie 503 et invite à réessayer. Un jeton manquant ou refusé renvoie 400. Cloudflare contrôle expiration et usage unique, et le serveur vérifie aussi domaine et action (`contact` ou `quotes`). Après chaque tentative, le widget est renouvelé.

## Règles et stockage

- Fenêtre de dix minutes : 120 tentatives par IP, 60 demandes acceptées par IP et 6 par e-mail, cumulées sur les deux routes. Les seuils IP sont volontairement plus larges pour les réseaux partagés.
- Déduplication par formulaire, e-mail, message, sujet et articles, en normalisant casse, espaces et Unicode. Les variantes sémantiques ne sont pas détectées. Une demande identique attend dix minutes avant un nouvel envoi.
- Compteurs et déduplication persistants dans PostgreSQL ; écriture métier et réservation des limites d'acceptation dans la même transaction. Un échec d'enregistrement ne produit ni succès ni e-mail. Les notifications interviennent après validation et commit.
- Clés techniques HMAC ; ni jetons Turnstile ni IP brutes dans la table technique. Les métadonnées historiques de Contact sont conservées conformément au fonctionnement existant.
- Corps limité à 64 Kio, champs bornés, e-mail validé, texte obligatoire non vide. Les messages avec 30 caractères identiques consécutifs ou plus de 10 liens HTTP(S) sont refusés. Les noms ne font l'objet d'aucune analyse linguistique ou de rareté. Les messages courts, autres langues et fautes sont acceptés.
- Le message de devis reste optionnel pour les intégrations comportant des articles ; une chaîne contenant uniquement des espaces est refusée. Le formulaire actuel exige déjà un message.
- Honeypot masqué et exclu de la navigation clavier et des technologies d'assistance ; il est vérifié côté serveur et exclu des données Prisma.
- Réponse 429 avec `Retry-After: 600` en cas de limite ou doublon ; journaux de refus limités à un code technique, sans contenu du formulaire ou jeton.

Prévoir une tâche quotidienne de maintenance pour purger uniquement les compteurs expirés : `DELETE FROM "SubmissionGuard" WHERE "expiresAt" < NOW() - INTERVAL '1 day';`. Aucun nettoyage n'a été exécuté. Ne pas supprimer les anciennes demandes.

## Validation et limites

Les tests automatisés utilisent des noms et adresses fictifs, un faux Siteverify, de fausses écritures Prisma et un faux SMTP. Ils exercent les routes réelles, les refus, les noms Unicode, la déduplication et les seuils. Ils ne prouvent pas le verrouillage concurrent sur un PostgreSQL réel, ni une délivrabilité SMTP réelle.

Avant production : appliquer la migration en préproduction, vérifier deux requêtes concurrentes identiques, l'expiration des fenêtres, le proxy IP, les domaines et actions Turnstile, les erreurs réseau, puis effectuer une recette clavier, lecteur d'écran et mobile à 320 px. Les vérifications de structure du widget ne remplacent pas ces essais dans un navigateur. Utiliser les clés de test officielles uniquement en préproduction isolée, jamais en production.

Turnstile est une couche supplémentaire, pas une garantie contre tout spam. Aucun classement par IA ou origine des noms. Le système existant conserve les demandes même si SMTP échoue ; il ne dispose pas d'une file durable de reprise des e-mails après arrêt du processus.

Référence : https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

## Résultats locaux

- `npm test` : 95 tests réussis, zéro échec, aucun e-mail réel.
- ESLint ciblé sur les huit fichiers JavaScript de production concernés : réussi.
- `npx prisma validate` : schéma valide, aucune migration appliquée.
- `npm run build` : non validé. Après levée du blocage de création de processus Windows, la compilation échoue sur `EINVAL: invalid argument, readlink` dans `.next/types/routes.d.ts` sous OneDrive. Avertissement préexistant également signalé pour `experimental.missingSuspenseWithCSRBailout` dans Next.js. Une compilation dans un checkout local sain reste nécessaire.

## Fichiers modifiés ou ajoutés

- `.env.example`
- `prisma/schema.prisma`
- `prisma/migrations/20261016000000_submission_guard/migration.sql`
- `src/lib/antispam.js`
- `src/lib/submissionSchemas.js`
- `src/components/SubmissionProtection.js`
- `src/app/contact/page.js`
- `src/app/devis/page.js`
- `src/app/contacts/page.js`
- `src/app/api/contact/route.js`
- `src/app/api/quotes/route.js`
- `tests/antispam.test.mjs`
- `tests/email.test.mjs`
- `docs/anti-spam.md`
