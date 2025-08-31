import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AssessmentResult, SymptomEvaluation, TherapySession, ChatMessage, ProgressTracking } from './types';

interface AssessmentState {
  // Current assessment data
  currentAssessment: AssessmentResult | null;
  symptomEvaluation: SymptomEvaluation | null;
  
  // Session management
  currentSession: TherapySession | null;
  chatMessages: ChatMessage[];
  
  // Progress tracking
  progressTracking: ProgressTracking | null;
  
  // Assessment history
  assessmentHistory: AssessmentResult[];
  
  // Actions
  setCurrentAssessment: (assessment: AssessmentResult) => void;
  setSymptomEvaluation: (evaluation: SymptomEvaluation) => void;
  startSession: (type: 'ai_support' | 'human_therapy', assessmentId: string) => void;
  endSession: () => void;
  addChatMessage: (message: ChatMessage) => void;
  updateProgress: (progress: Partial<ProgressTracking>) => void;
  addAssessmentToHistory: (assessment: AssessmentResult) => void;
  clearSession: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentAssessment: null,
      symptomEvaluation: null,
      currentSession: null,
      chatMessages: [],
      progressTracking: null,
      assessmentHistory: [],

      // Actions
      setCurrentAssessment: (assessment) => {
        set({ currentAssessment: assessment });
        get().addAssessmentToHistory(assessment);
      },

      setSymptomEvaluation: (evaluation) => {
        set({ symptomEvaluation: evaluation });
      },

      startSession: (type, assessmentId) => {
        const session: TherapySession = {
          id: `session_${Date.now()}`,
          assessmentId,
          type,
          startTime: new Date(),
          messages: [],
          progress: {
            mood: 5,
            symptoms: [],
            improvements: []
          }
        };
        set({ currentSession: session, chatMessages: [] });
      },

      endSession: () => {
        const { currentSession } = get();
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            endTime: new Date()
          };
          set({ currentSession: updatedSession });
        }
      },

      addChatMessage: (message) => {
        set((state) => ({
          chatMessages: [...state.chatMessages, message]
        }));
        
        // Update session messages
        const { currentSession } = get();
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            messages: [...currentSession.messages, message]
          };
          set({ currentSession: updatedSession });
        }
      },

      updateProgress: (progress) => {
        set((state) => ({
          progressTracking: {
            ...state.progressTracking,
            ...progress
          } as ProgressTracking
        }));
      },

      addAssessmentToHistory: (assessment) => {
        set((state) => ({
          assessmentHistory: [assessment, ...state.assessmentHistory.slice(0, 9)] // Keep last 10
        }));
      },

      clearSession: () => {
        set({
          currentSession: null,
          chatMessages: [],
          symptomEvaluation: null
        });
      }
    }),
    {
      name: 'mindfulcare-storage',
      partialize: (state) => ({
        assessmentHistory: state.assessmentHistory,
        progressTracking: state.progressTracking
      })
    }
  )
);
