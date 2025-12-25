import React, { useState, useEffect } from 'react';
import { Brain, LogOut, ShieldCheck, Moon, Sun } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { QuizSection } from './components/QuizSection';
import { AccessGate } from './components/AccessGate';
import { generateQuizFromText } from './services/geminiService';
import { Question, AppStep } from './types';

// Valid codes configuration
const VALID_CODES = ['sad', 'happy', 'man'];
const AUTH_KEY = 'medica_device_auth';

const App = () => {
  // --- STATE ---
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [step, setStep] = useState<AppStep>('input');
  
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  // App Logic State
  const [inputText, setInputText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Check local storage for existing authorization
    const storedAuth = localStorage.getItem(AUTH_KEY);
    if (storedAuth === 'granted') {
      setIsAuthorized(true);
    }
  }, []);

  // Theme Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // --- AUTH ACTIONS ---
  const handleUnlock = (code: string): boolean => {
    const normalizeCode = code.trim().toLowerCase();
    if (VALID_CODES.includes(normalizeCode)) {
      localStorage.setItem(AUTH_KEY, 'granted');
      setIsAuthorized(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthorized(false);
    handleReset();
  };

  // --- APP ACTIONS ---
  const handleGenerate = async () => {
    if (!inputText || inputText.trim().length < 50) {
      setError("Please enter sufficient text (at least 50 characters) for analysis.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await generateQuizFromText(inputText);
    if (result.success && result.data) {
      setQuestions(result.data.questions);
      setStep('quiz');
    } else {
      setError(result.error || "An unexpected error occurred.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep('input');
    setQuestions([]);
    setError(null);
    setInputText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-300" dir="ltr">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className={`flex items-center gap-2 group ${isAuthorized ? 'cursor-pointer' : ''}`} 
            onClick={isAuthorized ? handleReset : undefined}
          >
            <div className="bg-indigo-600 p-2 rounded-lg transition-transform group-hover:scale-110">
              <Brain className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Medica
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthorized && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit System</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {!isAuthorized ? (
          <AccessGate onUnlock={handleUnlock} />
        ) : (
          <>
            {step === 'input' ? (
              <InputSection
                text={inputText}
                setText={setInputText}
                onGenerate={handleGenerate}
                loading={loading}
                error={error}
              />
            ) : (
              <QuizSection
                questions={questions}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 mt-auto transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-black text-xl tracking-tighter text-slate-800 dark:text-slate-200 underline decoration-indigo-500 decoration-4">
              Medica
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-widest">
              Exhaustive Information Extraction • Powered by Gemini 2.5
            </p>
            {isAuthorized && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                <ShieldCheck className="w-3 h-3" />
                Device Authorized
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;