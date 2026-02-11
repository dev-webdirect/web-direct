"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Smartphone, Zap, Database, Layout, PenTool, LifeBuoy } from 'lucide-react';

/**
 * Interface for individual feature item data
 */
interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * Data for the feature grid, based on the original request's content
 */
const DEFAULT_FEATURES: FeatureItem[] = [{
  icon: <Palette className="w-8 h-8" />,
  title: "Conversion-first design",
  description: "Wij ontwerpen websites die gemaakt zijn om klanten binnen te halen, niet om alleen \u201Cmooi\u201D te zijn."
}, {
  icon: <Smartphone className="w-8 h-8" />,
  title: "100% maatwerk in code",
  description: "Alles wordt custom gebouwd in React en Next.js. Geen builders, geen templates, geen beperkingen."
}, {
  icon: <Zap className="w-8 h-8" />,
  title: "Supersnelle performance",
  description: "Snelle laadtijden zorgen voor betere SEO, meer vertrouwen en hogere conversie."
}, {
  icon: <Database className="w-8 h-8" />,
  title: "Gebouwd om te schalen",
  description: "Nieuwe pagina\u2019s, campagnes of funnels toevoegen zonder dat je website opnieuw gebouwd moet worden."
}, {
  icon: <Zap className="w-8 h-8" />,
  title: "SEO-ready structuur",
  description: "Technische SEO zit standaard ingebouwd. Schone code, sterke structuur en goede indexatie in Google."
}, {
  icon: <Layout className="w-8 h-8" />,
  title: "Premium uitstraling, zonder agency prijzen",
  description: "Door onze AI-gedreven workflow leveren we high-end kwaliteit sneller en vaak goedkoper dan traditionele bureaus."
}, {
  icon: <PenTool className="w-8 h-8" />,
  title: "Perfect op mobiel",
  description: "Mobile-first design zodat je site op elk scherm strak, snel en professioneel aanvoelt."
}, {
  icon: <LifeBuoy className="w-8 h-8" />,
  title: "Support en optimalisatie",
  description: "Geen \u201Cwebsite opleveren en klaar\u201D. We blijven betrokken en optimaliseren waar nodig."
}];

/**
 * WhyChooseTemplates Component
 * A high-end feature section with a dark theme, responsive grid, and interactive elements.
 */
// @component: WhyChooseTemplates
export const WhyChooseTemplates = () => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  // @return
  return <section className="relative min-h-screen w-full py-24 px-6 md:px-12 lg:px-24 overflow-hidden bg-[#0f0a1f]">
      
      {/* Animated Background - Cursor wave effect matching WebDirect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Dynamic Wave Following Cursor */}
        <motion.div className="absolute w-[800px] h-[800px] rounded-full opacity-30" style={{
        background: 'radial-gradient(circle, rgba(106, 73, 255, 0.4) 0%, rgba(88, 57, 230, 0.2) 30%, transparent 70%)',
        filter: 'blur(60px)'
      }} animate={{
        x: mousePosition.x - 400,
        y: mousePosition.y - 400
      }} transition={{
        type: "spring" as const,
        damping: 30,
        stiffness: 200,
        mass: 0.5
      }} />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Waarom bedrijven kiezen voor <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif" style={{
            marginTop: "50px",
            height: "0px",
            translate: "-0.1px 7px",
            fontSize: "60px"
          }}>WebDirect.</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">Wij bouwen conversion-first websites in code. Geen wordpress of Webflow templates. Sneller, krachtiger en schaalbaar zonder beperkingen.</p>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        margin: "-100px"
      }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {DEFAULT_FEATURES.map((feature, index) => <motion.div key={index} variants={itemVariants} whileHover={{
          scale: 1.02
        }} className="group flex flex-col items-center text-center">
              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group-hover:border-[#6a49ff]/50 group-hover:bg-white/10 transition-all duration-300">
                <div className="text-[#a78bfa]">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#a78bfa] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-[240px]">
                {feature.description}
              </p>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};