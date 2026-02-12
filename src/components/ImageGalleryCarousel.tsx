"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from 'lucide-react';
interface GalleryImage {
  id: string;
  url: string;
}
const GALLERY_TOP: GalleryImage[] = [{
  id: 't1',
  url: 'https://framerusercontent.com/images/Gw2uTivgvCkhc4dSxTHmfxTLyYU.jpg'
}, {
  id: 't2',
  url: 'https://framerusercontent.com/images/fJQsSGm9Rt8RkpsNK8d1FBJcY.jpg'
}, {
  id: 't3',
  url: 'https://framerusercontent.com/images/aieJgC3Sca5Mj4E4ajeQWSbf1I.jpg'
}, {
  id: 't4',
  url: 'https://framerusercontent.com/images/9or4YMXHYNQfo9LdQO9M7HUrB8.jpg'
}, {
  id: 't5',
  url: 'https://framerusercontent.com/images/tvF7vxDX0bQ55up1RnjVopQfQU.jpg'
}, {
  id: 't6',
  url: 'https://framerusercontent.com/images/ZZWJYuFdl6TIAqeEe4wguHLjc0.jpg'
}];
const GALLERY_BOTTOM: GalleryImage[] = [{
  id: 'b1',
  url: 'https://framerusercontent.com/images/y78HqOmrFs5Wnmgs6XMaXrEts4.jpg'
}, {
  id: 'b2',
  url: 'https://framerusercontent.com/images/VJNWBeLoIV2o2VLFqAYQN34EDlE.jpg'
}, {
  id: 'b3',
  url: 'https://framerusercontent.com/images/SXMgS6j1Qi0EmlOeIcQBiZ1xP0.jpg'
}, {
  id: 'b4',
  url: 'https://framerusercontent.com/images/54rgdyHlT5jTLB1jlx1W7jdkRbE.jpg'
}, {
  id: 'b5',
  url: 'https://framerusercontent.com/images/sROpSj0sRvaraaYJcrRCNYwA.jpg'
}, {
  id: 'b6',
  url: 'https://framerusercontent.com/images/lNE1sUbqwHFCb5UOH9OnWTyekyE.jpg'
}];
const TickerRow = ({
  images,
  reverse = false
}: {
  images: GalleryImage[];
  reverse?: boolean;
}) => {
  // Triple the images to ensure seamless infinite scroll
  const items = [...images, ...images, ...images];
  return <div className="flex w-full overflow-hidden whitespace-nowrap py-4">
      <motion.div className="flex gap-[30px]" initial={{
      x: reverse ? '-66.66%' : '0%'
    }} animate={{
      x: reverse ? '0%' : '-66.66%'
    }} transition={{
      duration: 40,
      ease: 'linear',
      repeat: Infinity
    }}>
        {items.map((img, idx) => <div key={`${img.id}-${idx}`} className="relative flex-shrink-0 w-[390px] h-[300px] p-5 bg-card border border-border rounded-2xl" style={{
        borderRadius: reverse ? '16px 16px 0px 0px' : '0px 0px 16px 16px'
      }}>
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <img src={`${img.url}?width=480&height=360`} alt="Gallery content" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>)}
      </motion.div>
    </div>;
};
export const ImageGalleryCarousel = () => {
    return <section className="relative w-full min-h-[420px] sm:min-h-[520px] md:min-h-[580px] flex flex-col items-center justify-center gap-4 sm:gap-[30px] overflow-hidden bg-background py-2.5 px-2 sm:px-0 z-10">
      {/* Top & Bottom Background Dividers */}
      <div className="absolute top-0 left-[-20px] right-[-20px] h-5 bg-muted border-y border-border z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-[-20px] right-[-20px] h-5 bg-muted border-y border-border z-10 pointer-events-none" />

      {/* Tickers */}
      <div className="flex flex-col gap-[30px] w-full">
        <TickerRow images={GALLERY_TOP} reverse={false} />
        <TickerRow images={GALLERY_BOTTOM} reverse={true} />
      </div>

      {/* Center Floating Card */}
      <motion.div className="absolute z-20 flex items-center justify-center rounded-full bg-gradient-to-b from-muted to-card border border-border p-[10px] w-[340px] h-[340px]" initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      duration: 0.8,
      ease: 'easeOut'
    }}>
        <div className="relative w-full h-full rounded-full bg-gradient-to-b from-card to-muted shadow-lg p-[2px]">
          <div className="w-full h-full rounded-full bg-card flex flex-col items-center justify-center gap-[24px] p-[50px] text-center">
            {/* Icon Wrapper */}
            <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-muted" style={{
            display: "none"
          }}>
              <Layout className="w-6 h-6 text-foreground" style={{
              display: "none"
            }} />
            </div>

            {/* Content */}
            <div className="max-w-[220px]">
              <h2 className="text-[32px] font-medium leading-[1.2] tracking-[-1px] text-foreground font-heading antialiased">Websites in Custom Code</h2>
            </div>

            {/* Button */}
            <motion.button whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} className="relative w-[189px] h-[39.2px] bg-primary text-primary-foreground rounded-lg font-medium text-sm flex items-center justify-center shadow-md cursor-pointer group hover:bg-primary/90 transition-colors">Ontdek onze projecten</motion.button>
          </div>
        </div>
      </motion.div>

      {/* Overlays for depth & fade effects */}
      <div className="absolute inset-0 bg-foreground/5 pointer-events-none" style={{ zIndex: 5 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none opacity-100" style={{ zIndex: 5 }} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-transparent to-background/25 pointer-events-none" style={{ zIndex: 5 }} />
    </section>;
};