import { AssessmentResult, SymptomEvaluation } from './types';

export function scorePHQ9(answers: number[]) {
  const total = answers.reduce((s, a) => s + (a||0), 0);
  const severity = total <= 4 ? 'minimal' : total <= 9 ? 'mild' : total <= 14 ? 'moderate' : total <= 19 ? 'moderately_severe' : 'severe';
  return { total, severity };
}

export function scoreGAD7(answers: number[]) {
  const total = answers.reduce((s, a) => s + (a||0), 0);
  const severity = total <= 4 ? 'minimal' : total <= 9 ? 'mild' : total <= 14 ? 'moderate' : 'severe';
  return { total, severity };
}

export function suicideFlag(thoughts: boolean, plan: boolean, intent: boolean) {
  if (intent || plan) return 'immediate';
  if (thoughts) return 'elevated';
  return 'none';
}

export function calculateSymptomScore(evaluation: SymptomEvaluation): number {
  let totalScore = 0;
  
  // Sleep patterns (0-20 points)
  totalScore += evaluation.sleepPatterns?.quality || 0;
  totalScore += evaluation.sleepPatterns?.duration || 0;
  
  // Appetite and motivation (0-20 points)
  totalScore += evaluation.appetite?.changes || 0;
  totalScore += evaluation.appetite?.motivation || 0;
  
  // Energy levels (0-30 points)
  totalScore += evaluation.energy?.level || 0;
  totalScore += evaluation.energy?.fatigue || 0;
  totalScore += evaluation.energy?.motivation || 0;
  
  // Social functioning (0-30 points)
  totalScore += evaluation.social?.functioning || 0;
  totalScore += evaluation.social?.relationships || 0;
  totalScore += evaluation.social?.isolation || 0;
  
  // Behavioral changes (0-20 points)
  totalScore += evaluation.behavior?.socialWithdrawal || 0;
  totalScore += evaluation.behavior?.irritability || 0;
  
  // Thoughts and self-image (0-20 points)
  totalScore += evaluation.thoughts?.selfImage || 0;
  totalScore += evaluation.coping?.effectiveness || 0;
  
  return totalScore;
}

export function determineSeverity(totalScore: number, suicidalIdeation: any): AssessmentResult['severity'] {
  // Immediate severe classification for suicidal ideation
  if (suicidalIdeation?.thoughts || suicidalIdeation?.plan || suicidalIdeation?.intent) {
    return 'severe';
  }
  
  // Score-based severity (adjusted for 0-10 scale, max possible score is 140)
  if (totalScore >= 100) return 'severe';
  if (totalScore >= 70) return 'moderately_severe';
  if (totalScore >= 50) return 'moderate';
  if (totalScore >= 30) return 'mild';
  return 'minimal';
}

export function determineRouting(severity: AssessmentResult['severity'], suicidalIdeation: any): AssessmentResult['routeTo'] {
  // Immediate routing for suicidal ideation
  if (suicidalIdeation?.thoughts || suicidalIdeation?.plan || suicidalIdeation?.intent) {
    return 'human_therapy';
  }
  
  // Severity-based routing
  switch (severity) {
    case 'severe':
    case 'moderately_severe':
    case 'moderate':
      return 'human_therapy';
    case 'mild':
      return 'ai_support';
    case 'minimal':
      return 'stable';
    default:
      return 'ai_support';
  }
}

export function generateSymptoms(evaluation: SymptomEvaluation): string[] {
  const symptoms: string[] = [];
  
  // Sleep-related symptoms (threshold: 5/10 for 0-10 scale)
  if ((evaluation.sleepPatterns?.quality || 0) >= 5) symptoms.push('Sleep disturbances');
  if ((evaluation.sleepPatterns?.duration || 0) >= 5) symptoms.push('Insomnia or oversleeping');
  
  // Appetite-related symptoms
  if ((evaluation.appetite?.changes || 0) >= 5) symptoms.push('Appetite changes');
  if ((evaluation.appetite?.motivation || 0) >= 5) symptoms.push('Loss of motivation');
  
  // Energy-related symptoms
  if ((evaluation.energy?.level || 0) >= 5) symptoms.push('Low energy');
  if ((evaluation.energy?.fatigue || 0) >= 5) symptoms.push('Fatigue');
  if ((evaluation.energy?.motivation || 0) >= 5) symptoms.push('Lack of motivation');
  
  // Social symptoms
  if ((evaluation.social?.functioning || 0) >= 5) symptoms.push('Social difficulties');
  if ((evaluation.social?.isolation || 0) >= 5) symptoms.push('Social withdrawal');
  if ((evaluation.social?.relationships || 0) >= 5) symptoms.push('Relationship problems');
  
  // Behavioral symptoms
  if ((evaluation.behavior?.socialWithdrawal || 0) >= 5) symptoms.push('Social withdrawal');
  if ((evaluation.behavior?.irritability || 0) >= 5) symptoms.push('Irritability');
  
  // Thought-related symptoms
  if ((evaluation.thoughts?.selfImage || 0) >= 5) symptoms.push('Negative self-image');
  if ((evaluation.coping?.effectiveness || 0) <= 5) symptoms.push('Poor coping skills');
  
  return symptoms;
}

export function generateRecommendations(severity: AssessmentResult['severity'], symptoms: string[]): string[] {
  const recommendations: string[] = [];
  
  // Universal recommendations
  recommendations.push('Practice regular self-care');
  recommendations.push('Maintain a consistent sleep schedule');
  recommendations.push('Engage in physical activity');
  
  // Severity-specific recommendations
  switch (severity) {
    case 'severe':
    case 'moderately_severe':
      recommendations.push('Seek immediate professional help');
      recommendations.push('Consider medication evaluation');
      recommendations.push('Create a safety plan');
      break;
    case 'moderate':
      recommendations.push('Schedule professional evaluation');
      recommendations.push('Consider therapy options');
      recommendations.push('Build support network');
      break;
    case 'mild':
      recommendations.push('Try self-help strategies');
      recommendations.push('Monitor symptoms');
      recommendations.push('Consider brief therapy');
      break;
    case 'minimal':
      recommendations.push('Continue healthy habits');
      recommendations.push('Regular mood monitoring');
      break;
  }
  
  // Symptom-specific recommendations
  if (symptoms.includes('Sleep disturbances')) {
    recommendations.push('Practice sleep hygiene');
  }
  if (symptoms.includes('Social withdrawal')) {
    recommendations.push('Gradually increase social activities');
  }
  if (symptoms.includes('Low energy')) {
    recommendations.push('Start with small, manageable tasks');
  }
  
  return recommendations;
}

export function createAssessmentResult(
  evaluation: SymptomEvaluation,
  phq9Score?: number,
  gad7Score?: number
): AssessmentResult {
  const totalScore = calculateSymptomScore(evaluation);
  const severity = determineSeverity(totalScore, evaluation.thoughts?.suicidalIdeation);
  const routeTo = determineRouting(severity, evaluation.thoughts?.suicidalIdeation);
  const symptoms = generateSymptoms(evaluation);
  const recommendations = generateRecommendations(severity, symptoms);
  
  return {
    id: `assessment_${Date.now()}`,
    timestamp: new Date(),
    scores: {
      phq9: phq9Score,
      gad7: gad7Score,
      sleep: (evaluation.sleepPatterns?.quality || 0) + (evaluation.sleepPatterns?.duration || 0),
      appetite: (evaluation.appetite?.changes || 0) + (evaluation.appetite?.motivation || 0),
      energy: (evaluation.energy?.level || 0) + (evaluation.energy?.fatigue || 0) + (evaluation.energy?.motivation || 0),
      social: (evaluation.social?.functioning || 0) + (evaluation.social?.relationships || 0) + (evaluation.social?.isolation || 0),
      coping: evaluation.coping?.effectiveness || 0
    },
    severity,
    symptoms,
    recommendations,
    routeTo
  };
}
