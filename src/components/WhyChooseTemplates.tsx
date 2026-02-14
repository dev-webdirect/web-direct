"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Smartphone, Zap, Database, Layout, PenTool, LifeBuoy, Code } from 'lucide-react';

// Constants for the WebDirect features as cards
const CARD_STYLE = {
  bgColor: 'rgba(15, 10, 31, 0.98)',
  borderColor: 'rgba(106, 73, 255, 0.45)',
  shadowColor: 'rgba(106, 73, 255, 0.2)',
};

const WEBDIRECT_CARDS = [{
  id: 'conversion-design',
  title: 'Conversion-first design',
  description: 'Wij ontwerpen websites die gemaakt zijn om klanten binnen te halen, niet om alleen "mooi" te zijn.',
  Icon: Palette,
  ...CARD_STYLE,
}, {
  id: 'custom-code',
  title: '100% maatwerk in code',
  description: 'Alles wordt custom gebouwd in React en Next.js. Geen builders, geen templates, geen beperkingen.',
  Icon: Code,
  ...CARD_STYLE,
}, {
  id: 'fast-performance',
  title: 'Supersnelle performance',
  description: 'Snelle laadtijden zorgen voor betere SEO, meer vertrouwen en hogere conversie.',
  Icon: Zap,
  ...CARD_STYLE,
}, {
  id: 'scalable',
  title: 'Gebouwd om te schalen',
  description: 'Nieuwe pagina\'s, campagnes of funnels toevoegen zonder dat je website opnieuw gebouwd moet worden.',
  Icon: Database,
  ...CARD_STYLE,
}, {
  id: 'seo-ready',
  title: 'SEO-ready structuur',
  description: 'Technische SEO zit standaard ingebouwd. Schone code, sterke structuur en goede indexatie in Google.',
  Icon: Layout,
  ...CARD_STYLE,
}, {
  id: 'premium-quality',
  title: 'Premium uitstraling, zonder agency prijzen',
  description: 'Door onze AI-gedreven workflow leveren we high-end kwaliteit sneller en vaak goedkoper dan traditionele bureaus.',
  Icon: PenTool,
  ...CARD_STYLE,
}, {
  id: 'mobile-first',
  title: 'Perfect op mobiel',
  description: 'Mobile-first design zodat je site op elk scherm strak, snel en professioneel aanvoelt.',
  Icon: Smartphone,
  ...CARD_STYLE,
}, {
  id: 'support',
  title: 'Support en optimalisatie',
  description: 'Geen "website opleveren en klaar". We blijven betrokken en optimaliseren waar nodig.',
  Icon: LifeBuoy,
  ...CARD_STYLE,
}] as any[];

// @component: WebDirectCards
export const WhyChooseTemplates = () => {
  // @return
  return <section className="w-full py-20 px-4 md:px-8 lg:px-12 font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
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
            Waarom bedrijven kiezen voor{' '}
            <span className="relative inline-block italic font-large text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif">

              WebDirect.
            </span>
          </motion.h2>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.1
        }} className="text-gray-300 text-lg leading-relaxed">
            Wij bouwen conversion-first websites in code. Geen wordpress of Webflow templates. Sneller, krachtiger en
            schaalbaar zonder beperkingen.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WEBDIRECT_CARDS.map((item, index) => {
          const IconComponent = item.Icon;
          return <motion.div key={item.id} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} style={{
            backgroundColor: item.bgColor,
            borderColor: item.borderColor
          }} className="group flex flex-col justify-between rounded-2xl border overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="p-8 z-10">
                  {/* Icon */}
                  <div className="w-[50px] h-[50px] rounded-lg mb-6 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110" style={{
                boxShadow: `0 8px 16px 0 ${item.shadowColor}`
              }}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-medium mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>;
        })}
        </div>
      </div>
    </section>;
};