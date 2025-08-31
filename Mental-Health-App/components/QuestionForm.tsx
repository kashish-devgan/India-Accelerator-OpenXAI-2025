"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/lib/store';
import { createAssessmentResult } from '@/lib/scoring';
import { SymptomEvaluation } from '@/lib/types';

export default function QuestionForm({ 
  title, 
  questions, 
  storageKey, 
  next 
}: { 
  title: string; 
  questions: string[]; 
  storageKey: string; 
  next?: string; 
}) {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setCurrentAssessment } = useAssessmentStore();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save answers to localStorage
      localStorage.setItem(storageKey, JSON.stringify(answers));
      
      // Create a basic assessment result for quick screenings
      if (storageKey === 'phq9' || storageKey === 'gad7') {
        const total = answers.reduce((s, a) => s + (a||0), 0);
        let severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe' = 'minimal';
        let routeTo: 'ai_support' | 'human_therapy' | 'stable' = 'stable';
        
        if (storageKey === 'phq9') {
          severity = total <= 4 ? 'minimal' : total <= 9 ? 'mild' : total <= 14 ? 'moderate' : total <= 19 ? 'moderately_severe' : 'severe';
        } else if (storageKey === 'gad7') {
          severity = total <= 4 ? 'minimal' : total <= 9 ? 'mild' : total <= 14 ? 'moderate' : 'severe';
        }
        
        // Route based on severity
        if (severity === 'severe' || severity === 'moderately_severe') {
          routeTo = 'human_therapy';
        } else if (severity === 'moderate' || severity === 'mild') {
          routeTo = 'ai_support';
        }
        
        // Create basic symptom evaluation for scoring
        const basicEvaluation: SymptomEvaluation = {
          sleepPatterns: { quality: 2, duration: 2, disturbances: [] },
          appetite: { changes: 2, weightChanges: '', motivation: 2 },
          energy: { level: 2, fatigue: 2, motivation: 2 },
          behavior: { changes: [], socialWithdrawal: 2, irritability: 2 },
          social: { functioning: 2, relationships: 2, isolation: 2 },
          thoughts: { 
            selfImage: 2, 
            negativeThoughts: [], 
            suicidalIdeation: { thoughts: false, plan: false, intent: false } 
          },
          coping: { mechanisms: [], effectiveness: 2, support: [] }
        };
        
        const assessment = createAssessmentResult(basicEvaluation);
        assessment.severity = severity;
        assessment.routeTo = routeTo;
        assessment.symptoms = severity !== 'minimal' ? ['Mood changes', 'Anxiety symptoms'] : [];
        assessment.recommendations = severity !== 'minimal' ? 
          ['Consider professional evaluation', 'Practice self-care strategies'] : 
          ['Continue healthy habits', 'Regular mood monitoring'];
        
        setCurrentAssessment(assessment);
      }
      
      if (next) {
        router.push(next);
      } else {
        router.push('/results');
      }
    } catch (error) {
      console.error('Error processing assessment:', error);
      if (next) router.push(next);
      else router.push('/results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <form onSubmit={onSubmit} className='space-y-6 bg-white rounded-lg shadow-md p-6'>
          <div className="text-center mb-6">
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>{title}</h2>
            <p className="text-gray-600 mb-4">
              Rate how often you have been bothered by each problem over the last 2 weeks.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answers.filter(a => a !== -1).length / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {answers.filter(a => a !== -1).length} of {questions.length} questions answered
            </p>
          </div>
          
          <div className="space-y-6">
            {questions.map((question, i) => (
              <div key={i} className="border-b border-gray-100 pb-6">
                <p className='font-medium text-gray-900 mb-4'>{i+1}. {question}</p>
                <div className='grid grid-cols-4 gap-3 mb-2'>
                  {[
                    { value: 0, label: 'Not at all' },
                    { value: 1, label: 'Several days' },
                    { value: 2, label: 'More than half the days' },
                    { value: 3, label: 'Nearly every day' }
                  ].map((option) => (
                    <label key={option.value} className={`flex flex-col items-center gap-2 cursor-pointer p-3 border rounded-lg transition-colors ${
                      answers[i] === option.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input 
                        type='radio' 
                        name={`q-${i}`} 
                        value={option.value.toString()} 
                        checked={answers[i] === option.value} 
                        onChange={(e) => setAnswers(a => a.map((x, idx) => idx === i ? Number(e.target.value) : x))} 
                        className="text-blue-600 focus:ring-blue-500 focus:ring-2"
                        aria-label={`${option.label} for question ${i + 1}`}
                      />
                      <span className="text-sm text-center text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {answers[i] !== -1 && (
                  <button
                    type="button"
                    onClick={() => setAnswers(a => a.map((x, idx) => idx === i ? -1 : x))}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear selection
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className='pt-4'>
            <button 
              type="submit"
              disabled={loading || answers.some(a => a === -1)}
              className='w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
