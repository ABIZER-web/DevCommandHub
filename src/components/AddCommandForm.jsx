import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Save, X } from 'lucide-react';

const AddCommandForm = ({ onCommandAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 1. Updated State to include search_tags
  const [formData, setFormData] = useState({
    category: 'git',
    description: '',
    command_text: '',
    search_tags: '' // <--- New Field
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('commands')
      .insert([formData]);

    if (error) {
      alert('Error adding command!');
      console.error(error);
    } else {
      // Success - Reset all fields including search_tags
      setFormData({ category: 'git', description: '', command_text: '', search_tags: '' });
      setIsOpen(false);
      if (onCommandAdded) onCommandAdded(); // Refresh parent list
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 mb-6"
      >
        <Plus size={20} /> Add New Command
      </button>
    );
  }

  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 mb-6 animate-in fade-in zoom-in-95">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white">New Command</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Category</label>
          <select 
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="git">Git</option>
            <option value="vscode">VS Code</option>
            <option value="cmd">CMD</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Description (English)</label>
          <input 
            required
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none placeholder-slate-600"
            placeholder="e.g. Undo last commit"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Command Code</label>
          <input 
            required
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-green-400 font-mono focus:border-blue-500 outline-none placeholder-slate-600"
            placeholder="e.g. git reset --soft HEAD~1"
            value={formData.command_text}
            onChange={(e) => setFormData({...formData, command_text: e.target.value})}
          />
        </div>

        {/* New Field for Hidden Search Tags */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Hidden Search Tags (Hindi/Urdu)</label>
          <input 
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none placeholder-slate-600"
            placeholder="e.g. Naye project shuru karna"
            value={formData.search_tags}
            onChange={(e) => setFormData({...formData, search_tags: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : <><Save size={16} /> Save Command</>}
        </button>
      </form>
    </div>
  );
};

export default AddCommandForm;