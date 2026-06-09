'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Assessment, Question } from '@/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar/Navbar';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function TakeAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const [assessRes, questRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments/${id}/questions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const assessData = await assessRes.json();
        const questData = await questRes.json();

        if (!assessRes.ok) {
          setError(assessData.message);
          return;
        }

        if (!questRes.ok) {
          setError(questData.message);
          return;
        }

        setAssessment(assessData.data);
        setQuestions(questData.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit your answers?')) return;

    setSubmitting(true);
    setError('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/attempts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            assessmentId: id,
            answers,
          }),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        setError(res.message);
        return;
      }

      router.push(`/attempts/${res.data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-400">
        Loading questions...
      </div>
    );

  if (!currentQuestion)
    return (
      <div className="p-10 text-center text-slate-400">
        No questions found
      </div>
    );

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <Navbar />

      <main className="max-w-3xl mx-auto py-10 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-3">{assessment?.title}</h1>
          <p className="text-slate-500 mb-6">{assessment?.description}</p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-500 rounded-md text-sm border border-red-100">
              {error}
            </div>
          )}

          {assessment?.duration && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
              <FontAwesomeIcon icon={faClock} />
              {assessment.duration} Minutes Remaining
            </div>
          )}
        </header>

        {/* QUESTION CARD */}
        <Card className="relative pt-8">
          <span className="absolute top-4 left-4 text-xs font-black text-blue-500 uppercase">
            Question {currentQuestion.question_number || currentIndex + 1} / {questions.length}
          </span>

          <h3 className="text-lg font-bold mb-6">
            {currentQuestion.question_text}
          </h3>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt, oIdx) => (
              <label
                key={opt.id ?? oIdx}
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion.question_id] === oIdx
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.question_id}`}
                  checked={
                    answers[currentQuestion.question_id] === oIdx
                  }
                  onChange={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.question_id]: oIdx,
                    }))
                  }
                  className="w-5 h-5 text-blue-600"
                />

                <span className="font-medium text-slate-700">
                  {opt.label || ["A", "B", "C", "D", "E", "F"][oIdx]}. {opt.text}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* NAVIGATION */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            onClick={() =>
              setCurrentIndex((prev) => Math.max(prev - 1, 0))
            }
            disabled={currentIndex === 0}
            icon={faArrowLeft}
          >
            Previous
          </Button>

          <div className="text-sm text-slate-500">
            {currentIndex + 1} / {questions.length}
          </div>

          {currentIndex < questions.length - 1 ? (
            <Button
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(prev + 1, questions.length - 1)
                )
              }
              icon={faArrowRight}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={submitting}
              icon={faCheckCircle}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit
            </Button>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}