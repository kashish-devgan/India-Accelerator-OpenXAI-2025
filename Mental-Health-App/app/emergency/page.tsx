"use client";
import { useAssessmentStore } from '@/lib/store';
import { 
  AlertTriangle, 
  Phone, 
  Shield, 
  Heart, 
  Users, 
  Clock,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function EmergencyPage() {
  const { currentAssessment } = useAssessmentStore();

  const emergencyResources = [
    {
      title: '988 Suicide & Crisis Lifeline',
      description: '24/7 free and confidential support',
      phone: '988',
      icon: <Phone className="w-6 h-6" />,
      color: 'bg-red-600 hover:bg-red-700',
      immediate: true
    },
    {
      title: '911 Emergency Services',
      description: 'For immediate life-threatening situations',
      phone: '911',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-red-700 hover:bg-red-800',
      immediate: true
    },
    {
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741 for crisis support',
      text: 'HOME to 741741',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      immediate: true
    }
  ];

  const supportResources = [
    {
      title: 'National Alliance on Mental Illness (NAMI)',
      description: 'Support and resources for mental health',
      phone: '1-800-950-NAMI (6264)',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'SAMHSA National Helpline',
      description: 'Treatment referral and information service',
      phone: '1-800-662-HELP (4357)',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Veterans Crisis Line',
      description: 'Specialized support for veterans',
      phone: '1-800-273-8255',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-blue-600 hover:bg-blue-700'
    }
  ];

  const safetyTips = [
    'Remove or secure any means of self-harm',
    'Stay with a trusted friend or family member',
    'Go to the nearest emergency room',
    'Call a crisis hotline immediately',
    'Avoid being alone during this time',
    'Remember that these feelings are temporary'
  ];

  return (
    <div className="min-h-screen bg-red-50">
      {/* Emergency Header */}
      <div className="bg-red-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Crisis Support Available</h1>
          </div>
          <p className="text-red-100 text-lg">
            You're not alone. Help is available 24/7, and these feelings are temporary.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Immediate Action Required */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Immediate Action Required</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Based on your assessment, you may be experiencing thoughts of self-harm. 
            Please reach out for help immediately. These feelings are temporary and help is available.
          </p>
          
          {/* Emergency Contact Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {emergencyResources.map((resource, index) => (
              <a
                key={index}
                href={resource.phone ? `tel:${resource.phone}` : '#'}
                className={`${resource.color} text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-200 flex flex-col items-center gap-2`}
              >
                {resource.icon}
                <div>
                  <h3 className="font-semibold">{resource.title}</h3>
                  <p className="text-sm opacity-90">{resource.description}</p>
                  {resource.phone && (
                    <p className="text-lg font-bold mt-1">{resource.phone}</p>
                  )}
                  {resource.text && (
                    <p className="text-lg font-bold mt-1">{resource.text}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Safety Plan */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Safety Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">What to do right now:</h3>
              <ul className="space-y-2">
                {safetyTips.slice(0, 3).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Additional steps:</h3>
              <ul className="space-y-2">
                {safetyTips.slice(3).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Support Resources */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Support Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportResources.map((resource, index) => (
              <a
                key={index}
                href={`tel:${resource.phone}`}
                className={`${resource.color} text-white p-4 rounded-lg hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {resource.icon}
                  <h3 className="font-semibold">{resource.title}</h3>
                </div>
                <p className="text-sm opacity-90 mb-2">{resource.description}</p>
                <p className="font-bold">{resource.phone}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Assessment Context */}
        {currentAssessment && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Assessment Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Severity Level</p>
                <p className="font-medium capitalize">{currentAssessment.severity.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-gray-600">Symptoms Identified</p>
                <p className="font-medium">{currentAssessment.symptoms.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Assessment Date</p>
                <p className="font-medium">
                  {new Date(currentAssessment.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">After the Crisis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Professional Help</h3>
              <p className="text-gray-700 mb-4 text-sm">
                Once you're safe, consider connecting with a mental health professional for ongoing support.
              </p>
              <Link
                href="/therapy/human"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Find Professional Help
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">AI Support</h3>
              <p className="text-gray-700 mb-4 text-sm">
                Our AI assistant can provide additional support and coping strategies.
              </p>
              <Link
                href="/therapy/ai"
                className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Try AI Support
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Important Reminder */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart className="w-6 h-6 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">You Matter</h3>
          </div>
          <p className="text-yellow-700">
            Your life has value, and there are people who care about you and want to help. 
            These difficult feelings are temporary, and with support, you can get through this.
          </p>
        </div>
      </div>
    </div>
  );
}
