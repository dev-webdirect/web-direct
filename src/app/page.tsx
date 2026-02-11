
import { motion } from 'framer-motion';
import { WebDirectHeader } from '../components/WebDirectHeader';  
import { ImageGalleryCarousel } from '../components/ImageGalleryCarousel';
import { ensureLightMode } from '../lib/utils';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { BrandStatementText } from '../components/BrandStatementText';
import { TestimonialCarousel } from '../components/TestimonialCarousel';
import {FAQSection} from '../components/FAQSection';
import { WhyChooseTemplates } from '../components/WhyChooseTemplates';
import { ProjectHighlight } from '../components/ProjectHighlight';
import { FeedbucketWidget } from '../components/FeedbucketWidget';
import { HeroCTASection } from '../components/HeroCTASection';

export default function Home() {
  ensureLightMode();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0a1f] text-[#30294e] dark:text-[#e0e0e0] font-sans transition-colors duration-300">
      {/* Navbar */}
      <WebDirectHeader/>
      {/* Hero Section */}
      <div id="hero" className="relative z-20 pt-32">
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
