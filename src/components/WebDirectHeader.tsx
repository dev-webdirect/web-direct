'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, Languages } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

interface WebDirectHeaderProps {}

interface NavLink {
  name: string;
  href: string;
}
const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

// @component: WebDirectHeader
export const WebDirectHeader = (_props: WebDirectHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('home.header');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const availableLocales: Array<'nl' | 'en'> = ['nl', 'en'];
  const defaultLocale: 'nl' | 'en' = 'nl';
  const NAV_LINKS: NavLink[] = [
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.process'), href: '#process' },
    //{ name: 'Projecten', href: '#projects' },
    { name: t('nav.faq'), href: '#faq' },
  ];

  const switchLocale = (nextLocale: 'nl' | 'en') => {
    if (nextLocale === locale) return;

    let path = pathname || '/nl';
    // Strip existing locale prefix (for any supported locale)
    availableLocales.forEach((loc) => {
      const prefix = `/${loc}`;
      if (path === prefix) {
        path = '/nl';
      } else if (path.startsWith(`${prefix}/`)) {
        path = path.slice(prefix.length);
      }
    });

    const targetPath =
      nextLocale === defaultLocale ? path : `/${nextLocale}${path}`;

    router.push(targetPath);
  };


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
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoSrc = '/images/logo-white.svg';

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

      <div className="sticky top-2 sm:top-4 md:top-6 z-50 w-full px-2 sm:px-3 md:px-6">
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
              className="flex items-center justify-between w-full backdrop-blur-sm shadow-lg overflow-hidden bg-[#1a1227]/95 border border-gray-800"
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
                className="flex items-center gap-2 sm:gap-3 shrink-0"
                animate={{
                  gap: isScrolled ? 8 : 12,
                }}
                transition={smoothTransition}
              >
                <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src={logoSrc}
                    alt="WebDirect"
                    width={130}
                    height={10}
                    loading="eager"
                    priority
                  />
                </Link>
                
              </motion.div>

              {/* Navigation Links (Desktop, always visible; compact when scrolled) */}
              <div
                className={
                  'hidden md:flex items-center justify-center flex-1 transition-all duration-200 ' +
                  (isScrolled ? 'gap-4 text-xs' : 'gap-6 lg:gap-10 text-sm')
                }
              >
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="transition-all font-medium text-white/80 hover:text-[#a78bfa] whitespace-nowrap"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Language switcher (desktop, only when not scrolled) */}
                {!isScrolled && (
                  <div className="hidden sm:flex items-center gap-1 px-1 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/70">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-white/60">
                      <Languages className="w-3 h-3" />
                    </span>
                    {availableLocales.map((loc) => {
                      const isActive = loc === locale;
                      return (
                        <motion.button
                          key={loc}
                          type="button"
                          onClick={() => switchLocale(loc)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={
                            'px-2.5 py-1 rounded-full transition-all duration-200 ' +
                            (isActive
                              ? 'bg-linear-to-r from-[#6a49ff] to-[#a78bfa] text-white shadow-[0_0_12px_rgba(106,73,255,0.4)]'
                              : 'text-white/60 hover:text-white hover:bg-white/10')
                          }
                          aria-pressed={isActive}
                        >
                          {loc.toUpperCase()}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* CTA Button — hidden on mobile when not scrolled, always visible when scrolled */}
                <motion.button
                  className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#6a49ff] text-white rounded-full hover:shadow-lg transition-shadow font-medium hover:bg-[#5839e6] whitespace-nowrap text-sm group"
                  animate={{
                    rotate: isButtonHovered ? [0, -2, 2, -2, 2, 0] : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: 'easeInOut',
                  }}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                  onClick={() => router.push('/afspraak')}
                >
                  <span className="hidden sm:inline">{t('cta.primary')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                {/* Hamburger — open/close mobile list */}
                <motion.button
                  className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors text-white hover:bg-white/10"
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
                  <div className="w-full rounded-xl backdrop-blur-sm shadow-lg overflow-hidden bg-[#1a1227]/95 border border-gray-800">
                    <nav className="flex flex-col p-3">
                      {NAV_LINKS.map((link) => (
                        <a
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center px-4 py-3 rounded-lg transition-colors font-medium text-sm text-white/90 hover:text-[#a78bfa] hover:bg-white/5"
                        >
                          {link.name}
                        </a>
                      ))}
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <motion.button
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6a49ff] text-white rounded-lg hover:bg-[#5839e6] transition-colors font-medium text-sm group"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push('/afspraak');
                          }}
                        >
                          {t('cta.mobileGetStarted')}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                      {/* Language switcher (mobile) */}
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between px-2">
                        <span className="text-[11px] uppercase tracking-wide text-white/50">
                          Language
                        </span>
                        <div className="flex items-center gap-1 px-1 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/70">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-white/60">
                            <Languages className="w-3 h-3" />
                          </span>
                          {availableLocales.map((loc) => {
                            const isActive = loc === locale;
                            return (
                              <motion.button
                                key={loc}
                                type="button"
                                onClick={() => {
                                  switchLocale(loc);
                                  setIsMobileMenuOpen(false);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={
                                  'px-2.5 py-1 rounded-full transition-all duration-200 ' +
                                  (isActive
                                    ? 'bg-linear-to-r from-[#6a49ff] to-[#a78bfa] text-white shadow-[0_0_12px_rgba(106,73,255,0.4)]'
                                    : 'text-white/60 hover:text-white hover:bg-white/10')
                                }
                                aria-pressed={isActive}
                              >
                                {loc.toUpperCase()}
                              </motion.button>
                            );
                          })}
                        </div>
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