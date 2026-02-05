import React, { useState, useEffect, useRef } from 'react';
import { db, auth, provider } from './firebase'; 
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'; 
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth'; 

import Navbar from './components/Navbar';
import CommandCard from './components/CommandCard';
import AddCommandForm from './components/AddCommandForm';
import AdminDashboard from './components/AdminDashboard'; 
import AIChat from './components/AIChat';
import Footer from './components/Footer';
import Guide from './components/Guide';
import LoadingScreen from './components/LoadingScreen'; 
import LandingPage from './components/LandingPage';     

import { GitBranch, Code, Terminal, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION: ADMIN ACCESS ---
// 1. Add your Email
const ADMIN_EMAILS = ["abizersaify@gmail.com"]; 
// 2. Add your GitHub Username (Case Sensitive!)
const ADMIN_USERNAMES = ["ABIZER-web", "abizer-web"]; 

function App() {
  // --- APP FLOW STATE ---
  const [showLoading, setShowLoading] = useState(true); 
  const [showLanding, setShowLanding] = useState(window.location.pathname !== '/dashboard');

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [activeTab, setActiveTab] = useState('git');
  const [commands, setCommands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0); 
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const itemsPerPage = 12; 

  // --- DYNAMIC TITLE ---
  useEffect(() => {
    if (showLanding) {
      document.title = "DevCommandHub";
    } else {
      document.title = "DevCommandHub / Dashboard";
    }
  }, [showLanding]);

  // --- NAVIGATION LOGIC ---
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/dashboard') {
        setShowLanding(false);
      } else {
        setShowLanding(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const enterDashboard = () => {
    if (window.location.pathname !== '/dashboard') {
      window.history.pushState({}, '', '/dashboard');
    }
    setShowLanding(false);
  };

  // --- CENTRAL LOGIN FUNCTION ---
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // Once logged in, enter dashboard
      enterDashboard();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check console.");
    }
  };

  // --- AUTHENTICATION LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // CHECK 1: Is email in the allowed list?
        const isEmailAdmin = ADMIN_EMAILS.includes(currentUser.email);
        
        // CHECK 2: Is GitHub username in the allowed list?
        const githubUsername = currentUser.reloadUserInfo?.screenName;
        const isUserAdmin = ADMIN_USERNAMES.includes(githubUsername);

        if (isEmailAdmin || isUserAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- INITIALIZATION ---
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);
  useEffect(() => { 
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0); 
  }, []);

  // --- FETCH COMMANDS ---
  const fetchCommands = async () => {
    setIsLoadingData(true);
    try {
      const commandsRef = collection(db, "commands");
      const q = query(commandsRef, orderBy("created_at", "desc")); 
      const querySnapshot = await getDocs(q);
      const allData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const approved = allData.filter(c => c.status === 'approved' || !c.status);
      const pending = allData.filter(c => c.status === 'pending');

      setCommands(approved); 
      setPendingCount(pending.length);
    } catch (error) { 
      console.error("Error fetching commands:", error); 
    }
    setIsLoadingData(false);
  };

  const handleDeleteCommand = async (id) => {
    if (!window.confirm("Delete this command permanently?")) return;
    try { 
      await deleteDoc(doc(db, "commands", id)); 
      setCommands(prev => prev.filter(cmd => cmd.id !== id)); 
    } catch (error) { 
      console.error("Error deleting:", error); 
      alert("Failed to delete."); 
    }
  };

  useEffect(() => { fetchCommands(); }, []);
  useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery]);

  // --- FILTER LOGIC ---
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

  const tabs = [ { id: 'git', icon: GitBranch, label: 'Git' }, { id: 'vscode', icon: Code, label: 'VS Code' }, { id: 'cmd', icon: Terminal, label: 'CMD' } ];
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }, exit: { opacity: 0, y: -20, transition: { duration: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } } };
  const handleLogoClick = () => { setActiveTab('git'); setSearchQuery(''); setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); };


  // --- RENDER FLOW ---
  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  if (showLanding) {
    return <LandingPage 
      onGetStarted={enterDashboard} 
      onLogin={handleLogin}  
    />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex flex-col overflow-x-hidden">
      
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, type: "spring" }} className="sticky top-0 z-50 w-full">
        <Navbar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          user={user} 
          isAdmin={isAdmin} 
          onOpenGuide={() => setIsGuideOpen(true)}
          onLogoClick={handleLogoClick}
          
          // UPDATED: Check user before opening submit form
          onOpenSubmit={() => user ? setIsSubmitOpen(true) : handleLogin()} 
          onLogin={handleLogin} // Pass login function to Navbar
          
          onOpenAdmin={() => setIsAdminDashboardOpen(true)} 
          pendingCount={pendingCount} 
        />
      </motion.div>

      <main className="w-full px-4 md:px-8 py-6 flex flex-col gap-8 flex-1">
        <div className="flex-1 min-w-0">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex gap-2 md:gap-4 mb-8 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shadow-inner max-w-3xl relative">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative flex-1 py-3 text-sm md:text-base font-semibold uppercase tracking-wide transition-colors duration-200 outline-none">
                {activeTab === tab.id && ( <motion.div layoutId="active-pill" className="absolute inset-0 bg-blue-600 rounded-lg shadow-sm" transition={{ type: "spring", stiffness: 300, damping: 30 }} /> )}
                <span className={`relative z-10 flex items-center justify-center gap-2 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <tab.icon size={18} /> {tab.label}
                </span>
              </button>
            ))}
          </motion.div>

          <div className="min-h-[400px]">
            {isLoadingData ? (
              <div className="flex flex-col items-center justify-center h-64 text-blue-400 gap-3"><Loader2 size={40} className="animate-spin" /><p className="text-slate-500 text-sm animate-pulse">Loading commands...</p></div>
            ) : (
              <AnimatePresence mode='wait'>
                <motion.div key={activeTab + currentPage + searchQuery} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 mb-8 content-start">
                  {currentCommands.length > 0 ? (
                    currentCommands.map((cmd) => (
                      <motion.div key={cmd.id} variants={itemVariants}>
                        <CommandCard 
                          cmd={cmd} 
                          isAdmin={isAdmin} 
                          onDelete={handleDeleteCommand}
                          user={user}            // PASS USER
                          onLogin={handleLogin}  // PASS LOGIN FUNCTION
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div variants={itemVariants} className="col-span-full flex flex-col items-center justify-center text-slate-500 py-20 border-2 border-dashed border-slate-800 rounded-xl"><p>No commands found.</p></motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

           {!isLoadingData && totalPages > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center items-center gap-4 mt-auto">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 shadow-sm transition-colors text-white"><ChevronLeft size={20} /></button>
              <span className="text-slate-400 text-sm">Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 shadow-sm transition-colors text-white"><ChevronRight size={20} /></button>
            </motion.div>
          )}
        </div>
      </main>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}><Footer /></motion.div>
      <AIChat /> 
      <Guide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      
      <AddCommandForm isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} onCommandAdded={() => { alert("Thank you! Your command is pending approval."); }} />
      
      <AdminDashboard 
        isOpen={isAdminDashboardOpen} 
        onClose={() => setIsAdminDashboardOpen(false)} 
        onDataChange={fetchCommands} 
      />
    </div>
  );
}

export default App;