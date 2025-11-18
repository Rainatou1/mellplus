export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-white text-gray-900 py-12 px-6 md:px-20">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-blue-700 text-center">Mentions légales</h1>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">Éditeur du site</h2>
          <p>
            Nom de l&apos;entreprise : <strong>TonNomEntreprise</strong><br />
            Responsable de la publication : <strong>Ton Nom complet</strong><br />
            Email : <a href="mailto:contact@tonentreprise.com" className="text-blue-600">contact@tonentreprise.com</a><br />
            Adresse : 123 Rue Exemple, Ville, Pays<br />
            Numéro d’immatriculation : RCS XX-XXX-XXX
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">Hébergement</h2>
          <p>
            Hébergeur : <strong>LWS (Ligne Web Services)</strong><br />
            Adresse : 10 Rue Penthièvre, 75008 Paris, France<br />
            Site : <a href="https://www.lws.fr" className="text-blue-600" target="_blank">www.lws.fr</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus (textes, images, logos, etc.) présents sur ce site sont la propriété exclusive de <strong>TonNomEntreprise</strong>, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">Données personnelles</h2>
          <p>
            Les données personnelles collectées via les formulaires sont destinées uniquement à un usage interne et ne seront en aucun cas cédées ou vendues à des tiers. Conformément à la loi, vous disposez d’un droit d’accès, de modification et de suppression de vos données.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">Cookies</h2>
          <p>
            Ce site utilise des cookies à des fins de statistiques et d’amélioration de l’expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser les cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">Contact</h2>
          <p>
            Pour toute question, vous pouvez nous écrire à l’adresse suivante : <br />
            <a href="mailto:contact@tonentreprise.com" className="text-blue-600">contact@tonentreprise.com</a>
          </p>
        </section>
      </div>
    </main>
  );
}
