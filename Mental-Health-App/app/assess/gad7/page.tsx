import QuestionForm from '@/components/QuestionForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const questions = [
  "Feeling nervous, anxious or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
];

export default function GAD7() {
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
          title='GAD-7 Anxiety Screening' 
          questions={questions} 
          storageKey='gad7' 
          next='/results' 
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
