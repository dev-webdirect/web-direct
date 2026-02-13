"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Smartphone, Zap, Database, Layout, PenTool, LifeBuoy, Code } from 'lucide-react';

// Constants for the WebDirect features as cards
const WEBDIRECT_CARDS = [{
  id: 'conversion-design',
  title: 'Conversion-first design',
  description: 'Wij ontwerpen websites die gemaakt zijn om klanten binnen te halen, niet om alleen "mooi" te zijn.',
  Icon: Palette,
  bgColor: 'rgba(139, 92, 246, 0.1)',
  borderColor: 'rgba(139, 92, 246, 0.3)',
  shadowColor: 'rgba(139, 92, 246, 0.3)'
}, {
  id: 'custom-code',
  title: '100% maatwerk in code',
  description: 'Alles wordt custom gebouwd in React en Next.js. Geen builders, geen templates, geen beperkingen.',
  Icon: Code,
  bgColor: 'rgba(139, 92, 246, 0.1)',
  borderColor: 'rgba(139, 92, 246, 0.3)',
  shadowColor: 'rgba(139, 92, 246, 0.3)'
}, {
  id: 'fast-performance',
  title: 'Supersnelle performance',
  description: 'Snelle laadtijden zorgen voor betere SEO, meer vertrouwen en hogere conversie.',
  Icon: Zap,
  bgColor: 'rgba(139, 92, 246, 0.1)',
  borderColor: 'rgba(139, 92, 246, 0.3)',
  shadowColor: 'rgba(139, 92, 246, 0.3)'
}, {
  id: 'scalable',
  title: 'Gebouwd om te schalen',
  description: 'Nieuwe pagina\'s, campagnes of funnels toevoegen zonder dat je website opnieuw gebouwd moet worden.',
  Icon: Database,
  bgColor: 'rgba(139, 92, 246, 0.1)',
  borderColor: 'rgba(139, 92, 246, 0.3)',
  shadowColor: 'rgba(139, 92, 246, 0.3)'
}, {
  id: 'seo-ready',
  title: 'SEO-ready structuur',
  description: 'Technische SEO zit standaard ingebouwd. Schone code, sterke structuur en goede indexatie in Google.',
  Icon: Layout,
  bgColor: 'rgba(139, 92, 246, 0.1)',
  borderColor: 'rgba(139, 92, 246, 0.3)',
  shadowColor: 'rgba(139, 92, 246, 0.3)'
}, {
  id: 'premium-quality',
  title: 'Premium uitstraling, zonder agency prijzen',
  description: 'Door onze AI-gedreven workflow leveren we high-end kwaliteit sneller en vaak goedkoper dan traditionele bureaus.',
  Icon: PenTool,
  bgColor: 'rgba(139, 92, 246, 0.1)',
  borderColor: 'rgba(139, 92, 246, 0.3)',
  shadowColor: 'rgba(139, 92, 246, 0.3)'
}, {
  id: 'mobile-first',
  title: 'Perfect op mobiel',
  description: 'Mobile-first design zodat je site op elk scherm strak, snel en professioneel aanvoelt.',
  Icon: Smartphone,
  bgColor: 'rgba(139, 92, 246, 0.1)',
  borderColor: 'rgba(139, 92, 246, 0.3)',
  shadowColor: 'rgba(139, 92, 246, 0.3)'
}, {
  id: 'support',
  title: 'Support en optimalisatie',
  description: 'Geen "website opleveren en klaar". We blijven betrokken en optimaliseren waar nodig.',
  Icon: LifeBuoy,
  bgColor: 'rgba(139, 92, 246, 0.1)',
  borderColor: 'rgba(139, 92, 246, 0.3)',
  shadowColor: 'rgba(139, 92, 246, 0.3)'
}] as any[];

// @component: WebDirectCards
export const WhyChooseTemplates = () => {
  // @return
  return <section className="w-full py-20 px-4 md:px-8 lg:px-12 bg-[#0f0a1f] font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Waarom bedrijven kiezen voor{' '}
            <span className="italic font-serif font-medium bg-gradient-to-r from-[#6a49ff] via-[#5839e6] to-[#41ae96] bg-clip-text text-transparent" style={{
            fontSize: '58px'
          }}>
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