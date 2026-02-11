'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { GradientOverlay } from './GradientOverlay';
interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  rating: number;
  avatar: string;
  rotation: number;
  delay: number;
}
const testimonials: Testimonial[] = [{
  id: 1,
  content: "Working with Jin was transformative. The design elevated our brand and user experience to new heights. Their attention to detail is unmatched.",
  author: "Alex Rivera",
  role: "CEO, GrowthLabs",
  rating: 5.0,
  avatar: "https://framerusercontent.com/images/Wu0ngxjedkJ31EstGJABQBoafk.jpg",
  rotation: -10,
  delay: 0.1
}, {
  id: 2,
  content: "Jin's expertise in both UX and visual design made our project seamless. They delivered beyond expectations and on time every milestone.",
  author: "Nina Patel",
  role: "Director, PixelCraft",
  rating: 5.0,
  avatar: "https://framerusercontent.com/images/Wu0ngxjedkJ31EstGJABQBoafk.jpg",
  rotation: -6,
  delay: 0.2
}, {
  id: 3,
  content: "Exceptional designer with a strategic mindset. Jin helped us rethink our entire product experience from the ground up.",
  author: "Marcus Webb",
  role: "VP Product, Velocity",
  rating: 5.0,
  avatar: "https://framerusercontent.com/images/Wu0ngxjedkJ31EstGJABQBoafk.jpg",
  rotation: 0,
  delay: 0.3
}];

// @component: ClientTestimonials
export const ProjectHighlight = () => {
  // @return
  return <section className="relative w-full py-16 sm:py-24 bg-[#0f0a1f] overflow-hidden">
      {/* Gradient Overlay matching Why Choose Templates */}
      <GradientOverlay />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="mb-12 text-center">
          <p className="text-xs uppercase text-muted-foreground tracking-[0.2em] mb-3 font-sans font-semibold">Geliefde projecten<br /></p>
          <h2 className="text-4xl sm:text-5xl font-heading tracking-tight font-medium text-foreground">Project <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#6a49ff] to-[#a78bfa] font-serif" style={{
            marginTop: "50px",
            height: "0px",
            translate: "-0.1px 7px",
            fontSize: "50px"
          }}>Highlights</span></h2>
        </motion.div>

        {/* Testimonials Stack */}
        <div className="relative flex items-center justify-center min-h-[500px] mt-8 lg:mt-16">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:-gap-24">
            {testimonials.map((testimonial, idx) => <motion.div key={testimonial.id} initial={{
            opacity: 0,
            y: 30,
            rotate: 0
          }} whileInView={{
            opacity: 1,
            y: 0,
            rotate: testimonial.rotation
          }} viewport={{
            once: true
          }} transition={{
            delay: testimonial.delay,
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }} whileHover={{
            scale: 1.05,
            rotate: 0,
            zIndex: 40,
            transition: {
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }} className={cn("relative group cursor-pointer w-[340px] h-[340px] transition-all duration-300", idx !== 0 && "lg:-ml-12")} style={{
            zIndex: 10 + idx
          }}>
                {/* Outer Glass Container */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center">
                  {/* Inner Content Card */}
                  <div className="absolute inset-4 rounded-xl bg-[hsl(251.35deg,31.09%,23.33%)] text-card-foreground shadow-xl border border-border overflow-hidden p-6 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-muted text-muted-foreground mb-5 group-hover:scale-110 transition-transform">
                        <Quote className="h-5 w-5" />
                      </div>
                      
                      <p className="text-sm leading-relaxed text-foreground/90 font-sans mb-6">
                        {testimonial.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                          <img src={testimonial.avatar} alt={testimonial.author} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-foreground">
                            {testimonial.author}
                          </span>
                          <span className="text-[10px] text-muted-foreground leading-none">
                            {testimonial.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                          {testimonial.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>
    </section>;
};