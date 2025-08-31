# MindfulCare - Mental Health Assessment & AI Support System

A comprehensive mental health assessment and intervention platform built with Next.js, TypeScript, and Ollama Llama3. This system provides AI-powered mental health support, professional therapy routing, and progress tracking according to a detailed mental health assessment flowchart.

## 🧠 Features

### Core Assessment System
- **Comprehensive Symptom Evaluation**: Multi-step assessment covering sleep, appetite, energy, social functioning, thoughts, and coping mechanisms
- **Quick Screenings**: PHQ-9 (depression) and GAD-7 (anxiety) assessments
- **AI-Powered Analysis**: Llama3 integration for intelligent symptom analysis and routing decisions
- **Smart Routing**: Automatic routing to AI support, human therapy, or stable condition based on assessment results

### AI Support System
- **Therapeutic Conversations**: AI-powered chat support using Ollama Llama3
- **Context-Aware Responses**: AI considers assessment history and symptom severity
- **Safety Monitoring**: Automatic detection of crisis situations with immediate routing to emergency resources

### Professional Integration
- **Human Therapy Resources**: Comprehensive directory of mental health professionals and resources
- **Crisis Support**: Immediate access to emergency hotlines and crisis resources
- **Insurance Guidance**: Information about mental health coverage and sliding scale options

### Progress Tracking
- **Weekly Check-ins**: Regular mood and symptom monitoring
- **AI Insights**: Automated analysis of progress patterns and recommendations
- **Assessment History**: Track changes over time with reassessment recommendations

## 🏗️ Architecture

The system follows the mental health assessment flowchart with these key components:

1. **Initial Assessment**: Mood and emotional stability evaluation
2. **Symptom Evaluation**: Comprehensive 7-step evaluation process
3. **Assessment Tools**: AI-powered analysis using Llama3
4. **Final Assessment & Routing**: Intelligent routing based on severity and symptoms
5. **Feedback Loop**: Progress monitoring and reassessment system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Ollama with Llama3 model installed
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindfulcare-nextjs-llama3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Ollama**
   ```bash
   # Install Ollama (if not already installed)
   # Visit: https://ollama.ai/
   
   # Pull the Llama3 model
   ollama pull llama3
   ```

4. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   OLLAMA_BASE_URL=http://localhost:11434
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Start Ollama**
   ```bash
   ollama serve
   ```

The application will be available at `http://localhost:3000`

## 🤖 AI Integration & Fallback Behavior

### Ollama Setup
The application uses Ollama with the Llama3 model for AI-powered mental health support. If Ollama is not running or the model is not available, the system gracefully falls back to predefined responses to ensure users always receive supportive guidance.

### Fallback Responses
When Ollama is unavailable, the system provides:
- **Therapeutic Chat**: Supportive, empathetic responses encouraging professional help
- **Symptom Analysis**: Basic assessment with general recommendations
- **Progress Insights**: Standard mental health guidance and monitoring tips

### Error Handling
- No red error banners or technical messages
- Graceful degradation to helpful fallback responses
- Maintains user experience even when AI services are unavailable
- Always prioritizes user safety and support

## 📁 Project Structure

```
mindfulcare-nextjs-llama3/
├── app/                          # Next.js app directory
│   ├── assess/                   # Assessment pages
│   │   ├── comprehensive/        # Full symptom evaluation
│   │   ├── phq9/                # Depression screening
│   │   └── gad7/                # Anxiety screening
│   ├── therapy/                  # Therapy support pages
│   │   ├── ai/                  # AI chat interface
│   │   └── human/               # Professional resources
│   ├── emergency/               # Crisis support page
│   ├── progress/                # Progress tracking
│   └── results/                 # Assessment results
├── components/                   # React components
│   ├── SymptomEvaluation.tsx    # Comprehensive assessment form
│   ├── AIChat.tsx              # AI chat interface
│   └── QuestionForm.tsx         # Quick assessment forms
├── lib/                         # Core functionality
│   ├── types.ts                 # TypeScript interfaces
│   ├── store.ts                 # Zustand state management
│   ├── ollama.ts                # Ollama integration
│   └── scoring.ts               # Assessment scoring logic
└── README.md                    # This file
```

## 🔧 Configuration

### Ollama Configuration

The system is configured to use Ollama with the Llama3 model. You can customize the model and settings in `lib/ollama.ts`:

```typescript
private model = 'llama3'; // Change to your preferred model
```

### Assessment Scoring

Scoring algorithms and routing logic can be customized in `lib/scoring.ts`. The system includes:

- PHQ-9 depression scoring
- GAD-7 anxiety scoring  
- Comprehensive symptom evaluation scoring
- Severity-based routing logic

## 🧪 Usage

### Taking an Assessment

1. **Start**: Visit the homepage and click "Start Comprehensive Assessment"
2. **Complete**: Go through the 7-step symptom evaluation process
3. **Analysis**: AI analyzes your responses and determines severity
4. **Routing**: Get directed to appropriate support based on results

### AI Support Chat

1. **Access**: Navigate to AI Support from assessment results
2. **Chat**: Engage in therapeutic conversations with the AI
3. **Context**: AI considers your assessment history and symptoms
4. **Safety**: Automatic crisis detection and emergency routing

### Progress Tracking

1. **Check-ins**: Complete weekly mood and symptom check-ins
2. **Insights**: Receive AI-generated progress insights
3. **History**: View your assessment and check-in history
4. **Reassessment**: Get recommendations for follow-up assessments

## 🔒 Safety Features

### Crisis Detection
- Automatic detection of suicidal ideation
- Immediate routing to emergency resources
- Crisis hotline integration (988, 911)

### Professional Routing
- Severe symptoms automatically route to human therapy
- Comprehensive resource directory
- Insurance and cost guidance

### Privacy
- Local storage for user data
- No external data transmission
- Client-side assessment processing

## 🤖 AI Integration

### Ollama Llama3 Features
- **Symptom Analysis**: Intelligent evaluation of assessment responses
- **Therapeutic Responses**: Context-aware chat support
- **Progress Insights**: Automated analysis of check-in data
- **Safety Monitoring**: Crisis detection and emergency routing

### Prompt Engineering
The system uses carefully crafted prompts for:
- Symptom severity analysis
- Therapeutic conversation generation
- Progress pattern recognition
- Crisis situation detection

## 🧪 Testing

### Manual Testing
1. **Assessment Flow**: Complete comprehensive assessment
2. **AI Chat**: Test therapeutic conversations
3. **Crisis Detection**: Verify emergency routing
4. **Progress Tracking**: Test weekly check-ins

### Ollama Testing
```bash
# Test Ollama connection
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

## 🚨 Emergency Resources

The system integrates with these crisis resources:
- **988**: Suicide & Crisis Lifeline
- **911**: Emergency Services
- **Crisis Text Line**: Text HOME to 741741
- **NAMI**: National Alliance on Mental Illness

## 📊 Assessment Tools

### Comprehensive Evaluation
- Sleep patterns and quality
- Appetite and motivation changes
- Energy levels and fatigue
- Behavioral changes
- Social functioning
- Thoughts and self-image
- Coping mechanisms

### Quick Screenings
- **PHQ-9**: 9-question depression screening
- **GAD-7**: 7-question anxiety screening

## 🔄 State Management

Uses Zustand for state management with persistence:
- Assessment results
- Chat history
- Progress tracking
- Session management

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: WCAG compliant components
- **Modern UI**: Clean, professional interface
- **Progress Indicators**: Visual feedback throughout assessments
- **Emergency Alerts**: Prominent crisis resource access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This system is for educational and screening purposes only. It does not provide medical diagnosis or treatment. Always consult with qualified mental health professionals for proper evaluation and care.

## 🆘 Crisis Support

If you're experiencing thoughts of self-harm or are in crisis:
- **Call 988** - Suicide & Crisis Lifeline (24/7)
- **Call 911** - Emergency Services
- **Text HOME to 741741** - Crisis Text Line

You are not alone, and help is available.
