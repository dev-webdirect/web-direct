'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Clock, Mail, FileText, Phone, ArrowRight, Download, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { FluidBackground } from './FluidBackground';

// Timeline Step Component
const TimelineStep = ({
  icon: Icon,
  title,
  description,
  delay
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) => {
  return <motion.div initial={{
    opacity: 0,
    x: -20
  }} animate={{
    opacity: 1,
    x: 0
  }} transition={{
    duration: 0.5,
    delay
  }} className="flex gap-4 group">
      {/* Icon Container */}
      <div className="relative flex-shrink-0">
        <motion.div initial={{
        scale: 0
      }} animate={{
        scale: 1
      }} transition={{
        duration: 0.5,
        delay: delay + 0.2,
        type: "spring"
      }} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6a49ff] to-[#5839e6] flex items-center justify-center shadow-lg shadow-[#6a49ff]/30">
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        
        {/* Connecting Line */}
        <motion.div initial={{
        height: 0
      }} animate={{
        height: '100%'
      }} transition={{
        duration: 0.5,
        delay: delay + 0.4
      }} className="absolute left-1/2 top-12 w-[2px] h-full -translate-x-1/2 bg-gradient-to-b from-[#6a49ff] to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <h4 className="text-white font-semibold text-lg mb-1">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>;
};

// Calendar Button Component
const CalendarButton = ({
  icon: Icon,
  name,
  delay
}: {
  icon: React.ElementType;
  name: string;
  delay: number;
}) => {
  return <motion.button initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }} whileHover={{
    scale: 1.05,
    y: -2
  }} whileTap={{
    scale: 0.95
  }} className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-[#41AE96]/30 transition-all duration-300 group">
      <Icon className="w-5 h-5 text-[#41AE96] group-hover:scale-110 transition-transform" />
      <span className="text-white text-sm font-medium">{name}</span>
      <Plus className="w-4 h-4 text-gray-400 ml-auto" />
    </motion.button>;
};

// @component: BookingSuccessSection
export const BookingSuccessSection = () => {
  const timelineSteps = [{
    icon: Mail,
    title: 'Bevestigingsmail',
    description: 'Je ontvangt direct een e-mail met alle details van je afspraak en een link naar je persoonlijke videoconferentie.'
  }, {
    icon: FileText,
    title: 'Intakeformulier',
    description: 'Vul het korte intakeformulier in (optioneel) om ons vooraf te informeren over je doelen en verwachtingen.'
  }, {
    icon: Phone,
    title: 'De Call',
    description: 'Op het afgesproken tijdstip komen we samen voor een persoonlijk strategiegesprek van 30 minuten.'
  }] as any[];
  const calendarOptions = [{
    icon: Calendar,
    name: 'Google Calendar'
  }, {
    icon: Calendar,
    name: 'Apple Calendar'
  }, {
    icon: Calendar,
    name: 'Outlook'
  }, {
    icon: Download,
    name: 'iCal File'
  }] as any[];
  return <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0f0a1f] py-20 px-6 lg:px-12">
      {/* Dynamic Glow Background - matching the booking section */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Main Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#0f0a1f]" />
        
        {/* Fluid Background with primary color */}
        <FluidBackground colorHex="#6a49ff" glowSize={0.15} />
        
        {/* Animated Secondary Orb */}
        <motion.div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]" animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -40, 0]
      }} transition={{
        duration: 16,
        repeat: Infinity,
        ease: "easeInOut"
      }} style={{
        background: 'radial-gradient(circle, #41ae96 0%, transparent 70%)'
      }} />

        {/* Bottom gradient fade */}
        <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(15, 10, 31, 0) 60%, rgba(15, 10, 31, 1) 100%)'
      }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Success Animation & Header */}
        <div className="text-center mb-12 space-y-6">
          {/* Animated Success Icon */}
          <motion.div initial={{
          scale: 0,
          rotate: -180
        }} animate={{
          scale: 1,
          rotate: 0
        }} transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 15
        }} className="inline-block">
            <div className="relative">
              <motion.div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#41AE96] to-[#2d8a75] flex items-center justify-center shadow-2xl shadow-[#41AE96]/40" animate={{
              boxShadow: ["0 20px 60px rgba(65, 174, 150, 0.4)", "0 20px 80px rgba(65, 174, 150, 0.6)", "0 20px 60px rgba(65, 174, 150, 0.4)"]
            }} transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}>
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>

              {/* Animated Ring */}
              <motion.div className="absolute inset-0 rounded-full border-2 border-[#41AE96]" animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0, 0.8]
            }} transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }} />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="space-y-3">
            <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
              Je afspraak is{' '}
              <span className="relative inline-block italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#41AE96] to-[#6dd5c0] font-serif">
                bevestigd!
              </span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              We kijken ernaar uit om met je te praten over je digitale strategie.
            </p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Booking Summary */}
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            {/* Booking Details Card */}
            <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl mb-8">
              {/* Decorative gradient border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#41AE96]/20 to-[#6a49ff]/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6a49ff] to-[#5839e6] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Je Afspraak</h3>
                    <p className="text-gray-400 text-xs">Gratis strategiesessie</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#41AE96]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#41AE96]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Today at 2:00 PM</p>
                      <p className="text-gray-400 text-sm">30 minuten</p>
                    </div>
                  </div>

                  {/* Meeting Link */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#6a49ff]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#6a49ff]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Video Call</p>
                      <p className="text-gray-400 text-sm">Link wordt per e-mail verstuurd</p>
                    </div>
                  </div>
                </div>

                {/* Confirmation Note */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-[#41AE96]" />
                    <span className="text-gray-400">
                      Bevestiging verstuurd naar{' '}
                      <span className="text-white font-medium">jouw@email.com</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Calendar Section */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.6
          }} className="space-y-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#41AE96]" />
                Voeg toe aan je agenda
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {calendarOptions.map((option, index) => <CalendarButton key={index} icon={option.icon} name={option.name} delay={0.7 + index * 0.1} />)}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Intake Form CTA */}
          <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: 0.5
        }} className="space-y-8">
            {/* Primary CTA - Intake Form */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#6a49ff]/10 to-[#41AE96]/10 backdrop-blur-xl border border-[#6a49ff]/30 p-8 shadow-2xl group hover:border-[#6a49ff]/50 transition-all duration-300">
              {/* Animated Background Glow */}
              <motion.div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#6a49ff]/20 to-[#41AE96]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" animate={{
              scale: [1, 1.05, 1],
              opacity: [0, 0.3, 0]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }} />

              <div className="relative z-10 space-y-6">
                {/* Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6a49ff] to-[#5839e6] flex items-center justify-center shadow-lg shadow-[#6a49ff]/30">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#41AE96]/20 text-[#41AE96] border border-[#41AE96]/30">
                    Aanbevolen
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-2xl leading-tight">
                    Vul het intakeformulier in
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    Bespaar 10 minuten tijdens ons gesprek door ons alvast wat info te geven over je huidige situatie en doelen.
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-2 pt-2">
                  {['Meer tijd voor strategie', 'Betere voorbereiding', 'Gerichtere aanbevelingen'].map((benefit, index) => <motion.div key={index} initial={{
                  opacity: 0,
                  x: -10
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.4,
                  delay: 0.8 + index * 0.1
                }} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#41AE96]" />
                      <span className="text-sm text-gray-400">{benefit}</span>
                    </motion.div>)}
                </div>

                {/* CTA Button */}
                <motion.button whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(106, 73, 255, 0.3), 0 10px 10px -5px rgba(106, 73, 255, 0.2)"
              }} whileTap={{
                scale: 0.98
              }} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#6a49ff] to-[#5839e6] text-white px-8 py-4 rounded-full font-semibold text-base transition-all shadow-xl shadow-[#6a49ff]/20 hover:shadow-[#6a49ff]/40 group mt-6">
                  <span>Start Intakeformulier</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>

                {/* Optional Note */}
                <p className="text-center text-xs text-gray-500 pt-1">
                  Duurt slechts 3-5 minuten • Volledig optioneel
                </p>
              </div>
            </div>

            {/* Skip Option */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.6,
            delay: 0.9
          }} className="text-center">
              <button className="text-gray-400 text-sm hover:text-white transition-colors underline underline-offset-4">
                Ik doe dit later
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Section - What to Expect Timeline */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.7
      }} className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 lg:p-12 shadow-2xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-white font-bold text-3xl">Wat kun je verwachten?</h2>
              <p className="text-gray-400">De volgende stappen in je reis naar een betere digitale aanwezigheid</p>
            </div>

            {/* Timeline */}
            <div className="max-w-2xl mx-auto pt-4">
              {timelineSteps.map((step, index) => <TimelineStep key={index} icon={step.icon} title={step.title} description={step.description} delay={1.0 + index * 0.2} />)}
            </div>

            {/* Footer Message */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.6,
            delay: 1.8
          }} className="text-center pt-8 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                Heb je vragen? Stuur ons een bericht op{' '}
                <a href="mailto:hello@example.com" className="text-[#41AE96] hover:text-[#6dd5c0] transition-colors font-medium">
                  hello@example.com
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative floating elements */}
        <motion.div className="absolute top-20 right-10 w-32 h-32 bg-[#6a49ff]/20 rounded-full blur-3xl pointer-events-none" animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3]
      }} transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute bottom-20 left-10 w-32 h-32 bg-[#41AE96]/20 rounded-full blur-3xl pointer-events-none" animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.5, 0.3]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }} />
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>;
};