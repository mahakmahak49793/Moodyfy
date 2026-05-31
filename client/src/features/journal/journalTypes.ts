export interface Journal {
 
  _id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
}

export interface AIInsight {
  emotion: string;
  summary: string;
  triggers: string[];
  positiveMoments: string[];
  suggestion: string;
}