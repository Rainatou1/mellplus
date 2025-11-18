"use client";
import Link from 'next/link'

import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Zap, 
  Network, 
  Code2,
  Settings,
  Shield,
  Sun,
  Cpu,
  Wifi,
  Camera,
  GraduationCap,
  Wrench,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Award,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Globe,
  Database,
  Server,
  Lock,
  Eye,
  Lightbulb,
  Cable,
  HardDrive,
  BookOpen,
  Target
} from 'lucide-react';

const AllServicesPage = () => {
  const [activeService, setActiveService] = useState('digital');

  const serviceCategories = {
    digital: {
      title: 'Digital & Web',
      icon: Monitor,
      color: 'from-blue-500 to-cyan-500',
      services: [
        {
          title: 'Sites Internet',
          description: 'Développement de sites web modernes, responsive et optimisés SEO',
          icon: Globe,
          features: ['Sites vitrines', 'E-commerce', 'Applications web', 'CMS sur mesure', 'Optimisation SEO', 'Hébergement']
        },
        {
          title: 'Applications Mobiles',
          description: 'Création d\'applications iOS et Android natives et performantes',
          icon: Smartphone,
          features: ['Apps natives iOS/Android', 'Interface intuitive', 'Synchronisation cloud', 'Notifications push', 'App Store deployment', 'Maintenance']
        }
      ]
    },
    energy: {
      title: 'Énergie & Électricité',
      icon: Zap,
      color: 'from-yellow-600 to-orange-800',
      services: [
        {
          title: 'Installation Électrique',
          description: 'Installation complète de systèmes électriques résidentiels et commerciaux',
          icon: Zap,
          features: ['Tableaux électriques', 'Éclairage LED', 'Prises & interrupteurs', 'Mise aux normes', 'Domotique', 'Diagnostic électrique']
        },
        {
          title: 'Énergie Solaire',
          description: 'Installation de panneaux solaires et systèmes photovoltaïques',
          icon: Sun,
          features: ['Panneaux photovoltaïques', 'Onduleurs', 'Batteries de stockage', 'Monitoring', 'Raccordement réseau', 'Maintenance préventive']
        }
      ]
    },
    network: {
      title: 'Réseaux & Câblage',
      icon: Network,
      color: 'from-green-500 to-teal-500',
      services: [
        {
          title: 'Câblage Réseau',
          description: 'Installation et structuration de réseaux informatiques professionnels',
          icon: Cable,
          features: ['Câblage structuré', 'Fibre optique', 'Baies de brassage', 'Points d\'accès Wi-Fi', 'Switch & routeurs', 'Tests & certification']
        },
        {
          title: 'Infrastructure Réseau',
          description: 'Conception et déploiement d\'infrastructures réseau complètes',
          icon: Server,
          features: ['Architecture réseau', 'VLAN & sécurité', 'Serveurs', 'Sauvegarde', 'Monitoring', 'Support technique']
        }
      ]
    },
    software: {
      title: 'Applications & Logiciels',
      icon: Code2,
      color: 'from-purple-500 to-indigo-500',
      services: [
        {
          title: 'Logiciels Sur Mesure',
          description: 'Développement de solutions logicielles adaptées à vos besoins spécifiques',
          icon: Cpu,
          features: ['Analyse des besoins', 'Architecture logicielle', 'Interface utilisateur', 'Base de données', 'Tests & validation', 'Documentation']
        },
        {
          title: 'Applications Métier',
          description: 'Création d\'applications dédiées à votre secteur d\'activité',
          icon: Database,
          features: ['CRM personnalisé', 'ERP sur mesure', 'Gestion de stock', 'Facturation', 'Reporting avancé', 'Intégrations API']
        }
      ]
    },
    maintenance: {
      title: 'Formation & Maintenance',
      icon: Settings,
      color: 'from-red-500 to-pink-500',
      services: [
        {
          title: 'Maintenance Informatique',
          description: 'Maintenance préventive et curative de vos équipements informatiques',
          icon: Wrench,
          features: ['Diagnostic matériel', 'Réparation PC/Mac', 'Nettoyage système', 'Mise à jour logiciels', 'Sauvegarde données', 'Support à distance']
        },
        {
          title: 'Formation & Conseil',
          description: 'Formation de vos équipes et conseil en stratégie digitale',
          icon: GraduationCap,
          features: ['Formation utilisateurs', 'Conseil stratégique', 'Audit informatique', 'Accompagnement digital', 'Documentation', 'Support continu']
        }
      ]
    },
    security: {
      title: 'Sécurité & Surveillance',
      icon: Shield,
      color: 'from-gray-500 to-slate-600',
      services: [
        {
          title: 'Vidéosurveillance',
          description: 'Installation de systèmes de surveillance et caméras de sécurité',
          icon: Camera,
          features: ['Caméras IP/analogiques', 'Enregistrement HD/4K', 'Vision nocturne', 'Détection mouvement', 'Accès à distance', 'Stockage cloud']
        },
        {
          title: 'Sécurité Informatique',
          description: 'Protection de vos systèmes contre les menaces cybernétiques',
          icon: Lock,
          features: ['Antivirus professionnel', 'Firewall', 'Chiffrement données', 'Audit sécurité', 'Formation cyber-sécurité', 'Plan de continuité']
        }
      ]
    }
  };

  const packages = {
    digital: [
      { name: 'Starter', price: '300KFCFA', duration: '2-3 sem' },
      { name: 'Business', price: '500KFCFA', duration: '4-6 sem' },
      { name: 'Enterprise', price: '700KFCFA', duration: '6-10 sem' }
    ],
    energy: [
      { name: 'Résidentiel', price: 'Sur devis', duration: '1-2 jours' },
      { name: 'Commercial', price: 'Sur devis', duration: '3-5 jours' },
      { name: 'Industriel', price: 'Sur devis', duration: '1-2 sem' }
    ],
    network: [
      { name: 'PME', price: 'Sur devis', duration: '2-3 jours' },
      { name: 'Entreprise', price: 'Sur devis', duration: '1 sem' },
      { name: 'Infrastructure', price: 'Sur devis', duration: '2-4 sem' }
    ],
    software: [
      { name: 'Simple', price: '500KFCFA', duration: '4-6 sem' },
      { name: 'Avancé', price: '700KFCFA', duration: '8-12 sem' },
      { name: 'Complexe', price: 'Sur devis', duration: '12+ sem' }
    ],
    maintenance: [
      { name: 'Ponctuel', price: '10KFCFA€/h', duration: 'Immédiat' },
      { name: 'Mensuel', price: '200KFCA/mois', duration: 'Continu' },
      { name: 'Annuel', price: '900FCFA€/an', duration: 'Continu' }
    ],
    security: [
      { name: 'Basique', price: '15KFCFA', duration: '1 jour' },
      { name: 'Avancé', price: '300KFCFA', duration: '2-3 jours' },
      { name: 'Professionnel', price: 'Sur devis', duration: '1 sem' }
    ]
  };

  const stats = [
    { number: '500+', label: 'Projets réalisés', icon: Target },
    { number: '98%', label: 'Clients satisfaits', icon: Star },
    { number: '24/7', label: 'Support disponible', icon: Phone },
    { number: '6+', label: 'Domaines d\'expertise', icon: Award }
  ];

  const testimonials = [
    {
      name: 'Anonyme',
      company: 'Entreprise BTP',
      text: 'Installation électrique complète de nos bureaux. Travail impeccable, équipe professionnelle.',
      service: 'Électricité',
      rating: 5
    },
    {
      name: 'Anonyme',
      company: 'Boutique en ligne',
      text: 'Site e-commerce et app mobile parfaits. Nos ventes ont explosé depuis le lancement !',
      service: 'Digital',
      rating: 5
    },
    {
      name: 'Anonyme',
      company: 'Cabinet médical',
      text: 'Système de surveillance et logiciel de gestion sur mesure. Excellente prestation.',
      service: 'Sécurité & Logiciel',
      rating: 5
    }
  ];

  const currentCategory = serviceCategories[activeService];
  const currentPackages = packages[activeService];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Tous nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Services</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              De la conception digitale à l&apos;installation électrique, nous couvrons tous vos besoins technologiques avec expertise et professionnalisme
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.entries(serviceCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveService(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    activeService === key
                      ? `bg-gradient-to-r ${category.color} text-white`
                      : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span>{category.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}{/*
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Service Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden">
          {/* Category Header */}
          <div className={`bg-gradient-to-r ${currentCategory.color} p-8`}>
            <div className="flex items-center justify-center space-x-4">
              <currentCategory.icon className="w-12 h-12 text-white" />
              <h2 className="text-4xl font-bold text-white">{currentCategory.title}</h2>
            </div>
          </div>

          {/* Services Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {currentCategory.services.map((service, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${currentCategory.color} rounded-xl flex items-center justify-center mr-4`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Packages */}
            <div>
              
              <h3 className="text-2xl font-bold text-white text-center mb-8">
                Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Formules ?</span>
              </h3> <Link href='/devis'>

              <div className='bg-gradient-to-r from-purple-600 to-pink-600 text-black w-full text-center mb-8 py-3 px-3 rounded-lg font-semibold transition-all duration-300'>
                
                <button> Demander un devis</button>
                
              </div>
              </Link>{/*
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentPackages.map((pkg, index) => (
                  <div key={index} className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 text-center ${
                    index === 1 ? 'scale-105 border-purple-500/50' : ''
                  }`}>
                    {index === 1 && (
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold py-1 px-4 rounded-full inline-block mb-4">
                        Recommandé
                      </div>
                    )}
                    <h4 className="text-xl font-bold text-white mb-2">{pkg.name}</h4>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                      {pkg.price}
                    </div>
                    <p className="text-gray-400 mb-6">{pkg.duration}</p>
                    <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      index === 1
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    }`}>
                      Choisir
                    </button>
                  </div>
                ))}
              </div>*/}
            </div>
          </div>
        </div>
      </div>

      {/* All Services Overview */}
      <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Tous nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Domaines</span>
            </h2>
            <p className="text-xl text-gray-300">Une expertise complète pour tous vos besoins technologiques</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(serviceCategories).map(([key, category]) => (
              <div
                key={key}
                onClick={() => setActiveService(key)}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border transition-all duration-300 cursor-pointer hover:scale-105 ${
                  activeService === key ? 'border-purple-500/50 bg-white/20' : 'border-white/20 hover:border-purple-500/30'
                }`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
                <div className="space-y-2">
                  {category.services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{service.title}</span>
                    </div>
                  ))}
                </div>
                {/*<button className="mt-6 w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white py-2 px-4 rounded-lg hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>En savoir plus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>*/}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Témoignages <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Clients</span>
          </h2>
          <p className="text-xl text-gray-300">Ce que disent nos clients sur nos différents services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-gray-300 italic mb-6">
                &quot;{testimonial.text}&quot;
              </blockquote>
              
              <div className="border-t border-white/10 pt-4">
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-gray-400 text-sm">{testimonial.company}</div>
                <div className="text-purple-400 text-sm mt-1">{testimonial.service}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Un projet ? Parlons-en !
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Quel que soit votre besoin, notre équipe d&apos;experts est là pour vous accompagner de A à Z
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/devis">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Devis gratuit</span>
            </button>
            </Link>
            <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Nous appeler</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllServicesPage;