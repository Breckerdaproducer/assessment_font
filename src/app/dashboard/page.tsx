'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { LecturerDashboard } from '@/components/Dashboard/LecturerDashboard';
import { StudentDashboard } from '@/components/Dashboard/StudentDashboard';
import { Navbar } from '@/components/Navbar/Navbar';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        {user?.role === 'LECTURER' ? <LecturerDashboard /> : <StudentDashboard />}
      </main>
    </ProtectedRoute>
  );
}
