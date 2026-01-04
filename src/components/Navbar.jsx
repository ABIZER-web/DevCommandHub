import React, { useState, useEffect } from 'react';
import { Search, Mic, MicOff, Terminal, LogOut, LogIn, HelpCircle } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import AdminLogin from './AdminLogin'; 

const Navbar = ({ searchQuery, setSearchQuery, isAdmin, onLogin, onLogout, onOpenGuide, onLogoClick }) => {
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // --- TYPING ANIMATION STATE ---
  const [placeholder, setPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = [
    "Search commands...", 
    "Try 'git commit'...", 
    "Try 'VS Code shortcuts'...", 
    "How to undo merge?...",
    "Search 'npm install'..."
  ];

  // --- TYPING ANIMATION LOGIC ---
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setPlaceholder(isDeleting 
        ? fullText.substring(0, placeholder.length - 1) 
        : fullText.substring(0, placeholder.length + 1)
      );

      // Speed adjustments
      if (isDeleting) {
        setTypingSpeed(50); // Faster deleting
      } else {
        setTypingSpeed(150); // Normal typing
      }

      // Check if word is complete
      if (!isDeleting && placeholder === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end before deleting
        return; 
      } else if (isDeleting && placeholder === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1); // Move to next phrase
        setTypingSpeed(500); // Pause before typing new word
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, loopNum, typingSpeed]);

  // --- SPEECH RECOGNITION ---
  useEffect(() => {
    if (transcript) setSearchQuery(transcript);
  }, [transcript, setSearchQuery]);

  if (!browserSupportsSpeechRecognition) return <span>Browser error</span>;

  return (
    <>
      {/* 1. STYLES HARDCODED TO DARK MODE (Slate-900, White Text) */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700 py-3 px-4 md:px-8 shadow-lg w-full">
        <div className="w-full flex items-center justify-between gap-2 md:gap-4">
          
          {/* LOGO */}
          <a 
            href="/" 
            onClick={(e) => {
               e.preventDefault(); 
               if (onLogoClick) onLogoClick(); 
            }}
            className="flex items-center gap-1 md:gap-1.5 text-blue-400 font-bold text-sm md:text-base shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
            title="Reset Dashboard"
          >
            <Terminal size={16} className="md:w-5 md:h-5" />
            <span>DevCommand<span className="text-white">Hub</span></span>
          </a>

          {/* SEARCH BAR */}
          <div className="flex-1 max-w-3xl flex items-center bg-slate-800 rounded-full border border-slate-700 px-3 py-1.5 md:px-4 md:py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all ml-2 md:ml-4">
            <Search className="text-slate-400 mr-2 shrink-0 hidden sm:block" size={16} />
            <input 
              type="text" 
              placeholder={placeholder} 
              className="bg-transparent border-none outline-none text-white w-full placeholder-slate-500 min-w-0 text-xs md:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
              className={`ml-1 md:ml-2 p-1.5 rounded-full transition-all shrink-0 ${listening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-blue-500'}`}
            >
              {listening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          </div>

          {/* RIGHT SIDE BUTTONS */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            
            {/* 2. REMOVED TOGGLE BUTTON HERE */}

            <button 
              onClick={onOpenGuide}
              className="text-slate-400 hover:text-white transition-colors p-1.5 md:p-2 hover:bg-slate-800 rounded-full"
              title="Help & Guide"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2 bg-slate-800 py-1 px-2 md:py-1.5 md:px-3 rounded-full border border-slate-700">
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md text-[10px] md:text-xs">
                  A
                </div>
                <button onClick={onLogout} className="text-slate-400 hover:text-red-500">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg text-xs font-medium whitespace-nowrap shadow-md hover:shadow-lg transition-all"
              >
                <LogIn className="w-3.5 h-3.5" /> 
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ADMIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm relative animate-in zoom-in-95 shadow-2xl">
            <AdminLogin 
              onLogin={(status) => { onLogin(status); setIsLoginOpen(false); }} 
              onClose={() => setIsLoginOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;