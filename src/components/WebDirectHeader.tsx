'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeXml, ArrowRight, Sun, Moon } from 'lucide-react';
interface WebDirectHeaderProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}
interface NavLink {
  name: string;
  href: string;
}
const NAV_LINKS: NavLink[] = [{
  name: 'Services',
  href: '#services'
}, {
  name: 'Process',
  href: '#process'
}, {
  name: 'About',
  href: '#about'
}];
const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8
};

// @component: WebDirectHeader
export const WebDirectHeader = ({
  theme = 'dark',
  toggleTheme
}: WebDirectHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Burger menu variants for the interactive scrolled state
  const topBarVariants = {
    initial: {
      y: 0,
      rotate: 0
    },
    hover: {
      y: 2,
      rotate: 0
    }
  };
  const bottomBarVariants = {
    initial: {
      y: 0,
      rotate: 0
    },
    hover: {
      y: -2,
      rotate: 0
    }
  };

  // @return
  return <motion.nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center" initial={false} animate={{
    maxWidth: isScrolled ? '625px' : '1280px'
  }} transition={smoothTransition}>
      <div className="relative w-full">
        <motion.div className="flex items-center justify-between w-full bg-white/95 dark:bg-[#1a1227]/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden" initial={false} animate={{
        height: isScrolled ? 68 : 80,
        borderRadius: isScrolled ? 34 : 24,
        paddingLeft: isScrolled ? 20 : 32,
        paddingRight: isScrolled ? 180 : 164 // Increased for button + theme toggle
      }} transition={smoothTransition}>
          {/* Logo Section */}
          <motion.div className="flex items-center gap-3 flex-shrink-0" animate={{
          gap: isScrolled ? 8 : 12
        }} transition={smoothTransition}>
            <motion.div className="bg-gradient-to-br from-[#6a49ff] to-[#5839e6] rounded-lg flex items-center justify-center flex-shrink-0" animate={{
            width: isScrolled ? 36 : 40,
            height: isScrolled ? 36 : 40
          }} transition={smoothTransition}>
              <motion.div animate={{
              scale: isScrolled ? 0.9 : 1
            }} transition={smoothTransition}>
                <CodeXml className="text-white w-5 h-5" />
              </motion.div>
            </motion.div>
            <motion.span className="font-bold text-[#30294e] dark:text-white whitespace-nowrap" animate={{
            fontSize: isScrolled ? '16px' : '20px'
          }} transition={smoothTransition}>
              WebDirect
            </motion.span>
          </motion.div>

          {/* Navigation Links (Desktop, hidden when scrolled) */}
          <AnimatePresence mode="wait">
            {!isScrolled && <motion.div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.2
          }}>
                {NAV_LINKS.map(link => <a key={link.name} href={link.href} className="text-gray-600 dark:text-gray-300 hover:text-[#6a49ff] dark:hover:text-[#6a49ff] transition-all font-medium text-sm">
                    {link.name}
                  </a>)}
              </motion.div>}
          </AnimatePresence>

          {/* Scrolled Interactive Indicator */}
          <AnimatePresence mode="wait">
            {isScrolled && <motion.div className="hidden md:flex items-center justify-center cursor-pointer group absolute left-1/2 -translate-x-1/2" initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} exit={{
            opacity: 0,
            scale: 0.8
          }} transition={{
            duration: 0.2
          }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <div className="relative w-[30px] h-[30px] flex items-center justify-center">
                  <motion.div className="absolute top-[11px] left-[5px] w-5 h-[1.5px] bg-[#30294e] dark:bg-white" variants={topBarVariants} animate={isHovered ? 'hover' : 'initial'} transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30
              }} />
                  <motion.div className="absolute bottom-[11px] left-[5px] w-5 h-[1.5px] bg-[#30294e] dark:bg-white" variants={bottomBarVariants} animate={isHovered ? 'hover' : 'initial'} transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30
              }} />
                </div>
              </motion.div>}
          </AnimatePresence>
        </motion.div>

        {/* Action Button */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-300 ease-out flex items-center gap-2" style={{
        paddingRight: isScrolled ? '16px' : '32px'
      }}>
          {toggleTheme && <motion.button onClick={toggleTheme} className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" whileHover={{
          scale: 1.1
        }} whileTap={{
          scale: 0.95
        }}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>}
          <motion.button className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6a49ff] text-white rounded-full hover:shadow-lg transition-shadow font-medium hover:bg-[#5839e6] whitespace-nowrap text-sm group" whileHover={{
          rotate: [0, -2, 2, -2, 2, 0],
          transition: {
            duration: 0.4,
            ease: "easeInOut"
          }
        }}>
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.nav>;
};