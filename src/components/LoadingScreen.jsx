import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const LoadingScreen = ({ onComplete }) => {
  const [text, setText] = useState('');
  
  // Define the text segments
  const part1 = "Initializing DevCommandHub...";
  const part2 = "System Ready.";
  
  // Combine them for the typing interval logic
  const fullText = part1 + part2;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) onComplete(); 
        }, 800); 
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Calculate which parts of text to show based on current progress
  const textPart1 = text.substring(0, part1.length);
  const textPart2 = text.substring(part1.length);

  // Determine where the cursor should be
  // If we haven't finished typing Part 1, cursor is on Line 1.
  // If we have started Part 2, cursor moves to Line 2.
  const cursorOnLine1 = text.length <= part1.length;
  const cursorOnLine2 = text.length > part1.length;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center text-white font-mono">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 relative"
      >
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
        <Terminal size={64} className="text-blue-500 relative z-10" />
      </motion.div>
      
      {/* Container with min-height to prevent jumping */}
      <div className="min-h-[60px] text-center px-4 leading-relaxed">
        <span className="text-lg md:text-xl font-bold text-slate-300">
          
          {/* --- LINE 1 --- */}
          <span>
            {textPart1}
            {cursorOnLine1 && (
              <span className="animate-pulse text-blue-500 ml-1 relative -top-1">_</span>
            )}
          </span>
          
          {/* --- LINE 2 (Responsive) --- */}
          {/* Mobile: block (new line). Laptop: inline + margin */}
          <span className="block sm:inline sm:ml-3">
            {textPart2}
            {cursorOnLine2 && (
              <span className="animate-pulse text-blue-500 ml-1 relative -top-1">_</span>
            )}
          </span>

        </span>
      </div>

      <div className="mt-8 w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;