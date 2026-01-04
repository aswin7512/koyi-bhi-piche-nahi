// src/views/games/PatternWeaver.tsx
import React, { useState } from 'react';

export const PatternWeaver = ({ onEnd }: { onEnd: (score: number) => void }) => {
  const [activeDot, setActiveDot] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  // The pattern coordinates (star shape)
  const dots = [
    { x: 150, y: 50 },  // 0: Top
    { x: 200, y: 200 }, // 1: Bottom Right
    { x: 50, y: 100 },  // 2: Left
    { x: 250, y: 100 }, // 3: Right
    { x: 100, y: 200 }, // 4: Bottom Left
  ];

  const handleDotClick = (index: number) => {
    if (index === activeDot) {
      // Correct click
      if (activeDot === dots.length - 1) {
        onEnd(100 - (mistakes * 10)); // Finish!
      } else {
        setActiveDot(prev => prev + 1);
      }
    } else {
      // Wrong click
      setMistakes(prev => prev + 1);
    }
  };

  return (
    <div className="relative w-[300px] h-[300px] bg-white rounded-xl shadow-inner border border-gray-200 mx-auto">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Draw lines for completed connections */}
        {dots.map((dot, i) => {
          if (i >= activeDot) return null;
          const nextDot = dots[i + 1];
          if (!nextDot) return null;
          return (
            <line key={i} x1={dot.x} y1={dot.y} x2={nextDot.x} y2={nextDot.y} stroke="#4f46e5" strokeWidth="4" />
          );
        })}
      </svg>
      
      {dots.map((dot, i) => (
        <button
          key={i}
          onClick={() => handleDotClick(i)}
          className={`absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all 
            ${i < activeDot ? 'bg-indigo-600' : i === activeDot ? 'bg-green-500 animate-pulse ring-4 ring-green-200' : 'bg-gray-300'}
          `}
          style={{ left: dot.x, top: dot.y }}
        />
      ))}
      <p className="absolute bottom-2 w-full text-center text-gray-400 text-xs">Tap the flashing dot</p>
    </div>
  );
};