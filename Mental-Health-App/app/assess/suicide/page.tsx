"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/lib/store';
import { AlertTriangle, Shield, Heart, Phone } from 'lucide-react';

const suicideQuestions = [
  "Have you had thoughts of harming yourself?",
  "Do you have a plan to harm yourself?",
  "Do you intend to act on these thoughts?",
  "Do you have access to means to harm yourself?",
  "Have you made any preparations?",
  "Do you feel hopeless about the future?",
  "Do you feel like a burden to others?",
  "Have you experienced recent losses or trauma?",
  "Do you have a support system?",
  "Have you attempted suicide before?"
];

export default function SuicideAssessment() {
  const [answers, setAnswers] = useState<boolean[]>(Array(suicideQuestions.length).fill(false));
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setCurrentAssessment } = useAssessmentStore();

  const handleAnswer = (index: number, value: boolean) => {
    setAnswers(prev => prev.map((a, i) => i === index ? value : a));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate risk level
      const riskFactors = answers.filter(a => a).length;
      let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
      let routeTo: 'emergency' | 'human_therapy' | 'ai_support' = 'ai_support';

      if (riskFactors >= 6) {
        riskLevel = 'critical';
        routeTo = 'emergency';
      } else if (riskFactors >= 4) {
        riskLevel = 'high';
        routeTo = 'human_therapy';
      } else if (riskFactors >= 2) {
        riskLevel = 'moderate';
        routeTo = 'human_therapy';
      }

      // Create assessment result
      const assessment = {
        id: `suicide_${Date.now()}`,
        timestamp: new Date(),
        scores: { suicideRisk: riskFactors },
        severity: riskLevel === 'critical' ? 'severe' : riskLevel === 'high' ? 'moderately_severe' : riskLevel === 'moderate' ? 'moderate' : 'mild',
        symptoms: riskFactors > 0 ? ['Suicidal ideation', 'Risk factors present'] : [],
        recommendations: riskLevel === 'critical' ? 
          ['Call 988 immediately', 'Go to emergency room', 'Remove access to means'] :
          riskLevel === 'high' ? 
          ['Seek immediate professional help', 'Create safety plan', 'Remove access to means'] :
          riskLevel === 'moderate' ? 
          ['Schedule professional evaluation', 'Build support network', 'Practice safety measures'] :
          ['Continue monitoring', 'Build coping skills', 'Maintain support connections'],
        routeTo: routeTo === 'emergency' ? 'human_therapy' : routeTo
      };

      setCurrentAssessment(assessment);

      if (routeTo === 'emergency') {
        router.push('/emergency');
      } else {
        router.push('/results');
      }
    } catch (error) {
      console.error('Error processing assessment:', error);
      router.push('/results');
    } finally {
      setLoading(false);
    }
  };

  const riskFactors = answers.filter(a => a).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Suicide Risk Assessment</h1>
            <p className="text-gray-600">
              This assessment helps evaluate suicide risk factors. Your safety is our priority.
            </p>
          </div>

          {/* Emergency Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-800">If you're in crisis:</h3>
                <p className="text-red-700 text-sm">
                  Call the National Suicide Prevention Lifeline at <strong>988</strong> or <strong>911</strong> immediately.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {suicideQuestions.map((question, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <p className="font-medium text-gray-900 mb-3">{index + 1}. {question}</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`q-${index}`}
                        checked={answers[index] === true}
                        onChange={() => handleAnswer(index, true)}
                        className="text-red-600 focus:ring-red-500 focus:ring-2"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`q-${index}`}
                        checked={answers[index] === false}
                        onChange={() => handleAnswer(index, false)}
                        className="text-red-600 focus:ring-red-500 focus:ring-2"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk Level Indicator */}
            {riskFactors > 0 && (
              <div className={`p-4 rounded-lg ${
                riskFactors >= 6 ? 'bg-red-50 border border-red-200' :
                riskFactors >= 4 ? 'bg-orange-50 border border-orange-200' :
                riskFactors >= 2 ? 'bg-yellow-50 border border-yellow-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${
                    riskFactors >= 6 ? 'text-red-600' :
                    riskFactors >= 4 ? 'text-orange-600' :
                    riskFactors >= 2 ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                  <span className="font-medium">
                    Risk Factors Identified: {riskFactors}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || answers.some(a => a === undefined)}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                'Complete Assessment'
              )}
            </button>
          </form>

          {/* Crisis Resources */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Crisis Resources</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p><strong>988</strong> - National Suicide Prevention Lifeline</p>
              <p><strong>911</strong> - Emergency Services</p>
              <p><strong>Crisis Text Line</strong> - Text HOME to 741741</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
