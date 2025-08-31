"use client";
import { useAssessmentStore } from '@/lib/store';
import { BarChart3, Calendar, TrendingUp, Activity, FileText, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { assessmentHistory, progressTracking } = useAssessmentStore();

  const recentAssessments = assessmentHistory.slice(0, 5);
  const totalAssessments = assessmentHistory.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your mental health journey and progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{totalAssessments}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressTracking?.weeklyCheckins?.length || 0} weeks
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Mood</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressTracking?.weeklyCheckins && progressTracking.weeklyCheckins.length > 0 
                    ? Math.round(progressTracking.weeklyCheckins.reduce((sum, checkin) => sum + checkin.mood, 0) / progressTracking.weeklyCheckins.length)
                    : 'N/A'
                  }/10
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Check-in</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressTracking?.nextAssessmentDate 
                    ? new Date(progressTracking.nextAssessmentDate).toLocaleDateString()
                    : 'Not scheduled'
                  }
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/assess/comprehensive" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">New Assessment</h3>
                <p className="text-sm text-gray-600">Take a comprehensive evaluation</p>
              </div>
            </div>
          </Link>

          <Link href="/therapy/ai" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Chat</h3>
                <p className="text-sm text-gray-600">Talk to our AI therapist</p>
              </div>
            </div>
          </Link>

          <Link href="/progress" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Progress</h3>
                <p className="text-sm text-gray-600">View your progress over time</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Assessments</h2>
          {recentAssessments.length > 0 ? (
            <div className="space-y-4">
              {recentAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {assessment.severity.charAt(0).toUpperCase() + assessment.severity.slice(1)} Severity
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(assessment.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assessment.severity === 'severe' ? 'bg-red-100 text-red-800' :
                      assessment.severity === 'moderately_severe' ? 'bg-orange-100 text-orange-800' :
                      assessment.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      assessment.severity === 'mild' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {assessment.severity}
                    </span>
                    <Link 
                      href="/results" 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No assessments yet</p>
              <Link 
                href="/assess/comprehensive" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Take your first assessment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
