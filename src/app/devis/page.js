"use client";
import React, { useState } from 'react';
import { ChevronDown, Phone, Mail, MapPin, Search, ShoppingCart, User, Menu, X, Award, Send, MessageSquare, Clock, Users, CheckCircle } from 'lucide-react';

const ContactDevisPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    message: '',
    typeDevis: 'informatique',
    budget: '',
    urgence: 'normale'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Préparer les données pour l'API
    const quoteData = {
      name: `${formData.nom} ${formData.prenom}`,
      email: formData.email,
      phone: formData.telephone,
      company: formData.entreprise || undefined,
      type: 'mixed', // Type générique
      subject: `Demande de devis - ${formData.typeDevis}`,
      message: formData.message,
      budget: formData.budget || undefined,
      deadline: formData.urgence === 'urgente' ?
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() :
        new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      items: [{
        type: 'custom',
        name: `Demande ${formData.typeDevis}`,
        description: formData.message,
        quantity: 1,
        unitPrice: 1,
        totalPrice: 1
      }]
    };

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          entreprise: '',
          message: '',
          typeDevis: 'informatique',
          budget: '',
          urgence: 'normale'
        });
        alert('✅ Votre demande de devis a été envoyée avec succès ! Nous vous répondrons dans les plus brefs délais.');
      } else {
        setSubmitStatus('error');
        alert('❌ Une erreur est survenue. Veuillez réessayer.');
        console.error(result);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setSubmitStatus('error');
      alert('❌ Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li><a href="#" className="text-blue-600 hover:text-blue-700">Accueil</a></li>
              <li className="text-gray-500">›</li>
              <li className="text-gray-700">Demande de devis</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Demandez un devis
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Notre équipe d&apos;experts est à votre disposition pour établir un devis personnalisé
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white relative -mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border-t-4 border-blue-600">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
              <p className="text-gray-600 mb-2">Lun-Ven: 8h-18h | Sam: 8h-16h</p>
              <p className="text-lg font-semibold text-blue-600">+227 20 35 23 23</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center border-t-4 border-green-600">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Réponse sous 12h</p>
              <p className="text-lg font-semibold text-green-600">mellplus@mellplusniger.com</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center border-t-4 border-orange-600">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adresse</h3>
              <p className="text-gray-600 mb-2">Showroom & Bureau</p>
              <p className="text-lg font-semibold text-orange-600">Boulevard Mali Béro Ex Kalao Porte N°2770, Niamey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                {/* Tabs */}
                <div className="flex border-b mb-6">
                  
                  <button className="px-6 py-3 font-semibold border-b-2 border-blue-600 text-blue-600">
                    <Send className="w-5 h-5 inline mr-2" />
                    Demande de devis
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations personnelles */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Informations personnelles</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entreprise / Organisation
                      </label>
                      <input
                        type="text"
                        name="entreprise"
                        value={formData.entreprise}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>                  
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Détails du devis</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de produit *
                          </label>
                          <select
                            name="typeDevis"
                            value={formData.typeDevis}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="informatique">Matériel informatique</option>
                            <option value="telephonie">Téléphonie</option>
                            <option value="electromenager">Accessoire</option>
                            <option value="bureautique">Bureautique</option>
                            <option value="mixte">Plusieurs catégories</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget approximatif
                          </label>
                          <select
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Sélectionner un budget</option>
                            <option value="moins-100k">Moins de 100 000 FCFA</option>
                            <option value="100k-500k">100 000 - 500 000 FCFA</option>
                            <option value="500k-1m">500 000 - 1 000 000 FCFA</option>
                            <option value="1m-5m">1 000 000 - 5 000 000 FCFA</option>
                            <option value="plus-5m">Plus de 5 000 000 FCFA</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Urgence
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="urgence"
                              value="normale"
                              checked={formData.urgence === 'normale'}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            Normale (7-10 jours)
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="urgence"
                              value="urgente"
                              checked={formData.urgence === 'urgente'}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            Urgente (2-3 jours)
                          </label>
                        </div>
                      </div>
                    </div>
                  

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description détaillée de vos besoins *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Décrivez précisément vos besoins : quantités, spécifications, contraintes, délais..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Demander un devis</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pourquoi nous choisir */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Pourquoi nous choisir ?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Réponse rapide</h4>
                      <p className="text-gray-600 text-sm">Réponse garantie sous 12h</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Devis gratuit</h4>
                      <p className="text-gray-600 text-sm">Étude personnalisée sans engagement</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Expertise locale</h4>
                      <p className="text-gray-600 text-sm">Connaissance du marché nigérien</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">SAV premium</h4>
                      <p className="text-gray-600 text-sm">Support technique professionnel</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horaires */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Horaires d&apos;ouverture</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi:</span>
                    <span className="font-semibold">8h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi:</span>
                    <span className="font-semibold">8h00 - 16h00</span>
                  </div>
                  {/*<div className="flex justify-between">
                    <span>Dimanche:</span>
                    <span className="text-red-600">Fermé</span>
                  </div>*/}
                </div>
              </div>

              {/* Contact rapide */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Contact rapide</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Besoin d&apos;une réponse immédiate ? Appelez-nous directement !
                </p>
                <a 
                  href="tel:+22796123456"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>+227 99 86 01 01</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
export default ContactDevisPage;
