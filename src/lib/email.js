import nodemailer from 'nodemailer'

// Configuration du service email
const createTransport = () => {
  // Configuration SMTP plus robuste
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true pour 465, false pour les autres ports
    auth: {
      user: process.env.EMAIL_USER, // Email utilisé pour envoyer
      pass: process.env.EMAIL_PASSWORD // Mot de passe d'application Gmail
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

// Template HTML pour l'email de notification
const createContactEmailTemplate = (contactData) => {
  const { name, email, phone, company, subject, message, createdAt } = contactData

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouveau message de contact - Mell Plus Niger</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3730a3); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #3b82f6; }
        .message-box { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .footer { margin-top: 20px; padding: 15px; background: #1f2937; color: white; text-align: center; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Nouveau message de contact</h1>
          <p>Un visiteur a envoyé un message via le site web de Mell Plus Niger</p>
        </div>

        <div class="content">
          <div class="field">
            <div class="label">👤 Nom complet:</div>
            <div class="value">${name}</div>
          </div>

          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value">${email}</div>
          </div>

          ${phone ? `
          <div class="field">
            <div class="label">📞 Téléphone:</div>
            <div class="value">${phone}</div>
          </div>
          ` : ''}

          ${company ? `
          <div class="field">
            <div class="label">🏢 Entreprise:</div>
            <div class="value">${company}</div>
          </div>
          ` : ''}

          <div class="field">
            <div class="label">📋 Sujet:</div>
            <div class="value">${subject}</div>
          </div>

          <div class="field">
            <div class="label">💬 Message:</div>
            <div class="message-box">${message}</div>
          </div>

          <div class="field">
            <div class="label">🕒 Date d'envoi:</div>
            <div class="value">${new Date(createdAt).toLocaleString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Mell Plus Niger</strong></p>
          <p>MELL PLUS Informatique, Blvd Mali Bero, Niamey</p>
          <p>📞 +227 20 35 23 23 | 📧 binome296@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Fonction pour envoyer un email de notification
export async function sendContactNotification(contactData) {
  try {
    const transporter = createTransport()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'binome296@gmail.com', // Email de destination
      subject: `🔔 Nouveau message de contact: ${contactData.subject}`,
      html: createContactEmailTemplate(contactData),
      // Version texte pour les clients qui ne supportent pas HTML
      text: `
Nouveau message de contact - Mell Plus Niger

Nom: ${contactData.name}
Email: ${contactData.email}
${contactData.phone ? `Téléphone: ${contactData.phone}` : ''}
${contactData.company ? `Entreprise: ${contactData.company}` : ''}
Sujet: ${contactData.subject}

Message:
${contactData.message}

Date: ${new Date(contactData.createdAt).toLocaleString('fr-FR')}
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email de notification envoyé:', result.messageId)
    return { success: true, messageId: result.messageId }

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return { success: false, error: error.message }
  }
}

// Fonction pour envoyer un email de confirmation automatique au visiteur
export async function sendContactConfirmation(contactData) {
  try {
    const transporter = createTransport()

    const confirmationTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmation de réception - Mell Plus Niger</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 20px; padding: 15px; background: #1f2937; color: white; text-align: center; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Message reçu avec succès</h1>
            <p>Merci de nous avoir contactés, ${contactData.name}!</p>
          </div>

          <div class="content">
            <p>Bonjour <strong>${contactData.name}</strong>,</p>

            <p>Nous avons bien reçu votre message concernant: <strong>${contactData.subject}</strong></p>

            <p>Notre équipe va examiner votre demande et vous répondra dans les plus brefs délais, généralement sous 24h.</p>

            <p>En attendant, n'hésitez pas à:</p>
            <ul>
              <li>📞 Nous appeler au +227 20 35 23 23</li>
              <li>🌐 Visiter notre site web pour découvrir nos produits et services</li>
              <li>📍 Nous rendre visite à notre magasin: MELL PLUS Informatique, Blvd Mali Bero, Niamey</li>
            </ul>

            <p>Merci de votre confiance!</p>

            <p><strong>L'équipe Mell Plus Niger</strong></p>
          </div>

          <div class="footer">
            <p><strong>Mell Plus Niger</strong></p>
            <p>Votre partenaire IT au Niger</p>
            <p>📞 +227 20 35 23 23 | 📧 binome296@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contactData.email,
      subject: '✅ Confirmation de réception - Mell Plus Niger',
      html: confirmationTemplate
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email de confirmation envoyé à:', contactData.email)
    return { success: true, messageId: result.messageId }

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la confirmation:', error)
    return { success: false, error: error.message }
  }
}

// Template HTML pour l'alerte de connexion
const createLoginAlertTemplate = (loginData) => {
  const { adminEmail, success, ip, userAgent, timestamp, failedEmail } = loginData

  const statusColor = success ? '#059669' : '#dc2626'
  const statusIcon = success ? '✅' : '⚠️'
  const statusText = success ? 'Connexion réussie' : 'Tentative de connexion échouée'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Alerte de connexion - Mell Plus Niger Admin</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${statusColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { background: white; padding: 10px; border-radius: 4px; border-left: 4px solid ${statusColor}; }
        .warning { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .footer { margin-top: 20px; padding: 15px; background: #1f2937; color: white; text-align: center; border-radius: 8px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusIcon} ${statusText}</h1>
          <p>Alerte de sécurité - Panneau d'administration Mell Plus</p>
        </div>

        <div class="content">
          ${!success ? `
          <div class="warning">
            <strong>⚠️ Attention!</strong> Une tentative de connexion échouée a été détectée sur votre compte administrateur.
          </div>
          ` : ''}

          <div class="field">
            <div class="label">📧 Compte concerné:</div>
            <div class="value">${success ? adminEmail : failedEmail}</div>
          </div>

          <div class="field">
            <div class="label">🕒 Date et heure:</div>
            <div class="value">${new Date(timestamp).toLocaleString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</div>
          </div>

          <div class="field">
            <div class="label">🌐 Adresse IP:</div>
            <div class="value">${ip || 'Non disponible'}</div>
          </div>

          <div class="field">
            <div class="label">💻 Navigateur/Appareil:</div>
            <div class="value">${userAgent || 'Non disponible'}</div>
          </div>

          ${!success ? `
          <div class="warning">
            <p><strong>Si ce n'était pas vous:</strong></p>
            <ul>
              <li>Changez immédiatement votre mot de passe</li>
              <li>Vérifiez les activités récentes sur votre compte</li>
              <li>Contactez l'équipe technique si nécessaire</li>
            </ul>
          </div>
          ` : `
          <div class="field">
            <div class="label">✅ Statut:</div>
            <div class="value">Connexion réussie. Si ce n'était pas vous, changez votre mot de passe immédiatement.</div>
          </div>
          `}
        </div>

        <div class="footer">
          <p><strong>Mell Plus Niger - Administration</strong></p>
          <p>Cet email a été envoyé automatiquement pour la sécurité de votre compte</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Fonction pour envoyer une alerte de connexion
export async function sendLoginAlert(loginData) {
  try {
    const transporter = createTransport()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: loginData.adminEmail || loginData.failedEmail,
      subject: loginData.success
        ? '✅ Nouvelle connexion à votre compte admin - Mell Plus'
        : '⚠️ Tentative de connexion échouée - Mell Plus',
      html: createLoginAlertTemplate(loginData)
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Alerte de connexion envoyée:', result.messageId)
    return { success: true, messageId: result.messageId }

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'alerte:', error)
    return { success: false, error: error.message }
  }
}

// Template HTML pour l'email de notification de devis
const createQuoteEmailTemplate = (quoteData) => {
  const { name, email, phone, company, type, subject, message, budget, deadline, items, createdAt } = quoteData

  // Calculer le total si les items existent
  const total = items ? items.reduce((sum, item) => sum + (item.totalPrice || 0), 0) : 0

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle demande de devis - Mell Plus Niger</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed, #5b21b6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #7c3aed; }
        .message-box { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .items-table th { background: #7c3aed; color: white; padding: 10px; text-align: left; }
        .items-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .total-row { font-weight: bold; background: #f3f4f6; }
        .footer { margin-top: 20px; padding: 15px; background: #1f2937; color: white; text-align: center; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💼 Nouvelle demande de devis</h1>
          <p>Un client a demandé un devis via le site web de Mell Plus Niger</p>
        </div>

        <div class="content">
          <div class="field">
            <div class="label">👤 Nom complet:</div>
            <div class="value">${name}</div>
          </div>

          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value">${email}</div>
          </div>

          <div class="field">
            <div class="label">📞 Téléphone:</div>
            <div class="value">${phone}</div>
          </div>

          ${company ? `
          <div class="field">
            <div class="label">🏢 Entreprise:</div>
            <div class="value">${company}</div>
          </div>
          ` : ''}

          <div class="field">
            <div class="label">📋 Type de demande:</div>
            <div class="value">${type || 'Non spécifié'}</div>
          </div>

          ${subject ? `
          <div class="field">
            <div class="label">📝 Sujet:</div>
            <div class="value">${subject}</div>
          </div>
          ` : ''}

          ${budget ? `
          <div class="field">
            <div class="label">💰 Budget:</div>
            <div class="value">${budget}</div>
          </div>
          ` : ''}

          ${deadline ? `
          <div class="field">
            <div class="label">⏰ Délai souhaité:</div>
            <div class="value">${new Date(deadline).toLocaleDateString('fr-FR')}</div>
          </div>
          ` : ''}

          ${message ? `
          <div class="field">
            <div class="label">💬 Description des besoins:</div>
            <div class="message-box">${message}</div>
          </div>
          ` : ''}

          ${items && items.length > 0 ? `
          <div class="field">
            <div class="label">📦 Articles demandés:</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Qté</th>
                  <th>Prix unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr>
                    <td>${item.name || item.customItem || 'Article personnalisé'}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice ? new Intl.NumberFormat('fr-NE', { style: 'currency', currency: 'XOF' }).format(item.unitPrice) : '-'}</td>
                    <td>${item.totalPrice ? new Intl.NumberFormat('fr-NE', { style: 'currency', currency: 'XOF' }).format(item.totalPrice) : '-'}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="3">Total estimé</td>
                  <td>${new Intl.NumberFormat('fr-NE', { style: 'currency', currency: 'XOF' }).format(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          ` : ''}

          <div class="field">
            <div class="label">🕒 Date de la demande:</div>
            <div class="value">${new Date(createdAt).toLocaleString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Mell Plus Niger</strong></p>
          <p>MELL PLUS Informatique, Blvd Mali Bero, Niamey</p>
          <p>📞 +227 20 35 23 23 | 📧 binome296@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Fonction pour envoyer un email de notification pour un devis
export async function sendQuoteNotification(quoteData) {
  try {
    const transporter = createTransport()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'binome296@gmail.com', // Email de destination
      subject: `💼 Nouvelle demande de devis: ${quoteData.name}`,
      html: createQuoteEmailTemplate(quoteData),
      // Version texte pour les clients qui ne supportent pas HTML
      text: `
Nouvelle demande de devis - Mell Plus Niger

Nom: ${quoteData.name}
Email: ${quoteData.email}
Téléphone: ${quoteData.phone}
${quoteData.company ? `Entreprise: ${quoteData.company}` : ''}
Type: ${quoteData.type || 'Non spécifié'}
${quoteData.budget ? `Budget: ${quoteData.budget}` : ''}

${quoteData.message ? `Description:\n${quoteData.message}` : ''}

Date: ${new Date(quoteData.createdAt).toLocaleString('fr-FR')}
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email de notification de devis envoyé:', result.messageId)
    return { success: true, messageId: result.messageId }

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de devis:', error)
    return { success: false, error: error.message }
  }
}

// Fonction pour envoyer un email de confirmation au client pour le devis
export async function sendQuoteConfirmation(quoteData) {
  try {
    const transporter = createTransport()

    const confirmationTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmation de demande de devis - Mell Plus Niger</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 20px; padding: 15px; background: #1f2937; color: white; text-align: center; border-radius: 8px; }
          .highlight { background: #d1fae5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Demande de devis reçue</h1>
            <p>Merci pour votre confiance, ${quoteData.name}!</p>
          </div>

          <div class="content">
            <p>Bonjour <strong>${quoteData.name}</strong>,</p>

            <p>Nous avons bien reçu votre demande de devis et nous vous en remercions.</p>

            <div class="highlight">
              <strong>⏱️ Prochaines étapes:</strong>
              <ul>
                <li>Notre équipe commerciale va étudier votre demande dans les prochaines heures</li>
                <li>Vous recevrez un devis détaillé sous 12 à 24h maximum</li>
                <li>Un conseiller pourra vous contacter pour préciser certains détails si nécessaire</li>
              </ul>
            </div>

            <p><strong>Récapitulatif de votre demande:</strong></p>
            <ul>
              <li>📧 Email: ${quoteData.email}</li>
              <li>📞 Téléphone: ${quoteData.phone}</li>
              ${quoteData.company ? `<li>🏢 Entreprise: ${quoteData.company}</li>` : ''}
              ${quoteData.budget ? `<li>💰 Budget: ${quoteData.budget}</li>` : ''}
            </ul>

            <p>En attendant notre réponse, n'hésitez pas à:</p>
            <ul>
              <li>📞 Nous appeler au +227 20 35 23 23</li>
              <li>🌐 Consulter notre catalogue en ligne</li>
              <li>📍 Visiter notre showroom: MELL PLUS Informatique, Blvd Mali Bero, Niamey</li>
            </ul>

            <p>Merci de votre confiance!</p>

            <p><strong>L'équipe commerciale Mell Plus Niger</strong></p>
          </div>

          <div class="footer">
            <p><strong>Mell Plus Niger</strong></p>
            <p>Votre partenaire IT au Niger</p>
            <p>📞 +227 20 35 23 23 | 📧 binome296@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: quoteData.email,
      subject: '✅ Confirmation de votre demande de devis - Mell Plus Niger',
      html: confirmationTemplate
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email de confirmation de devis envoyé à:', quoteData.email)
    return { success: true, messageId: result.messageId }

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la confirmation de devis:', error)
    return { success: false, error: error.message }
  }
}

