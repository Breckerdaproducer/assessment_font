'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Assessment } from '@/types';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faClock, faFileAlt } from '@fortawesome/free-solid-svg-icons';

export function LecturerDashboard() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchAssessments = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const res = await response.json();
      
      if (!response.ok) {
        setError(res.message);
        return;
      }
      
      setAssessments(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handlePublish = async (id: string) => {
    const token = localStorage.getItem('token');
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments/${id}/publish`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const res = await response.json();
      
      if (!response.ok) {
        setError(res.message);
        return;
      }
      
      fetchAssessments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    const token = localStorage.getItem('token');
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const res = await response.json();
      
      if (!response.ok) {
        setError(res.message);
        return;
      }
      
      fetchAssessments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Assessments</h1>
          <p className="text-slate-500">Manage and publish your created assessments.</p>
        </div>
        <Button icon={faPlus} onClick={() => router.push('/assessments/new')}>
          Create New
        </Button>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-lg border border-red-100 text-sm font-medium">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading assessments...</div>
      ) : assessments.length === 0 ? (
        <Card className="text-center py-20 flex flex-col items-center gap-4">
          <FontAwesomeIcon icon={faFileAlt} size="3x" className="text-slate-200" />
          <p className="text-slate-500 text-lg">You haven't created any assessments yet.</p>
          <Button variant="secondary" onClick={() => router.push('/assessments/new')}>
            Get Started
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((a) => (
            <Card key={a.id} className="flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div>
                <h3 className="text-lg font-bold mb-2">{a.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{a.description || 'No description provided.'}</p>
                <div className="flex justify-between items-center text-xs font-semibold mb-6">
                  <span className="flex items-center gap-1 text-slate-400">
                    <FontAwesomeIcon icon={faClock} />
                    {(a as any).duration_minutes || a.duration ? `${(a as any).duration_minutes || a.duration} mins` : 'No limit'}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${(a.isPublished || (a as any).is_published) ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {(a.isPublished || (a as any).is_published) ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {(a.isPublished || (a as any).is_published) ? (
                   <Button variant="secondary" className="flex-1 text-xs" onClick={() => router.push(`/assessments/${a.id}/participants`)}>
                    View Results
                  </Button>
                ) : (
                  <Button variant="secondary" className="flex-1 text-xs" onClick={() => handlePublish(a.id)}>
                    Publish
                  </Button>
                )}
                <Button variant="danger" className="text-xs" onClick={() => handleDelete(a.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
