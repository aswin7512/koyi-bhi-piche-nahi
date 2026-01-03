import React, { useState } from 'react';
import { GAMES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export const GameList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = GAMES.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    game.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose an Activity</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Explore our collection of gamified assessments designed to discover your unique talents.</p>
      </div>

      <div className="max-w-2xl mx-auto mb-12 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg shadow-sm"
          placeholder="Search for games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGames.map((game) => (
          <div 
            key={game.id} 
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            onClick={() => navigate(`/game/${game.id}/intro`)}
          >
            <div className="relative h-48 overflow-hidden">
              <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-medium">Play Now &rarr;</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
              <p className="text-gray-600 mb-4 flex-1 line-clamp-3">{game.description}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">Target Sector</p>
                <p className="text-sm text-gray-800">{game.targetSector}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};