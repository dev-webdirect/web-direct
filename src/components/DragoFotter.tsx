import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Dribbble, Check, Send, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

// Helper for social links with enhanced styling
const SocialLink = ({
  href,
  icon: Icon,
  label
}: {
  href: string;
  icon: any;
  label: string;
}) => <motion.a href={href} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center w-12 h-12 transition-all duration-300 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-[#41AE96]/50 hover:bg-[#41AE96]/10 hover:scale-110" onClick={e => e.preventDefault()} whileHover={{
  y: -2
}} whileTap={{
  scale: 0.95
}}>
    <Icon className="w-5 h-5 relative z-10" />
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
export interface DragoFooterProps {
  brandName?: string;
  brandDescription?: string;
  location?: string;
  phone?: string;
  email?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  successMessage?: string;
}

// @component: DragoFooter
export const DragoFooter = ({
  brandName = "WebDirect",
  brandDescription = "Bij WebDirect ontwerpen we digitale ervaringen die boeien, verbinden en inspireren. Van moderne websites tot innovatieve applicaties.",
  location = "Amsterdam, Nederland",
  phone = "+31 20 123 4567",
  email = "info@webdirect.nl",
  newsletterPlaceholder = "Jouw e-mailadres",
  newsletterButtonText = "Inschrijven",
  successMessage = "Bedankt voor het inschrijven op onze nieuwsbrief!"
}: DragoFooterProps) => {
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

  // @return
  return <footer className="relative w-full bg-background text-white overflow-hidden font-sans py-12 px-6 md:px-12 lg:px-24">
      {/* Card Container */}
      <div className="relative max-w-[1580px] mx-auto bg-[#2a1f4d] rounded-3xl shadow-2xl overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#41AE96]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6A49FF]/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1f1640]/50" />
        </div>

        {/* Main content */}
        <div className="relative px-6 md:px-12 lg:px-24 pt-24 pb-12">
          {/* Top section with CTA and links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
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
            }} className="flex flex-col gap-6">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  {brandName}
                </h3>
                <p className="text-base leading-relaxed text-white/70 max-w-md">
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
              }} className="flex items-center gap-3 p-5 bg-gradient-to-br from-[#41AE96]/20 to-[#41AE96]/5 border border-[#41AE96]/30 rounded-xl text-[#41AE96] backdrop-blur-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#41AE96]/20">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{successMessage}</span>
                  </motion.div> : <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <label htmlFor="webdirect-drago-footer-newsletter-email" className="sr-only">
                        E-mailadres
                      </label>
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                      <input id="webdirect-drago-footer-newsletter-email" name="email" type="email" inputMode="email" autoComplete="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder={newsletterPlaceholder} required className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-5 py-4 text-base outline-none focus:border-[#41AE96]/50 focus:bg-white/10 transition-all placeholder:text-white/50 backdrop-blur-sm" />
                    </div>
                    <motion.button type="submit" disabled={status === 'loading'} className="relative bg-gradient-to-r from-[#41AE96] to-[#41AE96]/90 text-white font-semibold text-sm px-8 py-4 rounded-xl uppercase tracking-wide hover:from-[#41AE96]/90 hover:to-[#41AE96] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group" whileHover={{
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
              <div className="flex flex-col gap-4 pt-6">
                <ContactItem icon={MapPin} label="Locatie" value={location} />
                <ContactItem icon={Phone} label="Telefoon" value={phone} />
                <ContactItem icon={Mail} label="Email" value={email} />
              </div>
            </div>

            {/* Navigation Links Section */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {/* Column 1 */}
              <div className="flex flex-col gap-5">
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
              <div className="flex flex-col gap-5">
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
              <div className="flex flex-col gap-5">
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
          <div className="relative h-px mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-white/60 text-sm">
              <span>© 2026 WebDirect</span>
              <span className="hidden sm:inline">•</span>
              <span>Alle rechten voorbehouden</span>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-white/60 mr-2">Volg ons</span>
              <SocialLink href="https://facebook.com" icon={Facebook} label="Facebook" />
              <SocialLink href="https://instagram.com" icon={Instagram} label="Instagram" />
              <SocialLink href="https://twitter.com" icon={Twitter} label="Twitter" />
              <SocialLink href="https://dribbble.com" icon={Dribbble} label="Dribbble" />
            </div>
          </div>

          {/* Decorative bottom accent */}
          <div className="mt-10 flex justify-center">
            <div className="h-1 w-32 rounded-full bg-gradient-to-r from-[#41AE96] via-[#6A49FF] to-[#41AE96] opacity-50" />
          </div>
        </div>
      </div>
    </footer>;
};