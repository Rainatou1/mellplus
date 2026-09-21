# Administration des visuels d’accueil

1. **Existant constaté**

   `src/app/page.js` contenait les huit slides et les deux bandes latérales. Les liens des bandes étaient `/promotions` à gauche et `/products` à droite. Les boutons des slides pointaient tous vers `/contact` et `/products`. `src/app/Home.js` n’est pas la page servie pour `/` et n’a pas été modifié.

2. **Administration déjà commencée**

   Le modèle Prisma `Carousel`, `/admin/carousel`, les routes `/api/carousel`, `/api/carousel/[id]`, `/api/carousel/reorder`, les formulaires et le composant `ImageUpload` existaient. Le formulaire permettait déjà les textes, les images, les boutons/liens, huit palettes de fond, l’activation et le repère « en vedette ». L’upload utilisait Cloudinary, avec un stockage local réservé au développement.

3. **Manques corrigés**

   L’accueil ne lisait pas ces données. Aucune gestion des deux blocs latéraux n’existait. Les lectures publiques pouvaient retourner les slides inactifs et les métadonnées d’auteur. L’ordre était modifié par des écritures séparées et pouvait annoncer un succès même sur une réponse HTTP en erreur ; échanger deux ordres identiques ne déplaçait rien. Les champs de liens refusaient les chemins internes. Les routes de détail utilisaient les paramètres sans les attendre. La validation serveur était insuffisante.

   Le formulaire et les API existants sont conservés et complétés. Les deux blocs se modifient séparément ; chaque bloc possède son propre enregistrement. Les titres, sous-textes et liens peuvent être vidés. Désactiver un bloc retire son contenu public en conservant les dimensions de son emplacement. Une image peut être remplacée via l’upload existant ; les fichiers distants ne sont pas supprimés automatiquement, car ils peuvent être partagés.

   Les fonds acceptent les palettes historiques, une couleur unie ou un dégradé horizontal de deux couleurs libres. Les couleurs libres sont appliquées en CSS, sans dépendre de classes Tailwind générées dynamiquement. Les boutons sans libellé ou sans lien ne sont pas affichés. Le repère `featured` reste un repère d’administration et ne modifie pas l’ordre public.

4. **Fichiers modifiés**

   - `prisma/schema.prisma`
   - `src/app/page.js`
   - `src/app/admin/carousel/page.js`
   - `src/app/api/carousel/route.js`
   - `src/app/api/carousel/[id]/route.js`
   - `src/app/api/carousel/reorder/route.js`
   - `src/app/api/upload/route.js`
   - `src/components/admin/ImageUpload.js`

5. **Fichiers créés**

   - `prisma/migrations/20260921000000_home_visual_content/migration.sql`
   - `scripts/check-home-content.cjs` — vérification en lecture seule, sans afficher les identifiants de connexion.
   - `src/app/api/home-content/route.js`
   - `src/app/api/visual-blocks/route.js`
   - `src/app/api/visual-blocks/[key]/route.js`
   - `src/app/api/carousel/import-defaults/route.js`
   - `src/components/HeroSideBlock.js`
   - `src/components/admin/HomeVisualBlocks.js`
   - `src/components/admin/SlideBackground.js`
   - `src/lib/homeDefaults.js`
   - `src/lib/homeContent.js`
   - `src/lib/homeValidation.js`
   - `src/lib/homeAdmin.js`
   - `src/lib/loadHomeContent.js`
   - `tests/home-content.test.mjs`
   - `HOME_CONTENT_ADMIN.md`

6. **Prisma et transition des données**

   `Carousel` est réutilisé sans nouvelle colonne : `bgGradient` stocke les anciennes classes ou une valeur CSS strictement validée. Le nouveau modèle générique `VisualBlock` stocke `key`, `image`, `title`, `subtitle`, `alt`, `link`, `active` et les dates. Les clés actuelles sont `home.hero.left` et `home.hero.right`. Pour ajouter un emplacement, enregistrer sa définition et l’afficher avec le composant réutilisable.

   La migration ajoute `VisualBlock`. Elle crée également `Carousel` **uniquement si la table n’existe pas**, car ce modèle était absent des migrations versionnées. Elle ne supprime, ne vide et ne met à jour aucune donnée. La structure d’une table `Carousel` déjà présente doit correspondre au schéma existant : `IF NOT EXISTS` ne répare pas une ancienne table divergente.

   **La migration n’a pas été exécutée : la vérification de la base retourne `PrismaClientInitializationError` dans cet environnement. Aucune donnée réelle n’a été importée ou modifiée.** Sur l’environnement cible, vérifier la connexion et l’historique des migrations, puis appliquer la migration additive avec le processus habituel (`npx prisma migrate deploy`) et générer le client (`npx prisma generate`). Ne pas utiliser `migrate reset` ni relancer le seed général pour cette fonctionnalité.

   Dans `/admin/carousel`, le bouton « Importer les contenus historiques manquants » importe les huit slides seulement si la table est vide. Il ajoute les blocs absents sans modifier les blocs existants. L’opération est transactionnelle, avec isolation sérialisable ; en cas de modification concurrente, l’API renvoie un conflit et invite à réessayer.

   Sans slide enregistrée, les huit slides historiques servent de secours. Si des slides existent mais sont toutes désactivées, le carousel affiche un visuel neutre Mellplus. Supprimer toutes les slides rétablit les valeurs historiques : pour retirer toutes les promotions, les désactiver. Un bloc absent utilise sa valeur historique ; un bloc désactivé reste masqué. En cas d’indisponibilité d’une source, ses valeurs historiques sont utilisées sans bloquer l’autre source. Le premier rendu client utilise aussi les valeurs historiques pendant le chargement API.

   Seules les URL des images sont stockées. Les nouvelles images acceptent les chemins locaux et les URL HTTPS Cloudinary, conformément à `next.config.mjs`. Aucun second système d’upload n’a été ajouté.

7. **Routes et permissions**

   | Route | Comportement |
   | --- | --- |
   | `GET /api/home-content` | Accueil public, slides actifs triés, blocs et valeurs de secours ; pas de cache. |
   | `GET /api/carousel` | Slides actifs uniquement, sans métadonnées d’auteur. `?admin=true` donne la liste complète après autorisation. |
   | `POST /api/carousel` | Création, validation, ajout en fin de liste si aucun ordre indiqué. |
   | `GET /api/carousel/[id]` | Slide active publique ; lecture administrative explicite pour les autres. |
   | `PUT /api/carousel/[id]` | Modification partielle validée, y compris activation et ordre. |
   | `DELETE /api/carousel/[id]` | Suppression sans modifier les autres slides. |
   | `PUT /api/carousel/reorder` | Réorganisation atomique ; validation des identifiants et positions. |
   | `POST /api/carousel/import-defaults` | Import non écrasant décrit ci-dessus. |
   | `GET /api/visual-blocks` | Blocs publics ; un bloc désactivé vaut `null`. `?admin=true` donne les données d’édition. |
   | `PUT /api/visual-blocks/[key]` | Création/remplacement indépendant d’un emplacement autorisé. |
   | `POST /api/upload` | Service existant, autorisation renforcée. |

   Toutes les écritures et lectures administratives nécessitent une session et un compte actif `ADMIN` ou `SUPER_ADMIN`, relu dans la base à chaque requête. Les modérateurs et le support sont refusés. Cette politique reprend les rôles déjà utilisés par l’upload ; aucune nouvelle convention de permissions textuelles n’a été inventée.

8. **Vérifications**

   - `npm test` : 34 tests réussis, dont 13 nouveaux tests pour l’accueil.
   - Tests des vraies routes avec sessions et base simulées : lecture, CRUD, activation, ordre, rollback, blocs indépendants, rôles insuffisants/comptes révoqués, validation des URL/couleurs, import répété, valeurs par défaut et panne de base.
   - `npx prisma validate` : réussi.
   - `npx prisma generate` : réussi.
   - ESLint ciblé sur les fichiers concernés : réussi.
   - `npm run build` : réussi. Avertissement préexistant concernant `experimental.missingSuspenseWithCSRBailout` dans `next.config.mjs`.
   - `git diff --check` : réussi.
   - Aucune vérification d’intégration sur PostgreSQL réel ou migration appliquée ; aucun test navigateur automatisé.

9. **À vérifier dans le navigateur après déploiement de la migration**

   - Accueil desktop/tablette/mobile : hauteurs 500/520/540 px du carousel, bandes 128/160/540 px, textes en bas à gauche, images et overlays inchangés.
   - Rotation à 6 secondes, transition à 500 ms, flèches, points et barre de progression.
   - Import historique sur une table vide puis nouvel import sans duplication.
   - Création/modification/suppression, activation et déplacement d’une slide, y compris un fond uni et un dégradé personnalisé.
   - Modification indépendante de chaque bande, suppression des textes/liens et désactivation.
   - Upload Cloudinary avec la configuration réelle ; liens des boutons et des blocs.
   - Compte administrateur, compte sans autorisation, toutes les slides désactivées et absence de configuration.
