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
      <main className="max-w-7xl mx-auto py-8 px-4">
        {user?.role === 'LECTURER' ? <LecturerDashboard /> : <StudentDashboard />}
      </main>
    </ProtectedRoute>
  );
}
