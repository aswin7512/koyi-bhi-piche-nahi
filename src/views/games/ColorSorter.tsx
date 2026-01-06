import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';

export const ColorSorter = ({ onEnd }: { onEnd: (score: number, time: number) => void }) => {
  const [score, setScore] = useState(0);
  const [itemsLeft, setItemsLeft] = useState(10);
  const [currentItem, setCurrentItem] = useState<'red' | 'blue'>('red');
  const [startTime] = useState(Date.now());

  const nextItem = () => {
    if (itemsLeft <= 1) {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      // Score calculation: (Correct Items / Total) * 100
      // Since we just increment score, let's normalize it to 100
      const finalScore = Math.min(100, (score + 1) * 10); 
      onEnd(finalScore, timeTaken);
    } else {
      setItemsLeft(prev => prev - 1);
      setCurrentItem(Math.random() > 0.5 ? 'red' : 'blue');
    }
  };

  const handleSort = (color: 'red' | 'blue') => {
    if (color === currentItem) setScore(s => s + 1);
    nextItem();
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div className="text-xl font-bold text-gray-700">Items Left: {itemsLeft}</div>
      
      <div className={`w-32 h-32 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 border-4 border-white
        ${currentItem === 'red' ? 'bg-red-500' : 'bg-blue-500'}`} 
      />

      <div className="flex gap-4 w-full">
        <Button onClick={() => handleSort('red')} className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 py-8">
          RED BIN
        </Button>
        <Button onClick={() => handleSort('blue')} className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 py-8">
          BLUE BIN
        </Button>
      </div>
    </div>
  );
};