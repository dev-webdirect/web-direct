'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface BookingProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const BookingProgressBar = ({
  currentStep,
  totalSteps,
}: BookingProgressBarProps) => {
  const progressPercent = Math.min(((currentStep - 1) / (totalSteps - 1)) * 100, 100);

  return (
    <div className="w-full mb-6">
      <div className="relative flex items-center justify-between">
        {/* Background track */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-white/10 rounded-full" />

        {/* Filled track */}
        <motion.div
          className="absolute top-3 left-0 h-0.5 rounded-full bg-linear-to-r from-[#6a49ff] to-[#41AE96]"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isUpcoming = stepNum > currentStep;

          return (
            <div key={index} className="relative z-10 flex items-center justify-center" style={{ flex: 1 }}>
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-300 border-2',
                  isCompleted && 'bg-[#41AE96] border-[#41AE96] text-white',
                  isCurrent && 'bg-[#6a49ff] border-[#6a49ff] text-white shadow-lg shadow-[#6a49ff]/30',
                  isUpcoming && 'bg-white/5 border-white/20 text-gray-500',
                )}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : stepNum}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
