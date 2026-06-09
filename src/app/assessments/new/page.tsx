'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question } from '@/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar/Navbar';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faArrowLeft, faSave, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function NewAssessmentPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
  });
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const uploadData = new FormData();
    uploadData.append('pdf', file);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData,
      });

      const res = await response.json();

      if (!response.ok) {
        setError(res.message);
        return;
      }
      

      setQuestions(res.data);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          questions,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        setError(res.message);
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  return (
    <ProtectedRoute allowedRoles={['LECTURER']}>
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Create New Assessment</h1>

        {step === 1 && (
          <Card className="text-center py-16 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 text-3xl">
              <FontAwesomeIcon icon={faCloudUploadAlt} />
            </div>
            <h3 className="text-xl font-bold mb-2">Step 1: Upload PDF</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Upload a document to automatically generate questions based on the content.</p>
            {error && (
              <div className="w-full max-w-sm p-3 bg-red-50 text-red-500 rounded-md text-sm border border-red-100 mb-6">
                {error}
              </div>
            )}
            <input 
              type="file" 
              accept=".pdf" 
              id="pdf-upload" 
              onChange={handleFileUpload}
              hidden
            />
            <label 
              htmlFor="pdf-upload" 
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold cursor-pointer hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              {loading ? 'Processing Document...' : 'Choose PDF File'}
            </label>
          </Card>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-8">
            <Card title="Step 2: Assessment Details" className="flex flex-col gap-4 border-t-4 border-t-blue-600">
              <Input
                label="Assessment Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Midterm Physics Quiz"
                required
              />
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide a brief overview for students"
              />
              <Input
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </Card>

            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Review Generated Questions</h3>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">{questions.length} Questions</span>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm border border-red-100">
                  {error}
                </div>
              )}

              {questions.map((q, qIndex) => (
                <Card key={qIndex} className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-200"></div>
                  <div className="flex flex-col gap-4">
                    <Input
                      label={`Question ${qIndex + 1}`}
                      value={q.text}
                      onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {q.options?.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3 p-2 rounded-md border border-slate-100 bg-slate-50/50">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            className="w-4 h-4 text-blue-600"
                            checked={q.correctOption === oIndex}
                            onChange={() => updateQuestion(qIndex, 'correctOption', oIndex)}
                          />
                          <input
                            className="flex-1 bg-transparent border-none text-sm focus:ring-0 p-0"
                            value={opt.text}
                            onChange={(e) => {
                              const newOpts = [...(q.options || [])];
                              newOpts[oIndex] = {
    ...newOpts[oIndex],
    text: e.target.value,
  };
                              updateQuestion(qIndex, 'options', newOpts);
                            }}
                          />
                          {q.correctOption === oIndex && (
                            <FontAwesomeIcon icon={faCheck} className="text-green-500 text-xs" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="flex justify-between items-center mt-6 sticky bottom-6 bg-white p-4 rounded-lg border border-slate-200 shadow-xl">
                <Button variant="secondary" onClick={() => setStep(1)} icon={faArrowLeft}>
                  Back
                </Button>
                <Button onClick={handleSave} isLoading={loading} icon={faSave} className="px-10">
                  Save & Finish
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
