import React, { useState, useRef } from 'react';
import { X, HelpCircle, MessageSquare, Send, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Guide = ({ isOpen, onClose }) => {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    // Replace these IDs with your actual EmailJS Service/Template IDs
    // Sign up at https://www.emailjs.com/ to get them for free.
    emailjs.sendForm('service_stannln', 'template_1oi04sq', form.current, 'E3aLBvre2I4GgZoq8')
      .then((result) => {
          setSent(true);
          setLoading(false);
      }, (error) => {
          console.log(error.text);
          setLoading(false);
          alert("Failed to send feedback.");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in">
      <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT SIDE: GUIDE & FAQ */}
        <div className="flex-1 p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="text-blue-400" /> User Guide
            </h2>
            <button onClick={onClose} className="md:hidden text-slate-400"><X /></button>
          </div>

          <div className="space-y-6 text-slate-300">
            
            {/* 1. HOW TO USE */}
            <section>
              <h3 className="text-lg font-bold text-white mb-2">🚀 How to Use</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Search:</strong> Type keywords in English, Hindi (e.g., "commit", "save changes").</li>
                <li><strong>Voice:</strong> Click the <span className="inline-block bg-slate-800 p-1 rounded-full"><span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span></span> Mic icon to speak your search query.</li>
                <li><strong>Copy:</strong> Click the command card to instantly copy code to clipboard.</li>
              </ul>
            </section>

            {/* 2. AI CHATBOT */}
            <section>
              <h3 className="text-lg font-bold text-white mb-2">🤖 AI Chatbot</h3>
              <p className="text-sm">
                The sidebar AI is powered by OpenAI. If you can't find a command in the list, ask the AI! 
                <br/><em>Example: "How do I undo a merge in Git?"</em>
              </p>
            </section>

             {/* 3. ADMIN ACCESS */}
             <section>
              <h3 className="text-lg font-bold text-white mb-2">🔐 Admin Access</h3>
              <p className="text-sm">
                Only the Admin (Abizer) can add or delete commands. If you are a visitor, you can view and copy commands freely.
              </p>
            </section>

            {/* 4. FAQ */}
            <section>
              <h3 className="text-lg font-bold text-white mb-2">❓ FAQs</h3>
              <div className="space-y-3">
                <details className="bg-slate-800/50 p-3 rounded-lg cursor-pointer">
                  <summary className="font-semibold text-white">Can I contribute a command?</summary>
                  <p className="text-sm mt-2 text-slate-400">Yes! Use the feedback form on the right to send a new command request to the admin.</p>
                </details>
                <details className="bg-slate-800/50 p-3 rounded-lg cursor-pointer">
                  <summary className="font-semibold text-white">Is this free to use?</summary>
                  <p className="text-sm mt-2 text-slate-400">Absolutely. This tool is free for all developers and students.</p>
                </details>
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT SIDE: FEEDBACK FORM */}
        <div className="w-full md:w-[350px] bg-slate-800 p-6 flex flex-col relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white hidden md:block"><X /></button>
          
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <MessageSquare className="text-green-400" /> Feedback
          </h2>
          <p className="text-xs text-slate-400 mb-6">Report bugs or suggest new Git commands to Abizer.</p>

          {sent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in">
              <CheckCircle size={48} className="text-green-500 mb-3" />
              <h3 className="text-white font-bold text-lg">Message Sent!</h3>
              <p className="text-slate-400 text-sm mt-1">Thank you for your feedback.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-blue-400 hover:underline text-sm">Send another</button>
            </div>
          ) : (
            <form ref={form} onSubmit={sendEmail} className="flex-1 flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Your Name</label>
                <input name="user_name" required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-blue-500" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Your Email</label>
                <input name="user_email" type="email" required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-blue-500" placeholder="john@example.com" />
              </div>

              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Message / Suggestion</label>
                <textarea name="message" required className="w-full h-full min-h-[120px] bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-blue-500 resize-none" placeholder="Hey Abizer, please add the 'git cherry-pick' command..." />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : <><Send size={16} /> Send Feedback</>}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Guide;