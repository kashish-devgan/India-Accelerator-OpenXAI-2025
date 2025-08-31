"use client";
import { useState, useRef, useEffect } from 'react';
import { useAssessmentStore } from '@/lib/store';
import { OllamaService } from '@/lib/ollama';
import { ChatMessage } from '@/lib/types';
import { Send, Bot, User, Loader2, RefreshCw, MessageSquare } from 'lucide-react';

export default function AIChat() {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    currentAssessment, 
    chatMessages, 
    addChatMessage, 
    startSession, 
    currentSession 
  } = useAssessmentStore();

  const ollamaService = OllamaService.getInstance();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Check if Ollama is available
  useEffect(() => {
    const checkOllama = async () => {
      const available = await ollamaService.isOllamaAvailable();
      setOllamaAvailable(available);
    };
    checkOllama();
  }, [ollamaService]);

  // Initialize session if not already started
  useEffect(() => {
    if (!currentSession) {
      const sessionId = currentAssessment?.id || `session_${Date.now()}`;
      startSession('ai_support', sessionId);
    }
  }, [currentSession, currentAssessment, startSession]);

  // Send welcome message
  useEffect(() => {
    if (currentSession && chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: currentAssessment 
          ? `Hello! I'm here to support you on your mental health journey. I understand you're experiencing ${currentAssessment.severity} symptoms including ${currentAssessment.symptoms.slice(0, 3).join(', ')}. 

How are you feeling today? I'm here to listen and provide supportive guidance. Remember, I'm an AI assistant and while I can offer helpful strategies, I'm not a replacement for professional mental health care.`
          : `Hello! I'm here to support you on your mental health journey. 

How are you feeling today? I'm here to listen and provide supportive guidance. Remember, I'm an AI assistant and while I can offer helpful strategies, I'm not a replacement for professional mental health care.`,
        timestamp: new Date()
      };
      addChatMessage(welcomeMessage);
    }
  }, [currentSession, chatMessages.length, currentAssessment, addChatMessage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    addChatMessage(userMessage);
    const messageToSend = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Always try to get an AI response, even without assessment data
    const aiResponse = await ollamaService.generateTherapeuticResponse(
      messageToSend,
      {
        assessment: currentAssessment || {
          id: 'default',
          timestamp: new Date(),
          scores: {},
          severity: 'mild',
          symptoms: ['General mood changes'],
          recommendations: ['Consider professional evaluation'],
          routeTo: 'ai_support'
        },
        sessionHistory: chatMessages
      }
    );

    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}_ai`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    addChatMessage(assistantMessage);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const retryLastMessage = async () => {
    if (chatMessages.length === 0) return;
    
    const lastUserMessage = [...chatMessages].reverse().find(msg => msg.role === 'user');
    if (lastUserMessage) {
      setInputMessage(lastUserMessage.content);
      // Remove the last user message and any subsequent error messages
      // This would require additional state management to track message history
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                             <h1 className="text-xl font-semibold text-gray-900">AI Mental Health Support</h1>
               <p className="text-sm text-gray-600">
                 {currentAssessment 
                   ? `${currentAssessment.severity} symptoms • ${currentAssessment.symptoms.length} identified`
                   : 'General support • No assessment data'
                 }
                 {ollamaAvailable === false && (
                   <span className="ml-2 text-green-600">• Built-in Support Active</span>
                 )}
                 {ollamaAvailable === true && (
                   <span className="ml-2 text-blue-600">• Enhanced AI Available</span>
                 )}
               </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={retryLastMessage}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Retry last message"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === 'assistant' && (
                  <Bot className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
                {message.role === 'user' && (
                  <User className="w-5 h-5 text-blue-100 mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}



        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
                 {/* Safety notice */}
         <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
           <div className="flex items-start gap-2">
             <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
             <div className="text-xs text-yellow-800">
               <p className="font-medium">Important:</p>
               <p>
                 This AI assistant provides supportive guidance but is not a replacement for professional mental health care. 
                 If you're in crisis or having thoughts of self-harm, please call 988 (Suicide & Crisis Lifeline) or 911 immediately.
               </p>
             </div>
           </div>
         </div>

         {/* Ollama setup notice */}
         {ollamaAvailable === false && (
           <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
             <div className="flex items-start gap-2">
               <MessageSquare className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
               <div className="text-xs text-green-800">
                 <p className="font-medium">Built-in Support Active:</p>
                 <p>
                   You're using our comprehensive built-in mental health support system with specialized responses for anxiety, 
                   depression, self-care, and more. For enhanced AI responses, you can optionally install Ollama and a smaller model 
                   like <code className="bg-green-100 px-1 rounded">llama3.2:1b</code> (requires ~2GB RAM).
                 </p>
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
