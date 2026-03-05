"use client";
import React from 'react';
import { Palette, Smartphone, Zap, Database, Layout, PenTool, LifeBuoy, Code } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Constants for the WebDirect features as cards
const CARD_STYLE = {
  bgColor: 'rgba(15, 10, 31, 0.98)',
  borderColor: 'rgba(106, 73, 255, 0.45)',
  shadowColor: 'rgba(106, 73, 255, 0.2)',
};

const WEBDIRECT_CARD_META = [
  {
    id: 'conversion-design',
    Icon: Palette,
    ...CARD_STYLE,
  },
  {
    id: 'custom-code',
    Icon: Code,
    ...CARD_STYLE,
  },
  {
    id: 'fast-performance',
    Icon: Zap,
    ...CARD_STYLE,
  },
  {
    id: 'scalable',
    Icon: Database,
    ...CARD_STYLE,
  },
  {
    id: 'seo-ready',
    Icon: Layout,
    ...CARD_STYLE,
  },
  {
    id: 'premium-quality',
    Icon: PenTool,
    ...CARD_STYLE,
  },
  {
    id: 'mobile-first',
    Icon: Smartphone,
    ...CARD_STYLE,
  },
  {
    id: 'support',
    Icon: LifeBuoy,
    ...CARD_STYLE,
  },
] as const;

// @component: WebDirectCards
export const WhyChooseTemplates = () => {
  const t = useTranslations('home.whyChoose');

  const cards = WEBDIRECT_CARD_META.map((card) => ({
    ...card,
    title: t(`cards.${card.id}.title`),
    description: t(`cards.${card.id}.description`),
  }));

  // @return
  return <section className="w-full py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-8 lg:px-12 font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
          <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
            {t('heading.beforeHighlight')}{' '}
            <span className="relative inline-block italic font-large text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif">
              {t('heading.highlight')}
            </span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
          {cards.map((item) => {
          const IconComponent = item.Icon;
          return <div key={item.id} style={{
            backgroundColor: item.bgColor,
            borderColor: item.borderColor
          }} className="group flex flex-col justify-between rounded-2xl border overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="p-5 sm:p-6 md:p-8 z-10">
                  {/* Icon */}
                  <div className="w-[50px] h-[50px] rounded-lg mb-6 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110" style={{
                boxShadow: `0 8px 16px 0 ${item.shadowColor}`
              }}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-medium mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>;
        })}
        </div>
      </div>
    </section>;
};