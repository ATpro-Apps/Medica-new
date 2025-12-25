import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Brain, CheckCircle2, XCircle } from 'lucide-react';
import type { Question, UserAnswers } from '../types.ts';

interface QuizSectionProps {
  questions: Question[];
  onReset: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ questions, onReset }) => {
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