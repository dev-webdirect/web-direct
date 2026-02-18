
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
import { ProcessTimeline } from '../components/ProcessTimeline';

export default function Home() {
  return (
    <>
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
          <div >
            <ImageGalleryCarousel />
          </div>
          <div id="about">
            <BrandStatementText />
          </div>
          <div id="process">
            <ProcessTimeline />
          </div>

          <div>
            <WhyChooseTemplates />
          </div>
          {/*}
          <div id="projects">
            <WorkShowcase />
          </div>
          */}
          {/*}
          <div id="features">
            <FeatureGridSection />
          </div>
          */}
          <div >
            <TestimonialCarousel />
          </div>
          <div id="faq">
            <BookingFaqSection />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}