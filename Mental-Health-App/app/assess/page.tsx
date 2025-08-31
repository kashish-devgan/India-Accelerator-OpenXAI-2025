import Link from 'next/link';
import { Brain, Clock, BarChart3, Shield, ArrowRight } from 'lucide-react';

export default function AssessmentPage() {
  const assessmentOptions = [
    {
      title: 'Comprehensive Symptom Evaluation',
      description: 'Complete assessment covering sleep, mood, energy, social functioning, thoughts, and coping mechanisms. Takes 10-15 minutes.',
      duration: '10-15 minutes',
      icon: <Brain className="w-8 h-8" />,
      link: '/assess/comprehensive',
      color: 'bg-blue-100 text-blue-600',
      recommended: true
    },
    {
      title: 'PHQ-9 Depression Screening',
      description: 'Quick 9-question assessment for depression symptoms. Takes 2-3 minutes.',
      duration: '2-3 minutes',
      icon: <BarChart3 className="w-8 h-8" />,
      link: '/assess/phq9',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'GAD-7 Anxiety Screening',
      description: 'Quick 7-question assessment for anxiety symptoms. Takes 2-3 minutes.',
      duration: '2-3 minutes',
      icon: <Clock className="w-8 h-8" />,
      link: '/assess/gad7',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mental Health Assessment</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the assessment that best fits your needs. Our comprehensive evaluation provides the most detailed analysis, 
            while quick screenings offer rapid insights for specific concerns.
          </p>
        </div>

        {/* Assessment Options */}
        <div className="space-y-6 mb-8">
          {assessmentOptions.map((option, index) => (
            <Link
              key={index}
              href={option.link}
              className={`block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 ${
                option.recommended ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${option.color}`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{option.title}</h2>
                    {option.recommended && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{option.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {option.duration}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important Information</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• These assessments are for screening purposes only and do not provide a diagnosis</li>
                <li>• If you're experiencing thoughts of self-harm, please call 988 or 911 immediately</li>
                <li>• For professional diagnosis and treatment, consult with a mental health professional</li>
                <li>• Your responses are confidential and stored locally on your device</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Resources */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-800 mb-3">Crisis Support Available</h3>
          <p className="text-red-700 mb-4 text-sm">
            If you're in crisis or experiencing thoughts of self-harm, help is available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:988"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-center font-medium"
            >
              Call 988 - Suicide & Crisis Lifeline
            </a>
            <a
              href="tel:911"
              className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors text-center font-medium"
            >
              Call 911 - Emergency Services
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
