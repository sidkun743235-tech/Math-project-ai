import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ExamPage from './pages/ExamPage';
import ResultsPage from './pages/ResultsPage';
import { store } from '@/lib/store';
import React, { useEffect, useState } from 'react';
import { User } from '@/types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = store.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage onLogin={setUser} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />} />
        
        <Route 
          path="/admin/*" 
          element={user?.role === 'admin' ? <AdminDashboard user={user} onLogout={() => { store.setCurrentUser(null); setUser(null); }} /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/student/*" 
          element={user?.role === 'student' ? <StudentDashboard user={user} onLogout={() => { store.setCurrentUser(null); setUser(null); }} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/exam/:examId" 
          element={user?.role === 'student' ? <ExamPage user={user} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/results/:resultId" 
          element={user ? <ResultsPage user={user} /> : <Navigate to="/login" />} 
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}
