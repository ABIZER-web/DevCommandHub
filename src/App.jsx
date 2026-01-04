import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import CommandCard from './components/CommandCard';
import AddCommandForm from './components/AddCommandForm';
import AIChat from './components/AIChat';
import Footer from './components/Footer';
import Guide from './components/Guide';
import { GitBranch, Code, Terminal, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('git');
  const [commands, setCommands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const itemsPerPage = 12; 

  // --- FORCE DARK MODE PERMANENTLY ---
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // --- FORCE SCROLL TOP ---
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 50 } 
    }
  };

  const handleLogoClick = () => {
    setActiveTab('git');     
    setSearchQuery('');      
    setCurrentPage(1);       
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const fetchCommands = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('commands').select('*').order('created_at', { ascending: false });
    if (!error) setCommands(data || []);
    setIsLoading(false);
  };

  const handleDeleteCommand = async (id) => {
    if (!window.confirm("Delete this command?")) return;
    const { error } = await supabase.from('commands').delete().eq('id', id);
    if (!error) setCommands(prev => prev.filter(cmd => cmd.id !== id));
  };

  useEffect(() => { fetchCommands(); }, []);
  
  // Reset page when switching tabs or searching
  useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery]);

  const filteredCommands = commands.filter(cmd => 
    cmd.category === activeTab && 
    (cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
     cmd.command_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
     cmd.search_tags?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommands = filteredCommands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCommands.length / itemsPerPage);

  const tabs = [
    { id: 'git', icon: GitBranch, label: 'Git' },
    { id: 'vscode', icon: Code, label: 'VS Code' },
    { id: 'cmd', icon: Terminal, label: 'CMD' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex flex-col overflow-x-hidden">
      
      {/* NAVBAR */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.6, type: "spring" }}
        className="sticky top-0 z-50 w-full"
      >
        <Navbar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          isAdmin={isAdmin} onLogin={setIsAdmin} onLogout={() => setIsAdmin(false)}
          onOpenGuide={() => setIsGuideOpen(true)}
          onLogoClick={handleLogoClick}
        />
      </motion.div>

      <main className="w-full px-4 md:px-8 py-6 flex flex-col lg:flex-row gap-8 flex-1">
        
        <div className="flex-1 min-w-0">
          
          {/* TABS */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-2 md:gap-4 mb-8 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shadow-inner max-w-3xl relative"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 py-3 text-sm md:text-base font-semibold uppercase tracking-wide transition-colors duration-200 outline-none"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-blue-600 rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 flex items-center justify-center gap-2 ${
                  activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}>
                  <tab.icon size={18} />
                  {tab.label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* CONTENT AREA */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-blue-400 gap-3">
                <Loader2 size={40} className="animate-spin" />
                <p className="text-slate-500 text-sm animate-pulse">Loading commands...</p>
              </div>
            ) : (
              <AnimatePresence mode='wait'>
                <motion.div 
                  // --- FIX IS HERE: ADDED 'searchQuery' TO KEY ---
                  // This forces the grid to completely refresh when you type
                  key={activeTab + currentPage + searchQuery}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 mb-8 content-start"
                >
                  {currentCommands.length > 0 ? (
                    currentCommands.map((cmd) => (
                      <motion.div key={cmd.id} variants={itemVariants}>
                        <CommandCard cmd={cmd} isAdmin={isAdmin} onDelete={handleDeleteCommand} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div variants={itemVariants} className="col-span-full flex flex-col items-center justify-center text-slate-500 py-20 border-2 border-dashed border-slate-800 rounded-xl">
                      <p>No commands found.</p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5 }}
              className="flex justify-center items-center gap-4 mt-auto"
            >
              <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                disabled={currentPage === 1} 
                className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 shadow-sm transition-colors text-white"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="text-slate-400 text-sm">
                Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                disabled={currentPage === totalPages} 
                className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 shadow-sm transition-colors text-white"
              >
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </div>

        {isAdmin && (
          <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0 border-l border-slate-800 pl-6">
             <AddCommandForm onCommandAdded={fetchCommands} />
          </aside>
        )}

      </main>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Footer />
      </motion.div>
      
      <AIChat /> 
      <Guide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

    </div>
  );
}

export default App;