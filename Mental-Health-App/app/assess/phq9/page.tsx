import QuestionForm from '@/components/QuestionForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure",
  "Trouble concentrating on things",
  "Moving or speaking slowly; or fidgety/restless",
  "Thoughts that you would be better off dead or hurting yourself"
];

export default function PHQ9() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-6">
          <Link 
            href="/assess" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assessments
          </Link>
        </div>
        
        <QuestionForm 
          title='PHQ-9 Depression Screening' 
          questions={questions} 
          storageKey='phq9' 
          next='/assess/gad7' 
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            This is a screening tool and does not provide a diagnosis. 
            For professional evaluation, please consult a mental health professional.
          </p>
        </div>
      </div>
    </div>
  );
}
