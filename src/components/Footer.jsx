import React from 'react';
import { Github, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Copyright */}
        <div className="text-slate-500 dark:text-slate-400 text-sm text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} DevCommandHub. All rights reserved.</p>
          <p className="text-xs mt-1 flex items-center justify-center md:justify-start gap-1">
            Built with <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" /> by Developers
          </p>
        </div>

        {/* Right Side: Social Links */}
        <div className="flex items-center gap-6">
          <a 
            href="https://github.com/ABIZER-web" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors hover:scale-110 transform duration-200"
          >
            <Github size={20} />
          </a>
          
          <a 
            href="https://www.instagram.com/_a.sa1fy_?igsh=Z2x4MTgwMXU3a25l" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-pink-500 transition-colors hover:scale-110 transform duration-200"
          >
            <Instagram size={20} />
          </a>
          
          <a 
            href="https://www.linkedin.com/in/mr-abizer-saify-a3b936278" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-700 transition-colors hover:scale-110 transform duration-200"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;