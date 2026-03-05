'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Zap, Award } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FluidBackground = dynamic(
  () => import('./FluidBackground').then((m) => m.FluidBackground),
  { ssr: false }
);

// Trust Badge Component
const TrustBadge = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm text-gray-300">
    <Icon className="w-4 h-4 text-[#41AE96]" />
    <span>{text}</span>
  </div>
);

interface BookingLayoutProps {
  children: React.ReactNode;
  mode?: 'full' | 'intake';
}

export const BookingLayout = ({ children, mode = 'full' }: BookingLayoutProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [mouseEventTarget, setMouseEventTarget] = useState<HTMLElement | null>(null);
  const t = useTranslations('booking.layout');

  const benefits = [
    { icon: TrendingUp, text: t('benefits.freeDesign') },
    { icon: Zap, text: t('benefits.noObligation') },
    { icon: Award, text: t('benefits.successStories') },
  ];

  return (
    <section
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLElement | null>).current = el;
        setMouseEventTarget(el);
      }}
      className="relative min-h-screen w-full flex flex-col items-center justify-start bg-[#0f0a1f] pt-6 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-24 px-4 sm:px-6 lg:px-10 xl:px-12"
    >
      {/* Dynamic Glow Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#0f0a1f]" />
        <FluidBackground colorHex="#41ae96" glowSize={0.15} mouseEventTarget={mouseEventTarget} />
        <motion.div
          className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle, #41ae96 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(15, 10, 31, 0) 60%, rgba(15, 10, 31, 1) 100%)',
          }}
        />
      </div>

      {/* Content Container - centered, max width for readability */}
      <div className="relative z-10 w-full max-w-6xl xl:max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column - 1/3 width: Copy & Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5 sm:space-y-6 lg:col-span-1 lg:sticky lg:top-10"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#41AE96]/10 text-[#41AE96] border border-[#41AE96]/20 backdrop-blur-md">
              <span className="mr-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#41AE96] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#41AE96]" />
              </span>
              {mode === 'intake' ? t('badge.intake') : t('badge.full')}
            </span>

            <div className="space-y-4 sm:space-y-5">
              {mode === 'intake' ? (
                <>
                  <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.1] tracking-tight">
                    {t('title.intake.beforeHighlight')}{' '}
                    <span className="relative inline-block italic font-medium text-transparent bg-clip-text bg-linear-to-r from-[#6a49ff] to-[#a78bfa] font-serif">
                      {t('title.intake.highlight')}
                    </span>
                  </h1>
                  <p className="text-base text-gray-400 leading-relaxed max-w-xl">
                    {t('description.intake')}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.1] tracking-tight">
                    {t('title.full.beforeHighlight')}{' '}
                    <span className="relative inline-block italic font-medium text-transparent bg-clip-text bg-linear-to-r from-[#6a49ff] to-[#a78bfa] font-serif">
                      {t('title.full.highlight')}
                    </span>{' '}
                    {t('title.full.afterHighlight')}
                  </h1>
                  <p className="text-base text-gray-400 leading-relaxed max-w-xl">
                    {t('description.full')}
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-4 sm:pt-5">
              {benefits.map((benefit) => (
                <TrustBadge key={benefit.text} icon={benefit.icon} text={benefit.text} />
              ))}
            </div>
          </motion.div>

          {/* Right Column - 2/3 width: Step Content */}
          <div className="relative lg:col-span-2">{children}</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};
