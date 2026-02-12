'use client';

import { WebDirectHeader } from '../components/WebDirectHeader';
import { ImageGalleryCarousel } from '../components/ImageGalleryCarousel';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { BrandStatementText } from '../components/BrandStatementText';
import { TestimonialCarousel } from '../components/TestimonialCarousel';
import { FAQSection } from '../components/FAQSection';
import { WhyChooseTemplates } from '../components/WhyChooseTemplates';
import { ProjectHighlight } from '../components/ProjectHighlight';
import { HeroCTASection } from '../components/HeroCTASection';

export default function Home() {
  return (
    <div className="m-0 min-h-screen bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#0f0a1f] font-sans transition-colors duration-300 top-0">
      <WebDirectHeader />
      
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
      
      
      
      <div id="testimonials">
        <TestimonialCarousel />
      </div>
      <div >
      <HeroCTASection />
      </div>
      <Footer />
    </div>
  );
}