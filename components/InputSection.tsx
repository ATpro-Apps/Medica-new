import React from 'react';
import { FileText, Sparkles, Loader2, AlertCircle, BarChart3 } from 'lucide-react';

interface InputSectionProps {
  text: string;
  setText: (text: string) => void;
  onGenerate: () => void;
  loading: boolean;
  error: string | null;
}

export const InputSection: React.FC<InputSectionProps> = ({
  text,
  setText,
  onGenerate,
  loading,
  error,
}) => {
  const charCount = text.length;
  const isTooShort = charCount < 50;

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl leading-tight">
          AI-Powered <span className="text-indigo-600 dark:text-indigo-400">Full Coverage</span> Assessment
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Transform complex medical notes or articles into an exhaustive MCQ exam.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <FileText className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Knowledge Base</h2>
          </div>
          <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-black uppercase tracking-wider">
            Total Extraction Mode
          </span>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            placeholder="Paste your source material here. The longer the text, the more comprehensive the test..."
            className="w-full h-80 p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all outline-none leading-relaxed text-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none disabled:opacity-50"
          />
          <div className="absolute bottom-4 right-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
            {charCount} chars
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
            <BarChart3 className="w-4 h-4" />
            <span>Exhaustive mapping of data points</span>
          </div>

          <button
            onClick={onGenerate}
            disabled={loading || isTooShort}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Content...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Exhaustive Test
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};