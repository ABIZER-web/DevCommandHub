import React, { useState } from 'react';
import { Lock, LogIn, X } from 'lucide-react';
import SHA256 from 'crypto-js/sha256'; // Import the hasher

const AdminLogin = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // 1. Get secrets from environment variables
    const envUser = import.meta.env.VITE_ADMIN_USER;
    const envHash = import.meta.env.VITE_ADMIN_HASH;

    // 2. Hash the password entered by the user
    const inputHash = SHA256(password).toString();

    // 3. Compare Input vs Environment Variable
    if (username === envUser && inputHash === envHash) {
      onLogin(true);
      setError('');
      if (onClose) onClose(); 
    } else {
      setError('Invalid Credentials');
    }
  };

  return (
    <div className="relative">
      {onClose && (
        <button onClick={onClose} className="absolute -top-2 -right-2 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      )}

      <div className="flex items-center gap-2 mb-4 text-blue-400">
        <Lock size={20} />
        <h3 className="font-bold text-white">Admin Access</h3>
      </div>

      <form onSubmit={handleLogin} className="space-y-3">
        <input 
          type="text" 
          placeholder="Username" 
          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded flex items-center justify-center gap-2 transition-colors"
        >
          <LogIn size={16} /> Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;