'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar/Navbar';
import { Button } from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faGraduationCap, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <section className="text-center py-20 flex flex-col items-center gap-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-tight tracking-tighter">
            Smart Assessments <br /> 
            <span className="text-blue-600">Simplified.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Transform your learning materials into interactive assessments instantly. 
            The most powerful platform for educators and students to track real-time progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            {user ? (
              <Button className="px-10 py-4 text-lg shadow-xl shadow-blue-100 w-full sm:w-auto" onClick={() => router.push('/dashboard')} icon={faArrowRight}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button className="px-10 py-4 text-lg shadow-xl shadow-blue-100 w-full sm:w-auto" onClick={() => router.push('/register')}>
                  Create Free Account
                </Button>
                <Button variant="secondary" className="px-10 py-4 text-lg w-full sm:w-auto" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
              </>
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity">
              <FontAwesomeIcon icon={faChalkboardTeacher} size="10x" />
            </div>
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-2xl">
              <FontAwesomeIcon icon={faChalkboardTeacher} />
            </div>
            <h3 className="text-2xl font-bold mb-4">For Educators</h3>
            <p className="text-slate-500 text-lg leading-relaxed">
              Upload your lecture notes in PDF format. Our platform automatically generates 
              high-quality multiple choice questions, saving you hours of manual work.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity">
              <FontAwesomeIcon icon={faGraduationCap} size="10x" />
            </div>
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 text-2xl">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <h3 className="text-2xl font-bold mb-4">For Students</h3>
            <p className="text-slate-500 text-lg leading-relaxed">
              Test your knowledge with personalized assessments. Get instant feedback on your 
              performance and review detailed explanations for every answer.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
