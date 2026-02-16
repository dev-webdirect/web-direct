'use client';

import React, { useRef, useEffect, useState } from 'react';

type WordData = {
  text: string;
  isAlt?: boolean;
};
const wordsLine1: WordData[] = [{
  text: "Wij"
}, {
  text: "creëren"
}, {
  text: "conversion-first",
  isAlt: true
}, {
  text: "oplossingen"
}];
const wordsLine2: WordData[] = [{
  text: "die"
}, {
  text: "merken",
  isAlt: true
}, {
  text: "helpen"
}, {
  text: "opvallen",
  isAlt: true
}, {
  text: "en"
}];
const wordsLine3: WordData[] = [{
  text: "groeien",
  isAlt: true
}, {
  text: "in"
}, {
  text: "het"
}, {
  text: "digitale",
  isAlt: true
}, {
  text: "tijdperk.",
  isAlt: true
}];
const allLines = [wordsLine1, wordsLine2, wordsLine3];

// @component: BrandStatementText
export const BrandStatementText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wordStyles, setWordStyles] = useState<Array<{
    opacity: number;
    blur: number;
  }>>([]);
  useEffect(() => {
    const totalWords = allLines.flat().length;
    const words = Array(totalWords).fill(null).map(() => ({
      opacity: 0,
      blur: 10
    }));
    setWordStyles(words);
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1)
      // Animation starts when section is 80% into viewport
      // Animation completes when section reaches 20% from top
      const scrollStart = viewportHeight * 0.8;
      const scrollEnd = viewportHeight * 0.2;
      const scrollProgress = Math.max(0, Math.min(1, (viewportHeight - rect.top - scrollEnd) / (scrollStart - scrollEnd)));
      
      const newStyles = words.map((_, index) => {
        // Each word starts animating at its position in the sequence
        // Reduced range for faster sequential animation
        const start = index / totalWords;
        const end = Math.min((index + 4) / totalWords, 1);

        // Calculate the progress for this specific word
        const wordProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));

        // Map progress to opacity (0 to 100) and blur (10px to 0px)
        const opacity = wordProgress * 100;
        const blur = (1 - wordProgress) * 10;
        return {
          opacity,
          blur
        };
      });
      setWordStyles(newStyles);
    };
    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  let flatIndex = 0;
  return (
    <div
      ref={containerRef}
      className="relative w-full h-auto selection:bg-[#6a49ff]/20"
    >
      {/* Background */}

      {/* Ambient glow */}
      

      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-3 sm:px-4 md:px-6">
        <div className="max-w-[1200px] w-full flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {allLines.map((line, lineIndex) => (
            <div
              key={`line-${lineIndex}`}
              className="flex flex-wrap justify-center items-center gap-x-1.5 sm:gap-x-2 md:gap-x-4 lg:gap-x-5"
            >
              {line.map((word, wordIndex) => {
                const currentIndex = flatIndex++;
                const style = wordStyles[currentIndex] || { opacity: 0, blur: 10 };

                return (
                  <span
                    key={`${lineIndex}-${wordIndex}`}
                    style={{
                      opacity: style.opacity / 100,
                      filter: `blur(${style.blur}px)`,
                    }}
                  
                    className={[
                      'inline-block m-0 whitespace-nowrap',
                      'text-[clamp(2.5rem,10vw,4rem)] leading-[1.1] tracking-[-0.04em]',
                      'transition-[opacity,filter] duration-150 ease-out',
                      word.isAlt
                      ? 'font-serif italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] scale-[1.05]'
                      : 'font-medium text-white'


                    ].join(' ')}
                  >
                    {word.text}
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