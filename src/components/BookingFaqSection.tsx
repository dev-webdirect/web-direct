'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, Mail, MessageCircle, Phone, Clock, Zap, Shield, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { FluidBackground } from './FluidBackground';

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
      <button onClick={onToggle} className="w-full p-6 lg:p-8 text-left flex justify-between items-start lg:items-center hover:bg-white/[0.02] transition-colors gap-4">
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
            <div className="px-6 lg:px-8 pb-8 text-gray-400 leading-relaxed text-base border-t border-white/[0.05] pt-6">
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
      <div className="relative w-full h-full min-h-[220px] p-8 rounded-2xl bg-[#1a1227] border border-gray-800 hover:border-[#41AE96] transition-all duration-300 hover:shadow-2xl">
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
  const faqCategories: FaqCategory[] = [{
    title: "Algemeen",
    icon: MessageCircle,
    items: [{
      question: "Waarom kiezen voor custom code in plaats van WordPress of No-Code tools?",
      answer: "Custom code biedt superieure snelheid, betere SEO, en nul plugin-kwetsbaarheden. Het biedt een schone basis die schaalt zonder de technische schuld of prestatieproblemen die geassocieerd worden met templates en zware CMS-plugins."
    }, {
      question: "Wat is het verschil tussen een website en een webapplicatie?",
      answer: "Een website is primair informatief en statisch van aard, terwijl een webapplicatie interactieve functionaliteit biedt zoals gebruikersaccounts, dataverwerking en complexe workflows. Wij ontwikkelen beide, afhankelijk van uw behoeften."
    }, {
      question: "Voor welke bedrijven zijn jullie diensten het meest geschikt?",
      answer: "Wij werken met ambitieuze scale-ups, gevestigde MKB-bedrijven en enterprises die op zoek zijn naar een professionele online aanwezigheid of custom weboplossingen. Van simpele bedrijfswebsites tot complexe webapplicaties."
    }]
  }, {
    title: "Proces",
    icon: Clock,
    items: [{
      question: "Hoe verloopt het ontwikkelproces bij jullie?",
      answer: "Ons proces bestaat uit 5 fasen: (1) Intakegesprek en behoefteanalyse, (2) Design & wireframes, (3) Ontwikkeling & programmering, (4) Testing & optimalisatie, (5) Lancering & overdracht. U blijft tijdens elke fase betrokken."
    }, {
      question: "Hoe lang duurt het om een website te ontwikkelen?",
      answer: "Een standaard bedrijfswebsite realiseren wij in 5-10 werkdagen. Voor complexere projecten zoals webshops of custom webapplicaties plannen we 3-8 weken in, afhankelijk van de functionaliteiten en integraties."
    }, {
      question: "Kan ik tussentijds feedback geven en aanpassingen aanvragen?",
      answer: "Absoluut! We werken iteratief en tonen regelmatig voortgang. U kunt op elk moment feedback geven. Binnen het projectscope zijn aanpassingen mogelijk; grote wijzigingen bespreken we eerst qua tijd en budget."
    }, {
      question: "Is het Design Preview echt gratis?",
      answer: "Ja! Wij geloven erin om onze waarde te bewijzen voordat u zich committeert. We creëren een high-fidelity homepage-concept gebaseerd op uw merkdoelen, zodat u precies ziet waarvoor u betaalt voordat het project start."
    }, {
      question: "Hoe wordt de communicatie tijdens het project georganiseerd?",
      answer: "We werken met een dedicated projectmanager die uw vaste aanspreekpunt is. Communicatie verloopt via email, videocalls, en een projectdashboard waar u 24/7 de voortgang kunt volgen."
    }]
  }, {
    title: "Design",
    icon: Zap,
    items: [{
      question: "Krijg ik een uniek design of werken jullie met templates?",
      answer: "Elk project krijgt een volledig custom design dat aansluit bij uw merkidentiteit, doelgroep en bedrijfsdoelen. We gebruiken geen vooraf gemaakte templates, maar creëren een unieke look & feel."
    }, {
      question: "Ontwerpen jullie ook logo's en huisstijlen?",
      answer: "We richten ons primair op webdesign en kunnen binnen een website bestaande branding doorvoeren. Voor complete huisstijltrajecten werken we samen met gespecialiseerde branding-partners."
    }, {
      question: "Is mijn website responsive en geschikt voor mobiele apparaten?",
      answer: "Ja, standaard! Alle websites ontwikkelen we mobile-first en testen we op verschillende schermformaten, browsers en apparaten. Uw site ziet er perfect uit op desktop, tablet en smartphone."
    }, {
      question: "Kunnen jullie mijn bestaande website redesignen?",
      answer: "Zeker! We analyseren eerst uw huidige site, identificeren verbeterpunten op het gebied van UX, design en techniek, en bouwen vervolgens een moderne, geoptimaliseerde versie die uw merk beter representeert."
    }]
  }, {
    title: "Functionaliteit",
    icon: Shield,
    items: [{
      question: "Kan ik zelf content aanpassen na de oplevering?",
      answer: "Ja, we bouwen een gebruiksvriendelijk content management systeem (CMS) in waarbij u eenvoudig teksten, afbeeldingen en andere content kunt beheren zonder technische kennis. Training is inbegrepen."
    }, {
      question: "Kunnen jullie integraties maken met andere systemen?",
      answer: "Jazeker! We koppelen regelmatig met CRM-systemen (Salesforce, HubSpot), boekhoudsoftware, betalingsproviders, marketing tools en custom API's. We bespreken uw specifieke integratiebehoeften tijdens de intake."
    }, {
      question: "Is er een contactformulier of chatfunctie mogelijk?",
      answer: "Ja, we kunnen diverse contactopties integreren: formulieren, live chat, WhatsApp Business, chatbots en meer. We adviseren welke oplossing het beste past bij uw klantenservice-strategie."
    }, {
      question: "Kunnen jullie een webshop of e-commerce platform ontwikkelen?",
      answer: "Absoluut! We bouwen custom e-commerce oplossingen met productcatalogi, winkelwagen, payment processing (iDEAL, PayPal, creditcard), voorraadbeheer en ordermanagement. Van kleine webshops tot grote platforms."
    }, {
      question: "Kunnen jullie een klantenportaal of inlogomgeving maken?",
      answer: "Ja, we ontwikkelen beveiligde gebruikersportalen met login-functionaliteit, persoonlijke dashboards, documentbeheer en meer. Ideaal voor SaaS-platforms, ledenomgevingen of klantportalen."
    }, {
      question: "Is meertaligheid mogelijk op mijn website?",
      answer: "Zeker! We bouwen meertalige websites met eenvoudige taalwisselingen, waarbij elke taal volledig aan te passen is. Ook SEO-optimalisatie per taal is onderdeel van onze aanpak."
    }]
  }, {
    title: "SEO & Marketing",
    icon: HelpCircle,
    items: [{
      question: "Wordt mijn website geoptimaliseerd voor zoekmachines (SEO)?",
      answer: "Ja, technische SEO is standaard onderdeel van elk project: snelle laadtijden, schone code, meta-tags, structured data, mobile-friendly design en optimale indexering. Voor content SEO kunnen we samenwerken met specialisten."
    }, {
      question: "Helpen jullie ook met Google Ads of social media marketing?",
      answer: "We richten ons op webontwikkeling en technische basis voor marketing. Voor campagnebeheer en marketing strategieën verwijzen we graag door naar onze marketing partners die specialiseren in ads en social media."
    }, {
      question: "Krijg ik Google Analytics en tracking tools?",
      answer: "Ja, we implementeren Google Analytics (GA4), Google Tag Manager en andere tracking tools zodat u inzicht krijgt in bezoekersgedrag, conversies en website performance. We helpen u met de setup en basis interpretatie."
    }, {
      question: "Is mijn website GDPR/AVG-proof?",
      answer: "Ja, we bouwen websites conform GDPR/AVG-wetgeving: cookie consent banners, privacy policy pagina's, veilige dataopslag en duidelijke opt-in mechanismes. We adviseren ook over juridische vereisten."
    }]
  }, {
    title: "Techniek",
    icon: Zap,
    items: [{
      question: "Welke technologieën gebruiken jullie?",
      answer: "We werken met moderne tech-stacks zoals React, Next.js, TypeScript, Node.js en headless CMS-oplossingen. Voor hosting gebruiken we betrouwbare cloud platforms. We kiezen altijd de beste technologie voor uw specifieke project."
    }, {
      question: "Is mijn website veilig en beschermd tegen hackers?",
      answer: "Ja, security staat bij ons voorop: SSL-certificaten, beveiligde databases, regular updates, firewall bescherming en security monitoring. We volgen industry best practices voor webbeveiliging."
    }, {
      question: "Hoe snel laadt mijn website?",
      answer: "We optimaliseren voor maximale snelheid: geoptimaliseerde afbeeldingen, efficient code, CDN-gebruik, caching strategieën en lazy loading. Gemiddeld scoren onze websites 90+ op Google PageSpeed Insights."
    }, {
      question: "Wat gebeurt er als mijn website down gaat?",
      answer: "We monitoren 24/7 en krijgen direct alerts bij downtime. Onze hosting heeft 99.9% uptime garantie. Bij problemen lossen we dit direct op en communiceren we transparant over de status."
    }, {
      question: "Maken jullie back-ups van mijn website?",
      answer: "Ja, automatische dagelijkse back-ups zijn standaard. We bewaren meerdere restore points, zodat we bij problemen snel kunnen terugdraaien naar een werkende versie. Back-ups worden veilig off-site opgeslagen."
    }]
  }, {
    title: "Eigendom",
    icon: Shield,
    items: [{
      question: "Ben ik eigenaar van de code na afronding van het project?",
      answer: "Hoewel onze sites gehost worden op onze geoptimaliseerde infrastructuur voor maximale performance en security, bent u eigenaar van alle content, design en assets. We bieden duidelijke offboarding opties als u ooit elders wilt hosten."
    }, {
      question: "Kan ik mijn website laten overnemen door een andere partij?",
      answer: "Ja, alle code is clean en gedocumenteerd, zodat overname door een andere developer mogelijk is. We leveren alle broncode, documentatie en credentials aan bij offboarding."
    }, {
      question: "Wat gebeurt er als ik stop met de hosting bij jullie?",
      answer: "U kunt altijd besluiten om elders te hosten. We leveren dan een volledige export van de website, database en alle bestanden. We helpen ook bij de overdracht naar een nieuwe hosting partij."
    }]
  }, {
    title: "Prijzen",
    icon: MessageCircle,
    items: [{
      question: "Wat kost een website bij jullie?",
      answer: "Prijzen variëren afhankelijk van complexiteit en functionaliteit. Een basis bedrijfswebsite start vanaf €2.500, terwijl custom webapplicaties tussen €5.000-€25.000+ liggen. We maken altijd eerst een vrijblijvende offerte op maat."
    }, {
      question: "Zijn er verborgen maandelijkse kosten?",
      answer: "Nee, geen verborgen kosten. We zijn transparant over hosting- en onderhoudskosten vanaf dag één. U betaalt voor de ontwikkeling en daarna een vaste maandelijkse fee voor hosting, security updates en performance optimalisatie."
    }, {
      question: "Kan ik in termijnen betalen?",
      answer: "Ja, voor grotere projecten bieden we een termijnenregeling aan: bijvoorbeeld 30% bij start, 40% bij design goedkeuring, en 30% bij oplevering. Dit bespreken we graag tijdens het intakegesprek."
    }, {
      question: "Wat is inbegrepen in de hosting- en onderhoudskosten?",
      answer: "Hosting, SSL-certificaat, dagelijkse back-ups, security monitoring, software updates, performance optimalisatie, technische support en kleine content aanpassingen. Voor grote wijzigingen maken we een separate offerte."
    }]
  }, {
    title: "Support",
    icon: Phone,
    items: [{
      question: "Welke ondersteuning bieden jullie na de lancering?",
      answer: "Elk project bevat een post-launch support periode voor bugfixes en kleine aanpassingen. Daarnaast bieden we maandelijkse onderhoudsplannen voor groeiende bedrijven die continue updates en performance monitoring nodig hebben."
    }, {
      question: "Hoe snel kan ik hulp krijgen bij problemen?",
      answer: "Voor kritieke issues (website down) reageren we binnen 1 uur. Voor normale support vragen binnen 24 uur op werkdagen. Bestaande klanten hebben toegang tot onze support portal en directe contactlijnen."
    }, {
      question: "Bieden jullie training voor het CMS aan?",
      answer: "Ja, na oplevering plannen we een training sessie (1-2 uur) waarin we u leren hoe u content kunt beheren, pagina's kunt aanmaken en de website kunt onderhouden. Documentatie leveren we ook schriftelijk."
    }, {
      question: "Kan ik jullie inhuren voor doorontwikkeling na de lancering?",
      answer: "Zeker! Veel klanten blijven met ons samenwerken voor nieuwe features, optimalisaties of uitbreidingen. We staan altijd klaar om uw digitale product verder te laten groeien met uw bedrijf."
    }]
  }, {
    title: "Strategie",
    icon: HelpCircle,
    items: [{
      question: "Helpen jullie ook met strategie en concept ontwikkeling?",
      answer: "Ja, we beginnen elk project met strategische vragen: Wie is uw doelgroep? Wat zijn uw doelen? Hoe kunnen we conversie maximaliseren? Op basis daarvan adviseren we over structuur, features en user experience."
    }, {
      question: "Kunnen jullie een bestaande website analyseren en verbeteren?",
      answer: "Absoluut! We doen een UX audit, performance analyse en conversie-optimalisatie review. Op basis hiervan presenteren we concrete verbeterpunten die we kunnen doorvoeren in een redesign of iteratieve updates."
    }, {
      question: "Hoe zorgen jullie ervoor dat mijn website conversie optimaliseert?",
      answer: "Door strategische UX design, duidelijke call-to-actions, snelle laadtijden, vertrouwenssignalen, mobile optimization en data-driven beslissingen. We analyseren gebruikersgedrag en optimaliseren continu op basis van resultaten."
    }]
  }];
  const toggleItem = (index: number) => {
    setOpenItems(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };
  const currentCategory = faqCategories[activeCategory];
  return <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0f0a1f] py-20 px-6 lg:px-12">
      {/* Dynamic Glow Background - matching BookingHeroSection aesthetic */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Main Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#0f0a1f]" />
        
        {/* Fluid Background with secondary color for variation */}
        <FluidBackground colorHex="#41AE96" glowSize={0.12} />
        
        {/* Animated Primary Orb */}
        <motion.div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] pointer-events-none" animate={{
        scale: [1, 1.3, 1],
        x: [0, 60, 0],
        y: [0, -40, 0]
      }} transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }} style={{
        background: 'radial-gradient(circle, #6a49ff 0%, transparent 70%)'
      }} />

        {/* Bottom gradient fade */}
        <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(15, 10, 31, 0) 60%, rgba(15, 10, 31, 1) 100%)'
      }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
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
            <span className="relative inline-block italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif">
              weten
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
        <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
          {faqCategories.map((category, index) => <CategoryTab key={index} title={category.title} icon={category.icon} isActive={activeCategory === index} onClick={() => {
          setActiveCategory(index);
          setOpenItems([0]); // Reset to first item open when switching categories
        }} delay={0.3 + index * 0.1} />)}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-20 space-y-4">
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
        }} className="text-center mb-10">
            <h3 className="text-white font-bold text-3xl mb-3">
              Geen antwoord gevonden?
            </h3>
            <p className="text-gray-400 text-lg">
              Ons team staat klaar om je te helpen met elke vraag
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            
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
        }} viewport={{
          once: true
        }} className="bg-gradient-to-r from-primary to-secondary rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col items-center text-center">
            <div className="mb-4 sm:mb-6">
              <h4 className="text-lg sm:text-xl md:text-2xl leading-[1.3] font-medium text-primary-foreground mb-2 sm:mb-3">
                Klaar om jouw project te starten?
              </h4>
              <p className="text-primary-foreground text-sm sm:text-base leading-relaxed opacity-90 mb-4">
                Boek hier een 15 min meeting met ons team.
              </p>
            </div>
            <button
              onClick={goToBooking}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3 md:px-6 md:py-3.5 min-h-[44px] sm:min-h-[40px] bg-secondary text-secondary-foreground rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all hover:bg-secondary/90 hover:scale-[1.02] cursor-pointer"
            >
              <span className="text-center">Boek je GRATIS meeting!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 1
        }} className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#41AE96]" />
              <span>100% Vrijblijvend</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#41AE96]" />
              <span>20 Minuten</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#41AE96]" />
              <span>Direct Toepasbare Inzichten</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line - matching BookingHeroSection */}
    </section>;
};