'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type WordData = {
  text: string;
  isAlt?: boolean;
};

// @component: BrandStatementText
export const BrandStatementText = () => {
  const t = useTranslations('home.brandStatement');
  const allLines = t.raw('lines') as WordData[][];
  const containerRef = useRef<HTMLDivElement>(null);
  const [wordStyles, setWordStyles] = useState<Array<{
    opacity: number;
    blur: number;
  }>>([]);

  useEffect(() => {
    const flatWords = allLines.flat();
    const totalWords = flatWords.length;
    const words = Array(totalWords).fill(null).map(() => ({
      opacity: 0,
      blur: 10
    }));
    setWordStyles(words);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const scrollStart = viewportHeight * 0.8;
      const scrollEnd = viewportHeight * 0.2;
      const scrollProgress = Math.max(0, Math.min(1, (viewportHeight - rect.top - scrollEnd) / (scrollStart - scrollEnd)));

      const newStyles = words.map((_, index) => {
        const start = index / totalWords;
        const end = Math.min((index + 4) / totalWords, 1);
        const wordProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
        const opacity = wordProgress * 100;
        const blur = (1 - wordProgress) * 10;
        return { opacity, blur };
      });
      setWordStyles(newStyles);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allLines]);

  let flatIndex = 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-auto selection:bg-[#6a49ff]/20"
    >
      <div className="sticky top-0 h-auto py-30 sm:h-screen flex items-center justify-center px-6 sm:px-8 md:px-12">
        <div className="max-w-[1200px] w-full flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 pb-6">
          {allLines.map((line, lineIndex) => (
            <div
              key={`line-${lineIndex}`}
              className="flex flex-wrap justify-center items-center"
            >
              {line.map((word, wordIndex) => {
                const currentIndex = flatIndex++;
                const style = wordStyles[currentIndex] || { opacity: 0, blur: 10 };
                const alpha = style.opacity / 100;

                return (
                  <span
                    key={`${lineIndex}-${wordIndex}`}
                    style={{ margin: '0 0.18em' }}
                    className="inline-block whitespace-nowrap text-[clamp(2.5rem,10vw,4rem)] leading-[1.25] tracking-[-0.04em] transition-[opacity,filter] duration-150 ease-out"
                  >
                    {word.isAlt ? (
                      <span
                        className="font-serif italic font-medium inline-block scale-[1.05]"
                        style={{
                          backgroundImage: `linear-gradient(to right, rgba(106,73,255,${alpha}), rgba(167,139,250,${alpha}))`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          filter: `blur(${style.blur}px)`,
                          paddingInline: '0.15em',
                          marginInline: '-0.15em',
                          paddingBottom: '0.1em',
                        }}
                      >
                        {word.text}
                      </span>
                    ) : (
                      <span
                        className="font-medium text-white"
                        style={{
                          opacity: alpha,
                          filter: `blur(${style.blur}px)`,
                        }}
                      >
                        {word.text}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};