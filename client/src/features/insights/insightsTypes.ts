export interface AIInsight {
  _id: string;
  journal: string;        
  emotion: string;
  summary: string;
  triggers: string[];
  positiveMoments: string[];
  suggestion: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsightState {
  insights: AIInsight[];        
  currentInsight: AIInsight | null; 
  loading: boolean;
  error: string | null;
}