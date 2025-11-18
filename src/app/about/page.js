"use client";
import Link from 'next/link'
import Image from "next/image";

import React, { useState } from 'react';
import {
  Users,
  Target,
  Award,
  TrendingUp,
  Heart,
  Lightbulb,
  Shield,
  Globe,
  Code,
  Palette,
  Zap,
  CheckCircle,
  Star,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Coffee,
  Rocket,
  Eye,
  Handshake,
  Computer,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';

const AboutPage = () => {
  const [activeValue, setActiveValue] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const directorMessages = [
    {
      name: 'Bachir Sanda',
      title: 'Directeur Général',
      avatar: '/images/dg.jpg',
      message: "Chez Mell Plus, nous croyons fermement que la technologie est au service de l'humain. Notre engagement est de fournir des solutions informatiques innovantes et performantes qui accompagnent nos clients dans leur transformation digitale. Avec plus de 20 ans d'expérience, nous continuons à innover pour rester votre partenaire de confiance.",
      color: 'from-purple-600 to-pink-600'
    },
    {
      name: 'Abdoul Razak Maïga',
      title: 'Directeur Administratif et Financier',
      avatar: '/images/daf.jpg',
      message: "La rigueur financière et la transparence sont au cœur de notre gestion. Nous nous assurons que chaque projet respecte les budgets et les délais, tout en maintenant la qualité exceptionnelle qui fait notre réputation. Notre objectif est de créer une valeur durable pour nos clients et partenaires.",
      color: 'from-blue-600 to-cyan-600'
    },
    {
      name: 'Hamidou Moussa',
      title: 'Expert Maintenance',
      avatar: '/images/expert.jpg',
      message: "La maintenance et le support technique sont essentiels pour garantir la pérennité de vos équipements informatiques. Notre équipe technique intervient rapidement pour résoudre vos problèmes et optimiser vos systèmes. Nous sommes disponibles 24/7 pour assurer la continuité de vos activités.",
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const nextMessage = () => {
    setCurrentMessage((prev) => (prev + 1) % directorMessages.length);
  };

  const prevMessage = () => {
    setCurrentMessage((prev) => (prev - 1 + directorMessages.length) % directorMessages.length);
  };

  const companyValues = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Nous restons à la pointe des technologies pour offrir des solutions modernes et performantes.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Notre équipe met tout son cœur dans chaque projet pour dépasser vos attentes.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Confiance',
      description: 'Transparence, respect des délais et communication constante sont nos priorités.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Nous visons la perfection dans chaque ligne de code et chaque pixel de design.',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const team = [
    {
      name: 'Mai guizo',
      role: 'CEO & Fondateur',
      bio: 'Passionné par l\'innovation digitale depuis plus de 8 ans. Expert en stratégie web et développement d\'entreprise.',
      avatar: '/images/dg.jpg',
      skills: ['Leadership', 'Stratégie', 'Business Development'],
      linkedin: '#',
      experience: '20+ ans'
    },
    {
      name: 'Aboubacar Siddick Dari',
      role: 'Chargé de communication',
      bio: 'Développeuse full-stack experte en React et Node.js. Architecte de solutions web scalables et performantes.',
      avatar: '/images/aboubacar.jpg',
      skills: ['React', 'Node.js', 'Architecture'],
      linkedin: '#',
      experience: '6+ ans'
    },
    {
      name: 'Saddalah Thomas',
      role: 'Ingénieur logiciel',
      bio: 'Spécialiste du développement mobile iOS et Android. Créateur d\'apps intuitives et performantes.',
      avatar: '/images/sadallah.jpg',
      skills: ['React Native', 'Swift', 'Kotlin'],
      linkedin: '#',
      experience: '5+ ans'
    },
    {
      name: 'Fatima Amani',
      role: 'Assistante TIC',
      bio: 'Designer créative spécialisée dans l\'expérience utilisateur. Transforme les idées en interfaces magnifiques.',
      avatar: '/images/fatima.jpg',
      skills: ['UI Design', 'UX Research', 'Prototyping'],
      linkedin: '#',
      experience: '4+ ans'
    }
  ];

  const milestones = [
    {
      year: '2005',
      title: 'Création de Mell Plus',
      description: 'Lancement de l\'agence avec une vision claire : démocratiser le digital pour tous.',
      icon: Rocket
    },
    {
      year: '2010',
      title: 'Première certification',
      description: 'Obtention de la certification Google Partner et développement de notre expertise SEO.',
      icon: Award
    },
    {
      year: '2015',
      title: '100+ solutions livrés',
      description: 'Franchissement du cap des 500 projets réussis avec une satisfaction client de 98%.',
      icon: Target
    },
    {
      year: '2020',
      title: 'Expansion mobile',
      description: 'Lancement de notre division mobile et développement d\'applications innovantes.',
      icon: Globe
    },
    {
      year: '2025',
      title: 'Croissance continue',
      description: 'Plus de 1500 projets livrés et une équipe de 10+ experts passionnés.',
      icon: TrendingUp
    }
  ];

  const achievements = [
    {
      number: '150+',
      label: 'Projets livrés',
      icon: Briefcase
    },
    {
      number: '98%',
      label: 'Satisfaction client',
      icon: Heart
    },
    {
      number: '24/7',
      label: 'Support disponible',
      icon: Shield
    },
    {
      number: '20+',
      label: 'Années d\'expérience',
      icon: Calendar
    }
  ];

  const services = [
    {
      icon: Code,
      title: 'Développement Web et Mobile',
      description: 'Sites internet modernes, e-commerce et applications web performantes'
    },
    {
      icon: Zap,
      title: 'Formation et maintenance',
      description: 'Donnez une seconde chance à vos materiels informatiques'
    },
    {
      icon: Computer,
      title: 'Materiel informatique professionnel',
      description: 'Materiels performants avec garantie'
    },
    {
      icon: Globe,
      title: 'Reseaux et energie',
      description: 'Performance et maintenance pour maximiser votre ROI'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              À propos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Mell Plus</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Nous sommes une entreprise passionnée, spécialisée dans la vente et maintenance de materiels informatiques professionnels et la création d&apos;applications web et mobiles qui transforment vos idées en succès digitaux.
            </p>
            <div className="flex justify-center items-center space-x-8 text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>Niamey, Niger</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>Depuis 2001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>10+ experts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Mission */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Notre Mission</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Accompagner les clients dans leur transformation digitale en leurs proposants des solutions qualitative, performantes et évolutives.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Nous croyons que chaque projet mérite une attention particulière et une approche personnalisée pour garantir le succès de nos clients.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Notre Vision</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Devenir le partenaire de référence pour les entreprises qui souhaitent se démarquer dans l&apos;univers technologique grâce à l&apos;innovation et l&apos;excellence.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Nous visons à créer des expériences qui marquent les esprits et génèrent des résultats tangibles.
            </p>
          </div>
        </div>
      </div>

      

      {/* Company Values */}
      <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nous avons des 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Valeurs</span> dans nos démarches
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Apporter des solutions adequates aux besoins Informatiques.
              Le dynamisme et le respect des exigences de la Clientèles est le moteur de notre engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveValue(index)}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  activeValue === index ? 'border-purple-500/50 bg-white/20' : ''
                }`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">{value.title}</h3>
                <p className="text-gray-300 text-center leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      

      {/* Timeline */}
      {/*<div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Histoire</span>
            </h2>
            <p className="text-xl text-gray-300">Le parcours de Mell Plus depuis sa création</p>
          </div>

          <div className="relative">*/}
            {/* Timeline line */}{/* 
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-pink-600 hidden lg:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4">
                          <milestone.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}{/*
                  <div className="hidden lg:flex w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="lg:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>*/}

      {/* Team Section */}
      {/*<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Équipe</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Des experts devoués qui donnent vie à vos projets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="relative overflow-hidden">
                  <Image
                    width={500}
                    height={600}
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-purple-400 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{member.bio}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{member.experience}</span>
                    <button className="text-purple-400 hover:text-purple-300 transition-colors">
                      <Users className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>*/}

      {/* Achievements */}{/* 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Réalisations</span>
          </h2>
          <p className="text-xl text-gray-300">Quelques chiffres qui illustrent notre parcours</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <achievement.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                {achievement.number}
              </div>
              <div className="text-gray-300 font-medium">{achievement.label}</div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Services Overview */}
      <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Expertises</span>
            </h2>
            <p className="text-xl text-gray-300">Ce que nous faisons de mieux pour vous accompagner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Director Messages Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Mot de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">notre equipe</span>
          </h2>
         {/*  <p className="text-xl text-gray-300">Messages de notre équipe dirigeante</p>*/}
        </div>

        <div className="relative">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/20 overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-32 h-32 text-white" />
            </div>

            {/* Director Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8 relative z-10">
             {/*  <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${directorMessages[currentMessage].color} rounded-full blur-lg opacity-50`}></div>
                <Image
                  src={directorMessages[currentMessage].avatar}
                  alt={directorMessages[currentMessage].name}
                  width={120}
                  height={120}
                  className="relative w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/20"
                />
              </div>*/}

              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {directorMessages[currentMessage].name}
                </h3>
                <p className={`text-lg font-semibold bg-gradient-to-r ${directorMessages[currentMessage].color} bg-clip-text text-transparent mb-4`}>
                  {directorMessages[currentMessage].title}
                </p>
                <p className="text-gray-300 text-lg leading-relaxed italic">
                  &ldquo;{directorMessages[currentMessage].message}&rdquo;
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 relative z-10">
              <button
                onClick={prevMessage}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/20"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Précédent</span>
              </button>

              {/* Indicators */}
              <div className="flex space-x-3">
                {directorMessages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMessage(index)}
                    className={`transition-all duration-300 ${
                      index === currentMessage
                        ? `w-8 h-3 bg-gradient-to-r ${directorMessages[index].color} rounded-full`
                        : 'w-3 h-3 bg-white/30 rounded-full hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextMessage}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/20"
              >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-12 text-center border border-white/20">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à nous rejoindre dans cette aventure ?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Discutons de votre projet et découvrons ensemble comment nous pouvons vous aider à atteindre vos objectifs technologiques.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/contact">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Contactez-nous</span>
            </button>
            </Link>{/*
            <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Planifier un appel</span>
            </button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;