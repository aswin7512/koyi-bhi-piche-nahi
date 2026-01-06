import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '../types';
import { Button } from '../components/Button';
import { Trophy, Calendar, TrendingUp, Gamepad2, User as UserIcon, Loader2, AlertCircle, Save, Link as LinkIcon, ArrowRight } from 'lucide-react'; // Added ArrowRight
import { GAMES } from '../constants';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface ParentDashboardProps {
  user: User;
}

interface StudentProfile {
  id: string;
  full_name: string;
  school: string;
  class_grade: string;
  avatar_url: string;
  email: string;
}

interface GameResult {
  id: string;
  game_id: string;
  score: number;
  created_at: string;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ user }) => {
  const navigate = useNavigate(); // Hook for navigation
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  
  const [childProfile, setChildProfile] = useState<StudentProfile | null>(null);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [stats, setStats] = useState({ totalGames: 0, avgScore: 0, highestScore: 0 });

  const [inputEmail, setInputEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user.linked_student_email) {
      fetchChildData(user.linked_student_email);
    } else {
      fetchParentProfile();
    }
  }, [user]);

  const fetchParentProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('linked_student_email')
        .eq('id', user.id)
        .single();

      if (profile && profile.linked_student_email) {
        fetchChildData(profile.linked_student_email);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchChildData = async (studentEmail: string) => {
    setLoading(true);
    try {
      const { data: student, error: studentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', studentEmail)
        .single();

      if (studentError || !student) {
        throw new Error('Child profile not found. Check the email or ask them to register.');
      }

      setChildProfile(student);

      const { data: results, error: resultsError } = await supabase
        .from('game_results')
        .select('*')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });

      if (resultsError) throw resultsError;

      if (results && results.length > 0) {
        setGameResults(results);
        const total = results.length;
        const sum = results.reduce((acc, curr) => acc + curr.score, 0);
        const highest = Math.max(...results.map(r => r.score));
        
        setStats({
          totalGames: total,
          avgScore: Math.round(sum / total),
          highestScore: highest
        });
      } else {
        setGameResults([]);
      }

    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail) return;
    setLinking(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ linked_student_email: inputEmail.trim() })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Child linked successfully!' });
      fetchChildData(inputEmail.trim());
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLinking(false);
    }
  };

  const getGameDetails = (gameId: string) => {
    return GAMES.find(g => g.id === gameId) || { title: 'Unknown Game', thumbnail: '' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;
  }

  // --- VIEW 1: LINK CHILD FORM ---
  if (!childProfile && !loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="text-indigo-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Your Child's Account</h2>
          <p className="text-gray-500 mb-6">
            Enter the email address your child uses to log in. We'll fetch their progress automatically.
          </p>
          <form onSubmit={handleLinkChild} className="max-w-md mx-auto space-y-4">
            <input 
              type="email" 
              placeholder="e.g. child@gmail.com" 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              required
            />
            {message.text && (
              <div className={`p-3 rounded-lg text-sm flex items-center justify-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                <AlertCircle size={16} /> {message.text}
              </div>
            )}
            <Button fullWidth type="submit" disabled={linking}>
              {linking ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
              Save & View Progress
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 2: DASHBOARD ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
           <p className="text-gray-500">Monitoring progress for: <span className="font-bold text-indigo-600">{childProfile?.full_name}</span></p>
        </div>
        
        {/* --- BUTTON TO PERFORMANCE PAGE --- */}
        <Button 
          onClick={() => navigate('/performance', { state: { studentEmail: childProfile?.email } })}
          className="shadow-md"
        >
          <Trophy size={18} className="mr-2" />
          View Full Skill Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            {childProfile?.avatar_url ? (
              <img src={childProfile.avatar_url} alt="Child" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50 mb-4" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-4xl mb-4 border-4 border-white shadow-sm">
                {childProfile?.full_name?.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{childProfile?.full_name}</h2>
            <p className="text-gray-500">{childProfile?.school}</p>
            <p className="text-indigo-600 font-medium text-sm mt-1">{childProfile?.class_grade}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-1">
                 <Gamepad2 size={16} /> Total Games
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalGames}</div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-1">
                 <TrendingUp size={16} /> Avg Score
              </div>
              <div className={`text-3xl font-bold ${stats.avgScore >= 80 ? 'text-green-600' : stats.avgScore >= 50 ? 'text-indigo-600' : 'text-yellow-600'}`}>
                {stats.avgScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-900 flex items-center gap-2">
               <Calendar className="text-indigo-600" size={20} /> Assessment History
             </h3>
             {/* Small Link to Full Report as well */}
             <button 
               onClick={() => navigate('/performance', { state: { studentEmail: childProfile?.email } })}
               className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1"
             >
               Full Analysis <ArrowRight size={14} />
             </button>
          </div>
          
          <div className="space-y-4">
            {gameResults.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Gamepad2 size={48} className="mx-auto mb-3 opacity-20" />
                <p>No games played yet.</p>
              </div>
            ) : (
              gameResults.map((result) => {
                const game = getGameDetails(result.game_id);
                return (
                  <div key={result.id} className="flex items-center justify-between p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                      <img 
                        src={game.thumbnail || 'https://via.placeholder.com/50'} 
                        alt="Game" 
                        className="w-14 h-14 rounded-lg object-cover bg-gray-200"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{game.title}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={10} /> {formatDate(result.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 50 ? 'text-indigo-600' : 'text-yellow-600'}`}>
                        {result.score}%
                      </div>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">Score</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};