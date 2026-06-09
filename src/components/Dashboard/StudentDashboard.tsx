'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Assessment, Attempt } from '@/types';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faEye, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export function StudentDashboard() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [assessRes, attemptsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/attempts`, { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);
        
        const assessData = await assessRes.json();
        const attemptsData = await attemptsRes.json();

        if (!assessRes.ok) {
            setError(assessData.message);
            return;
        }
        if (!attemptsRes.ok) {
            setError(attemptsData.message);
            return;
        }

        setAssessments(assessData.data.filter((a: Assessment) => a.is_published));
        setAttempts(attemptsData.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-lg border border-red-100 text-sm font-medium">
          Error: {error}
        </div>
      )}

      <section>
        <div className="flex items-center gap-2 mb-6">
          <FontAwesomeIcon icon={faPlay} className="text-blue-600" />
          <h2 className="text-2xl font-bold">Available Assessments</h2>
        </div>
        {loading ? (
          <div className="text-slate-400">Loading assessments...</div>
        ) : assessments.length === 0 ? (
          <Card className="text-center py-10 text-slate-500">No assessments available right now.</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((a) => (
              <Card key={a.id} className="flex flex-col border-l-4 border-l-blue-600">
                <h3 className="text-lg font-bold mb-1">{a.title}</h3>
                <p className="text-slate-500 text-sm mb-4 flex-1">{a.description}</p>
                <div className="text-xs font-semibold text-slate-400 mb-4 flex items-center gap-1">
                   <FontAwesomeIcon icon={faClock} />
                   {a.duration ? `${a.duration} mins` : 'No time limit'}
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => router.push(`/assessments/${a.id}/take`)}
                >
                  Start Now
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
          <h2 className="text-2xl font-bold">My Previous Attempts</h2>
        </div>
        {loading ? (
          <div className="text-slate-400 text-center py-10">Loading attempts...</div>
        ) : attempts.length === 0 ? (
          <Card className="text-center py-10 text-slate-500">You haven't taken any assessments yet.</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attempts.map((att) => {
              const total = (att as any).total_questions || att.total_questions;
              const title = (att as any).assessment_title || att.assessment?.title;
              const percentage = total > 0 ? Math.round((att.score / total) * 100) : 0;
              
              return (
                <Card key={att.id} className="border-l-4 border-l-green-500">
                  <h3 className="text-lg font-bold mb-2 truncate">{title || 'Assessment'}</h3>
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-bold uppercase">Score</span>
                      <span className="text-lg font-black text-slate-800">{att.score} / {total}</span>
                    </div>
                    <div className={`text-xl font-black ${percentage >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                      {percentage}%
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => router.push(`/attempts/${att.id}`)}
                    icon={faEye}
                  >
                    View Review
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
