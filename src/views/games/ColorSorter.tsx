// src/views/games/ColorSorter.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';

export const ColorSorter = ({ onEnd }: { onEnd: (score: number) => void }) => {
  const [score, setScore] = useState(0);
  const [currentItem, setCurrentItem] = useState<'red' | 'blue'>('red');
  const [itemsLeft, setItemsLeft] = useState(10);

  // Randomize next item
  const nextItem = () => {
    if (itemsLeft <= 0) {
      onEnd(score * 10);
      return;
    }
    setItemsLeft(prev => prev - 1);
    setCurrentItem(Math.random() > 0.5 ? 'red' : 'blue');
  };

  const handleSort = (binColor: 'red' | 'blue') => {
    if (binColor === currentItem) {
      setScore(s => s + 1); // Correct
    }
    nextItem();
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
      <div className="text-xl font-bold text-gray-700">Items Left: {itemsLeft}</div>
      
      {/* The Conveyor Item */}
      <div className={`w-24 h-24 rounded-full shadow-lg transition-all transform hover:scale-110 
        ${currentItem === 'red' ? 'bg-red-500' : 'bg-blue-500'}`} 
      />

      <div className="flex gap-8 w-full">
        <Button onClick={() => handleSort('red')} className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
          Red Bin
        </Button>
        <Button onClick={() => handleSort('blue')} className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
          Blue Bin
        </Button>
      </div>
    </div>
  );
};