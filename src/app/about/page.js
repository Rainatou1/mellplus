// src/app/a-propos/page.js (ou /about/page.js selon ta structure)

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 py-12 px-6 md:px-20">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">À propos de nous</h1>

        <p className="text-lg mb-6 text-center max-w-2xl mx-auto">
          Nous sommes une entreprise passionnée par l’innovation technologique, spécialisée dans
          la vente de matériel informatique et le développement de solutions web et mobiles adaptées
          aux besoins des entreprises modernes.
        </p>

        <div className="grid md:grid-cols-2 gap-10 my-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Nos valeurs</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>💡 Innovation constante</li>
              <li>🤝 Engagement envers la satisfaction client</li>
              <li>🌱 Développement durable et éthique</li>
              <li>🔒 Sécurité et confidentialité garanties</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Pourquoi nous choisir ?</h2>
            <p className="text-gray-700 mb-2">
              Chez <strong>Mell plus</strong>, chaque projet est traité avec soin et expertise.
              Nous combinons les dernières technologies avec une approche humaine pour offrir
              des solutions personnalisées, fiables et performantes.
            </p>
            <p className="text-gray-700">
              Notre équipe est composée de passionnés prêts à relever tous vos défis numériques.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-10 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Envie de collaborer avec nous ?</h3>
          <p className="mb-4">Contactez-nous dès aujourd’hui pour discuter de votre projet !</p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            Nous contacter
          </a>
        </div>
      </section>
    </main>
  );
}
