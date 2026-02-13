"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
type Project = {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
};
const PROJECTS: Project[] = [{
  id: '1',
  title: 'QuickTask - Productivity App',
  category: 'Branding',
  image: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bc0d/68e6270c1cc92077f082d697_05.webp',
  link: '#'
}, {
  id: '2',
  title: 'Brandora – Creative Agency Website',
  category: 'UI/UX design',
  image: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bc0d/68e62886fbccb91a947910b0_01.webp',
  link: '#'
}, {
  id: '3',
  title: 'Bloom CRM – Sales Dashboard',
  category: 'SaaS Web Design',
  image: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bc0d/68e62aebcb5242413f1c78aa_02.webp',
  link: '#'
}, {
  id: '4',
  title: 'Shoppr – E-commerce Landing Page',
  category: 'UI Design',
  image: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bc0d/68e62b920428efb76a94093d_03.webp',
  link: '#'
}, {
  id: '5',
  title: 'Insightly – Analytics SaaS Website',
  category: 'Webflow Development',
  image: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bc0d/68e62c823cecf3170ffffe28_04.webp',
  link: '#'
}, {
  id: '6',
  title: 'Brandora – Creative Agency Website',
  category: 'UI/UX design',
  image: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bc0d/68e62886fbccb91a947910b0_01.webp',
  link: '#'
}];

// @component: WorkShowcase
export const WorkShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with second item for initial center visual
  const [direction, setDirection] = useState(0);
  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(prevIndex => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = PROJECTS.length - 1;
      if (nextIndex >= PROJECTS.length) nextIndex = 0;
      return nextIndex;
    });
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  // @return
  return <section className="relative w-full min-h-screen bg-[#13101F] overflow-hidden py-16 sm:py-24 lg:py-32 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="w-full max-w-[900px] mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-white text-3xl md:text-4xl font-medium leading-tight text-center sm:text-left w-full sm:w-auto">Onze projecten.</motion.h2>

          <div className="flex gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
            <button onClick={() => paginate(-1)} className="group w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#121212] hover:bg-[#1a1a1a] text-white rounded-lg sm:rounded-xl transition-all duration-300 border border-white/5 active:scale-90" aria-label="Previous Project">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button onClick={() => paginate(1)} className="group w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#121212] hover:bg-[#1a1a1a] text-white rounded-lg sm:rounded-xl transition-all duration-300 border border-white/5 active:scale-90" aria-label="Next Project">
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full flex items-center justify-center h-[420px] sm:h-[520px] lg:h-[650px]">
          <div className="w-full max-w-[1000px] relative h-full flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div key={currentIndex} custom={direction} initial={{
              opacity: 0,
              x: direction > 0 ? 300 : -300,
              scale: 0.8,
              rotateY: direction > 0 ? 15 : -15
            }} animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              rotateY: 0
            }} exit={{
              opacity: 0,
              x: direction > 0 ? -300 : 300,
              scale: 0.8,
              rotateY: direction > 0 ? -15 : 15
            }} transition={{
              x: {
                type: "spring",
                stiffness: 300,
                damping: 30
              },
              opacity: {
                duration: 0.4
              },
              scale: {
                duration: 0.4
              },
              rotateY: {
                duration: 0.4
              }
            }} className="absolute w-full max-w-[900px] h-full flex flex-col items-center z-10 px-0">
                <div className="group relative w-full bg-[#30294E] p-2 sm:p-2.5 rounded-2xl cursor-pointer overflow-hidden border border-white/5 shadow-2xl transition-colors duration-500 hover:border-white/10">
                  {/* Image Container */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl">
                    <img src={PROJECTS[currentIndex].image} alt={PROJECTS[currentIndex].title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    
                    {/* Hover Overlay Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div initial={{
                      y: 20
                    }} whileHover={{
                      y: 0
                    }} className="bg-linear-to-br from-[#dafe7d] to-[#7af080] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-[#0a0a0a] text-sm font-semibold">View project</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="w-full py-5 sm:py-6 px-3 sm:px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">
                    <h3 className="text-white/90 text-base sm:text-xl font-normal group-hover:text-white transition-colors">
                      {PROJECTS[currentIndex].title}
                    </h3>
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4b4b4b]" />
                      <span className="text-[#adadad] text-xs sm:text-sm">
                        {PROJECTS[currentIndex].category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Background Peeking Items (Visual Flair) */}
            <div className="absolute left-[-20%] scale-75 opacity-20 pointer-events-none hidden lg:block z-0">
              <div className="w-[800px] aspect-[16/9] bg-[#30294E] rounded-2xl border border-white/5" />
            </div>
            <div className="absolute right-[-20%] scale-75 opacity-20 pointer-events-none hidden lg:block z-0">
              <div className="w-[800px] aspect-[16/9] bg-[#30294E] rounded-2xl border border-white/5" />
            </div>
          </div>
        </div>

        {/* Progress Navigation Dots */}
        <div className="flex flex-wrap justify-center gap-2.5 mt-8 sm:mt-12 px-2">
          {PROJECTS.map((_, idx) => <button key={idx} onClick={() => {
          setDirection(idx > currentIndex ? 1 : -1);
          setCurrentIndex(idx);
        }} className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'}`} aria-label={`Go to slide ${idx + 1}`} />)}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#dafe7d] opacity-[0.02] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7af080] opacity-[0.02] blur-[120px] rounded-full" />
      </div>
    </section>;
};