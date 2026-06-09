'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faPlus, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <FontAwesomeIcon icon={faGraduationCap} />
          Assessly
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className="font-medium text-slate-600 hover:text-blue-600 transition">Dashboard</Link>
              {user.role === 'LECTURER' && (
                 <Link href="/assessments/new" className="font-medium text-slate-600 hover:text-blue-600 transition flex items-center gap-1">
                   <FontAwesomeIcon icon={faPlus} className="text-xs" />
                   New Assessment
                 </Link>
              )}
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <span className="font-semibold text-sm">{user.firstName}</span>
                <Button variant="ghost" onClick={logout} className="p-2">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="font-medium text-slate-600 hover:text-blue-600 transition">Login</Link>
              <Button onClick={() => router.push('/register')}>Register</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
