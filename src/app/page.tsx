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
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-20 pb-20 relative">
        {/* Blurred Background Image */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[600px] -z-10 overflow-hidden opacity-20">
          <div 
            className="w-full h-full bg-cover bg-center blur-[100px] scale-110"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop")' }}
          />
        </div>

        <section className="grid lg:grid-cols-2 gap-12 items-center py-20 relative">
          <div className="flex flex-col items-start gap-8 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold tracking-wide border border-blue-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              AI-POWERED PLATFORM
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              Smart Assessments <br /> 
              <span className="text-blue-600 italic">Simplified.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
              Transform your learning materials into interactive assessments instantly. 
              The most powerful platform for educators and students to track real-time progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-700">
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-400">Joined by 10,000+ educators</p>
            </div>
          </div>

          <div className="relative z-10 group">
            {/* Main Hero Image */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white transition-all duration-700 group-hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                alt="Students collaborating" 
                className="w-full h-full object-cover aspect-[4/3] opacity-95 group-hover:opacity-100 transition-opacity"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
            </div>

            {/* Floating Live Indicator Image */}
            <div className="absolute -bottom-10 -left-10 bg-white p-2 rounded-[2rem] border border-slate-200 shadow-2xl flex items-center gap-4 animate-bounce hover:animate-none transition-all duration-500 cursor-default group/card max-w-[280px]">
              <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop" 
                  alt="Student focus" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pr-4">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Live Assessment</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">Physics Quiz 101 in progress...</p>
              </div>
            </div>
            
            {/* Background Glows */}
            <div className="absolute -inset-10 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-[100px] -z-10 opacity-50" />
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
