# Configuration Email pour Mell Plus Niger

## 📧 Configuration Gmail

Pour que les notifications email fonctionnent, vous devez configurer un compte Gmail avec un mot de passe d'application.

### Étapes de configuration:

1. **Activer la validation en deux étapes sur votre compte Gmail**
   - Allez sur https://myaccount.google.com/security
   - Activez la "Validation en 2 étapes"

2. **Générer un mot de passe d'application**
   - Allez sur https://myaccount.google.com/apppasswords
   - Sélectionnez "Autre (nom personnalisé)"
   - Tapez "Mell Plus Website"
   - Copiez le mot de passe généré (16 caractères)

3. **Mettre à jour le fichier .env.local**
   ```
   EMAIL_USER="rainatouboubacars@gmail.com"
   EMAIL_PASSWORD="votre-mot-de-passe-application-16-caracteres"
   ```

### 🔧 Configuration actuelle

- **Email de destination**: rainatouboubacars@gmail.com
- **Fonctionnalités**:
  - ✅ Notification admin quand un visiteur envoie un message
  - ✅ Email de confirmation automatique au visiteur
  - ✅ Templates HTML professionnels
  - ✅ Gestion d'erreur (le site continue de fonctionner même si l'email échoue)

### 📋 Test de fonctionnement

1. Configurez les variables d'environnement
2. Redémarrez le serveur de développement: `npm run dev`
3. Allez sur http://localhost:3000/contact
4. Envoyez un message test
5. Vérifiez:
   - L'email de notification dans la boîte de rainatouboubacars@gmail.com
   - L'email de confirmation dans la boîte de l'expéditeur

### 🚨 Sécurité

- ⚠️ Ne jamais utiliser votre mot de passe Gmail principal
- ✅ Utilisez uniquement des mots de passe d'application
- 🔒 Le fichier .env.local ne doit jamais être committé dans Git

### 🐛 Dépannage

**Erreur "Invalid login"**:
- Vérifiez que la validation en 2 étapes est activée
- Vérifiez que vous utilisez un mot de passe d'application
- Assurez-vous que l'email est correct

**Emails non reçus**:
- Vérifiez les spams/indésirables
- Vérifiez les logs du serveur de développement
- Testez avec un autre email

### 📞 Support

En cas de problème, contactez l'équipe technique avec:
- Les messages d'erreur exacts
- Les logs du serveur
- La configuration utilisée (sans le mot de passe)