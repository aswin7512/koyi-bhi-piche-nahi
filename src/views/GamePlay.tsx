import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GAMES } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Import ALL Game Components
import { PatternWeaver } from './games/PatternWeaver';
import { ColorSorter } from './games/ColorSorter';
import { DesktopRanger } from './games/DesktopRanger';
import { GiftWrapper } from './games/GiftWrapper';
import { RecipeBuilder } from './games/RecipeBuilder';

export const GamePlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = GAMES.find(g => g.id === id);
  const [saving, setSaving] = useState(false);

  // --- SAVE TO DATABASE FUNCTION ---
  const handleGameEnd = async (finalScore: number, timeTaken: number) => {
    setSaving(true);
    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && id) {
        // 2. Insert Result
        const { error } = await supabase
          .from('game_results')
          .insert([
            {
              student_id: user.id,
              game_id: id,
              score: finalScore,
              time_taken: timeTaken
            }
          ]);

        if (error) throw error;
      }
      
      // 3. Navigate to Result Page
      navigate(`/game/${id}/result`, { 
        state: { score: finalScore, timer: timeTaken } 
      });

    } catch (err) {
      console.error("Error saving score:", err);
      alert("Failed to save score due to network error. Proceeding to results.");
      navigate(`/game/${id}/result`, { state: { score: finalScore, timer: timeTaken } });
    } finally {
      setSaving(false);
    }
  };

  if (!game) return <div>Game not found</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 p-4 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center text-white mb-8">
        <button onClick={() => navigate('/games')} className="flex items-center hover:text-indigo-400 transition-colors">
          <ArrowLeft className="mr-2" /> Exit Activity
        </button>
        <h2 className="text-2xl font-bold tracking-wide">{game.title}</h2>
        <div className="w-24"></div> {/* Spacer */}
      </div>

      {/* Game Container */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center p-8 relative">
        
        {saving ? (
          <div className="text-center animate-fade-in">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Performance...</h3>
            <p className="text-gray-500 font-medium">Saving your results to the cloud.</p>
          </div>
        ) : (
          // Render the correct game component based on ID
          <div className="w-full flex justify-center animate-fade-in">
            {id === 'pattern-weaver' && <PatternWeaver onEnd={handleGameEnd} />}
            {id === 'color-sorter' && <ColorSorter onEnd={handleGameEnd} />}
            {id === 'desktop-ranger' && <DesktopRanger onEnd={handleGameEnd} />}
            {id === '3d-gift-wrapper' && <GiftWrapper onEnd={handleGameEnd} />}
            {id === 'recipe-builder' && <RecipeBuilder onEnd={handleGameEnd} />}
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="mt-8 text-gray-400 text-center max-w-lg bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
        <p className="text-xs uppercase tracking-widest mb-2 font-bold text-indigo-400">Task Objective</p>
        <p className="text-sm leading-relaxed">{game.description}</p>
      </div>
    </div>
  );
};