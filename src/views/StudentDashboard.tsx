import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Button } from '../components/Button';
import { CheckCircle, Trophy, Target, Play } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img 
            src={`https://picsum.photos/seed/${user.name}/200`} 
            alt="Profile" 
            className="w-24 h-24 rounded-full border-4 border-indigo-50 object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">Class 5-B • Age: 12</p>
            <div className="mt-2 flex gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Mild Learning Disability
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <Button onClick={() => navigate('/games')}>
             <span className="flex items-center gap-2"><Play size={18} /> Start New Assessment</span>
           </Button>
           <Button variant="outline" onClick={() => navigate('/performance')}>
             <span className="flex items-center gap-2"><Trophy size={18} /> View Progress</span>
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Goals Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="text-indigo-600" /> My Goals
          </h2>
          <div className="space-y-4">
             {[
               { label: 'Improve Hand-Eye Coordination', done: true },
               { label: 'Complete 3 Memory Games', done: false },
               { label: 'Sort 50 Items correctly', done: false },
               { label: 'Follow 3-step Instructions', done: true },
             ].map((goal, idx) => (
               <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                 {goal.done ? (
                   <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0" />
                 ) : (
                   <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
                 )}
                 <span className={`${goal.done ? 'text-gray-400 line-through' : 'text-gray-700'} font-medium`}>
                   {goal.label}
                 </span>
               </div>
             ))}
          </div>
        </div>

        {/* Recent Activity / Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended for You</h2>
          <div className="space-y-4">
            <div 
              className="group cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all flex gap-4"
              onClick={() => navigate('/games')}
            >
              <img src="https://picsum.photos/id/20/100/100" className="w-16 h-16 rounded-lg object-cover" alt="Game" />
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600">Pattern Weaver</h3>
                <p className="text-sm text-gray-500">Improve your precision skills.</p>
              </div>
            </div>
            
             <div 
              className="group cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all flex gap-4"
              onClick={() => navigate('/support')}
            >
              <div className="w-16 h-16 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                <Trophy size={32} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-teal-600">Skill Report</h3>
                <p className="text-sm text-gray-500">See your latest achievements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};