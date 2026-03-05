'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, Mail, MessageCircle, Phone, Clock, Zap, Shield, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { TestimonialCarousel } from './TestimonialCarousel';
import { useTranslations } from 'next-intl';

const FluidBackground = dynamic(
  () => import('./FluidBackground').then((m) => m.FluidBackground),
  { ssr: false }
);

// FAQ Category Type
interface FaqItem {
  question: string;
  answer: string;
}
interface FaqCategory {
  title: string;
  icon: React.ElementType;
  items: FaqItem[];
}

// FAQ Accordion Item Component
const FaqAccordionItem = ({
  question,
  answer,
  isOpen,
  onToggle,
  delay,
  categoryTitle
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
  categoryTitle: string;
}) => {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }} className="border border-gray-800 rounded-2xl overflow-hidden bg-[#1a1227] hover:shadow-2xl transition-all duration-300">
      <button onClick={onToggle} className="w-full p-4 sm:p-5 md:p-6 lg:p-8 text-left flex justify-between items-start lg:items-center hover:bg-white/[0.02] transition-colors gap-3 sm:gap-4">
        <div className="flex-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6a49ff] mb-2 block">
            {categoryTitle}
          </span>
          <h3 className="font-bold text-lg lg:text-xl text-white leading-tight">
            {question}
          </h3>
        </div>
        <div className={cn("mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all", isOpen ? "bg-[#6a49ff] text-white rotate-180" : "bg-gray-800 text-gray-500")}>
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && <motion.div initial={{
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
            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 text-gray-400 leading-relaxed text-base border-t border-white/[0.05] pt-4 sm:pt-6">
              {answer}
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
};

// Category Tab Component
const CategoryTab = ({
  title,
  icon: Icon,
  isActive,
  onClick,
  delay
}: {
  title: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
  delay: number;
}) => {
  return <motion.button initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }} onClick={onClick} className={cn("relative flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap w-auto", isActive ? "bg-[#6a49ff] text-white shadow-lg shadow-[#6a49ff]/20" : "bg-[#1a1227] text-gray-400 hover:bg-[#251b36] hover:text-white border border-gray-800")}>
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </motion.button>;
};

// Support Card Component
const SupportCard = ({
  icon: Icon,
  title,
  description,
  
  delay
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  
  delay: number;
}) => {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }} className="relative group w-full h-full">
      <div className="relative w-auto h-full min-h-[200px] sm:min-h-[220px] p-5 sm:p-6 md:p-8 rounded-2xl bg-[#1a1227] border border-gray-800 hover:border-[#41AE96] transition-all duration-300 hover:shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-[#251b36] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-[#41AE96]" />
        </div>
        
        <h4 className="font-bold text-lg mb-2 text-white">{title}</h4>
        <p className="text-sm text-gray-400 mb-4">{description}</p>

        
      </div>
    </motion.div>;
};

// @component: BookingFaqSection
export const BookingFaqSection = () => {
  const router = useRouter();
  const goToBooking = () => router.push('/booking');
  const t = useTranslations('booking.faq');

  const [activeCategory, setActiveCategory] = useState(0);
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const categoriesContent = t.raw('categories') as Array<{
    title: string;
    items: FaqItem[];
  }>;

  const faqCategories: FaqCategory[] = categoriesContent.map((category, index) => {
    const icons = [MessageCircle, Clock, Zap, MessageCircle, Shield, Phone] as React.ElementType[];
    return {
      title: category.title,
      icon: icons[index] ?? MessageCircle,
      items: category.items,
    };
  });
  const toggleItem = (index: number) => {
    setOpenItems(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };
  const currentCategory = faqCategories[activeCategory];
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-12 md:pb-20 px-3 sm:px-4 md:px-6 lg:px-12">
      {/* No background – uses page.tsx gradient; tight top padding for smooth flow from TestimonialCarousel */}
      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
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
              <HelpCircle className="w-3 h-3 mr-2" />
              {t('badgeLabel')}
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
        }} className="font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
            {t('heading.beforeHighlight')}{' '}
            <span className="relative inline-block italic font-large text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif">
              {t('heading.highlight')}
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
        }} className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t('description')}
          </motion.p>
        </div>

        {/* Category Tabs - max 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto ">
          {faqCategories.map((category, index) => (
            <CategoryTab
              key={index}
              title={category.title}
              icon={category.icon}
              isActive={activeCategory === index}
              onClick={() => {
                setActiveCategory(index);
                setOpenItems([0]);
              }}
              delay={0.3 + index * 0.1}
            />
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 space-y-3 sm:space-y-4">
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} transition={{
            duration: 0.3
          }} className="space-y-4">
              {currentCategory.items.map((item, index) => <FaqAccordionItem key={index} question={item.question} answer={item.answer} isOpen={openItems.includes(index)} onToggle={() => toggleItem(index)} delay={index * 0.1} categoryTitle={currentCategory.title} />)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Support Section */}
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.5
        }} className="text-center mb-6 sm:mb-8 md:mb-10">
            <h3 className="text-white font-bold text-3xl mb-3">
              {t('support.title')}
            </h3>
            <p className="text-gray-400 text-lg">
              {t('support.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            {[
              { icon: Mail, delay: 0.6 },
              { icon: MessageCircle, delay: 0.7 },
              { icon: Phone, delay: 0.8 },
            ].map((card, index) => {
              const cards = t.raw('support.cards') as Array<{ title: string; description: string }>;
              const content = cards[index];
              return (
                <SupportCard
                  key={index}
                  icon={card.icon}
                  title={content?.title ?? ''}
                  description={content?.description ?? ''}
                  delay={card.delay}
                />
              );
            })}
          </div>

          {/* CTA Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.9
        }} className="relative rounded-2xl bg-[#40AE96] border border-gray-800 p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl overflow-hidden">
            {/* Decorative gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6a49ff]/10 to-[#41AE96]/10 opacity-50 pointer-events-none" />
            
            {/* Floating orbs */}
            <motion.div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6a49ff]/20 rounded-full blur-3xl pointer-events-none" animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }} />
            <motion.div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#41AE96]/20 rounded-full blur-3xl pointer-events-none" animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2]
          }} transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }} />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-white font-bold text-3xl mb-3">
                {t('cta.title.beforeHighlight')}{' '}
                <span className="relative inline-block italic font-large bg-clip-text  text-[#5839e6] font-serif">
                {t('cta.title.highlight')}
                </span>
                </h3>
                <p className="text-gray-400 text-lg" style={{
                color: "#ffffff"
              }}>
                  {t('cta.description')}
                </p>
              </div>

              <motion.button whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(106, 73, 255, 0.3), 0 10px 10px -5px rgba(106, 73, 255, 0.2)"
            }} whileTap={{
              scale: 0.95
            }} className="flex items-center gap-3 bg-gradient-to-r from-[#6a49ff] to-[#5839e6] text-white px-10 py-5 rounded-full font-semibold text-lg transition-all shadow-xl shadow-[#6a49ff]/20 hover:shadow-[#6a49ff]/40 group whitespace-nowrap">
                <span>{t('cta.button')}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </motion.div>


          {/* Trust Indicators */}
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 1
        }} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-10 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#41AE96]" />

              <span>{t.raw('trust.items')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#41AE96]" />
              <span>{t.raw('trust.items')[1]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#41AE96]" />
              <span>{t.raw('trust.items')[2]}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line - matching BookingHeroSection */}
    </section>
  );
};