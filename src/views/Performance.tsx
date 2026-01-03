import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Button } from '../components/Button';
import { Download, Share2, Loader2 } from 'lucide-react'; // Added Loader2
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Default empty state for the chart
const INITIAL_RADAR_DATA = [
  { subject: 'Creative', A: 0, fullMark: 100 },
  { subject: 'Analytical', A: 0, fullMark: 100 },
  { subject: 'Technical', A: 0, fullMark: 100 },
  { subject: 'Social', A: 0, fullMark: 100 },
  { subject: 'Practical', A: 0, fullMark: 100 },
];

interface PerformanceProps {
  studentEmail?: string | null; // Optional prop for Parent Dashboard
}

export const Performance: React.FC<PerformanceProps> = ({ studentEmail }) => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(INITIAL_RADAR_DATA);
  const [loading, setLoading] = useState(true);
  const [topCareer, setTopCareer] = useState('Explore Games');
  const [talentType, setTalentType] = useState('Undiscovered');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let targetUserId = '';

        // 1. Determine whose data to fetch
        if (studentEmail) {
          // Case A: Parent viewing Child -> Get Child's ID from email
          const { data: studentProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', studentEmail)
            .single();
            
          if (studentProfile) targetUserId = studentProfile.id;
        } else {
          // Case B: Student viewing Self -> Get own ID
          const { data: { user } } = await supabase.auth.getUser();
          if (user) targetUserId = user.id;
        }

        if (!targetUserId) {
          setLoading(false);
          return;
        }

        // 2. Fetch Game Results for this user
        const { data: results, error } = await supabase
          .from('game_results')
          .select('*')
          .eq('student_id', targetUserId);

        if (error) throw error;

        if (results && results.length > 0) {
          processGameData(results);
        }

      } catch (err) {
        console.error("Error loading performance data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentEmail]);

  // Helper: Convert raw DB rows into Radar Chart format
  const processGameData = (results: any[]) => {
    // 1. Create a map to store total scores per category
    // Note: In a real app, you'd map specific 'game_names' to categories.
    // For this prototype, we will simulate distribution based on the 'recommended_career' text.
    
    const stats = {
      Creative: 0,
      Analytical: 0,
      Technical: 0,
      Social: 0,
      Practical: 0
    };
    const counts = { ...stats };

    results.forEach((row) => {
      // Logic: If game result says "Creative", boost Creative score
      // You can make this smarter later!
      let category: keyof typeof stats = 'Practical'; // Default
      
      if (row.recommended_career?.includes('Design') || row.recommended_career?.includes('Art')) category = 'Creative';
      else if (row.recommended_career?.includes('Engineer') || row.recommended_career?.includes('Code')) category = 'Technical';
      else if (row.recommended_career?.includes('Puzzle') || row.recommended_career?.includes('Logic')) category = 'Analytical';
      else if (row.recommended_career?.includes('Teacher') || row.recommended_career?.includes('Nurse')) category = 'Social';

      // Add score (assuming row.score is out of 100)
      stats[category] += row.score || 0;
      counts[category] += 1;
    });

    // 2. Calculate Averages
    const processedData = Object.keys(stats).map(key => {
      const k = key as keyof typeof stats;
      return {
        subject: key,
        A: counts[k] > 0 ? Math.round(stats[k] / counts[k]) : 0, // Average
        fullMark: 100
      };
    });

    setChartData(processedData);

    // 3. Find Top Skill
    const best = processedData.reduce((prev, current) => (prev.A > current.A) ? prev : current);
    if (best.A > 0) {
      setTopCareer(best.subject + ' Specialist');
      setTalentType(best.subject + ' Learner');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" /></div>;
  }

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
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                 <PolarGrid />
                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
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
               {chartData.sort((a,b) => b.A - a.A).slice(0, 3).map((item, i) => (
                 <div key={i}>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-gray-700">{item.subject}</span>
                     <span className="text-indigo-600 font-bold">{item.A}%</span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2.5">
                     <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${item.A}%` }}></div>
                   </div>
                 </div>
               ))}
               {chartData.every(d => d.A === 0) && (
                 <p className="text-gray-500 text-sm italic">Play games to reveal your strengths!</p>
               )}
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-green-800 font-bold text-sm">Talent Category</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{talentType}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-blue-800 font-bold text-sm">Best Career Fit</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{topCareer}</p>
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
              <li>Try the "Pattern Master" game to boost Analytical skills.</li>
              <li>Explore "Color Match" for Creative development.</li>
              <li>Attempt "Memory Maze" to improve Technical focus.</li>
            </ul>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
            <h3 className="font-bold text-gray-900 mb-4">Improvement Tips</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Consistency is key: Play 10 mins daily.</li>
              <li>Don't worry about speed; focus on accuracy first.</li>
              <li>Review your results here after every 3 games.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};