import nodemailer from 'nodemailer'

// Configuration du service email
const createTransporter = () => {
  // Pour Gmail ou tout autre service SMTP
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Email utilisé pour envoyer
      pass: process.env.EMAIL_PASSWORD // Mot de passe d'application Gmail
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
          <p>📞 +227 20 35 23 23 | 📧 mellplus@mellplusniger.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Fonction pour envoyer un email de notification
export async function sendContactNotification(contactData) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'mellplus@mellplusniger.com', // Email de destination
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
    const transporter = createTransporter()

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
            <p>📞 +227 20 35 23 23 | 📧 mellplus@mellplusniger.com</p>
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