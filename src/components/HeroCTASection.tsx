"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { GradientOverlay } from './GradientOverlay';
import { useRouter } from 'next/navigation';
interface HeroCTASectionProps {
  label?: string;
  title?: string;
  ctaText?: string;
  teamMemberName?: string;
  teamMemberRole?: string;
  teamMemberAvatar?: string;
  bookingTitle?: string;
  bookingSubtitle?: string;
  bookingCtaText?: string;
}

// @component: HeroCTASection
export const HeroCTASection = ({
  label = "Let's Build Something Great",
  title = "Ready to start your next project?",
  ctaText = "Get started",
  teamMemberName = "Team",
  teamMemberRole = "Available for project",
  teamMemberAvatar = "https://framerusercontent.com/images/Wu0ngxjedkJ31EstGJABQBoafk.jpg?width=150&height=150",
  bookingTitle = "Quick 15-minute call",
  bookingSubtitle = "Pick a time that works for you.",
  bookingCtaText = "Book a free call"
}: HeroCTASectionProps) => {
  const router = useRouter();
  const goToBooking = () => router.push('/booking');

  // @return
  return <section className="relative w-full min-h-[408px] flex items-center justify-center bg-card rounded-2xl overflow-hidden p-5 md:p-10 font-sans">
      {/* Background Container */}
      <div className="relative w-full max-w-[960px] min-h-[368px] flex flex-col md:flex-row items-center justify-between gap-12 bg-secondary rounded-lg p-8 md:p-12 overflow-hidden z-10 border border-border">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-lg opacity-5">
          <Image
            src="https://framerusercontent.com/images/4RGuWhw5VjbAJbMonewftyJZ4c.jpg?width=1000&height=400"
            alt=""
            width={1000}
            height={400}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Gradient Overlay */}
        <GradientOverlay />

        {/* Decorative Vectors */}
        <div className="absolute top-[-440px] left-[220px] w-[520px] h-[520px] rounded-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-[-370px] right-[-40px] w-[520px] h-[520px] rounded-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tl from-secondary/40 to-primary/40 rounded-full blur-3xl" />
        </div>

        {/* Decorative Element Image */}
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="absolute top-[184px] right-[30px] w-[88px] h-[40px] z-20 pointer-events-none hidden lg:block">
          <div className="w-full h-full bg-primary/30 rounded-full blur-xl" />
        </motion.div>

        {/* Left Content */}
        <div className="relative flex flex-col items-start gap-8 max-w-[450px] z-10">
          <div className="flex flex-col gap-2.5">
            <span className="text-[12px] font-semibold text-muted-foreground tracking-[1.8px] uppercase">
              {label}
            </span>
            <h2 className="text-[40px] md:text-[52px] font-medium leading-[1.1] md:leading-[1.2] tracking-[-1.6px] text-foreground balance">Klaar om jouw project te starten?</h2>
          </div>
          
          <button
            onClick={goToBooking}
            className="relative px-[22px] py-[10px] h-[40px] flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-base font-medium transition-all hover:bg-primary/90 cursor-pointer hover:scale-[1.02]"
          >
            {ctaText}
          </button>
        </div>

        {/* Right Content - Profile Card */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.4
      }} className="relative w-full md:w-[360px] bg-background/50 rounded-lg p-2 z-10">
          <div className="w-full h-full bg-card rounded-lg p-5 flex flex-col gap-5 border border-border">
            {/* Availability Status */}
            <div className="flex items-center gap-2 px-0.5">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 bg-primary rounded-full opacity-30 animate-ping" />
                <div className="absolute inset-0 bg-primary rounded-full" />
              </div>
              <span className="text-[12px] font-semibold text-muted-foreground tracking-[1.8px] uppercase">Beschikbaar voor 4 nieuwe projecten deze maand. </span>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-2">
              <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden ring-2 ring-border">
                <Image src={teamMemberAvatar} alt="Team Member" fill className="object-cover" sizes="50px" loading="lazy" />
              </div>
              <div className="text-muted-foreground text-[20px] font-medium tracking-[-0.6px]">+</div>
              <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-base font-medium ring-2 ring-border">
                You
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col gap-1">
              <h3 className="text-[18px] font-medium tracking-[-0.48px] text-foreground">Boek hier een 15 min meeting met ons team. </h3>
              <p className="text-[13px] font-medium text-muted-foreground">Kies een tijd dat het beste voor je uitkomt</p>
            </div>

            {/* Action Button */}
            <button
              onClick={goToBooking}
              className="w-full flex items-center justify-center gap-2 px-[18px] py-[8px] h-[32px] bg-secondary text-secondary-foreground rounded-lg text-sm font-medium transition-all hover:bg-secondary/90 hover:scale-[1.02] cursor-pointer"
            >
              Boek je GRATIS meeting!
            </button>

          </div>
        </motion.div>
      </div>
    </section>;
};