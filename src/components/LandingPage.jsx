import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, GitBranch, Code, Command, ArrowRight, Github } from 'lucide-react';

const LandingPage = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex flex-col relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar Placeholder */}
      <nav className="p-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-400">
          <Terminal size={24} />
          <span>DevCommand<span className="text-white">Hub</span></span>
        </div>
        {/* Removed "Open Dashboard" button to keep focus on hero section */}
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 mt-10 md:mt-0">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 bg-slate-900/50 border border-slate-700/50 rounded-full px-3 py-1 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-mono text-slate-400">System Online v2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Master the <br /> Command Line.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate cheat sheet for developers. Access Git, VS Code, and Terminal commands instantly. Built for speed, designed for clarity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* OPTION 1: Go to Dashboard (No Login) */}
            <button 
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* OPTION 2: Login with GitHub directly */}
            <button 
              onClick={onLogin}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition-all flex items-center gap-2 border border-slate-700 hover:border-slate-500"
            >
              <Github size={20} /> Connect GitHub
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full"
        >
          <FeatureCard icon={<GitBranch size={32} className="text-orange-500" />} title="Git Commands" desc="Version control mastery at your fingertips. Commit, push, and merge with confidence." />
          <FeatureCard icon={<Code size={32} className="text-blue-500" />} title="VS Code Shortcuts" desc="Speed up your coding workflow. Learn the hotkeys that pros use every day." />
          <FeatureCard icon={<Command size={32} className="text-slate-300" />} title="Terminal Power" desc="Navigate your system like a hacker. Essential CMD and Shell commands included." />
        </motion.div>
      </main>

      {/* Footer Strip */}
      <footer className="w-full py-6 text-center text-slate-600 text-sm relative z-10">
        <p>&copy; {new Date().getFullYear()} DevCommandHub. Built by Abizer.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-600 transition-colors text-left backdrop-blur-sm group">
    <div className="mb-4 bg-slate-950 w-fit p-3 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{desc}</p>
  </div>
);

export default LandingPage;