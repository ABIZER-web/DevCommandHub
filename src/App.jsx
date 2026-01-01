import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Components
import Navbar from './components/Navbar';
import CommandCard from './components/CommandCard';
import AddCommandForm from './components/AddCommandForm';
import AIChat from './components/AIChat';
import Footer from './components/Footer'; // <--- NEW
import Guide from './components/Guide';   // <--- NEW

// Icons
import { GitBranch, Code, Terminal, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('git');
  const [commands, setCommands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);

  // Guide Modal State
  const [isGuideOpen, setIsGuideOpen] = useState(false); // <--- NEW

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- FETCHING ---
  const fetchCommands = async () => {
    const { data, error } = await supabase
      .from('commands')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) console.error('Error:', error);
    else setCommands(data || []);
  };

  // --- DELETE FUNCTION ---
  const handleDeleteCommand = async (id) => {
    if (!window.confirm("Are you sure you want to delete this command permanently?")) return;

    const { error } = await supabase
      .from('commands')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting command!");
      console.error(error);
    } else {
      setCommands(prev => prev.filter(cmd => cmd.id !== id));
    }
  };

  useEffect(() => {
    fetchCommands();
  }, []);

  useEffect(() => {
    setCurrentPage(1); 
  }, [activeTab, searchQuery]);

  // --- FILTERING ---
  const filteredCommands = commands.filter(cmd => 
    cmd.category === activeTab && 
    (
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cmd.command_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.search_tags?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // --- PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommands = filteredCommands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCommands.length / itemsPerPage);

  return (
    // Added flex-col to ensure footer stays at bottom
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* 1. Navbar with Guide Prop */}
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        isAdmin={isAdmin}
        onLogin={setIsAdmin}
        onLogout={() => setIsAdmin(false)}
        onOpenGuide={() => setIsGuideOpen(true)} // <--- Pass function here
      />

      {/* Main Content (flex-1 pushes footer down) */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-8 flex-1 w-full">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="flex-1">
          
          {/* Tabs */}
          <div className="flex gap-2 md:gap-4 mb-8 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shadow-inner">
            {[
              { id: 'git', icon: GitBranch, label: 'Git' },
              { id: 'vscode', icon: Code, label: 'VS Code' },
              { id: 'cmd', icon: Terminal, label: 'CMD' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                <span className="uppercase tracking-wide text-sm md:text-base">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 min-h-[400px] content-start">
            {currentCommands.length > 0 ? (
              currentCommands.map((cmd) => (
                <CommandCard 
                  key={cmd.id} 
                  cmd={cmd} 
                  isAdmin={isAdmin} 
                  onDelete={handleDeleteCommand} 
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-slate-500 h-full border-2 border-dashed border-slate-800 rounded-xl">
                <p>No commands found for this search.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="text-slate-400 text-sm">
                Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
              </span>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: Tools */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          {isAdmin && (
             <AddCommandForm onCommandAdded={fetchCommands} />
          )}
          <AIChat />
        </aside>

      </main>


          {/* 3. Guide Modal (Hidden by default) */}
      <Guide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* 2. Footer Component */}
      <Footer />

      

    </div>
  );
}

export default App;