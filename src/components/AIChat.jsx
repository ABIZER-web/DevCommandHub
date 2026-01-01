import React, { useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { chatData } from '../data/ChatbotData'; // <--- Import the data

const AIChat = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAskBot = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    // Simulate a small delay to feel like a "bot"
    setTimeout(() => {
      const userQuery = prompt.toLowerCase();
      
      // 1. SEARCH LOGIC
      // We look for an item where at least one keyword matches the user's input
      const match = chatData.find(item => 
        item.keywords.some(keyword => userQuery.includes(keyword))
      );

      // 2. SET RESPONSE
      if (match) {
        setResponse(match.answer);
      } else {
        // Fallback for unknown questions
        setResponse("I don't have an answer for that yet. 🤖\n\nPlease try searching on Google, ChatGPT, or Gemini.");
      }
      
      setLoading(false);
    }, 600); // 600ms delay for realism
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden h-[500px] sticky top-24">
      {/* Chat Header */}
      <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-2">
        <Bot className="text-blue-400" />
        <h2 className="font-bold text-white">DevHelper Bot</h2>
      </div>

      {/* Chat Output Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {!response && !loading && (
          <div className="text-slate-500 text-sm text-center mt-10">
            Ask me things like:<br/>
            "How to commit?"<br/>
            "VS Code format shortcut"<br/>
            "How to add a command?"
          </div>
        )}

        {/* Bot Response */}
        {response && (
          <div className="bg-slate-800 p-3 rounded-lg text-sm text-slate-200 leading-relaxed animate-in fade-in slide-in-from-bottom-2 whitespace-pre-wrap border-l-4 border-blue-500">
            {response}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-slate-500 py-4">
            <Loader2 className="animate-spin" size={18} />
            <span className="text-xs">Finding answer...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleAskBot} className="p-3 bg-slate-800/30 border-t border-slate-700 flex gap-2">
        <input 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question..." 
          className="flex-1 bg-slate-950 text-white text-sm rounded-lg border border-slate-700 px-3 py-2 outline-none focus:border-blue-500 transition-colors"
        />
        <button 
          type="submit" 
          disabled={loading || !prompt}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default AIChat;