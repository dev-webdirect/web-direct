"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Key, Eye, Zap } from 'lucide-react';
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
  y: 20
}} whileInView={{
  opacity: 1,
  y: 0
}} viewport={{
  once: true
}} className="flex flex-col items-start gap-4">
    <div className="text-primary h-10 w-10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="text-[22px] leading-[1.3] font-medium text-foreground mb-2">
        {title}
      </h4>
      <p className="text-muted-foreground text-base leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>;

// @component: FeatureGridSection
export const FeatureGridSection = () => {
  const features = [{
    icon: <ShieldCheck size={40} strokeWidth={1.5} />,
    title: "Decentralization",
    description: "We believe in a decentralized future where power and control are distributed."
  }, {
    icon: <Key size={40} strokeWidth={1.5} />,
    title: "Ownership",
    description: "Empowering users to truly own their data, assets, and identities is at the core of Web3."
  }, {
    icon: <Eye size={40} strokeWidth={1.5} />,
    title: "Transparency",
    description: "We are committed to building open and transparent systems that allow for accountability."
  }, {
    icon: <Zap size={40} strokeWidth={1.5} />,
    title: "Innovation",
    description: "Web3 is driven by continuous innovation. We push boundaries by exploring new technologies."
  }] as any[];

  // @return
  return <div className="w-full min-h-screen h-screen bg-background py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-10 flex items-center overflow-y-auto">
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-[50px] my-auto">
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
      }} className="bg-card border-2 border-border rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 md:p-8 lg:p-[50px] backdrop-blur-[10px]">
          <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-[60px]">
            <h3 className="text-[24px] sm:text-[28px] md:text-[40px] leading-[1.3] font-medium text-foreground">
              The{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                principles and mission
              </span>{" "}
              behind all we do.
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-[50px] gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-y-[50px]">
            {features.map((feature, index) => <FeatureCard key={index} {...feature} />)}
          </div>
        </motion.div>

        {/* Right Section: Vision and Call to Action */}
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-[50px]">
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
        }} className="bg-gradient-to-r from-primary to-secondary rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 md:p-8 lg:p-[50px]">
            <div className="mb-4 sm:mb-6 md:mb-10 lg:mb-[60px]">
              <h4 className="text-[24px] sm:text-[28px] md:text-[40px] leading-[1.3] font-medium text-primary-foreground">
                The vision that guides everything we do
              </h4>
            </div>
            <p className="text-primary-foreground text-lg leading-relaxed opacity-90">
              Perceived end knowledge certainly day sweetness why cordially. Ask a quick six seven offer see among. 
              Handsome met debating sir dwelling age material. As style lived he worse dried. 
              Offered related so visitors we private removed. Moderate do subjects to distance.
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
        }} className="bg-gradient-to-r from-primary to-secondary rounded-[20px] p-4 sm:p-6 md:p-8 lg:p-[50px] flex flex-col items-center text-center">
            <div className="mb-6 sm:mb-8 md:mb-[40px] lg:mb-[60px]">
              <h4 className="text-[32px] md:text-[40px] leading-[1.3] font-medium text-primary-foreground mb-4">
                Ready to shape the future?
              </h4>
              <p className="text-primary-foreground text-lg leading-relaxed opacity-90">
                Join our team and help us build the decentralized future of the web
              </p>
            </div>
            <button onClick={e => e.preventDefault()} className="inline-flex items-center gap-2 px-[34px] py-[20px] bg-background text-foreground text-base font-medium rounded-[20px] transition-all duration-300 hover:opacity-90 active:scale-95 group shadow-lg">
              Join our team
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>;
};