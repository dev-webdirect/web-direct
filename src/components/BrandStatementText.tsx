'use client';

import React, { useRef, useEffect, useState } from 'react';

// Google Fonts imports for the component
const FONTS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500&display=swap');
`;
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
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1) - starts earlier with offset
      const scrollStart = viewportHeight * 0.1; // Start when section is 30% into view
      const scrollProgress = Math.max(0, Math.min(1, (-rect.top + scrollStart) / (containerHeight - viewportHeight + scrollStart)));
      
      const newStyles = words.map((_, index) => {
        // Each word starts animating at its position in the sequence
        // Increased range for slower animation (was +3, now +6)
        const start = index / totalWords;
        const end = Math.min((index + 8) / totalWords, 1);

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
  return <div ref={containerRef} className="relative w-full md:min-h-[200vh] min-h-[150vh] selection:bg-white/10" style={{
    fontFamily: "'Geist', sans-serif",
    backgroundColor: '#05080c'
  }}>
      <style dangerouslySetInnerHTML={{
      __html: FONTS_CSS
    }} />
      
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden md:px-4 px-2">
        <div className="max-w-[1200px] w-full flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
          {allLines.map((line, lineIndex) => <div key={`line-${lineIndex}`} className="flex flex-wrap justify-center items-center gap-x-2 md:gap-x-4 lg:gap-x-5">
              {line.map((word, wordIndex) => {
            const currentIndex = flatIndex++;
            const style = wordStyles[currentIndex] || {
              opacity: 0,
              blur: 10
            };
            return <h2 key={`${lineIndex}-${wordIndex}`} style={{
              opacity: style.opacity / 100,
              filter: `blur(${style.blur}px)`,
              fontWeight: word.isAlt ? 400 : 500,
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.04em',
              color: word.isAlt ? 'transparent' : '#ffffff',
              background: word.isAlt ? 'linear-gradient(135deg, #41ae96 0%, #2dd4bf 50%, #34d399 100%)' : 'none',
              backgroundClip: word.isAlt ? 'text' : undefined,
              WebkitBackgroundClip: word.isAlt ? 'text' : undefined,
              WebkitTextFillColor: word.isAlt ? 'transparent' : undefined,
              fontFamily: word.isAlt ? "'Georgia', serif" : "'Geist', sans-serif",
              fontStyle: word.isAlt ? 'italic' : 'normal',
              transition: 'opacity 0.15s ease-out, filter 0.15s ease-out',
              paddingTop: '0'
            }} className="inline-block m-0 text-center whitespace-nowrap">
                    {word.text}
                  </h2>;
          })}
            </div>)}
        </div>
      </div>
    </div>;
};