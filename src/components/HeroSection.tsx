'use client';

import { useState, useEffect } from 'react';
import { FluidBackground } from "./FluidBackground";
import { GradientOverlay } from "./GradientOverlay";
import { motion } from 'framer-motion';

export const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [displayedText, setDisplayedText] = useState('');
  
  const words = ['verkopen', 'converteren', 'groeiën', 'opvallen'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentCharIndex < currentWord.length) {
          setDisplayedText(currentWord.substring(0, currentCharIndex + 1));
          setCurrentCharIndex(currentCharIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentCharIndex > 0) {
          setDisplayedText(currentWord.substring(0, currentCharIndex - 1));
          setCurrentCharIndex(currentCharIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentCharIndex, currentWordIndex, isDeleting, words]);

  return (
    <section className="min-h-[90vh] px-4 sm:px-6 lg:px-12 relative overflow-hidden flex items-center justify-center pb-8 sm:pb-12 pt-24 sm:pt-28 md:pt-32 bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] dark:from-[#0f0a1f] dark:via-[#1a0f2e] dark:to-[#0f0a1f] z-20">
        {/* Fluid Background with Purple Theme */}
        <FluidBackground colorHex="#6a49ff" glowSize={0.15} />
        <GradientOverlay />
        
        {/* Animated Background - Keeping cursor wave */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {/* Dynamic Wave Following Cursor */}
          <motion.div className="absolute w-[800px] h-[800px] rounded-full opacity-30" style={{
          background: 'radial-gradient(circle, rgba(106, 73, 255, 0.4) 0%, rgba(88, 57, 230, 0.2) 30%, transparent 70%)',
          filter: 'blur(60px)'
        }} animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400
        }} transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5
        }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-30 w-full flex items-center justify-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center max-w-5xl mx-auto px-4">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-block px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#6a49ff]/10 text-[#a78bfa] border border-[#6a49ff]/20">100% CUSTOM WEBSITES</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-bold text-[2.25rem] min-[400px]:text-[2.75rem] sm:text-[3.25rem] md:text-[3.9rem] lg:text-[4.5rem] xl:text-[5.2rem] text-white mb-8 sm:mb-10 leading-[1.1] tracking-tight w-full max-w-[min(1000px,100%)]">
              Websites die gemaakt zijn om te{' '}
              <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#5839e6] font-serif">
                {displayedText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto font-light">We combineren strategie, design en technologie om ambitieuze merken te helpen opvallen en krachtige digitale ervaringen te creëren die écht impact maken.</p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-5 mb-6 sm:mb-8 flex-wrap">
              <motion.a href="#preview" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6a49ff] to-[#5839e6] text-white px-6 py-3.5 sm:px-10 sm:py-5 rounded-full hover:shadow-2xl hover:shadow-[#6a49ff]/20 font-semibold text-sm sm:text-base active:scale-95 active:shadow-sm hover:from-[#5839e6] hover:to-[#6a49ff]" whileHover={{
              rotate: [0, -5, 5, -5, 5, 0],
              transition: {
                duration: 0.5,
                ease: "easeInOut"
              }
            }}>
                Vraag GRATIS webdesign aan.
              </motion.a>
              <a href="#services" className="inline-flex items-center gap-2 text-white px-6 py-3.5 sm:px-10 sm:py-5 rounded-full hover:bg-white/10 transition-all font-semibold text-sm sm:text-base border border-white/30 active:scale-95 hover:border-white/50 backdrop-blur-sm">Bekijk websites. </a>
            </div>

            {/* Trusted By Section */}
            <div className="mt-12">
              <p className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4 sm:mb-8">VERTROUWD DOOR 100+ MERKEN</p>
              <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap opacity-50 grayscale">
                {/* Placeholder logo spaces */}
                <div className="h-8 w-24 bg-white/20 rounded"></div>
                <div className="h-8 w-24 bg-white/20 rounded"></div>
                <div className="h-8 w-24 bg-white/20 rounded"></div>
                <div className="h-8 w-24 bg-white/20 rounded"></div>
              </div>

              {/* Scroll Indicator */}
              <motion.div className="mt-12 flex flex-col items-center gap-2" initial={{
              opacity: 0,
              y: -10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 1,
              duration: 0.6
            }}>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">SCROLL OM TE ONTDEKKEN</p>
                <motion.div animate={{
                y: [0, 8, 0]
              }} transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }} className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                  <motion.div className="w-1.5 h-1.5 bg-white rounded-full" animate={{
                  y: [0, 12, 0]
                }} transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }} />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
  );
};