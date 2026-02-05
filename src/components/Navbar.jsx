import React, { useState, useEffect } from 'react';
import { Search, Mic, MicOff, Terminal, LogOut, Github, HelpCircle, Plus, Menu, X } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { auth } from '../firebase'; 
import { signOut } from 'firebase/auth'; 
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ 
  searchQuery, 
  setSearchQuery, 
  user,        
  isAdmin,     
  onOpenGuide, 
  onLogoClick, 
  onOpenSubmit, 
  onOpenAdmin,
  pendingCount = 0,
  onLogin      
}) => {
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    await signOut(auth);
    setIsMobileMenuOpen(false);
    window.location.reload(); 
  };

  // --- TYPING ANIMATION ---
  const [placeholder, setPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const phrases = ["Search commands...", "Try 'git commit'...", "Try 'VS Code keys'...", "How to undo?...", "npm install..."];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];
      setPlaceholder(isDeleting ? fullText.substring(0, placeholder.length - 1) : fullText.substring(0, placeholder.length + 1));
      if (isDeleting) setTypingSpeed(50); else setTypingSpeed(150);
      if (!isDeleting && placeholder === fullText) { setTimeout(() => setIsDeleting(true), 2000); return; } 
      else if (isDeleting && placeholder === '') { setIsDeleting(false); setLoopNum(loopNum + 1); setTypingSpeed(500); }
    };
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, loopNum, typingSpeed]);

  useEffect(() => { if (transcript) setSearchQuery(transcript); }, [transcript, setSearchQuery]);

  if (!browserSupportsSpeechRecognition) return <span>Browser error</span>;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700 shadow-lg w-full">
      <div className="w-full px-4 md:px-8 py-3 flex items-center justify-between gap-3">
        
        {/* --- LEFT: LOGO --- */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); if (onLogoClick) onLogoClick(); setIsMobileMenuOpen(false); }} 
          className="flex items-center gap-1.5 text-blue-400 font-bold text-sm md:text-base shrink-0 hover:opacity-80 transition-opacity"
        >
          <Terminal size={20} className="md:w-5 md:h-5" />
          
          {/* Mobile: Shows "DCH" */}
          <span className="md:hidden">DCH</span>
          
          {/* Laptop: Shows "DevCommandHub" */}
          <span className="hidden md:inline">DevCommand<span className="text-white">Hub</span></span>
        </a>

        {/* --- CENTER: SEARCH BAR --- */}
        <div className="flex-1 max-w-2xl flex items-center bg-slate-800 rounded-full border border-slate-700 px-3 py-1.5 md:px-4 md:py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all mx-2">
          <Search className="text-slate-400 mr-2 shrink-0 hidden sm:block" size={16} />
          <input 
            type="text" 
            placeholder={placeholder} 
            className="bg-transparent border-none outline-none text-white w-full placeholder-slate-500 min-w-0 text-xs md:text-sm" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening} className={`ml-1 md:ml-2 p-1.5 rounded-full transition-all shrink-0 ${listening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-blue-500'}`}>
            {listening ? <MicOff size={14} /> : <Mic size={14} /> }
          </button>
        </div>

        {/* --- RIGHT: DESKTOP MENU (Hidden on Mobile) --- */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          
          {/* Laptop: Submit Button (ICON ONLY) */}
          <button 
            onClick={onOpenSubmit} 
            className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full border border-slate-700 transition-all"
            title="Submit New Command"
          >
            <Plus size={20} />
          </button>
          
          <button onClick={onOpenGuide} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full" title="Help / Guide">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Desktop Auth Section */}
          {user ? (
            <div className="flex items-center gap-3 bg-slate-800/50 py-1 px-3 rounded-xl border border-slate-700 relative ml-1">
              {isAdmin && pendingCount > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold animate-bounce shadow-sm border border-slate-900 pointer-events-none z-10">{pendingCount}</span>}
              
              <div 
                className={`flex items-center gap-2 ${isAdmin ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={isAdmin ? onOpenAdmin : undefined}
                title={isAdmin ? "Open Admin Dashboard" : user.displayName}
              >
                {/* Avatar */}
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-600 shadow-sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold border border-blue-500">
                    {(user.reloadUserInfo?.screenName || user.email)?.[0]?.toUpperCase()}
                  </div>
                )}
                
                {/* User Details (Laptop View) */}
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-tight">
                      {user.reloadUserInfo?.screenName ? `@${user.reloadUserInfo.screenName}` : (user.displayName?.split(' ')[0] || "User")}
                    </span>
                    {isAdmin && <span className="text-[9px] text-blue-400 font-mono tracking-wide">Admin</span>}
                </div>
              </div>

              <div className="w-px h-5 bg-slate-700"></div>
              
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={onLogin} className="flex items-center gap-2 bg-[#24292e] hover:bg-[#2f363d] text-white px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 shadow-sm transition-all">
              <Github size={14} /> Login
            </button>
          )}
        </div>

        {/* --- RIGHT: MOBILE TOGGLE (Visible on Mobile) --- */}
        <motion.button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
          animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isAdmin && pendingCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce"></span>}
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-slate-900 border-b border-slate-800 shadow-xl"
          >
            <div className="p-4 flex flex-col gap-2">
              
              {/* Profile Section (Mobile) */}
              {user ? (
                <div className="bg-slate-800/50 rounded-xl p-3 flex items-center justify-between mb-2 border border-slate-700">
                  <div className="flex items-center gap-3" onClick={isAdmin ? () => { onOpenAdmin(); setIsMobileMenuOpen(false); } : undefined}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-slate-600" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                        {(user.reloadUserInfo?.screenName || user.email)?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white leading-tight">
                        {user.reloadUserInfo?.screenName ? `@${user.reloadUserInfo.screenName}` : (user.displayName || "User")}
                      </span>
                      {isAdmin && <span className="text-[10px] text-blue-400 font-mono mt-0.5">Admin</span>}
                    </div>
                  </div>
                  <button onClick={handleLogout} className="p-2 bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg"><LogOut size={18} /></button>
                </div>
              ) : (
                 <button onClick={() => { onLogin(); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 bg-[#24292e] text-white p-3 rounded-xl font-bold mb-2 border border-slate-700">
                  <Github size={18} /> Login with GitHub
                </button>
              )}

              {/* Action Buttons */}
              <button onClick={() => { onOpenSubmit(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Plus size={18} /></div>
                <span className="font-medium">Submit New Command</span>
              </button>

              <button onClick={() => { onOpenGuide(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><HelpCircle size={18} /></div>
                <span className="font-medium">Guide & FAQ</span>
              </button>

              {isAdmin && (
                <button onClick={() => { onOpenAdmin(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                   <div className="p-2 bg-red-500/10 text-red-500 rounded-lg relative">
                     <Terminal size={18} />
                     {pendingCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                   </div>
                   <div className="flex flex-col items-start">
                     <span className="font-medium">Admin Dashboard</span>
                     {pendingCount > 0 && <span className="text-[10px] text-red-400">{pendingCount} pending approvals</span>}
                   </div>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;