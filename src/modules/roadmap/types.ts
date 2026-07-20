export interface ExternalResource {
  title: string;
  sourceName: string;
  url: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
  externalResources: ExternalResource[];
}

export interface CareerPath {
  id: string;
  careerTitle: string;
  description: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  outcome?: string;
  portfolioOutcome?: string;
  skills: string[];
  roadmapSteps: RoadmapStep[];
}

export interface CareerRecommendationInput {
  skills: string;
  interests: string;
  goals: string;
}

export interface CareerRecommendation {
  careerTitle: string;
  reason: string;
  skillsToLearn: string[];
}

export interface CareerRecommendationHistory {
  id: string;
  skills: string;
  interests: string;
  goals: string;
  recommendations: CareerRecommendation[];
  createdAt: string;
}
