import React, { useEffect, useState } from 'react';
import { Users, Search, Loader2, Calendar, Gamepad2, TrendingUp, Trophy, ArrowRight, User as UserIcon, Activity } from 'lucide-react'; // Added Activity
import { supabase } from '../lib/supabaseClient';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../constants';

interface AdminDashboardProps {
  user: User;
}

interface StudentProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  school?: string;
  class_grade?: string;
  avatar_url?: string;
  disability_category?: string; // <--- Added this field
}

interface GameResult {
  id: string;
  game_id: string;
  score: number;
  created_at: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Student Details State
  const [studentStats, setStudentStats] = useState({ totalGames: 0, avgScore: 0, highestScore: 0 });
  const [studentGames, setStudentGames] = useState<GameResult[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // 1. Fetch ALL Students on Load
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'student') 
          .order('full_name', { ascending: true });

        if (error) throw error;
        setStudents(data || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  // 2. Fetch Game Data when a Student is Selected
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!selectedStudentEmail) return;
      
      setLoadingDetails(true);
      try {
        const student = students.find(s => s.email === selectedStudentEmail);
        if (!student) return;

        const { data: results, error } = await supabase
          .from('game_results')
          .select('*')
          .eq('student_id', student.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (results && results.length > 0) {
          setStudentGames(results);
          const total = results.length;
          const sum = results.reduce((acc, curr) => acc + curr.score, 0);
          const highest = Math.max(...results.map(r => r.score));
          
          setStudentStats({
            totalGames: total,
            avgScore: Math.round(sum / total),
            highestScore: highest
          });
        } else {
          setStudentGames([]);
          setStudentStats({ totalGames: 0, avgScore: 0, highestScore: 0 });
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchStudentDetails();
  }, [selectedStudentEmail, students]);

  // Helpers
  const getGameDetails = (gameId: string) => {
    return GAMES.find(g => g.id === gameId) || { title: 'Unknown Game', thumbnail: '' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredStudents = students.filter(student => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (student.full_name || '').toLowerCase().includes(term);
    const emailMatch = (student.email || '').toLowerCase().includes(term);
    return nameMatch || emailMatch;
  });

  const selectedStudent = students.find(s => s.email === selectedStudentEmail);

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600"/></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Portal</h1>
          <p className="text-gray-500">Manage students and track performance</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Student List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Users size={18} /> Student List
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">{filteredStudents.length}</span>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {filteredStudents.length === 0 ? (
              <p className="text-center text-gray-400 mt-10 text-sm">No students found.</p>
            ) : (
              filteredStudents.map((student) => (
                <div 
                  key={student.id}
                  onClick={() => setSelectedStudentEmail(student.email)}
                  className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    selectedStudentEmail === student.email 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {student.avatar_url ? (
                    <img src={student.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover bg-indigo-100" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        selectedStudentEmail === student.email ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                      {(student.full_name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">
                      {student.full_name || 'Unnamed Student'}
                    </p>
                    <p className={`text-xs truncate ${
                      selectedStudentEmail === student.email ? 'text-indigo-200' : 'text-gray-400'
                    }`}>
                      {student.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Detailed Report */}
        <div className="lg:col-span-2">
          {selectedStudentEmail && selectedStudent ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex flex-col">
              
              {/* 1. Student Header & Stats */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    {selectedStudent.avatar_url ? (
                      <img src={selectedStudent.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold border-4 border-white shadow-sm">
                        {selectedStudent.full_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedStudent.full_name}</h2>
                      <p className="text-sm text-gray-500">{selectedStudent.school || 'School Info Pending'}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedStudent.class_grade && (
                           <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                             {selectedStudent.class_grade}
                           </span>
                        )}
                        
                        {/* --- NEW: Disability Category Badge (Teacher View) --- */}
                        {selectedStudent.disability_category && (
                          <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                            <Activity size={10} /> {selectedStudent.disability_category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/performance', { state: { studentEmail: selectedStudent.email } })}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 px-4 py-2 rounded-lg hover:shadow-sm transition-all"
                  >
                    <Trophy size={16} /> Full Analytics <ArrowRight size={14} />
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-100 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Assessments</p>
                      <p className="text-xl font-bold text-gray-900">{studentStats.totalGames}</p>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Gamepad2 size={20} />
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Average Score</p>
                      <p className={`text-xl font-bold ${studentStats.avgScore >= 80 ? 'text-green-600' : 'text-indigo-600'}`}>
                        {studentStats.avgScore}%
                      </p>
                    </div>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 2. Assessment History List */}
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" /> Recent Activity
                </h3>

                {loadingDetails ? (
                   <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-300" /></div>
                ) : studentGames.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                    <Gamepad2 size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">No games played yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {studentGames.map((result) => {
                      const game = getGameDetails(result.game_id);
                      return (
                        <div key={result.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group">
                          <div className="flex items-center gap-3">
                            <img 
                              src={game.thumbnail} 
                              alt="" 
                              className="w-10 h-10 rounded-lg object-cover bg-gray-200"
                            />
                            <div>
                              <p className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{game.title}</p>
                              <p className="text-xs text-gray-500">{formatDate(result.created_at)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <span className={`text-sm font-bold px-2 py-1 rounded ${
                               result.score >= 80 ? 'bg-green-100 text-green-700' : 
                               result.score >= 50 ? 'bg-blue-100 text-blue-700' : 
                               'bg-yellow-100 text-yellow-700'
                             }`}>
                               {result.score}%
                             </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          ) : (
            // Empty State
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl h-[600px] flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <UserIcon size={32} className="text-gray-300" />
              </div>
              <p className="font-medium text-gray-600">Select a student</p>
              <p className="text-sm mt-1 opacity-60">View detailed performance report</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};