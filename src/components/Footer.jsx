import React, { useEffect, useState, useRef } from 'react';
import { Github, Instagram, Linkedin, Heart, Eye } from 'lucide-react';
import { supabase } from '../supabaseClient'; 

const Footer = () => {
  const [visitCount, setVisitCount] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const updateVisitorCount = async () => {
      const { data, error } = await supabase.rpc('increment_visitor_count');
      
      if (data) {
        setVisitCount(data);
      } else if (error) {
        console.error('Error fetching visitor count:', error);
      }
    };

    updateVisitorCount();
  }, []);

  return (
    <footer className="w-full bg-slate-900 border-t border-slate-700 py-8 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Copyright & Visitor Count */}
        <div className="text-slate-400 text-sm text-center md:text-left flex flex-col gap-2">
          <div>
            <p>&copy; {new Date().getFullYear()} DevCommandHub. All rights reserved.</p>
            <p className="text-xs mt-1 flex items-center justify-center md:justify-start gap-1">
              Built with <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" /> by 
              {/* ANIMATED NAME START */}
              <span className="font-bold text-slate-200 hover:text-blue-400 hover:scale-110 hover:tracking-wide transition-all duration-300 cursor-pointer inline-block ml-1">
                Abizer
              </span>
              {/* ANIMATED NAME END */}
            </p>
          </div>

          {/* VISITOR COUNT BADGE */}
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 w-fit mx-auto md:mx-0">
            <Eye size={12} className="text-blue-400" />
            <span className="text-slate-300">
              Visitors: <span className="text-white font-bold">{visitCount.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Social Links */}
        <div className="flex items-center gap-6">
          <a 
            href="https://github.com/ABIZER-web" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
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