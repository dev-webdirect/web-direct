'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sun, Moon, Menu, X } from 'lucide-react';
import Image from 'next/image';

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
  theme = 'light',
  toggleTheme,
}: WebDirectHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (for theme)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Burger menu variants for the interactive scrolled state
  const topBarVariants = {
    initial: { y: 0, rotate: 0 },
    hover: { y: 2, rotate: 0 },
  };
  const bottomBarVariants = {
    initial: { y: 0, rotate: 0 },
    hover: { y: -2, rotate: 0 },
  };
  const isLightTheme = theme === 'light';
  const logoSrc = isLightTheme ? '/images/logo.svg' : '/images/logo-white.svg';

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  // @return
  return (
    <>
      {/* Backdrop blur overlay for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="sticky top-4 sm:top-6 z-50 w-full px-3 sm:px-6">
        <motion.nav
          className="flex justify-center mx-auto"
          initial={false}
          animate={{
            maxWidth: isScrolled ? '625px' : '1280px',
          }}
          transition={smoothTransition}
        >
          <div className="relative w-full">
            <motion.div
              className={`flex items-center justify-between w-full backdrop-blur-sm shadow-lg overflow-hidden ${
                isLightTheme
                  ? 'bg-white/95 border border-gray-200'
                  : 'bg-[#1a1227]/95 border border-gray-800'
              }`}
              initial={false}
              animate={{
                height: isScrolled ? 56 : 72,
                borderRadius: isScrolled ? 28 : 20,
                paddingLeft: isScrolled ? 16 : 24,
                paddingRight: isScrolled ? 16 : 24,
              }}
              transition={smoothTransition}
            >
              {/* Logo Section */}
              <motion.div
                className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
                animate={{
                  gap: isScrolled ? 8 : 12,
                }}
                transition={smoothTransition}
              >
                <div>
                  <Image
                    src={logoSrc}
                    alt="WebDirect"
                    width={130}
                    height={10}
                    loading="eager"
                    priority
                  />
                </div>
                
              </motion.div>

              {/* Navigation Links (Desktop only, hidden when scrolled) */}
              <AnimatePresence mode="wait">
                {!isScrolled && (
                  <motion.div
                    className="hidden md:flex items-center gap-6 lg:gap-10 absolute left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {NAV_LINKS.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className={`transition-all font-medium text-sm ${
                          isLightTheme
                            ? 'text-gray-600 hover:text-[#6a49ff]'
                            : 'text-white/80 hover:text-[#a78bfa]'
                        }`}
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
                        className={`absolute top-[11px] left-[5px] w-5 h-[1.5px] ${
                          isLightTheme ? 'bg-[#30294e]' : 'bg-white'
                        }`}
                        variants={topBarVariants}
                        animate={isHovered ? 'hover' : 'initial'}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                      <motion.div
                        className={`absolute bottom-[11px] left-[5px] w-5 h-[1.5px] ${
                          isLightTheme ? 'bg-[#30294e]' : 'bg-white'
                        }`}
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
                    className={`p-2 rounded-full transition-colors ${
                      isLightTheme
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </motion.button>
                )}

                {/* CTA Button — hidden on mobile when not scrolled, always visible when scrolled */}
                <motion.button
                  className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#6a49ff] text-white rounded-full hover:shadow-lg transition-shadow font-medium hover:bg-[#5839e6] whitespace-nowrap text-sm group"
                  whileHover={{
                    rotate: [0, -2, 2, -2, 2, 0],
                    transition: { duration: 0.4, ease: 'easeInOut' },
                  }}
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                {/* Hamburger — open/close mobile list */}
                <motion.button
                  className={`md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                    isLightTheme
                      ? 'text-gray-600 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Mobile Navigation List — positioned directly below navbar */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0 z-50"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`w-full rounded-xl backdrop-blur-sm shadow-lg overflow-hidden ${
                      isLightTheme
                        ? 'bg-white/95 border border-gray-200'
                        : 'bg-[#1a1227]/95 border border-gray-800'
                    }`}
                  >
                    <nav className="flex flex-col p-3">
                      {NAV_LINKS.map((link) => (
                        <a
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                            isLightTheme
                              ? 'text-gray-700 hover:text-[#6a49ff] hover:bg-gray-50'
                              : 'text-white/90 hover:text-[#a78bfa] hover:bg-white/5'
                          }`}
                        >
                          {link.name}
                        </a>
                      ))}
                      <div
                        className={`mt-2 pt-2 border-t ${
                          isLightTheme ? 'border-gray-200' : 'border-white/10'
                        }`}
                      >
                        <motion.button
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6a49ff] text-white rounded-lg hover:bg-[#5839e6] transition-colors font-medium text-sm group"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Get Started
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      </div>
    </>
  );
};