import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Users } from 'lucide-react';

const Footer = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const incrementVisitor = async () => {
      // 1. Get current count
      const { data } = await supabase.from('site_stats').select('visitors').eq('id', 1).single();
      
      if (data) {
        const newCount = data.visitors + 1;
        // 2. Update count in UI
        setCount(newCount);
        
        // 3. Update count in DB (only once per session technically, but simple increment here)
        await supabase.from('site_stats').update({ visitors: newCount }).eq('id', 1);
      }
    };
    
    incrementVisitor();
  }, []);

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Copyright */}
        <div className="text-slate-400 text-sm font-medium">
          © {new Date().getFullYear()} <span className="text-blue-400 font-bold">Abizer Saify</span>. All Rights Reserved.
        </div>

        {/* Visitor Counter */}
        <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full border border-slate-700">
          <Users size={16} className="text-green-400" />
          <span className="text-slate-400 text-sm">Visitors:</span>
          <span className="text-white font-bold font-mono">{count}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;