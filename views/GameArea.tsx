import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GAMES } from '../constants';
import { Button } from '../components/Button';
import { PlayCircle, Info, Clock, ArrowLeft } from 'lucide-react';

export const GameArea: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = GAMES.find(g => g.id === id);

  if (!game) return <div>Game not found</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Visual Side */}
        <div className="md:w-1/2 bg-indigo-900 relative min-h-[300px] md:min-h-full">
          <img src={game.thumbnail} alt={game.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/90 flex flex-col justify-end p-8">
            <button 
              onClick={() => navigate('/games')}
              className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{game.title}</h1>
            <p className="text-indigo-200">{game.targetSector}</p>
          </div>
        </div>

        {/* Content Side */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="text-indigo-600" /> Instructions
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {game.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <Clock className="text-indigo-600 mb-2" />
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-bold text-gray-900">3-5 Mins</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <Info className="text-indigo-600 mb-2" />
                <p className="text-sm text-gray-500">Skills</p>
                <p className="font-bold text-gray-900">{game.skills[0]}</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => navigate(`/game/${id}/play`)}
            className="w-full py-4 text-lg shadow-lg shadow-indigo-200"
          >
            <span className="flex items-center justify-center gap-2">
              <PlayCircle size={24} /> Start Game
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};