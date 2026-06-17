'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faPlus, faGraduationCap, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgjt6cAwZKD5MHyrkWwCdB3-eiCiv8rgGjOf61a8DzXJu-GYQsfwSHNAA&s" 
            alt="Assessly Logo" 
            width={40} 
            height={40}
            className="w-10 h-10 object-contain rounded-md"
          />
          <span className="text-2xl font-bold text-blue-600">Assessly</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
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

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-600 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className="font-medium text-slate-600 p-2 hover:bg-slate-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              {user.role === 'LECTURER' && (
                 <Link 
                   href="/assessments/new" 
                   className="font-medium text-slate-600 p-2 hover:bg-slate-50 rounded flex items-center gap-2"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   <FontAwesomeIcon icon={faPlus} className="text-xs" />
                   New Assessment
                 </Link>
              )}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between px-2">
                <span className="font-semibold text-sm">{user.firstName}</span>
                <Button variant="ghost" onClick={() => { logout(); setIsMenuOpen(false); }} className="p-2 text-red-500">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="font-medium text-slate-600 p-2 hover:bg-slate-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Button onClick={() => { router.push('/register'); setIsMenuOpen(false); }} className="w-full">
                Register
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
