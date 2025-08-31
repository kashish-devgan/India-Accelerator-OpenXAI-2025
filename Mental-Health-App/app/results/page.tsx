"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/lib/store';
import { AssessmentResult } from '@/lib/types';
import { 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Bot, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Phone,
  Heart,
  Shield
} from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const { currentAssessment, clearSession } = useAssessmentStore();
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    if (!currentAssessment) {
      router.push('/');
      return;
    }
    setAssessment(currentAssessment);
  }, [currentAssessment, router]);

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderately_severe': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'mild': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'minimal': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'severe':
      case 'moderately_severe':
        return <AlertTriangle className="w-6 h-6" />;
      case 'moderate':
        return <AlertTriangle className="w-6 h-6" />;
      case 'mild':
        return <TrendingUp className="w-6 h-6" />;
      case 'minimal':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getRouteIcon = (route: string) => {
    switch (route) {
      case 'human_therapy':
        return <Users className="w-6 h-6" />;
      case 'ai_support':
        return <Bot className="w-6 h-6" />;
      case 'stable':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getRouteTitle = (route: string) => {
    switch (route) {
      case 'human_therapy':
        return 'Professional Therapy Recommended';
      case 'ai_support':
        return 'AI Support Available';
      case 'stable':
        return 'Stable Condition';
      default:
        return 'Assessment Complete';
    }
  };

  const getRouteDescription = (route: string) => {
    switch (route) {
      case 'human_therapy':
        return 'Based on your assessment, we recommend connecting with a mental health professional for personalized care and support.';
      case 'ai_support':
        return 'You can benefit from AI-powered support and guidance. Our AI assistant is here to help you develop coping strategies.';
      case 'stable':
        return 'Your symptoms appear to be minimal. Continue with your current self-care practices and monitor your well-being.';
      default:
        return 'Your assessment has been completed successfully.';
    }
  };

  const handleStartSession = () => {
    switch (assessment.routeTo) {
      case 'human_therapy':
        router.push('/therapy/human');
        break;
      case 'ai_support':
        router.push('/therapy/ai');
        break;
      case 'stable':
        router.push('/progress');
        break;
    }
  };

  const handleNewAssessment = () => {
    clearSession();
    router.push('/assess');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
          <p className="text-gray-600">Your mental health evaluation is complete</p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg border ${getSeverityColor(assessment.severity)}`}>
                {getSeverityIcon(assessment.severity)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Severity Level</h2>
                <p className="text-gray-600 capitalize">{assessment.severity.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Assessment Date</p>
              <p className="font-medium">
                {new Date(assessment.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Symptoms */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Identified Symptoms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {assessment.symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
            <div className="space-y-2">
              {assessment.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Heart className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Routing Decision */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getRouteIcon(assessment.routeTo)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{getRouteTitle(assessment.routeTo)}</h2>
              <p className="text-gray-600">{getRouteDescription(assessment.routeTo)}</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleStartSession}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {assessment.routeTo === 'human_therapy' && 'Find Professional Help'}
            {assessment.routeTo === 'ai_support' && 'Start AI Support Session'}
            {assessment.routeTo === 'stable' && 'View Progress Tracking'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Resources */}
        {assessment.severity === 'severe' || assessment.severity === 'moderately_severe' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Immediate Support Available</h3>
                <p className="text-red-700 mb-4">
                  If you're experiencing thoughts of self-harm or are in crisis, help is available 24/7.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-red-600" />
                    <span className="text-red-800 font-medium">988</span>
                    <span className="text-red-700">Suicide & Crisis Lifeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-red-600" />
                    <span className="text-red-800 font-medium">911</span>
                    <span className="text-red-700">Emergency Services</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleNewAssessment}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Take New Assessment
          </button>
          <button
            onClick={() => router.push('/progress')}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Track Progress
          </button>
        </div>
      </div>
    </div>
  );
}
