'use client';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, useAnimationControls } from 'framer-motion';
type Review = {
  id: string;
  name: string;
  tag: string;
  avatar: string;
  description: string;
};
const DEFAULT_REVIEWS: Review[] = [{
  id: '1',
  name: 'Sophie van der Berg',
  tag: '@sophievdb',
  avatar: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bbf7/68e5e04901043aafb86c5e54_avatar-1.webp',
  description: 'Professioneel, kundig en leuk om mee te werken. Maakte complexe dingen simpel.'
}, {
  id: '2',
  name: 'Emma de Vries',
  tag: '@emmadv',
  avatar: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bbf7/68e5e049c05be95b316bf51a_avatar-4.webp',
  description: 'Een game-changer voor onze startup. Zorgde voor zowel strategie als uitvoering.'
}, {
  id: '3',
  name: 'Chris Jansen',
  tag: '@chrisjansen',
  avatar: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bbf7/68e5e0491f3bd4d420313a10_avatar-2.webp',
  description: 'Regelde alles van UX tot backend zonder een probleem.'
}, {
  id: '4',
  name: 'Lars Bakker',
  tag: '@larsbakker',
  avatar: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bbf7/68e5e04a535eb43129cb2323_avatar-10.webp',
  description: 'Een game-changer voor ons bedrijf. Bracht strategie en uitvoering samen.'
}, {
  id: '5',
  name: 'Lisa Peters',
  tag: '@lisapeters',
  avatar: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bbf7/68e5e04a3d6c7d58cf1f8e33_avatar-9.webp',
  description: 'Alles staat nu op één plek en de ervaring is ongelooflijk soepel.'
}, {
  id: '6',
  name: 'Anna Mulder',
  tag: '@annamulder',
  avatar: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bbf7/68e5e04a24089b4bd5496ac3_avatar-11.webp',
  description: 'Als je op zoek bent naar een design dat er geweldig uitziet en nog beter presteert.'
}, {
  id: '7',

  name: 'Tom Visser ',
  tag: '@tomvisser',
  
  avatar: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bbf7/68e5e0495de73bd388c22a39_avatar-5.webp',
  description: 'We voelden ons gehoord bij elke stap en het eindproduct overtrof de verwachtingen.'
}, {
  id: '8',
  name: 'Daan Smit',
  tag: '@daansmit',
  avatar: 'https://cdn.prod.website-files.com/68e09a47f4893fd87793bbf7/68e5e049dce75b5793bd5727_avatar-7.webp',
  description: 'De website die ze bouwden verhoogde ons conversiepercentage in de eerste maand.'
}];
const ReviewCard = ({
  review,
  onHoverStart,
  onHoverEnd
}: {
  review: Review;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) => <div className="flex flex-row items-start gap-5 bg-[#0f0a1f]/95 w-[450px] min-w-[450px] h-[146px] rounded-[10px] p-[30px] border border-[#6A49FF]/40 shadow-lg select-none backdrop-blur-sm cursor-pointer transition-all hover:border-[#6A49FF]/50 hover:shadow-xl hover:bg-[#1a1227]/95" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
    <Image src={review.avatar} width={50} height={50} alt={`${review.name}'s Avatar`} className="w-[50px] h-[50px] min-w-[50px] rounded-full object-cover border-[0.8px] border-[#6A49FF]/40 shadow-[0_8px_15px_rgba(70,38,201,0.3)]" />
    <div className="flex flex-col gap-[10px] flex-1 min-w-0">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row items-center gap-[10px] overflow-hidden">
          <span className="text-white text-[14px] font-medium truncate">{review.name}</span>
          <span className="text-[#666] text-[26px] leading-none mb-3">.</span>
          <span className="text-[#adadad] text-[14px] truncate">{review.tag}</span>
        </div>
      </div>
      <p className="text-[#adadad] text-[16px] leading-[1.4] m-0 line-clamp-2 overflow-hidden text-ellipsis">
        {review.description}
      </p>
    </div>
  </div>;
const ReviewPopup = ({
  review,
  position
}: {
  review: Review;
  position: {
    x: number;
    y: number;
  };
}) => <div className="fixed z-[9999] pointer-events-none" style={{
  left: `${position.x}px`,
  top: `${position.y}px`,
  transform: 'translate(-50%, 0) translateY(20px)'
}}>
    <div className="bg-[#0f0a1f]/98 backdrop-blur-md rounded-[12px] p-6 border border-[#6A49FF]/50 shadow-2xl max-w-[500px] min-w-[400px]">
      <div className="flex flex-row items-start gap-4 mb-4">
        <Image src={review.avatar} width={60} height={60} alt={`${review.name}'s Avatar`} className="w-[60px] h-[60px] min-w-[60px] rounded-full object-cover border-[1px] border-[#6A49FF]/40 shadow-[0_8px_15px_rgba(70,38,201,0.4)]" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex flex-row items-center gap-2">
            <span className="text-white text-[16px] font-semibold">{review.name}</span>
            <span className="text-[#666] text-[24px] leading-none mb-2">.</span>
            <span className="text-[#adadad] text-[14px]">{review.tag}</span>
          </div>
        </div>
      </div>
      <p className="text-white text-[16px] leading-[1.6] m-0">
        {review.description}
      </p>
    </div>
  </div>;

// @component: ReviewMarquee
export const TestimonialCarousel= () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls1 = useAnimationControls();
  const controls2 = useAnimationControls();
  const [hoveredReview, setHoveredReview] = useState<Review | null>(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [isPaused, setIsPaused] = useState(false);
  const hidePopupTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentX1 = useRef(0);
  const currentX2 = useRef(0);
  const animationStartTime1 = useRef(0);
  const animationStartTime2 = useRef(0);

  // Duplicating for seamless scrolling
  const firstRow = [...DEFAULT_REVIEWS.slice(0, 4), ...DEFAULT_REVIEWS.slice(0, 4)];
  const secondRow = [...DEFAULT_REVIEWS.slice(4), ...DEFAULT_REVIEWS.slice(4)];
  useEffect(() => {
    const startAnimations = async () => {
      animationStartTime1.current = Date.now();
      animationStartTime2.current = Date.now();

      // Row 1: Leftward movement
      controls1.start({
        x: ['0%', '-50%'],
        transition: {
          duration: 30,
          ease: 'linear',
          repeat: Infinity
        }
      });

      // Row 2: Rightward movement
      controls2.start({
        x: ['-50%', '0%'],
        transition: {
          duration: 30,
          ease: 'linear',
          repeat: Infinity
        }
      });
    };
    startAnimations();
  }, [controls1, controls2]);

  useEffect(() => () => {
    if (hidePopupTimeout.current) clearTimeout(hidePopupTimeout.current);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
  };
  const handleHoverStart = (review: Review) => {
    if (hidePopupTimeout.current) {
      clearTimeout(hidePopupTimeout.current);
      hidePopupTimeout.current = null;
    }
    setHoveredReview(review);
    setIsPaused(true);

    // Calculate current position based on elapsed time
    const elapsed1 = (Date.now() - animationStartTime1.current) % 30000;
    const elapsed2 = (Date.now() - animationStartTime2.current) % 30000;
    const progress1 = elapsed1 / 30000;
    const progress2 = elapsed2 / 30000;
    currentX1.current = -progress1 * 50;
    currentX2.current = -50 + progress2 * 50;
    controls1.stop();
    controls2.stop();
  };
  const handleHoverEnd = () => {
    // Delay hiding so popup stays visible briefly when mouse moves off card
    hidePopupTimeout.current = setTimeout(() => {
      setHoveredReview(null);
      hidePopupTimeout.current = null;
    }, 150);
    setIsPaused(false);

    // Calculate remaining distance and time for smooth continuation
    const remainingDistance1 = -50 - currentX1.current;
    const remainingDistance2 = 0 - currentX2.current;
    const totalDistance = 50;
    const remainingTime1 = Math.abs(remainingDistance1) / totalDistance * 30;
    const remainingTime2 = Math.abs(remainingDistance2) / totalDistance * 30;

    // Update start times to match resumed animation
    animationStartTime1.current = Date.now() - currentX1.current / -50 * 30000;
    animationStartTime2.current = Date.now() - (currentX2.current + 50) / 50 * 30000;

    // Resume animations from exact current position
    controls1.start({
      x: [`${currentX1.current}%`, '-50%'],
      transition: {
        duration: remainingTime1,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0
      }
    });
    controls2.start({
      x: [`${currentX2.current}%`, '0%'],
      transition: {
        duration: remainingTime2,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0
      }
    });
  };

  // @return – no own bg so page gradient (page.tsx) shows through; edge fades match page #0f0a1f
  return (
    <div className="relative w-full overflow-hidden py-10 min-h-[400px] flex items-center justify-center" onMouseMove={handleMouseMove}>
      <div className="flex flex-col gap-5 w-full relative">
        <div className="absolute top-0 bottom-0 left-0 w-[200px] z-10 pointer-events-none bg-gradient-to-r from-[#0f0a1f] to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-[200px] z-10 pointer-events-none bg-gradient-to-l from-[#0f0a1f] to-transparent" />

        {/* Row 1 - Moving Left */}
        <div className="flex overflow-hidden">
          <motion.div animate={controls1} className="flex gap-5 whitespace-nowrap" style={{
          width: 'max-content'
        }}>
            {firstRow.map((review, idx) => <ReviewCard key={`row1-${review.id}-${idx}`} review={review} onHoverStart={() => handleHoverStart(review)} onHoverEnd={handleHoverEnd} />)}
          </motion.div>
        </div>

        {/* Row 2 - Moving Right */}
        <div className="flex overflow-hidden">
          <motion.div animate={controls2} className="flex gap-5 whitespace-nowrap" style={{
          width: 'max-content'
        }}>
            {secondRow.map((review, idx) => <ReviewCard key={`row2-${review.id}-${idx}`} review={review} onHoverStart={() => handleHoverStart(review)} onHoverEnd={handleHoverEnd} />)}
          </motion.div>
        </div>
      </div>

      {/* Review Popup - render via Portal to body to avoid overflow/transform clipping */}
      {typeof document !== 'undefined' && hoveredReview && createPortal(
        <ReviewPopup review={hoveredReview} position={mousePosition} />,
        document.body
      )}
    </div>
  );
};