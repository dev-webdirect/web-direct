'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, Mail, MessageCircle, Phone, Clock, Zap, Shield, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { FeatureGridSection } from './FeatureGridSection';
import { TestimonialCarousel } from './TestimonialCarousel';

const FluidBackground = dynamic(
  () => import('./FluidBackground').then((m) => m.FluidBackground),
  { ssr: false }
);

// FAQ Category Type
interface FaqItem {
  question: string;
  answer: string;
}
interface FaqCategory {
  title: string;
  icon: React.ElementType;
  items: FaqItem[];
}

// FAQ Accordion Item Component
const FaqAccordionItem = ({
  question,
  answer,
  isOpen,
  onToggle,
  delay,
  categoryTitle
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
  categoryTitle: string;
}) => {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }} className="border border-gray-800 rounded-2xl overflow-hidden bg-[#1a1227] hover:shadow-2xl transition-all duration-300">
      <button onClick={onToggle} className="w-full p-4 sm:p-5 md:p-6 lg:p-8 text-left flex justify-between items-start lg:items-center hover:bg-white/[0.02] transition-colors gap-3 sm:gap-4">
        <div className="flex-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6a49ff] mb-2 block">
            {categoryTitle}
          </span>
          <h3 className="font-bold text-lg lg:text-xl text-white leading-tight">
            {question}
          </h3>
        </div>
        <div className={cn("mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all", isOpen ? "bg-[#6a49ff] text-white rotate-180" : "bg-gray-800 text-gray-500")}>
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: "auto",
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}>
            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 text-gray-400 leading-relaxed text-base border-t border-white/[0.05] pt-4 sm:pt-6">
              {answer}
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
};

// Category Tab Component
const CategoryTab = ({
  title,
  icon: Icon,
  isActive,
  onClick,
  delay
}: {
  title: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
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
  }} onClick={onClick} className={cn("relative flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap", isActive ? "bg-[#6a49ff] text-white shadow-lg shadow-[#6a49ff]/20" : "bg-[#1a1227] text-gray-400 hover:bg-[#251b36] hover:text-white border border-gray-800")}>
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </motion.button>;
};

// Support Card Component
const SupportCard = ({
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
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }} className="relative group w-full h-full">
      <div className="relative w-full h-full min-h-[200px] sm:min-h-[220px] p-5 sm:p-6 md:p-8 rounded-2xl bg-[#1a1227] border border-gray-800 hover:border-[#41AE96] transition-all duration-300 hover:shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-[#251b36] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-[#41AE96]" />
        </div>
        
        <h4 className="font-bold text-lg mb-2 text-white">{title}</h4>
        <p className="text-sm text-gray-400 mb-4">{description}</p>

        
      </div>
    </motion.div>;
};

// @component: BookingFaqSection
export const BookingFaqSection = () => {
  const router = useRouter();
  const goToBooking = () => router.push('/booking');

  const [activeCategory, setActiveCategory] = useState(0);
  const [openItems, setOpenItems] = useState<number[]>([0]);
  const faqCategories: FaqCategory[] = [
    {
      title: "Algemeen",
      icon: MessageCircle,
      items: [
        { question: "Wat kost een website bij WebDirect?", answer: "Onze websites starten vanaf €695 voor een one-pager. De meeste klanten zitten tussen €1.000 en €2.000, afhankelijk van het aantal pagina's en gewenste functionaliteiten. Tijdens een vrijblijvend gesprek kijken we samen wat past bij jouw situatie en budget." },
        { question: "Hoe snel is mijn website klaar?", answer: "Een standaard bedrijfswebsite leveren we binnen 5 werkdagen op, mits content en materialen snel worden aangeleverd. Voor webshops of complexere projecten spreken we een apart traject af." },
        { question: "Kan ik mijn website zelf aanpassen na oplevering?", answer: "Ja. We bouwen een gebruiksvriendelijk CMS in waarmee je zelf content zoals blogberichten en afbeeldingen kunt toevoegen. Voor grotere aanpassingen aan het design of de structuur kun je altijd een verzoek indienen bij ons team." },
        { question: "Wat als ik geen content heb – teksten of foto's?", answer: "Geen probleem. Op basis van een korte vragenlijst of je huidige website schrijven wij de teksten voor je. We gebruiken stock- of AI-gegenereerde afbeeldingen als je geen eigen beelden hebt. Dit is optioneel bij te boeken." },
        { question: "Zit ik vast aan een contract of abonnement?", answer: "Nee. Je betaalt eenmalig voor de ontwikkeling van je website. We raden onze eigen hosting sterk aan — die is geoptimaliseerd voor snelheid, veiligheid en uptime. Wil je toch elders hosten, dan zorgen we voor een volledige overdracht van je website." },
      ],
    },
    {
      title: "Aanpak & Proces",
      icon: Clock,
      items: [
        { question: "Hoe verloopt het proces?", answer: "We starten met een kort kennismakingsgesprek (online, 20 minuten) om je wensen en doelen te begrijpen. Daarna werken we in vijf fasen: intake en analyse, design, ontwikkeling, testen, en lancering. Je blijft in elke fase betrokken en kunt op elk moment feedback geven." },
        { question: "Werken jullie met vaste pakketten of maatwerk?", answer: "Allebei. We kijken eerst naar wat jij nodig hebt en wat past bij je budget. Sommige klanten beginnen met een strakke one-pager, anderen willen een volledig uitgewerkte website met meerdere pagina's en functionaliteiten. We denken mee en adviseren eerlijk." },
        { question: "Kan ik tussentijds aanpassingen aanvragen?", answer: "Ja. We werken met vaste feedbackrondes tijdens het proces, zodat je altijd weet waar het project staat. Feedback binnen de projectscope verwerken we zonder meerkosten. Grotere wijzigingen bespreken we eerst qua tijd en budget." },
        { question: "Bieden jullie een gratis preview aan?", answer: "Ja. Voordat je akkoord gaat, laten we je een design concept zien gebaseerd op jouw merk en doelen. Zo weet je precies wat je krijgt voordat het project start." },
      ],
    },
    {
      title: "Design & Techniek",
      icon: Zap,
      items: [
        { question: "Krijg ik een uniek design of een template?", answer: "Elk design is op maat gemaakt. We gebruiken geen kant-en-klare templates, maar ontwerpen een look & feel die aansluit bij jouw merk, doelgroep en doelen." },
        { question: "Is mijn website ook goed op mobiel?", answer: "Altijd. We bouwen mobile-first: je website werkt perfect op smartphone, tablet en desktop. We testen op verschillende schermformaten en browsers voor oplevering." },
        { question: "Is mijn website snel en goed vindbaar in Google?", answer: "Ja. Technische SEO is standaard onderdeel van elk project: snelle laadtijden, schone code, correcte meta-tags, structured data en mobile-friendly design. Gemiddeld scoren onze websites 90+ op Google PageSpeed Insights." },
        { question: "Welke technologie gebruiken jullie?", answer: "We werken met moderne technologieën zoals React, Next.js en TypeScript, aangevuld met betrouwbare cloud hosting. We kiezen altijd de technologie die het beste past bij jouw project en behoeften." },
        { question: "Is mijn website GDPR/AVG-proof?", answer: "We bouwen conform de AVG: cookie consent, privacy policy, veilige dataopslag en opt-in mechanismen. We adviseren over wat er juridisch nodig is, maar de eindverantwoordelijkheid ligt bij jou als ondernemer." },
      ],
    },
    {
      title: "Prijs & Betaling",
      icon: MessageCircle,
      items: [
        { question: "Wat kost een website bij WebDirect?", answer: "Websites starten vanaf €695 voor een one-pager. De meeste projecten vallen tussen €1.000 en €2.000. Voor uitgebreidere websites of webapplicaties hanteren we hogere tarieven, afhankelijk van de complexiteit. We maken altijd een offerte op maat." },
        { question: "Zijn er verborgen kosten?", answer: "Nee. We zijn transparant over alle kosten vanaf dag één. Je betaalt eenmalig voor de ontwikkeling. Eventuele hosting- of onderhoudskosten worden vooraf besproken en vastgelegd." },
        { question: "Kan ik in termijnen betalen?", answer: "Ja. Voor grotere projecten werken we met een gespreid betalingsschema: een deel bij start, een deel bij design goedkeuring, en het resterende bedrag bij oplevering. Dit stemmen we af in het intakegesprek." },
        { question: "Wat zijn de kosten voor hosting en onderhoud?", answer: "Hosting en onderhoud zijn optioneel en worden apart geoffreerd. Daarin zijn inbegrepen: SSL-certificaat, dagelijkse back-ups, security monitoring, software-updates en kleine content aanpassingen. Voor grotere wijzigingen maken we een aparte offerte." },
      ],
    },
    {
      title: "Eigendom & Beheer",
      icon: Shield,
      items: [
        { question: "Ben ik eigenaar van mijn website?", answer: "Ja. Alle content, designs en assets zijn van jou. De broncode is clean en gedocumenteerd. Je kunt altijd besluiten om elders te hosten – wij leveren dan alle bestanden, database en documentatie volledig aan." },
        { question: "Wat als ik later wil overstappen naar een andere partij?", answer: "Geen probleem. We leveren een volledige export van de website inclusief alle bestanden en credentials." },
        { question: "Maken jullie back-ups?", answer: "Ja. Automatische dagelijkse back-ups zijn standaard. We bewaren meerdere restore points zodat we bij problemen snel kunnen terugdraaien. Back-ups worden off-site opgeslagen." },
      ],
    },
    {
      title: "Support & Schaalbaarheid",
      icon: Phone,
      items: [
        { question: "Welke support bieden jullie na de lancering?", answer: "Na oplevering bieden we een post-launch periode voor bugfixes en kleine aanpassingen. Klanten met een onderhoudsplan hebben een vast aanspreekpunt. Voor kritieke issues (website onbereikbaar) reageren we binnen 1 uur; overige vragen binnen 24 uur op werkdagen." },
        { question: "Kan ik later uitbreiden of nieuwe functies toevoegen?", answer: "Absoluut. Veel klanten werken na de lancering verder met ons samen voor nieuwe pagina's, functionaliteiten of optimalisaties. We staan klaar om mee te groeien met jouw bedrijf." },
        { question: "Kunnen jullie integraties bouwen met andere systemen?", answer: "Ja. We koppelen regelmatig met CRM-systemen, boekhoudprogramma's, betalingsproviders, marketingtools en custom API's. We bespreken jouw integratie behoeften tijdens de intake." },
        { question: "Kunnen jullie een webshop of klantenportaal bouwen?", answer: "Ja. We bouwen e-commerce oplossingen met productcatalogi, winkelwagen, betaal integraties (IDEAL/Wero, PayPal, creditcard) en voorraadbeheer. Ook beveiligde klantenportalen met login- en persoonlijke dashboards behoren tot de mogelijkheden." },
      ],
    },
  ];
  const toggleItem = (index: number) => {
    setOpenItems(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };
  const currentCategory = faqCategories[activeCategory];
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-12 md:pb-20 px-3 sm:px-4 md:px-6 lg:px-12">
      {/* No background – uses page.tsx gradient; tight top padding for smooth flow from TestimonialCarousel */}
      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-4 sm:space-y-6">
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
              <HelpCircle className="w-3 h-3 mr-2" />
              Veelgestelde Vragen
            </span>
          </motion.div>

          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
            Alles wat je moet{' '}
            <span className="relative inline-block italic font-large text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif">
              weten.
            </span>
          </motion.h2>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Nog vragen over het strategiegesprek? We hebben de meest gestelde vragen voor je verzameld.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12 flex-wrap">
          {faqCategories.map((category, index) => <CategoryTab key={index} title={category.title} icon={category.icon} isActive={activeCategory === index} onClick={() => {
          setActiveCategory(index);
          setOpenItems([0]); // Reset to first item open when switching categories
        }} delay={0.3 + index * 0.1} />)}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 space-y-3 sm:space-y-4">
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} transition={{
            duration: 0.3
          }} className="space-y-4">
              {currentCategory.items.map((item, index) => <FaqAccordionItem key={index} question={item.question} answer={item.answer} isOpen={openItems.includes(index)} onToggle={() => toggleItem(index)} delay={index * 0.1} categoryTitle={currentCategory.title} />)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Support Section */}
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.5
        }} className="text-center mb-6 sm:mb-8 md:mb-10">
            <h3 className="text-white font-bold text-3xl mb-3">
              Geen antwoord gevonden?
            </h3>
            <p className="text-gray-400 text-lg">
              Ons team staat klaar om je te helpen met elke vraag
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            
            <SupportCard icon={Mail} title="E-mail Ons" description="Stuur ons een bericht en we reageren binnen 24 uur" 
             delay={0.6} />
            <SupportCard icon={MessageCircle} title="Live Chat" description="Direct contact met ons team tijdens kantooruren" delay={0.7} />
            <SupportCard icon={Phone} title="Bel Ons" description="Praat direct met een specialist" delay={0.8} />
          </div>

          {/* CTA Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.9
        }} className="relative rounded-2xl bg-[#40AE96] border border-gray-800 p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl overflow-hidden">
            {/* Decorative gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6a49ff]/10 to-[#41AE96]/10 opacity-50 pointer-events-none" />
            
            {/* Floating orbs */}
            <motion.div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6a49ff]/20 rounded-full blur-3xl pointer-events-none" animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }} />
            <motion.div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#41AE96]/20 rounded-full blur-3xl pointer-events-none" animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2]
          }} transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }} />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-white font-bold text-3xl mb-3">
                Klaar voor je gratis {' '}
                <span className="relative inline-block italic font-large text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif">
                webdesign?
                </span>
                </h3>
                <p className="text-gray-400 text-lg" style={{
                color: "#ffffff"
              }}>
                  Plan nu je meeting in en ontvang een geheel vrijblijvend webdesign voor jouw bedrijf. 
                </p>
              </div>

              <motion.button whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(106, 73, 255, 0.3), 0 10px 10px -5px rgba(106, 73, 255, 0.2)"
            }} whileTap={{
              scale: 0.95
            }} className="flex items-center gap-3 bg-gradient-to-r from-[#6a49ff] to-[#5839e6] text-white px-10 py-5 rounded-full font-semibold text-lg transition-all shadow-xl shadow-[#6a49ff]/20 hover:shadow-[#6a49ff]/40 group whitespace-nowrap">
                <span>Plan je Call</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </motion.div>


          {/* Trust Indicators */}
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 1
        }} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-10 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#41AE96]" />

              <span>100% vrijblijvend</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#41AE96]" />
              <span>20 minuten</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#41AE96]" />
              <span>Direct toepasbare inzichten</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line - matching BookingHeroSection */}
    </section>
  );
};