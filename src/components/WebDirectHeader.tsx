'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeXml, ArrowRight, Sun, Moon, Menu, X } from 'lucide-react';

interface WebDirectHeaderProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

interface NavLink {
  name: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { name: 'Services', href: '#services' },
  { name: 'Process', href: '#process' },
  { name: 'About', href: '#about' },
];

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

// @component: WebDirectHeader
export const WebDirectHeader = ({
  theme = 'dark',
  toggleTheme,
}: WebDirectHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Burger menu variants for the interactive scrolled state
  const topBarVariants = {
    initial: { y: 0, rotate: 0 },
    hover: { y: 2, rotate: 0 },
  };
  const bottomBarVariants = {
    initial: { y: 0, rotate: 0 },
    hover: { y: -2, rotate: 0 },
  };

  // @return
  return (
    <>
      <motion.nav
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-full px-3 sm:px-6 flex justify-center"
        initial={false}
        animate={{
          maxWidth: isScrolled ? '625px' : '1280px',
        }}
        transition={smoothTransition}
      >
        <div className="relative w-full">
          <motion.div
            className="flex items-center justify-between w-full bg-white/70 dark:bg-[#1a1227]/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700/50 shadow-md shadow-black/5 overflow-hidden"
            initial={false}
            animate={{
              height: isScrolled ? 56 : 64,
              borderRadius: isScrolled ? 28 : 20,
              paddingLeft: isScrolled ? 16 : 20,
              paddingRight: isScrolled ? 16 : 20,
            }}
            transition={smoothTransition}
          >
            {/* Logo Section */}
            <motion.div
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
              animate={{ gap: isScrolled ? 8 : 12 }}
              transition={smoothTransition}
            >
              <motion.div
                className="bg-gradient-to-br from-[#6a49ff] to-[#5839e6] rounded-lg flex items-center justify-center flex-shrink-0"
                animate={{
                  width: isScrolled ? 32 : 36,
                  height: isScrolled ? 32 : 36,
                }}
                transition={smoothTransition}
              >
                <motion.div
                  animate={{ scale: isScrolled ? 0.9 : 1 }}
                  transition={smoothTransition}
                >
                  <CodeXml className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </motion.div>
              <motion.span
                className="font-bold text-[#30294e] dark:text-white whitespace-nowrap text-base sm:text-lg"
                animate={{ fontSize: isScrolled ? '14px' : undefined }}
                transition={smoothTransition}
              >
                WebDirect
              </motion.span>
            </motion.div>

            {/* Navigation Links (Desktop only, hidden when scrolled) */}
            <AnimatePresence mode="wait">
              {!isScrolled && (
                <motion.div
                  className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-[#6a49ff] dark:hover:text-[#6a49ff] transition-all font-medium text-sm"
                    >
                      {link.name}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrolled Interactive Indicator (Desktop only) */}
            <AnimatePresence mode="wait">
              {isScrolled && (
                <motion.div
                  className="hidden md:flex items-center justify-center cursor-pointer group absolute left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="relative w-[30px] h-[30px] flex items-center justify-center">
                    <motion.div
                      className="absolute top-[11px] left-[5px] w-5 h-[1.5px] bg-[#30294e] dark:bg-white"
                      variants={topBarVariants}
                      animate={isHovered ? 'hover' : 'initial'}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                    <motion.div
                      className="absolute bottom-[11px] left-[5px] w-5 h-[1.5px] bg-[#30294e] dark:bg-white"
                      variants={bottomBarVariants}
                      animate={isHovered ? 'hover' : 'initial'}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Theme Toggle */}
              {toggleTheme && (
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </motion.button>
              )}

              {/* CTA Button — full text on md+, icon-only on mobile */}
              <motion.button
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-[#6a49ff] text-white rounded-full hover:shadow-lg transition-shadow font-medium hover:bg-[#5839e6] whitespace-nowrap text-sm group"
                whileHover={{
                  rotate: [0, -2, 2, -2, 2, 0],
                  transition: { duration: 0.4, ease: 'easeInOut' },
                }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* CTA icon-only on small screens */}
              <motion.button
                className="sm:hidden inline-flex items-center justify-center w-9 h-9 bg-[#6a49ff] text-white rounded-full hover:bg-[#5839e6] transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Mobile Hamburger */}
              <motion.button
                className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-20 sm:top-24 left-3 right-3 sm:left-6 sm:right-6 z-50 md:hidden bg-white/95 dark:bg-[#1a1227]/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <nav className="flex flex-col p-4">
                {NAV_LINKS.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3.5 text-gray-700 dark:text-gray-200 hover:text-[#6a49ff] dark:hover:text-[#6a49ff] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors font-medium text-base"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <motion.button
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6a49ff] text-white rounded-xl hover:bg-[#5839e6] transition-colors font-medium text-base group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: NAV_LINKS.length * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
