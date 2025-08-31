export interface AssessmentResult {
  id: string;
  timestamp: Date;
  scores: {
    phq9?: number;
    gad7?: number;
    sleep?: number;
    appetite?: number;
    energy?: number;
    social?: number;
    coping?: number;
  };
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  symptoms: string[];
  recommendations: string[];
  routeTo: 'ai_support' | 'human_therapy' | 'stable';
}

export interface SymptomEvaluation {
  sleepPatterns: {
    quality: number; // 0-10
    duration: number; // 0-10
    disturbances: string[];
  };
  appetite: {
    changes: number; // 0-10
    weightChanges: string;
    motivation: number; // 0-10
  };
  energy: {
    level: number; // 0-10
    fatigue: number; // 0-10
    motivation: number; // 0-10
  };
  behavior: {
    changes: string[];
    socialWithdrawal: number; // 0-10
    irritability: number; // 0-10
  };
  social: {
    functioning: number; // 0-10
    relationships: number; // 0-10
    isolation: number; // 0-10
  };
  thoughts: {
    selfImage: number; // 0-10
    negativeThoughts: string[];
    suicidalIdeation: {
      thoughts: boolean;
      plan: boolean;
      intent: boolean;
    };
  };
  coping: {
    mechanisms: string[];
    effectiveness: number; // 0-10
    support: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TherapySession {
  id: string;
  assessmentId: string;
  type: 'ai_support' | 'human_therapy';
  startTime: Date;
  endTime?: Date;
  messages: ChatMessage[];
  progress: {
    mood: number; // 0-10
    symptoms: string[];
    improvements: string[];
  };
}

export interface ProgressTracking {
  sessionId: string;
  weeklyCheckins: {
    date: Date;
    mood: number; // 0-10
    symptoms: string[];
    copingStrategies: string[];
    notes: string;
  }[];
  reassessmentNeeded: boolean;
  nextAssessmentDate?: Date;
}
