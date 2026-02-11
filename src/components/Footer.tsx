import { Code2 } from 'lucide-react';

export const Footer = () => {
    return (
        <footer id="about" className="py-20 px-6 lg:px-12 bg-[#30294e] dark:bg-[#0f0a1f] text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6a49ff] to-[#5839e6] rounded-lg flex items-center justify-center">
                  <Code2 className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl">WebDirect</span>
              </div>
              <p className="text-gray-300 dark:text-gray-400 leading-relaxed max-w-md">
                Custom coded websites built with React & Next.js. Professional, fast, and tailored to your business.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <div className="space-y-3 text-gray-300 dark:text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">
                  About
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Services
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Process
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Legal & Privacy</h3>
              <div className="space-y-3 text-gray-300 dark:text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} WebDirect. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <span>Based in the Netherlands</span>
            </div>
          </div>
        </div>
      </footer>
    );
};