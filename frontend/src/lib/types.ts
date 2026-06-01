export interface AnalysisScores {
  architecture: number;
  readability: number;
  scalability: number;
  documentation: number;
  security: number;
  overall: number;
}

export interface AnalysisResult {
  repo_name: string;
  repo_url: string;
  description: string;
  detected_stack: string[];
  scores: AnalysisScores;
  strengths: string[];
  weaknesses: string[];
  senior_recommendations: string[];
  production_improvements: string[];
  verdict: string;
}
