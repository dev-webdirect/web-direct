'use client'; 

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils'; // Adjust to your path
import { Code2, Menu, X } from 'lucide-react';

interface FloatingNavbarProps {
  className?: string;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

/**
 * FloatingNavbar: a sleek, responsive navigation bar for Next.js
 */
export const FloatingNavbar = ({ className }: FloatingNavbarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  const topBarVariants = {
    initial: { y: 0, rotate: 0 },
    hover: { y: 2, rotate: 0 }
  };
  const bottomBarVariants = {
    initial: { y: 0, rotate: 0 },
    hover: { y: -2, rotate: 0 }
  };
  const smoothTransition = { type: 'spring' as const, stiffness: 200, damping: 25, mass: 0.8 };

  return (
    <motion.nav
      className={cn(
        'fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:top-6 sm:w-[calc(100%-3rem)]',
        className
      )}
      initial={false}
      animate={{ maxWidth: isScrolled ? '500px' : '1280px' }}
      transition={smoothTransition}
      style={{ width: '100%' }}
    >
      <div className="relative w-full">
        <motion.div
          className="flex items-center justify-between w-full bg-white/95 dark:bg-[#1a1227]/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg overflow-visible"
          initial={false}
          animate={{
            height: isScrolled ? 56 : 72,
            borderRadius: isScrolled ? 28 : 20,
            paddingLeft: 16,
            paddingRight: 120
          }}
          transition={smoothTransition}
        >
          {/* Logo - gap uses numeric values only so Framer can animate it; links to home */}
          <motion.a
            href="#hero"
            className="flex items-center flex-shrink-0 no-underline cursor-pointer"
            initial={{ gap: 10 }}
            animate={{ gap: isScrolled ? 6 : 10 }}
            transition={smoothTransition}
          >
            <motion.div
              className="bg-gradient-to-br from-[#6a49ff] to-[#5839e6] rounded-lg flex items-center justify-center flex-shrink-0"
              animate={{ width: isScrolled ? 32 : 36, height: isScrolled ? 32 : 36 }}
              transition={smoothTransition}
            >
              <Code2 className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
            <motion.span
              className="font-bold text-[#30294e] dark:text-white whitespace-nowrap text-sm sm:text-base"
              animate={{ fontSize: isScrolled ? '14px' : '18px' }}
              transition={smoothTransition}
            >
              WebDirect
            </motion.span>
          </motion.a>

          {/* Desktop nav links */}
          <AnimatePresence mode="wait">
            {!isScrolled && (
              <motion.div
                className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {navLinks.map((link) => (
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

          {/* Interactive menu trigger */}
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

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#30294e] dark:text-white" />
            ) : (
              <Menu className="w-5 h-5 text-[#30294e] dark:text-white" />
            )}
          </button>
        </motion.div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 mt-2 py-3 px-4 bg-white/95 dark:bg-[#1a1227]/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block py-2.5 text-gray-600 dark:text-gray-300 hover:text-[#6a49ff] font-medium text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-300 ease-out">
          <motion.a
            href="#cta"
            className="inline-block px-4 py-2 sm:px-6 sm:py-2.5 bg-[#6a49ff] text-white rounded-full hover:shadow-lg transition-shadow font-medium hover:bg-[#5839e6] whitespace-nowrap text-xs sm:text-sm"
            whileHover={{
              rotate: [0, -5, 5, -5, 5, 0],
              transition: { duration: 0.5, ease: 'easeInOut' }
            }}
          >
            Get Started
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
};
