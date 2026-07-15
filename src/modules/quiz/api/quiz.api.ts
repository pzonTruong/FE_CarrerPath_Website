import { http } from '../../../shared/api/http';

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nodeId: string;
}

export interface SubmitQuizPayload {
  careerId: string;
  stepId: string;
  skillId: string;
  answers: Record<string, number>;
}

export interface LearningPathResource {
  title: string;
  sourceName: string;
  url: string;
}

export interface LearningPathStep {
  stepId: string;
  title: string;
  reason: string;
  priority: 'review' | 'learn' | 'practice';
  estimatedHours: number;
  checkpoint: string;
  resources: LearningPathResource[];
}

export interface PersonalizedLearningPath {
  summary: string;
  readinessLevel: 'beginner' | 'developing' | 'ready';
  confidenceScore: number;
  estimatedStudyHours: number;
  weakSkills: string[];
  strengths: string[];
  nextActions: string[];
  source: 'ai' | 'fallback';
  recommendedSteps: LearningPathStep[];
}

export interface SubmitQuizResult {
  isPassed: boolean;
  score: number;
  totalQuestions: number;
  percentageScore: number;
  learningPath?: PersonalizedLearningPath;
  quizHistory?: QuizHistoryItem[];
}

export interface QuizHistoryItem {
  id: string;
  careerId?: string;
  stepId?: string;
  score: number;
  totalQuestions: number;
  percentageScore: number;
  passed: boolean;
  createdAt: string;
}

export const quizApi = {
  getQuizzes: (skillId: string) => http.get<{ success: boolean; data: QuizQuestion[] }>(`/quizzes/${skillId}`),
  getHistory: (params?: { careerId?: string; stepId?: string }) =>
    http.get<{ success: boolean; data: QuizHistoryItem[] }>('/quizzes/history', { params }),
  submitQuiz: (payload: SubmitQuizPayload) => http.post<{ success: boolean; data: SubmitQuizResult }>('/quizzes/submit', payload, {
    timeout: 60000
  })
};
