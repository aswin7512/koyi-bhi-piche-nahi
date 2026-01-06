import React, { useState } from 'react';
import { Button } from '../../components/Button';

export const PatternWeaver = ({ onEnd }: { onEnd: (score: number, time: number) => void }) => {
  const [activeDot, setActiveDot] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());

  // Star Pattern Coordinates
  const dots = [
    { x: 150, y: 50 },  // Top
    { x: 220, y: 220 }, // Bottom Right
    { x: 50, y: 100 },  // Left
    { x: 250, y: 100 }, // Right
    { x: 80, y: 220 },  // Bottom Left
  ];

  const handleDotClick = (index: number) => {
    if (index === activeDot) {
      if (activeDot === dots.length - 1) {
        // Game Finished
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        const finalScore = Math.max(0, 100 - (mistakes * 15)); // 15 points penalty per mistake
        onEnd(finalScore, timeTaken);
      } else {
        setActiveDot(prev => prev + 1);
      }
    } else {
      setMistakes(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[300px] bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {dots.map((dot, i) => {
            if (i >= activeDot) return null;
            const nextDot = dots[i + 1];
            if (!nextDot) return null;
            return <line key={i} x1={dot.x} y1={dot.y} x2={nextDot.x} y2={nextDot.y} stroke="#4f46e5" strokeWidth="3" />;
          })}
        </svg>
        
        {dots.map((dot, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all
              ${i < activeDot ? 'bg-indigo-600' : i === activeDot ? 'bg-green-500 animate-ping' : 'bg-gray-300'}
            `}
            style={{ left: dot.x, top: dot.y }}
          />
        ))}
      </div>
      <p className="mt-4 text-gray-500">Tap the flashing green dot!</p>
    </div>
  );
};