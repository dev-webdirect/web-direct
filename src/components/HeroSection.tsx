'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../lib/utils';
import { CTAButtonGroup } from './CTAButtonGroup';

const FluidBackground = dynamic(
  () => import('./FluidBackground').then((m) => m.FluidBackground),
  { ssr: false }
);
// Helper for brand logos placeholders
const BrandLogo = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "h-8 w-24 bg-white/10 rounded-md backdrop-blur-sm border border-white/5",
      className
    )}
  />
);

export const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [mouseEventTarget, setMouseEventTarget] = useState<HTMLElement | null>(null);
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  const [showFluid, setShowFluid] = useState(false);

  // Defer fluid background until after first paint to improve LCP
  useEffect(() => {
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(() => setShowFluid(true), { timeout: 300 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(() => setShowFluid(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();

    // Safari fallback: addListener/removeListener
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  const shouldAnimate = !isMobile;

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse follower
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax effects for background elements
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  // Scroll indicator opacity - fade out when scrolling down
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  // Rotating words state
  const rotatingWords = [
    'Converteren.',
    'Overtuigen.',
    'Verkopen.',
    'Groeien.',
    'Schalen.',
    'Presteren.',
    'Domineren.'
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMouseInside, setIsMouseInside] = useState(false);

  // Mouse move handler
  useEffect(() => {
    if (!shouldAnimate) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };

    const handleMouseEnter = () => setIsMouseInside(true);
    const handleMouseLeave = () => setIsMouseInside(false);

    const container = mouseEventTarget || containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [mouseX, mouseY, mouseEventTarget, shouldAnimate]);

  // Typing animation effect (same on mobile and desktop)
  useEffect(() => {
    const currentWord = rotatingWords[currentWordIndex];
    const typingSpeed = isDeleting ? 30 : 60;
    const pauseBeforeDelete = 1500;
    const pauseBeforeType = 300;
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedText === currentWord) {
      // Pause before starting to delete
      timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
    } else if (isDeleting && displayedText === '') {
      // Move to next word and start typing
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    } else {
      // Type or delete one character
      timeout = setTimeout(() => {
        setDisplayedText((prev) => {
          if (isDeleting) {
            return currentWord.substring(0, prev.length - 1);
          } else {
            return currentWord.substring(0, prev.length + 1);
          }
        });
      }, typingSpeed);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [displayedText, isDeleting, currentWordIndex, rotatingWords]);

  
  return (
    <section
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLElement | null>).current = el;
        setMouseEventTarget(el);
      }}
      className="relative min-h-screen w-full flex flex-col overflow-hidden px-4 lg:px-8"
    >
        {/* Dynamic Glow Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Main Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#0f0a1f]" />
          
          {/* Fluid Background - deferred so LCP can paint first */}
          {shouldAnimate && showFluid && (
            <FluidBackground colorHex="#41ae96" glowSize={0.15} mouseEventTarget={mouseEventTarget} />
          )}

          {/* Animated Orbs for additional depth */}
          {shouldAnimate ? (
            <motion.div
              style={{ y: y2 }}
              className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[150px]"
              animate={{
                scale: [1, 1.1, 1],
                x: [0, -30, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              initial={{
                background: 'radial-gradient(circle, #41ae96 0%, transparent 70%)'
              }}
            />
          ) : (
            <div
              className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[150px]"
              style={{ background: 'radial-gradient(circle, #41ae96 0%, transparent 70%)' }}
            />
          )}

          {/* Overlay mesh/grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(15, 10, 31, 0) 60%, rgba(15, 10, 31, 1) 100%)'
            }}
          />
        </div>

        {/* Mouse Follower Glow - On top of background */}
        {shouldAnimate && (
          <motion.div
            className="absolute z-[5] pointer-events-none"
            style={{
              x: smoothMouseX,
              y: smoothMouseY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isMouseInside ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main glow */}
            <div className="w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#6a49ff]/30 via-[#6a49ff]/10 to-transparent blur-[100px]" />
            
            {/* Secondary glow for more depth */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#a78bfa]/20 via-[#a78bfa]/5 to-transparent blur-[80px]"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Center highlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-gradient-radial from-white/10 to-transparent blur-[40px]" />
          </motion.div>
        )}

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center flex-1 justify-center pb-16 pt-20">
          {/* Badge */}
          <div className="mb-5">
            <span className="inline-flex items-center mt-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#6a49ff]/10 text-[#a78bfa] border border-[#6a49ff]/20 backdrop-blur-md">
              <span className="mr-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#6a49ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6a49ff]"></span>
              </span>
              100% Custom Websites
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="max-w-[1000px] font-bold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-white mb-10 leading-[1.15] tracking-tight">
            Websites die gemaakt zijn om te{' '}
            <span className="relative inline-block italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif">
              {displayedText}
              <span className="animate-pulse inline-block ml-1 text-white opacity-50 italic font-serif text-[0.7em]">
                |
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed my-4 font-light">
            We combineren strategie, design en technologie om ambitieuze merken te
            helpen opvallen en krachtige digitale ervaringen te creëren die écht
            impact maken.
          </p>

          {/* CTAs */}
          <div>
            <CTAButtonGroup
              primaryText="Vraag GRATIS webdesign aan."
              primaryHref="/booking"
              secondaryText="Bekijk websites."
            />
          </div>

          {/* Social Proof */}
          <div className="w-full flex flex-col items-center mt-10">
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">
              VERTROUWD DOOR 100+ MERKEN
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <BrandLogo />
              <BrandLogo />
              <BrandLogo />
              <BrandLogo />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            style={{ opacity: 0.75 }}
            className="mt-10 sm:mt-12 flex flex-col items-center gap-2 cursor-pointer"
          >
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-[0.15em]">
              SCROLL OM TE ONTDEKKEN
            </p>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
              {shouldAnimate ? (
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]"
                />
              ) : (
                <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]" />
              )}
            </div>
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};