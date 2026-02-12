"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Dribbble, Check, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import Image from 'next/image';

// Helper for social links
const SocialLink = ({
  href,
  icon: Icon
}: {
  href: string;
  icon: any;
}) => <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 transition-colors duration-300 bg-white/5 border border-white/5 rounded-[5px] text-white hover:bg-white/10" onClick={e => e.preventDefault()}>
    <Icon className="w-5 h-5" />
  </a>;

// Helper for navigation links
const FooterLink = ({
  href,
  label,
  active = false
}: {
  href: string;
  label: string;
  active?: boolean;
}) => <a href={href} className={cn("text-[14px] uppercase tracking-wider transition-all duration-300 hover:text-white", active ? "text-white/50" : "text-white")} onClick={e => e.preventDefault()}>
    {label}
  </a>;

// @component: DragoFooter
export const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  // @return
  return <footer className="relative w-full bg-background text-white py-12 px-4 md:px-8 lg:px-12 overflow-hidden font-sans">
      <div className="max-w-[1580px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start mb-12">
          {/* Subscribe Section */}
          <div className="flex flex-col gap-5 max-w-[560px]">
            <div>
                <Image src="/images/logo-white.svg" alt="WebDirect" width={150} height={36} loading="lazy" />
              </div>
            <p className="text-lg leading-relaxed text-white/80">Bij WebDirect ontwerpen we digitale ervaringen die boeien, verbinden en inspireren.</p>
            
            <div className="relative">
              {status === 'success' ? <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="flex items-center justify-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-[5px] text-green-400">
                  <Check className="w-5 h-5" />
                  <span>Thank you for subscribing to our newsletter.</span>
                </motion.div> : <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" style={{
              display: "none"
            }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 bg-white/5 border border-white/10 rounded-[5px] px-[18px] py-[14px] text-base outline-none focus:border-white/30 transition-all placeholder:text-white/30" />
                  <button type="submit" disabled={status === 'loading'} className="bg-white text-black font-semibold text-[16px] px-8 py-3.5 rounded-[5px] uppercase tracking-wide hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {status === 'loading' ? 'Processing...' : 'Submit'}
                  </button>
                </form>}
              {status === 'error' && <p className="mt-3 text-red-400 text-sm">Oops! Something went wrong. Please try again.</p>}
            </div>
          </div>

          {/* Navigation Links Section */}
          <div className="flex flex-col gap-6 lg:items-end">
            <div className="flex flex-wrap gap-x-8 gap-y-4 lg:justify-end">
              <FooterLink href="#" label="Home" active />
              <FooterLink href="#" label="About" />
              <FooterLink href="#" label="Projects" />
              <FooterLink href="#" label="Blog" />
              <FooterLink href="#" label="Contact" />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end">
              <FooterLink href="#" label="Style Guide" />
              <FooterLink href="#" label="Instructions" />
              <FooterLink href="#" label="Licenses" />
              <FooterLink href="#" label="Changelog" />
              <FooterLink href="#" label="Error 404" />
              <FooterLink href="#" label="Password" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5 pt-6">
            <p className="text-white/40 text-[15px]">Ontwikkeld door WebDirect | 2026</p>
            
            <div className="flex gap-3">
              <SocialLink href="#" icon={Facebook} />
              <SocialLink href="#" icon={Instagram} />
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Dribbble} />
            </div>
          </div>

          {/* Large Logo / SVG Section */}
          <div className="relative w-full flex justify-center items-center mt-3">
            <div className="relative w-full max-w-[1520px] flex items-center justify-center">
              {/* WebDirect Logo */}
              <svg viewBox="0 0 1521 330" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[1200px] h-auto select-none" style={{
              display: "none"
            }}>
                <path d="M0 137.5C0 61.5685 61.5685 0 137.5 0H165C241.5 0 303 61.5685 303 137.5V192.5C303 268.432 241.432 330 165.5 330H137.5C61.5685 330 0 268.432 0 192.5V137.5Z" fill="url(#paint0_linear)" />
                <path d="M110 55C110 24.6243 134.624 0 165 0H220C250.376 0 275 24.6243 275 55V275C275 305.376 250.376 330 220 330H165C134.624 330 110 305.376 110 275V55Z" fill="url(#paint1_linear)" />
                <path d="M220 0C250.376 0 275 24.6243 275 55V137.5L220 192.5L110 137.5V55C110 24.6243 134.624 0 165 0H220Z" fill="url(#paint2_linear)" />
                <text x="336" y="240" fontFamily="Arial, sans-serif" fontSize="200" fontWeight="700" fill="#3D3D5C" letterSpacing="-5">WebDirect</text>
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="303" y2="330" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5DD6C4" />
                    <stop offset="1" stopColor="#4AC4B3" />
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="110" y1="0" x2="275" y2="330" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5DD6C4" />
                    <stop offset="1" stopColor="#3DB5A3" />
                  </linearGradient>
                  <linearGradient id="paint2_linear" x1="165" y1="0" x2="220" y2="192.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6EE5D2" />
                    <stop offset="1" stopColor="#5DD6C4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};