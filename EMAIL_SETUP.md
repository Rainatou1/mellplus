# E-mails Mellplus : OVH uniquement

## Variables locales et de production

```dotenv
OVH_USER="mellplus@mellplusniger.com"
OVH_PASSWORD=""
```

Remplacer la valeur vide par le mot de passe de cette boîte OVH, uniquement dans
l'environnement privé du serveur ou `.env.local` non versionné. Ne jamais renseigner
ce mot de passe dans le code, Git, `.env.example` ou une variable `NEXT_PUBLIC_*`.
Un mot de passe était présent dans l'ancien modèle : le renouveler chez OVH s'il était réel.
Le fichier `.env` est déjà suivi par Git malgré `.gitignore` : son mot de passe OVH a
également été vidé. La valeur locale est conservée uniquement dans `.env.local`, ignoré
par Git. Cette correction ne retire pas les secrets des anciens commits.
L'adresse officielle ci-dessus était déjà renseignée dans le projet.

Le transport est fixé dans `src/lib/email.js` : `smtp.mail.ovh.net`, port `465`,
`secure: true`, vérification TLS active. Aucun repli Gmail.
Les variables SMTP_HOST, SMTP_PORT et SMTP_SECURE ne sont pas nécessaires.
OVH_USER sert simultanément d'identifiant SMTP, d'expéditeur et de destinataire officiel.

Supprimer EMAIL_PROVIDER, EMAIL_USER, EMAIL_PASSWORD et, si présentes sur le serveur,
GMAIL_USER et GMAIL_APP_PASSWORD. Aucun mot de passe d'application Google n'est nécessaire.
ADMIN_EMAIL, CONTACT_EMAIL et MAIL_TO ne sont pas utilisés : aucun destinataire parallèle.

## Routage

| Message | from | to | replyTo |
| --- | --- | --- | --- |
| Notification Contact | OVH_USER | OVH_USER | Adresse du visiteur |
| Accusé Contact | OVH_USER | Adresse du visiteur | Non défini : réponse à OVH_USER |
| Notification Devis | OVH_USER | OVH_USER | Adresse du client |
| Accusé Devis | OVH_USER | Adresse du client | Non défini : réponse à OVH_USER |
| Alerte de connexion | OVH_USER | OVH_USER | Non défini |

Les cinq messages utilisent exclusivement le SMTP OVH.
Les informations du compte concerné restent dans le contenu de l'alerte de connexion.
L'adresse Gmail de `scripts/create-admin.js` identifie un compte de connexion existant ;
elle n'est plus un destinataire d'alerte. Changer ce compte est indépendant du SMTP.

La notification Contact conserve nom, e-mail, téléphone, entreprise, sujet, message et date.
Le texte de l'accusé reste identique, sauf l'adresse de signature qui devient OVH_USER.
Le champ replyTo est pris en charge par [Nodemailer](https://nodemailer.com/message).
Le port 465 utilise [TLS dès la connexion](https://nodemailer.com/smtp).

## Production OVH

Le code SMTP est identique en développement et en production. `next.config.mjs` et
`vercel.json` ne définissent pas de configuration SMTP alternative. Aucun accès au
processus distant ni procédure de déploiement OVH n'est disponible dans le dépôt :
les valeurs effectivement chargées sur le serveur restent à vérifier sur celui-ci.

1. Déployer les fichiers modifiés, notamment le module email et les routes Contact/Devis.
2. Définir OVH_USER et OVH_PASSWORD dans l'environnement du processus Node qui exécute
   le site (service, conteneur ou fichier privé dans le dossier de l'application).
   Conserver les autres variables nécessaires à la base de données et à NextAuth.
3. Contrôler les éventuels `.env.production.local`, `.env.local`, `.env.production`, `.env`
   et les variables du service : éliminer les valeurs OVH contradictoires et les anciennes
   variables Gmail. Les variables du processus ont priorité sur les fichiers ; `.env.local`
   peut également être chargé en production.
4. Construire avec `npm run build`, puis redémarrer le service Next.js selon le déploiement
   existant (`npm start` pour un lancement direct). Redémarrer après chaque changement
   d'identifiants pour que le processus les recharge.
5. Vérifier que le serveur peut joindre smtp.mail.ovh.net sur le port TCP 465.
6. Effectuer le test réel ci-dessous depuis le domaine de production.

## Tests

Tests automatisés sans envoi réel :

```sh
node --experimental-vm-modules --test tests/email.test.mjs
```

Ils couvrent les cinq fonctions d'envoi, le routage, replyTo, développement/production,
les anciennes variables ignorées, les identifiants absents, les échecs SMTP et les routes
Contact/Devis avec SMTP et base de données simulés.

Test réel en local puis en production :

1. Lancer le site local avec `npm run dev` après configuration de `.env.local`.
2. Remplir tous les champs du formulaire Contact avec une adresse visiteur que vous contrôlez,
   différente de la boîte officielle. Choisir un sujet unique (`Test OVH - date et heure`)
   et un message d'au moins dix caractères, puis envoyer une seule fois.
3. Dans la boîte OVH mellplus@mellplusniger.com, retrouver le sujet et vérifier tous les champs.
   Dans les en-têtes : From et To = boîte officielle ; Reply-To = adresse du visiteur.
4. Dans la boîte du visiteur, retrouver l'accusé avec son expéditeur officiel et son texte habituel.
   Vérifier aussi les indésirables des deux boîtes si nécessaire.
5. Depuis la notification dans la boîte officielle, cliquer sur Répondre : le destinataire du
   brouillon doit être le visiteur. Envoyer une réponse de test et vérifier sa réception.
6. Répéter sur le site de production. Si Gmail reçoit encore une copie, contrôler les éventuelles
   redirections configurées dans la messagerie OVH.

Le succès du formulaire confirme l'enregistrement en base, pas la livraison des e-mails.
Les routes conservent ce comportement même si SMTP échoue. Les journaux distinguent une
configuration absente, un envoi incomplet et des messages acceptés par SMTP. L'acceptation
SMTP ne prouve pas la réception finale : vérifier effectivement les deux boîtes.
