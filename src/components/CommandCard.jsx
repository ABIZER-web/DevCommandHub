import React, { useState, useEffect } from 'react';
import { Copy, Check, Trash2, Heart, BarChart2 } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';

const CommandCard = ({ cmd, isAdmin, onDelete, user, onLogin }) => {
  const [copied, setCopied] = useState(false);
  
  // --- LOCAL STATE FOR INSTANT UI UPDATES ---
  // We initialize these from the props (database data)
  // Default to 0 or empty array if the fields don't exist yet
  const [likeCount, setLikeCount] = useState(cmd.liked_by_users?.length || 0);
  const [copyCount, setCopyCount] = useState(cmd.copy_count || 0);
  
  // Check if the current user has already liked this command
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (user && cmd.liked_by_users?.includes(user.uid)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [user, cmd.liked_by_users]);

  // --- HANDLE COPY ---
  const handleCopy = async () => {
    if (!user) {
      if (onLogin) onLogin();
      return; 
    }

    // 1. Copy to Clipboard
    navigator.clipboard.writeText(cmd.command_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // 2. Optimistic UI Update (Instant feedback)
    setCopyCount(prev => prev + 1);

    // 3. Update Database (Increment copy_count)
    try {
      const cmdRef = doc(db, "commands", cmd.id);
      await updateDoc(cmdRef, {
        copy_count: increment(1)
      });
    } catch (error) {
      console.error("Error updating copy count:", error);
    }
  };

  // --- HANDLE LIKE ---
  const handleLike = async () => {
    if (!user) {
      if (onLogin) onLogin();
      return;
    }

    // 1. Determine action (Like vs Unlike)
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked); // Optimistic UI toggle
    setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1); // Optimistic Count update

    // 2. Update Database
    try {
      const cmdRef = doc(db, "commands", cmd.id);
      if (newIsLiked) {
        // Add user ID to array
        await updateDoc(cmdRef, {
          liked_by_users: arrayUnion(user.uid)
        });
      } else {
        // Remove user ID from array
        await updateDoc(cmdRef, {
          liked_by_users: arrayRemove(user.uid)
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert UI on error
      setIsLiked(!newIsLiked);
      setLikeCount(prev => newIsLiked ? prev - 1 : prev + 1);
    }
  };

  const getBadgeColor = (category) => {
    switch(category) {
      case 'git': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'vscode': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'cmd': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="group relative bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col h-full overflow-hidden">
      
      {/* Admin Delete Button */}
      {isAdmin && (
        <button 
          onClick={() => onDelete(cmd.id)}
          className="absolute top-3 right-3 p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-20"
          title="Delete Command"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Header: Description & Badge */}
      <div className="flex-1 mb-4">
        <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3 pr-6">
          {cmd.description}
        </p>
        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeColor(cmd.category)}`}>
          {cmd.category}
        </span>
      </div>

      {/* Code Block */}
      <div className="relative mb-3 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-slate-700 transition-colors">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        <code className="block p-3 pl-4 text-xs sm:text-sm font-mono text-blue-400 overflow-x-auto whitespace-nowrap scrollbar-hide pr-10">
          {cmd.command_text}
        </code>
        
        {/* Copy Button */}
        <button 
          onClick={handleCopy}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-all z-10"
          title={user ? "Copy to clipboard" : "Login to copy"}
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>

      {/* Footer: Stats & Actions */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800/50">
        
        {/* Copy Count Stat */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500" title="Total Copies">
          <BarChart2 size={12} />
          <span>{copyCount} copies</span>
        </div>

        {/* Like Button */}
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-2 py-1 rounded-full ${
            isLiked 
              ? 'text-pink-500 bg-pink-500/10' 
              : 'text-slate-500 hover:text-pink-400 hover:bg-slate-800'
          }`}
          title={user ? (isLiked ? "Unlike" : "Like") : "Login to like"}
        >
          <Heart size={12} className={isLiked ? "fill-current" : ""} />
          <span>{likeCount}</span>
        </button>
      </div>

    </div>
  );
};

export default CommandCard;