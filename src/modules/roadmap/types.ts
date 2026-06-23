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
  skills: string[];
  roadmapSteps: RoadmapStep[];
}
