'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar/Navbar';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
  faArrowLeft,
  faUserGraduate,
  faCalendarAlt,
  faCheckCircle,
  faClock,
  faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';

export default function AssessmentParticipantsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [assessment, setAssessment] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [assessRes, partRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments/${id}/participants`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const assessData = await assessRes.json();
        const partData = await partRes.json();

        if (!assessRes.ok) throw new Error(assessData.message);
        if (!partRes.ok) throw new Error(partData.message);

        setAssessment(assessData.data);
        setParticipants(partData.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleExport = async () => {
    setExporting(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments/${id}/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `results_${assessment?.title?.replace(/\s+/g, '_') || 'assessment'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading participants...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="text-red-500 text-5xl mb-4">
             <FontAwesomeIcon icon={faCircleExclamation} />
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard')} >
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );

  return (
    <ProtectedRoute allowedRoles={['LECTURER']}>
      <Navbar />
      <main className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Button variant="secondary" onClick={() => router.push('/dashboard')} icon={faArrowLeft} className="mb-4">
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              {assessment?.title}
            </h1>
            <p className="text-slate-500 font-medium">Participants and Results</p>
          </div>

          <Button 
            onClick={handleExport} 
            isLoading={exporting} 
            icon={faFileExcel}
            className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100"
          >
            Export to Excel
          </Button>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
              <FontAwesomeIcon icon={faUserGraduate} />
            </div>
            <div>
              <div className="text-2xl font-black">{participants.length}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Participants</div>
            </div>
          </Card>
          
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div>
              <div className="text-2xl font-black">
                {participants.length > 0 
                  ? (participants.reduce((acc, p) => acc + (p.score / p.total_questions), 0) / participants.length * 100).toFixed(1)
                  : 0}%
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Average Score</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center text-xl">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div>
              <div className="text-2xl font-black">{(assessment?.duration_minutes || assessment?.duration) || 0}m</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Duration</div>
            </div>
          </Card>
        </div>

        {/* PARTICIPANTS TABLE */}
        <Card className="p-0 overflow-hidden border-none shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Percentage</th>
                  <th className="px-6 py-4 text-right">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-medium">
                      No students have completed this assessment yet.
                    </td>
                  </tr>
                ) : (
                  participants.map((p) => {
                    const totalQ = p.total_questions || 1;
                    const percentage = Math.round((p.score / totalQ) * 100);
                    return (
                      <tr key={p.attempt_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{p.first_name} {p.last_name}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{p.email}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">
                          {p.score} / {totalQ}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${
                            percentage >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-400 text-sm">
                          <div className="flex items-center justify-end gap-2">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-[10px]" />
                            {p.submitted_at ? new Date(p.submitted_at).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </ProtectedRoute>
  );
}
