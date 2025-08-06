"use client";

import React, { useState } from 'react';
import { ChevronDown, Phone, Mail, MapPin, Search, ShoppingCart, User, Menu, X, Award, Send, MessageSquare, Clock, Users, CheckCircle } from 'lucide-react';

// Composant Header réutilisable
const Header = ({ isMenuOpen, setIsMenuOpen, activeCategory, setActiveCategory, isMobileSearchOpen, setIsMobileSearchOpen }) => {
  const categories = [
    { name: 'Informatique', subcategories: ['Ordinateurs', 'Composants', 'Périphériques', 'Réseaux'] },
    { name: 'Téléphonie', subcategories: ['Smartphones', 'Accessoires', 'Tablettes'] },
    { name: 'Électroménager', subcategories: ['Cuisine', 'Climatisation', 'Lavage'] },
    { name: 'Bureautique', subcategories: ['Imprimantes', 'Scanners', 'Fournitures'] }
  ];

  return (
    <>
      {/* Header Top - Hidden on mobile */}
      <div className="hidden lg:block bg-gray-800 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 xl:space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">+227 96 12 34 56</span>
              <span className="xl:hidden">96 12 34 56</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span className="hidden xl:inline">contact@mellplusniger.com</span>
              <span className="xl:hidden">contact@mell...</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Niamey, Niger</span>
            </div>
          </div>
          <div className="hidden xl:flex items-center space-x-4">
            <span>Lun-Ven: 8h-18h | Sam: 8h-16h</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg relative z-[100]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <div className="bg-blue-600 text-white p-2 md:p-3 rounded-lg mr-2 md:mr-3">
                <Award className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-800">Mell Plus Niger</h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Votre partenaire IT au Niger</p>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2 lg:top-3 w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Search Button */}
              <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account - Hidden on mobile */}
              <button className="hidden lg:flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <User className="w-5 h-5 lg:w-6 lg:h-6" />
                <span className="hidden xl:inline">Mon Compte</span>
              </button>

              {/* Cart */}
              <button className="flex items-center space-x-1 md:space-x-2 bg-blue-600 text-white px-2 md:px-4 py-2 rounded-lg hover:bg-blue-700">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Panier</span>
                <span className="hidden sm:inline">(0)</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="md:hidden pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-3 w-6 h-6 text-gray-400" />
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:block border-t border-gray-200 relative">
            <div className="flex items-center space-x-4 lg:space-x-8 py-4 overflow-x-auto">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => setActiveCategory(index)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 py-2 whitespace-nowrap">
                    <span>{category.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown */}
                  {activeCategory === index && (
                    <div className="absolute top-full left-0 bg-white shadow-xl border rounded-lg p-4 min-w-48 z-[9999] transform translate-y-1">
                      {category.subcategories.map((sub, subIndex) => (
                        <a
                          key={subIndex}
                          href="#"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          {sub}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href="#" className="text-gray-700 hover:text-blue-600 py-2 whitespace-nowrap">Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 py-2 whitespace-nowrap">Support</a>
              <a href="#" className="text-red-600 hover:text-red-700 py-2 font-semibold whitespace-nowrap">Promotions</a>
            </div>
          </nav>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index}>
                    <button 
                      onClick={() => setActiveCategory(activeCategory === index ? null : index)}
                      className="flex items-center justify-between w-full text-left text-gray-700 hover:text-blue-600 py-2"
                    >
                      <span>{category.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeCategory === index ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {activeCategory === index && (
                      <div className="pl-4 space-y-2 mt-2">
                        {category.subcategories.map((sub, subIndex) => (
                          <a
                            key={subIndex}
                            href="#"
                            className="block py-2 text-gray-600 hover:text-blue-600"
                          >
                            {sub}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <a href="#" className="block text-gray-700 hover:text-blue-600 py-2">Services</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600 py-2">Support</a>
                <a href="#" className="block text-red-600 hover:text-red-700 py-2 font-semibold">Promotions</a>
                
                {/* Mobile Account Link */}
                <a href="#" className="block text-gray-700 hover:text-blue-600 py-2 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Mon Compte</span>
                  </div>
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

const ContactDevisPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    sujet: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire soumis:', formData);
    // Ici vous pouvez ajouter la logique d'envoi
    alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header réutilisable */}
      <Header 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        isMobileSearchOpen={isMobileSearchOpen}
        setIsMobileSearchOpen={setIsMobileSearchOpen}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li><a href="#" className="text-blue-600 hover:text-blue-700">Accueil</a></li>
              <li className="text-gray-500">›</li>
              <li className="text-gray-700">Contact & Devis</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions et établir un devis personnalisé
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white relative -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border-t-4 border-blue-600">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
              <p className="text-gray-600 mb-2">Lun-Ven: 8h-18h | Sam: 8h-16h</p>
              <p className="text-lg font-semibold text-blue-600">+227 96 12 34 56</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center border-t-4 border-green-600">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Réponse sous 24h</p>
              <p className="text-lg font-semibold text-green-600">contact@mellplusniger.com</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center border-t-4 border-orange-600">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adresse</h3>
              <p className="text-gray-600 mb-2">Showroom & Bureau</p>
              <p className="text-lg font-semibold text-orange-600">Avenue de l'Uranium, Niamey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                {/* Tabs */}
                <div className="flex border-b mb-6">
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-6 py-3 font-semibold ${
                      activeTab === 'contact'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 inline mr-2" />
                    Contact
                  </button>
                  <button
                    onClick={() => setActiveTab('devis')}
                    className={`px-6 py-3 font-semibold ${
                      activeTab === 'devis'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
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

                  {/* Champs spécifiques selon l'onglet */}
                  {activeTab === 'devis' && (
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
                            <option value="electromenager">Électroménager</option>
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
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {activeTab === 'contact' ? 'Votre message *' : 'Description détaillée de vos besoins *'}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder={activeTab === 'contact' 
                        ? 'Décrivez votre demande...' 
                        : 'Décrivez précisément vos besoins : quantités, spécifications, contraintes, délais...'
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>{activeTab === 'contact' ? 'Envoyer le message' : 'Demander un devis'}</span>
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
                      <p className="text-gray-600 text-sm">Réponse garantie sous 48h</p>
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
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Horaires d'ouverture</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi:</span>
                    <span className="font-semibold">8h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi:</span>
                    <span className="font-semibold">8h00 - 16h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche:</span>
                    <span className="text-red-600">Fermé</span>
                  </div>
                </div>
              </div>

              {/* Contact rapide */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Contact rapide</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Besoin d'une réponse immédiate ? Appelez-nous directement !
                </p>
                <a 
                  href="tel:+22796123456"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>+227 96 12 34 56</span>
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
