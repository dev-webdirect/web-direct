'use client';
import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, TrendingUp, Zap, ArrowRight, Users, Award, Minus, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

type FaqItem = { q: string; a: string };
type FaqGroup = { title: string; items: FaqItem[] };

const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Meest gestelde vragen',
    items: [
      { q: 'Wat kost een website bij WebDirect?', a: 'Onze websites starten vanaf €695 voor een one-pager. De meeste klanten zitten tussen €1.000 en €2.000, afhankelijk van het aantal pagina\'s en gewenste functionaliteiten. Tijdens een vrijblijvend gesprek kijken we samen wat past bij jouw situatie en budget.' },
      { q: 'Hoe snel is mijn website klaar?', a: 'Een standaard bedrijfswebsite leveren we binnen 5 werkdagen op, mits content en materialen snel worden aangeleverd. Voor webshops of complexere projecten spreken we een apart traject af.' },
      { q: 'Kan ik mijn website zelf aanpassen na oplevering?', a: 'Ja. We bouwen een gebruiksvriendelijk CMS in waarmee je zelf content zoals blogberichten en afbeeldingen kunt toevoegen. Voor grotere aanpassingen aan het design of de structuur kun je altijd een verzoek indienen bij ons team.' },
      { q: 'Wat als ik geen content heb – teksten of foto\'s?', a: 'Geen probleem. Op basis van een korte vragenlijst of je huidige website schrijven wij de teksten voor je. We gebruiken stock- of AI-gegenereerde afbeeldingen als je geen eigen beelden hebt. Dit is optioneel bij te boeken.' },
      { q: 'Zit ik vast aan een contract of abonnement?', a: 'Nee. Je betaalt eenmalig voor de ontwikkeling van je website. We raden onze eigen hosting sterk aan — die is geoptimaliseerd voor snelheid, veiligheid en uptime. Wil je toch elders hosten, dan zorgen we voor een volledige overdracht van je website.' },
    ],
  },
  {
    title: 'Aanpak & Proces',
    items: [
      { q: 'Hoe verloopt het proces?', a: 'We starten met een kort kennismakingsgesprek (online, 20 minuten) om je wensen en doelen te begrijpen. Daarna werken we in vijf fasen: intake en analyse, design, ontwikkeling, testen, en lancering. Je blijft in elke fase betrokken en kunt op elk moment feedback geven.' },
      { q: 'Werken jullie met vaste pakketten of maatwerk?', a: 'Allebei. We kijken eerst naar wat jij nodig hebt en wat past bij je budget. Sommige klanten beginnen met een strakke one-pager, anderen willen een volledig uitgewerkte website met meerdere pagina\'s en functionaliteiten. We denken mee en adviseren eerlijk.' },
      { q: 'Kan ik tussentijds aanpassingen aanvragen?', a: 'Ja. We werken met vaste feedbackrondes tijdens het proces, zodat je altijd weet waar het project staat. Feedback binnen de projectscope verwerken we zonder meerkosten. Grotere wijzigingen bespreken we eerst qua tijd en budget.' },
      { q: 'Bieden jullie een gratis preview aan?', a: 'Ja. Voordat je akkoord gaat, laten we je een design concept zien gebaseerd op jouw merk en doelen. Zo weet je precies wat je krijgt voordat het project start.' },
    ],
  },
  {
    title: 'Design & Techniek',
    items: [
      { q: 'Krijg ik een uniek design of een template?', a: 'Elk design is op maat gemaakt. We gebruiken geen kant-en-klare templates, maar ontwerpen een look & feel die aansluit bij jouw merk, doelgroep en doelen.' },
      { q: 'Is mijn website ook goed op mobiel?', a: 'Altijd. We bouwen mobile-first: je website werkt perfect op smartphone, tablet en desktop. We testen op verschillende schermformaten en browsers voor oplevering.' },
      { q: 'Is mijn website snel en goed vindbaar in Google?', a: 'Ja. Technische SEO is standaard onderdeel van elk project: snelle laadtijden, schone code, correcte meta-tags, structured data en mobile-friendly design. Gemiddeld scoren onze websites 90+ op Google PageSpeed Insights.' },
      { q: 'Welke technologie gebruiken jullie?', a: 'We werken met moderne technologieën zoals React, Next.js en TypeScript, aangevuld met betrouwbare cloud hosting. We kiezen altijd de technologie die het beste past bij jouw project en behoeften.' },
      { q: 'Is mijn website GDPR/AVG-proof?', a: 'We bouwen conform de AVG: cookie consent, privacy policy, veilige dataopslag en opt-in mechanismen. We adviseren over wat er juridisch nodig is, maar de eindverantwoordelijkheid ligt bij jou als ondernemer.' },
    ],
  },
  {
    title: 'Prijs & Betaling',
    items: [
      { q: 'Wat kost een website bij WebDirect?', a: 'Websites starten vanaf €695 voor een one-pager. De meeste projecten vallen tussen €1.000 en €2.000. Voor uitgebreidere websites of webapplicaties hanteren we hogere tarieven, afhankelijk van de complexiteit. We maken altijd een offerte op maat.' },
      { q: 'Zijn er verborgen kosten?', a: 'Nee. We zijn transparant over alle kosten vanaf dag één. Je betaalt eenmalig voor de ontwikkeling. Eventuele hosting- of onderhoudskosten worden vooraf besproken en vastgelegd.' },
      { q: 'Kan ik in termijnen betalen?', a: 'Ja. Voor grotere projecten werken we met een gespreid betalingsschema: een deel bij start, een deel bij design goedkeuring, en het resterende bedrag bij oplevering. Dit stemmen we af in het intakegesprek.' },
      { q: 'Wat zijn de kosten voor hosting en onderhoud?', a: 'Hosting en onderhoud zijn optioneel en worden apart geoffreerd. Daarin zijn inbegrepen: SSL-certificaat, dagelijkse back-ups, security monitoring, software-updates en kleine content aanpassingen. Voor grotere wijzigingen maken we een aparte offerte.' },
    ],
  },
  {
    title: 'Eigendom & Beheer',
    items: [
      { q: 'Ben ik eigenaar van mijn website?', a: 'Ja. Alle content, designs en assets zijn van jou. De broncode is clean en gedocumenteerd. Je kunt altijd besluiten om elders te hosten – wij leveren dan alle bestanden, database en documentatie volledig aan.' },
      { q: 'Wat als ik later wil overstappen naar een andere partij?', a: 'Geen probleem. We leveren een volledige export van de website inclusief alle bestanden en credentials.' },
      { q: 'Maken jullie back-ups?', a: 'Ja. Automatische dagelijkse back-ups zijn standaard. We bewaren meerdere restore points zodat we bij problemen snel kunnen terugdraaien. Back-ups worden off-site opgeslagen.' },
    ],
  },
  {
    title: 'Support & Schaalbaarheid',
    items: [
      { q: 'Welke support bieden jullie na de lancering?', a: 'Na oplevering bieden we een post-launch periode voor bugfixes en kleine aanpassingen. Klanten met een onderhoudsplan hebben een vast aanspreekpunt. Voor kritieke issues (website onbereikbaar) reageren we binnen 1 uur; overige vragen binnen 24 uur op werkdagen.' },
      { q: 'Kan ik later uitbreiden of nieuwe functies toevoegen?', a: 'Absoluut. Veel klanten werken na de lancering verder met ons samen voor nieuwe pagina\'s, functionaliteiten of optimalisaties. We staan klaar om mee te groeien met jouw bedrijf.' },
      { q: 'Kunnen jullie integraties bouwen met andere systemen?', a: 'Ja. We koppelen regelmatig met CRM-systemen, boekhoudprogramma\'s, betalingsproviders, marketingtools en custom API\'s. We bespreken jouw integratie behoeften tijdens de intake.' },
      { q: 'Kunnen jullie een webshop of klantenportaal bouwen?', a: 'Ja. We bouwen e-commerce oplossingen met productcatalogi, winkelwagen, betaal integraties (IDEAL/Wero, PayPal, creditcard) en voorraadbeheer. Ook beveiligde klantenportalen met login- en persoonlijke dashboards behoren tot de mogelijkheden.' },
    ],
  },
];

const FluidBackground = dynamic(
  () => import('./FluidBackground').then((m) => m.FluidBackground),
  { ssr: false }
);

// Progress Step Component
const ProgressStep = ({
  number,
  title,
  isActive,
  isCompleted
}: {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}) => {
  return <div className="flex flex-col items-center gap-2 relative">
      <motion.div initial={{
      scale: 0.8,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      delay: number * 0.1
    }} className={cn("relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500", isCompleted && "bg-[#41AE96] text-white shadow-lg shadow-[#41AE96]/30", isActive && "bg-gradient-to-br from-[#6a49ff] to-[#5839e6] text-white shadow-xl shadow-[#6a49ff]/40 scale-110", !isCompleted && !isActive && "bg-white/5 text-gray-500 border border-white/10")}>
        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span>{number}</span>}
        
        {/* Animated ring for active step */}
        {isActive && <motion.div className="absolute inset-0 rounded-full border-2 border-[#6a49ff]" animate={{
        scale: [1, 1.2, 1],
        opacity: [0.8, 0, 0.8]
      }} transition={{
        duration: 2,
        repeat: Infinity
      }} />}
      </motion.div>
      
      <span className={cn("text-xs font-medium text-center max-w-[80px] transition-colors", isActive && "text-white", isCompleted && "text-[#41AE96]", !isCompleted && !isActive && "text-gray-500")}>
        {title}
      </span>
    </div>;
};

// Trust Badge Component
const TrustBadge = ({
  icon: Icon,
  text,
  delay
}: {
  icon: React.ElementType;
  text: string;
  delay: number;
}) => {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay
  }} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm text-gray-300">
      <Icon className="w-4 h-4 text-[#41AE96]" />
      <span>{text}</span>
    </motion.div>;
};

// @component: BookingHeroSection
export const BookingHeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [mouseEventTarget, setMouseEventTarget] = useState<HTMLElement | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const steps = [{
    title: 'Strategy Call',
    isCompleted: false,
    isActive: true
  }, {
    title: 'Design Audit',
    isCompleted: false,
    isActive: false
  }, {
    title: 'Launch Plan',
    isCompleted: false,
    isActive: false
  }] as any[];
  const benefits = [{
    icon: TrendingUp,
    text: "Free Website Analysis"
  }, {
    icon: Zap,
    text: "No Commitment Required"
  }, {
    icon: Award,
    text: "100+ Success Stories"
  }] as any[];
  const availableSlots = [{
    time: "Today, 2:00 PM",
    available: true
  }, {
    time: "Today, 4:30 PM",
    available: true
  }, {
    time: "Tomorrow, 10:00 AM",
    available: true
  }, {
    time: "Tomorrow, 3:00 PM",
    available: false
  }] as any[];

  // @return
  return (
    <section
    ref={(el) => {
      (containerRef as React.MutableRefObject<HTMLElement | null>).current = el;
      setMouseEventTarget(el);
    }}
    className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0f0a1f] py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8"
  >
      {/* Dynamic Glow Background - matching HeroSection aesthetic */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Main Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#0f0a1f]" />
        
        {/* Fluid Background with primary color - pass mouseEventTarget so fluid receives mouse events */}
        <FluidBackground colorHex="#41ae96" glowSize={0.15} mouseEventTarget={mouseEventTarget} />
        
        {/* Animated Secondary Orb */}
        <motion.div className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]" animate={{
        scale: [1, 1.2, 1],
        x: [0, 50, 0],
        y: [0, -30, 0]
      }} transition={{
        duration: 18,
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
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* Left Column - Copy & Benefits */}
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6
        }} className="space-y-4 sm:space-y-5">
            {/* Badge */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#41AE96]/10 text-[#41AE96] border border-[#41AE96]/20 backdrop-blur-md">
                <span className="mr-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#41AE96] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#41AE96]"></span>
                </span>
                Gratis Strategie Sessie
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-3">
              <motion.h1 initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.1
            }} className="font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.1] tracking-tight">
                Klaar om je{' '}
                <span className="relative inline-block italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif">
                  digitale aanwezigheid
                </span>
                {' '}te transformeren?
              </motion.h1>

              <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} className="text-base text-gray-400 leading-relaxed max-w-xl">
                Boek je gratis 30-minuten strategiegesprek. Ontdek hoe we je merk kunnen helpen groeien met een website die écht converteert.
              </motion.p>
            </div>

            {/* Progress Steps */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3
          }} className="relative">
              <div className="flex items-center justify-between max-w-md">
                {steps.map((step, index) => <React.Fragment key={index}>
                    <ProgressStep number={index + 1} title={step.title} isActive={step.isActive} isCompleted={step.isCompleted} />
                    {index < steps.length - 1 && <div className="flex-1 h-[2px] bg-white/10 mx-2 relative overflow-hidden">
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-[#6a49ff] to-[#41AE96]" initial={{
                    scaleX: 0
                  }} animate={{
                    scaleX: step.isActive ? 0.3 : 0
                  }} transition={{
                    duration: 0.8,
                    delay: 0.5
                  }} style={{
                    transformOrigin: 'left'
                  }} />
                      </div>}
                  </React.Fragment>)}
              </div>
            </motion.div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {benefits.map((benefit, index) => <TrustBadge key={index} icon={benefit.icon} text={benefit.text} delay={0.4 + index * 0.1} />)}
            </div>

            {/* Urgency Message */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.7
          }} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#41AE96]/10 to-[#6a49ff]/10 border border-[#41AE96]/20 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-[#41AE96] flex-shrink-0" />
              <div className="text-sm">
                <span className="text-white font-semibold">Next available slot:</span>{' '}
                <span className="text-[#41AE96] font-bold">Today</span>
                <span className="text-gray-400 ml-2">• Limited spots this week</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Booking Widget Placeholder */}
          <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="relative">
            {/* Glassmorphic Card */}
            <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-5 md:p-6 shadow-2xl">
              {/* Decorative gradient border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#6a49ff]/20 to-[#41AE96]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 space-y-3 sm:space-y-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6a49ff] to-[#5839e6] flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Select Your Time</h3>
                      <p className="text-gray-400 text-xs">30-minute session</p>
                    </div>
                  </div>
                  <Users className="w-5 h-5 text-gray-500" />
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 font-medium">Available Times</p>
                  {availableSlots.map((slot, index) => <motion.button key={index} onMouseEnter={() => setHoveredSlot(index)} onMouseLeave={() => setHoveredSlot(null)} disabled={!slot.available} whileHover={slot.available ? {
                  scale: 1.02,
                  x: 4
                } : {}} whileTap={slot.available ? {
                  scale: 0.98
                } : {}} className={cn("w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300", slot.available ? "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#41AE96]/50 cursor-pointer group" : "bg-white/[0.02] border border-white/5 opacity-40 cursor-not-allowed")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-full transition-colors", slot.available ? "bg-[#41AE96]" : "bg-gray-600")}>
                          {slot.available && hoveredSlot === index && <motion.div className="w-full h-full rounded-full bg-[#41AE96]" animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0, 1]
                      }} transition={{
                        duration: 1.5,
                        repeat: Infinity
                      }} />}
                        </div>
                        <span className={cn("font-medium", slot.available ? "text-white" : "text-gray-600")}>
                          {slot.time}
                        </span>
                      </div>
                      {slot.available ? <ArrowRight className="w-4 h-4 text-[#41AE96] opacity-0 group-hover:opacity-100 transition-opacity" /> : <span className="text-xs text-gray-600 font-medium">Booked</span>}
                    </motion.button>)}
                </div>

                {/* CTA Button */}
                <motion.button whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(106, 73, 255, 0.3), 0 10px 10px -5px rgba(106, 73, 255, 0.2)"
              }} whileTap={{
                scale: 0.98
              }} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#6a49ff] to-[#5839e6] text-white px-8 py-3 rounded-full font-semibold text-base transition-all shadow-xl shadow-[#6a49ff]/20 hover:shadow-[#6a49ff]/40 group mt-4">
                  <span>Bevestig je Afspraak</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-500 pt-2">
                  Je ontvangt direct een bevestiging per e-mail
                </p>
              </div>
            </div>

            {/* Decorative floating elements */}
            <motion.div className="absolute -top-6 -right-6 w-32 h-32 bg-[#6a49ff]/20 rounded-full blur-3xl pointer-events-none" animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }} />
            <motion.div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#41AE96]/20 rounded-full blur-3xl pointer-events-none" animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }} transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }} />
          </motion.div>
        </div>

        {/* FAQ Section - WebDirect Veelgestelde vragen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mt-16 sm:mt-20 md:mt-24 pt-10 sm:pt-12 md:pt-16 border-t border-white/10"
        >
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-white leading-tight tracking-tight mb-2">
              WebDirect – Veelgestelde vragen
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              Meest gestelde vragen
            </p>
          </div>

          {/* FAQ: grid with max 3 columns; each cell = one group (title + items) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {FAQ_GROUPS.map((group, groupIndex) => (
              <div key={groupIndex} className="min-w-0 flex flex-col">
                <h3 className="text-lg sm:text-xl font-semibold text-[#41AE96] mb-4 flex-shrink-0">
                  {group.title}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {group.items.map((faq, itemIndex) => {
                    const globalIndex = FAQ_GROUPS.slice(0, groupIndex).reduce((acc, g) => acc + g.items.length, 0) + itemIndex;
                    const isOpen = openFaqIndex === globalIndex;
                    return (
                      <div
                        key={itemIndex}
                        className="rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors"
                      >
                        <button
                          type="button"
                          className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-4"
                          onClick={() => setOpenFaqIndex(isOpen ? null : globalIndex)}
                        >
                          <span className="font-semibold text-sm sm:text-base text-white pr-2 leading-snug">
                            {faq.q}
                          </span>
                          {isOpen ? (
                            <Minus className="w-5 h-5 text-[#41AE96] flex-shrink-0" />
                          ) : (
                            <Plus className="w-5 h-5 text-[#41AE96] flex-shrink-0" />
                          )}
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-400 text-sm sm:text-base leading-relaxed border-t border-white/10 pt-2">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom decorative line - matching HeroSection */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}