'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WebDirectHeader } from '../components/WebDirectHeader';
import { HeroSection } from '../components/HeroSection';

const ImageGalleryCarousel = dynamic(
  () => import('../components/ImageGalleryCarousel').then((m) => ({ default: m.ImageGalleryCarousel })),
  { ssr: true }
);
const BrandStatementText = dynamic(
  () => import('../components/BrandStatementText').then((m) => ({ default: m.BrandStatementText })),
  { ssr: true }
);
const WhyChooseTemplates = dynamic(
  () => import('../components/WhyChooseTemplates').then((m) => ({ default: m.WhyChooseTemplates })),
  { ssr: true }
);
const ProjectHighlight = dynamic(
  () => import('../components/ProjectHighlight').then((m) => ({ default: m.ProjectHighlight })),
  { ssr: true }
);
const TestimonialCarousel = dynamic(
  () => import('../components/TestimonialCarousel').then((m) => ({ default: m.TestimonialCarousel })),
  { ssr: true }
);
const HeroCTASection = dynamic(
  () => import('../components/HeroCTASection').then((m) => ({ default: m.HeroCTASection })),
  { ssr: true }
);
const Footer = dynamic(
  () => import('../components/Footer').then((m) => ({ default: m.Footer })),
  { ssr: true }
);

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