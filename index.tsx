import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { 
  Brain, 
  LogOut, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  BarChart3,
  Trophy, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  CreditCard,
  Calendar,
  Shield
} from 'lucide-react';

// --- TYPES ---
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'High' | 'Medium';
}

export interface QuizData {
  questions: Question[];
}

export interface GenerateQuizResponse {
  success: boolean;
  data?: QuizData;
  error?: string;
}

export type AppStep = 'input' | 'quiz';

export interface UserAnswers {
  [questionId: number]: string;
}

export interface UserProfile {
  name: string;
  email: string;
  plan?: string;
  status: 'active' | 'inactive';
  nextBillingDate?: string;
}

// --- SERVICES ---
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-3-flash-preview";

const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING },
          difficulty: {
            type: Type.STRING,
            enum: ["High", "Medium"],
          },
        },
        required: ["id", "question", "options", "correctAnswer", "explanation", "difficulty"],
      },
    },
  },
  required: ["questions"],
};

const generateQuizFromText = async (text: string): Promise<GenerateQuizResponse> => {
  try {
    const systemPrompt = `
      You are "Medica", an advanced IQ and cognitive assessment expert specializing in medical and scientific education.
      
      TASK:
      Exhaustively analyze the provided text and generate the MAXIMUM possible number of high-quality MCQ questions. 
      The goal is total information density: if a fact exists, a question should exist for it.
      
      CRITICAL RULES:
      1. NO SELF-REFERENCES: Do NOT use phrases like "According to the text", "In the article", or "The text states". 
         Ask the questions as if they are general knowledge facts derived from the source.
      2. EXHAUSTIVE COVERAGE: Extract every single unique data point, logical inference, and factual statement. 
      3. QUALITY: Ensure 4 distinct options per question. Only one must be correct.
      4. DIFFICULTY: Categorize as "High" (deep reasoning/inference) or "Medium" (factual understanding).
      5. FORMAT: Return strict JSON.
    `;

    const response = await genAI.models.generateContent({
      model: modelId,
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: `SOURCE CONTENT:\n${text}` }
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.3,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("No content generated");
    }

    const quizData = JSON.parse(outputText) as QuizData;

    // Post-processing to ensure IDs are unique if the model hallucinates duplicates
    const processedQuestions = quizData.questions.map((q, index) => ({
      ...q,
      id: index + 1,
    }));

    return {
      success: true,
      data: { questions: processedQuestions },
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate assessment.",
    };
  }
};

// --- COMPONENTS ---

// 1. AccessGate
interface AccessGateProps {
  onUnlock: (code: string) => boolean;
}

const AccessGate: React.FC<AccessGateProps> = ({ onUnlock }) => {
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

// 2. InputSection
interface InputSectionProps {
  text: string;
  setText: (text: string) => void;
  onGenerate: () => void;
  loading: boolean;
  error: string | null;
}

const InputSection: React.FC<InputSectionProps> = ({
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

// 3. QuizSection
interface QuizSectionProps {
  questions: Question[];
  onReset: () => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ questions, onReset }) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const answeredCount = Object.keys(userAnswers).length;
  const totalCount = questions.length;
  const isComplete = answeredCount === totalCount;

  useEffect(() => {
    if (showResults) {
      let correct = 0;
      questions.forEach((q) => {
        if (userAnswers[q.id] === q.correctAnswer) {
          correct++;
        }
      });
      setScore(correct);
    }
  }, [showResults, questions, userAnswers]);

  const handleAnswerSelect = (qId: number, option: string) => {
    if (showResults) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const getExpertiseLevel = (score: number, total: number) => {
    const percentage = score / total;
    if (percentage >= 0.9) return "Medical Genius";
    if (percentage >= 0.75) return "Expert";
    if (percentage >= 0.6) return "Proficient";
    return "Novice";
  };

  return (
    <div className="space-y-8 animate-slide-up pb-32">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-20 z-30 transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Trophy className="text-yellow-500 fill-yellow-500" />
            Comprehensive Exam
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Generated {questions.length} questions from your source
          </p>
        </div>
        <button
          onClick={onReset}
          className="bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-300 px-6 py-2 rounded-xl flex items-center gap-2 font-bold transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          New Analysis
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="p-8 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-wide">
                  Question {idx + 1}
                </span>
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wide ${
                    q.difficulty === 'High'
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-900/30'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/30'
                  }`}
                >
                  {q.difficulty === 'High' ? 'High Complexity' : 'Core Knowledge'}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold leading-snug text-slate-800 dark:text-slate-100">
                {q.question}
              </h3>
            </div>

            <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((option, optIdx) => {
                const isSelected = userAnswers[q.id] === option;
                const isCorrect = option === q.correctAnswer;
                const isUserWrong = isSelected && !isCorrect;

                let buttonClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm";
                
                if (showResults) {
                  if (isCorrect) {
                    buttonClass = "bg-green-50 dark:bg-green-900/20 border-green-500 ring-1 ring-green-500 shadow-sm";
                  } else if (isUserWrong) {
                    buttonClass = "bg-red-50 dark:bg-red-900/20 border-red-500 ring-1 ring-red-500 shadow-sm";
                  } else {
                    buttonClass = "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-60 grayscale";
                  }
                } else if (isSelected) {
                  buttonClass = "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600 dark:ring-indigo-500 shadow-md transform scale-[1.01]";
                }

                return (
                  <button
                    key={optIdx}
                    disabled={showResults}
                    onClick={() => handleAnswerSelect(q.id, option)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-start justify-between group relative ${buttonClass}`}
                  >
                    <span className={`font-semibold text-base ${
                      showResults && isCorrect ? 'text-green-800 dark:text-green-300' : 
                      showResults && isUserWrong ? 'text-red-800 dark:text-red-300' :
                      isSelected ? 'text-indigo-900 dark:text-indigo-100' :
                      'text-slate-700 dark:text-slate-300'
                    }`}>
                        {option}
                    </span>
                    
                    <div className="ml-3 flex-shrink-0 mt-0.5">
                        {showResults && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                        {showResults && isUserWrong && (
                            <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                        )}
                        {!showResults && isSelected && (
                            <div className="w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900" />
                        )}
                        {!showResults && !isSelected && (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-indigo-300 dark:group-hover:border-indigo-500" />
                        )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResults && (
              <div className="p-6 bg-indigo-50/60 dark:bg-indigo-900/20 border-t border-indigo-100 dark:border-indigo-900/50 animate-fade-in">
                <div className="flex gap-4">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm h-fit shrink-0">
                    <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                      Scientific Rationale
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sticky Scoreboard Footer */}
      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-50 pointer-events-none">
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] border border-white/10 shadow-2xl flex items-center justify-between gap-6 w-full max-w-2xl pointer-events-auto transform transition-all hover:scale-[1.01]">
          {!showResults ? (
            <>
              <div className="flex flex-col pl-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Progress
                </span>
                <span className="text-white font-black text-xl leading-none mt-1">
                  {answeredCount} <span className="text-slate-500 text-sm">/ {totalCount}</span>
                </span>
              </div>
              
              <div className="h-10 w-px bg-white/10 hidden md:block" />

              <div className="flex-1 px-4 hidden md:flex flex-col justify-center">
                 <div className="w-full bg-slate-800 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                        className="bg-indigo-500 h-full transition-all duration-500 ease-out"
                        style={{ width: `${(answeredCount / totalCount) * 100}%` }}
                    />
                 </div>
              </div>

              <button
                onClick={() => setShowResults(true)}
                disabled={!isComplete}
                className="bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 whitespace-nowrap"
              >
                Submit Exam
              </button>
            </>
          ) : (
            <div className="flex items-center justify-between w-full px-4 divide-x divide-white/10">
              <div className="flex flex-col pr-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Score
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-3xl font-black leading-none ${score === totalCount ? 'text-green-400' : 'text-indigo-400'}`}>
                    {score}
                  </span>
                  <span className="text-slate-500 font-bold text-sm">/ {totalCount}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center px-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Rating
                </span>
                <span className="text-lg font-bold text-white mt-1">
                  {getExpertiseLevel(score, totalCount)}
                </span>
              </div>
              
              <div className="pl-6">
                <button
                  onClick={onReset}
                  className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black hover:bg-slate-200 transition-all text-xs uppercase tracking-wide"
                >
                  Restart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

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

// --- MOUNTING ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);