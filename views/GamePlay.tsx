import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GAMES } from '../constants';
import { Button } from '../components/Button';
import { Volume2, Eye, RefreshCcw, XCircle } from 'lucide-react';

export const GamePlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = GAMES.find(g => g.id === id);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t + 1);
      // Simulate score increasing
      setScore(s => s + Math.floor(Math.random() * 10));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFinish = () => {
    navigate(`/game/${id}/result`, { state: { score, timer } });
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-800 p-4 flex flex-col items-center justify-center">
      
      {/* Main Game Card */}
      <div className="max-w-6xl w-full bg-white rounded-xl overflow-hidden shadow-2xl border-4 border-gray-300 flex flex-col md:flex-row h-auto md:h-[600px]">
        
        {/* Left Control Panel */}
        <div className="w-full md:w-64 bg-gray-100 p-6 flex flex-col justify-between border-r border-gray-300">
          <div>
            <h3 className="font-bold text-gray-700 uppercase tracking-widest text-xs mb-4">Controls</h3>
            <div className="space-y-4">
              <button className="flex items-center gap-3 w-full p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-all">
                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600"><Volume2 size={20} /></div>
                <span className="font-medium text-gray-700">Audio Hints</span>
              </button>
              
              <button className="flex items-center gap-3 w-full p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-all">
                <div className="p-2 bg-teal-100 rounded-full text-teal-600"><Eye size={20} /></div>
                <span className="font-medium text-gray-700">Visual Guide</span>
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium">Task:</p>
              <p className="text-sm text-yellow-900 mt-1">{game.description}</p>
            </div>
          </div>
        </div>

        {/* Center Game Area (Placeholder) */}
        <div className="w-full md:flex-1 bg-gray-50 relative group h-[500px] md:h-auto">
           {/* This simulates the game canvas */}
           <div className="absolute inset-0 flex items-center justify-center p-8">
                <img 
                  src={game.image} 
                  alt="Game Asset" 
                  className="max-w-full max-h-full object-contain bg-white border-2 border-dashed border-gray-300 rounded-xl shadow-sm" 
                />
           </div>
           
           {/* Simulated Cursor or Tool */}
           <div className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-indigo-500 rounded-full pointer-events-none opacity-50" />
        </div>


        {/* Right Stats Panel */}
        <div className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
           <div>
             <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-8">Live Stats</h3>
             
             <div className="space-y-8">
               <div>
                 <p className="text-gray-400 text-xs uppercase mb-1">Current Score</p>
                 <p className="text-4xl font-mono font-bold text-green-400">{score}</p>
               </div>
               
               <div>
                 <p className="text-gray-400 text-xs uppercase mb-1">Time Elapsed</p>
                 <p className="text-2xl font-mono text-white">{timer}s</p>
               </div>

               <div>
                 <p className="text-gray-400 text-xs uppercase mb-1">Attempts</p>
                 <p className="text-xl font-mono text-white">3/5</p>
               </div>
             </div>
           </div>

           <Button variant="secondary" onClick={() => setScore(0)}>
             <RefreshCcw size={16} className="mr-2" /> Restart
           </Button>
        </div>
      </div>

      <div className="mt-8">
          <Button onClick={handleFinish} className="shadow-lg animate-bounce">
            Simulate Complete
          </Button>
      </div>
    </div>
  );
};