import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Button } from '../components/Button';
import { CheckCircle, Trophy, Target, Play, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { GAMES } from '../constants';

interface StudentDashboardProps {
  user: User;
}

interface Goal {
  id: string;
  label: string;
  done: boolean;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [loadingGoals, setLoadingGoals] = useState(true);

  const [recommendedGame, setRecommendedGame] = useState<any>(null);
  const [weakestSkill, setWeakestSkill] = useState<string>('');
  const [loadingRec, setLoadingRec] = useState(true);

  // 1. FETCH & MANAGE GOALS
  useEffect(() => {
    fetchGoals();
    fetchRecommendation();
  }, [user.id]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('student_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoadingGoals(false);
    }
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    try {
      const { data, error } = await supabase
        .from('student_goals')
        .insert([{ user_id: user.id, label: newGoal, done: false }])
        .select()
        .single();

      if (error) throw error;
      setGoals([data, ...goals]);
      setNewGoal('');
    } catch (err) {
      console.error('Error adding goal:', err);
    }
  };

  const toggleGoal = async (id: string, currentStatus: boolean) => {
    try {
      setGoals(goals.map(g => g.id === id ? { ...g, done: !currentStatus } : g));
      const { error } = await supabase
        .from('student_goals')
        .update({ done: !currentStatus })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Error updating goal:', err);
      fetchGoals();
    }
  };

  const deleteGoal = async (id: string) => {
    if (!window.confirm("Remove this goal?")) return;
    try {
      setGoals(goals.filter(g => g.id !== id));
      await supabase.from('student_goals').delete().eq('id', id);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. RECOMMENDATION ENGINE
  const fetchRecommendation = async () => {
    try {
      const { data: results } = await supabase
        .from('game_results')
        .select('game_id, score')
        .eq('student_id', user.id);

      if (!results || results.length === 0) {
        setRecommendedGame(GAMES[0]);
        setWeakestSkill('Start your journey');
        setLoadingRec(false);
        return;
      }

      const totals: Record<string, number> = {};
      const counts: Record<string, number> = {};

      results.forEach(r => {
        const game = GAMES.find(g => g.id === r.game_id);
        if (game?.metrics) {
          Object.entries(game.metrics).forEach(([skill, weight]) => {
            totals[skill] = (totals[skill] || 0) + r.score;
            counts[skill] = (counts[skill] || 0) + 1;
          });
        }
      });

      let minScore = 101;
      let weakSkill = '';

      Object.keys(totals).forEach(skill => {
        const avg = totals[skill] / counts[skill];
        if (avg < minScore) {
          minScore = avg;
          weakSkill = skill;
        }
      });

      if (weakSkill) {
        setWeakestSkill(weakSkill);
        const bestGame = GAMES.find(g => 
          g.metrics && (g.metrics as any)[weakSkill] && (g.metrics as any)[weakSkill] >= 0.4
        );
        setRecommendedGame(bestGame || GAMES[0]);
      } else {
        setRecommendedGame(GAMES[0]);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRec(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          
          {/* --- CONDITIONAL AVATAR RENDERING --- */}
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm bg-gray-100" 
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-indigo-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-500">Ready to unlock some new skills today?</p>
            <div className="mt-2 flex gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 uppercase tracking-wide">
                {user.role}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <Button onClick={() => navigate('/games')}>
             <span className="flex items-center gap-2"><Play size={18} /> Play Games</span>
           </Button>
           <Button variant="outline" onClick={() => navigate('/performance')}>
             <span className="flex items-center gap-2"><Trophy size={18} /> My Progress</span>
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* GOALS SECTION (Unchanged logic) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="text-indigo-600" /> My Goals
          </h2>
          
          <form onSubmit={addGoal} className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Add a new goal..." 
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
            {loadingGoals ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-400"/></div>
            ) : goals.length === 0 ? (
              <p className="text-center text-gray-400 text-sm mt-8">No goals set yet. Add one above!</p>
            ) : (
              goals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                  <div 
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => toggleGoal(goal.id, goal.done)}
                  >
                    {goal.done ? (
                      <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span className={`${goal.done ? 'text-gray-400 line-through' : 'text-gray-700'} font-medium text-sm break-all`}>
                      {goal.label}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RECOMMENDATIONS SECTION (Unchanged logic) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="text-yellow-500" /> Recommended for You
          </h2>

          <div className="space-y-4 flex-1">
            {loadingRec ? (
               <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
            ) : recommendedGame ? (
              <div 
                className="group cursor-pointer p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:border-indigo-300 hover:shadow-md transition-all flex gap-4 items-center"
                onClick={() => navigate(`/game/${recommendedGame.id}/intro`)}
              >
                <img src={recommendedGame.thumbnail} className="w-20 h-20 rounded-lg object-cover shadow-sm" alt="Game" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full uppercase">
                      Boost {weakestSkill}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 text-lg">
                    {recommendedGame.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{recommendedGame.description}</p>
                </div>
              </div>
            ) : null}
            
             <div 
              className="group cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all flex gap-4 items-center mt-4"
              onClick={() => navigate('/performance')}
            >
              <div className="w-16 h-16 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0">
                <Trophy size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-teal-600">Full Skill Report</h3>
                <p className="text-sm text-gray-500">
                  See your analytics and badges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};