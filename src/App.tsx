import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabaseClient'; // <--- IMPORT SUPABASE
import { Navbar } from './components/Navbar';
import { Login } from './views/Login';
import { StudentDashboard } from './views/StudentDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { ParentDashboard } from './views/ParentDashboard';
import { GameList } from './views/GameList';
import { GameArea } from './views/GameArea';
import { GamePlay } from './views/GamePlay';
import { GameResult } from './views/GameResult';
import { Performance } from './views/Performance';
import { Support } from './views/Support';
import { Register } from './views/Register';
import { User } from './types'; // Removed UserRole enum import if you switched to string types

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Wrapper
const ProtectedRoute = ({ 
  user, 
  children 
}: { 
  user: User | null; 
  children: React.ReactNode 
}) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const LandingPage = () => {
  return (
    <div className="relative">
      <div className="h-[500px] w-full relative">
        <img 
          src="cover.jpg" 
          alt="Hands joining" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
           <div className="text-center bg-white/90 p-8 rounded-md max-w-2xl mx-4">
              <h1 className="text-4xl md:text-5xl font-bold text-red-700 mb-2">koyi bhi piche nahi</h1>
              <p className="text-xl md:text-2xl text-gray-800 font-medium font-serif italic">Everyone can shine</p>
           </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Hidden Talents</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Our platform uses engaging games to identify skill sets in stitching, packaging, computer tasks, sorting, and more. We believe everyone has a path to success.
        </p>
        <div className="flex justify-center gap-4">
           {/* Changed to Link for faster navigation */}
           <a href="#/login" className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">Get Started</a>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // 1. Check for active session on load
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch the user's role from the 'profiles' table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              name: profile.full_name,
              email: profile.email,
              role: profile.role
            });
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setUser(null);
      }
      // Note: We rely on the initial fetch or the Login component to set the user
      // so we don't fetch profile redundantly here
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Sign out from Supabase
    setUser(null);
  };

  // Determine dashboard based on role
  // Note: Updated cases to match Supabase strings ('teacher', 'student', etc.)
  const getDashboard = () => {
    if (!user) return <Navigate to="/login" />;
    
    switch (user.role) {
      case 'teacher':
        return <AdminDashboard />;
      case 'parent':
        return <ParentDashboard user={user} />;
      case 'student':
        return <StudentDashboard user={user} />;
      default:
        return <StudentDashboard user={user} />;
    }
  };

  // Don't render anything until we know if the user is logged in
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
        <Navbar user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute user={user}>{getDashboard()}</ProtectedRoute>} />
          
          {/* Shared Routes */}
          <Route path="/games" element={<ProtectedRoute user={user}><GameList /></ProtectedRoute>} />
          <Route path="/game/:id/intro" element={<ProtectedRoute user={user}><GameArea /></ProtectedRoute>} />
          <Route path="/game/:id/play" element={<ProtectedRoute user={user}><GamePlay /></ProtectedRoute>} />
          <Route path="/game/:id/result" element={<ProtectedRoute user={user}><GameResult /></ProtectedRoute>} />
          <Route path="/performance" element={<ProtectedRoute user={user}><Performance /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute user={user}><Support /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;