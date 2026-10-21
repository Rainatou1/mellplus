# Correctifs Contact et Next.js — validation locale du 21 octobre 2026

## Audit des accès Contact

La lecture intégrale de `src/app/api/contact/route.js` confirme qu'avant ce correctif GET et PATCH n'effectuaient aucun contrôle de session ni de rôle. Le middleware ne demande un jeton que pour les chemins commençant par `/admin` ; `/api/contact` passe sans authentification. Les redirections du layout client ne protègent pas une API. Aucune autre barrière applicative n'a été identifiée. Aucune hypothèse n'est faite sur une éventuelle barrière réseau du VPS, qui n'a pas été consulté.

GET pouvait exposer tous les champs scalaires de chaque Contact : identifiant, nom, e-mail, téléphone, entreprise, sujet, message, source, IP, user-agent, états lu/répondu/favori/archivé, notes internes, personne assignée, dates de création et modification. Les filtres `read`/`starred`, la pagination et l'absence de plafond de taille permettaient de parcourir les demandes. Aucun mot de passe ou secret administrateur n'est stocké dans ce modèle.

PATCH acceptait un identifiant connu et modifiait `read`, `starred` et `archived` sans autorisation. La réponse renvoyait aussi le contact complet. Cette route ne permettait pas de modifier le contenu du message, les notes, l'assignation ou `replied`, ni de supprimer une demande.

Appelants examinés :

- `src/app/contact/page.js` : POST public JSON avec les champs anti-spam.
- `src/app/admin/contacts/page.js` : GET de la liste, PATCH pour lecture, favori et archivage. Suppression et réponse présentes dans cette interface sont des modifications d'état React locales, pas des suppressions PostgreSQL ou des envois SMTP via cette route ; comportement préservé.
- `src/app/admin/layout.js` : GET `?read=false` pour le badge périodique.
- `/contacts` : redirection vers `/contact` ; aucun autre appelant de `/api/contact` identifié par recherche dans `src`.

L'authentification existante est NextAuth Credentials : comparaison bcrypt, compte actif au login, session JWT de 24 heures et ID/rôle copiés dans la session. Le rôle du JWT peut vieillir après modification du compte. Le helper existant `homeAdmin` relit déjà les privilèges en base, mais sa politique ADMIN/SUPER_ADMIN concerne l'édition du contenu de l'accueil. Il n'est pas réutilisé pour imposer cette politique d'édition aux équipes de traitement des messages.

## Corrections d'accès

GET et PATCH vérifient désormais, avant toute lecture/écriture de contact et avant la lecture du corps PATCH :

1. Session NextAuth avec identité : sinon **401**.
2. Compte Admin retrouvé en PostgreSQL, encore actif, avec rôle actuel autorisé : sinon **403**, même avec un ancien JWT administrateur.
3. Rôle parmi **SUPER_ADMIN, ADMIN, MODERATOR, SUPPORT**. Cette politique explicite conserve le tri des messages pour les quatre rôles existants du back-office, dont le menu Messages n'avait aucune restriction supplémentaire. Aucun droit de suppression ou de modification du contenu n'est ajouté. Les chaînes `permissions` ne sont pas utilisées comme droits Contact ailleurs dans l'application et aucun nom de permission n'est inventé.

Une panne de lecture des droits produit une erreur et aucun accès aux contacts. Le code ne considère pas le rôle déclaré dans le JWT comme preuve suffisante du rôle actuel.

GET borne maintenant la pagination (page entière positive, limite de 1 à 100, décalage sûr) et conserve filtres, ordre et format de réponse. La réponse porte `Cache-Control: private, no-store`.

PATCH exige `application/json` (415 sinon) et un objet validé strictement : ID, au moins un des trois booléens autorisés, aucun autre champ. Les valeurs `false` sont conservées. Une requête invalide renvoie 400, un contact absent 404. Les appelants actuels utilisent déjà le type JSON et ces champs.

POST reste public. Son corps, ses contrôles anti-spam, sa transaction PostgreSQL puis ses notifications SMTP sont inchangés. Aucun contrôle administrateur n'est ajouté au formulaire public.

## Versions et périmètre de la mise à jour

| Paquet | Avant (installé/verrouillé) | Après (installé dans le checkout isolé) |
| --- | --- | --- |
| next | 15.5.7 | 15.5.28 |
| eslint-config-next | 15.4.5 | 15.5.28 |
| @next/eslint-plugin-next | 15.4.5 | 15.5.28 |
| @next/env et binaires SWC | 15.5.7 | 15.5.28 |
| sharp utilisé par Next | 0.34.5 | 0.35.5 |
| React / React DOM | 18.3.1 / 18.3.1 | inchangés |
| next-auth | 4.24.13 | inchangé |
| Prisma / @prisma/client | 6.19.1 / 6.19.1 | inchangés |

Le registre npm consulté liste 15.5.28 comme dernier correctif disponible de la branche 15.5. Les peerDependencies de Next acceptent React/React DOM `^18.2.0`, et NextAuth 4.24.13 accepte Next 15 et React 18 : aucune migration React 19 ni Next 16 n'est nécessaire. ESLint 9.39.2 reste compatible avec eslint-config-next 15.5.28.

Next et sa configuration ESLint sont épinglés à des versions exactes. Un override limité à `next → sharp: 0.35.5` est nécessaire : l'installation initiale de 15.5.28 conservait sharp 0.34.5, car la plage publiée `^0.34.3 || ^0.35.5` le permet encore. Un simple changement du numéro Next n'aurait donc pas garanti le correctif SVG dans notre lockfile.

Sharp 0.35.5 impose **Node >=20.9.0**. La validation utilise Node **24.21.0** et npm **11.19.0**. Confirmer la version Node du VPS avant préproduction ; elle n'a pas été interrogée.

Le lockfile ne met à jour que Next, ses outils ESLint et le graphe sharp nécessaire : paquets natifs `@img`, libvips 1.3.4, colour, semver et runtime WebAssembly. Les copies imbriquées ajoutées sous le paquet WASM Tailwind conservent ses anciennes versions et résultent du partage de runtime modifié par sharp ; Tailwind lui-même n'est pas mis à jour. Les changements incidents fastq et picomatch ont été retirés, puis `npm ci` a validé le lockfile final. Aucune autre dépendance directe n'est mise à jour.

Les sources et manifestes du workspace OneDrive sont corrigés ; son ancien `node_modules` n'est pas réinstallé. Les versions « après » sont vérifiées après installation exacte dans le checkout hors OneDrive. Utiliser `npm ci` avec le nouveau lockfile pour reproduire l'installation, pas les dépendances précédentes du workspace.

## Avis officiels examinés

Les correctifs sont cumulatifs ; tous les scénarios décrits par les avis ne sont pas nécessairement activés dans Mellplus.

| Publication | Analyse pour Mellplus |
| --- | --- |
| [11 décembre 2025](https://nextjs.org/blog/security-update-2025-12-11) | Exposition de code RSC et DoS (CVE-2025-55183, CVE-2025-55184, correctif complémentaire CVE-2025-67779), couverts par la ligne corrigée à partir de 15.5.9. |
| [26 janvier 2026](https://vercel.com/changelog/summaries-of-cve-2025-59471-and-cve-2025-59472) | CVE-2025-59471 : optimiseur d'images externes pertinent puisque remotePatterns est configuré. Le scénario PPR/minimal de CVE-2025-59472 n'est pas activé par la configuration examinée. |
| [Mai 2026](https://vercel.com/changelog/next-js-may-2026-security-release) | Lot de corrections DoS, contournements middleware, SSRF, caches et XSS. Renforce la nécessité de contrôles d'autorisation dans les routes elles-mêmes. |
| [Juillet 2026](https://nextjs.org/blog/july-2026-security-release) | Correctifs cumulatifs, dont DoS SVG, SSRF et bypass conditionnels ; aucune utilisation du build Turbopack, d'i18n ou de Server Actions applicatives identifiée ici. |
| [Août 2026](https://nextjs.org/blog/august-2026-security-release) | Correctifs critiques AVIF et scénario Windows ; le scénario Windows exige un mélange Pages/App Router, absent des sources examinées. |
| [22 septembre 2026](https://nextjs.org/blog/nextjs-security-update-september-22-2026) | RCE next/og limitée aux versions 16 concernées ; Next 15 reçoit un durcissement, sans être affecté par cette RCE. |
| [30 septembre 2026](https://nextjs.org/blog/september-2026-security-release) | SSRF de l'optimiseur d'images pertinent avec remotePatterns. Autres scénarios de cache, métadonnées et dev conditionnels ; pas tous applicables. |
| [14 octobre 2026](https://nextjs.org/blog/nextjs-security-update-october-14-2026) | SVG : CVE-2026-96889 / GHSA-2464-fhr4-w9xw, pertinent pour un VPS Linux glibc utilisant l'optimiseur, nécessite sharp >=0.35.5. Le scénario use-cache GHSA-673q-mjm6-r5xr est limité à Next 16 selon son avis spécifique. Le DoS Server Actions GHSA-p3m5-59mp-jv5r reste conditionné à leur présence. |

L'[index officiel](https://nextjs.org/blog/security) et les [advisories du dépôt](https://github.com/vercel/next.js/security/advisories) ont été consultés ; aucune version supérieure à 15.5.28 n'était publiée dans la branche au moment de la vérification. Cela ne constitue pas un audit exhaustif de toutes les dépendances du site.

## Fichiers modifiés pour cette étape

- `src/app/api/contact/route.js` : authentification, autorisation et validation des opérations administratives.
- `package.json`, `package-lock.json` : correctifs Next/ESLint/sharp ciblés.
- `tests/contact-access.test.mjs` : 43 tests supplémentaires des routes réelles, sessions et Prisma simulés.
- `tests/email.test.mjs`, `tests/home-content.test.mjs`, `tests/promotion-display.test.mjs` : renommage des variables locales `module` en `vmModule` pour passer la règle ESLint Next, sans changement fonctionnel ni désactivation de règle.
- Ce rapport.

La première vérification des empreintes confirme que les 13 fichiers anti-spam/SMTP/formulaires/schéma contrôlés étaient identiques à l'instantané précédent, ainsi que le corps du POST public Contact. Les renommages de variables des tests ont ensuite été les seuls changements supplémentaires aux anciens tests. Aucun fichier de production anti-spam, formulaire, SMTP, migration ou schéma n'est modifié par cette étape.

## Validation locale

Checkout : `C:\Users\raina\AppData\Local\Temp\mellplus-validation-b4e3d201fb7e4746b9fabfc880f1e141`.

Installation `npm ci` du lockfile final, sans copie des `.env` privés. URL PostgreSQL fictive vers `127.0.0.1:9`, identifiants SMTP vides. Aucun test n'envoie de véritable e-mail ni n'utilise une vraie base. Les nouveaux tests exercent les exports réels GET/PATCH, les refus avant lecture du corps et avant requêtes Contact, les rôles autorisés, les JWT périmés, les champs invalides et les formats de réponse. Les tests anti-spam existants continuent de couvrir POST public et ses notifications simulées.

- `npm test` : **138 réussis, 0 échec**, code 0.
- `npx eslint src tests` : **réussi**, code 0, après renommage des variables VM. Le premier passage avait échoué sur quatre occurrences dans les anciens tests ; aucune règle n'a été masquée.
- `npx prisma validate` : **schéma valide**, code 0, aucune migration appliquée.
- `npm run build` : **réussi, code 0**, Next.js 15.5.28, compilation annoncée en 23,5 secondes puis génération des 47 pages, optimisation et traces terminées.
- Test réel de sharp 0.35.5 : génération en mémoire d'un PNG fictif 2×2, **92 octets**, sans accès réseau ni écriture de fichier.

Windows a refusé le chargement du nouveau binaire natif SWC par sa politique de contrôle d'application. Next.js a utilisé son repli WebAssembly standard de version 15.5.28 ; la politique Windows n'a pas été modifiée et aucune option de build n'a été désactivée. Le build réussi valide ce chemin de compilation, pas le binaire SWC natif Windows ni Linux. L'avertissement préexistant concernant `experimental.missingSuspenseWithCSRBailout` reste présent et la configuration Next.js n'a pas été modifiée.

Les sept fichiers de code, manifestes et tests concernés ont été comparés octet par octet entre le workspace et le checkout testé : aucune différence. `git diff --check` passe. Les modifications de production se limitent aux contrôles GET/PATCH et aux versions de dépendances liées au correctif ; le corps du POST et les autres fonctions demandées sont préservés.

Les journaux `security-install.log`, `security-tests.log`, `security-eslint.log`, `security-prisma.log` et `security-build.log` sont conservés dans le checkout isolé.

## Risques et recette avant préproduction

- Vérifier Nginx, la chaîne de proxies, le remplacement de l'en-tête IP, le pare-feu et l'inaccessibilité du port Node ; ces points n'ont pas été vérifiés sur le VPS.
- Vérifier Node >=20.9, reconstruire sous Linux et tester le décodage/optimiseur d'images avec les binaires sharp Linux résolus par le lockfile. Les dépendances Windows ne doivent pas être transférées sur le VPS.
- Préparer une base isolée, examiner son historique de migrations et sa compatibilité avec SubmissionGuard. L'application d'une migration reste interdite pour cette étape.
- Recetter Turnstile réel, expiration/réutilisation, pannes, limites persistantes et concurrence PostgreSQL réelle avec des données fictives ; vérifier authentification/révocation de rôles avec les sessions NextAuth réelles de préproduction.
- Recetter mobile/accessibilité et SMTP avec des comptes de test contrôlés, seulement lors d'une étape autorisée.
- Point distinct relevé en suivant les lectures des contacts : `/api/admin/stats` expose des compteurs et indicateurs métier sans contrôle de session dans son handler, et le middleware ne protège pas `/api/admin`. Aucun message individuel n'est renvoyé par cette route, mais l'autorisation des autres routes administratives reste à auditer. Elle n'a pas été modifiée pour éviter d'étendre ce correctif à l'ensemble de l'administration.
- L'alerte de connexion NextAuth peut encore envoyer un e-mail à chaque tentative de login ; sa limitation ne relève pas des formulaires Contact/Devis et reste à examiner séparément.

Aucun accès à la production, aucune migration, suppression de données ou publication effectué.
