'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * GradientOverlay Component
 * 
 * A reusable, performant gradient overlay component designed to add visual depth
 * and focus to backgrounds or media elements. It uses the design system's
 * background colors and transitions for a seamless UI integration.
 */

// @component: GradientOverlay
export const GradientOverlay = () => {
  // Use Framer Motion for a subtle entry animation
  // The gradient mimics the provided design: transparent at the top (0-55%)
  // transitioning to solid black/dark at the bottom (100%)

  // @return
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.8,
    ease: "easeOut"
  }} className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-[1] overflow-hidden min-h-[100vh] sm:min-h-[924px]" style={{
    backgroundImage: 'linear-gradient(rgba(4, 4, 4, 0) 55%, rgb(0, 0, 0) 100%)',
    backgroundPosition: '0% 0%',
    backgroundRepeat: 'repeat',
    backgroundAttachment: 'scroll',
    backgroundOrigin: 'padding-box',
    backgroundClip: 'border-box',
    height: '100%'
  }} aria-hidden="true" />;
};