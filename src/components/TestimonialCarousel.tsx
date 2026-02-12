'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

/**
 * Interface for Testimonial data
 */
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}
const TESTIMONIALS: Testimonial[] = [{
  id: '1',
  quote: "Samenwerken met dit team was moeiteloos. Ze begrepen onze merkvisie en veranderden het in een digitale ervaring die echt weergeeft wie we zijn.",
  author: "Emma de Vries",
  role: "Marketing Directeur",
  avatar: "https://framerusercontent.com/images/Wu0ngxjedkJ31EstGJABQBoafk.jpg",
  rating: 5
}, {
  id: '2',
  quote: "Ze vertaalden onze ideeën naar een strakke, moderne digitale aanwezigheid die precies goed aanvoelt voor ons merk.",
  author: "Liam Jansen",
  role: "Directeur",
  avatar: "https://framerusercontent.com/images/bphS41hVtvFCNiuHkZkxk8imJk.jpg",
  rating: 5
}, {
  id: '3',
  quote: "Het team begreep onmiddellijk wat we nodig hadden en leverde een naadloze ervaring die alle verwachtingen overtrof.",
  author: "Sophie van der Berg",
  role: "Data Science Consultant",
  avatar: "https://framerusercontent.com/images/CYC5VQ0ZcK8uEE5jBbm51FTJq0.jpg",
  rating: 5
}, {
  id: '4',
  quote: "Hun proces verliep soepel, collaboratief en ongelooflijk intuïtief — het eindresultaat weerspiegelt onze identiteit perfect.",
  author: "Daan Bakker",
  role: "Oprichter",
  avatar: "https://framerusercontent.com/images/prGsWNLXwFL3SoKDU2EYWYhZ2k.jpg",
  rating: 5
}, {
  id: '5',
  quote: "Van concept tot uitvoering, ze begrepen onze doelen en creëerden een digitale ervaring die uniek van ons is.",
  author: "Fleur Vermeulen",
  role: "Manager",
  avatar: "https://framerusercontent.com/images/P0sSNnMlhW7adaGkZFmKHL828bY.jpg",
  rating: 5
}, {
  id: '6',
  quote: "Ze maakten alles eenvoudig en efficiënt, en veranderden onze merkvisie in een gepolijst product dat onze online aanwezigheid verheft.",
  author: "Lucas Visser",
  role: "CEO",
  avatar: "https://framerusercontent.com/images/5O8P63EQwkFO1m5OTR4jsw7hI8.jpg",
  rating: 5
}, {
  id: '7',
  quote: "De samenwerking was geweldig. Ze luisterden naar onze wensen en creëerden precies wat we voor ogen hadden, en meer nog.",
  author: "Anna Mulder",
  role: "Brand Strateeg",
  avatar: "https://framerusercontent.com/images/Wu0ngxjedkJ31EstGJABQBoafk.jpg",
  rating: 5
}, {
  id: '8',
  quote: "Hun aandacht voor detail en begrip van ons merk resulteerde in een digitaal platform dat we met trots presenteren.",
  author: "Sem de Jong",
  role: "Creative Director",
  avatar: "https://framerusercontent.com/images/bphS41hVtvFCNiuHkZkxk8imJk.jpg",
  rating: 5
}, {
  id: '9',
  quote: "Professioneel, creatief en betrouwbaar. Ze overtroffen onze verwachtingen en leverde op tijd en binnen budget.",
  author: "Julia Hendriks",
  role: "Projectmanager",
  avatar: "https://framerusercontent.com/images/CYC5VQ0ZcK8uEE5jBbm51FTJq0.jpg",
  rating: 5
}, {
  id: '10',
  quote: "Het was een plezier om met dit team te werken. Ze zijn niet alleen vakkundig, maar ook echt gepassioneerd over wat ze doen.",
  author: "Tim Peters",
  role: "Product Owner",
  avatar: "https://framerusercontent.com/images/prGsWNLXwFL3SoKDU2EYWYhZ2k.jpg",
  rating: 5
}, {
  id: '11',
  quote: "Ze gaven ons merk een fris en modern uiterlijk zonder de kern van wie we zijn te verliezen. Fantastisch werk!",
  author: "Mila Koster",
  role: "Brand Manager",
  avatar: "https://framerusercontent.com/images/P0sSNnMlhW7adaGkZFmKHL828bY.jpg",
  rating: 5
}, {
  id: '12',
  quote: "Hun creatieve aanpak en technische expertise zorgden voor een eindproduct dat zowel mooi als functioneel is.",
  author: "Bram Smit",
  role: "CTO",
  avatar: "https://framerusercontent.com/images/5O8P63EQwkFO1m5OTR4jsw7hI8.jpg",
  rating: 5
}, {
  id: '13',
  quote: "Een uitstekende ervaring van begin tot eind. Hun professionaliteit en creativiteit maakten het verschil.",
  author: "Lisa de Groot",
  role: "Eigenaar",
  avatar: "https://framerusercontent.com/images/Wu0ngxjedkJ31EstGJABQBoafk.jpg",
  rating: 5
}, {
  id: '14',
  quote: "Ze wisten precies hoe ze onze visie tot leven moesten brengen. Het resultaat is boven verwachting.",
  author: "Jasper Vliet",
  role: "Hoofd Marketing",
  avatar: "https://framerusercontent.com/images/bphS41hVtvFCNiuHkZkxk8imJk.jpg",
  rating: 5
}, {
  id: '15',
  quote: "Geen enkele vraag was te veel. Ze werkten nauw met ons samen om precies te leveren wat we zochten.",
  author: "Nina Bosch",
  role: "Zaakvoerder",
  avatar: "https://framerusercontent.com/images/CYC5VQ0ZcK8uEE5jBbm51FTJq0.jpg",
  rating: 5
}, {
  id: '16',
  quote: "Het eindproduct is niet alleen visueel aantrekkelijk, maar ook functioneel en gebruiksvriendelijk. Top team!",
  author: "Max van Dijk",
  role: "Ondernemer",
  avatar: "https://framerusercontent.com/images/prGsWNLXwFL3SoKDU2EYWYhZ2k.jpg",
  rating: 5
}, {
  id: '17',
  quote: "Ze overtroffen al onze verwachtingen met een product dat onze merkidentiteit perfect vastlegt.",
  author: "Eva Martens",
  role: "Communication Manager",
  avatar: "https://framerusercontent.com/images/P0sSNnMlhW7adaGkZFmKHL828bY.jpg",
  rating: 5
}, {
  id: '18',
  quote: "Innovatief, betrouwbaar en vakkundig. Samenwerken met dit team was een waar genoegen.",
  author: "Ruben Koning",
  role: "Directeur Strategie",
  avatar: "https://framerusercontent.com/images/5O8P63EQwkFO1m5OTR4jsw7hI8.jpg",
  rating: 5
}];

/** Returns responsive card width and visible card count based on screen width */
function useResponsiveCard() {
  const [cardWidth, setCardWidth] = useState(630);
  const [visibleCards, setVisibleCards] = useState(2);
  const [gap, setGap] = useState(24);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) {
        // Very small mobile
        setCardWidth(w - 48);
        setVisibleCards(1);
        setGap(12);
      } else if (w < 640) {
        // Mobile
        setCardWidth(w - 64);
        setVisibleCards(1);
        setGap(16);
      } else if (w < 1024) {
        // Tablet
        setCardWidth(Math.min(480, w - 80));
        setVisibleCards(1);
        setGap(20);
      } else if (w < 1280) {
        // Small desktop
        setCardWidth(520);
        setVisibleCards(2);
        setGap(24);
      } else {
        // Large desktop
        setCardWidth(630);
        setVisibleCards(2);
        setGap(24);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return { cardWidth, visibleCards, gap };
}

export const TestimonialCarousel = () => {
  // Create infinite loop by tripling the testimonials
  const infiniteTestimonials = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];
  const totalOriginal = TESTIMONIALS.length;

  const { cardWidth, visibleCards, gap } = useResponsiveCard();

  // Start in the middle set
  const [currentIndex, setCurrentIndex] = useState(totalOriginal + 2);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, []);
  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  }, []);

  // Handle infinite loop reset
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => {
      setIsTransitioning(false);

      // Reset to middle set when reaching boundaries
      if (currentIndex >= totalOriginal * 2) {
        setCurrentIndex(currentIndex - totalOriginal);
      } else if (currentIndex < totalOriginal) {
        setCurrentIndex(currentIndex + totalOriginal);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning, totalOriginal]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch/swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) nextSlide();
    else if (diff < -threshold) prevSlide();
  };

  // Calculate the scroll offset
  const scrollX = currentIndex * (cardWidth + gap);

  // Calculate centering offset: position so focused cards are centered
  const totalFocusWidth = visibleCards * cardWidth + (visibleCards - 1) * gap;
  const centerOffset = `calc(50% - ${totalFocusWidth / 2}px)`;

  // Helper function to determine if a card should be in focus
  const isCardInFocus = (index: number) => {
    if (visibleCards === 1) {
      return index === currentIndex;
    }
    return index === currentIndex || index === currentIndex + 1;
  };

  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-screen flex flex-col items-center justify-center bg-card py-10 sm:py-12 md:py-16 px-4 overflow-hidden">
      {/* Header Container */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 max-w-[700px] text-center px-2">
        <div className="flex items-center gap-2 px-3 py-1.5">
          <Image src="https://framerusercontent.com/images/F8wan4JxRuiIlSJe5tqI0wnJhM.svg" alt="" width={6} height={10} className="opacity-60" />
          <span className="text-[11px] sm:text-[12px] font-semibold text-muted-foreground tracking-[1.8px] uppercase font-sans">Reviews</span>
          <Image src="https://framerusercontent.com/images/T2mfWqIsv4Kpdf5hFk22cxmmg78.svg" alt="" width={6} height={10} className="opacity-60" />
        </div>
        <h2 className="text-2xl sm:text-[36px] md:text-[42px] lg:text-[52px] font-medium text-card-foreground leading-[1.2] tracking-tight font-sans">
          Wat{' '}
          <span
            className="italic font-serif text-[#6A49FF] text-3xl sm:text-[40px] md:text-[48px] lg:text-[58px]"
          >
            klanten
          </span>{' '}
          zeggen
        </h2>
      </div>

      {/* Carousel Container */}
      <div
        className="relative w-full mb-6 sm:mb-8"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={containerRef} className="overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: -scrollX }}
            transition={isTransitioning ? {
              type: "spring",
              stiffness: 300,
              damping: 30
            } : {
              duration: 0
            }}
            style={{
              gap: `${gap}px`,
              paddingLeft: centerOffset,
              paddingRight: centerOffset,
            }}
          >
            {infiniteTestimonials.map((testimonial, index) => {
              const inFocus = isCardInFocus(index);
              return (
                <motion.div
                  key={`${testimonial.id}-${index}`}
                  className="flex-shrink-0"
                  style={{ width: `${cardWidth}px` }}
                  animate={{
                    filter: inFocus ? 'blur(0px)' : 'blur(4px)',
                    opacity: inFocus ? 1 : 0.6,
                    scale: inFocus ? 1 : 0.95,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <div className="bg-background border border-border/20 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg h-full">
                    <div className="bg-background rounded-lg p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-5 md:gap-6 min-h-[220px] sm:min-h-[260px] md:min-h-[320px]">
                      <p className="text-base sm:text-lg md:text-xl lg:text-[22px] font-medium text-foreground leading-[1.3] sm:leading-[1.2] tracking-[-0.4px] sm:tracking-[-0.6px] font-sans">
                        {testimonial.quote}
                      </p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto pt-3 sm:pt-4 gap-3 sm:gap-0">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-accent shadow-sm overflow-hidden flex-shrink-0">
                            <Image src={testimonial.avatar} alt={testimonial.author} fill className="object-cover" sizes="44px" loading="lazy" />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-sm sm:text-base font-medium font-sans">
                            <span className="text-foreground">{testimonial.author}</span>
                            <span className="hidden sm:inline text-muted-foreground">&mdash;</span>
                            <span className="text-muted-foreground text-xs sm:text-sm">{testimonial.role}</span>
                          </div>
                        </div>

                        <div className="flex gap-0.5 sm:gap-1 ml-[46px] sm:ml-0">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-foreground text-foreground" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-6 sm:mb-8">
        <button
          onClick={prevSlide}
          className="flex items-center justify-center w-10 h-10 bg-background rounded-lg border border-border/20 hover:bg-accent active:scale-95 transition-all shadow-sm group"
          aria-label="Vorige getuigenissen"
        >
          <ChevronLeft className="w-5 h-5 text-foreground group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="flex items-center justify-center w-10 h-10 bg-background rounded-lg border border-border/20 hover:bg-accent active:scale-95 transition-all shadow-sm group"
          aria-label="Volgende getuigenissen"
        >
          <ChevronRight className="w-5 h-5 text-foreground group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Decorative Divider Line */}
      <div className="w-full max-w-[1060px] h-[1px] px-4">
        <div className="flex w-full h-full relative">
          <div className="flex-1 bg-border" />
          <div className="flex-1 bg-border" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-card opacity-80" />
        </div>
      </div>
    </section>
  );
};
