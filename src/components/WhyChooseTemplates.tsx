'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Smartphone, Zap, Database, Layout, PenTool, LifeBuoy } from 'lucide-react';
import { FluidBackground } from './FluidBackground';
import { GradientOverlay } from './GradientOverlay';

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
  title: "Premium design",
  description: "Professionally designed templates with clean layouts and clear visual hierarchy."
}, {
  icon: <Smartphone className="w-8 h-8" />,
  title: "Perfectly responsive",
  description: "Templates designed to work seamlessly across all screen sizes."
}, {
  icon: <Zap className="w-8 h-8" />,
  title: "Seamless animations",
  description: "Subtle motion that adds polish without hurting clarity or performance."
}, {
  icon: <Database className="w-8 h-8" />,
  title: "CMS-ready structure",
  description: "Templates built with CMS support for scalable content management."
}, {
  icon: <Zap className="w-8 h-8" />,
  title: "Built for speed",
  description: "Optimized templates focused on fast loading and smooth performance."
}, {
  icon: <Layout className="w-8 h-8" />,
  title: "Flexible structure",
  description: "Section-based design so you can reuse blocks and build the exact layout you need."
}, {
  icon: <PenTool className="w-8 h-8" />,
  title: "Easy to customize",
  description: "Organized styles and components so edits stay simple even for non-technical users."
}, {
  icon: <LifeBuoy className="w-8 h-8" />,
  title: "Dedicated support",
  description: "Well-documented templates with helpful support when you need assistance."
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
      {/* Fluid Background with Purple Theme - matching WebDirect Hero */}
      <FluidBackground colorHex="#6a49ff" glowSize={0.15} />
      <GradientOverlay />
      
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
            Why choose our templates
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Built with the same care we apply to real client projects. Designed to help you launch faster without compromising quality.
          </p>
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