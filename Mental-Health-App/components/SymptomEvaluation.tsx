"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SymptomEvaluation } from '@/lib/types';
import { createAssessmentResult } from '@/lib/scoring';
import { useAssessmentStore } from '@/lib/store';
import { OllamaService } from '@/lib/ollama';
import { Moon, Coffee, Battery, Eye, Users, Brain, Wrench, ArrowRight, AlertTriangle } from 'lucide-react';

interface EvaluationStep {
  id: keyof SymptomEvaluation;
  title: string;
  icon: React.ReactNode;
  description: string;
  questions: {
    key: string;
    label: string;
    type: 'scale' | 'text' | 'boolean' | 'multiselect';
    options?: string[];
  }[];
}

const evaluationSteps: EvaluationStep[] = [
  {
    id: 'sleepPatterns',
    title: 'Sleep Patterns',
    icon: <Moon className="w-6 h-6" />,
    description: 'Evaluate your sleep quality and patterns',
    questions: [
      { key: 'quality', label: 'How would you rate your sleep quality?', type: 'scale' },
      { key: 'duration', label: 'How many hours do you typically sleep?', type: 'scale' },
      { key: 'disturbances', label: 'What sleep disturbances do you experience?', type: 'multiselect', options: ['Insomnia', 'Nightmares', 'Sleep apnea', 'Restless legs', 'Early waking', 'Difficulty falling asleep'] }
    ]
  },
  {
    id: 'appetite',
    title: 'Appetite & Motivation',
    icon: <Coffee className="w-6 h-6" />,
    description: 'Review your eating habits and motivation levels',
    questions: [
      { key: 'changes', label: 'Have you noticed changes in your appetite?', type: 'scale' },
      { key: 'weightChanges', label: 'Describe any weight changes:', type: 'text' },
      { key: 'motivation', label: 'How motivated do you feel to complete daily tasks?', type: 'scale' }
    ]
  },
  {
    id: 'energy',
    title: 'Energy & Fatigue',
    icon: <Battery className="w-6 h-6" />,
    description: 'Assess your energy levels and fatigue',
    questions: [
      { key: 'level', label: 'How would you rate your overall energy level?', type: 'scale' },
      { key: 'fatigue', label: 'How often do you feel fatigued?', type: 'scale' },
      { key: 'motivation', label: 'How motivated do you feel to engage in activities?', type: 'scale' }
    ]
  },
  {
    id: 'behavior',
    title: 'Behavioral Changes',
    icon: <Eye className="w-6 h-6" />,
    description: 'Observe any changes in your behavior',
    questions: [
      { key: 'changes', label: 'What behavioral changes have you noticed?', type: 'multiselect', options: ['Withdrawal from activities', 'Increased irritability', 'Restlessness', 'Slowed movements', 'Changes in routine', 'Risk-taking behavior'] },
      { key: 'socialWithdrawal', label: 'How much have you withdrawn from social activities?', type: 'scale' },
      { key: 'irritability', label: 'How irritable or easily annoyed do you feel?', type: 'scale' }
    ]
  },
  {
    id: 'social',
    title: 'Social Functioning',
    icon: <Users className="w-6 h-6" />,
    description: 'Assess your social relationships and functioning',
    questions: [
      { key: 'functioning', label: 'How well are you functioning in social situations?', type: 'scale' },
      { key: 'relationships', label: 'How satisfied are you with your relationships?', type: 'scale' },
      { key: 'isolation', label: 'How isolated do you feel from others?', type: 'scale' }
    ]
  },
  {
    id: 'thoughts',
    title: 'Thoughts & Self-Image',
    icon: <Brain className="w-6 h-6" />,
    description: 'Examine your thoughts and self-perception',
    questions: [
      { key: 'selfImage', label: 'How do you feel about yourself?', type: 'scale' },
      { key: 'negativeThoughts', label: 'What negative thoughts do you experience?', type: 'multiselect', options: ['I am worthless', 'I am a failure', 'I am hopeless', 'I am unlovable', 'I am a burden', 'I should be dead'] },
      { key: 'suicidalIdeation.thoughts', label: 'Have you had thoughts of harming yourself?', type: 'boolean' },
      { key: 'suicidalIdeation.plan', label: 'Do you have a plan to harm yourself?', type: 'boolean' },
      { key: 'suicidalIdeation.intent', label: 'Do you intend to act on these thoughts?', type: 'boolean' }
    ]
  },
  {
    id: 'coping',
    title: 'Coping Mechanisms',
    icon: <Wrench className="w-6 h-6" />,
    description: 'Analyze your coping strategies and support systems',
    questions: [
      { key: 'mechanisms', label: 'What coping mechanisms do you use?', type: 'multiselect', options: ['Exercise', 'Meditation', 'Talking to friends', 'Professional therapy', 'Medication', 'Creative activities', 'Substance use', 'Avoidance'] },
      { key: 'effectiveness', label: 'How effective are your coping strategies?', type: 'scale' },
      { key: 'support', label: 'What support systems do you have?', type: 'multiselect', options: ['Family', 'Friends', 'Therapist', 'Support groups', 'Online communities', 'Healthcare provider', 'Religious/spiritual community'] }
    ]
  }
];

export default function SymptomEvaluationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [evaluation, setEvaluation] = useState<Partial<SymptomEvaluation>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSymptomEvaluation, setCurrentAssessment } = useAssessmentStore();

  const handleAnswer = (stepId: string, questionKey: string, value: any) => {
    // Convert string values to appropriate types
    let processedValue = value;
    if (typeof value === 'string') {
      if (value === 'true') processedValue = true;
      else if (value === 'false') processedValue = false;
      else if (!isNaN(Number(value))) processedValue = Number(value);
    }
    
    setEvaluation(prev => {
      const newEval = { ...prev };
      const keys = questionKey.split('.');
      let current: any = newEval;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = processedValue;
      return newEval;
    });
  };

  const getAnswer = (questionKey: string) => {
    const keys = questionKey.split('.');
    let current: any = evaluation;
    
    for (const key of keys) {
      if (!current || current[key] === undefined || current[key] === null) return undefined;
      current = current[key];
    }
    
    return current;
  };

  const renderQuestion = (question: any, stepId: string) => {
    const value = getAnswer(question.key);
    
    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{question.label}</label>
            <div className="grid grid-cols-11 gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((scale) => (
                <label key={scale} className={`flex flex-col items-center gap-1 cursor-pointer p-2 rounded-md transition-colors ${
                  value === scale 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name={question.key}
                    value={scale.toString()}
                    checked={value === scale}
                    onChange={(e) => handleAnswer(stepId, question.key, e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 focus:ring-2"
                    aria-label={`Scale ${scale} for ${question.label}`}
                  />
                  <span className="text-xs font-medium">{scale}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Not at all</span>
              <span>Extremely</span>
            </div>
          </div>
        );
      
      case 'boolean':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{question.label}</label>
            <div className="flex gap-4">
              <label className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors ${
                value === true 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name={question.key}
                  value="true"
                  checked={value === true}
                  onChange={(e) => handleAnswer(stepId, question.key, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 focus:ring-2"
                  aria-label={`Yes for ${question.label}`}
                />
                <span className="font-medium">Yes</span>
              </label>
              <label className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors ${
                value === false 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name={question.key}
                  value="false"
                  checked={value === false}
                  onChange={(e) => handleAnswer(stepId, question.key, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 focus:ring-2"
                  aria-label={`No for ${question.label}`}
                />
                <span className="font-medium">No</span>
              </label>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{question.label}</label>
            <textarea
              value={value || ''}
              onChange={(e) => handleAnswer(stepId, question.key, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{question.label}</label>
            <div className="space-y-2">
              {question.options?.map((option: string) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      handleAnswer(stepId, question.key, newValues);
                    }}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Check for suicidal ideation first
      const suicidalIdeation = evaluation.thoughts?.suicidalIdeation;
      if (suicidalIdeation?.thoughts || suicidalIdeation?.plan || suicidalIdeation?.intent) {
        // Immediate routing to human therapy
        const assessment = createAssessmentResult(evaluation as SymptomEvaluation);
        assessment.routeTo = 'human_therapy';
        assessment.severity = 'severe';
        
        setSymptomEvaluation(evaluation as SymptomEvaluation);
        setCurrentAssessment(assessment);
        router.push('/emergency');
        return;
      }

      // Use AI analysis for comprehensive evaluation
      const ollamaService = OllamaService.getInstance();
      const analysis = await ollamaService.analyzeSymptoms(evaluation as SymptomEvaluation);
      
      const assessment = createAssessmentResult(evaluation as SymptomEvaluation);
      assessment.severity = analysis.severity;
      assessment.symptoms = analysis.symptoms;
      assessment.recommendations = analysis.recommendations;
      assessment.routeTo = analysis.routeTo;

      setSymptomEvaluation(evaluation as SymptomEvaluation);
      setCurrentAssessment(assessment);
      
      // Route based on assessment
      switch (assessment.routeTo) {
        case 'human_therapy':
          router.push('/therapy/human');
          break;
        case 'ai_support':
          router.push('/therapy/ai');
          break;
        case 'stable':
          router.push('/results');
          break;
      }
    } catch (error) {
      console.error('Error during assessment:', error);
      // Fallback to basic assessment
      const assessment = createAssessmentResult(evaluation as SymptomEvaluation);
      setSymptomEvaluation(evaluation as SymptomEvaluation);
      setCurrentAssessment(assessment);
      router.push('/results');
    } finally {
      setLoading(false);
    }
  };

  const currentStepData = evaluationSteps[currentStep];
  const isLastStep = currentStep === evaluationSteps.length - 1;
  const canProceed = currentStepData.questions.every(q => getAnswer(q.key) !== undefined);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Comprehensive Symptom Evaluation</h1>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {evaluationSteps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / evaluationSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current step */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            {currentStepData.icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          {currentStepData.questions.map((question, index) => (
            <div key={index} className="border-b border-gray-100 pb-4">
              {renderQuestion(question, currentStepData.id)}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  Complete Assessment
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Emergency warning */}
      {(evaluation.thoughts?.suicidalIdeation?.thoughts || 
        evaluation.thoughts?.suicidalIdeation?.plan || 
        evaluation.thoughts?.suicidalIdeation?.intent) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-medium text-red-800">Immediate Support Available</h3>
            <p className="text-red-700 text-sm">
              If you're having thoughts of harming yourself, please call the National Suicide Prevention Lifeline at 988 or 911 immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
