// src/views/GamePlay.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GAMES } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';

// Import your new game components
import { PatternWeaver } from './games/PatternWeaver';
import { ColorSorter } from './games/ColorSorter';
import { DesktopRanger } from './games/DesktopRanger';

export const GamePlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = GAMES.find(g => g.id === id);

  // This function handles the game over state
  const handleGameEnd = (finalScore: number) => {
    // Navigate to results passing the score
    navigate(`/game/${id}/result`, { 
      state: { 
        score: finalScore, 
        timer: '0:45' // You can pass real timer if you track it
      } 
    });
  };

  if (!game) return <div>Game not found</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 p-4 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center text-white mb-8">
        <button onClick={() => navigate('/games')} className="flex items-center hover:text-indigo-400">
          <ArrowLeft className="mr-2" /> Exit Activity
        </button>
        <h2 className="text-2xl font-bold">{game.title}</h2>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Dynamic Game Container */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center p-8 relative">
        
        {/* Render the correct game based on ID */}
        {id === 'pattern-weaver' && <PatternWeaver onEnd={handleGameEnd} />}
        {id === 'color-sorter' && <ColorSorter onEnd={handleGameEnd} />}
        {id === 'desktop-ranger' && <DesktopRanger onEnd={handleGameEnd} />}

        {/* Fallback for games not yet implemented */}
        {!['pattern-weaver', 'color-sorter', 'desktop-ranger'].includes(id || '') && (
          <div className="text-center">
            <p className="text-gray-500 mb-4">This simulation is under construction.</p>
            <Button onClick={() => handleGameEnd(100)}>Simulate Pass</Button>
          </div>
        )}
      </div>

      {/* Instructions Footer */}
      <div className="mt-8 text-gray-400 max-w-2xl text-center">
        <p>Instructions: {game.description}</p>
      </div>

    </div>
  );
};