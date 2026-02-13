import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Key, Eye, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}


const FeatureCard = ({
  icon,
  title,
  description
}: FeatureCardProps) => <motion.div initial={{
  opacity: 0,
  y: 16
}} whileInView={{
  opacity: 1,
  y: 0
}} viewport={{
  once: true
}} className="flex flex-col items-start gap-2 sm:gap-3">
    <div className="text-primary h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <h4 className="text-base sm:text-l leading-[1.3] font-medium text-foreground mb-1">
        {title}
      </h4>
      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>;

// @component: FeatureGridSection
export const FeatureGridSection = () => {
  const features = [{
    icon: <ShieldCheck size={28} strokeWidth={1.5} className="w-8 h-8 sm:w-9 sm:h-9" />,
    title: "Decentralisatie",
    description: "Wij geloven in een gedecentraliseerde toekomst waarin macht en controle verdeeld zijn."
  }, {
    icon: <Key size={28} strokeWidth={1.5} className="w-8 h-8 sm:w-9 sm:h-9" />,
    title: "Eigendom",
    description: "Gebruikers in staat stellen hun data, bezittingen en identiteit écht te bezitten staat centraal."
  }, {
    icon: <Eye size={28} strokeWidth={1.5} className="w-8 h-8 sm:w-9 sm:h-9" />,
    title: "Transparantie",
    description: "Wij zetten ons in voor open en transparante systemen die verantwoording mogelijk maken."
  }, {
    icon: <Zap size={28} strokeWidth={1.5} className="w-8 h-8 sm:w-9 sm:h-9" />,
    title: "Innovatie",
    description: "Continue innovatie drijft ons. Wij verleggen grenzen door nieuwe technologieën te verkennen."
  }] as any[];
  const router = useRouter();
  const goToBooking = () => router.push('/booking');
  // @return
  return <div className="w-full bg-background py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* Left Card: Principles & Mission */}
        <motion.div initial={{
        opacity: 0,
        x: -30
      }} whileInView={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.6
      }} viewport={{
        once: true
      }} className="bg-card border-2 border-border rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 backdrop-blur-[10px]">
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl leading-[1.3] font-medium text-foreground">
              De{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                principes en missie
              </span>{" "}
              achter alles wat wij doen.
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8">
            {features.map((feature, index) => <FeatureCard key={index} {...feature} />)}
          </div>
        </motion.div>

        {/* Right Section: Vision and Call to Action */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Vision Card */}
          <motion.div initial={{
          opacity: 0,
          x: 30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="bg-gradient-to-r from-primary to-secondary rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
            <div className="mb-4 sm:mb-6">
              <h4 className="text-lg sm:text-xl md:text-2xl leading-[1.3] font-medium text-primary-foreground">
                De visie die alles wat wij doen leidt
              </h4>
            </div>
            <p className="text-primary-foreground text-sm sm:text-base leading-relaxed opacity-90">
              Onze visie is om digitale ervaringen te creëren die merken helpen groeien. 
              Wij combineren strategie, design en technologie om oplossingen te bouwen die écht impact maken.
            </p>
          </motion.div>

          {/* CTA Section */}
          <motion.div initial={{
          opacity: 0,
          x: 30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} viewport={{
          once: true
        }} className="bg-gradient-to-r from-primary to-secondary rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col items-center text-center">
            <div className="mb-4 sm:mb-6">
              <h4 className="text-lg sm:text-xl md:text-2xl leading-[1.3] font-medium text-primary-foreground mb-2 sm:mb-3">
              Klaar om jouw project te starten?
              </h4>
              <p className="text-primary-foreground text-sm sm:text-base leading-relaxed opacity-90 mb-4">
              Boek hier een 15 min meeting met ons team.</p>
            </div>
            <button
              onClick={goToBooking}
              className="inline-flex w-fit items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3 md:px-6 md:py-3.5 min-h-[44px] sm:min-h-[40px] bg-secondary text-secondary-foreground rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all hover:bg-secondary/90 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
            >
              <span className="text-center">Boek je GRATIS meeting!</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>;
};