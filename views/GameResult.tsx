import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Star, Clock, Trophy, ArrowRight } from 'lucide-react';

export const GameResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, timer } = location.state || { score: 1250, timer: 45 };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="inline-flex p-4 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <Trophy className="text-yellow-300 w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Great Job!</h1>
          <p className="text-indigo-100">You've completed the assessment.</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100">
               <p className="text-gray-500 text-sm mb-2 uppercase tracking-wide">Final Score</p>
               <p className="text-4xl font-bold text-indigo-600">{score}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100">
               <p className="text-gray-500 text-sm mb-2 uppercase tracking-wide">Time Taken</p>
               <p className="text-4xl font-bold text-indigo-600">{timer}s</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-gray-900">Skills Analyzed:</h3>
            <div className="flex flex-wrap gap-2">
              {['Precision', 'Focus', 'Decision Making'].map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
             <Button variant="outline" fullWidth onClick={() => navigate('/games')}>
               Play Another
             </Button>
             <Button fullWidth onClick={() => navigate('/performance')}>
               See Detailed Report <ArrowRight size={18} className="ml-2" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};