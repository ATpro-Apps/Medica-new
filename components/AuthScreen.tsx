import React, { useState } from 'react';
import { Brain, ArrowRight, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string, name: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(email, name);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-slide-up">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Brain className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Welcome to Medica</h1>
          <p className="text-slate-500 mt-2">Sign in to access your assessment tools</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Sarah Connor"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@clinic.com"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !name}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};