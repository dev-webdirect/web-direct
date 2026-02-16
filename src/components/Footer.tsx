'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Dribbble, Check, Send, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const SocialLink = ({
  href,
  icon: Icon,
  label
}: {
  href: string;
  icon: any;
  label: string;
}) => <motion.a href={href} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-[#41AE96]/50 hover:bg-[#41AE96]/10 hover:scale-110" onClick={e => e.preventDefault()} whileHover={{
  y: -2
}} whileTap={{
  scale: 0.95
}}>
    <Icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#41AE96]/0 to-[#41AE96]/0 group-hover:from-[#41AE96]/10 group-hover:to-[#6A49FF]/10 transition-all duration-300" />
    <span className="sr-only">{label}</span>
  </motion.a>;

// Helper for navigation links with enhanced styling
const FooterLink = ({
  href,
  label,
  active = false
}: {
  href: string;
  label: string;
  active?: boolean;
}) => <motion.a href={href} className={cn("relative inline-flex items-center min-h-[44px] py-2 pr-2 text-[14px] font-medium uppercase tracking-wider transition-all duration-300 group", active ? "text-white/50" : "text-white/70 hover:text-white")} onClick={e => e.preventDefault()} whileHover={{
  x: 4
}}>
    {label}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#41AE96] to-[#6A49FF] group-hover:w-full transition-all duration-300" />
  </motion.a>;

// Contact info item
const ContactItem = ({
  icon: Icon,
  label,
  value
}: {
  icon: any;
  label: string;
  value: string;
}) => <div className="flex items-start gap-3 group">
    <div className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg bg-white/5 border border-white/10 text-[#41AE96] group-hover:bg-[#41AE96]/10 transition-all duration-300">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-white/60">{label}</span>
      <span className="text-sm text-white/80">{value}</span>
    </div>
  </div>;

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  location?: string;
  phone?: string;
  email?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  successMessage?: string;
}

export const Footer = ({
  brandName = "WebDirect",
  brandDescription = "Bij WebDirect ontwerpen we digitale ervaringen die boeien, verbinden en inspireren. Van moderne websites tot innovatieve applicaties.",
  location = "Amsterdam, Nederland",
  phone = "+31 20 123 4567",
  email = "info@webdirect.nl",
  newsletterPlaceholder = "Jouw e-mailadres",
  newsletterButtonText = "Inschrijven",
  successMessage = "Bedankt voor het inschrijven op onze nieuwsbrief!"
}: FooterProps) => {
  
  const [emailInput, setEmailInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmailInput('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <footer className="relative text-white overflow-hidden">
      {/* Background gradient (matches site sections) */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
      />

      {/* Arc with Curved Gradient Shadow */}
      <div className="absolute top-0 left-0 right-0 h-20 sm:h-24 md:h-28 lg:h-[7.5rem] overflow-hidden pointer-events-none z-50">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="arcShadowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6a49ff" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#a78bfa" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#41AE96" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#6a49ff" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path
            d="M 0 140 Q 600 -20 1200 140"
            fill="none"
            stroke="url(#arcShadowGradient)"
            strokeWidth="50"
            strokeLinecap="round"
          />
          
          {/* Dark arc shape on top */}
          <path
            d="M 0 160 Q 600 0 1200 160 L 1200 160 L 0 160 Z"
            fill="#0f0a1f"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative bg-[#0f0a1f] w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-20 mt-16 sm:mt-20 md:mt-24 lg:mt-[7.5rem] max-w-[1600px]">
          {/* Top section with CTA and links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mt-0">
            {/* Brand & Newsletter Section */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {/* Logo/Brand */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} className="flex flex-col gap-4 sm:gap-6 items-center lg:items-start">
                <div className="flex lg:justify-start gap-3">
                  <div className="relative w-[160px] h-[48px] sm:w-[200px] sm:h-[60px] md:w-[240px] md:h-[72px]">
                    <Image
                      src="/images/logo-white.svg"
                      alt="WebDirect logo"
                      fill
                      sizes="(max-width: 375px) 160px, (max-width: 640px) 200px, 240px"
                      className="object-contain"
                      priority={false}
                    />
                  </div>
                </div>
                <p className="text-base leading-relaxed text-white/70 max-w-md text-center lg:text-left px-2 sm:px-0">
                  {brandDescription}
                </p>
              </motion.div>

              {/* Newsletter */}
              <div className="relative">
                {status === 'success' ? <motion.div initial={{
                opacity: 0,
                scale: 0.95
              }} animate={{
                opacity: 1,
                scale: 1
              }} className="flex items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br from-[#41AE96]/20 to-[#41AE96]/5 border border-[#41AE96]/30 rounded-xl text-[#41AE96]">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#41AE96]/20">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{successMessage}</span>
                  </motion.div> :                   <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                    <div className="relative flex-1 min-w-0">
                      <label htmlFor="webdirect-footer-newsletter-email" className="sr-only">
                        E-mailadres
                      </label>
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                      <input id="webdirect-footer-newsletter-email" name="email" type="email" inputMode="email" autoComplete="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder={newsletterPlaceholder} required className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 text-base outline-none focus:border-[#41AE96]/50 focus:bg-white/10 transition-all placeholder:text-white/50" />
                    </div>
                    <motion.button type="submit" disabled={status === 'loading'} className="relative bg-gradient-to-r from-[#41AE96] to-[#41AE96]/90 text-white font-semibold text-sm px-6 sm:px-8 py-3 sm:py-4 rounded-xl uppercase tracking-wide hover:from-[#41AE96]/90 hover:to-[#41AE96] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group shrink-0" whileHover={{
                  scale: 1.02
                }} whileTap={{
                  scale: 0.98
                }}>
                      <span className="relative z-10">
                        {status === 'loading' ? 'Versturen...' : newsletterButtonText}
                      </span>
                      <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6A49FF]/0 via-[#6A49FF]/20 to-[#6A49FF]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </motion.button>
                  </form>}
                {status === 'error' && <motion.p initial={{
                opacity: 0,
                y: -10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="mt-3 text-red-400 text-sm">
                      Oeps! Er ging iets mis. Probeer het opnieuw.
                    </motion.p>}
              </div>

              {/* Contact info */}
              
            </div>

            {/* Navigation Links Section */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 place-items-center sm:place-items-start text-center sm:text-left">
              {/* Column 1 */}
              <div className="flex flex-col gap-3 sm:gap-5 items-center sm:items-start">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-2">
                  Navigatie
                </h4>
                <FooterLink href="#" label="Home" active />
                <FooterLink href="#" label="Over ons" />
                <FooterLink href="#" label="Projecten" />
                <FooterLink href="#" label="Diensten" />
                <FooterLink href="#" label="Contact" />
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-3 sm:gap-5 items-center sm:items-start">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-2">
                  Diensten
                </h4>
                <FooterLink href="#" label="Web Design" />
                <FooterLink href="#" label="Development" />
                <FooterLink href="#" label="Branding" />
                <FooterLink href="#" label="Marketing" />
                <FooterLink href="#" label="Consultancy" />
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-3 sm:gap-5 items-center sm:items-start">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-2">
                  Resources
                </h4>
                <FooterLink href="#" label="Blog" />
                <FooterLink href="#" label="Portfolio" />
                <FooterLink href="#" label="Style Guide" />
                <FooterLink href="#" label="Changelog" />
                <FooterLink href="#" label="Support" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative h-px my-6 sm:my-8 md:my-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <span className="text-xs uppercase tracking-wider text-white/60 mr-2">Volg ons</span>
              <SocialLink href="https://facebook.com" icon={Facebook} label="Facebook" />
              <SocialLink href="https://instagram.com" icon={Instagram} label="Instagram" />
              <SocialLink href="https://twitter.com" icon={Twitter} label="Twitter" />
              <SocialLink href="https://dribbble.com" icon={Dribbble} label="Dribbble" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-white/60 text-sm text-center sm:text-left">
              <span>© 2026 WebDirect</span>
              <span className="hidden sm:inline">•</span>
              <span>Alle rechten voorbehouden</span>
              <span className="hidden sm:inline">•</span>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
                <a href="#" className="hover:text-white/60 transition-colors" onClick={e => e.preventDefault()}>
                  Privacy
                </a>
                <span>•</span>
                <a href="#" className="hover:text-white/60 transition-colors" onClick={e => e.preventDefault()}>
                  Voorwaarden
                </a>
              </div>
            </div>

            {/* Social Links */}
            
          </div>

          
        </div>
    </footer>
  );
}