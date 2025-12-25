import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

interface AccessGateProps {
  onUnlock: (code: string) => boolean;
}

export const AccessGate: React.FC<AccessGateProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(code);
    
    if (!success) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 z-0"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Restricted Access</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Enter your provider access code to unlock Medica AI.
            </p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">
                Access Code
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className={`w-5 h-5 transition-colors ${error ? 'text-red-400' : 'text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400'}`} />
                </div>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(false);
                  }}
                  className={`block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none transition-all font-mono text-lg tracking-widest ${
                    error 
                      ? 'border-red-300 dark:border-red-900 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 text-red-900 dark:text-red-300 placeholder-red-300' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 text-slate-800 dark:text-slate-100'
                  } ${shake ? 'animate-shake' : ''}`}
                  placeholder="•••••"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-xs font-bold text-red-500 dark:text-red-400 ml-1 animate-fade-in">
                  Invalid access code provided.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>Unlock System</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Device authorization will be remembered</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};