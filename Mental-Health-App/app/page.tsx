import Link from 'next/link';
import { Brain, Users, Bot, TrendingUp, Shield, Heart } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Comprehensive Assessment',
      description: 'Complete symptom evaluation covering sleep, mood, energy, social functioning, and more.',
      link: '/assess',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'AI-Powered Support',
      description: 'Get personalized guidance and coping strategies from our Llama3-powered AI assistant.',
      link: '/therapy/ai',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Professional Resources',
      description: 'Connect with licensed therapists and mental health professionals in your area.',
      link: '/therapy/human',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Progress Tracking',
      description: 'Monitor your mental health journey with weekly check-ins and AI insights.',
      link: '/progress',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Crisis Support',
      description: 'Immediate access to crisis hotlines and emergency mental health resources.',
      link: '/emergency',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Quick Assessments',
      description: 'Take PHQ-9 and GAD-7 assessments for depression and anxiety screening.',
      link: '/assess/phq9',
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            MindfulCare
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your comprehensive mental health companion. Take assessments, get AI-powered support, 
            and connect with professionals when needed. Your well-being matters.
          </p>
          
          {/* Emergency Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-red-800">
              <Shield className="w-5 h-5" />
              <span className="font-medium">
                If you're in crisis, call 988 (Suicide & Crisis Lifeline) or 911 immediately.
              </span>
            </div>
          </div>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assess"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
            >
              <Brain className="w-6 h-6" />
              Start Comprehensive Assessment
            </Link>
            <Link
              href="/therapy/ai"
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
            >
              <Bot className="w-6 h-6" />
              Try AI Support
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 group"
            >
              <div className={`p-3 rounded-lg w-fit mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-gray-600 text-sm">
                Complete our comprehensive symptom evaluation to understand your current mental health status.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analysis</h3>
              <p className="text-gray-600 text-sm">
                Our AI analyzes your responses and determines the best path forward for your care.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Routing</h3>
              <p className="text-gray-600 text-sm">
                Get directed to AI support, professional therapy resources, or progress tracking based on your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600 text-sm">
                Receive ongoing support and track your progress with regular check-ins and AI insights.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Need Immediate Help?</h3>
            <p className="mb-4 opacity-90">
              If you're experiencing thoughts of self-harm or are in crisis, help is available 24/7.
            </p>
            <Link
              href="/emergency"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors inline-block font-medium"
            >
              Crisis Resources
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
            <p className="mb-4 opacity-90">
              Monitor your mental health journey with weekly check-ins and personalized insights.
            </p>
            <Link
              href="/progress"
              className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors inline-block font-medium"
            >
              Start Tracking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
