'use client';

import { useRef, useEffect, useState } from 'react';

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
}];
const wordsLine2: WordData[] = [{
  text: "oplossingen"
}, {
  text: "die"
}, {
  text: "merken",
  isAlt: true
}, {
  text: "helpen"
}];
const wordsLine3: WordData[] = [{
  text: "opvallen",
  isAlt: true
}, {
  text: "en"
}, {
  text: "groeien",
  isAlt: true
}];
const wordsLine4: WordData[] = [{
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
const allLines = [wordsLine1, wordsLine2, wordsLine3, wordsLine4];

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

      // Calculate scroll progress (0 to 1) - adjusted to start earlier
      const scrollProgress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (containerHeight + viewportHeight * 0.5)));
      const newStyles = words.map((_, index) => {
        // Each word starts animating at its position in the sequence
        const start = index / totalWords;
        const end = Math.min((index + 3) / totalWords, 1);

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
  return <div ref={containerRef} className="relative w-full selection:bg-white/10" style={{
    fontFamily: "'Geist', sans-serif",
    backgroundColor: '#05080c'
  }}>
      <style dangerouslySetInnerHTML={{
      __html: FONTS_CSS
    }} />
      
      <div className="sticky top-0 flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28 lg:py-32 min-h-[50vh] md:min-h-[60vh]">
        <div className="max-w-[1200px] w-full flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          {allLines.map((line, lineIndex) => <div key={`line-${lineIndex}`} className="flex flex-wrap justify-center items-center gap-x-1.5 sm:gap-x-2 md:gap-x-3 lg:gap-x-4">
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
              fontSize: 'clamp(1.5rem, 6vw, 4rem)',
              lineHeight: '1.15',
              letterSpacing: '-0.04em',
              color: word.isAlt ? '#41ae96' : '#ffffff',
              fontFamily: word.isAlt ? "'Georgia', serif" : "'Geist', sans-serif",
              fontStyle: word.isAlt ? 'italic' : 'normal',
              transition: 'opacity 0.1s ease-out, filter 0.1s ease-out'
            }} className="inline-block m-0 text-center whitespace-nowrap">
                    {word.text}
                  </h2>;
          })}
            </div>)}
        </div>
      </div>
    </div>;
};