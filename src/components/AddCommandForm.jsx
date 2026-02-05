import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { Plus, Loader2, X, Send } from 'lucide-react';

const AddCommandForm = ({ isOpen, onClose, onCommandAdded }) => {
  const [formData, setFormData] = useState({
    category: 'git',
    command_text: '',
    description: '',
    search_tags: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "commands"), {
        ...formData,
        status: "pending", // <--- IMPORTANT: Mark as pending
        created_at: serverTimestamp()
      });

      setFormData({ category: 'git', command_text: '', description: '', search_tags: '' });
      alert("✅ Command submitted for approval! It will appear once the Admin reviews it.");
      if (onCommandAdded) onCommandAdded();
      onClose(); // Close modal after submit
    } catch (error) {
      console.error('Error adding command:', error);
      alert('Error adding command');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Send className="text-green-500" size={20} /> Submit New Command
        </h3>
        
        <p className="text-slate-400 text-sm mb-4">
          Share a useful command in any language. The Admin will review it before it goes live.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 text-sm outline-none focus:border-blue-500 transition-colors"
            >
              <option value="git">Git</option>
              <option value="vscode">VS Code</option>
              <option value="cmd">CMD / Terminal</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Command Code</label>
            <input 
              type="text" 
              required
              value={formData.command_text}
              onChange={(e) => setFormData({...formData, command_text: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 text-sm font-mono outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g. git commit -m"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 text-sm outline-none focus:border-blue-500 transition-colors resize-none h-24"
              placeholder="What does this command do?"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Tags (Optional)</label>
            <input 
              type="text" 
              value={formData.search_tags}
              onChange={(e) => setFormData({...formData, search_tags: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 text-sm outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g. save, stage, version"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
            Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCommandForm;