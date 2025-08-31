"use client";
import { useAssessmentStore } from '@/lib/store';
import { 
  Users, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  Shield, 
  Heart,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface ResourceLink {
  name: string;
  url: string;
  phone?: boolean;
  text?: string;
}

export default function HumanTherapyPage() {
  const { currentAssessment } = useAssessmentStore();

  const therapyResources = [
    {
      title: 'Find a Therapist',
      description: 'Connect with licensed mental health professionals in your area',
      icon: <Users className="w-6 h-6" />,
      links: [
        { name: 'Psychology Today', url: 'https://www.psychologytoday.com/us/therapists' } as ResourceLink,
        { name: 'GoodTherapy', url: 'https://www.goodtherapy.org/find-therapist.html' } as ResourceLink,
        { name: 'BetterHelp', url: 'https://www.betterhelp.com/' } as ResourceLink,
        { name: 'Talkspace', url: 'https://www.talkspace.com/' } as ResourceLink
      ]
    },
    {
      title: 'Crisis Support',
      description: 'Immediate help for mental health emergencies',
      icon: <Shield className="w-6 h-6" />,
      links: [
        { name: '988 Suicide & Crisis Lifeline', url: 'tel:988', phone: true } as ResourceLink,
        { name: 'Crisis Text Line', url: 'https://www.crisistextline.org/', text: 'Text HOME to 741741' } as ResourceLink,
        { name: 'Emergency Services', url: 'tel:911', phone: true } as ResourceLink
      ]
    },
    {
      title: 'Support Groups',
      description: 'Connect with others experiencing similar challenges',
      icon: <Heart className="w-6 h-6" />,
      links: [
        { name: 'NAMI Support Groups', url: 'https://www.nami.org/Support-Education/Support-Groups' } as ResourceLink,
        { name: 'Depression and Bipolar Support Alliance', url: 'https://www.dbsalliance.org/support/chapters-and-support-groups/' } as ResourceLink,
        { name: 'Anxiety and Depression Association', url: 'https://adaa.org/supportgroups' } as ResourceLink
      ]
    },
    {
      title: 'Online Resources',
      description: 'Educational materials and self-help resources',
      icon: <Globe className="w-6 h-6" />,
      links: [
        { name: 'MentalHealth.gov', url: 'https://www.mentalhealth.gov/' } as ResourceLink,
        { name: 'National Institute of Mental Health', url: 'https://www.nimh.nih.gov/' } as ResourceLink,
        { name: 'Mental Health America', url: 'https://www.mhanational.org/' } as ResourceLink
      ]
    }
  ];

  const insuranceResources = [
    {
      title: 'Insurance Coverage',
      description: 'Understanding your mental health benefits',
      icon: <CheckCircle className="w-6 h-6" />,
      tips: [
        'Check your insurance provider\'s website for covered mental health services',
        'Call your insurance company to verify coverage and find in-network providers',
        'Ask about copays, deductibles, and session limits',
        'Consider asking for a case manager to help navigate benefits'
      ]
    },
    {
      title: 'Sliding Scale Options',
      description: 'Affordable therapy options based on income',
      icon: <Heart className="w-6 h-6" />,
      tips: [
        'Many therapists offer sliding scale fees based on income',
        'Community mental health centers often provide low-cost services',
        'University psychology clinics offer reduced-cost therapy with supervised students',
        'Non-profit organizations may provide free or low-cost mental health services'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Professional Therapy Resources</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your assessment, we recommend connecting with a mental health professional. 
            Here are resources to help you find the right support for your needs.
          </p>
        </div>

        {/* Assessment Summary */}
        {currentAssessment && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Your Assessment Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Severity Level</p>
                <p className="font-medium capitalize">{currentAssessment.severity.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Symptoms Identified</p>
                <p className="font-medium">{currentAssessment.symptoms.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assessment Date</p>
                <p className="font-medium">
                  {new Date(currentAssessment.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">If You're in Crisis</h3>
              <p className="text-red-700 mb-4">
                If you're experiencing thoughts of self-harm or are in immediate danger, 
                please call 988 (Suicide & Crisis Lifeline) or 911 immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:988"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call 988
                </a>
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call 911
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Therapy Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {therapyResources.map((resource, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {resource.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                  <p className="text-gray-600 text-sm">{resource.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                {resource.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-blue-600 font-medium">{link.name}</span>
                    {link.phone && <Phone className="w-4 h-4 text-gray-400" />}
                    {link.text && <span className="text-sm text-gray-500">{link.text}</span>}
                    {!link.phone && !link.text && <ArrowRight className="w-4 h-4 text-gray-400" />}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Insurance and Cost Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Understanding Costs & Insurance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insuranceResources.map((resource, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                    <p className="text-gray-600 text-sm">{resource.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {resource.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-semibold">1</div>
              <p className="text-sm text-gray-700">Research therapists in your area</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-semibold">2</div>
              <p className="text-sm text-gray-700">Check insurance coverage and costs</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-semibold">3</div>
              <p className="text-sm text-gray-700">Schedule initial consultation</p>
            </div>
          </div>
        </div>

        {/* Back to AI Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            While you're looking for a therapist, you can also try our AI support system
          </p>
          <Link
            href="/therapy/ai"
            className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try AI Support
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
