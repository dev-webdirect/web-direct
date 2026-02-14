
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
import { WorkShowcase } from '../components/WorkShowcase';
import { FeatureGridSection } from '../components/FeatureGridSection';
import { BookingFaqSection } from '../components/BookingFaqSection';

export default function Home() {
  return (
    <div className="m-0 min-h-screen bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#0f0a1f] font-sans transition-colors duration-300 top-0">
      <WebDirectHeader />

      {/* Hero – unchanged, keeps its own gradient */}
      <div id="hero" className="relative">
        <HeroSection />
      </div>

      {/* Main content: gradient flows top to bottom, ends dark for seamless footer */}
      <div className="relative min-h-screen bg-[#0f0a1f]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, #0f0a1f 0%, #1a0f2e 18%, #2d1b4e 42%, #1a0f2e 68%, #0f0a1f 85%, #0f0a1f 100%)',
          }}
          aria-hidden
        />
        <div className="relative z-10">
          <div id="gallery" className="relative z-10">
            <ImageGalleryCarousel />
          </div>
          <section id="about" className="w-full pt-0">
            <BrandStatementText />
          </section>
          <div id="services">
            <WhyChooseTemplates />
          </div>
          <div id="work">
            <WorkShowcase />
          </div>
          {/*}
          <div id="features">
            <FeatureGridSection />
          </div>
          */}
          <div id="testimonials">
            <TestimonialCarousel />
          </div>
          <div>
            <BookingFaqSection />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}