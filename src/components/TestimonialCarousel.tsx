'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const getCardWidth = () => {
  if (typeof window === 'undefined') return 320;
  const w = window.innerWidth;
  if (w < 640) return Math.min(w - 32, 320);
  if (w < 1024) return Math.min(400, w * 0.85);
  return 630;
};

const getGap = () =>
  typeof window !== 'undefined' && window.innerWidth < 640 ? 16 : 24;

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote:
      'Working with this team was effortless that they understood our brand vision & turned it into a digital experience that truly represents who we are.',
    author: 'Olivia Carter',
    role: 'Brand Director',
    avatar:
      'https://framerusercontent.com/images/Wu0ngxjedkJ31EstGJABQBoafk.jpg',
    rating: 5,
  },
  {
    id: '2',
    quote:
      'They translated our ideas into a clean, modern digital presence that feels exactly right for our brand.',
    author: 'Ethan Miller',
    role: 'Director',
    avatar:
      'https://framerusercontent.com/images/bphS41hVtvFCNiuHkZkxk8imJk.jpg',
    rating: 5,
  },
  {
    id: '3',
    quote:
      'The team instantly grasped what we needed and delivered a seamless experience that exceeded every expectation.',
    author: 'Sophia Reyes',
    role: 'Data Science Consultant',
    avatar:
      'https://framerusercontent.com/images/CYC5VQ0ZcK8uEE5jBbm51FTJq0.jpg',
    rating: 5,
  },
  {
    id: '4',
    quote:
      'Their process was smooth, collaborative, and incredibly intuitive — the final result reflects our identity perfectly.',
    author: 'Jackson Carter',
    role: 'Founder',
    avatar:
      'https://framerusercontent.com/images/prGsWNLXwFL3SoKDU2EYWYhZ2k.jpg',
    rating: 5,
  },
  {
    id: '5',
    quote:
      'From concept to execution, they understood our goals and crafted a digital experience that feels uniquely ours.',
    author: 'Olivia Bennett',
    role: 'Manager',
    avatar:
      'https://framerusercontent.com/images/P0sSNnMlhW7adaGkZFmKHL828bY.jpg',
    rating: 5,
  },
  {
    id: '6',
    quote:
      'They made everything simple and efficient, turning our brand vision into a polished product that elevates our online presence.',
    author: 'Noah Brooks',
    role: 'CEO',
    avatar:
      'https://framerusercontent.com/images/5O8P63EQwkFO1m5OTR4jsw7hI8.jpg',
    rating: 5,
  },
];

export const TestimonialCarousel = () => {
  const infiniteTestimonials = [
    ...TESTIMONIALS,
    ...TESTIMONIALS,
    ...TESTIMONIALS,
  ];
  const totalOriginal = TESTIMONIALS.length;

  const [currentIndex, setCurrentIndex] = useState(totalOriginal + 2);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [cardWidth, setCardWidth] = useState(320);
  const [gap, setGap] = useState(24);

  useEffect(() => {
    const update = () => {
      setCardWidth(getCardWidth());
      setGap(getGap());
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      setIsTransitioning(false);

      if (currentIndex >= totalOriginal * 2) {
        setCurrentIndex((prev) => prev - totalOriginal);
      } else if (currentIndex < totalOriginal) {
        setCurrentIndex((prev) => prev + totalOriginal);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning, totalOriginal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const cardsToShow = cardWidth < 500 ? 1 : 2;
  const scrollX = currentIndex * (cardWidth + gap);

  const paddingLeft =
    cardsToShow === 1
      ? `calc(50% - ${cardWidth / 2}px)`
      : `calc(50% - ${(cardWidth * 2 + gap) / 2}px)`;

  const isCardInFocus = (index: number) => {
    if (cardsToShow === 1) return index === currentIndex;
    return index === currentIndex || index === currentIndex + 1;
  };

  return (
    <section className="relative w-full min-h-[80vh] sm:min-h-[85vh] flex flex-col items-center justify-center bg-card py-8 sm:py-12 px-4 overflow-hidden">
      <div className="relative w-full mb-6 sm:mb-8">
        <div ref={containerRef} className="overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: -scrollX }}
            transition={
              isTransitioning
                ? { type: 'spring', stiffness: 300, damping: 30 }
                : { duration: 0 }
            }
            style={{
              gap: `${gap}px`,
              paddingLeft,
              paddingRight: paddingLeft,
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
                    filter: inFocus ? 'blur(0px)' : 'blur(2px)',
                    opacity: inFocus ? 1 : 0.75,
                    scale: inFocus ? 1 : 0.97,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <div className="bg-background border border-border/20 p-4 sm:p-5 rounded-2xl shadow-lg">
                    <div className="bg-background rounded-lg p-5 sm:p-8 flex flex-col gap-4 sm:gap-6 min-h-[280px] sm:min-h-[320px]">
                      <p className="text-[17px] sm:text-[20px] md:text-[22px] font-medium text-foreground leading-[1.2] tracking-[-0.6px]">
                        {testimonial.quote}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="text-sm font-medium">
                            {testimonial.author}
                            <span className="text-muted-foreground">
                              {' '}
                              — {testimonial.role}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5 fill-foreground text-foreground"
                            />
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

      <div className="flex justify-center gap-3">
        <button onClick={prevSlide} aria-label="Previous testimonials">
          <ChevronLeft />
        </button>
        <button onClick={nextSlide} aria-label="Next testimonials">
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};
