import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '../components/Button';
import { Download, Loader2, Trophy } from 'lucide-react'; // Removed Share2
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { GAMES, INITIAL_RADAR_DATA, SkillCategory } from '../constants';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PerformanceProps {
  studentEmail?: string | null;
}

export const Performance: React.FC<PerformanceProps> = ({ studentEmail }) => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(INITIAL_RADAR_DATA);
  const [loading, setLoading] = useState(true);
  const [topSkill, setTopSkill] = useState('Undiscovered');
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let targetUserId = '';

        if (studentEmail) {
          const { data: studentProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', studentEmail)
            .single();
          if (studentProfile) targetUserId = studentProfile.id;
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) targetUserId = user.id;
        }

        if (!targetUserId) {
          setLoading(false);
          return;
        }

        const { data: results, error } = await supabase
          .from('game_results')
          .select('game_id, score');

        if (error) throw error;

        if (results && results.length > 0) {
          calculateSkillScores(results);
          setTotalGamesPlayed(results.length);
        }

      } catch (err) {
        console.error("Error loading performance data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentEmail]);

  const calculateSkillScores = (results: any[]) => {
    const totals: Record<SkillCategory, number> = {
      Practical: 0, Creative: 0, Analytical: 0, Technical: 0, Social: 0
    };
    const counts: Record<SkillCategory, number> = {
      Practical: 0, Creative: 0, Analytical: 0, Technical: 0, Social: 0
    };

    results.forEach((result) => {
      const gameDef = GAMES.find(g => g.id === result.game_id);
      if (gameDef && gameDef.metrics) {
        Object.entries(gameDef.metrics).forEach(([skill, weight]) => {
          const cat = skill as SkillCategory;
          totals[cat] += result.score;
          counts[cat] += 1;
        });
      }
    });

    const processedData = Object.keys(totals).map(key => {
      const k = key as SkillCategory;
      const avg = counts[k] > 0 ? Math.round(totals[k] / counts[k]) : 0;
      return {
        subject: key,
        A: avg,
        fullMark: 100
      };
    });

    setChartData(processedData);

    const best = processedData.reduce((prev, current) => (prev.A > current.A) ? prev : current);
    if (best.A > 0) {
      setTopSkill(best.subject);
    }
  };

  // --- PDF DOWNLOAD FUNCTION ---
  const handleDownloadPDF = async () => {
    const element = document.getElementById('performance-report');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Skill_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Could not generate PDF. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" /></div>;
  }

  return (
    <div id="performance-report" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Analysis Report</h1>
          <p className="text-gray-500">Based on {totalGamesPlayed} game sessions</p>
        </div>
        
        {/* Buttons - Only Download PDF remains */}
        <div className="flex gap-2" data-html2canvas-ignore="true">
          <Button onClick={handleDownloadPDF}>
            <Download size={16} className="mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RADAR CHART SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
           <h3 className="text-lg font-bold text-gray-900 mb-6">Holistic Skill Profile</h3>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                 <PolarGrid stroke="#9ca3af" strokeDasharray="4 4" />
                 <PolarAngleAxis 
                   dataKey="subject" 
                   tick={{ fill: '#111827', fontSize: 13, fontWeight: 800 }} 
                 />
                 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                 <Radar
                   name="Student"
                   dataKey="A"
                   stroke="#4f46e5"
                   strokeWidth={4}
                   fill="#6366f1"
                   fillOpacity={0.7}
                 />
                 <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                 />
               </RadarChart>
             </ResponsiveContainer>
           </div>
           {totalGamesPlayed === 0 && (
             <p className="text-red-500 text-sm mt-2">No data yet. Play games to generate your profile!</p>
           )}
        </div>

        {/* INSIGHTS PANEL */}
        <div className="space-y-6">
           {/* Top Skill Card */}
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg">
             <div className="flex items-start justify-between">
               <div>
                 <p className="text-indigo-200 text-sm font-medium mb-1">Dominant Skill Set</p>
                 <h2 className="text-3xl font-bold">{topSkill} Intelligence</h2>
                 <p className="mt-2 text-indigo-100 text-sm opacity-90 max-w-xs">
                   You show exceptional natural ability in this area based on your recent performance.
                 </p>
               </div>
               <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                 <Trophy size={32} className="text-yellow-300" />
               </div>
             </div>
           </div>

           {/* Detailed Breakdown */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-4">Detailed Breakdown</h3>
             <div className="space-y-4">
               {chartData.sort((a,b) => b.A - a.A).slice(0, 5).map((item, i) => (
                 <div key={i}>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-gray-700">{item.subject} Skills</span>
                     <span className="text-indigo-600 font-bold">{item.A}%</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2">
                     <div 
                        className={`h-2 rounded-full ${
                          item.A > 80 ? 'bg-green-500' : 
                          item.A > 50 ? 'bg-indigo-500' : 
                          'bg-yellow-500'
                        }`} 
                        style={{ width: `${item.A}%` }}
                     ></div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};