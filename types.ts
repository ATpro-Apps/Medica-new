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