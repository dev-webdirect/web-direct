'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

const faqs = [{
    q: "Why choose custom code over WordPress?",
    a: "Custom code offers superior speed, better SEO, and zero plugin vulnerabilities. It's the professional choice for businesses valuing quality and scalability."
  }, {
    q: "How can you deliver so quickly?",
    a: "We leverage internal AI tools to scaffold foundations, allowing our developers to focus on design refinement and business logic."
  }, {
    q: "Is the Design Preview really free?",
    a: "Yes. We create a real homepage concept before you pay anything. We want to prove our value first."
  }, {
    q: "Do I own the code?",
    a: "While the site runs on our infrastructure for optimal performance, you own your content and design with clear offboarding options."
  }] as any[];


export const FAQSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white dark:bg-[#0f0a1f] transition-colors duration-300">
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20">
        <div>
          <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-[#30294e] dark:text-white mb-6 sm:mb-8 leading-tight tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Common questions about our custom website development process.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-5">
          {faqs.map((faq, i) => <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-[#1a1227] hover:shadow-xl transition-all">
              <button className="w-full p-4 sm:p-6 md:p-8 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-semibold text-lg text-[#30294e] dark:text-white pr-6 leading-tight">{faq.q}</span>
                {openFaq === i ? <Minus className="w-6 h-6 text-[#6a49ff] flex-shrink-0" /> : <Plus className="w-6 h-6 text-[#6a49ff] flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {openFaq === i && <motion.div initial={{
              height: 0,
              opacity: 0
            }} animate={{
              height: 'auto',
              opacity: 1
            }} exit={{
              height: 0,
              opacity: 0
            }} className="overflow-hidden">
                    <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 text-gray-600 dark:text-gray-300 leading-relaxed text-base">{faq.a}</div>
                  </motion.div>}
              </AnimatePresence>
            </div>)}
        </div>
      </div>
    </div>
  </section>
    );
};