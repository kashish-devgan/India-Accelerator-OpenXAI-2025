"use client";
import { useState } from 'react';
import { useAssessmentStore } from '@/lib/store';
import { Settings, Users, Database, Shield, BarChart3, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const { assessmentHistory, clearSession } = useAssessmentStore();
  const [activeTab, setActiveTab] = useState('overview');

  const totalAssessments = assessmentHistory.length;
  const severityBreakdown = assessmentHistory.reduce((acc, assessment) => {
    acc[assessment.severity] = (acc[assessment.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearSession();
      localStorage.clear();
      alert('All data has been cleared.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System management and analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{totalAssessments}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-2xl font-bold text-green-600">Online</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((JSON.stringify(assessmentHistory).length / 1024) * 100) / 100} KB
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'data', label: 'Data Management', icon: Database },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Assessment Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Severity Distribution</h3>
                    <div className="space-y-2">
                      {Object.entries(severityBreakdown).map(([severity, count]) => (
                        <div key={severity} className="flex justify-between items-center">
                          <span className="capitalize text-gray-700">{severity}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Recent Activity</h3>
                    <div className="space-y-2">
                      {assessmentHistory.slice(0, 5).map((assessment) => (
                        <div key={assessment.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">
                            {new Date(assessment.timestamp).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            assessment.severity === 'severe' ? 'bg-red-100 text-red-800' :
                            assessment.severity === 'moderately_severe' ? 'bg-orange-100 text-orange-800' :
                            assessment.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                            assessment.severity === 'mild' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {assessment.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <h3 className="font-medium text-red-800">Danger Zone</h3>
                  </div>
                  <p className="text-red-700 text-sm mb-4">
                    This will permanently delete all assessment data and user sessions.
                  </p>
                  <button
                    onClick={handleClearData}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Clear All Data
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Data Export</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Export assessment data for analysis (feature coming soon).
                  </p>
                  <button
                    disabled
                    className="bg-blue-600 text-white px-4 py-2 rounded-md opacity-50 cursor-not-allowed"
                  >
                    Export Data
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">AI Model</h3>
                      <p className="text-sm text-gray-600">Current: Built-in Support System</p>
                    </div>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Data Retention</h3>
                      <p className="text-sm text-gray-600">Local storage only</p>
                    </div>
                    <span className="text-blue-600 font-medium">Configured</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Privacy Mode</h3>
                      <p className="text-sm text-gray-600">No data sent to external servers</p>
                    </div>
                    <span className="text-green-600 font-medium">Enabled</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
