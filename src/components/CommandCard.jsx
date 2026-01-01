import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

const CommandCard = ({ cmd, isAdmin, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd.command_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-full">
      
      {/* Header: Description & Badge */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <h3 className="text-slate-300 font-medium text-lg leading-snug break-words flex-1">
          {cmd.description}
        </h3>
        
        {/* ADMIN DELETE BUTTON (Only visible if logged in) */}
        {isAdmin && (
          <button 
            onClick={() => onDelete(cmd.id)}
            className="text-slate-600 hover:text-red-500 transition-colors p-1"
            title="Delete Command"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      {/* Badge & Code Block Container */}
      <div className="mt-auto space-y-2">
        <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
          cmd.category === 'git' ? 'bg-orange-900/30 text-orange-400' :
          cmd.category === 'vscode' ? 'bg-blue-900/30 text-blue-400' :
          'bg-gray-800 text-gray-400'
        }`}>
          {cmd.category}
        </span>

        <div className="relative bg-black/50 p-3 rounded-lg border border-transparent group-hover:border-slate-700 transition-colors">
          <code className="text-green-400 font-mono text-sm break-all block pr-8">
            {cmd.command_text}
          </code>
          
          {/* Copy Button */}
          <button 
            onClick={handleCopy}
            className="absolute right-2 top-2 p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
            title="Copy to clipboard"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandCard;