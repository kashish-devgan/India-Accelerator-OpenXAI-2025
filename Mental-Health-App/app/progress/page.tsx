"use client";
import { useState, useEffect } from 'react';
import { useAssessmentStore } from '@/lib/store';
import { OllamaService } from '@/lib/ollama';
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Heart, 
  Target, 
  Plus,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface WeeklyCheckin {
  id: string;
  date: Date;
  mood: number;
  symptoms: string[];
  copingStrategies: string[];
  notes: string;
}

interface ProgressInsights {
  insights: string[];
  recommendations: string[];
  reassessmentNeeded: boolean;
}

export default function ProgressPage() {
  const { currentAssessment, assessmentHistory, progressTracking } = useAssessmentStore();
  const [weeklyCheckins, setWeeklyCheckins] = useState<WeeklyCheckin[]>([]);
  const [insights, setInsights] = useState<ProgressInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCheckinForm, setShowCheckinForm] = useState(false);
  const [newCheckin, setNewCheckin] = useState({
    mood: 5,
    symptoms: [] as string[],
    copingStrategies: [] as string[],
    notes: ''
  });

  const ollamaService = OllamaService.getInstance();

  const symptomOptions = [
    'Anxiety', 'Depression', 'Sleep problems', 'Low energy', 
    'Irritability', 'Social withdrawal', 'Negative thoughts',
    'Appetite changes', 'Difficulty concentrating', 'Hopelessness'
  ];

  const copingOptions = [
    'Exercise', 'Meditation', 'Deep breathing', 'Talking to friends',
    'Journaling', 'Creative activities', 'Professional therapy',
    'Medication', 'Self-care activities', 'Support groups'
  ];

  useEffect(() => {
    // Load existing checkins from localStorage
    const savedCheckins = localStorage.getItem('weeklyCheckins');
    if (savedCheckins) {
      setWeeklyCheckins(JSON.parse(savedCheckins).map((checkin: any) => ({
        ...checkin,
        date: new Date(checkin.date)
      })));
    }
  }, []);

  useEffect(() => {
    if (weeklyCheckins.length > 0) {
      generateInsights();
    }
  }, [weeklyCheckins]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const moodHistory = weeklyCheckins.map(checkin => checkin.mood);
      const allSymptoms = weeklyCheckins.flatMap(checkin => checkin.symptoms);
      
      const progressData = {
        moodHistory,
        symptoms: [...new Set(allSymptoms)],
        checkins: weeklyCheckins
      };

      const aiInsights = await ollamaService.generateProgressInsights(progressData);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
      // Fallback insights
      setInsights({
        insights: ['Regular check-ins help track your mental health journey'],
        recommendations: ['Continue with your current coping strategies'],
        reassessmentNeeded: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCheckin = () => {
    const checkin: WeeklyCheckin = {
      id: `checkin_${Date.now()}`,
      date: new Date(),
      ...newCheckin
    };

    const updatedCheckins = [checkin, ...weeklyCheckins];
    setWeeklyCheckins(updatedCheckins);
    localStorage.setItem('weeklyCheckins', JSON.stringify(updatedCheckins));
    
    setNewCheckin({
      mood: 5,
      symptoms: [],
      copingStrategies: [],
      notes: ''
    });
    setShowCheckinForm(false);
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-green-600 bg-green-50';
    if (mood >= 6) return 'text-blue-600 bg-blue-50';
    if (mood >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 8) return 'Excellent';
    if (mood >= 6) return 'Good';
    if (mood >= 4) return 'Okay';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Monitor your mental health journey and track your progress over time. 
            Regular check-ins help identify patterns and celebrate improvements.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Total Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">{weeklyCheckins.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Average Mood</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weeklyCheckins.length > 0 
                    ? (weeklyCheckins.reduce((sum, c) => sum + c.mood, 0) / weeklyCheckins.length).toFixed(1)
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Latest Assessment</p>
                <p className="text-lg font-bold text-gray-900">
                  {currentAssessment ? currentAssessment.severity.replace('_', ' ') : 'None'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weeklyCheckins.length > 0 ? 
                    Math.min(weeklyCheckins.length, 7) : 0
                  } days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Check-in Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCheckinForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Weekly Check-in
          </button>
        </div>

        {/* Check-in Form */}
        {showCheckinForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Check-in</h2>
            
            {/* Mood Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How would you rate your overall mood this week? (1-10)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setNewCheckin(prev => ({ ...prev, mood: rating }))}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                      newCheckin.mood === rating
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Current: {newCheckin.mood}/10 - {getMoodLabel(newCheckin.mood)}
              </p>
            </div>

            {/* Symptoms */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What symptoms did you experience this week?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {symptomOptions.map((symptom) => (
                  <label key={symptom} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCheckin.symptoms.includes(symptom)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewCheckin(prev => ({
                            ...prev,
                            symptoms: [...prev.symptoms, symptom]
                          }));
                        } else {
                          setNewCheckin(prev => ({
                            ...prev,
                            symptoms: prev.symptoms.filter(s => s !== symptom)
                          }));
                        }
                      }}
                      className="text-blue-600"
                    />
                    <span className="text-sm">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Coping Strategies */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What coping strategies did you use this week?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {copingOptions.map((strategy) => (
                  <label key={strategy} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCheckin.copingStrategies.includes(strategy)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewCheckin(prev => ({
                            ...prev,
                            copingStrategies: [...prev.copingStrategies, strategy]
                          }));
                        } else {
                          setNewCheckin(prev => ({
                            ...prev,
                            copingStrategies: prev.copingStrategies.filter(s => s !== strategy)
                          }));
                        }
                      }}
                      className="text-green-600"
                    />
                    <span className="text-sm">{strategy}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional notes or observations
              </label>
              <textarea
                value={newCheckin.notes}
                onChange={(e) => setNewCheckin(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="How are you feeling? Any significant events or changes?"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddCheckin}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Check-in
              </button>
              <button
                onClick={() => setShowCheckinForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* AI Insights */}
        {insights && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
              <button
                onClick={generateInsights}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Progress Insights
                </h3>
                <ul className="space-y-2">
                  {insights.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {insights.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {insights.reassessmentNeeded && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    Consider taking a new assessment to track changes in your symptoms.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Check-in History */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Check-in History</h2>
          
          {weeklyCheckins.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No check-ins yet. Start tracking your progress!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {weeklyCheckins.map((checkin) => (
                <div key={checkin.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(checkin.mood)}`}>
                        {checkin.mood}/10 - {getMoodLabel(checkin.mood)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(checkin.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {checkin.symptoms.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
                      <div className="flex flex-wrap gap-1">
                        {checkin.symptoms.map((symptom, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {checkin.copingStrategies.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Coping Strategies:</p>
                      <div className="flex flex-wrap gap-1">
                        {checkin.copingStrategies.map((strategy, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {strategy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {checkin.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                      <p className="text-sm text-gray-600">{checkin.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/assess"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Take New Assessment
          </Link>
          <Link
            href="/therapy/ai"
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            AI Support Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
