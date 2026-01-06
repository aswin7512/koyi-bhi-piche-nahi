import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabaseClient'; 
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
import { ProfileSettings } from './views/ProfileSettings';
import { User } from './types';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- HELPER: CHECK PROFILE COMPLETION ---
const isProfileComplete = (user: User): boolean => {
  // 1. Only enforce strict profiles for Students
  if (user.role !== 'student') return true;
  
  // 2. Check for MANDATORY fields
  return !!(
    user.school && 
    user.class_grade && 
    user.gender && 
    user.dob && 
    user.parent_contact && 
    user.address
  );
};

// --- PROTECTED ROUTE GATEKEEPER ---
const ProtectedRoute = ({ 
  user, 
  children,
  requireProfile = true 
}: { 
  user: User | null; 
  children: React.ReactNode;
  requireProfile?: boolean;
}) => {
  // 1. Not Logged In? -> Go to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged In BUT Incomplete Profile?
  // We only redirect if this specific route REQUIRES a profile.
  if (requireProfile && !isProfileComplete(user)) {
    return <Navigate to="/profile-settings" replace />;
  }

  // 3. All Good -> Show Page
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
           <a href="#/login" className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">Get Started</a>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 

  const checkUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
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
            role: profile.role,
            school: profile.school,
            class_grade: profile.class_grade,
            gender: profile.gender,
            dob: profile.dob,
            blood_group: profile.blood_group,
            parent_contact: profile.parent_contact,
            address: profile.address,
            avatar_url: profile.avatar_url
          });
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setUser(null);
      } else {
        checkUser();
      }
    });
    return () => subscription.unsubscribe();
  }, [checkUser]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const getDashboard = () => {
    if (!user) return <Navigate to="/login" />;
    switch (user.role) {
      case 'teacher': return <AdminDashboard user={user} />; 
      case 'parent': return <ParentDashboard user={user} />;
      case 'student': return <StudentDashboard user={user} />;
      default: return <StudentDashboard user={user} />;
    }
  };

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
          
          <Route 
            path="/profile-settings" 
            element={
              <ProtectedRoute user={user} requireProfile={false}>
                <ProfileSettings user={user!} onProfileUpdate={checkUser} />
              </ProtectedRoute>
            } 
          />
          
          {/* UPDATED DASHBOARD ROUTE:
            requireProfile={false} -> Means they can land here WITHOUT a complete profile.
          */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user} requireProfile={false}>
                {getDashboard()}
              </ProtectedRoute>
            } 
          />
          
          {/* STRICT ROUTES:
            These still have requireProfile={true} (by default).
            If a user clicks "Games" from the dashboard, they will be blocked here
            and sent to settings if their profile is incomplete.
          */}
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