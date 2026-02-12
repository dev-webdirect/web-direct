'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WebDirectHeader } from '../components/WebDirectHeader';
import { ImageGalleryCarousel } from '../components/ImageGalleryCarousel';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { BrandStatementText } from '../components/BrandStatementText';
import { TestimonialCarousel } from '../components/TestimonialCarousel';
import { FAQSection } from '../components/FAQSection';
import { WhyChooseTemplates } from '../components/WhyChooseTemplates';
import { ProjectHighlight } from '../components/ProjectHighlight';
import { FeedbucketWidget } from '../components/FeedbucketWidget';
import { HeroCTASection } from '../components/HeroCTASection';
import FluidBackground from '../components/FluidBackground';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="m-0 min-h-screen bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#0f0a1f] font-sans transition-colors duration-300 top-0">
      {/* Sticky Navbar - stays at top on scroll */}
     <div className="bg-[#0f0a1f]"></div> 
      <WebDirectHeader theme={theme} toggleTheme={toggleTheme} />
      
      {/* Hero Section */}
      <div id="hero" className="relative">
        <HeroSection />
      </div> 
      

      {/* Image Gallery Section */}
      <div id="gallery" className="relative z-10">
        <ImageGalleryCarousel />
      </div>
      
      <section id="about" className="w-full pt-0">
        <BrandStatementText />
      </section>
      
      <div id="services">
        <WhyChooseTemplates />
      </div>
      
      <div id="projects">
        <ProjectHighlight />
      </div>
      
      <div id="testimonials">
        <TestimonialCarousel />
      </div>
      
      <HeroCTASection />
      
      <Footer />
    </div>
  );
}