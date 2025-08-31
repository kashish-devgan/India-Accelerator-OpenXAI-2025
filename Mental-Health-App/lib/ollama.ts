import axios from 'axios';
import { AssessmentResult, SymptomEvaluation, ChatMessage } from './types';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export class OllamaService {
  private static instance: OllamaService;
  private model = 'llama3.2:1b'; // Using smaller model that requires less memory

  private constructor() {}

  public static getInstance(): OllamaService {
    if (!OllamaService.instance) {
      OllamaService.instance = new OllamaService();
    }
    return OllamaService.instance;
  }

  async generateResponse(prompt: string): Promise<string> {
    // Check if Ollama is available first
    const isAvailable = await this.isOllamaAvailable();
    
    if (!isAvailable) {
      // Skip the API call entirely and go straight to fallback
      return this.getFallbackResponse(prompt);
    }
    
    try {
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model: this.model,
        prompt: this.formatPrompt(prompt),
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000,
        }
      });

      return response.data.response;
    } catch (error: any) {
      console.error('Error calling Ollama:', error);
      
      // Check if it's a memory issue
      if (error.response?.data?.error?.includes('system memory')) {
        console.warn('Memory issue detected - using fallback responses');
        return this.getFallbackResponse(prompt);
      }
      
      // Return a helpful fallback response instead of throwing
      return this.getFallbackResponse(prompt);
    }
  }

  // Method to check if Ollama is available
  async isOllamaAvailable(): Promise<boolean> {
    try {
      await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
      return true;
    } catch (error) {
      return false;
    }
  }

  private getFallbackResponse(prompt: string): string {
    // Extract the user's message from the prompt
    const userMessageMatch = prompt.match(/User: (.+?)(?:\n|$)/);
    const userMessage = userMessageMatch ? userMessageMatch[1].toLowerCase() : '';
    
    // Check if this is a therapeutic chat prompt
    if (prompt.includes('User:') && (prompt.includes('Provide a supportive, therapeutic response') || prompt.includes('therapeutic response'))) {
      
      // Handle specific requests
      if (userMessage.includes('self care') || userMessage.includes('self-care')) {
        if (userMessage.includes('plan') || userMessage.includes('5 day') || userMessage.includes('5-day')) {
          return `I'd be happy to help you create a 5-day self-care plan! Here's a structured approach:

**Day 1 - Physical Wellness:**
• Take a 20-minute walk outside
• Drink 8 glasses of water
• Get 7-8 hours of sleep
• Practice 10 minutes of gentle stretching

**Day 2 - Emotional Wellness:**
• Write down 3 things you're grateful for
• Listen to your favorite music
• Call or text a friend or family member
• Practice deep breathing for 5 minutes

**Day 3 - Mental Wellness:**
• Read a book or article you enjoy
• Try a new hobby or activity
• Limit social media to 30 minutes
• Practice mindfulness meditation

**Day 4 - Social Wellness:**
• Reach out to someone you haven't talked to recently
• Join a group activity or class
• Practice active listening in conversations
• Express appreciation to someone

**Day 5 - Spiritual/Personal Wellness:**
• Reflect on your values and goals
• Spend time in nature
• Practice self-compassion
• Plan something to look forward to

Remember to adjust this plan based on what feels right for you. Self-care is personal and should be tailored to your needs and preferences.`;
        }
        
        return `I'd be happy to help you with self-care! Here are some general self-care strategies you can try:

**Physical Self-Care:**
• Regular exercise (even just walking)
• Adequate sleep (7-9 hours)
• Healthy eating habits
• Taking breaks when needed

**Emotional Self-Care:**
• Journaling your thoughts and feelings
• Talking to trusted friends or family
• Practicing gratitude
• Allowing yourself to feel emotions

**Mental Self-Care:**
• Reading books you enjoy
• Learning something new
• Limiting screen time
• Engaging in creative activities

**Social Self-Care:**
• Spending time with loved ones
• Setting healthy boundaries
• Joining groups or communities
• Asking for help when needed

Would you like me to help you create a specific self-care plan or focus on any particular area?`;
      }
      
      if (userMessage.includes('anxiety') || userMessage.includes('stress')) {
        return `I understand anxiety and stress can be really challenging. Here are some immediate strategies that might help:

**Quick Relief Techniques:**
• **4-7-8 Breathing**: Inhale for 4 counts, hold for 7, exhale for 8
• **5-4-3-2-1 Grounding**: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste
• **Progressive Muscle Relaxation**: Tense and release each muscle group

**Daily Practices:**
• Regular exercise (even 10 minutes helps)
• Consistent sleep schedule
• Limit caffeine and alcohol
• Practice mindfulness or meditation

**When to Seek Professional Help:**
• If anxiety interferes with daily life
• If you experience panic attacks
• If you have persistent worry or fear
• If self-help strategies aren't enough

Remember, it's completely normal to experience anxiety, and seeking professional help is a sign of strength. Would you like to talk more about what's causing your anxiety?`;
      }
      
      if (userMessage.includes('depression') || userMessage.includes('sad') || userMessage.includes('down')) {
        return `I hear you, and I want you to know that what you're feeling is real and valid. Depression can be incredibly difficult to navigate alone. Here are some strategies that might help:

**Immediate Steps:**
• **Small Wins**: Focus on one small task each day
• **Routine**: Try to maintain a regular sleep and meal schedule
• **Movement**: Even a short walk can help boost mood
• **Connection**: Reach out to someone you trust

**Self-Care Strategies:**
• Practice self-compassion - be kind to yourself
• Engage in activities you used to enjoy
• Spend time in nature if possible
• Consider talking to a mental health professional

**Important Reminders:**
• Depression is treatable
• You don't have to face this alone
• Seeking help is a sign of strength, not weakness
• Your feelings are temporary, even if they don't feel that way

If you're having thoughts of self-harm, please call 988 (Suicide & Crisis Lifeline) immediately. You matter, and there are people who want to help you.`;
      }
      
             if (userMessage.includes('sleep') || userMessage.includes('insomnia')) {
         return `Sleep issues can really impact your overall well-being. Here are some strategies that might help:

**Sleep Hygiene Tips:**
• **Consistent Schedule**: Go to bed and wake up at the same time daily
• **Bedroom Environment**: Keep it cool, dark, and quiet
• **Screen Time**: Avoid screens 1 hour before bed
• **Caffeine**: Avoid caffeine after 2 PM

**Relaxation Techniques:**
• **Deep Breathing**: 4-7-8 breathing technique
• **Progressive Muscle Relaxation**: Tense and release muscles
• **Mindfulness**: Focus on your breath
• **Reading**: A physical book (not digital)

**Pre-Bed Routine:**
• Take a warm bath or shower
• Write down worries or to-dos
• Practice gentle stretching
• Listen to calming music

**When to Seek Help:**
• If sleep problems persist for weeks
• If they affect daily functioning
• If you experience excessive daytime sleepiness
• If you have other concerning symptoms

Would you like to talk more about what might be affecting your sleep?`;
       }
       
       if (userMessage.includes('panic') || userMessage.includes('panic attack')) {
         return `Panic attacks can be very frightening, but they are treatable. Here's what you can do:

**During a Panic Attack:**
• **Grounding**: Focus on your senses - what you see, hear, touch, smell
• **Breathing**: Slow, deep breaths - inhale for 4, hold for 4, exhale for 6
• **Remind yourself**: "This will pass" - panic attacks typically peak within 10 minutes
• **Stay where you are**: Don't try to escape unless you're in danger

**Immediate Techniques:**
• **5-4-3-2-1 Method**: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste
• **Progressive Muscle Relaxation**: Tense and release each muscle group
• **Cold water**: Splash cold water on your face or hold an ice cube

**Prevention Strategies:**
• Regular exercise and stress management
• Avoid caffeine, alcohol, and smoking
• Practice mindfulness or meditation
• Maintain regular sleep patterns

**When to Seek Emergency Help:**
• If you think you're having a heart attack
• If symptoms are severe or don't improve
• If you're having thoughts of self-harm

Remember, panic attacks are not dangerous, but they can be very distressing. Professional help can teach you effective coping strategies.`;
       }
       
       if (userMessage.includes('lonely') || userMessage.includes('loneliness') || userMessage.includes('alone')) {
         return `Loneliness is a very real and painful experience that many people go through. Here are some ways to cope:

**Immediate Steps:**
• **Reach out**: Call a friend, family member, or acquaintance
• **Join online communities**: Find groups with shared interests
• **Volunteer**: Helping others can create meaningful connections
• **Get outside**: Even brief social interactions can help

**Building Connections:**
• **Start small**: Say hello to neighbors, cashiers, or coworkers
• **Join activities**: Classes, clubs, or groups that interest you
• **Use technology**: Video calls, social media, or gaming communities
• **Consider a pet**: Animals can provide companionship and purpose

**Self-Care During Loneliness:**
• Practice self-compassion - be kind to yourself
• Engage in activities you enjoy
• Maintain routines and structure
• Consider journaling your thoughts and feelings

**When to Seek Help:**
• If loneliness persists despite efforts to connect
• If it's affecting your daily functioning
• If you're experiencing depression or anxiety
• If you need help building social skills

Remember, feeling lonely is completely normal and doesn't mean there's anything wrong with you. Many people experience this, and there are ways to work through it.`;
       }
       
       if (userMessage.includes('grief') || userMessage.includes('loss') || userMessage.includes('death')) {
         return `Grief is a deeply personal experience, and there's no "right" way to grieve. Here are some thoughts that might help:

**Understanding Grief:**
• **It's normal**: Grief affects everyone differently
• **No timeline**: There's no set time for "getting over" loss
• **Complex emotions**: Anger, guilt, relief, and sadness are all normal
• **Physical symptoms**: Fatigue, appetite changes, and sleep issues are common

**Coping Strategies:**
• **Express your feelings**: Talk, write, cry, or create art
• **Take care of yourself**: Eat, sleep, and move your body when possible
• **Accept help**: Let others support you
• **Honor your loved one**: Find meaningful ways to remember them

**Self-Care During Grief:**
• Be patient with yourself
• Don't judge your feelings
• Take things one day at a time
• Consider joining a grief support group

**When to Seek Professional Help:**
• If grief is interfering with daily life for months
• If you're having thoughts of self-harm
• If you're using substances to cope
• If you need help processing complex emotions

Remember, grief is a sign of love. Your feelings are valid, and it's okay to need support during this difficult time.`;
       }
      
      // Default supportive responses for other topics
      const responses = [
        "I understand you're reaching out for support, and I want you to know that your feelings are valid. While I'm here to listen and offer general guidance, I encourage you to also consider speaking with a mental health professional who can provide more specialized support. Remember that you're not alone, and there are people who care about you and want to help.",
        
        "Thank you for sharing that with me. It takes courage to open up about your feelings. I want you to know that what you're experiencing is real and important. While I can offer supportive listening and general guidance, I'd encourage you to consider speaking with a mental health professional who can provide more specialized care. You deserve support, and there are people ready to help.",
        
        "I hear you, and I want you to know that your feelings matter. It's completely normal to struggle sometimes, and reaching out for support is a strong and healthy thing to do. While I'm here to listen and offer general guidance, I'd recommend connecting with a mental health professional who can provide more specialized support. You're not alone in this journey.",
        
        "I appreciate you sharing this with me. Your feelings are valid, and it's okay to not be okay sometimes. While I can provide supportive listening and general guidance, I'd encourage you to consider speaking with a mental health professional who can offer more specialized support. Remember, seeking help is a sign of strength, not weakness."
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Check if this is a symptom analysis prompt
    if (prompt.includes('Analyze the following mental health evaluation')) {
      return JSON.stringify({
        severity: "mild",
        symptoms: ["General mood changes", "Sleep disturbances"],
        recommendations: ["Consider professional evaluation", "Practice self-care", "Maintain regular sleep schedule"],
        routeTo: "ai_support"
      });
    }
    
    // Default fallback response
    return "I'm here to support you. While I'm experiencing some technical difficulties, I want you to know that your mental health matters. Please consider reaching out to a mental health professional for immediate support, or try our other assessment tools to get started.";
  }

  async analyzeSymptoms(evaluation: SymptomEvaluation): Promise<{
    severity: AssessmentResult['severity'];
    symptoms: string[];
    recommendations: string[];
    routeTo: AssessmentResult['routeTo'];
  }> {
    const prompt = this.createSymptomAnalysisPrompt(evaluation);
    const response = await this.generateResponse(prompt);
    
    try {
      // Parse the JSON response from the AI
      const analysis = JSON.parse(response);
      return {
        severity: analysis.severity,
        symptoms: analysis.symptoms,
        recommendations: analysis.recommendations,
        routeTo: analysis.routeTo
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Fallback analysis
      return this.fallbackAnalysis(evaluation);
    }
  }

  async generateTherapeuticResponse(
    message: string,
    context: {
      assessment: AssessmentResult;
      sessionHistory: ChatMessage[];
    }
  ): Promise<string> {
    const prompt = this.createTherapeuticPrompt(message, context);
    return await this.generateResponse(prompt);
  }

  async generateProgressInsights(
    progressData: {
      moodHistory: number[];
      symptoms: string[];
      checkins: any[];
    }
  ): Promise<{
    insights: string[];
    recommendations: string[];
    reassessmentNeeded: boolean;
  }> {
    const prompt = this.createProgressAnalysisPrompt(progressData);
    const response = await this.generateResponse(prompt);
    
    try {
      const analysis = JSON.parse(response);
      return {
        insights: analysis.insights,
        recommendations: analysis.recommendations,
        reassessmentNeeded: analysis.reassessmentNeeded
      };
    } catch (error) {
      return {
        insights: ['Progress monitoring is important for recovery'],
        recommendations: ['Continue with current treatment plan'],
        reassessmentNeeded: false
      };
    }
  }

  private formatPrompt(prompt: string): string {
    return `You are a compassionate mental health AI assistant. Provide helpful, supportive, and evidence-based responses. Always prioritize safety and recommend professional help when appropriate.

${prompt}

Remember to be empathetic, non-judgmental, and supportive in your response.`;
  }

  private createSymptomAnalysisPrompt(evaluation: SymptomEvaluation): string {
    return `Analyze the following mental health evaluation and provide a structured response in JSON format:

Sleep Patterns: Quality ${evaluation.sleepPatterns?.quality || 0}/4, Duration ${evaluation.sleepPatterns?.duration || 0}/4
Appetite Changes: ${evaluation.appetite?.changes || 0}/4, Motivation ${evaluation.appetite?.motivation || 0}/4
Energy Level: ${evaluation.energy?.level || 0}/4, Fatigue ${evaluation.energy?.fatigue || 0}/4
Social Functioning: ${evaluation.social?.functioning || 0}/4, Isolation ${evaluation.social?.isolation || 0}/4
Self-Image: ${evaluation.thoughts?.selfImage || 0}/4
Coping Effectiveness: ${evaluation.coping?.effectiveness || 0}/4

Suicidal Ideation: Thoughts ${evaluation.thoughts?.suicidalIdeation?.thoughts || false}, Plan ${evaluation.thoughts?.suicidalIdeation?.plan || false}, Intent ${evaluation.thoughts?.suicidalIdeation?.intent || false}

Provide a JSON response with:
{
  "severity": "minimal|mild|moderate|moderately_severe|severe",
  "symptoms": ["list of identified symptoms"],
  "recommendations": ["list of recommendations"],
  "routeTo": "ai_support|human_therapy|stable"
}

Route to human_therapy if suicidal ideation is present or severity is moderate or higher. Route to ai_support for mild symptoms. Route to stable for minimal symptoms.`;
  }

  private createTherapeuticPrompt(
    message: string,
    context: { assessment: AssessmentResult; sessionHistory: ChatMessage[] }
  ): string {
    const recentHistory = context.sessionHistory.slice(-5);
    const historyText = recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    return `Context: User has ${context.assessment.severity} symptoms including ${context.assessment.symptoms.join(', ')}.

Recent conversation:
${historyText}

User: ${message}

Provide a supportive, therapeutic response that:
1. Acknowledges their feelings
2. Offers coping strategies
3. Encourages professional help if needed
4. Maintains a warm, empathetic tone`;
  }

  private createProgressAnalysisPrompt(progressData: any): string {
    return `Analyze this progress data and provide insights:

Mood History: ${progressData.moodHistory.join(', ')}
Current Symptoms: ${progressData.symptoms.join(', ')}
Number of Check-ins: ${progressData.checkins.length}

Provide JSON response:
{
  "insights": ["list of progress insights"],
  "recommendations": ["list of recommendations"],
  "reassessmentNeeded": true/false
}`;
  }

  private fallbackAnalysis(evaluation: SymptomEvaluation): {
    severity: AssessmentResult['severity'];
    symptoms: string[];
    recommendations: string[];
    routeTo: AssessmentResult['routeTo'];
  } {
    const totalScore = 
      (evaluation.sleepPatterns?.quality || 0) + (evaluation.sleepPatterns?.duration || 0) +
      (evaluation.appetite?.changes || 0) + (evaluation.appetite?.motivation || 0) +
      (evaluation.energy?.level || 0) + (evaluation.energy?.fatigue || 0) +
      (evaluation.social?.functioning || 0) + (evaluation.social?.isolation || 0) +
      (evaluation.thoughts?.selfImage || 0) + (evaluation.coping?.effectiveness || 0);

    let severity: AssessmentResult['severity'] = 'minimal';
    let routeTo: AssessmentResult['routeTo'] = 'stable';

    if (totalScore >= 30) {
      severity = 'severe';
      routeTo = 'human_therapy';
    } else if (totalScore >= 20) {
      severity = 'moderate';
      routeTo = 'human_therapy';
    } else if (totalScore >= 10) {
      severity = 'mild';
      routeTo = 'ai_support';
    }

    // Immediate routing to human therapy for suicidal ideation
    if (evaluation.thoughts?.suicidalIdeation?.thoughts || 
        evaluation.thoughts?.suicidalIdeation?.plan || 
        evaluation.thoughts?.suicidalIdeation?.intent) {
      routeTo = 'human_therapy';
      severity = 'severe';
    }

    return {
      severity,
      symptoms: ['Mood changes', 'Sleep disturbances', 'Energy changes'],
      recommendations: ['Consider professional evaluation', 'Practice self-care'],
      routeTo
    };
  }
}
