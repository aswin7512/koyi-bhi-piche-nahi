import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { MOCK_RADAR_DATA } from '../constants';
import { Button } from '../components/Button';
import { Download, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Performance: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Talent Identification Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/support')}><Share2 size={16} className="mr-2" /> Get Support</Button>
          <Button><Download size={16} className="mr-2" /> Download Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Radar Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Skill Radar Chart</h3>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_RADAR_DATA}>
                 <PolarGrid />
                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                 <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                 <Radar
                   name="Student"
                   dataKey="A"
                   stroke="#4f46e5"
                   strokeWidth={2}
                   fill="#6366f1"
                   fillOpacity={0.4}
                 />
               </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Text Stats Section */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-4">Top Strength Areas</h3>
             <div className="space-y-4">
               {MOCK_RADAR_DATA.sort((a,b) => b.A - a.A).slice(0, 3).map((item, i) => (
                 <div key={i}>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-gray-700">{item.subject}</span>
                     <span className="text-indigo-600 font-bold">{Math.round((item.A / item.fullMark) * 100)}%</span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2.5">
                     <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(item.A / item.fullMark) * 100}%` }}></div>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-green-800 font-bold text-sm">Talent Category</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">Visual Learner</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-blue-800 font-bold text-sm">Best Career Fit</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">Design</p>
              </div>
           </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Recommended Activities</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Pattern Matching Puzzles (Advanced)</li>
              <li>Memory Sequence Games</li>
              <li>Spatial Reasoning Challenge</li>
            </ul>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
            <h3 className="font-bold text-gray-900 mb-4">Improvement Tips</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Practice daily for 15 minutes to improve consistency.</li>
              <li>Focus on details in the 'Pattern Weaver' game.</li>
              <li>Review mistakes in the 'Result' page after every session.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};