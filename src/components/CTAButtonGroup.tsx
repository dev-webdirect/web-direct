'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface CTAButtonGroupProps {
  primaryText?: string;
  secondaryText?: string;
  className?: string;
}

// @component: CTAButtonGroup
export const CTAButtonGroup = ({
  primaryText = "Vraag GRATIS webdesign aan.",
  secondaryText = "Bekijk websites.",
  className
}: CTAButtonGroupProps) => {
  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-center gap-6 p-8 w-full", className)}>
      {/* Primary Action Button */}
      <motion.a
        href="#"
        onClick={(e) => e.preventDefault()}
        initial={{
          scale: 1
        }}
        whileHover={{
          rotate: [0, -3, 3, -3, 3, 0],
          scale: 1.05,
          boxShadow: "0 20px 25px -5px rgba(106, 73, 255, 0.2), 0 10px 10px -5px rgba(106, 73, 255, 0.1)",
          transition: {
            rotate: {
              duration: 0.5,
              ease: "easeInOut"
            },
            scale: {
              duration: 0.2
            }
          }
        }}
        whileTap={{
          scale: 0.95
        }}
        className="relative inline-flex items-center gap-3 bg-gradient-to-r from-[#6a49ff] to-[#5839e6] text-white px-10 py-5 rounded-full font-semibold text-lg transition-colors hover:from-[#5839e6] hover:to-[#6a49ff] shadow-xl shadow-[#6a49ff]/10 group"
      >
        <span className="flex-shrink-0">{primaryText}</span>
        <ArrowRight className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      </motion.a>

      {/* Secondary Action Button */}
      <motion.a
        href="#"
        onClick={(e) => e.preventDefault()}
        whileHover={{
          scale: 1.05,
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          borderColor: "#41ae96"
        }}
        whileTap={{
          scale: 0.95
        }}
        className="inline-flex items-center gap-3 text-slate-800 dark:text-white px-10 py-5 rounded-full transition-all font-semibold text-lg border border-slate-200 dark:border-white/30 backdrop-blur-sm group"
      >
        <Globe className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-[#6a49ff] transition-colors" />
        <span className="flex-shrink-0">{secondaryText}</span>
      </motion.a>
    </div>
  );
};