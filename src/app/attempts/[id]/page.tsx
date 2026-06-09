'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar/Navbar';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faArrowLeft,
  faCheck,
  faTimes,
  faCircleCheck,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons';

export default function AttemptResultPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/attempts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const result = await res.json();

        if (!res.ok) {
          setError(result.message || 'Failed to fetch results');
          return;
        }

        setData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading your results...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="text-red-500 text-5xl mb-4">
             <FontAwesomeIcon icon={faCircleXmark} />
          </div>
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard')} >
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );

  if (!data) return null;

  const totalQuestions = data.questions?.length || data.total_questions;

  const scorePercentage = Math.round(
    (data.score / totalQuestions) * 100
  );

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="max-w-4xl mx-auto py-12 px-4">
          {/* HEADER SUMMARY */}
          <Card className="mb-10 overflow-hidden border-none shadow-lg">
            <div className={`h-2 ${scorePercentage >= 50 ? 'bg-green-500' : 'bg-red-500'}`} />
            <div className="p-8 md:p-12 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl ${
                scorePercentage >= 50 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <FontAwesomeIcon icon={faTrophy} />
              </div>

              <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                {data.assessment_title}
              </h1>
              <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                {data.assessment_description || 'Assessment Review'}
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-10">
                <div className="text-center">
                  <div className={`text-6xl font-black mb-1 ${
                    scorePercentage >= 50 ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {scorePercentage}%
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Final Score</div>
                </div>

                <div className="h-12 w-px bg-slate-200 hidden md:block" />

                <div className="flex gap-10">
                   <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">{data.score} / {totalQuestions}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${scorePercentage >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                      {scorePercentage >= 50 ? 'PASSED' : 'FAILED'}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Result</div>
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={() => router.push('/dashboard')}
                icon={faArrowLeft}
              >
                Back to Dashboard
              </Button>
            </div>
          </Card>

          {/* QUESTIONS LIST */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider">
                Detailed Review
              </h2>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                {data.questions.length} Questions
              </span>
            </div>

            {data.questions.map((q: any, idx: number) => {
              const isCorrect = q.options.find((o: any) => o.id === q.selected_option_id)?.is_correct;

              return (
                <Card key={q.question_id} className="p-0 overflow-hidden border-none shadow-md">
                   <div className={`p-6 md:p-8 ${isCorrect ? 'bg-white' : 'bg-red-50/30'}`}>
                    <div className="flex justify-between items-start gap-4 mb-6">
                      <div className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                          {q.question_number || idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-800 leading-tight">
                          {q.question_text}
                        </h3>
                      </div>
                      
                      <div className={`flex-shrink-0 text-2xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        <FontAwesomeIcon icon={isCorrect ? faCircleCheck : faCircleXmark} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt: any) => {
                        const isSelected = opt.id === q.selected_option_id;
                        const isCorrectOpt = opt.is_correct;
                        
                        let stateClass = "border-slate-100 bg-slate-50 text-slate-600";
                        let icon = null;

                        if (isCorrectOpt) {
                          stateClass = "border-green-200 bg-green-50 text-green-700 ring-1 ring-green-500/20";
                        } else if (isSelected && !isCorrectOpt) {
                          stateClass = "border-red-200 bg-red-50 text-red-700 ring-1 ring-red-500/20";
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-4 border rounded-xl text-sm flex justify-between items-center transition-all ${stateClass}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-bold opacity-50">{opt.label}.</span>
                              <span className={isCorrectOpt || isSelected ? 'font-bold' : ''}>{opt.text}</span>
                            </div>
                            
                            {isCorrectOpt && (
                              <span className="text-[9px] bg-green-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                                Correct
                              </span>
                            )}
                            {isSelected && !isCorrectOpt && (
                              <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                                Your Pick
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="primary"
             
              onClick={() => router.push('/dashboard')}
            >
              Finish Review
            </Button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
