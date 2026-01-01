import React, { useState, useEffect } from 'react';
import { Search, Mic, MicOff, Terminal, User, LogOut, LogIn, HelpCircle } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import AdminLogin from './AdminLogin'; 

const Navbar = ({ searchQuery, setSearchQuery, isAdmin, onLogin, onLogout, onOpenGuide }) => {
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Sync voice to search
  useEffect(() => {
    if (transcript) setSearchQuery(transcript);
  }, [transcript, setSearchQuery]);

  if (!browserSupportsSpeechRecognition) return <span>Browser error</span>;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700 py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xl hidden md:flex">
            <Terminal size={24} />
            <span>DevCommand<span className="text-white">Hub</span></span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl flex items-center bg-slate-800 rounded-full border border-slate-700 px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Search className="text-slate-400 mr-2" size={18} />
            <input 
              type="text" 
              placeholder="Search commands (English/Hindi)..." 
              className="bg-transparent border-none outline-none text-white w-full placeholder-slate-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
              className={`ml-2 p-2 rounded-full transition-all ${listening ? 'bg-red-500 animate-pulse' : 'text-slate-400 hover:text-blue-400'}`}
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>

          {/* RIGHT SIDE: Guide & Admin Panel */}
          <div className="flex items-center gap-3">
            
            {/* NEW GUIDE BUTTON */}
            <button 
              onClick={onOpenGuide}
              className="text-slate-400 hover:text-white transition-colors mr-2 hidden md:block"
              title="Help & Guide"
            >
              <HelpCircle size={24} />
            </button>

            {/* ADMIN LOGIN/LOGOUT LOGIC */}
            {isAdmin ? (
              // LOGGED IN STATE
              <div className="flex items-center gap-3 bg-slate-800 py-1.5 px-3 rounded-full border border-slate-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                  A
                </div>
                <span className="text-sm font-medium hidden sm:block">Abizer</span>
                <button 
                  onClick={onLogout} 
                  className="text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              // LOGGED OUT STATE
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
              >
                <LogIn size={16} /> <span className="hidden sm:inline">Admin Login</span>
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* LOGIN MODAL (Popup) */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl w-full max-w-sm relative animate-in zoom-in-95 duration-200">
            <AdminLogin 
              onLogin={(status) => {
                onLogin(status);
                setIsLoginOpen(false);
              }} 
              onClose={() => setIsLoginOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;