"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Palette, Code2, Settings2, Rocket, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
interface ProcessStep {
  id: number;
  title: string;
  duration?: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}
const steps: ProcessStep[] = [{
  id: 1,
  title: "Plan een gratis gesprek!",
  duration: '20 min',
  description: 'Kies een moment dat jou uitkomt en vul de korte vragenlijst in. Zo weten we alvast wie je bent en wat je nodig hebt.',
  icon: <MessageSquare className="w-6 h-6" />,
  color: '#6a49ff'
}, {
  id: 2,
  title: "Gratis webdesign concept.",
  description: 'Op basis van de ingevulde vragenlijst bouwen we alvast een eerste webdesign. Geen verplichtingen, je ziet wat mogelijk is voordat je een beslissing maakt.',
  icon: <Palette className="w-6 h-6" />,
  color: '#a78bfa'
}, {
  id: 3,
  title: "De meeting.",
  description: 'We komen samen voor een gesprek van 20 minuten. We presenteren het design, bespreken je wensen en kijken samen wat de beste aanpak is voor jouw website.',
  icon: <Code2 className="w-6 h-6" />,
  color: '#41AE96'
}, {
  id: 4,
  title: "Website ontwikkeling.",
  description: 'Na jouw akkoord gaan we aan de slag. We bouwen je website en houden je via vaste feedbackrondes op de hoogte. Gemiddeld staat je website binnen 5 werkdagen online.',
  icon: <Settings2 className="w-6 h-6" />,
  color: '#8b5cf6'
}, {
  id: 5,
  title: "Lancering van je nieuwe website!",
  description: 'Je website gaat live. We lopen samen door het CMS zodat je direct zelfstandig content kunt beheren. Vanaf dat moment ben je online.',
  icon: <Rocket className="w-6 h-6" />,
  color: '#6366f1'
}];

// @component: ProcessTimeline
export const ProcessTimeline = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // @return
  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-4 sm:space-y-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#41AE96]/10 text-[#41AE96] border border-[#41AE96]/20 backdrop-blur-md">
              <Clock className="w-3 h-3 mr-2" />
              Ons Proces
            </span>
          </motion.div>

          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
            Zo werkt het{' '}
            <span className="relative inline-block italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif">
              proces
            </span>
          </motion.h2>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto px-0 sm:px-2">
            In vijf eenvoudige stappen van een eerste kennismaking naar een resultaatgerichte, moderne website.
          </motion.p>
        </div>

        {/* Process Navigation (Horizontal View for Desktop) */}
        <div className="hidden lg:block mb-8 md:mb-12">
          <div className="flex justify-between items-center relative">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-[#6a49ff] to-[#41AE96]" initial={{
              width: "0%"
            }} animate={{
              width: `${Math.max(0, (activeStep - 1) / (steps.length - 1)) * 100}%`
            }} transition={{
              duration: 0.5,
              ease: "easeInOut"
            }} />
            </div>

            {steps.map(step => <button key={step.id} onClick={() => setActiveStep(step.id)} className="relative z-10 flex flex-col items-center group">
                <motion.div whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.95
            }} className={cn("w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-4 shadow-lg", activeStep >= step.id ? "border-[#1a1227] text-white" : "bg-[#1a1227] border-gray-800 text-gray-500 group-hover:border-gray-700")} style={activeStep >= step.id ? {
              backgroundColor: step.color
            } : {}}>
                  {activeStep > step.id ? <CheckCircle2 className="w-7 h-7" /> : step.icon}
                </motion.div>
                <div className="absolute -bottom-8 whitespace-nowrap">
                  <span className={cn("text-sm font-semibold transition-colors duration-200", activeStep === step.id ? "text-white" : "text-gray-500 group-hover:text-gray-400")}>
                    {step.title}
                  </span>
                </div>
              </button>)}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start mt-10 sm:mt-12 md:mt-16">
          {/* Detailed Content (Desktop Sidebar / Mobile Accordion) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {steps.map(step => <motion.div key={step.id} onMouseEnter={() => setHoveredStep(step.id)} onMouseLeave={() => setHoveredStep(null)} initial={false} animate={{
            opacity: hoveredStep === null || hoveredStep === step.id ? 1 : 0.7,
            scale: hoveredStep === null || hoveredStep === step.id ? 1 : 0.98
          }} className={cn("rounded-2xl transition-all duration-300 border-2 overflow-hidden", activeStep === step.id ? "bg-[#1a1227] border-[#6a49ff] shadow-2xl shadow-[#6a49ff]/20" : "bg-[#1a1227]/50 border-gray-800 hover:bg-[#1a1227] hover:border-gray-700")}>
                <div className="cursor-pointer p-4 sm:p-5 md:p-6" onClick={() => setActiveStep(step.id === activeStep ? 0 : step.id)}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg" style={{
                  backgroundColor: step.color
                }}>
                      {step.id}
                    </div>
                    <div className="flex-grow flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white">{step.title}</h3>
                      {step.duration && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
                          <Clock className="w-3.5 h-3.5" />
                          {step.duration}
                        </span>}
                    </div>
                    <motion.div className="flex-shrink-0 self-center text-gray-600" animate={{
                  rotate: activeStep === step.id ? 90 : 0
                }} transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}>
                      <ChevronRight className={cn("w-6 h-6 transition-colors duration-300", activeStep === step.id && "text-[#6a49ff]")} />
                    </motion.div>
                  </div>
                </div>
                
                <AnimatePresence initial={false}>
                  {activeStep === step.id && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: "auto",
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}>
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                        <div className="pl-0 sm:pl-14">
                          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </motion.div>)}
          </div>

          {/* Visual Showcase (Desktop Only) - use safe index when activeStep is 0 (closed) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-16">
            <div className="bg-[#1a1227] rounded-3xl shadow-2xl overflow-hidden border border-gray-800 aspect-square flex flex-col">
              <div className="h-12 bg-[#251b36] border-b border-gray-800 px-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <div className="flex-grow flex justify-center">
                  <div className="h-6 w-48 bg-[#1a1227] rounded-md border border-gray-800 flex items-center px-2">
                    <div className="w-full h-1 bg-gray-800 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex-grow relative bg-[#0f0a1f] p-8 flex items-center justify-center overflow-hidden">
                {(() => {
                  const safeIndex = activeStep >= 1 && activeStep <= steps.length ? activeStep - 1 : 0;
                  const currentStep = steps[safeIndex];
                  return (
                    <AnimatePresence mode="wait">
                      <motion.div key={activeStep} initial={{
                        opacity: 0,
                        scale: 0.9,
                        rotate: -5
                      }} animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0
                      }} exit={{
                        opacity: 0,
                        scale: 1.1,
                        rotate: 5
                      }} transition={{
                        duration: 0.4
                      }} className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#1a1227] rounded-2xl shadow-lg border border-gray-800">
                        <div className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center text-white shadow-lg" style={{
                          backgroundColor: currentStep.color
                        }}>
                          {React.isValidElement(currentStep.icon) ? React.cloneElement(currentStep.icon as React.ReactElement<{
                            className?: string;
                          }>, {
                            className: "w-10 h-10"
                          }) : currentStep.icon}
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-4">
                          {currentStep.title}
                        </h4>
                        <div className="w-12 h-1 rounded-full mb-6 mx-auto" style={{
                          backgroundColor: currentStep.color
                        }} />
                        <p className="text-gray-400 italic max-w-xs mx-auto">
                          "Onze aanpak is gericht op kwaliteit, transparantie en een website die écht voor je werkt."
                        </p>
                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full opacity-20 blur-xl" style={{
                          backgroundColor: currentStep.color
                        }} />
                        <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full opacity-10 blur-2xl" style={{
                          backgroundColor: currentStep.color
                        }} />
                      </motion.div>
                    </AnimatePresence>
                  );
                })()}
              </div>
              <div className="h-16 bg-[#1a1227] border-t border-gray-800 px-6 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Stap {activeStep || 1} van {steps.length}</span>
                <div className="flex gap-2">
                  {steps.map(s => <div key={s.id} className={cn("h-2 rounded-full transition-all duration-300", activeStep === s.id ? "w-6" : "w-2 bg-gray-700")} style={activeStep === s.id ? {
                  backgroundColor: s.color
                } : {}} />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="relative mt-16 sm:mt-20 rounded-2xl bg-[#41AE96] border border-gray-800 p-6 sm:p-8 lg:p-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-white font-bold text-2xl sm:text-3xl mb-2 sm:mb-3">
                Klaar om te starten?
              </h3>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl">
                We kijken ernaar uit om samen met jou een fantastische digitale ervaring te bouwen. 
                Plan vandaag nog je gratis kennismakingsgesprek in.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-3 sm:gap-4">
              <motion.a
                href="/booking"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(106, 73, 255, 0.3), 0 10px 10px -5px rgba(106, 73, 255, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#6a49ff] to-[#5839e6] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-xl shadow-[#6a49ff]/20 hover:shadow-[#6a49ff]/40 transition-all whitespace-nowrap"
              >
                <span>Plan een afspraak</span>
                <ChevronRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm whitespace-nowrap inline-flex items-center justify-center"
              >
                Onze projecten
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};