import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageCircle, Loader2 } from 'lucide-react';
import { chatData } from "../data/ChatbotData";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Refs
  const chatEndRef = useRef(null);   
  const containerRef = useRef(null); 

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [response, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleAskBot = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    setTimeout(() => {
      const userQuery = prompt.toLowerCase();
      const match = chatData.find(item => 
        item.keywords.some(keyword => userQuery.includes(keyword))
      );

      if (match) {
        setResponse(match.answer);
      } else {
        setResponse("I don't have an answer for that yet. 🤖\n\nPlease try searching on Google, ChatGPT, or Gemini.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div ref={containerRef} className="fixed bottom-8 right-4 z-[60] flex flex-col items-end gap-3">
      
      {/* 1. DEFINE CUSTOM FLOAT ANIMATION */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); } /* Moves up 10px */
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="w-[85vw] sm:w-[350px] h-[500px] max-h-[70vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-bold text-sm">DevHelper Bot</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-950/50 scrollbar-thin scrollbar-thumb-slate-700 min-h-0">
            {!response && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm text-center gap-2">
                <Bot size={40} className="text-slate-700" />
                <p>Hi! Ask me about Git, VS Code,<br/>or website help.</p>
              </div>
            )}

            {response && (
              <div className="bg-slate-800 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-sm text-slate-200 border-l-4 border-purple-500 whitespace-pre-wrap animate-in zoom-in-95">
                {response}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-2">
                <Loader2 className="animate-spin" size={14} /> Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleAskBot} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2 shrink-0">
            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type question..." 
              className="flex-1 bg-slate-950 text-white text-sm rounded-full border border-slate-700 px-4 py-2 outline-none focus:border-purple-500 transition-colors"
            />
            <button 
              type="submit" 
              disabled={loading || !prompt}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white p-2 rounded-full transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING TOGGLE BUTTON */}
      {/* 2. Added 'animate-float' class only when NOT open */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 sm:p-4 rounded-full shadow-lg shadow-purple-900/50 transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'bg-slate-700 text-white rotate-90' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white animate-float'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

    </div>
  );
};

export default AIChat;