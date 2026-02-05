import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import { X, Check, Trash2, ShieldAlert, Database, Bell, Loader2 } from 'lucide-react';

const AdminDashboard = ({ isOpen, onClose, onDataChange }) => {
  const [activeTab, setActiveTab] = useState('pending'); 
  const [pendingCommands, setPendingCommands] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState('');

  // --- FETCH PENDING COMMANDS ---
  const fetchPending = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "commands"), where("status", "==", "pending"));
      const snapshot = await getDocs(q);
      setPendingCommands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching pending:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchPending();
  }, [isOpen, activeTab]);

  // --- APPROVE / REJECT LOGIC ---
  const handleApprove = async (id) => {
    await updateDoc(doc(db, "commands", id), { status: 'approved' });
    setPendingCommands(prev => prev.filter(c => c.id !== id));
    if (onDataChange) onDataChange();
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject and delete this command?")) return;
    await deleteDoc(doc(db, "commands", id));
    setPendingCommands(prev => prev.filter(c => c.id !== id));
  };

  // --- DUPLICATE CHECKER LOGIC ---
  const scanForDuplicates = async () => {
    setScanStatus('Scanning database...');
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "commands"));
      const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const groups = {};
      allDocs.forEach(doc => {
        const key = `${doc.category.toLowerCase()}|${doc.command_text.trim().toLowerCase()}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(doc);
      });

      const duplicateGroups = Object.values(groups).filter(group => group.length > 1);
      
      setDuplicates(duplicateGroups);
      setScanStatus(duplicateGroups.length > 0 ? `Found ${duplicateGroups.length} sets of duplicates.` : 'No duplicates found! Database is clean.');
    } catch (error) {
      console.error("Error scanning:", error);
      setScanStatus('Error during scan.');
    }
    setIsLoading(false);
  };

  const resolveDuplicate = async (group) => {
    const [keep, ...remove] = group;
    if (!window.confirm(`Keep "${keep.command_text}" and DELETE ${remove.length} duplicates?`)) return;

    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      remove.forEach(docItem => {
        const docRef = doc(db, "commands", docItem.id);
        batch.delete(docRef);
      });
      await batch.commit();
      
      setDuplicates(prev => prev.filter(g => g !== group));
      setScanStatus(`Resolved duplicates for "${keep.command_text}".`);
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Error resolving duplicates:", error);
      alert("Failed to delete duplicates.");
    }
    setIsLoading(false);
  };

  const resolveAllDuplicates = async () => {
    const totalToDelete = duplicates.reduce((acc, group) => acc + (group.length - 1), 0);
    if (!window.confirm(`⚠️ WARNING: This will delete ${totalToDelete} duplicate commands. Are you sure?`)) return;

    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      let deleteCount = 0;

      duplicates.forEach(group => {
        const [keep, ...remove] = group; 
        remove.forEach(docItem => {
          const docRef = doc(db, "commands", docItem.id);
          batch.delete(docRef);
          deleteCount++;
        });
      });

      await batch.commit();
      setDuplicates([]);
      setScanStatus(`✅ Success! Deleted ${deleteCount} duplicates.`);
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Error deleting all:", error);
      alert("Failed to delete all duplicates.");
    }
    setIsLoading(false);
  };

  // --- DELETE ALL LOGIC ---
  const handleDeleteAllCommands = async () => {
    if (!window.confirm("⚠️ DANGER ZONE ⚠️\n\nAre you sure you want to delete ALL commands from the database?\n\nThis cannot be undone.")) return;
    if (!window.confirm("Double check: This will wipe the entire database clean. Confirm delete?")) return;

    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "commands"));
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      alert("✅ All commands deleted successfully.");
      if (onDataChange) onDataChange();
      setDuplicates([]); 
      setPendingCommands([]);
    } catch (error) {
      console.error("Error wiping database:", error);
      alert("Failed to delete all commands.");
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-purple-500" /> Admin Dashboard
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-700 bg-slate-800/50">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'bg-slate-700 text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Bell size={16} /> Notifications 
            {pendingCommands.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCommands.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('maintenance')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 ${activeTab === 'maintenance' ? 'bg-slate-700 text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Database size={16} /> Maintenance
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
          
          {/* --- TAB 1: PENDING APPROVALS --- */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {isLoading && <div className="text-center py-10 text-slate-500"><Loader2 className="animate-spin mx-auto mb-2" /> Loading requests...</div>}
              
              {!isLoading && pendingCommands.length === 0 && (
                <div className="text-center py-20 text-slate-500 flex flex-col items-center">
                  <Check size={48} className="text-green-500/20 mb-4" />
                  <p>All caught up! No pending commands.</p>
                </div>
              )}

              {pendingCommands.map(cmd => (
                <div key={cmd.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center group hover:border-slate-600 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">{cmd.category}</span>
                      <span className="text-xs text-yellow-500 font-mono">Pending Approval</span>
                    </div>
                    <code className="text-blue-400 font-mono text-sm block mb-1 truncate">{cmd.command_text}</code>
                    <p className="text-slate-400 text-sm line-clamp-2">{cmd.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <button onClick={() => handleApprove(cmd.id)} className="flex-1 md:flex-none bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all">
                      <Check size={14} /> Approve
                    </button>
                    <button onClick={() => handleReject(cmd.id)} className="flex-1 md:flex-none bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all">
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- TAB 2: MAINTENANCE --- */}
          {activeTab === 'maintenance' && (
            <div className="space-y-8">
              
              {/* DANGER ZONE: DELETE ALL */}
              <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl">
                 <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2">
                    <ShieldAlert size={18}/> Danger Zone
                 </h3>
                 <p className="text-slate-400 text-sm mb-4">
                    Permanently delete all commands from the database. This action cannot be undone.
                 </p>
                 <button 
                    onClick={handleDeleteAllCommands} 
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                 >
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />} 
                    Delete All Commands
                 </button>
              </div>

              {/* DUPLICATE CHECKER - UPDATED LAYOUT */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                
                {/* Text Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-orange-400"/> Duplicate Checker
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Scan the database for identical commands. This will group commands that have the exact same category and text so you can clean them up.
                  </p>
                </div>

                {/* Button Section - Moved Down */}
                <div className="flex gap-2">
                  <button 
                    onClick={scanForDuplicates} 
                    disabled={isLoading} 
                    className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-900/20 transition-all"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <ShieldAlert size={16} />} 
                    Scan Database
                  </button>
                  
                  {duplicates.length > 0 && (
                    <button 
                      onClick={resolveAllDuplicates} 
                      disabled={isLoading} 
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50 animate-pulse"
                    >
                      <Trash2 size={16} /> Delete ALL Duplicates
                    </button>
                  )}
                </div>

                {/* Scan Status Message */}
                {scanStatus && (
                  <div className={`mt-4 p-3 rounded-lg text-sm font-mono border ${duplicates.length > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                    {scanStatus}
                  </div>
                )}

                {/* Results List */}
                {duplicates.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {duplicates.map((group, index) => (
                      <div key={index} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <code className="text-white font-mono bg-slate-800 px-2 py-1 rounded">{group[0].command_text}</code>
                          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{group.length} Copies</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Category: <span className="text-slate-300 uppercase">{group[0].category}</span>
                        </div>
                        <button 
                          onClick={() => resolveDuplicate(group)}
                          className="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14} /> Keep Original & Delete Duplicates
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;